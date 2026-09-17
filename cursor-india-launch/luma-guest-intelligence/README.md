# Luma Guest Intelligence

**Luma → Workato → Notion → Cursor** batch screener for Cursor + Workato demos.

Live registrations land in Notion via Workato. Every N guests, Cursor scores the batch against your acceptance criteria and writes `Score` / `Tier` / `Reason` / `Approval message` back (through Workato).

## Quick start (local demo)

```bash
cd cursor-india-launch/luma-guest-intelligence
cp .env.example .env
# set CURSOR_API_KEY=...  (optional for heuristic dry-run)
pnpm install
pnpm dev
```

Open [http://localhost:8790](http://localhost:8790).

1. Paste acceptance criteria → **Save**  
2. **Seed 5 demo guests** (or ingest one by one)  
3. Set batch size to `5` → **Screen next batch**  
4. Watch the Notion-style board update  

Without `CURSOR_API_KEY`, use **heuristic dry-run** to rehearse the flow.

## Architecture

```
Luma (Guest Registered webhook)
  → Workato Recipe A → Notion Guests (pending_score)
  → Workato Recipe B (every batch_size)
       → asks host for criteria if missing
       → POST /v1/screen-batch  (this service + Cursor SDK)
       → Notion update Score/Tier/Reason/Approval message
```

## API (for Workato)

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/v1/config` | Set criteria, batch size, target accepts |
| `POST` | `/v1/ingest` | Optional mirror of a Luma/Notion guest |
| `POST` | `/v1/screen-batch` | Score a guest array (main Workato call) |
| `POST` | `/v1/screen-pending` | Score local pending queue |
| `GET` | `/v1/state` | Debug snapshot |
| `GET` | `/health` | Liveness |

Auth: `Authorization: Bearer <API_KEY>` or `X-Api-Key` (skipped when `API_KEY=dev-local-key`).

### Example `screen-batch` body

```json
{
  "alreadyAccepted": 0,
  "targetAccepts": 80,
  "criteria": "Prefer concrete agent builders; reject empty one-liners.",
  "guests": [
    {
      "id": "notion-page-id",
      "name": "Ada",
      "email": "ada@example.com",
      "answers": [
        { "question": "What are you building?", "answer": "MCP memory agent" }
      ]
    }
  ]
}
```

If `criteria` is empty → `409 criteria_needed` with an `askHost` prompt for your Workato/Notion “action needed” step.

## Docs

- [Luma setup](./docs/luma-setup.md) — what to click on Luma  
- [Notion schema](./docs/notion-schema.md) — database properties  
- [Workato recipes](./docs/workato-recipes.md) — Recipe A/B/C  

## Event defaults

- Event: AI Builders Meetup: Build Club Launch [Hyderabad]  
- Demo batch size: **5** (stage)  
- Prod batch size: **50**  
- Target accepts: **80** (configurable)
