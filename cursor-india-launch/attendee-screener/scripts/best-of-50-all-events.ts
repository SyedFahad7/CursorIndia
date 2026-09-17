import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";

type Cand = {
  name: string;
  email: string;
  company: string;
  events: Set<string>;
  sources: string[];
  score: number;
  why: string;
};

function loadCsv(path: string): Record<string, string>[] {
  if (!existsSync(path)) return [];
  return parse(readFileSync(path, "utf8"), {
    columns: true,
    skip_empty_lines: true,
    relax_column_count: true,
    trim: true,
    bom: true,
  }) as Record<string, string>[];
}

function normEmail(e: string): string {
  return e.trim().toLowerCase();
}

const byEmail = new Map<string, Cand>();

function upsert(input: {
  name?: string;
  email?: string;
  company?: string;
  event: string;
  source: string;
  score: number;
  why?: string;
}) {
  const email = normEmail(input.email || "");
  if (!email || !email.includes("@")) return;
  // skip host / test-ish
  if (email === "syed.fahad@nxtwave.co.in") return;

  const existing = byEmail.get(email);
  if (!existing) {
    byEmail.set(email, {
      name: (input.name || "").trim() || email,
      email,
      company: (input.company || "").trim(),
      events: new Set([input.event]),
      sources: [input.source],
      score: input.score,
      why: (input.why || "").trim(),
    });
    return;
  }

  existing.events.add(input.event);
  if (!existing.sources.includes(input.source)) existing.sources.push(input.source);
  if ((input.name || "").trim().length > existing.name.length) {
    existing.name = input.name!.trim();
  }
  if ((input.company || "").trim() && !existing.company) {
    existing.company = input.company!.trim();
  }
  // keep best score; multi-event bonus applied later
  if (input.score > existing.score) {
    existing.score = input.score;
    if (input.why) existing.why = input.why.trim();
  } else if (!existing.why && input.why) {
    existing.why = input.why.trim();
  }
}

// --- Workato top 50 ---
{
  const rows = loadCsv("./out/workato-shortlist/top-50-professionals.csv");
  for (const r of rows) {
    const overall = Number(r.overallScore || r.overall || 0);
    upsert({
      name: r.name,
      email: r.email,
      company: r.company,
      event: "Cursor × Workato",
      source: "workato-top-50",
      score: 70 + Math.min(30, overall * 2), // ~70-100
      why: (r.idea || "").slice(0, 160),
    });
  }
}

// --- Build Club recommend accept ---
{
  const rows = loadCsv("./out/build-club-shortlist/recommend-accept.csv");
  for (const r of rows) {
    const s = Number(r.score || 0);
    const showcase = String(r.showcase || "");
    const learnOnly =
      /\b(prefer to learn|looking forward to building my first|don't have a polished|don.t have a polished|not sure that i will|first builder meetup)\b/i.test(
        showcase,
      ) || showcase.trim().length < 40;
    // Near-duplicate duck.com pair — keep one signal, don't inflate both
    const isDupPair = /^(chakrapani@duck\.com|prudhvi0000@duck\.com)$/i.test(
      String(r.email || ""),
    );
    let score = 65 + Math.min(35, s * 3);
    if (learnOnly) score -= 25;
    if (isDupPair) score -= 12;
    upsert({
      name: r.name,
      email: r.email,
      company: "",
      event: "Build Club",
      source: "build-club-recommend",
      score,
      why: (showcase || r.learn || r.flags || "").slice(0, 160),
    });
  }
}

// --- Full agents scored accepts (professionals preferred via professionals-only) ---
{
  const rows = loadCsv("./out/professionals-only/all-professionals-scored.csv");
  for (const r of rows) {
    const decision = String(r.decision || "").toLowerCase();
    const dscore = Number(r.decision_score || r.decisionScore || 0);
    if (decision !== "accept" && decision !== "waitlist") continue;
    const base = decision === "accept" ? 75 : 55;
    upsert({
      name: r.name,
      email: r.email,
      company: r.role || r.company || "",
      event: "ADK / Agent Builder",
      source: `agents-pros-${decision}`,
      score: base + Math.min(25, dscore * 25),
      why: (r.rationale || r.fit_notes || "").slice(0, 160),
    });
  }
}

// --- Already accepted professionals from ADK ---
{
  const rows = loadCsv("./out/professionals-only/professionals-already-accepted.csv");
  for (const r of rows) {
    upsert({
      name: r.name,
      email: r.email,
      company: r.role || "",
      event: "ADK / Agent Builder",
      source: "agents-already-accepted",
      score: 88,
      why: (r.rationale || "").slice(0, 160),
    });
  }
}

// --- Next professionals to accept ---
{
  const rows = loadCsv("./out/professionals-only/professionals-next-to-accept.csv");
  for (const r of rows) {
    const dscore = Number(r.decision_score || 0);
    upsert({
      name: r.name,
      email: r.email,
      company: r.role || "",
      event: "ADK / Agent Builder",
      source: "agents-next-pros",
      score: 70 + Math.min(20, dscore * 20),
      why: (r.rationale || "").slice(0, 160),
    });
  }
}

// --- Shortlist 16 pending pros ---
{
  const rows = loadCsv("./out/shortlist-16/pending-professionals.csv");
  for (const r of rows) {
    const s = Number(r.score || 0);
    upsert({
      name: r.name,
      email: r.email,
      company: r.role || "",
      event: "ADK / Agent Builder",
      source: "shortlist-16-pros",
      score: 72 + Math.min(20, s),
      why: (r.agent || r.why || "").slice(0, 160),
    });
  }
}

// --- Approved tech/AI professionals (Luma approved pool) ---
{
  const rows = loadCsv("./out/approved-tech-ai-professionals.csv");
  for (const r of rows) {
    upsert({
      name: r.name,
      email: r.email,
      company: r.company || r.role || r["Are you?"] || "",
      event: "ADK approved tech/AI",
      source: "approved-tech-ai",
      score: 80,
      why: "Already approved tech/AI professional",
    });
  }
}

// --- Workato accepted (confirmed) ---
{
  const rows = loadCsv("./out/workato-shortlist/accepted-name-email.csv");
  for (const r of rows) {
    upsert({
      name: r.name,
      email: r.email,
      company: "",
      event: "Cursor × Workato",
      source: "workato-accepted",
      score: 85,
      why: "Accepted to Cursor × Workato",
    });
  }
}

// Multi-event bonus + rank
const ranked = [...byEmail.values()]
  .map((c) => {
    const multi = Math.min(15, (c.events.size - 1) * 8);
    return {
      ...c,
      finalScore: Number((c.score + multi).toFixed(2)),
      eventList: [...c.events].join(" | "),
      sourceList: c.sources.join(", "),
    };
  })
  .sort((a, b) => b.finalScore - a.finalScore || a.email.localeCompare(b.email));

const top50 = ranked.slice(0, 50);

const outDir = "./out/best-of-50-all-events";
mkdirSync(outDir, { recursive: true });

writeFileSync(
  `${outDir}/best-50.csv`,
  stringify(
    top50.map((c, i) => ({
      rank: i + 1,
      name: c.name,
      email: c.email,
      company: c.company,
      score: c.finalScore,
      events: c.eventList,
      sources: c.sourceList,
      why: c.why,
    })),
    {
      header: true,
      columns: [
        "rank",
        "name",
        "email",
        "company",
        "score",
        "events",
        "sources",
        "why",
      ],
    },
  ),
);

writeFileSync(
  `${outDir}/best-50-emails.txt`,
  top50.map((c) => c.email).join("\n") + "\n",
);

writeFileSync(
  `${outDir}/best-50-name-email.csv`,
  stringify(
    top50.map((c) => ({ name: c.name, email: c.email })),
    { header: true, columns: ["name", "email"] },
  ),
);

console.log(
  JSON.stringify(
    {
      poolSize: ranked.length,
      top50: top50.length,
      multiEventInTop50: top50.filter((c) => c.events.size > 1).length,
      out: outDir,
      preview: top50.slice(0, 20).map((c) => ({
        name: c.name,
        email: c.email,
        score: c.finalScore,
        events: c.eventList,
      })),
    },
    null,
    2,
  ),
);
