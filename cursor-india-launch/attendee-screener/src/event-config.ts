import { readFile } from "node:fs/promises";
import path from "node:path";

export type EventConfig = {
  eventName: string;
  capacity?: number;
  prioritize: string[];
  deprioritize: string[];
  notes: string;
  allowlist: {
    domains: string[];
    emails: string[];
  };
  /** Drop rows already declined in Luma (default true) */
  dropDeclined: boolean;
  /** After scoring, keep only top `capacity` accepts (default true when capacity set) */
  applyCapacity: boolean;
};

const DEFAULTS: EventConfig = {
  eventName: "Cursor event",
  prioritize: [
    "Builders who describe concrete Cursor/AI workflows",
    "People shipping real products or tools",
    "Engineers and technical founders who can contribute",
  ],
  deprioritize: [
    "Spam, gibberish, or empty one-word answers",
    "Recruiters / sales / BD prospecting attendees",
    "Obvious copy-paste / LLM boilerplate with no personal detail",
  ],
  notes: "",
  allowlist: {
    domains: ["anysphere.co", "cursor.com"],
    emails: [],
  },
  dropDeclined: true,
  applyCapacity: true,
};

function asStringList(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.map((x) => String(x).trim()).filter(Boolean);
}

export function formatEventInstructions(cfg: EventConfig, extra = ""): string {
  const parts = [
    `Event: ${cfg.eventName}`,
    cfg.capacity ? `Target approve capacity: ${cfg.capacity}` : "",
    cfg.notes ? `Notes: ${cfg.notes}` : "",
    "Prioritize:",
    ...cfg.prioritize.map((p) => `- ${p}`),
    "Deprioritize:",
    ...cfg.deprioritize.map((p) => `- ${p}`),
    "Missing GitHub/LinkedIn/X alone is not a hard decline reason.",
    extra.trim(),
  ].filter(Boolean);
  return parts.join("\n");
}

export async function loadEventConfig(
  configPath?: string,
): Promise<{ config: EventConfig; path?: string }> {
  if (!configPath) return { config: { ...DEFAULTS } };
  const abs = path.resolve(configPath);
  const raw = JSON.parse(await readFile(abs, "utf8")) as Record<string, unknown>;
  const allow = (raw.allowlist as Record<string, unknown> | undefined) ?? {};
  const ctx = (raw.event_context as Record<string, unknown> | undefined) ?? {};

  const capacityRaw = raw.capacity ?? ctx.capacity;
  const capacity =
    capacityRaw == null || capacityRaw === ""
      ? undefined
      : Number(capacityRaw);

  const config: EventConfig = {
    eventName: String(raw.event_name || raw.eventName || DEFAULTS.eventName),
    capacity:
      capacity != null && Number.isFinite(capacity) && capacity >= 1
        ? Math.floor(capacity)
        : undefined,
    prioritize:
      asStringList(ctx.prioritize).length > 0
        ? asStringList(ctx.prioritize)
        : asStringList(raw.prioritize).length > 0
          ? asStringList(raw.prioritize)
          : DEFAULTS.prioritize,
    deprioritize:
      asStringList(ctx.deprioritize).length > 0
        ? asStringList(ctx.deprioritize)
        : asStringList(raw.deprioritize).length > 0
          ? asStringList(raw.deprioritize)
          : DEFAULTS.deprioritize,
    notes: String(ctx.notes ?? raw.notes ?? ""),
    allowlist: {
      domains: asStringList(allow.domains).map((d) => d.toLowerCase()),
      emails: asStringList(allow.emails).map((e) => e.toLowerCase()),
    },
    dropDeclined: raw.drop_declined === false ? false : DEFAULTS.dropDeclined,
    applyCapacity: raw.apply_capacity === false ? false : DEFAULTS.applyCapacity,
  };

  return { config, path: abs };
}

export function isAllowlisted(
  email: string,
  cfg: EventConfig,
): boolean {
  const em = email.trim().toLowerCase();
  if (!em) return false;
  if (cfg.allowlist.emails.includes(em)) return true;
  const domain = em.includes("@") ? em.split("@")[1]! : "";
  return Boolean(domain && cfg.allowlist.domains.includes(domain));
}
