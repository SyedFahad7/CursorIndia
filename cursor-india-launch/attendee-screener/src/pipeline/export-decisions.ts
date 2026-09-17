import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";
import { loadEventConfig } from "../event-config.js";

/**
 * Export Luma bulk-update CSVs from scored.csv after human review.
 * Mirrors registration-approvals export_decisions.py (--confirm-reviewed).
 */
export async function exportDecisions(input: {
  scoredCsvPath: string;
  outDir?: string;
  eventConfigPath?: string;
  confirmReviewed: boolean;
}): Promise<{
  approvePath: string;
  declinePath: string;
  approve: number;
  decline: number;
  skipped: number;
  capacity?: number;
}> {
  if (!input.confirmReviewed) {
    throw new Error(
      "Refusing to export without human review.\n" +
        "  1. Open scored.csv, sort by decision_score, flip decision / llm_recommend if needed\n" +
        "  2. Re-run: pnpm export-decisions -- --out <dir> --confirm-reviewed",
    );
  }

  const { config } = await loadEventConfig(input.eventConfigPath);
  const scoredPath = path.resolve(input.scoredCsvPath);
  const outDir = path.resolve(input.outDir || path.dirname(scoredPath));

  const rows = parse(await readFile(scoredPath, "utf8"), {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true,
    bom: true,
  }) as Record<string, string>[];

  const approve: string[] = [];
  const decline: string[] = [];
  let skipped = 0;
  const seen = new Set<string>();

  for (const r of rows) {
    const email = (r.email || "").trim().toLowerCase();
    if (!email || seen.has(email)) {
      skipped += 1;
      continue;
    }
    seen.add(email);

    const allowlisted = String(r.allowlisted || "").toLowerCase() === "true";
    const alreadyApproved =
      String(r.already_approved || "").toLowerCase() === "true";
    const recommend = (r.llm_recommend || "").trim().toLowerCase();
    const decision = (r.decision || "").trim().toLowerCase();

    let bucket = "";
    if (allowlisted || alreadyApproved) bucket = "approve";
    else if (recommend === "approve" || recommend === "decline") bucket = recommend;
    else if (decision === "accept") bucket = "approve";
    else if (decision === "reject") bucket = "decline";
    // waitlist / blank → skip (manual)

    if (bucket === "approve") approve.push(email);
    else if (bucket === "decline") decline.push(email);
    else skipped += 1;
  }

  const approvePath = path.join(outDir, "approve.csv");
  const declinePath = path.join(outDir, "decline.csv");
  await writeFile(
    approvePath,
    stringify(
      approve.map((email) => ({ email })),
      { header: true, columns: ["email"] },
    ),
    "utf8",
  );
  await writeFile(
    declinePath,
    stringify(
      decline.map((email) => ({ email })),
      { header: true, columns: ["email"] },
    ),
    "utf8",
  );

  return {
    approvePath,
    declinePath,
    approve: approve.length,
    decline: decline.length,
    skipped,
    capacity: config.capacity,
  };
}
