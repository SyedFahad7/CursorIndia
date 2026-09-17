import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";
import { runScreen } from "../src/pipeline/run.js";
import type { Decision, PersonaId } from "../src/types.js";

type GoldCase = {
  email: string;
  expectedDecision: Decision;
  expectAiSlop: boolean;
  notes?: string;
};

type GoldFile = {
  persona: PersonaId;
  cases: GoldCase[];
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const skipLlm = process.argv.includes("--heuristics-only");
  const offlineProfiles =
    process.argv.includes("--offline-profiles") || skipLlm;
  const apiKey = process.env.CURSOR_API_KEY ?? "";

  if (!skipLlm && !apiKey) {
    console.error("CURSOR_API_KEY required unless --heuristics-only");
    process.exit(1);
  }

  const goldPath = path.join(__dirname, "fixtures", "gold.json");
  const csvPath = path.join(__dirname, "fixtures", "sample-luma.csv");
  const gold = JSON.parse(await readFile(goldPath, "utf8")) as GoldFile;

  const outDir = path.join(
    __dirname,
    "..",
    "out",
    `eval-${new Date().toISOString().replace(/[:.]/g, "-")}`,
  );

  const { results } = await runScreen({
    csvPath,
    persona: gold.persona,
    instructions:
      "Hyderabad Cursor meetup. Prefer builders who ship. Students OK with real repos.",
    concurrency: skipLlm ? 5 : 1,
    model: process.env.CURSOR_MODEL || "composer-2.5",
    apiKey,
    outDir,
    skipLlm,
    skipProfiles: false,
    offlineProfiles,
    enrichLinkedin: false,
    enrichX: false,
  });

  let decisionHits = 0;
  let slopHits = 0;
  let decisionTotal = 0;
  let slopTotal = 0;

  console.log("\nEval results\n");

  for (const c of gold.cases) {
    const row = results.find(
      (r) => r.attendee.email.toLowerCase() === c.email.toLowerCase(),
    );
    if (!row) {
      console.log(`MISS  ${c.email} — not in results`);
      continue;
    }

    decisionTotal++;
    const decisionOk = row.decision === c.expectedDecision;
    if (decisionOk) decisionHits++;

    slopTotal++;
    const slopOk = row.slop.isAiSlop === c.expectAiSlop;
    if (slopOk) slopHits++;

    const mark = decisionOk && slopOk ? "PASS" : "FAIL";
    console.log(
      `${mark}  ${c.email}\n` +
        `      decision=${row.decision} (expected ${c.expectedDecision}) score=${row.decisionScore}\n` +
        `      slop=${row.slop.isAiSlop} (expected ${c.expectAiSlop}) — ${c.notes ?? ""}`,
    );
  }

  const decisionAcc = decisionTotal ? decisionHits / decisionTotal : 0;
  const slopAcc = slopTotal ? slopHits / slopTotal : 0;

  console.log("\nSummary");
  console.log(
    `Decision accuracy: ${(decisionAcc * 100).toFixed(1)}% (${decisionHits}/${decisionTotal})`,
  );
  console.log(
    `Slop accuracy:     ${(slopAcc * 100).toFixed(1)}% (${slopHits}/${slopTotal})`,
  );
  console.log(`Artifacts: ${outDir}`);

  // Heuristics-only mode should at least nail the two obvious slop rejects
  if (skipLlm) {
    const slopEmails = gold.cases
      .filter((c) => c.expectAiSlop)
      .map((c) => c.email.toLowerCase());
    const caught = results.filter(
      (r) =>
        slopEmails.includes(r.attendee.email.toLowerCase()) && r.slop.isAiSlop,
    ).length;
    if (caught < slopEmails.length) {
      console.error("Heuristics failed to catch all gold slop cases");
      process.exit(2);
    }
  }

  if (decisionAcc < 0.6 || slopAcc < 0.8) {
    process.exit(2);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
