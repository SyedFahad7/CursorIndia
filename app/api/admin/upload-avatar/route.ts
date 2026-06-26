import { NextResponse } from "next/server";

import { requireAdminCity, isValidCitySlug } from "@/lib/admin-auth";
import {
  getSupabaseAdmin,
  isSupabaseConfigured,
  AMBASSADOR_PHOTOS_BUCKET,
} from "@/lib/supabase/admin";

const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

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
    default:
      return file.type || null;
  }
}

export async function POST(request: Request) {
  const form = await request.formData();
  const city = String(form.get("city") ?? "")
    .trim()
    .toLowerCase();
  const file = form.get("file");

  if (!city || !isValidCitySlug(city)) {
    return NextResponse.json({ error: "Missing city" }, { status: 400 });
  }
  if (!(await requireAdminCity(city))) {
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
    return NextResponse.json({ error: "Use JPG, PNG, or WebP" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File too large (max 8 MB)" }, { status: 400 });
  }

  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 60);
  const path = `${city}/headshot-${Date.now()}-${safe}`;
  const bytes = Buffer.from(await file.arrayBuffer());

  try {
    const sb = getSupabaseAdmin();
    const { error } = await sb.storage.from(AMBASSADOR_PHOTOS_BUCKET).upload(path, bytes, {
      contentType,
      upsert: true,
    });
    if (error) {
      console.error("[upload-avatar]", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    const { data } = sb.storage.from(AMBASSADOR_PHOTOS_BUCKET).getPublicUrl(path);
    return NextResponse.json({ ok: true, src: data.publicUrl });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    console.error("[upload-avatar]", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
