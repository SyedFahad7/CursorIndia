import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

import { cities } from "@/content/cities";
import type { CitySlug } from "@/lib/types";

const COOKIE_NAME = "ci_admin_session";
const SESSION_DAYS = 7;

export function isAdminConfigured(): boolean {
  return Boolean(
    process.env.ADMIN_SESSION_SECRET?.trim() &&
      process.env.CITY_ADMIN_PASSWORDS?.trim(),
  );
}

function sessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim();
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not set");
  return secret;
}

function parseCityPasswords(): Record<string, string> {
  const raw = process.env.CITY_ADMIN_PASSWORDS?.trim();
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as Record<string, string>;
    return Object.fromEntries(
      Object.entries(parsed).map(([k, v]) => [k.toLowerCase(), String(v)]),
    );
  } catch {
    return {};
  }
}

export function isValidCitySlug(slug: string): slug is CitySlug {
  return cities.some((c) => c.slug === slug);
}

export function verifyCityPassword(city: string, password: string): boolean {
  const expected = parseCityPasswords()[city.toLowerCase()];
  if (!expected) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(password);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function sign(payload: string): string {
  return createHmac("sha256", sessionSecret()).update(payload).digest("base64url");
}

function encodeSession(city: string): string {
  const exp = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const payload = Buffer.from(JSON.stringify({ city: city.toLowerCase(), exp })).toString(
    "base64url",
  );
  return `${payload}.${sign(payload)}`;
}

function decodeSession(token: string): { city: string; exp: number } | null {
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf-8")) as {
      city: string;
      exp: number;
    };
    if (!data.city || typeof data.exp !== "number") return null;
    if (Date.now() > data.exp) return null;
    return data;
  } catch {
    return null;
  }
}

export async function getAdminCity(): Promise<string | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const session = decodeSession(token);
  if (!session || !isValidCitySlug(session.city)) return null;
  return session.city;
}

export async function requireAdminCity(requestedCity: string): Promise<string | null> {
  const city = await getAdminCity();
  if (!city || city !== requestedCity.toLowerCase()) return null;
  return city;
}

export function setAdminSessionCookie(city: string): {
  name: string;
  value: string;
  options: {
    httpOnly: boolean;
    secure: boolean;
    sameSite: "lax";
    path: string;
    maxAge: number;
  };
} {
  return {
    name: COOKIE_NAME,
    value: encodeSession(city),
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_DAYS * 24 * 60 * 60,
    },
  };
}

export function clearAdminSessionCookie(): {
  name: string;
  value: string;
  options: { httpOnly: boolean; path: string; maxAge: number };
} {
  return {
    name: COOKIE_NAME,
    value: "",
    options: { httpOnly: true, path: "/", maxAge: 0 },
  };
}
