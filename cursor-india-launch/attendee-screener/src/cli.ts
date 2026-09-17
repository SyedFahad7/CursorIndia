#!/usr/bin/env node
import "dotenv/config";
import path from "node:path";
import { Command } from "commander";
import { isPersonaId, listPersonas } from "./personas/index.js";
import { exportDecisions } from "./pipeline/export-decisions.js";
import { runScreen } from "./pipeline/run.js";
import type { PersonaId } from "./types.js";
import { enableInsecureTlsIfRequested } from "./tls.js";

enableInsecureTlsIfRequested();

const program = new Command();

program
  .name("attendee-screener")
  .description(
    "Screen Luma registration CSVs with Cursor Pro models + profile signals",
  );

program
  .command("screen", { isDefault: true })
  .description("Screen a Luma guest CSV")
  .requiredOption("--csv <path>", "Path to Luma guest CSV export")
  .option(
    "--persona <id>",
    `Event persona: ${listPersonas()
      .map((p) => p.id)
      .join("|")}`,
    "cursor-dev",
  )
  .option(
    "--instructions <text>",
    "Free-form host instructions for this event",
    "",
  )
  .option(
    "--event-config <path>",
    "event_config.json (capacity, allowlist, prioritize/deprioritize)",
  )
  .option("--limit <n>", "Only screen first N rows (dry run)", (v) =>
    Number(v),
  )
  .option("--concurrency <n>", "Parallel attendees", (v) => Number(v), 2)
  .option("--out <dir>", "Output directory (default: out/run-<timestamp>)")
  .option(
    "--model <id>",
    "Cursor model id",
    process.env.CURSOR_MODEL || "composer-2.5",
  )
  .option("--skip-llm", "Heuristics + profiles only (no Cursor SDK calls)", false)
  .option("--skip-profiles", "Skip GitHub/LinkedIn/X enrichment", false)
  .option("--offline-profiles", "Use fixture GitHub signals (no live API)", false)
  .option(
    "--resume",
    "Skip emails already in --out scored.csv and keep appending",
    false,
  )
  .option("--no-linkedin", "Do not deep-enrich LinkedIn (keep URL only)")
  .option("--no-x", "Do not deep-enrich X (keep handle only)")
  .action(async (opts) => {
    const apiKey = process.env.CURSOR_API_KEY;
    if (!opts.skipLlm && !apiKey) {
      console.error(
        "Missing CURSOR_API_KEY. Set it in .env or the environment (Cursor Dashboard → API Keys).",
      );
      process.exit(1);
    }

    if (!isPersonaId(opts.persona)) {
      console.error(
        `Unknown persona "${opts.persona}". Use one of: ${listPersonas()
          .map((p) => p.id)
          .join(", ")}`,
      );
      process.exit(1);
    }

    if (!process.env.GITHUB_TOKEN) {
      console.warn(
        "Warning: GITHUB_TOKEN not set — GitHub enrichment may rate-limit faster.",
      );
    } else {
      console.log("GitHub token: set");
    }

    const csvPath = path.resolve(opts.csv);
    const outDir =
      opts.out != null
        ? path.resolve(opts.out)
        : path.resolve(
            "out",
            `run-${new Date().toISOString().replace(/[:.]/g, "-")}`,
          );

    const { results, outputs, persona, totalLoaded, eventConfig } =
      await runScreen({
        csvPath,
        persona: opts.persona as PersonaId,
        instructions: opts.instructions ?? "",
        limit: opts.limit,
        concurrency: opts.concurrency ?? 2,
        model: opts.model,
        apiKey: apiKey ?? "",
        outDir,
        skipLlm: Boolean(opts.skipLlm),
        skipProfiles: Boolean(opts.skipProfiles),
        offlineProfiles: Boolean(opts.offlineProfiles),
        resume: Boolean(opts.resume),
        enrichLinkedin: opts.linkedin !== false,
        enrichX: opts.x !== false,
        eventConfigPath: opts.eventConfig,
      });

    const accepts = results.filter((r) => r.decision === "accept").length;
    const waitlist = results.filter((r) => r.decision === "waitlist").length;
    const rejects = results.filter((r) => r.decision === "reject").length;

    console.log("\nDone.");
    console.log(`Event: ${eventConfig.eventName}`);
    console.log(`Persona: ${persona.label}`);
    console.log(`Loaded: ${totalLoaded} · Screened: ${results.length}`);
    console.log(
      `Accept: ${accepts} · Waitlist: ${waitlist} · Reject: ${rejects}` +
        (eventConfig.capacity ? ` · capacity ${eventConfig.capacity}` : ""),
    );
    console.log(`CSV:    ${outputs.scoredCsv}`);
    console.log(`Draft:  ${outputs.draftApproveCsv} / ${outputs.draftDeclineCsv}`);
    console.log(`Report: ${outputs.report}`);
    console.log(
      "\nAfter review: pnpm export-decisions -- --out <dir> --confirm-reviewed",
    );
  });

program
  .command("export-decisions")
  .description(
    "Export Luma approve.csv / decline.csv from scored.csv (requires human review)",
  )
  .option("--out <dir>", "Run output directory containing scored.csv")
  .option("--scored <path>", "Path to scored.csv (overrides --out/scored.csv)")
  .option("--event-config <path>", "Optional event_config.json for capacity note")
  .option(
    "--confirm-reviewed",
    "Required. Confirms you reviewed llm_recommend / decision in scored.csv",
    false,
  )
  .action(async (opts) => {
    const outDir = opts.out ? path.resolve(opts.out) : undefined;
    const scored =
      opts.scored != null
        ? path.resolve(opts.scored)
        : outDir
          ? path.join(outDir, "scored.csv")
          : "";
    if (!scored) {
      console.error("Provide --out <dir> or --scored <path>");
      process.exit(1);
    }
    try {
      const result = await exportDecisions({
        scoredCsvPath: scored,
        outDir,
        eventConfigPath: opts.eventConfig,
        confirmReviewed: Boolean(opts.confirmReviewed),
      });
      console.log(`approve: ${result.approve} → ${result.approvePath}`);
      console.log(`decline: ${result.decline} → ${result.declinePath}`);
      console.log(`skipped: ${result.skipped}`);
      if (result.capacity != null) {
        const delta = result.approve - result.capacity;
        console.log(
          `capacity: ${result.capacity} (${delta === 0 ? "on target" : `${delta >= 0 ? "+" : ""}${delta} vs capacity`})`,
        );
      }
    } catch (err) {
      console.error(err instanceof Error ? err.message : err);
      process.exit(1);
    }
  });

program.parseAsync(process.argv).catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
