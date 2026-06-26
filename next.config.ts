import path from "node:path";
import type { NextConfig } from "next";

import { supabaseStorageHost } from "@/lib/supabase/env";

const storageHost = supabaseStorageHost();

const config: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    ...(storageHost
      ? {
          remotePatterns: [
            {
              protocol: "https",
              hostname: storageHost,
              pathname: "/storage/v1/object/public/**",
            },
          ],
        }
      : {}),
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  // Pin the Turbopack workspace root to *this* project directory.
  // Without this, Next.js infers the root from the nearest lockfile, which
  // on some systems is an unrelated lockfile higher up the path.
  turbopack: {
    root: path.resolve(__dirname),
  },
  // Skip Next's bundled tsc pass on `next build` — we run `pnpm typecheck`
  // explicitly in CI / before pushing. This avoids the long post-compile hang
  // we hit on Windows during the first build.
  typescript: {
    ignoreBuildErrors: false,
    tsconfigPath: "tsconfig.json",
  },
};

export default config;
