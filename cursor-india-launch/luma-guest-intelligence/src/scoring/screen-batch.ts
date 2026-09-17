import { Agent, CursorAgentError } from "@cursor/sdk";
import { z } from "zod";
import { approvalMessageForTier } from "../approval-message.js";
import { serverConfig } from "../config.js";
import {
  BatchJudgeSchema,
  type GuestInput,
  type ScoredGuest,
  type Tier,
} from "../types.js";

function extractJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced?.[1]?.trim() ?? text.trim();
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("No JSON object in model response");
  }
  return JSON.parse(candidate.slice(start, end + 1));
}

async function promptJson<T>(
  prompt: string,
  schema: z.ZodType<T>,
): Promise<T> {
  if (!serverConfig.cursorApiKey) {
    throw new Error("CURSOR_API_KEY is not set");
  }

  try {
    const result = await Agent.prompt(prompt, {
      apiKey: serverConfig.cursorApiKey,
      model: { id: serverConfig.cursorModel },
      local: {
        cwd: process.cwd(),
        settingSources: [],
      },
    });

    if (result.status === "error") {
      throw new Error(`Cursor run failed: ${result.id}`);
    }

    const text =
      typeof result.result === "string"
        ? result.result
        : JSON.stringify(result.result ?? "");
    return schema.parse(extractJson(text));
  } catch (err) {
    if (err instanceof CursorAgentError) {
      throw new Error(
        `Cursor SDK startup failed: ${err.message} (retryable=${err.isRetryable})`,
      );
    }
    throw err;
  }
}

function guestBlob(g: GuestInput): string {
  const answers =
    g.answers.length > 0
      ? g.answers.map((a) => `Q: ${a.question}\nA: ${a.answer}`).join("\n\n")
      : g.responseText || "(no registration answers)";

  return [
    `id: ${g.id}`,
    `name: ${g.name}`,
    `email: ${g.email}`,
    `linkedin: ${g.linkedinUrl || "missing"}`,
    `lumaStatus: ${g.lumaStatus || "unknown"}`,
    `answers:\n${answers}`,
  ].join("\n");
}

function heuristicFallback(
  guests: GuestInput[],
  alreadyAccepted: number,
  targetAccepts: number,
): ScoredGuest[] {
  let acceptsLeft = Math.max(0, targetAccepts - alreadyAccepted);

  return guests.map((g) => {
    const text = (
      g.responseText ||
      g.answers.map((a) => a.answer).join(" ") ||
      ""
    ).trim();
    const words = text.split(/\s+/).filter(Boolean).length;
    const hasLinkedIn = Boolean(g.linkedinUrl);
    let score = Math.min(95, 35 + words * 1.2 + (hasLinkedIn ? 15 : 0));
    if (words < 8) score = Math.min(score, 40);

    let tier: Tier = "waitlist";
    if (score >= 70 && acceptsLeft > 0) {
      tier = "approve";
      acceptsLeft -= 1;
    } else if (score < 45) {
      tier = "reject";
    }

    return {
      id: g.id,
      name: g.name,
      email: g.email,
      score: Math.round(score),
      tier,
      reason:
        tier === "approve"
          ? "Heuristic demo score — specific enough answers."
          : tier === "reject"
            ? "Heuristic demo score — answers too thin."
            : "Heuristic demo score — borderline; waitlist.",
      persona: "builder",
      approvalMessage: approvalMessageForTier(tier, g.name),
      strengths: hasLinkedIn ? ["Has LinkedIn"] : ["Registered"],
      risks: words < 12 ? ["Short answers"] : [],
    };
  });
}

export async function screenBatch(input: {
  guests: GuestInput[];
  criteria: string;
  eventName: string;
  alreadyAccepted: number;
  targetAccepts: number;
  /** Force heuristic path (no Cursor key / offline demo) */
  dryRun?: boolean;
}): Promise<{ screened: ScoredGuest[]; criteriaUsed: string; mode: "cursor" | "heuristic" }> {
  const criteriaUsed =
    input.criteria.trim() ||
    "Prefer builders with specific projects, clear intent, and non-generic answers. Reject empty or pure buzzword paste.";

  if (input.dryRun || !serverConfig.cursorApiKey) {
    return {
      screened: heuristicFallback(
        input.guests,
        input.alreadyAccepted,
        input.targetAccepts,
      ),
      criteriaUsed,
      mode: "heuristic",
    };
  }

  const remaining = Math.max(0, input.targetAccepts - input.alreadyAccepted);

  const prompt = `You are screening event registrations for admission.

Event: ${input.eventName}

Host acceptance criteria (FOLLOW THESE):
${criteriaUsed}

Capacity:
- Already accepted: ${input.alreadyAccepted}
- Target accepts: ${input.targetAccepts}
- Remaining approve slots for THIS batch: ${remaining}
Do NOT recommend more "approve" tiers than remaining slots. Extra strong candidates should be "waitlist".

Guests to score:
${input.guests.map((g, i) => `--- Guest ${i + 1} ---\n${guestBlob(g)}`).join("\n\n")}

Return ONLY a JSON object:
{
  "guests": [
    {
      "id": "same id as input",
      "score": 0-100,
      "tier": "approve" | "waitlist" | "reject",
      "reason": "1-2 sentences for the host",
      "persona": "short label e.g. student-builder | pro-agent | founder",
      "strengths": ["..."],
      "risks": ["..."]
    }
  ]
}

Rules:
- Score on specificity, builder signal, fit to criteria — not polish alone.
- AI-assisted writing is OK if personal/specific; reject obvious generic slop.
- Include every guest id exactly once.
`;

  const judged = await promptJson(prompt, BatchJudgeSchema);
  const byId = new Map(judged.guests.map((g) => [g.id, g]));

  let acceptsLeft = remaining;
  const screened: ScoredGuest[] = input.guests.map((g) => {
    const j = byId.get(g.id);
    let tier: Tier = j?.tier ?? "waitlist";
    let score = j?.score ?? 50;

    if (tier === "approve") {
      if (acceptsLeft <= 0) tier = "waitlist";
      else acceptsLeft -= 1;
    }

    return {
      id: g.id,
      name: g.name,
      email: g.email,
      score,
      tier,
      reason: j?.reason ?? "No model judgment; defaulted to waitlist.",
      persona: j?.persona ?? "unknown",
      approvalMessage: approvalMessageForTier(tier, g.name),
      strengths: j?.strengths ?? [],
      risks: j?.risks ?? [],
    };
  });

  return { screened, criteriaUsed, mode: "cursor" };
}

export function summarize(screened: ScoredGuest[], alreadyAccepted: number, targetAccepts: number) {
  const approve = screened.filter((g) => g.tier === "approve").length;
  const waitlist = screened.filter((g) => g.tier === "waitlist").length;
  const reject = screened.filter((g) => g.tier === "reject").length;
  return {
    approve,
    waitlist,
    reject,
    remainingAcceptSlots: Math.max(0, targetAccepts - alreadyAccepted - approve),
  };
}
