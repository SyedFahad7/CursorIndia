/**
 * Some Windows networks (AV / SSL inspection) break Node's cert store while
 * browsers/PowerShell still work. Opt-in via SCREEN_INSECURE_TLS=1 in .env.
 */
export function enableInsecureTlsIfRequested(): void {
  if (process.env.SCREEN_INSECURE_TLS === "1") {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    console.warn(
      "SCREEN_INSECURE_TLS=1 — TLS verification disabled for this process (local use only).",
    );
  }
}
