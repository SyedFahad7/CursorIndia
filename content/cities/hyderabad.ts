import type { City } from "@/lib/types";

export const hyderabad: City = {
  slug: "hyderabad",
  name: "Hyderabad",
  // Public Luma calendar page (the human-facing /cursor-<city> URL). Used for
  // the "Subscribe for Updates" link on the city page. `lumaCalendarId` below
  // is the separate API id used to auto-import events from the iCal feed.
  links: {
    luma: "https://luma.com/cursor-hyderabad-india",
  },
  lumaCalendarId: "cal-Ap2jcMAsVNDdimN",
  i18n: {
    hi: { name: "हैदराबाद" },
  },
};
