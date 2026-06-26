import "server-only";

import { cache } from "react";

import { getCityBySlug } from "@/content/cities";
import { getAmbassadorsByCity } from "@/content/ambassadors";
import type { Ambassador, City, SocialLinks } from "@/lib/types";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/admin";

export interface CitySettingsRow {
  city_slug: string;
  luma_calendar_id: string | null;
  luma_public_url: string | null;
  updated_at: string;
}

export interface AmbassadorSettingsRow {
  city_slug: string;
  handle: string | null;
  name: string | null;
  photo_url: string | null;
  x_url: string | null;
  linkedin_url: string | null;
  email: string | null;
  updated_at: string;
}

export interface CitySettingsInput {
  lumaCalendarId?: string | null;
  lumaPublicUrl?: string | null;
}

export interface AmbassadorSettingsInput {
  name?: string | null;
  photoUrl?: string | null;
  xUrl?: string | null;
  linkedinUrl?: string | null;
  email?: string | null;
}

export const getCitySettingsRow = cache(
  async (citySlug: string): Promise<CitySettingsRow | null> => {
    if (!isSupabaseConfigured()) return null;
    const { data, error } = await getSupabaseAdmin()
      .from("city_settings")
      .select("*")
      .eq("city_slug", citySlug)
      .maybeSingle();
    if (error || !data) return null;
    return data as CitySettingsRow;
  },
);

export const getAmbassadorSettingsRow = cache(
  async (citySlug: string): Promise<AmbassadorSettingsRow | null> => {
    if (!isSupabaseConfigured()) return null;
    const { data, error } = await getSupabaseAdmin()
      .from("ambassador_settings")
      .select("*")
      .eq("city_slug", citySlug)
      .maybeSingle();
    if (error || !data) return null;
    return data as AmbassadorSettingsRow;
  },
);

function mergeLinks(base: SocialLinks, row: AmbassadorSettingsRow | null): SocialLinks {
  if (!row) return base;
  return {
    x: row.x_url ?? base.x,
    linkedin: row.linkedin_url ?? base.linkedin,
    email: row.email ?? base.email,
  };
}

function mergeAmbassador(base: Ambassador, row: AmbassadorSettingsRow | null): Ambassador {
  if (!row) return base;
  return {
    ...base,
    name: row.name?.trim() ? row.name : base.name,
    photo: row.photo_url?.trim() ? row.photo_url : base.photo,
    links: mergeLinks(base.links, row),
  };
}

/** City with DB overrides for Luma calendar + public page URL. */
export async function getCityForDisplay(slug: string): Promise<City | undefined> {
  const city = getCityBySlug(slug);
  if (!city) return undefined;
  const row = await getCitySettingsRow(slug);
  if (!row) return city;
  return {
    ...city,
    lumaCalendarId: row.luma_calendar_id?.trim() || city.lumaCalendarId,
    links: {
      ...city.links,
      luma: row.luma_public_url?.trim() || city.links?.luma,
    },
  };
}

/** Resolved Luma calendar ID (DB wins over content file). */
export async function getLumaCalendarId(citySlug: string): Promise<string | undefined> {
  const row = await getCitySettingsRow(citySlug);
  if (row?.luma_calendar_id?.trim()) return row.luma_calendar_id.trim();
  return getCityBySlug(citySlug)?.lumaCalendarId;
}

export async function getAmbassadorsForCity(citySlug: string): Promise<Ambassador[]> {
  const base = getAmbassadorsByCity(citySlug);
  if (base.length === 0) return [];
  const row = await getAmbassadorSettingsRow(citySlug);
  if (!row) return base;
  return base.map((a) => {
    if (row.handle && a.handle !== row.handle) return a;
    return mergeAmbassador(a, row);
  });
}

export async function getAllAmbassadorsMerged(): Promise<Ambassador[]> {
  const { ambassadors } = await import("@/content/ambassadors");
  const rows = isSupabaseConfigured()
    ? ((await getSupabaseAdmin().from("ambassador_settings").select("*")).data ?? [])
    : [];
  const byCity = new Map(
    (rows as AmbassadorSettingsRow[]).map((r) => [r.city_slug, r]),
  );
  return ambassadors.map((a) => mergeAmbassador(a, byCity.get(a.city) ?? null));
}

export async function saveCitySettings(
  citySlug: string,
  input: CitySettingsInput,
): Promise<void> {
  if (!isSupabaseConfigured()) throw new Error("Supabase is not configured");
  const payload = {
    city_slug: citySlug,
    luma_calendar_id: normalizeOptional(input.lumaCalendarId),
    luma_public_url: normalizeOptional(input.lumaPublicUrl),
    updated_at: new Date().toISOString(),
  };
  const { error } = await getSupabaseAdmin()
    .from("city_settings")
    .upsert(payload, { onConflict: "city_slug" });
  if (error) throw error;
}

export async function saveAmbassadorSettings(
  citySlug: string,
  handle: string,
  input: AmbassadorSettingsInput,
): Promise<void> {
  if (!isSupabaseConfigured()) throw new Error("Supabase is not configured");
  const payload = {
    city_slug: citySlug,
    handle,
    name: normalizeOptional(input.name),
    photo_url: normalizeOptional(input.photoUrl),
    x_url: normalizeOptional(input.xUrl),
    linkedin_url: normalizeOptional(input.linkedinUrl),
    email: normalizeOptional(input.email),
    updated_at: new Date().toISOString(),
  };
  const { error } = await getSupabaseAdmin()
    .from("ambassador_settings")
    .upsert(payload, { onConflict: "city_slug" });
  if (error) throw error;
}

export async function clearCitySettings(citySlug: string): Promise<void> {
  if (!isSupabaseConfigured()) return;
  await getSupabaseAdmin().from("city_settings").delete().eq("city_slug", citySlug);
}

export async function clearAmbassadorSettings(citySlug: string): Promise<void> {
  if (!isSupabaseConfigured()) return;
  await getSupabaseAdmin().from("ambassador_settings").delete().eq("city_slug", citySlug);
}

function normalizeOptional(value: string | null | undefined): string | null {
  if (value === undefined) return null;
  const trimmed = value?.trim() ?? "";
  return trimmed.length > 0 ? trimmed : null;
}

export function validateLumaCalendarId(value: string): boolean {
  return /^cal-[A-Za-z0-9]+$/.test(value.trim());
}

export function validateHttpUrl(value: string): boolean {
  try {
    const u = new URL(value.trim());
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

/** Admin UI: static defaults + current DB values. */
export async function getAdminSettingsPayload(citySlug: string) {
  const city = getCityBySlug(citySlug);
  const ambassadors = getAmbassadorsByCity(citySlug);
  const primary = ambassadors[0];
  const cityRow = await getCitySettingsRow(citySlug);
  const ambassadorRow = await getAmbassadorSettingsRow(citySlug);
  const effectiveCalendarId = await getLumaCalendarId(citySlug);

  return {
    city: {
      slug: citySlug,
      name: city?.name ?? citySlug,
      lumaCalendarId: cityRow?.luma_calendar_id ?? "",
      lumaPublicUrl: cityRow?.luma_public_url ?? "",
      defaultLumaCalendarId: city?.lumaCalendarId ?? "",
      defaultLumaPublicUrl: city?.links?.luma ?? "",
      effectiveLumaCalendarId: effectiveCalendarId ?? "",
      hasDbOverride: Boolean(cityRow),
    },
    ambassador: primary
      ? {
          handle: primary.handle,
          name: ambassadorRow?.name ?? primary.name,
          photoUrl: ambassadorRow?.photo_url ?? primary.photo,
          xUrl: ambassadorRow?.x_url ?? primary.links.x ?? "",
          linkedinUrl: ambassadorRow?.linkedin_url ?? primary.links.linkedin ?? "",
          email: ambassadorRow?.email ?? primary.links.email ?? "",
          defaults: {
            name: primary.name,
            photoUrl: primary.photo,
            xUrl: primary.links.x ?? "",
            linkedinUrl: primary.links.linkedin ?? "",
            email: primary.links.email ?? "",
          },
          hasDbOverride: Boolean(ambassadorRow),
        }
      : null,
  };
}
