import { NextResponse } from "next/server";

import { requireAdminCity, isValidCitySlug } from "@/lib/admin-auth";
import { getRecapsByCity, saveRecap } from "@/lib/recaps";
import { isSupabaseConfigured } from "@/lib/supabase/admin";
import type { EventPhoto, EventRecap } from "@/lib/types";

interface SaveRecapBody {
  eventSlug?: string;
  city?: string;
  summary?: string;
  photoCredit?: string;
  photos?: EventPhoto[];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city")?.trim().toLowerCase();

  if (!city || !isValidCitySlug(city)) {
    return NextResponse.json({ error: "Unknown city" }, { status: 400 });
  }

  const sessionCity = await requireAdminCity(city);
  if (!sessionCity) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Storage not configured" }, { status: 503 });
  }

  const recaps = await getRecapsByCity(city);
  return NextResponse.json({ recaps });
}

export async function PUT(request: Request) {
  let body: SaveRecapBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const city = body.city?.trim().toLowerCase();
  const eventSlug = body.eventSlug?.trim();

  if (!city || !isValidCitySlug(city) || !eventSlug) {
    return NextResponse.json({ error: "Missing city or eventSlug" }, { status: 400 });
  }

  const sessionCity = await requireAdminCity(city);
  if (!sessionCity) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Storage not configured" }, { status: 503 });
  }

  const summary = body.summary?.trim() ?? "";
  const photos = Array.isArray(body.photos) ? body.photos : [];
  const photoCredit = body.photoCredit?.trim() || undefined;

  if (!summary && photos.length === 0) {
    return NextResponse.json(
      { error: "Add a summary or at least one photo" },
      { status: 400 },
    );
  }

  const recap: EventRecap = {
    eventSlug,
    city,
    summary,
    photoCredit,
    photos: photos.map((p, i) => ({
      src: p.src,
      alt: p.alt?.trim() || `Event photo ${i + 1}`,
      credit: p.credit,
    })),
    updatedAt: new Date().toISOString(),
  };

  try {
    await saveRecap(recap);
    return NextResponse.json({ ok: true, recap });
  } catch {
    return NextResponse.json({ error: "Failed to save recap" }, { status: 500 });
  }
}
