import "dotenv/config";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";
import { isPersonaId } from "./personas/index.js";
import { syncJobsFromDisk } from "./live/hydrate.js";
import { jobStore, toLiveRow } from "./live/jobs.js";
import { liveHtmlPage } from "./live/page.js";
import { runScreen } from "./pipeline/run.js";
import type { PersonaId } from "./types.js";
import { enableInsecureTlsIfRequested } from "./tls.js";

enableInsecureTlsIfRequested();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PORT = Number(process.env.PORT || 8787);

function send(
  res: ServerResponse,
  status: number,
  body: string,
  type = "text/html; charset=utf-8",
) {
  res.writeHead(status, {
    "content-type": type,
    "cache-control": "no-store",
  });
  res.end(body);
}

function sendJson(res: ServerResponse, status: number, data: unknown) {
  send(res, status, JSON.stringify(data, null, 2), "application/json; charset=utf-8");
}

function sseInit(res: ServerResponse) {
  res.writeHead(200, {
    "content-type": "text/event-stream; charset=utf-8",
    "cache-control": "no-cache, no-transform",
    connection: "keep-alive",
  });
  res.write("\n");
}

function sseSend(res: ServerResponse, data: unknown) {
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

async function readBody(req: IncomingMessage): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

function parseMultipart(
  buf: Buffer,
  boundary: string,
): { fields: Record<string, string>; file?: { filename: string; data: Buffer } } {
  const fields: Record<string, string> = {};
  let file: { filename: string; data: Buffer } | undefined;
  const sep = Buffer.from(`--${boundary}`);
  let start = buf.indexOf(sep) + sep.length;

  while (start < buf.length) {
    if (buf[start] === 45 && buf[start + 1] === 45) break;
    if (buf[start] === 13 && buf[start + 1] === 10) start += 2;

    const next = buf.indexOf(sep, start);
    const part = buf.subarray(start, next === -1 ? buf.length : next - 2);
    const headerEnd = part.indexOf("\r\n\r\n");
    if (headerEnd === -1) break;
    const headers = part.subarray(0, headerEnd).toString("utf8");
    const body = part.subarray(headerEnd + 4);
    const nameMatch = headers.match(/name="([^"]+)"/);
    const fileMatch = headers.match(/filename="([^"]+)"/);
    const name = nameMatch?.[1];
    if (!name) {
      start = next === -1 ? buf.length : next + sep.length;
      continue;
    }
    if (fileMatch?.[1]) {
      file = { filename: fileMatch[1], data: body };
    } else {
      fields[name] = body.toString("utf8").replace(/\r\n$/, "");
    }
    start = next === -1 ? buf.length : next + sep.length;
  }

  return { fields, file };
}

async function startJobFromCsv(input: {
  csvData: Buffer;
  csvName: string;
  persona: PersonaId;
  instructions: string;
  limit?: number;
  concurrency: number;
  skipLlm: boolean;
  offlineProfiles: boolean;
  eventConfigPath?: string;
}) {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const jobId = `job-${stamp}-${randomUUID().slice(0, 8)}`;
  const outDir = path.join(ROOT, "out", jobId);
  await mkdir(outDir, { recursive: true });
  const csvPath = path.join(outDir, input.csvName || "guests.csv");
  await writeFile(csvPath, input.csvData);

  const job = jobStore.create({
    id: jobId,
    persona: input.persona,
    csvName: input.csvName || "guests.csv",
    outDir,
  });

  // Fire-and-forget — HTTP returns immediately; UI streams via SSE
  void (async () => {
    jobStore.patch(jobId, { status: "running", message: "Starting…" });
    try {
      const { results, outputs, persona } = await runScreen({
        csvPath,
        persona: input.persona,
        instructions: input.instructions,
        limit: input.limit,
        concurrency: input.concurrency,
        model: process.env.CURSOR_MODEL || "composer-2.5",
        apiKey: process.env.CURSOR_API_KEY || "",
        outDir,
        skipLlm: input.skipLlm,
        offlineProfiles: input.offlineProfiles,
        enrichLinkedin: true,
        enrichX: true,
        eventConfigPath: input.eventConfigPath,
        onStatus: (message) => jobStore.status(jobId, message),
        onAttendee: (screened, progress) => {
          jobStore.pushRow(jobId, toLiveRow(screened), progress);
        },
      });

      const ranked = [...results].sort((a, b) => b.decisionScore - a.decisionScore);
      jobStore.patch(jobId, {
        status: "done",
        total: ranked.length,
        done: ranked.length,
        counts: {
          accept: ranked.filter((r) => r.decision === "accept").length,
          waitlist: ranked.filter((r) => r.decision === "waitlist").length,
          reject: ranked.filter((r) => r.decision === "reject").length,
        },
        message: `Done — ${ranked.length} screened`,
        reportUrl: `/files/${path.basename(outDir)}/report.md`,
        csvUrl: `/files/${path.basename(outDir)}/scored.csv`,
      });
      void persona;
      void outputs;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      jobStore.patch(jobId, {
        status: "error",
        error: message,
        message: `Error: ${message}`,
      });
    }
  })();

  return job;
}

async function handleCreateJob(req: IncomingMessage, res: ServerResponse) {
  try {
    const ctype = req.headers["content-type"] || "";
    if (!ctype.includes("multipart/form-data")) {
      return sendJson(res, 400, { error: "Expected multipart form upload" });
    }
    const boundary = ctype.split("boundary=")[1];
    if (!boundary) return sendJson(res, 400, { error: "Missing multipart boundary" });

    const buf = await readBody(req);
    const { fields, file } = parseMultipart(buf, boundary);
    if (!file?.data?.length) {
      return sendJson(res, 400, { error: "CSV file required" });
    }

    const persona = fields.persona || "cursor-dev";
    if (!isPersonaId(persona)) {
      return sendJson(res, 400, { error: `Unknown persona: ${persona}` });
    }

    const skipLlm = fields.skipLlm === "on";
    if (!skipLlm && !process.env.CURSOR_API_KEY) {
      return sendJson(res, 400, {
        error: "CURSOR_API_KEY missing in .env (or check Skip LLM)",
      });
    }

    const job = await startJobFromCsv({
      csvData: file.data,
      csvName: file.filename || "guests.csv",
      persona: persona as PersonaId,
      instructions: fields.instructions || "",
      limit: fields.limit ? Number(fields.limit) : undefined,
      concurrency: Math.max(1, Number(fields.concurrency || 1)),
      skipLlm,
      offlineProfiles: fields.offlineProfiles === "on",
      eventConfigPath: fields.eventConfig || undefined,
    });

    sendJson(res, 202, {
      jobId: job.id,
      streamUrl: `/api/jobs/${job.id}/stream`,
      watchUrl: `/?job=${job.id}`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    sendJson(res, 500, { error: message });
  }
}

/** Agent/CLI can enqueue a job from a path already on disk */
async function handleEnqueueJson(req: IncomingMessage, res: ServerResponse) {
  try {
    const raw = JSON.parse((await readBody(req)).toString("utf8")) as {
      csvPath?: string;
      persona?: string;
      instructions?: string;
      limit?: number;
      concurrency?: number;
      skipLlm?: boolean;
      offlineProfiles?: boolean;
      eventConfig?: string;
    };
    if (!raw.csvPath) return sendJson(res, 400, { error: "csvPath required" });
    const csvPath = path.resolve(raw.csvPath);
    if (!csvPath.startsWith(ROOT)) {
      // allow absolute paths under attendee-screener or sibling CSVs in ROOT
    }
    const persona = raw.persona || "agents";
    if (!isPersonaId(persona)) {
      return sendJson(res, 400, { error: `Unknown persona: ${persona}` });
    }
    if (!raw.skipLlm && !process.env.CURSOR_API_KEY) {
      return sendJson(res, 400, { error: "CURSOR_API_KEY missing" });
    }
    const data = await readFile(csvPath);
    const job = await startJobFromCsv({
      csvData: data,
      csvName: path.basename(csvPath),
      persona: persona as PersonaId,
      instructions: raw.instructions || "",
      limit: raw.limit,
      concurrency: Math.max(1, Number(raw.concurrency || 1)),
      skipLlm: Boolean(raw.skipLlm),
      offlineProfiles: Boolean(raw.offlineProfiles),
      eventConfigPath: raw.eventConfig,
    });
    sendJson(res, 202, {
      jobId: job.id,
      streamUrl: `/api/jobs/${job.id}/stream`,
      ui: `http://localhost:${PORT}/?job=${job.id}`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    sendJson(res, 500, { error: message });
  }
}

async function handleFile(req: IncomingMessage, res: ServerResponse, urlPath: string) {
  const rel = urlPath.replace(/^\/files\//, "");
  const filePath = path.join(ROOT, "out", rel);
  if (!filePath.startsWith(path.join(ROOT, "out"))) {
    return send(res, 403, "Forbidden");
  }
  try {
    const data = await readFile(filePath);
    const type = filePath.endsWith(".md")
      ? "text/markdown; charset=utf-8"
      : filePath.endsWith(".csv")
        ? "text/csv; charset=utf-8"
        : "text/plain; charset=utf-8";
    send(res, 200, data.toString("utf8"), type);
  } catch {
    send(res, 404, "Not found");
  }
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

  if (req.method === "GET" && url.pathname === "/") {
    return send(res, 200, liveHtmlPage());
  }
  if (req.method === "GET" && url.pathname === "/health") {
    return sendJson(res, 200, {
      ok: true,
      cursorKey: Boolean(process.env.CURSOR_API_KEY),
      githubToken: Boolean(process.env.GITHUB_TOKEN),
      exaKey: Boolean(process.env.EXA_API_KEY),
      jobs: jobStore.list().length,
    });
  }
  if (req.method === "GET" && url.pathname === "/api/jobs") {
    // Summary only — full rows via GET /api/jobs/:id (keeps UI from blanking)
    return sendJson(res, 200, {
      jobs: jobStore.list().map((j) => jobStore.publicJob(j, { includeRows: false })),
    });
  }
  if (req.method === "GET" && url.pathname.startsWith("/api/jobs/") && url.pathname.endsWith("/stream")) {
    const id = url.pathname.split("/")[3];
    const job = id ? jobStore.get(id) : undefined;
    if (!job || !id) return send(res, 404, "job not found");
    sseInit(res);
    sseSend(res, { type: "snapshot", job: jobStore.publicJob(job, { includeRows: true }) });
    const unsub = jobStore.subscribe(id, (event) => {
      // Don't re-broadcast full row arrays on every patch — client refetches if needed
      if (
        event &&
        typeof event === "object" &&
        (event as { type?: string }).type === "job"
      ) {
        const j = (event as { job?: { id?: string } }).job;
        const full = j?.id ? jobStore.get(j.id) : undefined;
        if (full) {
          sseSend(res, {
            type: "job",
            job: jobStore.publicJob(full, { includeRows: false }),
          });
          return;
        }
      }
      sseSend(res, event);
    });
    req.on("close", () => unsub());
    return;
  }
  if (req.method === "GET" && url.pathname.startsWith("/api/jobs/")) {
    const id = url.pathname.split("/")[3];
    const job = id ? jobStore.get(id) : undefined;
    if (!job) return sendJson(res, 404, { error: "job not found" });
    return sendJson(res, 200, jobStore.publicJob(job, { includeRows: true }));
  }
  if (req.method === "GET" && url.pathname === "/api/stream") {
    sseInit(res);
    const unsub = jobStore.subscribeAll((event) => sseSend(res, event));
    req.on("close", () => unsub());
    return;
  }
  if (req.method === "POST" && url.pathname === "/api/jobs") {
    return handleCreateJob(req, res);
  }
  if (req.method === "POST" && url.pathname === "/api/enqueue") {
    return handleEnqueueJson(req, res);
  }
  if (req.method === "POST" && url.pathname === "/api/sync-disk") {
    const sync = syncJobsFromDisk(ROOT);
    return sendJson(res, 200, {
      ok: true,
      added: sync.added,
      updated: sync.updated,
      skipped: sync.skipped,
      jobs: jobStore.list().map((j) => jobStore.publicJob(j, { includeRows: false })),
    });
  }
  if (req.method === "GET" && url.pathname.startsWith("/files/")) {
    return handleFile(req, res, url.pathname);
  }

  send(res, 404, "Not found");
});

server.listen(PORT, () => {
  const sync = syncJobsFromDisk(ROOT);
  console.log(`Live Attendee Screener → http://localhost:${PORT}`);
  console.log(
    `Keys: CURSOR=${Boolean(process.env.CURSOR_API_KEY)} GITHUB=${Boolean(process.env.GITHUB_TOKEN)} EXA=${Boolean(process.env.EXA_API_KEY)}`,
  );
  console.log(
    `Synced from disk · added ${sync.added}, updated ${sync.updated}, skipped ${sync.skipped}`,
  );
  console.log("Agent enqueue: POST /api/enqueue { csvPath, persona, ... }");
  console.log("Disk sync: POST /api/sync-disk (or use Sync from disk in UI)");
});
