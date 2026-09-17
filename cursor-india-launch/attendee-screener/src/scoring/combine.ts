import type {
  Decision,
  FitJudgment,
  GithubSignal,
  LinkedInSignal,
  Persona,
  SlopJudgment,
  XSignal,
} from "../types.js";

export function combineDecision(input: {
  persona: Persona;
  slop: SlopJudgment;
  fit: FitJudgment;
  github: GithubSignal;
  linkedin: LinkedInSignal;
  x: XSignal;
  hardReject: boolean;
  /** 0–10 completeness from preflight (optional boost) */
  completenessScore?: number;
}): { decision: Decision; decisionScore: number; rationale: string } {
  const w = input.persona.weights;

  const responseScore = input.slop.score;
  const profileBlend =
    w.github * input.github.builderScore +
    w.linkedin * input.linkedin.roleFitScore +
    w.x * input.x.presenceScore +
    w.responses * responseScore;

  const completenessBoost =
    input.completenessScore != null
      ? Math.min(0.08, (input.completenessScore / 10) * 0.08)
      : 0;

  // Blend model fit with weighted profile/response score (+ light completeness)
  const decisionScore = Number(
    (
      0.55 * input.fit.fitScore +
      0.45 * profileBlend +
      completenessBoost
    ).toFixed(3),
  );

  if (input.hardReject || input.slop.isAiSlop) {
    return {
      decision: "reject",
      decisionScore: Math.min(decisionScore, 0.25),
      rationale: `Rejected for AI slop / empty generic paste. ${input.slop.notes}`,
    };
  }

  // Dev-first only: no GitHub URL → waitlist if answers are solid (not for agents/mixed)
  const hasGithubLink = Boolean(input.github.username || input.github.url);
  if (
    input.persona.id === "cursor-dev" &&
    !hasGithubLink &&
    input.fit.fitScore < 0.75
  ) {
    return {
      decision: input.slop.score >= 0.65 ? "waitlist" : "reject",
      decisionScore: Math.min(decisionScore, 0.55),
      rationale:
        "Dev-first event but no GitHub link provided; needs manual review or stronger proof.",
    };
  }

  // Agent workshops: specific answers + LinkedIn should clear waitlist/accept
  if (input.persona.id === "agents") {
    if (input.slop.score >= 0.7 && decisionScore >= 0.48) {
      return {
        decision: decisionScore >= 0.58 ? "accept" : "waitlist",
        decisionScore,
        rationale: input.fit.notes || "Solid agent-event fit from answers/LinkedIn.",
      };
    }
  }

  if (decisionScore >= 0.62) {
    return {
      decision: "accept",
      decisionScore,
      rationale: input.fit.notes || "Strong persona + authenticity fit.",
    };
  }
  if (decisionScore >= 0.4) {
    return {
      decision: "waitlist",
      decisionScore,
      rationale: input.fit.notes || "Borderline — keep on waitlist.",
    };
  }
  return {
    decision: "reject",
    decisionScore,
    rationale: input.fit.notes || "Weak fit for this event persona.",
  };
}

export function fallbackFit(input: {
  persona: Persona;
  slop: SlopJudgment;
  github: GithubSignal;
  linkedin: LinkedInSignal;
  x: XSignal;
}): FitJudgment {
  const w = input.persona.weights;
  const fitScore = Number(
    (
      w.github * input.github.builderScore +
      w.linkedin * input.linkedin.roleFitScore +
      w.x * input.x.presenceScore +
      w.responses * input.slop.score
    ).toFixed(3),
  );

  const strengths: string[] = [];
  const risks: string[] = [];
  if (input.github.builderScore >= 0.5) strengths.push("solid GitHub activity");
  if (input.github.cursorEvidence?.usedCursorLikely) {
    strengths.push("public .cursor / .cursorrules on GitHub");
  } else if (input.github.cursorSignals.length) {
    strengths.push("Cursor-related repo signals");
  }
  if (input.linkedin.roleFitScore >= 0.5) strengths.push("LinkedIn role looks on-persona");
  if (input.slop.score >= 0.7) strengths.push("answers look specific/authentic");
  if (input.slop.isAiSlop) risks.push("AI slop risk");
  if (!input.github.found && input.persona.id === "cursor-dev") {
    risks.push("missing GitHub");
  }
  if (!input.linkedin.found && input.persona.weights.linkedin >= 0.3) {
    risks.push("weak/missing LinkedIn");
  }

  return {
    fitScore,
    personaMatch: input.persona.label,
    strengths,
    risks,
    notes: "Fit from weighted signals (LLM skipped).",
  };
}
