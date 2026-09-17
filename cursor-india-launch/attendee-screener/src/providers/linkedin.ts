import type { LinkedInSignal, PersonaId } from "../types.js";
import { extractLinkedInId } from "../utils/urls.js";
import { JsonCache, stableHash } from "../utils/cache.js";

type ExaResult = {
  title?: string;
  url?: string;
  text?: string;
  highlights?: string[];
  author?: string;
};

type ExaSearchResponse = {
  results?: ExaResult[];
};

function roleFitFromText(text: string, persona: PersonaId): number {
  const t = text.toLowerCase();
  const checks: Record<PersonaId, string[]> = {
    "cursor-dev": [
      "software",
      "engineer",
      "developer",
      "sde",
      "full stack",
      "backend",
      "frontend",
      "ml engineer",
      "ai engineer",
    ],
    founders: ["founder", "co-founder", "ceo", "cto", "building", "startup"],
    pms: ["product manager", "product lead", "pm ", "head of product", "product owner"],
    mixed: ["engineer", "founder", "product", "developer", "designer", "builder"],
    agents: [
      "agent",
      "engineer",
      "developer",
      "ml",
      "ai",
      "mcp",
      "founder",
      "student",
    ],
  };
  const hits = checks[persona].filter((k) => t.includes(k)).length;
  return Math.min(1, hits / 2);
}

function extractTitles(text: string): string[] {
  const lines = text
    .split(/\n+/)
    .map((l) => l.replace(/^#+\s*/, "").trim())
    .filter((l) => l.length > 3 && l.length < 120);
  return lines.slice(0, 8);
}

async function exaSearch(query: string, apiKey: string): Promise<ExaResult[]> {
  const res = await fetch("https://api.exa.ai/search", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify({
      query,
      type: "auto",
      category: "people",
      numResults: 3,
      contents: {
        text: { maxCharacters: 2500 },
        highlights: { numSentences: 3 },
      },
    }),
    signal: AbortSignal.timeout(20000),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Exa search HTTP ${res.status}: ${body.slice(0, 200)}`);
  }

  const data = (await res.json()) as ExaSearchResponse;
  return data.results ?? [];
}

async function exaFetchUrl(url: string, apiKey: string): Promise<ExaResult | undefined> {
  const res = await fetch("https://api.exa.ai/contents", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify({
      urls: [url],
      text: { maxCharacters: 2500 },
    }),
    signal: AbortSignal.timeout(20000),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Exa contents HTTP ${res.status}: ${body.slice(0, 200)}`);
  }

  const data = (await res.json()) as ExaSearchResponse;
  return data.results?.[0];
}

/**
 * LinkedIn enrichment via Exa (free tier API key).
 * Uses people search + optional URL contents — no RapidAPI.
 */
export async function enrichLinkedIn(
  url: string | undefined,
  persona: PersonaId,
  cache: JsonCache,
  enabled: boolean,
): Promise<LinkedInSignal> {
  const profileId = extractLinkedInId(url);
  if (!profileId) {
    return {
      found: false,
      experienceTitles: [],
      companyHints: [],
      skills: [],
      roleFitScore: 0,
      notes: ["No LinkedIn URL provided"],
    };
  }

  const profileUrl = url ?? `https://www.linkedin.com/in/${profileId}`;
  const base: LinkedInSignal = {
    profileId,
    url: profileUrl,
    found: false,
    experienceTitles: [],
    companyHints: [],
    skills: [],
    roleFitScore: 0.15,
    notes: [],
  };

  if (!enabled) {
    return {
      ...base,
      notes: ["LinkedIn enrichment disabled; URL recorded only"],
    };
  }

  const apiKey = process.env.EXA_API_KEY;
  if (!apiKey) {
    return {
      ...base,
      notes: [
        "EXA_API_KEY not set — LinkedIn URL kept, Exa enrichment skipped (free key: https://dashboard.exa.ai/api-keys)",
      ],
    };
  }

  const cacheKey = `li_exa_${stableHash(profileId.toLowerCase())}`;
  const cached = await cache.get<LinkedInSignal>(cacheKey);
  if (cached) return cached;

  try {
    let page = await exaFetchUrl(profileUrl, apiKey).catch(() => undefined);

    if (!page?.text && !page?.title) {
      const results = await exaSearch(
        `category:people LinkedIn profile ${profileId}`,
        apiKey,
      );
      page =
        results.find((r) =>
          (r.url ?? "").toLowerCase().includes(profileId.toLowerCase()),
        ) ?? results[0];
    }

    const text = [page?.title, page?.text, ...(page?.highlights ?? [])]
      .filter(Boolean)
      .join("\n");

    if (!text.trim()) {
      const miss: LinkedInSignal = {
        ...base,
        notes: ["Exa returned no readable LinkedIn content (profile may be private)"],
      };
      await cache.set(cacheKey, miss);
      return miss;
    }

    const experienceTitles = extractTitles(text);
    const companyHints = Array.from(
      text.matchAll(
        /\b(?:at|@)\s+([A-Z][A-Za-z0-9.&-]{1,40}(?:\s+[A-Z][A-Za-z0-9.&-]{1,40}){0,3})/g,
      ),
    )
      .map((m) => m[1]!)
      .slice(0, 8);

    const signal: LinkedInSignal = {
      profileId,
      url: page?.url ?? profileUrl,
      found: true,
      headline: page?.title,
      summary: text.slice(0, 600),
      experienceTitles,
      companyHints,
      skills: [],
      roleFitScore: Number(roleFitFromText(text, persona).toFixed(3)),
      notes: ["Enriched via Exa (free)"],
    };
    await cache.set(cacheKey, signal);
    return signal;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const signal: LinkedInSignal = {
      ...base,
      error: message,
      notes: ["Exa LinkedIn enrichment failed; URL kept"],
    };
    await cache.set(cacheKey, signal);
    return signal;
  }
}
