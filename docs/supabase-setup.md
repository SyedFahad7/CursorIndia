# Supabase setup for event recaps (beginner guide)

Ambassadors add recaps at **`/admin/hyderabad`**, **`/admin/bengaluru`**, etc.  
Recap text lives in **Supabase Postgres**. Photos live in **Supabase Storage**.  
**No credit card required** on the free tier. No git, no redeploy per recap.

**Never paste secret keys in chat.** Put them only in `.env.local` and Vercel env vars.

---

## Links

| Step | Link |
|------|------|
| **Sign up / log in** | [https://supabase.com/dashboard](https://supabase.com/dashboard) |
| **Create a project** | Dashboard → **New project** |
| **SQL Editor** (run migration) | Project → **SQL Editor** → New query |
| **API keys** | Project → **Project Settings** → **API** |
| **Storage buckets** | Project → **Storage** |
| **Vercel env vars** (live site) | [https://vercel.com/dashboard](https://vercel.com/dashboard) |

**Free tier includes:** 500 MB database, 1 GB file storage, 50 MB/month egress — plenty to start.

---

## Step 1 — Create a Supabase project

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign up with email or GitHub (no card needed on free tier)
3. Click **New project**
4. Fill in:
   - **Name:** `cursor-india` (anything works)
   - **Database password:** pick a strong password (save it — you need it for DB access, not for the website)
   - **Region:** Southeast Asia (Singapore) or closest to India
5. Click **Create new project** and wait ~2 minutes

---

## Step 2 — Run the database migration

1. In your project, open **SQL Editor** (left sidebar)
2. Click **New query**
3. Open this file in your repo: **`supabase/migrations/001_recaps.sql`**
4. Copy the entire SQL and paste into the Supabase SQL Editor
5. Click **Run**
6. Repeat for **`supabase/migrations/002_admin_settings.sql`** (profile + Luma settings from `/admin`) (or Ctrl+Enter)

This creates:

- `recaps` table (summary, photos list, city, event slug)
- `recap-photos` storage bucket (public read for images)

---

## Step 3 — Copy API keys

1. Go to **Project Settings** (gear icon) → **API**
2. Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`  
   Example: `https://abcdefghijklmnop.supabase.co`
3. Under **Project API keys**, copy **`service_role`** → `SUPABASE_SERVICE_ROLE_KEY`  
   ⚠️ This is **secret**. Never put it in client-side code or commit it to git.

You do **not** need the `anon` key for this setup — the website uses `service_role` only on the server.

---

## Step 4 — Verify storage bucket

1. Go to **Storage** in the left sidebar
2. You should see bucket **`recap-photos`**
3. It should be marked **Public** (so recap images show on the website)

If the bucket is missing, re-run the SQL from Step 2.

---

## Step 5 — Ambassador passwords

**Session secret** (PowerShell on Windows):

```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }) -as [byte[]])
```

→ `ADMIN_SESSION_SECRET`

**City passwords** (one per ambassador):

```env
CITY_ADMIN_PASSWORDS={"hyderabad":"YourHydPassword123","bengaluru":"YourBlrPassword123"}
```

City slugs: `hyderabad`, `bengaluru`, `mumbai`, `chennai`, `delhi`, `pune`, `vadodara`, `ahmedabad`, `kashmir`

---

## Step 6 — Create `.env.local`

In your project folder, create **`.env.local`**:

```env
ADMIN_SESSION_SECRET=paste-from-step-5
CITY_ADMIN_PASSWORDS={"hyderabad":"your-password"}

NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_SERVICE_ROLE_KEY=paste-service-role-key-here
```

Restart dev server:

```bash
pnpm dev
```

---

## Step 7 — Test locally

1. **http://localhost:3000/admin/hyderabad**
2. Log in with your Hyderabad password
3. Pick a **past event** → **Add recap**
4. Upload photos + write summary → **Publish recap**
5. Check **http://localhost:3000/cities/hyderabad** and **http://localhost:3000/recaps/&lt;event-slug&gt;**

In Supabase **Table Editor** → `recaps` you should see a new row.  
In **Storage** → `recap-photos` you should see uploaded images.

---

## Step 8 — Vercel (production)

1. [https://vercel.com/dashboard](https://vercel.com/dashboard) → your project
2. **Settings** → **Environment Variables**
3. Add all four variables from `.env.local`
4. **Redeploy**

---

## Checklist

```
[ ] Supabase project created
[ ] SQL migration run (recaps table + recap-photos bucket)
[ ] NEXT_PUBLIC_SUPABASE_URL copied
[ ] SUPABASE_SERVICE_ROLE_KEY copied (service_role, not anon)
[ ] ADMIN_SESSION_SECRET generated
[ ] CITY_ADMIN_PASSWORDS set
[ ] .env.local saved
[ ] pnpm dev restarted
[ ] Test recap published
[ ] Same vars on Vercel + redeployed
```

---

## Ambassador cheat sheet

> **After your event:** go to **yoursite.com/admin/hyderabad** → enter password → pick past event → upload photos + summary → **Publish recap**. Shows on the city page in ~1 minute.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| “Admin is not configured” | All 4 env vars set? Restart `pnpm dev` |
| “Storage not configured” | Check `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` |
| Upload fails | Re-run SQL migration; check `recap-photos` bucket exists |
| Login fails | JSON keys must be lowercase slugs: `hyderabad` not `Hyderabad` |
| Photos broken on site | Bucket must be **public**; redeploy Vercel after env changes |
| `relation "recaps" does not exist` | Run `supabase/migrations/001_recaps.sql` in SQL Editor |

---

## Security

- `SUPABASE_SERVICE_ROLE_KEY` bypasses Row Level Security — **server only**
- `.env.local` is gitignored
- Give each ambassador only their city password
- Admin pages are `noindex`
