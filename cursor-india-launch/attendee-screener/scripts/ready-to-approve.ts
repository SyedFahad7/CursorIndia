/**
 * From screened ACCEPTS, subtract already-approved in a fresh Luma export.
 * Writes out/to-approve-remaining/ for UI sync + email lists.
 *
 *   pnpm exec tsx scripts/ready-to-approve.ts --luma "path/to/guests.csv"
 */
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";

function arg(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

const lumaPath = path.resolve(
  arg("--luma") ||
    "c:/Users/Syed Fahad/Desktop/cursor/luma-guest-intelligence/Cursor India Roadshow_ Hyderabad - Guests - 2026-07-24-10-32-17.csv",
);
const acceptsPath = path.resolve("./out/roadshow-hyderabad/ACCEPTS.csv");
const outDir = path.resolve("./out/to-approve-remaining");

if (!existsSync(acceptsPath)) {
  console.error("Missing ACCEPTS.csv — run pnpm roadshow:merge first");
  process.exit(1);
}
if (!existsSync(lumaPath)) {
  console.error("Missing Luma CSV:", lumaPath);
  process.exit(1);
}

const accepts = parse(readFileSync(acceptsPath, "utf8"), {
  columns: true,
  bom: true,
  relax_column_count: true,
  skip_empty_lines: true,
}) as Record<string, string>[];

const luma = parse(readFileSync(lumaPath, "utf8"), {
  columns: true,
  bom: true,
  relax_column_count: true,
  skip_empty_lines: true,
}) as Record<string, string>[];

const statusByEmail = new Map<string, string>();
for (const r of luma) {
  const email = (r.email || "").trim().toLowerCase();
  if (!email) continue;
  statusByEmail.set(email, (r.approval_status || "").trim().toLowerCase());
}

const alreadyApproved: Record<string, string>[] = [];
const declinedOverlap: Record<string, string>[] = [];
const missingFromLuma: Record<string, string>[] = [];
const remaining: Record<string, string>[] = [];

for (const r of accepts) {
  const email = (r.email || "").trim().toLowerCase();
  if (!email) continue;
  const status = statusByEmail.get(email);
  if (status == null) {
    missingFromLuma.push(r);
    // still include — may be pending under another export quirk
    remaining.push({ ...r, luma_status: "not_in_export" });
    continue;
  }
  if (status === "approved") {
    alreadyApproved.push(r);
    continue;
  }
  if (status === "declined") {
    declinedOverlap.push(r);
    continue;
  }
  // pending_approval or anything else → still to approve
  remaining.push({ ...r, luma_status: status });
}

mkdirSync(outDir, { recursive: true });

// scored.csv shape the UI hydrate reader expects
const scoredRows = remaining.map((r) => ({
  decision: "accept",
  decision_score: r.decision_score || "",
  name: r.name || "",
  email: r.email || "",
  slop_score: "",
  is_ai_slop: "false",
  github_builder_score: "",
  cursor_used_likely: r.cursor_used_likely || "",
  cursor_signals: "",
  completeness_score: r.completeness_score || "",
  github_url: r.github_url || "",
  linkedin_url: r.linkedin_url || "",
  rationale: r.rationale || "",
  luma_status: r.luma_status || "pending_approval",
}));

writeFileSync(
  path.join(outDir, "scored.csv"),
  stringify(scoredRows, { header: true }),
);
writeFileSync(
  path.join(outDir, "emails.txt"),
  remaining.map((r) => r.email).join("\n") + "\n",
);
writeFileSync(
  path.join(outDir, "already-approved-overlap.csv"),
  stringify(
    alreadyApproved.map((r) => ({ name: r.name, email: r.email })),
    { header: true },
  ),
);

const summary = {
  lumaCsv: lumaPath,
  lumaTotal: luma.length,
  lumaApproved: [...statusByEmail.values()].filter((s) => s === "approved")
    .length,
  screenedAccepts: accepts.length,
  alreadyApprovedOverlap: alreadyApproved.length,
  declinedOverlap: declinedOverlap.length,
  missingFromLuma: missingFromLuma.length,
  remainingToApprove: remaining.length,
  outDir,
  uiLabel: "To approve (new)",
};

writeFileSync(path.join(outDir, "summary.json"), JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
