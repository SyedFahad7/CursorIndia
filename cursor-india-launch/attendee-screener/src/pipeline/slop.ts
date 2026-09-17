import type { NormalizedAttendee, SlopHeuristics, SlopJudgment } from "../types.js";

const GENERIC_PHRASES = [
  "passionate about",
  "leverage",
  "synerg",
  "cutting-edge",
  "state-of-the-art",
  "robust and scalable",
  "excited to be part",
  "thrilled to join",
  "as an ai language model",
  "in today's rapidly evolving",
  "delve into",
  "landscape of",
  "unlock the potential",
  "game-changer",
  "seamless experience",
  "holistic approach",
  "drive innovation",
  "empower",
  "foster collaboration",
  "best practices",
  "end-to-end",
];

const SPECIFICITY_PATTERNS: Array<{ label: string; re: RegExp }> = [
  { label: "url", re: /https?:\/\/\S+/i },
  { label: "github", re: /github\.com|\bgit\b|\brepo\b/i },
  { label: "stack", re: /\b(typescript|python|react|next\.?js|rust|go|node|kotlin|swift)\b/i },
  { label: "cursor", re: /\bcursor\b|composer|agent mode|background agent/i },
  { label: "company", re: /\b(at|@)\s+[A-Z][A-Za-z0-9.&-]{2,}/ },
  { label: "city", re: /\b(bangalore|bengaluru|hyderabad|mumbai|delhi|pune|chennai|india)\b/i },
  { label: "role", re: /\b(engineer|developer|founder|pm|product manager|sde|intern|student)\b/i },
  { label: "number", re: /\b\d{2,}\b/ },
];

function countMatches(text: string, re: RegExp): number {
  return (text.match(re) || []).length;
}

function jaccard(a: string, b: string): number {
  const ta = new Set(a.toLowerCase().split(/\W+/).filter((t) => t.length > 3));
  const tb = new Set(b.toLowerCase().split(/\W+/).filter((t) => t.length > 3));
  if (ta.size === 0 || tb.size === 0) return 0;
  let inter = 0;
  for (const t of ta) if (tb.has(t)) inter++;
  return inter / (ta.size + tb.size - inter);
}

export function scoreSlopHeuristics(attendee: NormalizedAttendee): SlopHeuristics {
  const text = attendee.responseText || "";
  const answers = attendee.answers.map((a) => a.answer);

  const hyphenCount = countMatches(text, /(?<=\w)-(?=\w)/g);
  const emDashCount = countMatches(text, /[—–]/g) + countMatches(text, /\s-\s/g);
  const bulletLines = text.split("\n").filter((l) => /^\s*[-*•]/.test(l)).length;
  const bulletFarmScore = Math.min(1, bulletLines / 8);

  const lower = text.toLowerCase();
  const genericPhraseHits = GENERIC_PHRASES.filter((p) => lower.includes(p));

  let duplicateFieldPairs = 0;
  for (let i = 0; i < answers.length; i++) {
    for (let j = i + 1; j < answers.length; j++) {
      if (jaccard(answers[i]!, answers[j]!) >= 0.85) duplicateFieldPairs++;
    }
  }

  const lengths = answers.map((a) => a.trim().length);
  const avgAnswerLength =
    lengths.length === 0
      ? 0
      : lengths.reduce((s, n) => s + n, 0) / lengths.length;

  const specificityHits = SPECIFICITY_PATTERNS.filter((p) => p.re.test(text)).map(
    (p) => p.label,
  );

  const hardRejectReasons: string[] = [];
  const totalDashes = hyphenCount + emDashCount;
  const words = text.trim().split(/\s+/).filter(Boolean).length || 1;
  const dashDensity = totalDashes / words;

  if (text.trim().length >= 120 && dashDensity >= 0.08 && genericPhraseHits.length >= 3) {
    hardRejectReasons.push("high hyphen/em-dash density with generic AI phrasing");
  }
  if (bulletFarmScore >= 0.75 && genericPhraseHits.length >= 2 && specificityHits.length === 0) {
    hardRejectReasons.push("bullet-farm answer with no personal specifics");
  }
  if (duplicateFieldPairs >= 1 && genericPhraseHits.length >= 2) {
    hardRejectReasons.push("near-duplicate answers across registration fields");
  }
  if (text.trim().length >= 200 && specificityHits.length === 0 && genericPhraseHits.length >= 4) {
    hardRejectReasons.push("long generic essay with zero concrete signals");
  }

  // Heuristic slop score 0–1
  let heuristicScore = 0;
  heuristicScore += Math.min(0.25, dashDensity * 2);
  heuristicScore += bulletFarmScore * 0.2;
  heuristicScore += Math.min(0.25, genericPhraseHits.length * 0.05);
  heuristicScore += Math.min(0.15, duplicateFieldPairs * 0.1);
  if (avgAnswerLength > 400 && specificityHits.length <= 1) heuristicScore += 0.1;
  if (specificityHits.length === 0 && text.length > 80) heuristicScore += 0.1;
  heuristicScore = Math.max(0, Math.min(1, heuristicScore - specificityHits.length * 0.05));

  return {
    hyphenCount,
    emDashCount,
    bulletFarmScore: Number(bulletFarmScore.toFixed(3)),
    genericPhraseHits,
    duplicateFieldPairs,
    avgAnswerLength: Number(avgAnswerLength.toFixed(1)),
    specificityHits,
    hardReject: hardRejectReasons.length > 0,
    hardRejectReasons,
    heuristicScore: Number(heuristicScore.toFixed(3)),
  };
}

export function heuristicsOnlySlopJudgment(h: SlopHeuristics): SlopJudgment {
  const score = Math.max(0, Math.min(1, 1 - h.heuristicScore));
  return {
    authenticity: score,
    specificity: Math.min(1, h.specificityHits.length / 4),
    isAiSlop: h.hardReject || h.heuristicScore >= 0.65,
    redFlags: [...h.hardRejectReasons, ...h.genericPhraseHits.slice(0, 5)],
    notes: h.hardReject
      ? "Hard-reject heuristics fired; treated as AI slop paste."
      : "LLM skipped; judgment from heuristics only.",
    score,
  };
}
