import { NextResponse } from "next/server";

import {
  clearAmbassadorSettings,
  clearCitySettings,
  getAdminSettingsPayload,
  saveAmbassadorSettings,
  saveCitySettings,
  validateHttpUrl,
  validateLumaCalendarId,
} from "@/lib/admin-settings";
import { requireAdminCity, isValidCitySlug } from "@/lib/admin-auth";
import { getAmbassadorsByCity } from "@/content/ambassadors";
import { isSupabaseConfigured } from "@/lib/supabase/admin";

interface PutBody {
  city?: string;
  citySettings?: {
    lumaCalendarId?: string;
    lumaPublicUrl?: string;
    reset?: boolean;
  };
  ambassadorSettings?: {
    name?: string;
    photoUrl?: string;
    xUrl?: string;
    linkedinUrl?: string;
    email?: string;
    reset?: boolean;
  };
}

export async function GET(request: Request) {
  const city = new URL(request.url).searchParams.get("city")?.trim().toLowerCase();
  if (!city || !isValidCitySlug(city)) {
    return NextResponse.json({ error: "Unknown city" }, { status: 400 });
  }
  if (!(await requireAdminCity(city))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Storage not configured" }, { status: 503 });
  }
  return NextResponse.json(await getAdminSettingsPayload(city));
}

export async function PUT(request: Request) {
  let body: PutBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const city = body.city?.trim().toLowerCase();
  if (!city || !isValidCitySlug(city)) {
    return NextResponse.json({ error: "Unknown city" }, { status: 400 });
  }
  if (!(await requireAdminCity(city))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Storage not configured" }, { status: 503 });
  }

  try {
    if (body.citySettings?.reset) {
      await clearCitySettings(city);
    } else if (body.citySettings) {
      const calId = body.citySettings.lumaCalendarId?.trim() ?? "";
      const lumaUrl = body.citySettings.lumaPublicUrl?.trim() ?? "";
      if (calId && !validateLumaCalendarId(calId)) {
        return NextResponse.json(
          { error: "Calendar ID must look like cal-Ap2jcMAsVNDdimN" },
          { status: 400 },
        );
      }
      if (lumaUrl && !validateHttpUrl(lumaUrl)) {
        return NextResponse.json({ error: "Luma page must be a valid https URL" }, { status: 400 });
      }
      await saveCitySettings(city, {
        lumaCalendarId: calId || null,
        lumaPublicUrl: lumaUrl || null,
      });
    }

    const primary = getAmbassadorsByCity(city)[0];
    if (body.ambassadorSettings?.reset) {
      await clearAmbassadorSettings(city);
    } else if (body.ambassadorSettings && primary) {
      const s = body.ambassadorSettings;
      const x = s.xUrl?.trim() ?? "";
      const linkedin = s.linkedinUrl?.trim() ?? "";
      if (x && !validateHttpUrl(x)) {
        return NextResponse.json({ error: "X URL must start with https://" }, { status: 400 });
      }
      if (linkedin && !validateHttpUrl(linkedin)) {
        return NextResponse.json({ error: "LinkedIn URL must start with https://" }, { status: 400 });
      }
      await saveAmbassadorSettings(city, primary.handle, {
        name: s.name?.trim() || null,
        photoUrl: s.photoUrl?.trim() || null,
        xUrl: x || null,
        linkedinUrl: linkedin || null,
        email: s.email?.trim() || null,
      });
    }

    return NextResponse.json({ ok: true, ...(await getAdminSettingsPayload(city)) });
  } catch (err) {
    console.error("[admin/settings]", err);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
