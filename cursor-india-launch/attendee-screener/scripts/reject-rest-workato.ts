import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { parse } from "csv-parse/sync";

const SRC = "./Cursor × Workato.csv";
const ACCEPT = "./out/workato-shortlist/top-50-professionals-emails.txt";
const OUT = "./out/workato-shortlist";

const rows = parse(readFileSync(SRC, "utf8"), {
  columns: true,
  skip_empty_lines: true,
  relax_column_count: true,
}) as Record<string, string>[];

const accept = new Set(
  readFileSync(ACCEPT, "utf8")
    .split(/\r?\n/)
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean),
);

const seen = new Set<string>();
const reject: string[] = [];
let skippedApproved = 0;

for (const row of rows) {
  const email = String(row.email || "").trim();
  if (!email) continue;
  const key = email.toLowerCase();
  if (seen.has(key)) continue;
  seen.add(key);
  if (accept.has(key)) continue;

  const status = String(row.approval_status || "").toLowerCase();
  if (status === "approved") {
    skippedApproved += 1;
    continue;
  }

  reject.push(email);
}

mkdirSync(OUT, { recursive: true });
writeFileSync(`${OUT}/reject-emails.txt`, reject.join("\n") + "\n");

console.log(
  JSON.stringify(
    {
      uniqueEmails: seen.size,
      accept: accept.size,
      skippedAlreadyApproved: skippedApproved,
      reject: reject.length,
      out: `${OUT}/reject-emails.txt`,
    },
    null,
    2,
  ),
);
