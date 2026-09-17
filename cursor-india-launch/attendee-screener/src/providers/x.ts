import type { XSignal } from "../types.js";
import { extractXHandle } from "../utils/urls.js";
import { JsonCache, stableHash } from "../utils/cache.js";

/**
 * Best-effort X/Twitter presence. No API key required.
 * Uses public syndication endpoint when available; never fails the pipeline.
 */
export async function enrichX(
  urlOrHandle: string | undefined,
  cache: JsonCache,
  enabled: boolean,
): Promise<XSignal> {
  const handle = extractXHandle(urlOrHandle);
  if (!handle) {
    return {
      found: false,
      notes: ["No X/Twitter URL/handle provided"],
      presenceScore: 0,
    };
  }

  const base: XSignal = {
    handle,
    url: `https://x.com/${handle}`,
    found: false,
    notes: [],
    presenceScore: 0.15,
  };

  if (!enabled) {
    return {
      ...base,
      notes: ["X enrichment disabled; handle recorded only"],
    };
  }

  const cacheKey = `x_${stableHash(handle.toLowerCase())}`;
  const cached = await cache.get<XSignal>(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(
      `https://cdn.syndication.twimg.com/widgets/followbutton/info.json?screen_names=${encodeURIComponent(handle)}`,
      {
        headers: { "user-agent": "cursor-india-attendee-screener" },
        signal: AbortSignal.timeout(8000),
      },
    );

    if (!res.ok) throw new Error(`X lookup HTTP ${res.status}`);
    const data = (await res.json()) as Array<{
      screen_name?: string;
      name?: string;
      description?: string;
      followers_count?: number;
    }>;

    const row = data?.[0];
    if (!row) {
      const miss = {
        ...base,
        notes: ["Handle not resolved via public endpoint"],
        presenceScore: 0.1,
      };
      await cache.set(cacheKey, miss);
      return miss;
    }

    const followers = row.followers_count ?? 0;
    let presenceScore = 0.35;
    if (followers >= 50) presenceScore += 0.15;
    if (followers >= 500) presenceScore += 0.15;
    if ((row.description ?? "").trim().length > 20) presenceScore += 0.15;
    presenceScore = Math.min(1, presenceScore);

    const signal: XSignal = {
      handle: row.screen_name ?? handle,
      url: `https://x.com/${row.screen_name ?? handle}`,
      found: true,
      displayName: row.name,
      bio: row.description,
      presenceScore: Number(presenceScore.toFixed(3)),
      notes: [],
    };
    await cache.set(cacheKey, signal);
    return signal;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const signal: XSignal = {
      ...base,
      error: message,
      notes: ["X enrichment failed; handle kept"],
    };
    await cache.set(cacheKey, signal);
    return signal;
  }
}
