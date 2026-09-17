import { Agent, CursorAgentError } from "@cursor/sdk";
import { z } from "zod";
import type {
  FitJudgment,
  NormalizedAttendee,
  Persona,
  SlopHeuristics,
  SlopJudgment,
  GithubSignal,
  LinkedInSignal,
  XSignal,
} from "../types.js";

const SlopSchema = z.object({
  authenticity: z.number().min(0).max(1),
  specificity: z.number().min(0).max(1),
  isAiSlop: z.boolean(),
  redFlags: z.array(z.string()),
  notes: z.string(),
  score: z.number().min(0).max(1),
});

const FitSchema = z.object({
  fitScore: z.number().min(0).max(1),
  personaMatch: z.string(),
  strengths: z.array(z.string()),
  risks: z.array(z.string()),
  notes: z.string(),
});

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
  opts: { apiKey: string; model: string; cwd: string },
): Promise<T> {
  try {
    const result = await Agent.prompt(prompt, {
      apiKey: opts.apiKey,
      model: { id: opts.model },
      local: {
        cwd: opts.cwd,
        // Keep headless + isolated from ambient project settings
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

export async function judgeSlopWithCursor(input: {
  attendee: NormalizedAttendee;
  heuristics: SlopHeuristics;
  instructions: string;
  apiKey: string;
  model: string;
  cwd: string;
}): Promise<SlopJudgment> {
  const prompt = `You are screening event registration answers for AI slop.

Important policy:
- AI-assisted writing is FINE when it still sounds personal and specific.
- Reject only obvious paste-slop: generic essays, hyphen/em-dash farms, buzzword stacks, no personal facts, duplicated fluff across fields.
- Do NOT reject someone just because prose is polished.

Event instructions from the host:
${input.instructions || "(none)"}

Heuristic signals (use as evidence, not sole truth):
${JSON.stringify(input.heuristics, null, 2)}

Attendee:
Name: ${input.attendee.name}
Email: ${input.attendee.email}

Registration answers:
${input.attendee.responseText || "(no custom answers)"}

Return ONLY a JSON object with this shape:
{
  "authenticity": 0-1,
  "specificity": 0-1,
  "isAiSlop": boolean,
  "redFlags": string[],
  "notes": string,
  "score": 0-1
}
score = overall authenticity/quality for admission screening (higher is better).`;

  return promptJson(prompt, SlopSchema, {
    apiKey: input.apiKey,
    model: input.model,
    cwd: input.cwd,
  });
}

export async function judgeFitWithCursor(input: {
  attendee: NormalizedAttendee;
  persona: Persona;
  instructions: string;
  slop: SlopJudgment;
  github: GithubSignal;
  linkedin: LinkedInSignal;
  x: XSignal;
  apiKey: string;
  model: string;
  cwd: string;
}): Promise<FitJudgment> {
  const prompt = `You are ranking whether this registrant fits an event persona.

Persona: ${input.persona.label}
${input.persona.description}

Fit hints:
${input.persona.fitHints.map((h) => `- ${h}`).join("\n")}

Host instructions:
${input.instructions || "(none)"}

Slop judgment:
${JSON.stringify(input.slop, null, 2)}

GitHub signals:
${JSON.stringify(input.github, null, 2)}

LinkedIn signals:
${JSON.stringify(input.linkedin, null, 2)}

X signals:
${JSON.stringify(input.x, null, 2)}

Registration answers:
${input.attendee.responseText || "(no custom answers)"}

Profile URLs:
- LinkedIn: ${input.attendee.linkedinUrl ?? "missing"}
- GitHub: ${input.attendee.githubUrl ?? "missing"}
- X: ${input.attendee.xUrl ?? "missing"}

Return ONLY JSON:
{
  "fitScore": 0-1,
  "personaMatch": string,
  "strengths": string[],
  "risks": string[],
  "notes": string
}`;

  return promptJson(prompt, FitSchema, {
    apiKey: input.apiKey,
    model: input.model,
    cwd: input.cwd,
  });
}
