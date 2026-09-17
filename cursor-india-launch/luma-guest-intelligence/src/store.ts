import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defaultEventConfig } from "./config.js";
import type { EventConfig, GuestInput, ScoredGuest } from "./types.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATA_DIR = path.join(ROOT, "data");
const STATE_PATH = path.join(DATA_DIR, "state.json");

export type AppState = {
  config: EventConfig;
  /** Guests waiting for the next Cursor batch */
  pending: GuestInput[];
  /** Last screened results (demo / local mirror of Notion) */
  screened: ScoredGuest[];
  batchesRun: number;
  updatedAt: string;
};

function emptyState(): AppState {
  return {
    config: defaultEventConfig(),
    pending: [],
    screened: [],
    batchesRun: 0,
    updatedAt: new Date().toISOString(),
  };
}

let memory = emptyState();
let loaded = false;

async function ensureLoaded(): Promise<void> {
  if (loaded) return;
  loaded = true;
  try {
    const raw = await readFile(STATE_PATH, "utf8");
    memory = { ...emptyState(), ...JSON.parse(raw) };
  } catch {
    memory = emptyState();
  }
}

async function persist(): Promise<void> {
  memory.updatedAt = new Date().toISOString();
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(STATE_PATH, JSON.stringify(memory, null, 2), "utf8");
}

export async function getState(): Promise<AppState> {
  await ensureLoaded();
  return structuredClone(memory);
}

export async function updateConfig(
  patch: Partial<EventConfig>,
): Promise<EventConfig> {
  await ensureLoaded();
  memory.config = { ...memory.config, ...patch };
  if (patch.criteria !== undefined) {
    memory.config.criteriaNeeded = patch.criteria.trim().length === 0;
  }
  await persist();
  return structuredClone(memory.config);
}

export async function upsertPending(guest: GuestInput): Promise<{
  pendingCount: number;
  batchReady: boolean;
  criteriaNeeded: boolean;
  config: EventConfig;
}> {
  await ensureLoaded();
  const idx = memory.pending.findIndex(
    (g) => g.id === guest.id || g.email.toLowerCase() === guest.email.toLowerCase(),
  );
  if (idx >= 0) memory.pending[idx] = guest;
  else memory.pending.push(guest);

  // Don't double-queue people already screened
  const screenedEmails = new Set(
    memory.screened.map((g) => g.email.toLowerCase()),
  );
  memory.pending = memory.pending.filter(
    (g) => !screenedEmails.has(g.email.toLowerCase()),
  );

  await persist();
  return {
    pendingCount: memory.pending.length,
    batchReady: memory.pending.length >= memory.config.batchSize,
    criteriaNeeded: memory.config.criteriaNeeded,
    config: structuredClone(memory.config),
  };
}

export async function takeBatch(): Promise<{
  guests: GuestInput[];
  config: EventConfig;
  alreadyAccepted: number;
}> {
  await ensureLoaded();
  const size = memory.config.batchSize;
  const guests = memory.pending.splice(0, size);
  await persist();
  const alreadyAccepted = memory.screened.filter(
    (g) => g.tier === "approve",
  ).length;
  return {
    guests,
    config: structuredClone(memory.config),
    alreadyAccepted,
  };
}

export async function saveScreened(results: ScoredGuest[]): Promise<void> {
  await ensureLoaded();
  for (const r of results) {
    const idx = memory.screened.findIndex(
      (g) => g.id === r.id || g.email.toLowerCase() === r.email.toLowerCase(),
    );
    if (idx >= 0) memory.screened[idx] = r;
    else memory.screened.push(r);
  }
  memory.batchesRun += 1;
  await persist();
}

export async function resetDemoState(): Promise<AppState> {
  memory = emptyState();
  await persist();
  return structuredClone(memory);
}
