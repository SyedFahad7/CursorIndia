import "server-only";

let relaxed = false;

/**
 * On some Windows setups (antivirus / proxy SSL inspection) Node rejects
 * outbound HTTPS with UNABLE_TO_VERIFY_LEAF_SIGNATURE. Set DEV_RELAX_TLS=1
 * in .env during local dev only — never in production.
 */
export function devRelaxedFetch(): typeof fetch | undefined {
  if (process.env.NODE_ENV !== "development") return undefined;
  if (process.env.DEV_RELAX_TLS !== "1") return undefined;
  if (!relaxed) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    relaxed = true;
  }
  return fetch;
}
