import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";

const SRC = "./Cursor × Workato-accepted.csv";
const OUT_DIR = "./out/workato-shortlist";
const OUT = `${OUT_DIR}/accepted-name-email.csv`;

const rows = parse(readFileSync(SRC, "utf8"), {
  columns: true,
  skip_empty_lines: true,
  relax_column_count: true,
}) as Record<string, string>[];

const accepted = rows
  .filter((r) => String(r.approval_status || "").toLowerCase() === "approved")
  .map((r) => ({
    name: String(r.name || "").trim(),
    email: String(r.email || "").trim(),
  }))
  .filter((r) => r.email);

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(
  OUT,
  stringify(accepted, { header: true, columns: ["name", "email"] }),
);

console.log(
  JSON.stringify(
    {
      totalRows: rows.length,
      accepted: accepted.length,
      out: OUT,
    },
    null,
    2,
  ),
);
