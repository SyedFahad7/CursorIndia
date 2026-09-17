# Attendee Screener

Local Luma CSV screener for Cursor India events. Uses **your Cursor API key** (Pro / team usage) via `@cursor/sdk` — no Anthropic keys, no RapidAPI.

Also includes the community **`registration-approvals`** skill (Anthropic Pass1/Pass2 → Luma approve/decline CSVs). See [`registration-approvals/README.md`](./registration-approvals/README.md).

## Setup

1. Put secrets in `.env` (never commit it):

```env
CURSOR_API_KEY=cursor_...
GITHUB_TOKEN=ghp_...          # optional but recommended
EXA_API_KEY=...               # free — LinkedIn basics via Exa
CURSOR_MODEL=composer-2.5
```

2. Install and run the **live** browser UI (keep this running in its own terminal):

```bash
pnpm install
pnpm ui
```

Open [http://localhost:8787](http://localhost:8787).

Screening jobs run **in the background** on that server. You can watch every attendee accept/waitlist/reject live via SSE. From chat/CLI (non-blocking):

```bash
pnpm enqueue -- --csv "./guests.csv" --persona agents
# returns immediately → watch http://localhost:8787
```

## Get a GitHub token (free)

1. Open [GitHub → Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
2. **Fine-grained token** (preferred) or **Classic**
3. Fine-grained:
   - Resource owner: your user
   - Repository access: **Public repositories** (read-only is enough)
   - Permissions: **Contents: Read-only** (and Metadata is automatic)
4. Classic alternative: `public_repo` scope only
5. Copy token → paste into `.env` as `GITHUB_TOKEN=`
6. Restart `pnpm ui`

Without a token, GitHub still works for small runs but rate-limits faster (and some networks hit TLS issues).

## Get an Exa key (free LinkedIn basics)

1. Sign up / log in at [dashboard.exa.ai](https://dashboard.exa.ai)
2. Open [API Keys](https://dashboard.exa.ai/api-keys)
3. Create a key (free tier is enough for basic profile text)
4. Paste into `.env` as `EXA_API_KEY=`
5. Restart `pnpm ui`

Exa is used to pull readable text for LinkedIn URLs / people search. Private profiles may return little — that’s expected.

## CLI (optional)

```bash
# Copy + edit event config (capacity, allowlist, prioritize/deprioritize)
cp event_config.example.json event_config.json

pnpm screen -- --csv ./guests.csv --persona agents --event-config ./event_config.json --out ./out/run1
# Live: scored.csv grows after each guest. At the end it is rewritten ranked.
# Preflight (from community registration-approvals skill): drop declined, dedupe,
# allowlist auto-accept, completeness score, optional capacity cap.

# If interrupted, continue without redoing finished emails:
pnpm screen -- --csv ./guests.csv --persona agents --out ./out/run1 --resume

# After you review scored.csv, export Luma bulk lists:
pnpm export-decisions -- --out ./out/run1 --confirm-reviewed

pnpm eval -- --heuristics-only
pnpm test
```

### Strengths borrowed from `registration-approvals`

| Feature | What we do |
|---|---|
| Completeness Pass 1 | Score answers + profile links before LLM |
| Allowlist | Auto-accept `@cursor.com` / configured domains |
| Dedup | Email/phone keep flags; non-keep → reject without LLM |
| Capacity | Demote lowest accepts to waitlist when over target |
| Human export | `approve.csv` / `decline.csv` only with `--confirm-reviewed` |
| Event context | Prioritize / deprioritize injected into Cursor judges |

Still Cursor-SDK powered (no Anthropic key). GitHub enrichment uses `GITHUB_TOKEN` when set.

### Cursor usage signal (GitHub)

When a guest has a GitHub URL, enrichment runs code search for public:

- `.cursor/` (rules, etc.)
- `.cursorrules`

Results land in `scored.csv` as `cursor_used_likely`, `cursor_signals`, `cursor_sample_paths`.  
**Hit = likely used Cursor on a public repo. Miss proves nothing** (private repos / never committed).

```bash
pnpm exec tsx scripts/github-cursor-smoke.ts <github-username>
```

## Personas

| Id | Use when |
|---|---|
| `cursor-dev` | Default Cursor meetups — GitHub-heavy |
| `agents` | ADK/MCP workshops (LinkedIn + agent answers; GitHub optional) |
| `founders` | Founder / operator rooms |
| `pms` | Product-heavy sessions |
| `mixed` | Mixed audience |
