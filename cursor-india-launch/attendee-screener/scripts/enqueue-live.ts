/**
 * Enqueue a CSV screen onto the live UI server (does not block).
 *
 *   pnpm enqueue -- --csv "./guests.csv" --persona agents --limit 20
 */
import path from "node:path";

function arg(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

const csv = arg("--csv");
if (!csv) {
  console.error(
    'Usage: pnpm enqueue -- --csv "./guests.csv" [--persona agents] [--limit 20] [--concurrency 1] [--instructions "..."] [--skip-llm]',
  );
  process.exit(1);
}

const base = process.env.LIVE_UI_URL || "http://localhost:8787";
const body = {
  csvPath: path.resolve(csv),
  persona: arg("--persona") || "agents",
  instructions: arg("--instructions") || "",
  limit: arg("--limit") ? Number(arg("--limit")) : undefined,
  concurrency: arg("--concurrency") ? Number(arg("--concurrency")) : 1,
  skipLlm: process.argv.includes("--skip-llm"),
  offlineProfiles: process.argv.includes("--offline-profiles"),
  eventConfig: arg("--event-config"),
};

const res = await fetch(`${base}/api/enqueue`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify(body),
});
const data = (await res.json()) as Record<string, unknown>;
if (!res.ok) {
  console.error(data.error || data);
  process.exit(1);
}
console.log(JSON.stringify(data, null, 2));
console.log(`\nWatch live → ${data.ui || base}`);
