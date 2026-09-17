import type { EventConfig } from "../event-config.js";
import { isAllowlisted } from "../event-config.js";
import type { NormalizedAttendee } from "../types.js";

const EMPTY = new Set(["", "-", ".", "n/a", "na", "none", "nil", "no", "null"]);

export type PreflightMeta = {
  completenessScore: number;
  allowlisted: boolean;
  alreadyApproved: boolean;
  dupEmail: boolean;
  dupEmailKeep: boolean;
  dupPhone: boolean;
  dupPhoneKeep: boolean;
  skipScreen: boolean;
  skipReason?: string;
};

export type PreflightedAttendee = NormalizedAttendee & {
  preflight: PreflightMeta;
};

function filled(v?: string): boolean {
  const s = (v || "").trim().toLowerCase();
  if (EMPTY.has(s)) return false;
  return s.length >= 2;
}

function normalizePhone(raw?: string): string {
  return (raw || "").replace(/[^0-9]/g, "");
}

function parseCreated(s?: string): number {
  if (!s) return Number.MAX_SAFE_INTEGER;
  const t = Date.parse(s);
  return Number.isFinite(t) ? t : Number.MAX_SAFE_INTEGER;
}

/** Completeness 0–10 from answers + profile links (RA-skill style Pass 1). */
export function completenessScore(a: NormalizedAttendee): number {
  let score = 0;
  if (filled(a.linkedinUrl)) score += 2;
  if (filled(a.githubUrl)) score += 3;
  if (filled(a.xUrl)) score += 1;
  if (filled(a.phone)) score += 1;

  const answerChars = a.answers.reduce((n, x) => n + x.answer.trim().length, 0);
  if (answerChars >= 200) score += 3;
  else if (answerChars >= 80) score += 2;
  else if (answerChars >= 20) score += 1;

  return score;
}

export function runPreflight(
  attendees: NormalizedAttendee[],
  cfg: EventConfig,
): {
  kept: PreflightedAttendee[];
  droppedDeclined: number;
  skippedDup: number;
} {
  let droppedDeclined = 0;
  const working: PreflightedAttendee[] = [];

  for (const a of attendees) {
    const status = (a.approvalStatus || "").trim().toLowerCase();
    if (cfg.dropDeclined && status === "declined") {
      droppedDeclined += 1;
      continue;
    }

    const allowlisted = isAllowlisted(a.email, cfg);
    const alreadyApproved = status === "approved";
    working.push({
      ...a,
      preflight: {
        completenessScore: completenessScore(a),
        allowlisted,
        alreadyApproved,
        dupEmail: false,
        dupEmailKeep: true,
        dupPhone: false,
        dupPhoneKeep: true,
        skipScreen: false,
      },
    });
  }

  // Dedup email — keep earliest registration (allowlisted/approved win)
  const byEmail = new Map<string, number[]>();
  working.forEach((r, i) => {
    const em = r.email.toLowerCase();
    if (!em) return;
    const list = byEmail.get(em) ?? [];
    list.push(i);
    byEmail.set(em, list);
  });

  for (const idxs of byEmail.values()) {
    if (idxs.length <= 1) continue;
    const sorted = [...idxs].sort((ia, ib) => {
      const a = working[ia]!;
      const b = working[ib]!;
      return (
        Number(b.preflight.allowlisted) - Number(a.preflight.allowlisted) ||
        Number(b.preflight.alreadyApproved) -
          Number(a.preflight.alreadyApproved) ||
        parseCreated(a.registeredAt) - parseCreated(b.registeredAt)
      );
    });
    const keep = sorted[0]!;
    for (const i of sorted) {
      working[i]!.preflight.dupEmail = true;
      working[i]!.preflight.dupEmailKeep = i === keep;
    }
  }

  // Dedup phone — keep highest completeness among allowlisted/approved
  const byPhone = new Map<string, number[]>();
  working.forEach((r, i) => {
    const ph = normalizePhone(r.phone);
    if (ph.length < 8) return;
    const list = byPhone.get(ph) ?? [];
    list.push(i);
    byPhone.set(ph, list);
  });

  for (const idxs of byPhone.values()) {
    if (idxs.length <= 1) continue;
    const sorted = [...idxs].sort((ia, ib) => {
      const a = working[ia]!;
      const b = working[ib]!;
      return (
        Number(b.preflight.allowlisted) - Number(a.preflight.allowlisted) ||
        Number(b.preflight.alreadyApproved) -
          Number(a.preflight.alreadyApproved) ||
        b.preflight.completenessScore - a.preflight.completenessScore ||
        parseCreated(a.registeredAt) - parseCreated(b.registeredAt)
      );
    });
    const keep = sorted[0]!;
    for (const i of sorted) {
      working[i]!.preflight.dupPhone = true;
      working[i]!.preflight.dupPhoneKeep = i === keep;
    }
  }

  let skippedDup = 0;
  for (const r of working) {
    const keep =
      r.preflight.dupEmailKeep && r.preflight.dupPhoneKeep;
    if (!keep) {
      r.preflight.skipScreen = true;
      r.preflight.skipReason = "duplicate email/phone (non-keep)";
      skippedDup += 1;
    } else if (r.preflight.allowlisted || r.preflight.alreadyApproved) {
      // Still mark — run may short-circuit LLM but we keep them as accept
      r.preflight.skipScreen = false;
    }
  }

  return { kept: working, droppedDeclined, skippedDup };
}

/** Demote lowest-scoring accepts over capacity to waitlist. Allowlist/approved stay. */
export function applyCapacityCap<
  T extends {
    decision: string;
    decisionScore: number;
    allowlisted?: boolean;
    alreadyApproved?: boolean;
  },
>(rows: T[], capacity?: number): T[] {
  if (!capacity || capacity < 1) return rows;
  const out = rows.map((r) => ({ ...r }));
  const protectedAccept = out.filter(
    (r) =>
      r.decision === "accept" && (r.allowlisted || r.alreadyApproved),
  );
  const softAccept = out
    .filter(
      (r) =>
        r.decision === "accept" && !r.allowlisted && !r.alreadyApproved,
    )
    .sort((a, b) => b.decisionScore - a.decisionScore);

  const slots = Math.max(0, capacity - protectedAccept.length);
  const keep = new Set(softAccept.slice(0, slots));
  for (const r of softAccept) {
    if (!keep.has(r)) {
      r.decision = "waitlist";
    }
  }
  return out;
}
