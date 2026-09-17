import { readFileSync } from "node:fs";
import { parse } from "csv-parse/sync";

const orig = parse(readFileSync("./latesttt.csv", "utf8"), {
  columns: true,
  skip_empty_lines: true,
  relax_column_count: true,
  trim: true,
  bom: true,
}) as Array<Record<string, string>>;

const accepted = orig.filter((r) => r.approval_status === "approved");

function isMissingPhone(v: unknown): boolean {
  const s = (v ?? "").toString().trim();
  return (
    !s ||
    s === "-" ||
    s.toLowerCase() === "n/a" ||
    s.toLowerCase() === "na" ||
    s === "null"
  );
}

const missing = accepted.filter((r) => isMissingPhone(r.phone_number));
const present = accepted.filter((r) => !isMissingPhone(r.phone_number));

const phoneLike = Object.keys(accepted[0] || {}).filter((k) =>
  /phone|mobile|whatsapp|tel/i.test(k),
);

console.log("acceptedTotal", accepted.length);
console.log("phonePresent", present.length);
console.log("phoneMissing", missing.length);
console.log("phoneLikeColumns", phoneLike.join(", ") || "(none)");
console.log("--- missing list ---");
for (const r of missing) {
  console.log(
    [r.name, r.email, `phone=${JSON.stringify(r.phone_number)}`].join(" | "),
  );
}

const allMissing = orig.filter((r) => isMissingPhone(r.phone_number));
console.log("---");
console.log("entireCsvMissingPhone", allMissing.length, "/", orig.length);

// Cross-check exported file
const exported = parse(
  readFileSync("./out/accepted-name-email-phone.csv", "utf8"),
  { columns: true, skip_empty_lines: true, trim: true, bom: true },
) as Array<Record<string, string>>;
const exportedMissing = exported.filter((r) => isMissingPhone(r.phone_number));
console.log("exportedFileMissing", exportedMissing.length, "/", exported.length);
