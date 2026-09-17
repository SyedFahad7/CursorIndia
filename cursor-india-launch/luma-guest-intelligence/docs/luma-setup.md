# Luma setup

Event: **AI Builders Meetup: Build Club Launch [Hyderabad]**  
Public URL: `https://lu.ma/lqd04um2`  
Event id: `evt-LacddyDlntzvA8S`

## What you need on Luma

Live sync needs a webhook on the **calendar that manages this event**, not only the event overview page.

1. Open [Calendars](https://lu.ma/home) → select the calendar that owns this event  
2. **Settings → Developer → Webhooks**  
3. **Create** webhook  
4. URL = your Workato webhook URL (from Recipe A)  
5. Enable:
   - **Guest Registered**
   - **Guest Updated** (optional but useful when approval status changes)

### Requirements

- **Luma Plus** is required for native webhooks  
- Event must be **managed** by that calendar (created there, transferred, or manage access granted)

Without Luma Plus: export guests CSV periodically, or use Zapier “Guest Registered” → Workato webhook (acceptable for ops, weaker for a Workato-native demo).

## You do NOT need for this project

- Embed checkout button  
- Clone event  
- Cancel event  
- Changing the public URL after sharing

## Registration questions (recommended)

Keep 2–3 short questions so Cursor has signal:

1. What are you building?  
2. Why do you want to attend?  
3. LinkedIn URL (if not already a Luma field)

## Demo tip

For stage demos, keep Luma “Require approval” on so scored Notion tiers map cleanly to Approve / Waitlist / Decline in Luma manually (or later automate via Luma API if you add it).
