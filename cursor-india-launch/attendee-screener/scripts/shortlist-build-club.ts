import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";

const SRC = "./AI Builders Meetup_ Build Club.csv";
const OUT = "./out/build-club-shortlist";

const rows = parse(readFileSync(SRC, "utf8"), {
  columns: true,
  skip_empty_lines: true,
  relax_column_count: true,
  trim: true,
  bom: true,
}) as Array<Record<string, string>>;

type Cand = {
  name: string;
  email: string;
  linkedin: string;
  x: string;
  learn: string;
  tools: string;
  showcase: string;
  score: number;
  flags: string[];
};

const Q_LEARN = "What do you want to show or learn?";
const Q_TOOLS = "What AI tools do you use the most?";
const Q_SHOW =
  "What's one AI workflow/project/product you'd love to showcase on stage?";

function scoreRow(r: Record<string, string>): Cand {
  const learn = r[Q_LEARN] || "";
  const tools = r[Q_TOOLS] || "";
  const showcase = r[Q_SHOW] || "";
  const linkedin = r["What is your LinkedIn profile?"] || "";
  const x = r["What is your X (Twitter) handle?"] || "";
  const flags: string[] = [];
  let score = 0;

  const showLen = showcase.trim().length;
  const learnLen = learn.trim().length;

  // Concrete showcase project is the main signal for Build Club
  if (showLen >= 180) score += 5;
  else if (showLen >= 80) score += 4;
  else if (showLen >= 30) score += 2;
  else if (showLen >= 10) score += 1;
  else flags.push("no/weak showcase");

  if (
    /\b(built|building|shipped|deployed|launched|production|github|demo|live|app|agent|rag|mcp|cursor)\b/i.test(
      showcase,
    )
  ) {
    score += 2;
  }

  if (learnLen >= 60) score += 2;
  else if (learnLen >= 20) score += 1;

  if (
    /\b(cursor|claude|chatgpt|gemini|mcp|agent|langchain|n8n|v0|lovable|replit|windsurf|copilot)\b/i.test(
      tools,
    )
  ) {
    score += 2;
  } else if (tools.trim().length > 3) {
    score += 1;
  }

  if (/linkedin\.com/i.test(linkedin)) score += 1;
  if (/x\.com|twitter\.com|@/.test(x)) score += 0.5;

  // Prefer people who want to SHOW, not only learn
  if (
    /\b(showcase|show|demo|present|stage|built|building)\b/i.test(
      learn + " " + showcase,
    ) &&
    showLen >= 40
  ) {
    score += 1.5;
    flags.push("stage-ready signal");
  }

  if (/only learn|just learn|prefer to learn|first builder meetup/i.test(learn + " " + showcase) && showLen < 40) {
    score -= 1;
    flags.push("learn-only");
  }

  // AI-slop-ish long generic with no project nouns
  if (
    showLen > 120 &&
    !/\b(api|dashboard|agent|rag|fraud|app|bot|pipeline|mcp|cursor|github|streamlit|react|python)\b/i.test(
      showcase,
    )
  ) {
    score -= 1;
    flags.push("generic showcase");
  }

  return {
    name: r.name || `${r.first_name || ""} ${r.last_name || ""}`.trim(),
    email: r.email || "",
    linkedin,
    x,
    learn,
    tools,
    showcase,
    score: Number(score.toFixed(1)),
    flags,
  };
}

const pending = rows.filter((r) => r.approval_status === "pending_approval");
const approved = rows.filter((r) => r.approval_status === "approved");
const ranked = pending.map(scoreRow).sort((a, b) => b.score - a.score);

// Recommend: top tier score >= 7, or top 25 if fewer
const recommend = ranked.filter((c) => c.score >= 7);
const shortlist =
  recommend.length >= 12
    ? recommend.slice(0, Math.min(25, recommend.length))
    : ranked.slice(0, 20);

mkdirSync(OUT, { recursive: true });
writeFileSync(`${OUT}/all-pending-ranked.csv`, stringify(ranked, { header: true }));
writeFileSync(`${OUT}/recommend-accept.csv`, stringify(shortlist, { header: true }));
writeFileSync(
  `${OUT}/recommend-emails.txt`,
  shortlist.map((c) => c.email).join("\n") + "\n",
);

console.log(
  JSON.stringify(
    {
      total: rows.length,
      pending: pending.length,
      alreadyApproved: approved.length,
      recommendCount: shortlist.length,
      scoreCutoff: recommend.length >= 12 ? ">=7" : "top20",
      top: shortlist.map((c) => ({
        score: c.score,
        name: c.name,
        email: c.email,
        linkedin: c.linkedin,
        tools: c.tools.slice(0, 80),
        showcase: c.showcase.slice(0, 160),
        flags: c.flags,
      })),
    },
    null,
    2,
  ),
);
