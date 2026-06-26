import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import {
  isSupabaseConfigured,
  serviceRoleKey,
  supabaseUrl,
} from "@/lib/supabase/env";
import { devRelaxedFetch } from "@/lib/dev-fetch";

export { isSupabaseConfigured, supabaseStorageHost } from "@/lib/supabase/env";

export const RECAP_PHOTOS_BUCKET = "recap-photos";
export const AMBASSADOR_PHOTOS_BUCKET = "ambassador-photos";

let admin: SupabaseClient | null = null;

/** Server-only client with service role — never expose to the browser. */
export function getSupabaseAdmin(): SupabaseClient {
  if (admin) return admin;
  const relaxedFetch = devRelaxedFetch();
  admin = createClient(supabaseUrl(), serviceRoleKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
    ...(relaxedFetch ? { global: { fetch: relaxedFetch } } : {}),
  });
  return admin;
}

export interface RecapRow {
  event_slug: string;
  city_slug: string;
  summary: string;
  photo_credit: string | null;
  photos: { src: string; alt: string; credit?: string }[];
  updated_at: string;
}
