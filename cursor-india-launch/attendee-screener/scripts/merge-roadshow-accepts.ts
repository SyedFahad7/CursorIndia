/**
 * After batches finish, merge accept emails from out/job-* roadshow runs
 * and/or scored.csv files under out/roadshow-hyderabad if present.
 *
 *   pnpm exec tsx scripts/merge-roadshow-accepts.ts
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";

const OUT = "./out/roadshow-hyderabad";
const ROOT_OUT = "./out";

type Row = Record<string, string>;

function loadScored(file: string): Row[] {
  return parse(readFileSync(file, "utf8"), {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true,
    bom: true,
  }) as Row[];
}

const files: string[] = [];
for (const name of readdirSync(ROOT_OUT)) {
  if (!name.startsWith("job-") && !name.startsWith("roadshow-batch-")) continue;
  const scored = path.join(ROOT_OUT, name, "scored.csv");
  if (existsSync(scored)) files.push(scored);
}

const byEmail = new Map<string, Row>();
for (const f of files) {
  for (const r of loadScored(f)) {
    const email = (r.email || "").trim().toLowerCase();
    if (!email) continue;
    const prev = byEmail.get(email);
    if (!prev || Number(r.decision_score || 0) > Number(prev.decision_score || 0)) {
      byEmail.set(email, r);
    }
  }
}

const all = [...byEmail.values()];
const accepts = all
  .filter((r) => (r.decision || "").toLowerCase() === "accept")
  .sort(
    (a, b) => Number(b.decision_score || 0) - Number(a.decision_score || 0),
  );

mkdirSync(OUT, { recursive: true });
writeFileSync(
  `${OUT}/ACCEPTS.csv`,
  stringify(
    accepts.map((r) => ({
      name: r.name,
      email: r.email,
      decision_score: r.decision_score,
      completeness_score: r.completeness_score,
      cursor_used_likely: r.cursor_used_likely,
      github_url: r.github_url,
      linkedin_url: r.linkedin_url,
      rationale: r.rationale,
    })),
    { header: true },
  ),
);
writeFileSync(
  `${OUT}/ACCEPTS-emails.txt`,
  accepts.map((r) => r.email).join("\n") + "\n",
);
writeFileSync(
  `${OUT}/ACCEPTS-top350-emails.txt`,
  accepts
    .slice(0, 350)
    .map((r) => r.email)
    .join("\n") + "\n",
);

console.log(
  JSON.stringify(
    {
      scoredFiles: files.length,
      uniqueScreened: all.length,
      accepts: accepts.length,
      top350: Math.min(350, accepts.length),
      out: `${OUT}/ACCEPTS.csv`,
    },
    null,
    2,
  ),
);
