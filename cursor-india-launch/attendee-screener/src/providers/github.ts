import { Octokit } from "octokit";
import type { CursorGithubEvidence, GithubSignal } from "../types.js";
import { extractGithubUsername } from "../utils/urls.js";
import { JsonCache, stableHash } from "../utils/cache.js";

function daysSince(iso?: string | null): number | null {
  if (!iso) return null;
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return null;
  return Math.floor((Date.now() - t) / (1000 * 60 * 60 * 24));
}

/**
 * Search public code for Cursor project artifacts under a user.
 * Requires GITHUB_TOKEN for reliable code search.
 */
export async function searchCursorArtifacts(
  octokit: Octokit,
  username: string,
): Promise<CursorGithubEvidence> {
  const empty: CursorGithubEvidence = {
    usedCursorLikely: false,
    hasCursorDir: false,
    hasCursorRulesFile: false,
    matchCount: 0,
    samplePaths: [],
  };

  if (!process.env.GITHUB_TOKEN) {
    return {
      ...empty,
      searchError: "GITHUB_TOKEN missing — skipped .cursor code search",
    };
  }

  // Code search is capped at ~10 req/min and aggressive use can trip secondary limits.
  // Mass event screens should set GITHUB_SKIP_CODE_SEARCH=1 (or omit GITHUB_CODE_SEARCH=1).
  const codeSearchOn =
    process.env.GITHUB_CODE_SEARCH === "1" &&
    process.env.GITHUB_SKIP_CODE_SEARCH !== "1";
  if (!codeSearchOn) {
    return {
      ...empty,
      searchError:
        "code search off (set GITHUB_CODE_SEARCH=1 to enable; keep off for mass screens)",
    };
  }

  // GitHub code search does not accept parenthesized OR reliably — run two simple queries.
  const queries = [
    `user:${username} path:.cursor`,
    `user:${username} filename:.cursorrules`,
  ];

  try {
    const results = [];
    for (const q of queries) {
      const { data } = await octokit.rest.search.code({
        q,
        per_page: 10,
      });
      results.push(data);
      // Secondary rate limit is tight on code search — brief pause between queries
      await new Promise((r) => setTimeout(r, 350));
    }

    const items = results.flatMap((r) => r.items ?? []);
    const matchCount = results.reduce(
      (n, r) => n + (r.total_count ?? 0),
      0,
    );
    const samplePaths = [
      ...new Set(
        items.map((item) => {
          const repo = item.repository?.full_name || "";
          const pathPart = item.path || item.name || "";
          return repo ? `${repo}/${pathPart}` : pathPart;
        }),
      ),
    ]
      .filter(Boolean)
      .slice(0, 8);

    const hasCursorRulesFile = samplePaths.some((p) =>
      /(^|\/)\.cursorrules$/i.test(p),
    );
    const hasCursorDir = samplePaths.some((p) =>
      /(^|\/)\.cursor(\/|$)/i.test(p),
    );

    return {
      usedCursorLikely: matchCount > 0 || items.length > 0,
      hasCursorDir,
      hasCursorRulesFile,
      matchCount,
      samplePaths,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      ...empty,
      searchError: message.slice(0, 200),
    };
  }
}

export async function enrichGithub(
  urlOrHandle: string | undefined,
  cache: JsonCache,
): Promise<GithubSignal> {
  const username = extractGithubUsername(urlOrHandle);
  if (!username) {
    return {
      found: false,
      topRepos: [],
      cursorSignals: [],
      builderScore: 0,
      notes: ["No GitHub URL/handle provided"],
    };
  }

  // v2 cache — includes .cursor code search
  const cacheKey = `gh_v2_${stableHash(username.toLowerCase())}`;
  const cached = await cache.get<GithubSignal>(cacheKey);
  if (cached) return cached;

  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN || undefined,
    userAgent: "cursor-india-attendee-screener",
  });

  try {
    const { data: user } = await octokit.rest.users.getByUsername({ username });
    const [{ data: repos }, cursorEvidence] = await Promise.all([
      octokit.rest.repos.listForUser({
        username,
        sort: "pushed",
        per_page: 30,
        type: "owner",
      }),
      searchCursorArtifacts(octokit, username),
    ]);

    const owned = repos.filter((r) => !r.fork);
    const topRepos = owned.slice(0, 8).map((r) => ({
      name: r.name,
      stars: r.stargazers_count ?? 0,
      language: r.language ?? undefined,
      description: r.description ?? undefined,
      pushedAt: r.pushed_at ?? undefined,
      fork: Boolean(r.fork),
    }));

    const cursorSignals: string[] = [];
    const hay = owned
      .map((r) => `${r.name} ${r.description ?? ""} ${(r.topics ?? []).join(" ")}`)
      .join("\n")
      .toLowerCase();
    if (/\bcursor\b/.test(hay)) cursorSignals.push("repo mentions cursor");
    if (/agent|composer|mcp/.test(hay)) {
      cursorSignals.push("agent/mcp/composer keywords in repos");
    }

    if (cursorEvidence.usedCursorLikely) {
      cursorSignals.push(
        `public .cursor artifacts (${cursorEvidence.matchCount} match${cursorEvidence.matchCount === 1 ? "" : "es"})`,
      );
      if (cursorEvidence.hasCursorDir) {
        cursorSignals.push("has .cursor/ in public repos");
      }
      if (cursorEvidence.hasCursorRulesFile) {
        cursorSignals.push("has .cursorrules file");
      }
    }

    const recent = owned
      .map((r) => daysSince(r.pushed_at))
      .filter((d): d is number => d != null)
      .sort((a, b) => a - b)[0];

    const accountAgeDays = daysSince(user.created_at) ?? 0;
    let builderScore = 0;
    if ((user.public_repos ?? 0) >= 3) builderScore += 0.2;
    if ((user.public_repos ?? 0) >= 10) builderScore += 0.1;
    if (owned.length >= 2) builderScore += 0.15;
    if (recent != null && recent <= 90) builderScore += 0.2;
    if (recent != null && recent <= 30) builderScore += 0.1;
    if ((user.followers ?? 0) >= 10) builderScore += 0.05;
    if (accountAgeDays >= 180) builderScore += 0.1;
    // Keyword-only mentions are a small bump; committed .cursor is stronger
    if (cursorEvidence.usedCursorLikely) builderScore += 0.2;
    else if (cursorSignals.some((s) => s.startsWith("repo mentions"))) {
      builderScore += 0.1;
    }
    const starSum = owned.reduce((s, r) => s + (r.stargazers_count ?? 0), 0);
    if (starSum >= 5) builderScore += 0.05;
    builderScore = Math.max(0, Math.min(1, builderScore));

    const notes: string[] = [];
    if ((user.public_repos ?? 0) === 0) notes.push("zero public repos");
    if (recent != null && recent > 365) notes.push("no pushes in 1y+");
    if (accountAgeDays < 60 && (user.public_repos ?? 0) < 2) {
      notes.push("very new account with little activity");
    }
    if (cursorEvidence.usedCursorLikely) {
      notes.push(
        `Likely Cursor user (public .cursor evidence; sample: ${cursorEvidence.samplePaths[0] || "n/a"})`,
      );
    } else if (cursorEvidence.searchError) {
      notes.push(`Cursor code search: ${cursorEvidence.searchError}`);
    } else {
      notes.push(
        "No public .cursor / .cursorrules found (not proof they never used Cursor)",
      );
    }

    const signal: GithubSignal = {
      username,
      url: user.html_url,
      found: true,
      publicRepos: user.public_repos,
      followers: user.followers,
      accountAgeDays,
      recentCommitDays: recent ?? null,
      topRepos,
      cursorSignals,
      cursorEvidence,
      builderScore: Number(builderScore.toFixed(3)),
      notes,
    };
    // Gentle pacing for mass screens (avoids secondary rate limits / abuse flags)
    const delayMs = Number(process.env.GITHUB_MIN_DELAY_MS || 200);
    if (delayMs > 0) await new Promise((r) => setTimeout(r, delayMs));

    await cache.set(cacheKey, signal);
    return signal;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const signal: GithubSignal = {
      username,
      url: `https://github.com/${username}`,
      found: false,
      topRepos: [],
      cursorSignals: [],
      builderScore: 0.35,
      notes: [
        "GitHub lookup failed; URL kept with neutral prior",
        message.includes("certificate")
          ? "TLS/certificate issue — set NODE_EXTRA_CA_CERTS or GITHUB_TOKEN and retry"
          : message,
      ],
      error: message,
    };
    await cache.set(cacheKey, signal);
    return signal;
  }
}

/** Deterministic fixtures for offline / eval runs */
export function offlineGithub(urlOrHandle: string | undefined): GithubSignal {
  const username = extractGithubUsername(urlOrHandle);
  if (!username) {
    return {
      found: false,
      topRepos: [],
      cursorSignals: [],
      builderScore: 0,
      notes: ["No GitHub URL/handle provided"],
    };
  }

  const fixtures: Record<string, Partial<GithubSignal>> = {
    torvalds: {
      found: true,
      publicRepos: 10,
      followers: 200000,
      accountAgeDays: 5000,
      recentCommitDays: 7,
      builderScore: 0.95,
      topRepos: [
        {
          name: "linux",
          stars: 200000,
          language: "C",
          description: "Linux kernel source tree",
          fork: false,
        },
      ],
      cursorSignals: [],
      cursorEvidence: {
        usedCursorLikely: false,
        hasCursorDir: false,
        hasCursorRulesFile: false,
        matchCount: 0,
        samplePaths: [],
      },
      notes: ["offline fixture"],
    },
    gaearon: {
      found: true,
      publicRepos: 80,
      followers: 80000,
      accountAgeDays: 4000,
      recentCommitDays: 14,
      builderScore: 0.9,
      topRepos: [
        {
          name: "overreacted.io",
          stars: 7000,
          language: "JavaScript",
          fork: false,
        },
      ],
      cursorSignals: [],
      notes: ["offline fixture"],
    },
    ghost: {
      found: true,
      publicRepos: 0,
      followers: 0,
      accountAgeDays: 4000,
      recentCommitDays: null,
      builderScore: 0.05,
      topRepos: [],
      cursorSignals: [],
      notes: ["offline fixture — empty profile"],
    },
  };

  const hit = fixtures[username.toLowerCase()];
  if (!hit) {
    return {
      username,
      url: `https://github.com/${username}`,
      found: true,
      publicRepos: 4,
      followers: 3,
      accountAgeDays: 400,
      recentCommitDays: 40,
      topRepos: [
        {
          name: "demo-app",
          stars: 2,
          language: "TypeScript",
          description: "side project",
          fork: false,
        },
      ],
      cursorSignals: [
        "repo mentions cursor",
        "public .cursor artifacts (2 matches)",
        "has .cursor/ in public repos",
      ],
      cursorEvidence: {
        usedCursorLikely: true,
        hasCursorDir: true,
        hasCursorRulesFile: false,
        matchCount: 2,
        samplePaths: [`${username}/demo-app/.cursor/rules/project.mdc`],
      },
      builderScore: 0.7,
      notes: ["offline fixture — generic builder with .cursor evidence"],
    };
  }

  return {
    username,
    url: `https://github.com/${username}`,
    topRepos: [],
    cursorSignals: [],
    builderScore: 0,
    notes: [],
    ...hit,
    found: hit.found ?? true,
  };
}
