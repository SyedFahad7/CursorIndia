import "dotenv/config";
import { enableInsecureTlsIfRequested } from "../src/tls.js";
import { enrichGithub } from "../src/providers/github.js";
import { JsonCache } from "../src/utils/cache.js";

enableInsecureTlsIfRequested();

const handle = process.argv[2] || "cursor";

async function main() {
  if (!process.env.GITHUB_TOKEN) {
    console.error("GITHUB_TOKEN missing");
    process.exit(1);
  }
  const cache = new JsonCache("./out/.cache-smoke");
  const signal = await enrichGithub(`https://github.com/${handle}`, cache);
  console.log(
    JSON.stringify(
      {
        username: signal.username,
        found: signal.found,
        builderScore: signal.builderScore,
        cursorSignals: signal.cursorSignals,
        cursorEvidence: signal.cursorEvidence,
        notes: signal.notes,
      },
      null,
      2,
    ),
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
