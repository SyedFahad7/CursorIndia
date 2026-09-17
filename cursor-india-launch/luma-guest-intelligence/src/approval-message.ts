import { serverConfig } from "./config.js";
import type { Tier } from "./types.js";

export function approvalMessageForTier(tier: Tier, name?: string): string {
  if (tier !== "approve") return "";

  const first = name?.trim().split(/\s+/)[0];
  const hi = first ? `Hi ${first},` : "Hi,";
  const link = serverConfig.whatsappInviteUrl;

  return `${hi}

You're approved for the event — excited to have you.

Please join the WhatsApp group for updates, venue details, and day-of coordination:
${link}

See you there.`;
}
