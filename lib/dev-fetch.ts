import "server-only";

import { Agent, fetch as undiciFetch } from "undici";
import type { RequestInit as UndiciRequestInit } from "undici";

let agent: Agent | undefined;
let relaxedFetch: typeof fetch | undefined;

function getInsecureAgent(): Agent {
  if (!agent) {
    agent = new Agent({ connect: { rejectUnauthorized: false } });
  }
  return agent;
}

type FetchInit = RequestInit & { next?: { revalidate?: number | false } };

function toUndiciInit(init?: FetchInit): UndiciRequestInit {
  const { next: _next, ...rest } = init ?? {};
  return { ...(rest as UndiciRequestInit), dispatcher: getInsecureAgent() };
}

/**
 * On some Windows setups (antivirus / proxy SSL inspection) Node rejects
 * outbound HTTPS with UNABLE_TO_VERIFY_LEAF_SIGNATURE. Set DEV_RELAX_TLS=1
 * in .env during local dev only — never in production.
 *
 * Uses a scoped undici agent instead of NODE_TLS_REJECT_UNAUTHORIZED so Node
 * does not emit warnings that Next.js forwards to the browser console.
 */
export function devRelaxedFetch(): typeof fetch | undefined {
  if (process.env.NODE_ENV !== "development") return undefined;
  if (process.env.DEV_RELAX_TLS !== "1") return undefined;

  if (!relaxedFetch) {
    relaxedFetch = ((input: RequestInfo | URL, init?: FetchInit) => {
      const url =
        typeof input === "string"
          ? input
          : input instanceof URL
            ? input.href
            : input.url;
      return undiciFetch(url, toUndiciInit(init)) as unknown as Promise<Response>;
    }) as typeof fetch;
  }

  return relaxedFetch;
}
