# Workato recipes

Expose the Node service with a public URL (ngrok / Cloudflare Tunnel / hosted) so Workato can call it.

Base URL example: `https://YOUR_TUNNEL.example`  
Auth header: `Authorization: Bearer <API_KEY>` (same as `.env` `API_KEY`)

---

## Recipe A — Luma guest → Notion

**Trigger:** Workato Webhooks → New event (JSON)  
Point Luma calendar webhook at this URL.

**Steps:**

1. Parse guest fields from payload (`name`, `email`, registration answers, guest id).  
2. Notion → Search Event Guests by Email (or Luma Guest ID).  
3. If missing → Create page; else → Update page.  
4. Set `Screen Status` = `pending_score`.  
5. (Optional) HTTP → `POST /v1/ingest` with the same guest (keeps local demo queue in sync).

---

## Recipe B — Batch threshold → ask criteria → Cursor screen

**Trigger:** Scheduler every 1–5 minutes **or** Recipe A calls this when pending count % batch size == 0.

**Steps:**

1. Notion → Query Event Guests where `Screen Status` = `pending_score` (limit = batch size).  
2. If count < batch size → stop.  
3. Read Event Config → `Criteria`.  
4. **If criteria empty:**
   - Create/update a Notion “Action needed” page:  
     *“Cursor needs acceptance criteria. Reply on the Config page.”*  
   - Optional: Gmail to yourself.  
   - Stop.  
5. Count pages where `Tier` = `approve` → `alreadyAccepted`.  
6. HTTP POST `{{base}}/v1/screen-batch`

```json
{
  "alreadyAccepted": 12,
  "targetAccepts": 80,
  "criteria": "{{criteria from Notion config}}",
  "eventName": "AI Builders Meetup: Build Club Launch [Hyderabad]",
  "guests": [
    {
      "id": "{{notion_page_id}}",
      "name": "...",
      "email": "...",
      "linkedinUrl": "...",
      "answers": [
        { "question": "What are you building?", "answer": "..." },
        { "question": "Why attend?", "answer": "..." }
      ]
    }
  ]
}
```

7. For each item in `screened[]` → Notion Update page by `id`:
   - Score, Tier, Reason, Persona, Approval message  
   - Screen Status = `screened`

---

## Recipe C (optional) — capacity guard

When `alreadyAccepted >= targetAccepts`:

- Still score new batches, but Cursor/service will mostly return `waitlist`.  
- Or skip Cursor and set Tier = `waitlist` with reason “Capacity reached”.

---

## Stage demo settings

| Setting | Demo | Production |
|---------|------|------------|
| Batch size | 5 | 50 |
| Target accepts | 10–20 | 80–100 |
| Trigger | Manual Workato job / local dashboard | Scheduler + webhook |

Local without Workato: open `http://localhost:8790`, seed guests, save criteria, screen batch.
