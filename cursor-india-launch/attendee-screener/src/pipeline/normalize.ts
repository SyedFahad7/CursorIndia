import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { parse } from "csv-parse/sync";
import type { AttendeeAnswer, NormalizedAttendee } from "../types.js";
import {
  extractGithubUsername,
  extractLinkedInId,
  extractXHandle,
  findUrlInText,
  normalizeUrl,
} from "../utils/urls.js";

const META_COLUMNS = new Set(
  [
    "api_id",
    "guest_id",
    "id",
    "name",
    "first_name",
    "last_name",
    "email",
    "phone_number",
    "phone",
    "created_at",
    "registered_at",
    "approval_status",
    "status",
    "ticket_type",
    "ticket_type_id",
    "ticket_name",
    "checked_in_at",
    "check_in_qr_code",
    "qr_code_url",
    "amount",
    "amount_tax",
    "amount_discount",
    "currency",
    "coupon_code",
    "custom_source",
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "survey_response_rating",
    "survey_response_feedback",
    "eth_address",
    "solana_address",
  ].map((s) => s.toLowerCase()),
);

const LINKEDIN_KEYS = [/linkedin/, /linked\s*in/];
const GITHUB_KEYS = [/github/, /gh\b/, /git\s*hub/];
const X_KEYS = [/\bx\b/, /twitter/, /x\.com/, /handle/];

function normKey(key: string): string {
  return key.trim().toLowerCase().replace(/[\s-]+/g, "_");
}

function pick(row: Record<string, string>, keys: string[]): string | undefined {
  for (const key of keys) {
    const direct = row[key];
    if (direct?.trim()) return direct.trim();
    const found = Object.entries(row).find(
      ([k, v]) => normKey(k) === key && v?.trim(),
    );
    if (found?.[1]?.trim()) return found[1].trim();
  }
  return undefined;
}

function looksLikeProfileColumn(header: string, kind: "linkedin" | "github" | "x") {
  const h = header.toLowerCase();
  const patterns =
    kind === "linkedin" ? LINKEDIN_KEYS : kind === "github" ? GITHUB_KEYS : X_KEYS;
  return patterns.some((re) => re.test(h));
}

function buildName(row: Record<string, string>): string {
  const full = pick(row, ["name", "full_name", "guest_name"]);
  if (full) return full;
  const first = pick(row, ["first_name", "firstname"]) ?? "";
  const last = pick(row, ["last_name", "lastname"]) ?? "";
  return `${first} ${last}`.trim();
}

function collectAnswers(row: Record<string, string>): AttendeeAnswer[] {
  const answers: AttendeeAnswer[] = [];
  for (const [question, answer] of Object.entries(row)) {
    const key = normKey(question);
    if (META_COLUMNS.has(key)) continue;
    if (
      looksLikeProfileColumn(question, "linkedin") ||
      looksLikeProfileColumn(question, "github") ||
      looksLikeProfileColumn(question, "x")
    ) {
      continue;
    }
    if (!answer?.trim()) continue;
    answers.push({ question: question.trim(), answer: answer.trim() });
  }
  return answers;
}

function findProfileField(
  row: Record<string, string>,
  kind: "linkedin" | "github" | "x",
): string | undefined {
  for (const [header, value] of Object.entries(row)) {
    if (!value?.trim()) continue;
    if (looksLikeProfileColumn(header, kind)) {
      return value.trim();
    }
  }
  return undefined;
}

export function normalizeRow(
  row: Record<string, string>,
  rowIndex: number,
): NormalizedAttendee {
  const name = buildName(row);
  const email = pick(row, ["email", "email_address"]) ?? "";
  const answers = collectAnswers(row);
  const responseText = answers
    .map((a) => `Q: ${a.question}\nA: ${a.answer}`)
    .join("\n\n");

  const blob = `${responseText}\n${Object.values(row).join("\n")}`;

  let linkedinUrl = normalizeUrl(findProfileField(row, "linkedin"));
  let githubUrl = normalizeUrl(findProfileField(row, "github"));
  let xUrl = normalizeUrl(findProfileField(row, "x"));

  linkedinUrl ??= normalizeUrl(findUrlInText(blob, "linkedin"));
  githubUrl ??= normalizeUrl(findUrlInText(blob, "github"));
  xUrl ??= normalizeUrl(findUrlInText(blob, "x"));

  // If column only had a handle / slug, expand it
  if (linkedinUrl && !linkedinUrl.includes("linkedin.com")) {
    const id = extractLinkedInId(`https://linkedin.com/in/${linkedinUrl}`) ?? linkedinUrl;
    linkedinUrl = `https://www.linkedin.com/in/${id}`;
  }
  if (githubUrl && !githubUrl.includes("github.com")) {
    const user = extractGithubUsername(githubUrl);
    if (user) githubUrl = `https://github.com/${user}`;
  }
  if (xUrl && !/x\.com|twitter\.com/i.test(xUrl)) {
    const handle = extractXHandle(xUrl);
    if (handle) xUrl = `https://x.com/${handle}`;
  }

  const id = createHash("sha1")
    .update(`${email}|${name}|${rowIndex}`)
    .digest("hex")
    .slice(0, 12);

  return {
    id,
    rowIndex,
    name,
    email,
    phone: pick(row, ["phone_number", "phone"]),
    approvalStatus: pick(row, ["approval_status", "status"]),
    ticketType: pick(row, ["ticket_type", "ticket_name"]),
    registeredAt: pick(row, ["created_at", "registered_at"]),
    linkedinUrl,
    githubUrl,
    xUrl,
    answers,
    responseText,
    raw: row,
  };
}

export async function loadLumaCsv(csvPath: string): Promise<NormalizedAttendee[]> {
  const raw = await readFile(csvPath, "utf8");
  const records = parse(raw, {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true,
    trim: true,
    bom: true,
  }) as Record<string, string>[];

  return records.map((row, i) => normalizeRow(row, i));
}
