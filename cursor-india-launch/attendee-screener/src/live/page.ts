import {
  lumaApprovalMessage,
  whatsappInviteUrl,
} from "../approval-message.js";
import { listPersonas } from "../personas/index.js";

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}

export function liveHtmlPage(): string {
  const personas = listPersonas()
    .map(
      (p) =>
        `<option value="${p.id}"${p.id === "agents" ? " selected" : ""}>${escapeHtml(p.label)}</option>`,
    )
    .join("");
  const approvalPreview = escapeHtml(lumaApprovalMessage());

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Live Attendee Screener</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,600;0,9..40,700;1,9..40,400&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />
  <style>
    :root {
      --bg0: #0f1410; --bg1: #1a221c; --ink: #e8efe6; --muted: #9aab9c;
      --line: rgba(232,239,230,0.12); --accent: #c8f07a; --accent-ink: #132010;
      --warn: #f0c27a; --bad: #f08a7a; --ok: #7ad4a0;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0; min-height: 100vh; font-family: "DM Sans", system-ui, sans-serif; color: var(--ink);
      background:
        radial-gradient(900px 500px at 10% -10%, #2a3a28 0%, transparent 55%),
        radial-gradient(700px 400px at 100% 0%, #243028 0%, transparent 50%),
        linear-gradient(180deg, var(--bg0), var(--bg1));
    }
    main { width: min(1180px, calc(100% - 2rem)); margin: 0 auto; padding: 2rem 0 3rem; }
    .brand { font-family: "Instrument Serif", Georgia, serif; font-size: clamp(2.2rem, 4vw, 3rem); margin: 0 0 0.35rem; }
    .lede { color: var(--muted); max-width: 48rem; margin: 0 0 1.25rem; }
    .layout { display: grid; grid-template-columns: 340px 1fr; gap: 1.25rem; }
    @media (max-width: 900px) { .layout { grid-template-columns: 1fr; } }
    .panel { border: 1px solid var(--line); background: rgba(255,255,255,0.03); padding: 1rem; }
    form { display: grid; gap: 0.85rem; }
    label { display: grid; gap: 0.35rem; font-size: 0.82rem; color: var(--muted); }
    input, select, textarea {
      width: 100%; border: 1px solid var(--line); background: rgba(0,0,0,0.25);
      color: var(--ink); padding: 0.65rem 0.75rem; font: inherit;
    }
    textarea { min-height: 72px; resize: vertical; }
    .checks { display: grid; gap: 0.45rem; font-size: 0.88rem; color: var(--muted); }
    button {
      border: 0; background: var(--accent); color: var(--accent-ink);
      font-weight: 700; padding: 0.8rem 1.1rem; cursor: pointer; font: inherit;
    }
    button.secondary {
      background: transparent; color: var(--ink); border: 1px solid var(--line); font-weight: 600;
    }
    button:disabled { opacity: 0.55; cursor: wait; }
    .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem; margin-bottom: 0.85rem; }
    .stat { border: 1px solid var(--line); padding: 0.65rem 0.7rem; background: rgba(0,0,0,0.18); }
    .stat b { display: block; font-size: 1.35rem; line-height: 1.1; }
    .stat span { color: var(--muted); font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.04em; }
    #pulse { color: var(--muted); min-height: 1.3rem; margin-bottom: 0.75rem; font-size: 0.92rem; }
    #pulse.live::before { content: ""; display: inline-block; width: 0.55rem; height: 0.55rem; border-radius: 50%; background: var(--ok); margin-right: 0.45rem; box-shadow: 0 0 0 0 rgba(122,212,160,0.7); animation: ping 1.4s infinite; }
    @keyframes ping { 70%, 100% { transform: scale(1.8); opacity: 0; } }
    .bar { height: 6px; background: rgba(255,255,255,0.06); margin-bottom: 0.9rem; overflow: hidden; }
    .bar > i { display: block; height: 100%; width: 0; background: var(--accent); transition: width 0.25s ease; }
    .toolbar {
      display: grid; grid-template-columns: 1.1fr 1.1fr 0.9fr auto auto; gap: 0.5rem;
      align-items: end; margin-bottom: 0.75rem;
    }
    @media (max-width: 900px) { .toolbar { grid-template-columns: 1fr 1fr; } }
    .toolbar label { margin: 0; }
    .toolbar .btnrow { display: flex; gap: 0.4rem; flex-wrap: wrap; }
    .viewmeta { color: var(--muted); font-size: 0.82rem; margin: 0 0 0.65rem; }
    .tablewrap { max-height: 62vh; overflow: auto; border-top: 1px solid var(--line); }
    table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
    th, td { border-bottom: 1px solid var(--line); text-align: left; padding: 0.6rem 0.35rem; vertical-align: top; }
    th { color: var(--muted); font-size: 0.72rem; letter-spacing: 0.04em; text-transform: uppercase; position: sticky; top: 0; background: #152018; }
    .pill { display: inline-block; padding: 0.12rem 0.4rem; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; }
    .accept { color: var(--accent-ink); background: var(--ok); }
    .waitlist { color: var(--accent-ink); background: var(--warn); }
    .reject { color: #2a1210; background: var(--bad); }
    .meta { color: var(--muted); font-size: 0.82rem; }
    .flash { animation: flashIn 0.45s ease; }
    @keyframes flashIn { from { background: rgba(200,240,122,0.18); } to { background: transparent; } }
    a { color: var(--accent); }
    .jobs { display: grid; gap: 0.4rem; margin-top: 0.75rem; max-height: 280px; overflow: auto; }
    .jobbtn { text-align: left; background: transparent; color: var(--ink); border: 1px solid var(--line); font-weight: 500; padding: 0.55rem 0.65rem; width: 100%; }
    .jobbtn.active { border-color: var(--accent); }
    #copyStatus { min-height: 1.1rem; font-size: 0.8rem; color: var(--ok); }
  </style>
</head>
<body>
  <main>
    <h1 class="brand">Live Attendee Screener</h1>
    <p class="lede">Upload a Luma CSV (or start a job from chat/CLI). Filter / sort the live table, then one-click copy emails from the current view.</p>
    <div class="meta" style="margin-bottom:1rem;padding:0.8rem 0.9rem;border:1px solid var(--line);white-space:pre-wrap">${approvalPreview}</div>
    <p class="meta" style="margin-bottom:1.25rem">WhatsApp: <a href="${whatsappInviteUrl()}" target="_blank" rel="noreferrer">${escapeHtml(whatsappInviteUrl())}</a></p>

    <div class="layout">
      <aside class="panel">
        <form id="form">
          <label>Luma CSV<input id="csv" name="csv" type="file" accept=".csv,text/csv" required /></label>
          <label>Persona<select name="persona">${personas}</select></label>
          <label>Limit (optional)<input name="limit" type="number" min="1" placeholder="all" /></label>
          <label>Concurrency<input name="concurrency" type="number" min="1" max="4" value="1" /></label>
          <label>Event instructions<textarea name="instructions" placeholder="Prefer builders who ship"></textarea></label>
          <div class="checks">
            <label><input type="checkbox" name="skipLlm" /> Skip LLM</label>
            <label><input type="checkbox" name="offlineProfiles" /> Offline GitHub fixtures</label>
          </div>
          <button type="submit" id="go">Start live screen</button>
        </form>
        <button type="button" class="secondary" id="syncDiskBtn" style="margin-top:0.75rem;width:100%">Sync from disk</button>
        <p class="meta" id="syncStatus" style="margin:0.4rem 0 0">Pulls CLI batch results (roadshow-batch-*) into this UI</p>
        <button type="button" class="jobbtn" id="allJobsBtn" style="margin-top:0.75rem">All batches (merged)</button>
        <div class="jobs" id="jobs"></div>
      </aside>

      <section class="panel">
        <div class="stats">
          <div class="stat"><span>Done</span><b id="sDone">0</b></div>
          <div class="stat"><span>Accept</span><b id="sAccept">0</b></div>
          <div class="stat"><span>Waitlist</span><b id="sWait">0</b></div>
          <div class="stat"><span>Reject</span><b id="sReject">0</b></div>
        </div>
        <div class="bar"><i id="bar"></i></div>
        <div id="pulse">Idle — start a job or wait for the agent to enqueue one.</div>
        <div id="links" class="meta" style="margin-bottom:0.75rem"></div>

        <div class="toolbar">
          <label>Decision
            <select id="fDecision">
              <option value="all">All</option>
              <option value="accept">Accept only</option>
              <option value="waitlist">Waitlist only</option>
              <option value="reject">Reject only</option>
              <option value="accept,waitlist">Accept + waitlist</option>
            </select>
          </label>
          <label>Min score
            <input id="fMinScore" type="number" step="any" min="0" max="1" placeholder="e.g. 0.9 or 1" />
          </label>
          <label>Sort
            <select id="fSort">
              <option value="score-desc">Score high → low</option>
              <option value="score-asc">Score low → high</option>
              <option value="decision">Decision (accept → wait → reject)</option>
              <option value="name-asc">Name A → Z</option>
              <option value="name-desc">Name Z → A</option>
              <option value="email-asc">Email A → Z</option>
              <option value="email-desc">Email Z → A</option>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="cursor-first">Cursor evidence first</option>
            </select>
          </label>
          <div class="btnrow">
            <button type="button" id="copyEmails" title="Copy emails in current filtered view">Copy emails</button>
            <button type="button" class="secondary" id="resetFilters">Reset</button>
          </div>
        </div>
        <div id="copyStatus"></div>
        <p class="viewmeta" id="viewMeta">Showing 0 of 0</p>

        <div class="tablewrap">
          <table>
            <thead>
              <tr>
                <th>Decision</th><th>Score</th><th>Person</th><th>Cursor</th><th>Rationale</th>
              </tr>
            </thead>
            <tbody id="tbody"></tbody>
          </table>
        </div>
      </section>
    </div>
  </main>
  <script>
    const form = document.getElementById("form");
    const go = document.getElementById("go");
    const pulse = document.getElementById("pulse");
    const tbody = document.getElementById("tbody");
    const jobsEl = document.getElementById("jobs");
    const links = document.getElementById("links");
    const bar = document.getElementById("bar");
    const viewMeta = document.getElementById("viewMeta");
    const copyStatus = document.getElementById("copyStatus");
    const fDecision = document.getElementById("fDecision");
    const fMinScore = document.getElementById("fMinScore");
    const fSort = document.getElementById("fSort");

    let es = null;
    let activeJobId = null; // null = all merged
    let allJobsCache = [];
    /** @type {Map<string, any>} */
    const rowMap = new Map(); // email -> row
    let visibleRows = [];

    function esc(s) {
      return String(s ?? "").replace(/[&<>"']/g, (c) => ({
        "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
      })[c]);
    }

    function setCounts(c, done, total) {
      document.getElementById("sDone").textContent = total ? done + "/" + total : String(done || 0);
      document.getElementById("sAccept").textContent = c.accept || 0;
      document.getElementById("sWait").textContent = c.waitlist || 0;
      document.getElementById("sReject").textContent = c.reject || 0;
      bar.style.width = total ? Math.round((done / total) * 100) + "%" : "0%";
    }

    function decisionRank(d) {
      if (d === "accept") return 0;
      if (d === "waitlist") return 1;
      if (d === "reject") return 2;
      return 3;
    }

    function parseMinScore() {
      const raw = String(fMinScore.value || "").trim();
      if (!raw) return null;
      let n = Number(raw);
      if (!Number.isFinite(n)) return null;
      // allow integers like 90 meaning 0.90, or 1 meaning 1.0
      if (n > 1) n = n / 100;
      return Math.max(0, Math.min(1, n));
    }

    function getFilteredSorted() {
      const decisions = fDecision.value === "all"
        ? null
        : new Set(fDecision.value.split(","));
      const minScore = parseMinScore();
      let rows = [...rowMap.values()];
      rows = rows.filter((r) => {
        if (decisions && !decisions.has(r.decision)) return false;
        if (minScore != null && Number(r.decisionScore) < minScore) return false;
        return true;
      });
      const sort = fSort.value;
      rows.sort((a, b) => {
        if (sort === "score-desc") return Number(b.decisionScore) - Number(a.decisionScore) || a.email.localeCompare(b.email);
        if (sort === "score-asc") return Number(a.decisionScore) - Number(b.decisionScore) || a.email.localeCompare(b.email);
        if (sort === "decision") return decisionRank(a.decision) - decisionRank(b.decision) || Number(b.decisionScore) - Number(a.decisionScore);
        if (sort === "name-asc") return String(a.name||"").localeCompare(String(b.name||"")) || a.email.localeCompare(b.email);
        if (sort === "name-desc") return String(b.name||"").localeCompare(String(a.name||"")) || a.email.localeCompare(b.email);
        if (sort === "email-asc") return a.email.localeCompare(b.email);
        if (sort === "email-desc") return b.email.localeCompare(a.email);
        if (sort === "newest") return String(b.at||"").localeCompare(String(a.at||""));
        if (sort === "oldest") return String(a.at||"").localeCompare(String(b.at||""));
        if (sort === "cursor-first") return Number(b.cursorUsedLikely) - Number(a.cursorUsedLikely) || Number(b.decisionScore) - Number(a.decisionScore);
        return 0;
      });
      return rows;
    }

    function renderTable() {
      visibleRows = getFilteredSorted();
      tbody.innerHTML = visibleRows.map((r) => \`
        <tr>
          <td><span class="pill \${esc(r.decision)}">\${esc(r.decision)}</span></td>
          <td>\${esc(r.decisionScore)}</td>
          <td>\${esc(r.name)}<div class="meta">\${esc(r.email)}</div></td>
          <td>\${r.cursorUsedLikely ? "yes" : "—"}<div class="meta">\${esc((r.cursorSignals||"").slice(0,80))}</div></td>
          <td>\${esc((r.rationale||"").slice(0,180))}</td>
        </tr>\`).join("");
      viewMeta.textContent = "Showing " + visibleRows.length + " of " + rowMap.size
        + (activeJobId ? " · job view" : " · all batches merged");
    }

    function upsertRow(r, flash) {
      if (!r || !r.email) return;
      const key = String(r.email).toLowerCase();
      const prev = rowMap.get(key);
      if (!prev || Number(r.decisionScore) >= Number(prev.decisionScore || 0)) {
        rowMap.set(key, r);
      }
      renderTable();
    }

    function loadRows(rows) {
      rowMap.clear();
      for (const r of rows || []) {
        if (!r?.email) continue;
        rowMap.set(String(r.email).toLowerCase(), r);
      }
      renderTable();
    }

    function renderJobList(jobs) {
      allJobsCache = jobs || [];
      jobsEl.innerHTML = allJobsCache.slice(0, 30).map((j) => \`
        <button type="button" class="jobbtn \${j.id === activeJobId ? "active" : ""}" data-id="\${esc(j.id)}">
          <div><strong>\${esc(j.csvName || j.id)}</strong> · \${esc(j.status)}</div>
          <div class="meta">\${j.done}/\${j.total || "?"} · A\${j.counts.accept}/W\${j.counts.waitlist}/R\${j.counts.reject}</div>
        </button>\`).join("") || '<div class="meta">No jobs yet — click Sync from disk</div>';
      for (const btn of jobsEl.querySelectorAll(".jobbtn")) {
        btn.addEventListener("click", () => watchJob(btn.dataset.id));
      }
      document.getElementById("allJobsBtn").classList.toggle("active", activeJobId == null);
    }

    function applyJobMeta(jobs) {
      renderJobList(jobs || []);
      if (!activeJobId) return;
      const j = (jobs || []).find((x) => x.id === activeJobId);
      if (!j) return;
      setCounts(j.counts, j.done, j.total);
      pulse.textContent = j.message || j.status;
      pulse.classList.toggle("live", j.status === "running" || j.status === "queued");
      if (j.reportUrl || j.csvUrl) {
        links.innerHTML = [
          j.reportUrl ? '<a href="' + j.reportUrl + '" target="_blank">report</a>' : "",
          j.csvUrl ? '<a href="' + j.csvUrl + '" target="_blank">scored.csv</a>' : "",
        ].filter(Boolean).join(" · ");
      }
    }

    async function loadJobRows(id) {
      const res = await fetch("/api/jobs/" + encodeURIComponent(id));
      if (!res.ok) throw new Error("Failed to load job " + id);
      const j = await res.json();
      setCounts(j.counts, j.done, j.total);
      loadRows(j.rows || []);
      pulse.textContent = j.message || (j.done + " rows loaded");
      pulse.classList.toggle("live", j.status === "running" || j.status === "queued");
      if (j.reportUrl || j.csvUrl) {
        links.innerHTML = [
          j.reportUrl ? '<a href="' + j.reportUrl + '" target="_blank">report</a>' : "",
          j.csvUrl ? '<a href="' + j.csvUrl + '" target="_blank">scored.csv</a>' : "",
        ].filter(Boolean).join(" · ");
      }
      return j;
    }

    async function refreshJobs() {
      try {
        const res = await fetch("/api/jobs");
        const data = await res.json();
        applyJobMeta(data.jobs || []);
      } catch (err) {
        pulse.textContent = "Job list refresh failed: " + (err.message || err);
      }
    }

    async function syncFromDisk() {
      const statusEl = document.getElementById("syncStatus");
      const btn = document.getElementById("syncDiskBtn");
      btn.disabled = true;
      statusEl.textContent = "Syncing scored.csv from out/ …";
      try {
        const res = await fetch("/api/sync-disk", { method: "POST" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Sync failed");
        applyJobMeta(data.jobs || []);
        if (activeJobId) await loadJobRows(activeJobId);
        statusEl.textContent = "Synced · +" + data.added + " / ~" + data.updated + " updated · " + new Date().toLocaleTimeString();
      } catch (err) {
        statusEl.textContent = err.message || String(err);
      } finally {
        btn.disabled = false;
      }
    }

    async function watchAll() {
      activeJobId = null;
      if (es) { es.close(); es = null; }
      pulse.classList.remove("live");
      pulse.textContent = "Loading merged view…";
      links.innerHTML = "";
      await refreshJobs();
      // Merge by fetching each job's rows (list endpoint has no rows)
      const merged = new Map();
      for (const meta of allJobsCache) {
        try {
          const res = await fetch("/api/jobs/" + encodeURIComponent(meta.id));
          if (!res.ok) continue;
          const j = await res.json();
          for (const r of j.rows || []) {
            const key = String(r.email || "").toLowerCase();
            if (!key) continue;
            const prev = merged.get(key);
            if (!prev || Number(r.decisionScore) >= Number(prev.decisionScore || 0)) merged.set(key, r);
          }
        } catch { /* skip */ }
      }
      rowMap.clear();
      for (const [k, v] of merged) rowMap.set(k, v);
      const c = { accept: 0, waitlist: 0, reject: 0 };
      for (const r of rowMap.values()) {
        if (r.decision === "accept") c.accept++;
        else if (r.decision === "waitlist") c.waitlist++;
        else if (r.decision === "reject") c.reject++;
      }
      setCounts(c, rowMap.size, rowMap.size);
      pulse.textContent = "All batches merged — " + rowMap.size + " unique";
      renderTable();
    }

    async function watchJob(id) {
      activeJobId = id;
      if (es) es.close();
      pulse.classList.add("live");
      pulse.textContent = "Loading " + id + "…";
      links.innerHTML = "";
      fDecision.value = "all";
      fMinScore.value = "";
      try {
        await loadJobRows(id);
        await refreshJobs();
      } catch (err) {
        pulse.textContent = err.message || String(err);
      }
      es = new EventSource("/api/jobs/" + encodeURIComponent(id) + "/stream");
      es.onmessage = (ev) => {
        try {
          const msg = JSON.parse(ev.data);
          if (msg.type === "snapshot" || msg.type === "job") {
            const j = msg.job;
            if (j.id !== activeJobId) return;
            setCounts(j.counts, j.done, j.total);
            pulse.textContent = j.message || j.status;
            pulse.classList.toggle("live", j.status === "running" || j.status === "queued");
            if (msg.type === "snapshot" && (j.rows || []).length) {
              loadRows(j.rows);
            }
          }
          if (msg.type === "row" && activeJobId) {
            upsertRow(msg.row, true);
            setCounts(msg.counts, msg.progress.done, msg.progress.total);
            pulse.textContent = msg.message;
          }
          if (msg.type === "status") pulse.textContent = msg.message;
        } catch { /* ignore bad events */ }
      };
      es.onerror = () => {
        pulse.classList.remove("live");
      };
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      go.disabled = true;
      pulse.classList.add("live");
      pulse.textContent = "Starting job…";
      try {
        const res = await fetch("/api/jobs", { method: "POST", body: new FormData(form) });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to start");
        watchJob(data.jobId);
      } catch (err) {
        pulse.classList.remove("live");
        pulse.textContent = err.message || String(err);
      } finally {
        go.disabled = false;
      }
    });

    for (const el of [fDecision, fMinScore, fSort]) {
      el.addEventListener("input", renderTable);
      el.addEventListener("change", renderTable);
    }
    document.getElementById("resetFilters").addEventListener("click", () => {
      fDecision.value = "all";
      fMinScore.value = "";
      fSort.value = "score-desc";
      renderTable();
    });
    document.getElementById("allJobsBtn").addEventListener("click", watchAll);
    document.getElementById("syncDiskBtn").addEventListener("click", syncFromDisk);
    document.getElementById("copyEmails").addEventListener("click", async () => {
      const emails = visibleRows.map((r) => r.email).filter(Boolean);
      const text = emails.join("\\n");
      try {
        await navigator.clipboard.writeText(text);
        copyStatus.textContent = "Copied " + emails.length + " email(s) — one per line";
      } catch {
        // fallback
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
        copyStatus.textContent = "Copied " + emails.length + " email(s)";
      }
      setTimeout(() => { copyStatus.textContent = ""; }, 2500);
    });

    const globalEs = new EventSource("/api/stream");
    globalEs.onmessage = (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.type === "job" && msg.job) {
        refreshJobs();
        if (activeJobId == null && msg.type === "job") {
          // keep merged view updated via refreshJobs
        } else if (!activeJobId && (msg.job.status === "running" || msg.job.status === "queued")) {
          // don't auto-switch if user is on all view after load; only auto on first idle
        }
      }
      if (msg.type === "row" && activeJobId == null) {
        upsertRow(msg.row, true);
      }
    };

    // Fast boot: list jobs + open to-approve (or ?job=). Sync is secondary.
    (async () => {
      pulse.textContent = "Loading saved results…";
      try {
        await refreshJobs();
        // Ensure disk folders are imported (to-approve-remaining, batches)
        await syncFromDisk();
        const bootJob = new URLSearchParams(location.search).get("job");
        const approve = allJobsCache.find(
          (j) =>
            /to approve/i.test(j.csvName || "") ||
            String(j.id || "").startsWith("to-approve-"),
        );
        const target = bootJob || approve?.id || allJobsCache[0]?.id;
        if (target) {
          await watchJob(target);
        } else {
          pulse.textContent = "No saved jobs — click Sync from disk or start a screen";
        }
      } catch (err) {
        pulse.classList.remove("live");
        pulse.textContent = "Boot failed: " + (err.message || err) + " — click Sync from disk";
      }
    })();
    setInterval(async () => {
      try {
        const res = await fetch("/api/sync-disk", { method: "POST" });
        const data = await res.json();
        if (res.ok) {
          applyJobMeta(data.jobs || []);
          // keep current table if we already have rows
          if (activeJobId && rowMap.size === 0) await loadJobRows(activeJobId);
        }
      } catch { /* ignore background sync errors */ }
    }, 20000);
  </script>
</body>
</html>`;
}
