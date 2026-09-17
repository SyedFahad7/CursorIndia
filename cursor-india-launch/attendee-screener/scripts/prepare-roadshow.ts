/**
 * Roadshow Pass-1: professionals only, completeness rank, batch CSVs.
 *
 *   pnpm exec tsx scripts/prepare-roadshow.ts
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";

const SRC =
  "./Cursor India Roadshow_ Hyderabad - Guests - pending.csv";
const OUT = "./out/roadshow-hyderabad";
const BATCH = 50;
const TARGET_SCREEN = 500; // screen this many top pros aiming for ~350 accepts

const Q_GH = "What is your GitHub URL?";
const Q_CO = "What company do you work for?";
const Q_TITLE = "What is your job title?";
const Q_LI = "What is your LinkedIn profile?";
const Q_X = "What is your X (Twitter) handle?";
const Q_BUILD = "What are you building with Cursor?";
const Q_ASK = "Any questions for the Cursor team?";
const Q_SHOW =
  "Would you like to showcase any cool workflows in how you use Cursor? If yes, please explain what you'd like to showcase.";

const STUDENTISH =
  /\b(student|intern(?!al)|college|university|campus|undergrad|b\.?\s*tech|engineering college|school of|12th|fresher seeking|looking for internship|niat|cmr |griet|klh|iare|mvsr|osmania|anurag|mlrit|mgit|vardhaman|geethanjali|stanley|aurora|chaitanya|kg reddy|matrusri|vignana|siddhartha|jbit|kprit|tkr |nalla narasimha|swami vivekanand|lords|scient|bit mesra|methodist|deemed to be)\b/i;

const EMPTY = /^(na|n\/a|none|no|nil|-|x|\.?|salary|company|student)?$/i;

type Row = Record<string, string>;

function filled(v: string): boolean {
  const t = (v || "").trim();
  if (!t || EMPTY.test(t)) return false;
  return t.length >= 2;
}

function isProfessional(r: Row): boolean {
  const company = (r[Q_CO] || "").trim();
  const title = (r[Q_TITLE] || "").trim();
  const blob = `${company} ${title}`;
  if (STUDENTISH.test(blob)) return false;
  if (!filled(company) && !filled(title)) return false;
  // Title-only "Student" etc.
  if (/^\s*student\b/i.test(title)) return false;
  return true;
}

function completeness(r: Row): number {
  let s = 0;
  if (filled(r[Q_GH])) s += 3;
  if (filled(r[Q_LI])) s += 2;
  if (filled(r[Q_CO])) s += 2;
  if (filled(r[Q_TITLE])) s += 2;
  if (filled(r[Q_X])) s += 1;
  const build = (r[Q_BUILD] || "").trim();
  const show = (r[Q_SHOW] || "").trim();
  const ask = (r[Q_ASK] || "").trim();
  if (build.length >= 200) s += 4;
  else if (build.length >= 80) s += 3;
  else if (build.length >= 25) s += 2;
  else if (build.length >= 8) s += 1;
  if (show.length >= 80) s += 3;
  else if (show.length >= 25) s += 2;
  else if (show.length >= 8) s += 1;
  if (ask.length >= 40) s += 1;
  // concrete builder signals
  if (
    /\b(building|built|shipping|shipped|production|deployed|cursor|agent|mcp|rag|workflow)\b/i.test(
      `${build} ${show}`,
    )
  ) {
    s += 2;
  }
  return s;
}

const rows = parse(readFileSync(SRC, "utf8"), {
  columns: true,
  skip_empty_lines: true,
  relax_column_count: true,
  trim: true,
  bom: true,
}) as Row[];

const pending = rows.filter(
  (r) => (r.approval_status || "").toLowerCase() === "pending_approval",
);

const seen = new Set<string>();
const pros: Array<Row & { _score: number }> = [];
let students = 0;
let dups = 0;

for (const r of pending) {
  const email = (r.email || "").trim().toLowerCase();
  if (!email) continue;
  if (seen.has(email)) {
    dups += 1;
    continue;
  }
  seen.add(email);
  if (!isProfessional(r)) {
    students += 1;
    continue;
  }
  pros.push({ ...r, _score: completeness(r) });
}

pros.sort(
  (a, b) =>
    b._score - a._score ||
    (a.created_at || "").localeCompare(b.created_at || ""),
);

mkdirSync(OUT, { recursive: true });
mkdirSync(`${OUT}/batches`, { recursive: true });

const toScreen = pros.slice(0, TARGET_SCREEN);
const rest = pros.slice(TARGET_SCREEN);

writeFileSync(
  `${OUT}/professionals-ranked.csv`,
  stringify(
    pros.map(({ _score, ...r }) => ({
      completeness_score: _score,
      ...r,
    })),
    { header: true },
  ),
);

writeFileSync(
  `${OUT}/to-screen-top${TARGET_SCREEN}.csv`,
  stringify(
    toScreen.map(({ _score, ...r }) => ({
      completeness_score: _score,
      ...r,
    })),
    { header: true },
  ),
);

writeFileSync(
  `${OUT}/emails-to-screen.txt`,
  toScreen.map((r) => r.email).join("\n") + "\n",
);

let batchCount = 0;
for (let i = 0; i < toScreen.length; i += BATCH) {
  batchCount += 1;
  const chunk = toScreen.slice(i, i + BATCH);
  const name = `batch-${String(batchCount).padStart(2, "0")}.csv`;
  writeFileSync(
    `${OUT}/batches/${name}`,
    stringify(
      chunk.map(({ _score, ...r }) => r),
      { header: true },
    ),
  );
}

writeFileSync(
  `${OUT}/summary.md`,
  `# Roadshow Hyderabad — Pass 1

- Pending: **${pending.length}**
- Deduped email drops: ${dups}
- Filtered student/college-ish: **${students}**
- Professionals kept: **${pros.length}**
- Queued for LLM screen (top by completeness): **${toScreen.length}** in **${batchCount}** batches of ≤${BATCH}
- Held in reserve (lower completeness): **${rest.length}**

## GitHub safety

Mass screen uses **repo list only** — no code search (\`GITHUB_CODE_SEARCH\` off).
Concurrency **1**. Cache reused across batches.

## Next

\`\`\`bash
# ensure live UI running
pnpm ui

# enqueue batch 01 (non-blocking)
pnpm enqueue -- --csv ./out/roadshow-hyderabad/batches/batch-01.csv --persona cursor-dev --concurrency 1 --event-config ./event_config.roadshow.json
\`\`\`
`,
);

console.log(
  JSON.stringify(
    {
      pending: pending.length,
      studentsFiltered: students,
      dups,
      professionals: pros.length,
      toScreen: toScreen.length,
      batches: batchCount,
      out: OUT,
      topScores: toScreen.slice(0, 5).map((r) => ({
        name: r.name,
        email: r.email,
        score: r._score,
        company: r[Q_CO],
        title: r[Q_TITLE],
      })),
    },
    null,
    2,
  ),
);
