import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export function stableHash(input: string): string {
  return createHash("sha256").update(input).digest("hex").slice(0, 16);
}

export class JsonCache {
  constructor(private readonly dir: string) {}

  async get<T>(key: string): Promise<T | undefined> {
    try {
      const file = path.join(this.dir, `${key}.json`);
      const raw = await readFile(file, "utf8");
      return JSON.parse(raw) as T;
    } catch {
      return undefined;
    }
  }

  async set(key: string, value: unknown): Promise<void> {
    await mkdir(this.dir, { recursive: true });
    const file = path.join(this.dir, `${key}.json`);
    await writeFile(file, JSON.stringify(value, null, 2), "utf8");
  }
}
