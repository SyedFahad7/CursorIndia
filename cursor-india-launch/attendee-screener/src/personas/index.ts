import type { Persona, PersonaId } from "../types.js";

const PERSONAS: Record<PersonaId, Persona> = {
  "cursor-dev": {
    id: "cursor-dev",
    label: "Cursor builders (dev-first)",
    description:
      "Prefer people who ship code. GitHub is the primary signal. Fake Cursor fans with empty repos should rank low.",
    weights: { github: 0.45, linkedin: 0.15, x: 0.1, responses: 0.3 },
    fitHints: [
      "Reward recent public commits, owned (non-fork) repos, and concrete project mentions.",
      "Look for Cursor / AI coding / agent tooling signals in repos or answers.",
      "Students are fine if they have real repos; empty GitHub + hype essay is a risk.",
      "PMs/founders without builder proof are waitlist unless answers are exceptionally specific.",
    ],
  },
  founders: {
    id: "founders",
    label: "Founders / operators",
    description:
      "Prefer founders and operators. LinkedIn + X matter more than GitHub depth.",
    weights: { github: 0.1, linkedin: 0.4, x: 0.2, responses: 0.3 },
    fitHints: [
      "Reward founder / CEO / co-founder titles and company-building specifics.",
      "GitHub is a bonus, not required.",
      "Reject vague 'building the future of AI' with no company, product, or traction detail.",
    ],
  },
  pms: {
    id: "pms",
    label: "Product managers",
    description:
      "Prefer PMs and product-minded operators with clear ownership stories.",
    weights: { github: 0.15, linkedin: 0.4, x: 0.15, responses: 0.3 },
    fitHints: [
      "Reward PM / product titles, shipped product stories, and clear problem framing.",
      "Light builder proof helps; empty profiles with generic PM buzzwords do not.",
    ],
  },
  mixed: {
    id: "mixed",
    label: "Mixed room",
    description:
      "Balanced mix of builders, PMs, and founders. No single channel dominates.",
    weights: { github: 0.25, linkedin: 0.25, x: 0.15, responses: 0.35 },
    fitHints: [
      "Accept strong signal from any channel if responses are specific and authentic.",
      "Still reject pure AI slop and empty profiles with hype-only answers.",
    ],
  },
  agents: {
    id: "agents",
    label: "AI agent builders (LinkedIn + answers)",
    description:
      "For ADK/MCP/agent workshops where the Luma form collects LinkedIn + what they're building, not GitHub.",
    weights: { github: 0.05, linkedin: 0.35, x: 0.1, responses: 0.5 },
    fitHints: [
      "Reward concrete agent ideas (MCP, memory, tools, evals, domain agents).",
      "Students and professionals both OK if answers are specific.",
      "Missing GitHub is normal for this form — do not penalize heavily.",
      "Reject empty 'to learn more' with no agent idea, and obvious AI slop.",
    ],
  },
};

export function getPersona(id: PersonaId): Persona {
  return PERSONAS[id];
}

export function listPersonas(): Persona[] {
  return Object.values(PERSONAS);
}

export function isPersonaId(value: string): value is PersonaId {
  return value in PERSONAS;
}
