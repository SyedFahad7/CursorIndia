import "dotenv/config";
import { Agent, CursorAgentError } from "@cursor/sdk";
import { enableInsecureTlsIfRequested } from "../src/tls.js";

enableInsecureTlsIfRequested();

async function main() {
  const apiKey = process.env.CURSOR_API_KEY;
  if (!apiKey) {
    console.error("No CURSOR_API_KEY");
    process.exit(1);
  }
  console.log("key_prefix=", apiKey.slice(0, 6));
  console.log("model=", process.env.CURSOR_MODEL || "composer-2.5");

  try {
    const result = await Agent.prompt(
      "Reply with exactly the word OK and nothing else.",
      {
        apiKey,
        model: { id: process.env.CURSOR_MODEL || "composer-2.5" },
        local: { cwd: process.cwd(), settingSources: [] },
      },
    );
    console.log("status=", result.status);
    console.log("result=", result.result);
  } catch (err) {
    if (err instanceof CursorAgentError) {
      console.error(
        "CursorAgentError:",
        err.message,
        "retryable=",
        err.isRetryable,
      );
    } else {
      console.error(err);
    }
    process.exit(1);
  }
}

main();
