import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";

const path =
  "./google ai agent buildr series latest2.csv";

const rows = parse(readFileSync(path, "utf8"), {
  columns: true,
  skip_empty_lines: true,
  relax_column_count: true,
  trim: true,
  bom: true,
}) as Array<Record<string, string>>;

const pending = rows.filter((r) => r.approval_status === "pending_approval");

type Cand = {
  name: string;
  email: string;
  role: string;
  linkedin: string;
  why: string;
  agent: string;
  city: string;
  roadblocks: string;
  score: number;
  likelyFemale: boolean;
};

const FEMALE_FIRST = new Set(
  [
    "aaliya",
    "aisha",
    "akanksha",
    "amruta",
    "ananya",
    "anitha",
    "anusha",
    "anushka",
    "aparna",
    "archana",
    "aruna",
    "asha",
    "ashwika",
    "aswini",
    "bhavana",
    "bhavani",
    "bhavya",
    "bindu",
    "chaitra",
    "deepa",
    "deepika",
    "deeba",
    "devi",
    "divya",
    "fatima",
    "gayathri",
    "geetha",
    "geethika",
    "haritha",
    "harshita",
    "harshitha",
    "ifra",
    "indu",
    "ishita",
    "jaya",
    "jyothi",
    "jyoti",
    "kalyani",
    "karunya",
    "kavita",
    "kavya",
    "keerthi",
    "krishnaveni",
    "lakshmi",
    "lavanya",
    "madhuri",
    "maheen",
    "mamatha",
    "manasa",
    "manisha",
    "meena",
    "meghana",
    "mousali",
    "nandini",
    "neha",
    "nidhi",
    "niharika",
    "nithya",
    "nuha",
    "padma",
    "pavani",
    "pooja",
    "poonam",
    "prashanthi",
    "prasanna",
    "priya",
    "priyanka",
    "radha",
    "rahima",
    "ramya",
    "rani",
    "rashmi",
    "rekha",
    "revathi",
    "rizwana",
    "sahana",
    "sailaja",
    "samhita",
    "sandhya",
    "sangeetha",
    "sathvika",
    "savitha",
    "shanti",
    "shilpa",
    "shravani",
    "shreya",
    "sindhu",
    "sneha",
    "sowmya",
    "sravani",
    "srija",
    "sujini",
    "sumana",
    "sunitha",
    "swathi",
    "swetha",
    "tejaswi",
    "tejaswini",
    "vaishnavi",
    "varshini",
    "varshitha",
    "vidya",
    "vinuthna",
    "yamini",
    "yeshaswini",
  ].map((s) => s.toLowerCase()),
);

function likelyFemale(name: string): boolean {
  const first = name.trim().split(/\s+/)[0]?.toLowerCase() || "";
  const parts = name.toLowerCase().split(/[\s.]+/);
  if (FEMALE_FIRST.has(first)) return true;
  return parts.some((p) => FEMALE_FIRST.has(p));
}

function qualityScore(r: Record<string, string>): number {
  const why = r["Why do you want to join this event?"] || "";
  const agent = r["What kind of AI agent are you building?"] || "";
  const road = r["Major roadblocks you hit when building AI agents."] || "";
  const linkedin = r["What is your LinkedIn profile?"] || "";
  let s = 0;
  const agentLen = agent.trim().length;
  const whyLen = why.trim().length;
  const roadLen = road.trim().length;
  if (agentLen >= 40) s += 3;
  else if (agentLen >= 15) s += 2;
  else if (agentLen >= 5) s += 1;
  if (whyLen >= 40) s += 2;
  else if (whyLen >= 15) s += 1;
  if (roadLen >= 30 && !/^(na|n\/a|none|nothing|nil|-)$/i.test(road.trim()))
    s += 2;
  else if (roadLen >= 10) s += 1;
  if (/https?:\/\/|linkedin\.com/i.test(linkedin)) s += 1;
  if (/\b(mcp|adk|memory|rag|agent|langchain|langgraph|tool)\b/i.test(agent + " " + road))
    s += 2;
  if (/to learn more|networking|passionate about/i.test(why) && whyLen < 40)
    s -= 1;
  if (/^na$/i.test(agent.trim()) || agentLen < 3) s -= 2;
  return s;
}

function toCand(r: Record<string, string>): Cand {
  return {
    name: r.name || `${r.first_name || ""} ${r.last_name || ""}`.trim(),
    email: r.email || "",
    role: (r["Are you?"] || "").trim(),
    linkedin: r["What is your LinkedIn profile?"] || "",
    why: r["Why do you want to join this event?"] || "",
    agent: r["What kind of AI agent are you building?"] || "",
    city: r["City Name"] || "",
    roadblocks: r["Major roadblocks you hit when building AI agents."] || "",
    score: qualityScore(r),
    likelyFemale: likelyFemale(r.name || r.first_name || ""),
  };
}

const pros = pending
  .filter((r) => (r["Are you?"] || "").trim() === "Professional")
  .map(toCand)
  .sort((a, b) => b.score - a.score);

const founders = pending
  .filter((r) => (r["Are you?"] || "").trim() === "Founder")
  .map(toCand)
  .sort((a, b) => b.score - a.score);

const studentWomen = pending
  .filter((r) => (r["Are you?"] || "").trim() === "Student")
  .map(toCand)
  .filter((c) => c.likelyFemale)
  .sort((a, b) => b.score - a.score);

const proWomen = pros.filter((c) => c.likelyFemale);
const founderWomen = founders.filter((c) => c.likelyFemale);

mkdirSync("./out/shortlist-16", { recursive: true });
writeFileSync(
  "./out/shortlist-16/pending-professionals.csv",
  stringify(pros, { header: true }),
);
writeFileSync(
  "./out/shortlist-16/pending-founders.csv",
  stringify(founders, { header: true }),
);
writeFileSync(
  "./out/shortlist-16/pending-student-women-top.csv",
  stringify(studentWomen.slice(0, 40), { header: true }),
);

console.log(
  JSON.stringify(
    {
      pending: pending.length,
      professionals: pros.length,
      founders: founders.length,
      proWomen: proWomen.length,
      founderWomen: founderWomen.length,
      studentWomen: studentWomen.length,
      topPros: pros.slice(0, 20),
      foundersAll: founders,
      topStudentWomen: studentWomen.slice(0, 15),
    },
    null,
    2,
  ),
);
