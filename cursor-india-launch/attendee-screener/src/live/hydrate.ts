import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";
import { jobStore, type LiveRow } from "./jobs.js";

function parseScoredCsv(scoredPath: string): LiveRow[] {
  const rows = parse(readFileSync(scoredPath, "utf8"), {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true,
    bom: true,
  }) as Record<string, string>[];
  return rows.map((r) => ({
    decision: r.decision || "",
    decisionScore: Number(r.decision_score || 0),
    name: r.name || "",
    email: r.email || "",
    slopScore: Number(r.slop_score || 0),
    isAiSlop: String(r.is_ai_slop).toLowerCase() === "true",
    githubScore: Number(r.github_builder_score || 0),
    cursorUsedLikely: String(r.cursor_used_likely).toLowerCase() === "true",
    cursorSignals: r.cursor_signals || "",
    rationale: r.rationale || "",
    at: new Date().toISOString(),
  }));
}

function emailFromRow(r: Record<string, string>): string {
  for (const [k, v] of Object.entries(r)) {
    if (/e-?mail/i.test(k) && v) return String(v).trim().toLowerCase();
  }
  return "";
}

function buildBatchEmailIndex(root: string): Map<number, Set<string>> {
  const batchDir = path.join(root, "out", "roadshow-hyderabad", "batches");
  const map = new Map<number, Set<string>>();
  if (!existsSync(batchDir)) return map;
  for (const f of readdirSync(batchDir)) {
    const m = f.match(/^batch-(\d+)\.csv$/i);
    if (!m) continue;
    const n = Number(m[1]);
    try {
      const rows = parse(readFileSync(path.join(batchDir, f), "utf8"), {
        columns: true,
        skip_empty_lines: true,
        relax_column_count: true,
        bom: true,
      }) as Record<string, string>[];
      map.set(n, new Set(rows.map(emailFromRow).filter(Boolean)));
    } catch {
      // skip
    }
  }
  return map;
}

function matchBatchNumber(
  emails: string[],
  batchIndex: Map<number, Set<string>>,
): number | null {
  if (!emails.length || !batchIndex.size) return null;
  let bestN: number | null = null;
  let bestHit = 0;
  for (const [n, set] of batchIndex) {
    let hit = 0;
    for (const e of emails) if (set.has(e)) hit += 1;
    if (hit > bestHit) {
      bestHit = hit;
      bestN = n;
    }
  }
  if (bestN == null || bestHit < Math.max(3, Math.ceil(emails.length * 0.4))) {
    return null;
  }
  return bestN;
}

function countsFrom(rows: LiveRow[]) {
  const counts = { accept: 0, waitlist: 0, reject: 0 };
  for (const r of rows) {
    if (r.decision === "accept") counts.accept += 1;
    else if (r.decision === "waitlist") counts.waitlist += 1;
    else if (r.decision === "reject") counts.reject += 1;
  }
  return counts;
}

function batchLabel(n: number, prior = false): string {
  const base = `Batch ${String(n).padStart(2, "0")}`;
  return prior ? `${base} · prior` : base;
}

export type SyncResult = {
  added: number;
  updated: number;
  skipped: number;
  jobs: Array<{ id: string; label: string; done: number; status: string }>;
};

/**
 * Load / refresh jobs from out/job-* and out/roadshow-batch-* scored.csv files.
 * Safe to call repeatedly (CLI screening writes these while UI watches).
 */
export function syncJobsFromDisk(root: string): SyncResult {
  const outRoot = path.join(root, "out");
  const result: SyncResult = { added: 0, updated: 0, skipped: 0, jobs: [] };
  if (!existsSync(outRoot)) return result;

  const batchIndex = buildBatchEmailIndex(root);

  type Candidate = {
    name: string;
    liveRows: LiveRow[];
    mtimeMs: number;
    isRoadshow: boolean;
    /** Primary batch number for label */
    batchNum: number | null;
    prior: boolean;
  };

  const candidates: Candidate[] = [];
  const roadshowOwned = new Set<number>();

  for (const name of readdirSync(outRoot)) {
    if (
      !name.startsWith("job-") &&
      !name.startsWith("roadshow-batch-") &&
      !name.startsWith("to-approve-")
    ) {
      continue;
    }
    const scoredPath = path.join(outRoot, name, "scored.csv");
    if (!existsSync(scoredPath)) {
      result.skipped += 1;
      continue;
    }

    let liveRows: LiveRow[];
    try {
      liveRows = parseScoredCsv(scoredPath);
    } catch {
      result.skipped += 1;
      continue;
    }

    const isRoadshow = name.startsWith("roadshow-batch-");
    const isToApprove = name.startsWith("to-approve-");
    // Hide aborted / partial UI jobs — only keep near-complete screens
    if (!isRoadshow && !isToApprove && liveRows.length < 40) {
      result.skipped += 1;
      continue;
    }

    let mtimeMs = Date.now();
    try {
      mtimeMs = statSync(scoredPath).mtimeMs;
    } catch {
      // keep now
    }

    let batchNum: number | null = null;
    const road = name.match(/^roadshow-batch-(\d+)$/i);
    if (road) {
      batchNum = Number(road[1]);
      roadshowOwned.add(batchNum);
    } else if (!isToApprove) {
      const emails = liveRows.map((r) => r.email.toLowerCase()).filter(Boolean);
      batchNum = matchBatchNumber(emails, batchIndex);
    }

    candidates.push({
      name,
      liveRows,
      mtimeMs,
      isRoadshow,
      batchNum,
      prior: false,
    });
  }

  // Chronological fallback for complete job-* not matched by email
  const claimed = new Set<number>(
    candidates.filter((c) => c.batchNum != null).map((c) => c.batchNum!),
  );
  const unmatched = candidates
    .filter((c) => !c.isRoadshow && c.batchNum == null && c.liveRows.length >= 40)
    .sort((a, b) => a.mtimeMs - b.mtimeMs || a.name.localeCompare(b.name));
  let next = 1;
  for (const c of unmatched) {
    while (claimed.has(next) || roadshowOwned.has(next)) next += 1;
    c.batchNum = next;
    claimed.add(next);
    next += 1;
  }

  // If both roadshow-batch-N and job-* map to N, mark job as prior
  for (const c of candidates) {
    if (!c.isRoadshow && c.batchNum != null && roadshowOwned.has(c.batchNum)) {
      c.prior = true;
    }
  }

  for (const c of candidates) {
    const isToApprove = c.name.startsWith("to-approve-");
    const label = isToApprove
      ? "To approve (new)"
      : c.batchNum != null
        ? batchLabel(c.batchNum, c.prior)
        : `${c.name.replace(/^job-/, "").slice(0, 20)}…`;

    const counts = countsFrom(c.liveRows);
    const expected =
      c.batchNum != null && batchIndex.get(c.batchNum)
        ? batchIndex.get(c.batchNum)!.size
        : c.isRoadshow
          ? 50
          : c.liveRows.length;
    const fresh = Date.now() - c.mtimeMs < 3 * 60 * 1000;
    const incomplete = c.liveRows.length > 0 && c.liveRows.length < expected;
    const status =
      fresh && incomplete ? ("running" as const) : ("done" as const);

    const patch = {
      status,
      total: Math.max(expected, c.liveRows.length),
      done: c.liveRows.length,
      counts,
      csvName: label,
      message:
        status === "running"
          ? `Syncing from disk · ${c.liveRows.length}/${expected}`
          : `From disk · ${c.liveRows.length} rows`,
      reportUrl: `/files/${c.name}/report.md`,
      csvUrl: `/files/${c.name}/scored.csv`,
      rows: c.liveRows,
    };

    const existing = jobStore.get(c.name);
    if (!existing) {
      jobStore.create({
        id: c.name,
        persona: "hydrated",
        csvName: label,
        outDir: path.join(outRoot, c.name),
      });
      jobStore.patch(c.name, {
        ...patch,
        createdAt: new Date(c.mtimeMs || Date.now()).toISOString(),
      });
      result.added += 1;
    } else {
      if (
        existing.status === "running" &&
        !c.isRoadshow &&
        !existing.id.startsWith("roadshow-batch-") &&
        existing.done > c.liveRows.length
      ) {
        result.skipped += 1;
        continue;
      }
      jobStore.patch(c.name, patch);
      result.updated += 1;
    }

    result.jobs.push({
      id: c.name,
      label,
      done: c.liveRows.length,
      status,
    });
  }

  return result;
}
