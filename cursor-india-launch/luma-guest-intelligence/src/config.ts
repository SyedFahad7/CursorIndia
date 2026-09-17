import "dotenv/config";
import type { EventConfig } from "./types.js";

export function env(name: string, fallback?: string): string {
  const v = process.env[name]?.trim();
  if (v) return v;
  if (fallback !== undefined) return fallback;
  throw new Error(`Missing env ${name}`);
}

export function optionalEnv(name: string, fallback = ""): string {
  return process.env[name]?.trim() || fallback;
}

export const serverConfig = {
  port: Number(process.env.PORT || 8790),
  apiKey: optionalEnv("API_KEY", "dev-local-key"),
  cursorApiKey: optionalEnv("CURSOR_API_KEY"),
  cursorModel: optionalEnv("CURSOR_MODEL", "composer-2.5"),
  whatsappInviteUrl: optionalEnv(
    "WHATSAPP_INVITE_URL",
    "https://chat.whatsapp.com/ESTicelwIAODZXd7haWLQx?s=cl&p=i&ilr=1",
  ),
};

export function defaultEventConfig(): EventConfig {
  return {
    eventName: optionalEnv(
      "DEFAULT_EVENT_NAME",
      "AI Builders Meetup: Build Club Launch [Hyderabad]",
    ),
    batchSize: Number(process.env.DEFAULT_BATCH_SIZE || 5),
    targetAccepts: Number(process.env.DEFAULT_TARGET_ACCEPTS || 80),
    criteria: "",
    criteriaNeeded: true,
  };
}
