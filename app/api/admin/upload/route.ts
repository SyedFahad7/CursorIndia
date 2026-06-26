import { NextResponse } from "next/server";

import { requireAdminCity, isValidCitySlug } from "@/lib/admin-auth";
import { photoStoragePath } from "@/lib/recaps";
import { getSupabaseAdmin, isSupabaseConfigured, RECAP_PHOTOS_BUCKET } from "@/lib/supabase/admin";

const MAX_BYTES = 12 * 1024 * 1024;
const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
]);

function guessMimeType(file: File): string | null {
  if (file.type && ALLOWED.has(file.type)) return file.type;
  const ext = file.name.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "avif":
      return "image/avif";
    case "gif":
      return "image/gif";
    default:
      return file.type || null;
  }
}

export async function POST(request: Request) {
  const form = await request.formData();
  const city = String(form.get("city") ?? "")
    .trim()
    .toLowerCase();
  const eventSlug = String(form.get("eventSlug") ?? "").trim();
  const file = form.get("file");

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

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const contentType = guessMimeType(file);
  if (!contentType || !ALLOWED.has(contentType)) {
    return NextResponse.json(
      { error: `Unsupported image type (${file.type || file.name}). Use JPG, PNG, or WebP.` },
      { status: 400 },
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 12 MB)" }, { status: 400 });
  }

  const path = photoStoragePath(city, eventSlug, file.name);
  const bytes = Buffer.from(await file.arrayBuffer());

  try {
    const sb = getSupabaseAdmin();
    const { error } = await sb.storage.from(RECAP_PHOTOS_BUCKET).upload(path, bytes, {
      contentType,
      upsert: false,
    });
    if (error) {
      console.error("[upload]", error.message, error);
      const hint =
        error.message.includes("Bucket not found") || error.message.includes("bucket")
          ? " Run supabase/migrations/001_recaps.sql in Supabase SQL Editor."
          : "";
      return NextResponse.json(
        { error: `Upload failed: ${error.message}${hint}` },
        { status: 500 },
      );
    }
    const { data } = sb.storage.from(RECAP_PHOTOS_BUCKET).getPublicUrl(path);
    return NextResponse.json({
      ok: true,
      path,
      src: data.publicUrl,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    console.error("[upload]", err);
    const tlsHint =
      message.includes("certificate") || message.includes("UNABLE_TO_VERIFY")
        ? " Try DEV_RELAX_TLS=1 in .env and restart pnpm dev."
        : "";
    return NextResponse.json({ error: `${message}${tlsHint}` }, { status: 500 });
  }
}
