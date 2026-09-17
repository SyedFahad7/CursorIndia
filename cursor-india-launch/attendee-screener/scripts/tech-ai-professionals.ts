import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";

const src = "./latesttt.csv";
const rows = parse(readFileSync(src, "utf8"), {
  columns: true,
  skip_empty_lines: true,
  relax_column_count: true,
  trim: true,
  bom: true,
}) as Array<Record<string, string>>;

const TECH_AI =
  /\b(ai|ml|llm|agent|agents|mcp|adk|rag|langchain|langgraph|gpt|gemini|openai|anthropic|cursor|devops|sde|software|engineer|developer|full.?stack|backend|frontend|data scientist|data engineer|machine learning|deep learning|nlp|genai|generative|python|typescript|react|next\.?js|aws|gcp|azure|api|automation|hackathon|production|vector|embedding|orchestrat)\b/i;

const NON_TECH_HEAVY =
  /\b(bench sales|recruiter|hr |human resources|sales executive|marketing manager only)\b/i;

function blob(r: Record<string, string>): string {
  return [
    r["Are you?"],
    r["What kind of AI agent are you building?"],
    r["Why do you want to join this event?"],
    r["Major roadblocks you hit when building AI agents."],
    r["What is your LinkedIn profile?"],
    r.name,
  ]
    .filter(Boolean)
    .join(" ");
}

const approvedPros = rows.filter(
  (r) =>
    r.approval_status === "approved" &&
    (r["Are you?"] || "").trim() === "Professional",
);

const techAi = approvedPros.filter((r) => {
  const text = blob(r);
  const agent = (r["What kind of AI agent are you building?"] || "").trim();
  if (agent.length < 8) return false;
  if (NON_TECH_HEAVY.test(text) && !TECH_AI.test(agent)) return false;
  return TECH_AI.test(text);
});

const out = techAi.map((r) => ({
  name: r.name || `${r.first_name || ""} ${r.last_name || ""}`.trim(),
  email: r.email || "",
  phone_number: r.phone_number || "",
  linkedin: r["What is your LinkedIn profile?"] || "",
  agent: r["What kind of AI agent are you building?"] || "",
  city: r["City Name"] || "",
}));

mkdirSync("./out", { recursive: true });
writeFileSync(
  "./out/approved-tech-ai-professionals.csv",
  stringify(out, { header: true }),
);
writeFileSync(
  "./out/approved-tech-ai-professionals-emails.txt",
  out.map((r) => r.email).filter(Boolean).join("\n") + "\n",
);

console.log(
  JSON.stringify(
    {
      source: src,
      approvedProfessionals: approvedPros.length,
      techAiProfessionals: out.length,
      excludedProsNotTechAi: approvedPros.length - out.length,
      outCsv: "./out/approved-tech-ai-professionals.csv",
      outEmails: "./out/approved-tech-ai-professionals-emails.txt",
    },
    null,
    2,
  ),
);
console.log("--- emails ---");
console.log(out.map((r) => r.email).join("\n"));
