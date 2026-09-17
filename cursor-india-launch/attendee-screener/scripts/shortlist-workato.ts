import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";

const SRC = "./Cursor × Workato.csv";
const OUT = "./out/workato-shortlist";

const Q_ORG = "Organization/Company do you work for?";
const Q_IDEA =
  "What's one AI workflow or project you'd love to build/showcase?";
const Q_LI = "What's your LinkedIn/X profile?";

const STUDENTISH =
  /\b(student|college|university|campus|school|undergrad|graduate seeking|12th|b\.?tech|engineering college|institute of technology|deemed to be|cmr|griet|klh|niat|iare|mvsr|vardhaman|geethanjali|muffakham|stanley|osmania|aurora|anurag|mlrit|mgit|vnr|kprit|jbit|siddhartha|matrusri|vignana|chaitanya|kg reddy|tkr |nalla narasimha|swami vivekanand|rishi ms|lords|scient|svit|bit mesra|methodist)\b/i;

const EMPTYISH = /^(na|n\/a|none|no|nil|-|x|\.?|salary|company)?$/i;

const KNOWN_CORP =
  /\b(accenture|infosys|tcs|tata consultancy|cognizant|deloitte|wipro|capgemini|tech mahindra|hitachi|ibm|amazon|google|microsoft|goldman|mastercard|wells fargo|hsbc|visa|pwc|ey|ernst|epam|adp|autodesk|salesforce|ericsson|amd|amazon|new relic|factset|thomson reuters|jio|lloyds|cyient|virtusa|coforge|cognida|trianz|oro labs|workato|cursor|deepedge|wave|keyloop|ivanti|moveinsync|concentrix|tek systems|tide|f5|collins|zf |quantium|cohere|16vc|bolt|viswam|tiger analytics|optculture|wokay|parentheses|loginsoft|accion|fission|paltech|sysgain|solenis|entain|vassar|cgi|nalabothu|pigeon|freecourse|cinecraft|thunder client|gmi cloud|jocata|infor|techolution|anasrock|contenterra|veb health|asci|wellsfargo|ruh care|core42|aczen|summit|sampadha|leapstart|kovi|ic technologies|iit madras|cyberarc|proclink|thriwin|primera|flyrank|neusix|glymph|nexoraa|kasm|neuroverse|ltc|samriddhi|bigrock|ge digital|rocketgraph|mt103|unifesto|jignasa|nandaka|argan|tradeloop|saturday robotics|codesync|zerocode|svk|centle|superclaims|mahalakshmi|mark icon|pentagon|hapivet|xius|isro|darexai|happenix|genopai|glochem|audviklabs|astralbeam|evolutyz|smartsoftech|phonetic|learlabs|devnovate|svayukthi|eljo|intouch|innonatics|axis bank|deloitte|scale ai|cube|fixity|mono gene|cjss|debots|ai4 ?andhra|wavemaker|indie hacker|datamites|in search of|fintech|loyalty|rentaid|jio mart|freelance|independent|startup|founder)\b/i;

type Row = Record<string, string>;

type Cand = {
  name: string;
  email: string;
  company: string;
  idea: string;
  linkedin: string;
  status: string;
  isProfessional: boolean;
  ideaScore: number;
  overallScore: number;
  ideaTier: "excellent" | "good" | "ok" | "weak";
  flags: string[];
};

function isProfessional(org: string): boolean {
  const o = org.trim();
  if (!o || EMPTYISH.test(o)) return false;
  if (STUDENTISH.test(o) && !KNOWN_CORP.test(o)) return false;
  // "Deloitte / GNITS" etc — treat as professional if corp mentioned
  if (KNOWN_CORP.test(o)) return true;
  if (STUDENTISH.test(o)) return false;
  // Unknown org that doesn't look like college → treat as professional
  if (o.length >= 2 && !/student/i.test(o)) return true;
  return false;
}

function scoreIdea(idea: string): {
  score: number;
  tier: Cand["ideaTier"];
  flags: string[];
} {
  const flags: string[] = [];
  let score = 0;
  const t = idea.trim();
  const len = t.length;

  if (len >= 200) score += 4;
  else if (len >= 100) score += 3;
  else if (len >= 40) score += 2;
  else if (len >= 15) score += 1;
  else {
    flags.push("thin idea");
    return { score: 0, tier: "weak", flags };
  }

  if (
    /\b(workato|cursor|agent|workflow|automat|integrat|enterprise|slack|jira|salesforce|github|ops|orchestrat|rag|mcp|hitl|human.in.the.loop|observab|devops|pipeline)\b/i.test(
      t,
    )
  ) {
    score += 2;
  }

  if (
    /\b(building|built|shipping|shipped|production|live|deployed|we're building|i'm building|we are building)\b/i.test(
      t,
    )
  ) {
    score += 2;
    flags.push("active build");
  }

  if (
    /\b(chatbot|learn more|networking|passionate about)\b/i.test(t) &&
    len < 80
  ) {
    score -= 1;
  }

  // Cursor × Workato fit: automation / enterprise integration
  if (/\b(workato|integrat|automat|enterprise|ops|workflow|connect)\b/i.test(t)) {
    score += 1.5;
    flags.push("workato-fit");
  }

  let tier: Cand["ideaTier"] = "weak";
  if (score >= 8) tier = "excellent";
  else if (score >= 5.5) tier = "good";
  else if (score >= 3) tier = "ok";

  return { score: Number(score.toFixed(1)), tier, flags };
}

function toCand(r: Row): Cand {
  const company = (r[Q_ORG] || "").trim();
  const idea = (r[Q_IDEA] || "").trim();
  const { score, tier, flags } = scoreIdea(idea);
  const pro = isProfessional(company);
  let overall = score;
  if (pro) overall += 1.5;
  if (/linkedin\.com|http/i.test(r[Q_LI] || "")) overall += 0.5;

  return {
    name: r.name || `${r.first_name || ""} ${r.last_name || ""}`.trim(),
    email: r.email || "",
    company,
    idea,
    linkedin: r[Q_LI] || "",
    status: r.approval_status || "",
    isProfessional: pro,
    ideaScore: score,
    overallScore: Number(overall.toFixed(1)),
    ideaTier: tier,
    flags,
  };
}

const rows = parse(readFileSync(SRC, "utf8"), {
  columns: true,
  skip_empty_lines: true,
  relax_column_count: true,
  trim: true,
  bom: true,
}) as Row[];

const pending = rows
  .filter((r) => r.approval_status === "pending_approval")
  .map(toCand);

const pros = pending
  .filter((c) => c.isProfessional)
  .sort((a, b) => b.overallScore - a.overallScore || b.ideaScore - a.ideaScore);

const top50 = pros.slice(0, 50);

const goodIdeas = pending
  .filter((c) => c.ideaTier === "excellent" || c.ideaTier === "good")
  .sort((a, b) => b.ideaScore - a.ideaScore);

const excellentIdeas = goodIdeas.filter((c) => c.ideaTier === "excellent");

mkdirSync(OUT, { recursive: true });
writeFileSync(`${OUT}/top-50-professionals.csv`, stringify(top50, { header: true }));
writeFileSync(
  `${OUT}/top-50-professionals-emails.txt`,
  top50.map((c) => c.email).join("\n") + "\n",
);
writeFileSync(
  `${OUT}/good-ideas.csv`,
  stringify(goodIdeas, { header: true }),
);
writeFileSync(
  `${OUT}/good-idea-names.txt`,
  goodIdeas.map((c) => `${c.name} <${c.email}> — ${c.ideaTier} — ${c.company}`).join("\n") +
    "\n",
);

console.log(
  JSON.stringify(
    {
      total: rows.length,
      pending: pending.length,
      pendingProfessionals: pros.length,
      top50: top50.length,
      excellentIdeas: excellentIdeas.length,
      goodIdeas: goodIdeas.length,
      top50Preview: top50.slice(0, 20).map((c) => ({
        name: c.name,
        email: c.email,
        company: c.company,
        overall: c.overallScore,
        ideaTier: c.ideaTier,
        idea: c.idea.slice(0, 140),
      })),
      excellentIdeaPeople: excellentIdeas.map((c) => ({
        name: c.name,
        email: c.email,
        company: c.company,
        idea: c.idea.slice(0, 180),
      })),
      goodIdeaPeople: goodIdeas
        .filter((c) => c.ideaTier === "good")
        .slice(0, 40)
        .map((c) => ({
          name: c.name,
          email: c.email,
          company: c.company,
          idea: c.idea.slice(0, 140),
        })),
    },
    null,
    2,
  ),
);
