# Notion schema

Create one Notion database: **Event Guests**.

## Database properties

| Property | Type | Notes |
|----------|------|--------|
| Name | Title | Guest full name |
| Email | Email | Unique key for upserts |
| Luma Guest ID | Rich text | From webhook `guest` id |
| Luma Status | Select | `pending` / `approved` / `declined` / … |
| LinkedIn | URL | Optional |
| Why attending | Rich text | From Luma registration answers |
| What building | Rich text | From Luma registration answers |
| Registered At | Date | Optional |
| Score | Number | 0–100 from Cursor |
| Tier | Select | `approve` / `waitlist` / `reject` |
| Reason | Rich text | 1–2 sentence host explanation |
| Persona | Select or text | e.g. `student-builder`, `founder` |
| Approval message | Rich text | Paste into Luma when approving |
| Screen Status | Select | `pending_score` / `screened` / `synced` |
| Batch ID | Rich text | Optional — e.g. `batch-3` |

## Event config page (or second DB: Event Config)

Single page / single-row DB:

| Property | Example |
|----------|---------|
| Event name | AI Builders Meetup: Build Club Launch [Hyderabad] |
| Batch size | `5` for demo, `50` for production |
| Target accepts | `80` or `100` |
| Criteria | Host free-text instructions for Cursor |
| Criteria ready | Checkbox |

Workato reads this before calling `/v1/screen-batch`.

## Views (projector-friendly)

1. **Needs scoring** — Screen Status = `pending_score`  
2. **Approve queue** — Tier = `approve`, sorted by Score  
3. **Waitlist** — Tier = `waitlist`  
4. **Board** — grouped by Tier

## Mapping from API response

`POST /v1/screen-batch` returns `screened[]`:

| API field | Notion property |
|-----------|-----------------|
| `score` | Score |
| `tier` | Tier |
| `reason` | Reason |
| `persona` | Persona |
| `approvalMessage` | Approval message |
| (constant) `screened` | Screen Status |
