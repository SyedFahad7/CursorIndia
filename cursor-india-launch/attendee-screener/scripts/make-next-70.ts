import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";

const root = "./out/full-agents-2026-07-16";
const originalPath =
  "./Give Your Agent a Brain_ ADK, MCP, & Persistent Memory - Guests - pending_approval - 2026-07-16-06-09-23.csv";
const scoredPath = path.join(root, "scored.csv");
const outDir = "./out/next-70-wave2";
mkdirSync(outDir, { recursive: true });

const scored = parse(readFileSync(scoredPath, "utf8"), {
  columns: true,
  skip_empty_lines: true,
  relax_column_count: true,
  trim: true,
}) as Array<Record<string, string>>;

const accepted = new Set(
  scored
    .filter((r) => r.decision === "accept")
    .map((r) => (r.email || "").toLowerCase()),
);

const original = parse(readFileSync(originalPath, "utf8"), {
  columns: true,
  skip_empty_lines: true,
  relax_column_count: true,
  trim: true,
  bom: true,
}) as Array<Record<string, string>>;

const remaining = original.filter(
  (r) => !accepted.has((r.email || "").toLowerCase()),
);
writeFileSync(
  path.join(outDir, "remaining-guests.csv"),
  stringify(remaining, { header: true }),
);

const next70 = scored
  .filter((r) => r.decision !== "accept")
  .sort((a, b) => Number(b.decision_score) - Number(a.decision_score))
  .slice(0, 70)
  .map((r, i) => ({
    wave2_rank: i + 1,
    suggested_decision: "accept",
    prior_decision: r.decision,
    ...r,
  }));

writeFileSync(
  path.join(outDir, "next-70-to-accept.csv"),
  stringify(next70, { header: true }),
);
writeFileSync(
  path.join(outDir, "emails-next-70.txt"),
  next70.map((r) => r.email).join("\n") + "\n",
);

// Also: original Luma rows for just these 70 (handy for re-import / review)
const next70Emails = new Set(next70.map((r) => (r.email || "").toLowerCase()));
const next70Original = original.filter((r) =>
  next70Emails.has((r.email || "").toLowerCase()),
);
writeFileSync(
  path.join(outDir, "next-70-luma-rows.csv"),
  stringify(next70Original, { header: true }),
);

const byPrior: Record<string, number> = {};
for (const r of next70) {
  byPrior[r.prior_decision || "?"] = (byPrior[r.prior_decision || "?"] || 0) + 1;
}

console.log(
  JSON.stringify(
    {
      original: original.length,
      alreadyAccepted: accepted.size,
      remainingGuests: remaining.length,
      next70: next70.length,
      next70From: byPrior,
      scoreRange: {
        top: next70[0]?.decision_score,
        bottom: next70[next70.length - 1]?.decision_score,
      },
      outDir,
    },
    null,
    2,
  ),
);
console.log("--- emails ---");
console.log(next70.map((r) => r.email).join("\n"));
