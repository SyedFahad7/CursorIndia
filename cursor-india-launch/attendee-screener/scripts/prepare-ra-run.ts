/**
 * Prepare a registration-approvals run folder next to a Luma CSV.
 *
 * Community skill expects:
 *   - scripts + event_config.json + YYYY-MM-DD-HH-MM-SS.csv in one folder
 *   - api_id column (Luma sometimes exports guest_id instead)
 *
 * Usage:
 *   pnpm ra:prepare -- --csv "./Cursor × Workato.csv" --config ./registration-approvals/config/event_config.workato.example.json --name workato
 */
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";

function arg(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

function stamp(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}-${p(d.getHours())}-${p(d.getMinutes())}-${p(d.getSeconds())}`;
}

const csvPath = arg("--csv");
const configPath = arg("--config");
const name = arg("--name") || "event";

if (!csvPath || !configPath) {
  console.error(
    'Usage: pnpm ra:prepare -- --csv "./guests.csv" --config ./registration-approvals/config/event_config.workato.example.json --name workato',
  );
  process.exit(1);
}

const root = path.resolve(".");
const raRoot = path.join(root, "registration-approvals");
const runDir = path.join(raRoot, "runs", name);
mkdirSync(runDir, { recursive: true });

for (const file of [
  "score_pass1.py",
  "score_pass2.py",
  "export_decisions.py",
  "ra_config.py",
]) {
  copyFileSync(path.join(raRoot, "scripts", file), path.join(runDir, file));
}

copyFileSync(path.resolve(configPath), path.join(runDir, "event_config.json"));

const rows = parse(readFileSync(path.resolve(csvPath), "utf8"), {
  columns: true,
  skip_empty_lines: true,
  relax_column_count: true,
  bom: true,
}) as Record<string, string>[];

if (!rows.length) {
  console.error("CSV has no rows");
  process.exit(1);
}

const headers = Object.keys(rows[0]);
const hasApiId = headers.includes("api_id");
const hasGuestId = headers.includes("guest_id");

const normalized = rows.map((r) => {
  const out = { ...r };
  if (!hasApiId && hasGuestId) {
    out.api_id = r.guest_id || "";
  }
  return out;
});

const outCsv = path.join(runDir, `${stamp()}.csv`);
const columns = hasApiId
  ? headers
  : hasGuestId
    ? ["api_id", ...headers]
    : ["api_id", ...headers];

if (!hasApiId && !hasGuestId) {
  for (const r of normalized) {
    r.api_id = r.email || `row-${Math.random().toString(36).slice(2)}`;
  }
}

writeFileSync(
  outCsv,
  stringify(normalized, {
    header: true,
    columns: [...new Set(columns)],
  }),
);

console.log(
  JSON.stringify(
    {
      runDir,
      csv: path.basename(outCsv),
      rows: normalized.length,
      apiIdFrom: hasApiId ? "api_id" : hasGuestId ? "guest_id" : "email-fallback",
      next: [
        `cd "${runDir}"`,
        "pip install -r ../../requirements.txt",
        "python score_pass1.py",
        "python score_pass2.py --limit 15",
        "python score_pass2.py",
        "python export_decisions.py --confirm-reviewed",
      ],
    },
    null,
    2,
  ),
);
