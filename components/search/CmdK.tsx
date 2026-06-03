import { buildSearchIndex } from "@/lib/search";
import { getDict, getServerLocale } from "@/lib/i18n/server";
import { CmdKDialog } from "./CmdKDialog";

/**
 * Server-rendered wrapper that builds the search index (curated content
 * merged with live Luma events) and passes it to the client component.
 * The index is locale-aware so titles match what the rest of the site renders,
 * while keywords include both English and localized forms for searchability.
 */
export async function CmdK() {
  const [dict, locale] = await Promise.all([getDict(), getServerLocale()]);
  const index = await buildSearchIndex(locale, dict);
  return <CmdKDialog index={index} />;
}
