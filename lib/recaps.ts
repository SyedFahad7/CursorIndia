import "server-only";

import { cache } from "react";

import type { CitySlug, EventPhoto, EventRecap } from "@/lib/types";
import {
  getSupabaseAdmin,
  isSupabaseConfigured,
  type RecapRow,
} from "@/lib/supabase/admin";

function rowToRecap(row: RecapRow): EventRecap {
  return {
    eventSlug: row.event_slug,
    city: row.city_slug as CitySlug,
    summary: row.summary,
    photoCredit: row.photo_credit ?? undefined,
    photos: (row.photos ?? []) as EventPhoto[],
    updatedAt: row.updated_at,
  };
}

export function photoStoragePath(
  city: string,
  eventSlug: string,
  filename: string,
): string {
  const safe = filename.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 80);
  return `${city}/${eventSlug}/${Date.now()}-${safe}`;
}

export const getRecapBySlug = cache(async (eventSlug: string): Promise<EventRecap | null> => {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await getSupabaseAdmin()
    .from("recaps")
    .select("*")
    .eq("event_slug", eventSlug)
    .maybeSingle();
  if (error || !data) return null;
  return rowToRecap(data as RecapRow);
});

export const getAllRecaps = cache(async (): Promise<EventRecap[]> => {
  if (!isSupabaseConfigured()) return [];
  const { data, error } = await getSupabaseAdmin()
    .from("recaps")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error || !data) return [];
  return (data as RecapRow[]).map(rowToRecap);
});

export async function getRecapsByCity(city: CitySlug): Promise<EventRecap[]> {
  if (!isSupabaseConfigured()) return [];
  const { data, error } = await getSupabaseAdmin()
    .from("recaps")
    .select("*")
    .eq("city_slug", city)
    .order("updated_at", { ascending: false });
  if (error || !data) return [];
  return (data as RecapRow[]).map(rowToRecap);
}

export async function getRecapMap(): Promise<Map<string, EventRecap>> {
  const all = await getAllRecaps();
  return new Map(all.map((r) => [r.eventSlug, r]));
}

export async function saveRecap(recap: EventRecap): Promise<void> {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured");
  }
  const updatedAt = new Date().toISOString();
  const { error } = await getSupabaseAdmin()
    .from("recaps")
    .upsert(
      {
        event_slug: recap.eventSlug,
        city_slug: recap.city,
        summary: recap.summary,
        photo_credit: recap.photoCredit ?? null,
        photos: recap.photos,
        updated_at: updatedAt,
      },
      { onConflict: "event_slug" },
    );
  if (error) throw error;
}
