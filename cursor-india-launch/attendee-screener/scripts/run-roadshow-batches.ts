/**
 * Serially screen roadshow batches via CLI (does not depend on live UI staying up).
 * UI at :8787 can still hydrate scored.csv from disk for watching.
 *
 *   pnpm exec tsx scripts/run-roadshow-batches.ts --from 5 --to 10
 */
import { spawn } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import path from "node:path";

const BATCH_DIR = path.resolve("./out/roadshow-hyderabad/batches");
const EVENT_CONFIG = path.resolve("./event_config.roadshow.json");
const OUT_ROOT = path.resolve("./out");

function argNum(flag: string): number | undefined {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? Number(process.argv[i + 1]) : undefined;
}

function runScreen(csvPath: string, outDir: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const instructions =
      "Cursor India Roadshow Hyderabad - professionals only. Accept strong builders; reject students/slop/empty.";
    // Invoke node+tsx directly so argv stays intact on Windows (no shell re-tokenize).
    const tsxCli = path.resolve("node_modules/tsx/dist/cli.mjs");
    const args = [
      tsxCli,
      "src/cli.ts",
      "screen",
      "--csv",
      csvPath,
      "--persona",
      "cursor-dev",
      "--concurrency",
      "1",
      "--event-config",
      EVENT_CONFIG,
      "--out",
      outDir,
      "--instructions",
      instructions,
    ];
    if (existsSync(path.join(outDir, "scored.csv"))) {
      args.push("--resume");
    }

    console.log(
      `\n> node ${args.map((a) => (/\s/.test(a) ? JSON.stringify(a) : a)).join(" ")}`,
    );
    const child = spawn(process.execPath, args, {
      cwd: process.cwd(),
      env: {
        ...process.env,
        GITHUB_CODE_SEARCH: "0",
        GITHUB_SKIP_CODE_SEARCH: "1",
        GITHUB_MIN_DELAY_MS: process.env.GITHUB_MIN_DELAY_MS || "250",
      },
      stdio: "inherit",
      shell: false,
      windowsHide: true,
    });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve(0);
      else reject(new Error(`screen exited with code ${code}`));
    });
  });
}

async function main() {
  const files = readdirSync(BATCH_DIR)
    .filter((f) => /^batch-\d+\.csv$/i.test(f))
    .sort();
  const from = argNum("--from") ?? 1;
  const to = argNum("--to") ?? files.length;
  const selected = files.filter((f) => {
    const n = Number(f.match(/batch-(\d+)/i)?.[1] || 0);
    return n >= from && n <= to;
  });

  console.log(
    JSON.stringify(
      {
        mode: "cli-serial",
        batches: selected,
        githubCodeSearch: "OFF",
        note: "Independent of live UI. Refresh UI to hydrate results from disk.",
      },
      null,
      2,
    ),
  );

  for (const file of selected) {
    const n = file.match(/batch-(\d+)/i)?.[1] || "xx";
    const csvPath = path.join(BATCH_DIR, file);
    const outDir = path.join(OUT_ROOT, `roadshow-batch-${n}`);
    console.log(`\n=== ${file} → ${outDir} ===`);
    await runScreen(csvPath, outDir);
    console.log(`=== done ${file} ===`);
  }

  console.log("\nAll selected batches finished.");
  console.log("Merge: pnpm exec tsx scripts/merge-roadshow-accepts.ts");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
