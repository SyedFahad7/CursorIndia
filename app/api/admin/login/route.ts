import { NextResponse } from "next/server";

import {
  isValidCitySlug,
  setAdminSessionCookie,
  verifyCityPassword,
  isAdminConfigured,
} from "@/lib/admin-auth";

interface LoginBody {
  city?: string;
  password?: string;
}

export async function POST(request: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      { error: "Admin is not configured on this deployment" },
      { status: 503 },
    );
  }

  let body: LoginBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const city = body.city?.trim().toLowerCase();
  const password = body.password ?? "";

  if (!city || !isValidCitySlug(city)) {
    return NextResponse.json({ error: "Unknown city" }, { status: 400 });
  }

  if (!verifyCityPassword(city, password)) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const cookie = setAdminSessionCookie(city);
  const res = NextResponse.json({ ok: true, city });
  res.cookies.set(cookie.name, cookie.value, cookie.options);
  return res;
}
