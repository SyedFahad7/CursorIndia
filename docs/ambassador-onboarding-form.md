# Ambassador onboarding — Google Form copy

Use this to build the form at [https://forms.google.com](https://forms.google.com) → **Blank form**.

**Suggested form title:** Cursor India — Ambassador onboarding

---

## Form description (paste into “Form description”)

```
Thanks for being a Cursor India ambassador! This short form collects what we need to put you on the website and wire up your city’s events.

WHAT HAPPENS AFTER YOU SUBMIT
• We add your profile to cursorindia.com and link your city’s Luma calendar.
• Once your Luma Calendar ID is configured, the site automatically pulls all upcoming and past events from your Luma calendar — no manual entry per event.
• New events: publish on Luma as usual — they show on the site within about 1 minute.
• Past events: after your calendar is connected, go to your city admin page (see below) and add recaps (photos + summary) for events that already happened.

YOUR CITY ADMIN PAGE
Each ambassador gets a private page to publish event recaps after meetups:
  https://cursorindia.com/admin/<your-city>

Examples:
  • Hyderabad → /admin/hyderabad
  • Bengaluru → /admin/bengaluru
  • Mumbai → /admin/mumbai

We’ll send you your city password separately (keep it private). Log in → pick a past event → upload photos → write a short summary → Publish. Recaps appear on your city page and at /recaps/<event-slug>.

Questions? Reply on the ambassador WhatsApp group or email the India team.
```

*(Replace `cursorindia.com` with your live URL if different, e.g. `cursor-india.vercel.app`.)*

---

## Questions (add in this order)

### 1. Full name
- **Type:** Short answer  
- **Required:** Yes  

### 2. Email
- **Type:** Short answer  
- **Required:** Yes  
- **Validation:** Email  

### 3. City
- **Type:** Dropdown  
- **Required:** Yes  
- **Options:**
  - Bengaluru
  - Mumbai
  - Chennai
  - Hyderabad
  - Delhi
  - Pune
  - Vadodara
  - Ahmedabad
  - Kashmir

### 4. X (Twitter) profile URL
- **Type:** Short answer  
- **Required:** No  
- **Description:** Full URL, e.g. `https://x.com/yourhandle`  

### 5. LinkedIn profile URL
- **Type:** Short answer  
- **Required:** No  
- **Description:** Full URL, e.g. `https://linkedin.com/in/yourname`  

### 6. Luma calendar page URL (public)
- **Type:** Short answer  
- **Required:** Yes  
- **Description:**
```
The public page where people RSVP to your city’s events.

Example (Hyderabad):
https://luma.com/cursor-hyderabad-india

In Luma: open your city calendar → copy the URL from the browser bar.
```

### 7. Luma Calendar ID (for auto-sync)
- **Type:** Short answer  
- **Required:** Yes  
- **Description:**
```
This is how the website automatically imports your events from Luma.

HOW TO FIND IT
1. Log in to Luma (lu.ma) and open your city’s calendar dashboard.
2. Go to Settings → Calendar API (or “Sync calendar” / “Subscribe to calendar”).
3. Find the iCal or “Calendar feed” link. It looks like:
   https://api.lu.ma/ics/get?entity=calendar&id=cal-XXXXXXXXXXXX
4. Copy only the cal-… part — that is your Calendar ID.

EXAMPLE (Hyderabad)
Calendar ID: cal-Ap2jcMAsVNDdimN

Paste your cal-… value below (starts with “cal-”).
```

### 8. Headshot photo
- **Type:** File upload  
- **Required:** Yes  
- **Description:**
```
Upload one clear photo of yourself (square or portrait works best).

• JPG or PNG, at least 400×400 px if possible
• Plain background preferred — used on the Ambassadors section and your city page
• Only one file
```

---

## Google Forms settings (recommended)

| Setting | Value |
|--------|--------|
| Collect email addresses | Optional (you already ask email in Q2) |
| Limit to 1 response | Off (unless one form per person with Google sign-in) |
| File upload | Requires Google sign-in — turn on “Respondents must sign in” **or** ask ambassadors to email headshot separately if that’s a blocker |
| Response destination | Link to a Google Sheet for easy review |

---

## After responses come in

For each ambassador, update the repo:

1. **`content/ambassadors/<handle>.ts`** — name, city, photo path, X/LinkedIn links  
2. **`content/cities/<city>.ts`** — `lumaCalendarId: "cal-…"`, `links.luma: "https://luma.com/…"`  
3. **`public/images/ambassadors/`** — save headshot (e.g. `syed-fahad.jpg`)  
4. **`CITY_ADMIN_PASSWORDS`** in Vercel env — add their city password and send them `/admin/<city>` + password privately  

---

## One-line share message (WhatsApp / email)

```
Fill this once so we can list you on the site and auto-sync your Luma events: [PASTE FORM LINK]. Takes ~5 min. We’ll send your /admin/<city> password separately for posting event recaps.
```
