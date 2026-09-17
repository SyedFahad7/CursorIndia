import path from "node:path";
import {
  formatEventInstructions,
  loadEventConfig,
} from "../event-config.js";
import { getPersona } from "../personas/index.js";
import {
  judgeFitWithCursor,
  judgeSlopWithCursor,
} from "../providers/cursor.js";
import { enrichGithub, offlineGithub } from "../providers/github.js";
import { enrichLinkedIn } from "../providers/linkedin.js";
import { enrichX } from "../providers/x.js";
import { combineDecision, fallbackFit } from "../scoring/combine.js";
import type {
  FitJudgment,
  GithubSignal,
  LinkedInSignal,
  ScreenedAttendee,
  ScreenOptions,
  SlopJudgment,
  XSignal,
} from "../types.js";
import { JsonCache } from "../utils/cache.js";
import { mapPool } from "../utils/concurrency.js";
import { writeRunOutputs } from "./export.js";
import {
  LiveResultWriter,
  loadCompletedEmails,
  loadJudgmentsJsonl,
} from "./live-writer.js";
import { loadLumaCsv } from "./normalize.js";
import { applyCapacityCap, runPreflight } from "./preflight.js";
import { heuristicsOnlySlopJudgment, scoreSlopHeuristics } from "./slop.js";

function emptyGithub(): GithubSignal {
  return {
    found: false,
    topRepos: [],
    cursorSignals: [],
    builderScore: 0,
    notes: ["skipped"],
  };
}

function emptyLinkedIn(): LinkedInSignal {
  return {
    found: false,
    experienceTitles: [],
    companyHints: [],
    skills: [],
    roleFitScore: 0,
    notes: ["skipped"],
  };
}

function emptyX(): XSignal {
  return {
    found: false,
    notes: ["skipped"],
    presenceScore: 0,
  };
}

function allowlistFit(notes: string): FitJudgment {
  return {
    fitScore: 1,
    personaMatch: "allowlist",
    strengths: ["allowlisted or already approved"],
    risks: [],
    notes,
  };
}

function allowlistSlop(): SlopJudgment {
  return {
    authenticity: 1,
    specificity: 1,
    isAiSlop: false,
    redFlags: [],
    notes: "Skipped LLM — allowlist / already approved",
    score: 1,
  };
}

export async function runScreen(options: ScreenOptions) {
  const persona = getPersona(options.persona);
  const { config: eventConfig } = await loadEventConfig(options.eventConfigPath);
  const instructions = formatEventInstructions(
    eventConfig,
    options.instructions,
  );

  const all = await loadLumaCsv(options.csvPath);
  const { kept, droppedDeclined, skippedDup } = runPreflight(all, eventConfig);

  let attendees = kept;
  if (options.limit) attendees = attendees.slice(0, options.limit);

  const cacheDir = path.join(options.outDir, ".cache");
  const cache = new JsonCache(cacheDir);
  const cwd = path.resolve(path.dirname(options.csvPath));
  const scoredPath = path.join(options.outDir, "scored.csv");
  const jsonlPath = path.join(options.outDir, "judgments.jsonl");

  if (options.resume) {
    const done = await loadCompletedEmails(scoredPath);
    if (done.size > 0) {
      const before = attendees.length;
      attendees = attendees.filter((a) => !done.has(a.email.toLowerCase()));
      console.log(
        `Resume: skipping ${before - attendees.length} already in scored.csv (${done.size} emails)`,
      );
    }
  }

  const status = async (message: string) => {
    console.log(message);
    await options.onStatus?.(message);
  };

  await status(
    `Loaded ${all.length} rows → preflight kept ${kept.length} (dropped ${droppedDeclined} declined, ${skippedDup} non-keep dups)`,
  );
  await status(
    `Screening ${attendees.length} (persona=${persona.id}${eventConfig.capacity ? `, capacity=${eventConfig.capacity}` : ""})`,
  );
  await status(`Live CSV → ${scoredPath}`);

  const live = new LiveResultWriter(options.outDir, { resume: options.resume });

  const results = await mapPool(
    attendees,
    options.concurrency,
    async (attendee) => {
      const pf = attendee.preflight;

      // Non-keep duplicates → soft reject without LLM spend
      if (pf.skipScreen && pf.skipReason?.includes("duplicate")) {
        const screened: ScreenedAttendee = {
          attendee,
          heuristics: scoreSlopHeuristics(attendee),
          slop: {
            ...heuristicsOnlySlopJudgment(scoreSlopHeuristics(attendee)),
            notes: pf.skipReason,
          },
          github: emptyGithub(),
          linkedin: emptyLinkedIn(),
          x: emptyX(),
          fit: {
            fitScore: 0,
            personaMatch: persona.label,
            strengths: [],
            risks: ["duplicate"],
            notes: pf.skipReason,
          },
          decision: "reject",
          decisionScore: 0,
          rationale: pf.skipReason,
          completenessScore: pf.completenessScore,
          allowlisted: pf.allowlisted,
          alreadyApproved: pf.alreadyApproved,
          dupEmail: pf.dupEmail,
          dupEmailKeep: pf.dupEmailKeep,
          dupPhone: pf.dupPhone,
          dupPhoneKeep: pf.dupPhoneKeep,
          llmRecommend: "decline",
        };
        await live.append(screened);
        return screened;
      }

      // Allowlist / already approved → auto accept (still optional light profiles)
      if (pf.allowlisted || pf.alreadyApproved) {
        const screened: ScreenedAttendee = {
          attendee,
          heuristics: scoreSlopHeuristics(attendee),
          slop: allowlistSlop(),
          github: emptyGithub(),
          linkedin: emptyLinkedIn(),
          x: emptyX(),
          fit: allowlistFit(
            pf.allowlisted
              ? "Allowlisted domain/email — auto accept"
              : "Already approved in Luma — keep accept",
          ),
          decision: "accept",
          decisionScore: 1,
          rationale: pf.allowlisted
            ? "Allowlisted — auto accept"
            : "Already approved — keep",
          completenessScore: pf.completenessScore,
          allowlisted: pf.allowlisted,
          alreadyApproved: pf.alreadyApproved,
          dupEmail: pf.dupEmail,
          dupEmailKeep: pf.dupEmailKeep,
          dupPhone: pf.dupPhone,
          dupPhoneKeep: pf.dupPhoneKeep,
          llmRecommend: "approve",
        };
        await live.append(screened);
        return screened;
      }

      const heuristics = scoreSlopHeuristics(attendee);

      const [github, linkedin, x] = options.skipProfiles
        ? [emptyGithub(), emptyLinkedIn(), emptyX()]
        : await Promise.all([
            options.offlineProfiles
              ? Promise.resolve(offlineGithub(attendee.githubUrl))
              : enrichGithub(attendee.githubUrl, cache),
            enrichLinkedIn(
              attendee.linkedinUrl,
              persona.id,
              cache,
              options.enrichLinkedin ?? true,
            ),
            enrichX(attendee.xUrl, cache, options.enrichX ?? true),
          ]);

      let slop = heuristicsOnlySlopJudgment(heuristics);
      if (!options.skipLlm && !heuristics.hardReject) {
        try {
          slop = await judgeSlopWithCursor({
            attendee,
            heuristics,
            instructions,
            apiKey: options.apiKey,
            model: options.model,
            cwd,
          });
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          slop = {
            ...slop,
            notes: `${slop.notes} LLM slop judge failed: ${message}`,
          };
        }
      } else if (heuristics.hardReject) {
        slop = {
          ...heuristicsOnlySlopJudgment(heuristics),
          isAiSlop: true,
          score: Math.min(slop.score, 0.2),
        };
      }

      let fit = fallbackFit({ persona, slop, github, linkedin, x });
      if (!options.skipLlm && !slop.isAiSlop) {
        try {
          fit = await judgeFitWithCursor({
            attendee,
            persona,
            instructions,
            slop,
            github,
            linkedin,
            x,
            apiKey: options.apiKey,
            model: options.model,
            cwd,
          });
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          fit = {
            ...fit,
            notes: `${fit.notes} LLM fit judge failed: ${message}`,
          };
        }
      }

      const { decision, decisionScore, rationale } = combineDecision({
        persona,
        slop,
        fit,
        github,
        linkedin,
        x,
        hardReject: heuristics.hardReject,
        completenessScore: pf.completenessScore,
      });

      const screened: ScreenedAttendee = {
        attendee,
        heuristics,
        slop,
        github,
        linkedin,
        x,
        fit,
        decision,
        decisionScore,
        rationale,
        completenessScore: pf.completenessScore,
        allowlisted: pf.allowlisted,
        alreadyApproved: pf.alreadyApproved,
        dupEmail: pf.dupEmail,
        dupEmailKeep: pf.dupEmailKeep,
        dupPhone: pf.dupPhone,
        dupPhoneKeep: pf.dupPhoneKeep,
        llmRecommend:
          decision === "accept"
            ? "approve"
            : decision === "reject"
              ? "decline"
              : "",
      };

      await live.append(screened);
      return screened;
    },
    async (done, total, screened) => {
      if (
        done === total ||
        done % 5 === 0 ||
        done % Math.max(1, Math.floor(total / 10)) === 0
      ) {
        console.log(`  progress ${done}/${total} → scored.csv synced`);
      }
      await options.onAttendee?.(screened, { done, total });
    },
  );

  const fromJsonl = await loadJudgmentsJsonl(jsonlPath);
  let forExport = fromJsonl.length >= results.length ? fromJsonl : results;

  if (eventConfig.applyCapacity && eventConfig.capacity) {
    const before = forExport.filter((r) => r.decision === "accept").length;
    forExport = applyCapacityCap(forExport, eventConfig.capacity);
    const after = forExport.filter((r) => r.decision === "accept").length;
    if (after < before) {
      console.log(
        `Capacity cap ${eventConfig.capacity}: demoted ${before - after} accepts → waitlist`,
      );
      for (const r of forExport) {
        if (r.decision === "waitlist" && r.llmRecommend === "approve") {
          r.llmRecommend = "";
        }
      }
    }
  }

  const outputs = await writeRunOutputs({
    outDir: options.outDir,
    persona,
    instructions,
    results: forExport,
    eventConfig,
  });

  return {
    results: forExport,
    outputs,
    persona,
    totalLoaded: all.length,
    eventConfig,
  };
}
