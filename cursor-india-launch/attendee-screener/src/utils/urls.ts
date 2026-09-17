export function normalizeUrl(raw?: string): string | undefined {
  if (!raw) return undefined;
  const trimmed = raw.trim();
  if (!trimmed || trimmed === "-" || trimmed.toLowerCase() === "n/a") {
    return undefined;
  }
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^(www\.)?/i.test(trimmed) && trimmed.includes(".")) {
    return `https://${trimmed.replace(/^\/+/, "")}`;
  }
  return trimmed;
}

export function extractLinkedInId(url?: string): string | undefined {
  const normalized = normalizeUrl(url);
  if (!normalized) return undefined;
  const m = normalized.match(
    /linkedin\.com\/(?:in|pub)\/([^\/?#]+)/i,
  );
  return m?.[1] ? decodeURIComponent(m[1]).replace(/\/$/, "") : undefined;
}

export function extractGithubUsername(urlOrHandle?: string): string | undefined {
  if (!urlOrHandle) return undefined;
  const raw = urlOrHandle.trim();
  if (!raw) return undefined;

  if (!/[./]/.test(raw) && /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,38})$/.test(raw)) {
    return raw;
  }

  const normalized = normalizeUrl(raw);
  if (!normalized) return undefined;
  const m = normalized.match(/github\.com\/([^\/?#]+)/i);
  const user = m?.[1];
  if (!user || ["orgs", "settings", "marketplace", "topics"].includes(user)) {
    return undefined;
  }
  return user;
}

export function extractXHandle(urlOrHandle?: string): string | undefined {
  if (!urlOrHandle) return undefined;
  const raw = urlOrHandle.trim().replace(/^@/, "");
  if (!raw) return undefined;

  if (!/[./]/.test(raw) && /^[A-Za-z0-9_]{1,15}$/.test(raw)) {
    return raw;
  }

  const normalized = normalizeUrl(raw);
  if (!normalized) return undefined;
  const m = normalized.match(
    /(?:twitter\.com|x\.com)\/([^\/?#]+)/i,
  );
  const handle = m?.[1];
  if (!handle || ["home", "intent", "share", "i", "explore"].includes(handle)) {
    return undefined;
  }
  return handle;
}

export function findUrlInText(
  text: string,
  kind: "linkedin" | "github" | "x",
): string | undefined {
  const patterns: Record<typeof kind, RegExp> = {
    linkedin: /https?:\/\/(?:www\.)?linkedin\.com\/(?:in|pub)\/[^\s,)"']+/i,
    github: /https?:\/\/(?:www\.)?github\.com\/[^\s,)"']+/i,
    x: /https?:\/\/(?:www\.)?(?:twitter|x)\.com\/[^\s,)"']+/i,
  };
  const m = text.match(patterns[kind]);
  return m?.[0];
}
