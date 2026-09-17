import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { serverConfig } from "./config.js";
import { screenBatch, summarize } from "./scoring/screen-batch.js";
import {
  getState,
  resetDemoState,
  saveScreened,
  takeBatch,
  updateConfig,
  upsertPending,
} from "./store.js";
import {
  EventConfigSchema,
  GuestInputSchema,
  ScreenBatchRequestSchema,
} from "./types.js";

function send(
  res: ServerResponse,
  status: number,
  body: string,
  type = "application/json; charset=utf-8",
) {
  res.writeHead(status, {
    "content-type": type,
    "cache-control": "no-store",
    "access-control-allow-origin": "*",
    "access-control-allow-headers": "content-type, authorization, x-api-key",
    "access-control-allow-methods": "GET, POST, OPTIONS",
  });
  res.end(body);
}

function sendJson(res: ServerResponse, status: number, data: unknown) {
  send(res, status, JSON.stringify(data, null, 2));
}

async function readJson(req: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  const raw = Buffer.concat(chunks).toString("utf8").trim();
  if (!raw) return {};
  return JSON.parse(raw);
}

function authorized(req: IncomingMessage): boolean {
  const expected = serverConfig.apiKey;
  if (!expected || expected === "dev-local-key") return true;
  const header = req.headers.authorization || "";
  const bearer = header.startsWith("Bearer ") ? header.slice(7) : "";
  const apiKey = String(req.headers["x-api-key"] || "");
  return bearer === expected || apiKey === expected;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}

async function dashboardHtml(): Promise<string> {
  const state = await getState();
  const accepted = state.screened.filter((g) => g.tier === "approve").length;
  const rows = state.screened
    .slice()
    .sort((a, b) => b.score - a.score)
    .map(
      (g) => `<tr>
        <td>${escapeHtml(g.name)}</td>
        <td>${escapeHtml(g.email)}</td>
        <td>${g.score}</td>
        <td><span class="tier ${g.tier}">${g.tier}</span></td>
        <td>${escapeHtml(g.reason)}</td>
      </tr>`,
    )
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Luma Guest Intelligence</title>
  <style>
    :root {
      --bg: #0f1419;
      --panel: #1a222c;
      --text: #e8eef4;
      --muted: #8b9aab;
      --accent: #3d9cf0;
      --approve: #3ecf8e;
      --waitlist: #e6b84d;
      --reject: #e85d5d;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: "Segoe UI", ui-sans-serif, system-ui, sans-serif;
      background: radial-gradient(1200px 600px at 10% -10%, #1c3a5a 0%, transparent 50%), var(--bg);
      color: var(--text);
      min-height: 100vh;
    }
    main { max-width: 1100px; margin: 0 auto; padding: 2rem 1.25rem 4rem; }
    h1 { font-size: 1.75rem; margin: 0 0 0.35rem; letter-spacing: -0.02em; }
    .sub { color: var(--muted); margin-bottom: 1.75rem; }
    .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem; margin-bottom: 1.5rem; }
    .stat { background: var(--panel); padding: 1rem; border-radius: 10px; }
    .stat b { display: block; font-size: 1.5rem; margin-top: 0.25rem; }
    .stat span { color: var(--muted); font-size: 0.85rem; }
    section {
      background: var(--panel);
      border-radius: 12px;
      padding: 1.25rem;
      margin-bottom: 1rem;
    }
    label { display: block; color: var(--muted); font-size: 0.85rem; margin-bottom: 0.35rem; }
    input, textarea, select {
      width: 100%;
      background: #0f1419;
      border: 1px solid #2a3542;
      color: var(--text);
      border-radius: 8px;
      padding: 0.65rem 0.75rem;
      margin-bottom: 0.75rem;
      font: inherit;
    }
    textarea { min-height: 110px; resize: vertical; }
    .row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.75rem; }
    button {
      background: var(--accent);
      color: #041018;
      border: 0;
      border-radius: 8px;
      padding: 0.7rem 1rem;
      font-weight: 650;
      cursor: pointer;
      margin-right: 0.5rem;
      margin-top: 0.25rem;
    }
    button.secondary { background: #2a3542; color: var(--text); }
    table { width: 100%; border-collapse: collapse; font-size: 0.92rem; }
    th, td { text-align: left; padding: 0.55rem 0.4rem; border-bottom: 1px solid #2a3542; vertical-align: top; }
    th { color: var(--muted); font-weight: 600; }
    .tier { text-transform: uppercase; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.04em; }
    .tier.approve { color: var(--approve); }
    .tier.waitlist { color: var(--waitlist); }
    .tier.reject { color: var(--reject); }
    #log { white-space: pre-wrap; color: var(--muted); font-family: ui-monospace, monospace; font-size: 0.8rem; }
    @media (max-width: 800px) {
      .grid, .row { grid-template-columns: 1fr 1fr; }
    }
  </style>
</head>
<body>
  <main>
    <h1>Luma Guest Intelligence</h1>
    <p class="sub">Cursor scores batches · Workato syncs Luma → Notion · local demo board</p>

    <div class="grid">
      <div class="stat"><span>Pending</span><b id="pendingCount">${state.pending.length}</b></div>
      <div class="stat"><span>Batch size</span><b>${state.config.batchSize}</b></div>
      <div class="stat"><span>Accepted / target</span><b>${accepted} / ${state.config.targetAccepts}</b></div>
      <div class="stat"><span>Batches run</span><b>${state.batchesRun}</b></div>
    </div>

    <section>
      <h2 style="margin-top:0;font-size:1.1rem">Event config</h2>
      <p style="color:var(--muted);font-size:0.9rem;margin-top:0">
        ${state.config.criteriaNeeded ? "⚠️ Criteria needed before screening." : "Criteria set."}
        Event: <strong>${escapeHtml(state.config.eventName)}</strong>
      </p>
      <label>Acceptance criteria (Cursor will ask for this)</label>
      <textarea id="criteria" placeholder="e.g. Prefer people building agents with MCP/memory; students OK if project is concrete; reject empty LinkedIn + one-line answers">${escapeHtml(state.config.criteria)}</textarea>
      <div class="row">
        <div>
          <label>Batch size</label>
          <input id="batchSize" type="number" min="1" value="${state.config.batchSize}" />
        </div>
        <div>
          <label>Target accepts</label>
          <input id="targetAccepts" type="number" min="1" value="${state.config.targetAccepts}" />
        </div>
        <div>
          <label>Event name</label>
          <input id="eventName" value="${escapeHtml(state.config.eventName)}" />
        </div>
      </div>
      <button onclick="saveConfig()">Save criteria &amp; config</button>
      <button class="secondary" onclick="runBatch(false)">Screen next batch (Cursor)</button>
      <button class="secondary" onclick="runBatch(true)">Screen next batch (heuristic dry-run)</button>
      <button class="secondary" onclick="resetDemo()">Reset demo</button>
    </section>

    <section>
      <h2 style="margin-top:0;font-size:1.1rem">Simulate Luma registration</h2>
      <div class="row">
        <div>
          <label>Name</label>
          <input id="name" placeholder="Ada Builder" />
        </div>
        <div>
          <label>Email</label>
          <input id="email" placeholder="ada@example.com" />
        </div>
        <div>
          <label>LinkedIn URL</label>
          <input id="linkedin" placeholder="https://linkedin.com/in/..." />
        </div>
      </div>
      <label>What are you building?</label>
      <textarea id="building" placeholder="Short project description from Luma form"></textarea>
      <button onclick="ingest()">Ingest guest → pending queue</button>
      <button class="secondary" onclick="seedFive()">Seed 5 demo guests</button>
    </section>

    <section>
      <h2 style="margin-top:0;font-size:1.1rem">Screened (Notion mirror)</h2>
      <table>
        <thead>
          <tr><th>Name</th><th>Email</th><th>Score</th><th>Tier</th><th>Reason</th></tr>
        </thead>
        <tbody id="rows">${rows || '<tr><td colspan="5" style="color:var(--muted)">No screened guests yet</td></tr>'}</tbody>
      </table>
    </section>

    <section>
      <h2 style="margin-top:0;font-size:1.1rem">API log</h2>
      <div id="log">Ready. Workato calls POST /v1/screen-batch with the pending Notion rows.</div>
    </section>
  </main>
  <script>
    async function api(path, body) {
      const res = await fetch(path, {
        method: body ? "POST" : "GET",
        headers: { "content-type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
      });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { data = { raw: text }; }
      document.getElementById("log").textContent = JSON.stringify(data, null, 2);
      if (!res.ok) throw new Error(data.error || res.statusText);
      return data;
    }
    async function saveConfig() {
      await api("/v1/config", {
        criteria: document.getElementById("criteria").value,
        batchSize: Number(document.getElementById("batchSize").value),
        targetAccepts: Number(document.getElementById("targetAccepts").value),
        eventName: document.getElementById("eventName").value,
      });
      location.reload();
    }
    async function ingest() {
      const name = document.getElementById("name").value.trim() || "Demo Guest";
      const email = document.getElementById("email").value.trim() || (name.toLowerCase().replace(/\\s+/g,".") + "@demo.local");
      const building = document.getElementById("building").value.trim() || "Exploring agents";
      await api("/v1/ingest", {
        id: "demo-" + Date.now(),
        name,
        email,
        linkedinUrl: document.getElementById("linkedin").value.trim() || undefined,
        answers: [
          { question: "What are you building?", answer: building },
          { question: "Why attend?", answer: "Want to build with Cursor + agents" },
        ],
      });
      location.reload();
    }
    async function seedFive() {
      await api("/v1/demo/seed", {});
      location.reload();
    }
    async function runBatch(dryRun) {
      await api("/v1/screen-pending", { dryRun });
      location.reload();
    }
    async function resetDemo() {
      await api("/v1/demo/reset", {});
      location.reload();
    }
  </script>
</body>
</html>`;
}

const DEMO_GUESTS = [
  {
    name: "Karthik V",
    email: "karthik.demo@example.com",
    linkedinUrl: "https://linkedin.com/in/example-karthik",
    building:
      "Building a personal productivity agent with MCP tools and persistent memory for daily planning.",
  },
  {
    name: "Aaliya P",
    email: "aaliya.demo@example.com",
    building: "AI",
  },
  {
    name: "Rahul A",
    email: "rahul.demo@example.com",
    linkedinUrl: "https://linkedin.com/in/example-rahul",
    building:
      "Multi-agent support desk that routes tickets, drafts replies, and logs to Notion.",
  },
  {
    name: "Imtyaj A",
    email: "imtyaj.demo@example.com",
    building: "Exploring things and networking.",
  },
  {
    name: "Daraqshan D",
    email: "daraqshan.demo@example.com",
    linkedinUrl: "https://linkedin.com/in/example-daraqshan",
    building:
      "Smart Agriculture AI Copilot with RAG, weather APIs, and disease detection for farmers.",
  },
];

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
    const path = url.pathname;
    const method = req.method || "GET";

    if (method === "OPTIONS") {
      send(res, 204, "");
      return;
    }

    if (method === "GET" && path === "/") {
      send(res, 200, await dashboardHtml(), "text/html; charset=utf-8");
      return;
    }

    if (method === "GET" && path === "/health") {
      sendJson(res, 200, {
        ok: true,
        cursorConfigured: Boolean(serverConfig.cursorApiKey),
      });
      return;
    }

    if (method === "GET" && path === "/v1/state") {
      if (!authorized(req)) {
        sendJson(res, 401, { error: "unauthorized" });
        return;
      }
      sendJson(res, 200, await getState());
      return;
    }

    // Workato / host sets criteria + capacity before screening
    if (method === "POST" && path === "/v1/config") {
      if (!authorized(req)) {
        sendJson(res, 401, { error: "unauthorized" });
        return;
      }
      const body = EventConfigSchema.partial().parse(await readJson(req));
      const config = await updateConfig(body);
      sendJson(res, 200, {
        ok: true,
        config,
        message: config.criteriaNeeded
          ? "Criteria still empty — set criteria before screening."
          : "Config saved. Ready to screen batches.",
      });
      return;
    }

    // Workato: after Notion upsert, optionally mirror into local pending queue
    if (method === "POST" && path === "/v1/ingest") {
      if (!authorized(req)) {
        sendJson(res, 401, { error: "unauthorized" });
        return;
      }
      const guest = GuestInputSchema.parse(await readJson(req));
      const result = await upsertPending(guest);
      sendJson(res, 200, {
        ok: true,
        ...result,
        nextAction: result.criteriaNeeded
          ? "ask_host_for_criteria"
          : result.batchReady
            ? "call_screen_pending_or_screen_batch"
            : "wait_for_more_guests",
      });
      return;
    }

    // Workato preferred: send Notion pending rows directly
    if (method === "POST" && path === "/v1/screen-batch") {
      if (!authorized(req)) {
        sendJson(res, 401, { error: "unauthorized" });
        return;
      }
      const body = ScreenBatchRequestSchema.parse(await readJson(req));
      const state = await getState();
      const criteria = (body.criteria ?? state.config.criteria).trim();
      if (!criteria) {
        sendJson(res, 409, {
          error: "criteria_needed",
          message:
            "Set acceptance criteria via POST /v1/config before screening.",
          askHost:
            "What should we prioritize when approving guests? (e.g. builders with concrete agent projects, Hyderabad-based, non-generic answers)",
        });
        return;
      }

      const targetAccepts = body.targetAccepts ?? state.config.targetAccepts;
      const { screened, criteriaUsed, mode } = await screenBatch({
        guests: body.guests,
        criteria,
        eventName: body.eventName || state.config.eventName,
        alreadyAccepted: body.alreadyAccepted,
        targetAccepts,
        dryRun: url.searchParams.get("dryRun") === "1",
      });

      await saveScreened(screened);
      // Mark criteria as set if Workato passed it inline
      if (body.criteria?.trim()) {
        await updateConfig({ criteria: body.criteria.trim() });
      }

      sendJson(res, 200, {
        ok: true as const,
        mode,
        criteriaUsed,
        screened,
        summary: summarize(screened, body.alreadyAccepted, targetAccepts),
        notionMapping: {
          Score: "score",
          Tier: "tier",
          Reason: "reason",
          Persona: "persona",
          "Approval message": "approvalMessage",
          Status: "screened",
        },
      });
      return;
    }

    // Local / Workato shortcut: screen whatever is in the pending queue
    if (method === "POST" && path === "/v1/screen-pending") {
      if (!authorized(req)) {
        sendJson(res, 401, { error: "unauthorized" });
        return;
      }
      const body = (await readJson(req)) as { dryRun?: boolean };
      const state = await getState();
      if (state.config.criteriaNeeded || !state.config.criteria.trim()) {
        sendJson(res, 409, {
          error: "criteria_needed",
          askHost:
            "What basis should Cursor use to approve guests for this event?",
          config: state.config,
        });
        return;
      }
      if (state.pending.length === 0) {
        sendJson(res, 400, { error: "no_pending_guests" });
        return;
      }

      const batch = await takeBatch();
      const { screened, criteriaUsed, mode } = await screenBatch({
        guests: batch.guests,
        criteria: batch.config.criteria,
        eventName: batch.config.eventName,
        alreadyAccepted: batch.alreadyAccepted,
        targetAccepts: batch.config.targetAccepts,
        dryRun: Boolean(body.dryRun),
      });
      await saveScreened(screened);

      sendJson(res, 200, {
        ok: true,
        mode,
        criteriaUsed,
        screened,
        summary: summarize(
          screened,
          batch.alreadyAccepted,
          batch.config.targetAccepts,
        ),
        pendingRemaining: (await getState()).pending.length,
      });
      return;
    }

    if (method === "POST" && path === "/v1/demo/seed") {
      for (const g of DEMO_GUESTS) {
        await upsertPending({
          id: `seed-${g.email}`,
          name: g.name,
          email: g.email,
          linkedinUrl: g.linkedinUrl,
          answers: [
            { question: "What are you building?", answer: g.building },
            {
              question: "Why do you want to attend?",
              answer: "Learn production agent patterns and meet builders.",
            },
          ],
        });
      }
      sendJson(res, 200, { ok: true, seeded: DEMO_GUESTS.length, state: await getState() });
      return;
    }

    if (method === "POST" && path === "/v1/demo/reset") {
      sendJson(res, 200, { ok: true, state: await resetDemoState() });
      return;
    }

    sendJson(res, 404, { error: "not_found", path });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    sendJson(res, 400, { error: "bad_request", message });
  }
});

server.listen(serverConfig.port, () => {
  console.log(`Luma Guest Intelligence on http://localhost:${serverConfig.port}`);
  console.log(`Dashboard:  GET  /`);
  console.log(`Config:     POST /v1/config`);
  console.log(`Ingest:     POST /v1/ingest`);
  console.log(`Screen:     POST /v1/screen-batch   (Workato → Cursor)`);
  console.log(`Pending:    POST /v1/screen-pending (local batch)`);
});
