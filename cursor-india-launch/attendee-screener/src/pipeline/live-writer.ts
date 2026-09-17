import { appendFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";
import { approvalMessageForDecision } from "../approval-message.js";
import type { ScreenedAttendee } from "../types.js";

export const CSV_COLUMNS = [
  "decision",
  "decision_score",
  "llm_recommend",
  "name",
  "email",
  "completeness_score",
  "allowlisted",
  "already_approved",
  "dup_email",
  "dup_email_keep",
  "dup_phone",
  "dup_phone_keep",
  "slop_score",
  "is_ai_slop",
  "fit_score",
  "github_builder_score",
  "cursor_used_likely",
  "cursor_signals",
  "cursor_sample_paths",
  "github_url",
  "linkedin_url",
  "x_url",
  "rationale",
  "slop_notes",
  "fit_notes",
  "red_flags",
  "heuristic_hyphens",
  "luma_approval_message",
] as const;

function recommendFromDecision(
  d: ScreenedAttendee["decision"],
): "approve" | "decline" | "" {
  if (d === "accept") return "approve";
  if (d === "reject") return "decline";
  return "";
}

export function toCsvRow(
  r: ScreenedAttendee,
): Record<(typeof CSV_COLUMNS)[number], string | number | boolean> {
  return {
    decision: r.decision,
    decision_score: r.decisionScore,
    llm_recommend: r.llmRecommend ?? recommendFromDecision(r.decision),
    name: r.attendee.name,
    email: r.attendee.email,
    completeness_score: r.completenessScore ?? "",
    allowlisted: r.allowlisted ? "true" : "false",
    already_approved: r.alreadyApproved ? "true" : "false",
    dup_email: r.dupEmail ? "true" : "false",
    dup_email_keep: r.dupEmailKeep === false ? "false" : "true",
    dup_phone: r.dupPhone ? "true" : "false",
    dup_phone_keep: r.dupPhoneKeep === false ? "false" : "true",
    slop_score: r.slop.score,
    is_ai_slop: r.slop.isAiSlop,
    fit_score: r.fit.fitScore,
    github_builder_score: r.github.builderScore,
    cursor_used_likely: r.github.cursorEvidence?.usedCursorLikely
      ? "true"
      : "false",
    cursor_signals: r.github.cursorSignals.join(" | "),
    cursor_sample_paths: (r.github.cursorEvidence?.samplePaths || [])
      .slice(0, 3)
      .join(" | "),
    github_url: r.attendee.githubUrl ?? "",
    linkedin_url: r.attendee.linkedinUrl ?? "",
    x_url: r.attendee.xUrl ?? "",
    rationale: r.rationale,
    slop_notes: r.slop.notes,
    fit_notes: r.fit.notes,
    red_flags: r.slop.redFlags.join(" | "),
    heuristic_hyphens: r.heuristics.hyphenCount + r.heuristics.emDashCount,
    luma_approval_message: approvalMessageForDecision(
      r.decision,
      r.attendee.name,
    ),
  };
}

/**
 * Appends each screened guest to scored.csv + judgments.jsonl as soon as
 * processing finishes. Writes are serialized so concurrent workers don't interleave.
 */
export class LiveResultWriter {
  readonly scoredCsv: string;
  readonly jsonl: string;
  private ready: Promise<void>;
  private queue: Promise<void> = Promise.resolve();
  private written = 0;

  constructor(
    private readonly outDir: string,
    opts: { resume?: boolean } = {},
  ) {
    this.scoredCsv = path.join(outDir, "scored.csv");
    this.jsonl = path.join(outDir, "judgments.jsonl");
    this.ready = this.init(Boolean(opts.resume));
  }

  private async init(resume: boolean): Promise<void> {
    await mkdir(this.outDir, { recursive: true });

    if (resume) {
      try {
        const existing = await readFile(this.scoredCsv, "utf8");
        if (existing.trim().length > 0) {
          // Keep existing rows; ensure jsonl exists
          try {
            await readFile(this.jsonl, "utf8");
          } catch {
            await writeFile(this.jsonl, "", "utf8");
          }
          return;
        }
      } catch {
        /* fall through to fresh */
      }
    }

    await writeFile(this.scoredCsv, CSV_COLUMNS.join(",") + "\n", "utf8");
    await writeFile(this.jsonl, "", "utf8");
  }

  async append(result: ScreenedAttendee): Promise<void> {
    await this.ready;
    this.queue = this.queue.then(async () => {
      const row = toCsvRow(result);
      const line = stringify([row], {
        header: false,
        columns: [...CSV_COLUMNS],
      });
      await appendFile(this.scoredCsv, line, "utf8");
      await appendFile(this.jsonl, JSON.stringify(result) + "\n", "utf8");
      this.written += 1;
    });
    await this.queue;
  }

  get count(): number {
    return this.written;
  }
}

/** Emails already present in an existing scored.csv (for --resume). */
export async function loadCompletedEmails(
  scoredCsvPath: string,
): Promise<Set<string>> {
  try {
    const raw = await readFile(scoredCsvPath, "utf8");
    const rows = parse(raw, {
      columns: true,
      skip_empty_lines: true,
      relax_column_count: true,
      trim: true,
    }) as Array<{ email?: string }>;
    const emails = new Set<string>();
    for (const row of rows) {
      if (row.email?.trim()) emails.add(row.email.trim().toLowerCase());
    }
    return emails;
  } catch {
    return new Set();
  }
}

/** Load full judgments from jsonl when present (best for resume final rank). */
export async function loadJudgmentsJsonl(
  jsonlPath: string,
): Promise<ScreenedAttendee[]> {
  try {
    const raw = await readFile(jsonlPath, "utf8");
    return raw
      .split(/\n/)
      .filter(Boolean)
      .map((line) => JSON.parse(line) as ScreenedAttendee);
  } catch {
    return [];
  }
}
