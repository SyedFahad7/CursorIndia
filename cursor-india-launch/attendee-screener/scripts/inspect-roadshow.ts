import { readFileSync } from "node:fs";
import { parse } from "csv-parse/sync";

const path =
  "./Cursor India Roadshow_ Hyderabad - Guests - pending.csv";
const rows = parse(readFileSync(path, "utf8"), {
  columns: true,
  skip_empty_lines: true,
  relax_column_count: true,
  trim: true,
  bom: true,
}) as Record<string, string>[];

console.log("total", rows.length);
console.log("cols", Object.keys(rows[0] || {}));
const by: Record<string, number> = {};
for (const r of rows) {
  const s = (r.approval_status || "").trim() || "(empty)";
  by[s] = (by[s] || 0) + 1;
}
console.log("status", by);
const roleCol = Object.keys(rows[0] || {}).find((k) => /are you/i.test(k));
console.log("roleCol", roleCol);
if (roleCol) {
  const roles: Record<string, number> = {};
  for (const r of rows) {
    const v = (r[roleCol] || "").trim() || "(empty)";
    roles[v] = (roles[v] || 0) + 1;
  }
  console.log("roles", roles);
}
const custom = Object.keys(rows[0] || {}).filter(
  (k) =>
    !/^(guest_id|api_id|name|first|last|email|phone|created|approval|checked|utm|qr|amount|currency|coupon|eth|solana|survey|ticket)/i.test(
      k,
    ),
);
console.log("custom", custom);
for (const k of custom) {
  const filled = rows.filter((r) => (r[k] || "").trim().length >= 2).length;
  console.log(`fill ${k}: ${filled}/${rows.length}`);
}
console.log("--- sample ---");
console.log(JSON.stringify(rows[0], null, 2).slice(0, 2000));
