import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";

const originalPath =
  "./Give Your Agent a Brain_ ADK, MCP, & Persistent Memory - Guests - pending_approval - 2026-07-16-06-09-23.csv";
const scoredPath = "./out/full-agents-2026-07-16/scored.csv";
const outDir = "./out/professionals-only";
mkdirSync(outDir, { recursive: true });

const original = parse(readFileSync(originalPath, "utf8"), {
  columns: true,
  skip_empty_lines: true,
  relax_column_count: true,
  trim: true,
  bom: true,
}) as Array<Record<string, string>>;

const scored = parse(readFileSync(scoredPath, "utf8"), {
  columns: true,
  skip_empty_lines: true,
  relax_column_count: true,
  trim: true,
}) as Array<Record<string, string>>;

const roleByEmail = new Map<string, string>();
for (const r of original) {
  const email = (r.email || "").toLowerCase();
  if (email) roleByEmail.set(email, (r["Are you?"] || "").trim());
}

function isProfessional(email: string): boolean {
  return roleByEmail.get(email.toLowerCase()) === "Professional";
}

const scoredPros = scored
  .filter((r) => isProfessional(r.email || ""))
  .map((r) => ({
    ...r,
    are_you: roleByEmail.get((r.email || "").toLowerCase()) || "",
  }))
  .sort((a, b) => Number(b.decision_score) - Number(a.decision_score));

const alreadyAcceptedPros = scoredPros.filter((r) => r.decision === "accept");
const remainingPros = scoredPros.filter((r) => r.decision !== "accept");
// next best professionals not yet accepted (up to 70, or however many exist)
const nextPros = remainingPros.slice(0, 70);

const originalPros = original.filter(
  (r) => (r["Are you?"] || "").trim() === "Professional",
);
const originalProsRemaining = originalPros.filter((r) => {
  const email = (r.email || "").toLowerCase();
  const row = scored.find((s) => (s.email || "").toLowerCase() === email);
  return row?.decision !== "accept";
});

writeFileSync(
  path.join(outDir, "all-professionals-scored.csv"),
  stringify(scoredPros, { header: true }),
);
writeFileSync(
  path.join(outDir, "professionals-already-accepted.csv"),
  stringify(alreadyAcceptedPros, { header: true }),
);
writeFileSync(
  path.join(outDir, "professionals-next-to-accept.csv"),
  stringify(
    nextPros.map((r, i) => ({
      wave_rank: i + 1,
      suggested_decision: "accept",
      ...r,
    })),
    { header: true },
  ),
);
writeFileSync(
  path.join(outDir, "professionals-remaining-luma.csv"),
  stringify(originalProsRemaining, { header: true }),
);

writeFileSync(
  path.join(outDir, "emails-professionals-all.txt"),
  scoredPros.map((r) => r.email).join("\n") + "\n",
);
writeFileSync(
  path.join(outDir, "emails-professionals-accepted.txt"),
  alreadyAcceptedPros.map((r) => r.email).join("\n") + "\n",
);
writeFileSync(
  path.join(outDir, "emails-professionals-next.txt"),
  nextPros.map((r) => r.email).join("\n") + "\n",
);

console.log(
  JSON.stringify(
    {
      professionalsTotal: scoredPros.length,
      alreadyAccepted: alreadyAcceptedPros.length,
      remaining: remainingPros.length,
      nextToAccept: nextPros.length,
      outDir,
    },
    null,
    2,
  ),
);
console.log("--- already accepted professionals ---");
console.log(alreadyAcceptedPros.map((r) => r.email).join("\n"));
console.log("--- next professionals to accept ---");
console.log(nextPros.map((r) => r.email).join("\n"));
