// Locale dictionaries for Cursor India.
//
// Design:
//   - Strongly typed nested `Dict` object. Adding a key in `en` makes `hi`
//     a compile error until matched. No string-key drift, no missing translations.
//   - Hindi (`hi`) dictionary and city/ambassador i18n overrides are kept in the
//     repo but paused — site is English-only until we support several languages.
//   - Sentences with brand names (Cursor, Cursor India, Luma, Discord, X,
//     LinkedIn, GitHub) keep brand names in English.

export type Locale = "en" | "hi";

export const LOCALES: readonly Locale[] = ["en", "hi"] as const;
export const DEFAULT_LOCALE: Locale = "en";
export const COOKIE_NAME = "cursor-india-locale";

export interface Dict {
  nav: {
    events: string;
    cities: string;
    ambassadors: string;
    gallery: string;
    about: string;
    join: string;
    joinFull: string;
    homeAria: string;
    openMenu: string;
    closeMenu: string;
    primaryAria: string;
    mobileAria: string;
  };
  locale: {
    label: string;
    switchTo: (next: string) => string;
  };
  meta: {
    description: string;
    titleSuffix: string;
  };
  footer: {
    sections: {
      site: string;
      general: string;
      community: string;
    };
    tagline: string;
    nav: {
      events: string;
      cities: string;
      ambassadors: string;
      gallery: string;
      about: string;
      codeOfConduct: string;
    };
    cursor: {
      community: string;
      followX: string;
      joinWhatsapp: string;
    };
  };
  hero: {
    eyebrow: string;
    title: string;
    lead: string;
    primaryCta: string;
    secondaryCta: string;
  };
  intro: {
    h1: string;
    h2: string;
    line1: string;
    line2: string;
    audiences: {
      developers: { title: string; description: string };
      designers: { title: string; description: string };
      students: { title: string; description: string };
      founders: { title: string; description: string };
    };
  };
  stats: {
    cities: string;
    members: string;
    events: string;
    sectionAria: string;
  };
  nextEvent: {
    eyebrow: string;
    titlePrefix: string;
    saveTheDate: string;
    ist: string;
    capacity: string;
    register: string;
    details: string;
    seeAll: string;
  };
  upcoming: {
    eyebrow: string;
    title: string;
    cta: string;
    empty: string;
  };
  citiesGrid: {
    eyebrow: string;
    title: string;
    cta: string;
  };
  ambassadorsStrip: {
    eyebrow: string;
    title: string;
    cta: string;
  };
  photoCarousel: {
    eyebrow: string;
    title: string;
    subhead: string;
    cta: string;
    sectionAria: string;
  };
  letter: {
    heading: string;
    paragraphs: readonly string[];
    role: string;
  };
  globalEvents: {
    title: string;
    body: string;
    cta: string;
  };
  faq: {
    heading: string;
    items: readonly {
      question: string;
      parts: readonly (
        | { type: "text"; value: string }
        | {
            type: "link";
            label: string;
            href: string;
            external?: boolean;
          }
      )[];
    }[];
  };
  common: {
    cursorAmbassador: string;
    eventDetails: string;
    details: string;
    backTo: (label: string) => string;
    going: string;
    capacity: string;
    moreOnEventPage: (n: number) => string;
  };
  pages: {
    events: {
      title: string;
      metaDesc: string;
      lead: string;
      upcomingHeading: string;
      pastHeading: string;
      emptyUpcoming: string;
      emptyPast: string;
    };
    eventDetail: {
      notFound: string;
      free: string;
      capacity: string;
      to: string;
      ist: string;
      register: string;
      originalRsvp: string;
      aboutCursorCity: (city: string) => string;
      aboutThisEvent: string;
      agenda: string;
      recap: string;
      hostedBy: string;
      ambassadorAt: (city: string) => string;
      partners: string;
      codeOfConductEyebrow: string;
      codeOfConductBody: {
        prefix: string;
        link: string;
        suffix: string;
      };
      galleryEyebrow: string;
      galleryHeading: string;
      allPhotos: string;
    };
    cities: {
      title: string;
      metaDesc: string;
      lead: string;
    };
    cityDetail: {
      back: string;
      cursorPrefix: string;
      subscribeLuma: string;
      subscribeUpdates: string;
      ambassadorsHeading: string;
      upcomingHeading: (city: string) => string;
      pastHeading: (city: string) => string;
      emptyUpcoming: string;
      notFound: string;
      metaDesc: (city: string) => string;
    };
    ambassadors: {
      title: string;
      metaDesc: string;
      lead: string;
      empty: string;
      cta: {
        heading: string;
        body: string;
        link: string;
      };
    };
    ambassadorDetail: {
      back: string;
      eventsHeading: string;
      notFound: string;
      metaDesc: (name: string, city: string) => string;
    };
    gallery: {
      title: string;
      metaDesc: string;
      lead: string;
      emptyPrefix: string;
      emptySuffix: string;
      eventDetails: string;
    };
    about: {
      title: string;
      metaDesc: string;
      lead: string;
      whatHeading: string;
      globalHeading: string;
      globalBody: string;
      whatBody: {
        intro: string;
        cafe: string;
        cafeDesc: string;
        workshops: string;
        workshopsDesc: string;
        meetups: string;
        meetupsDesc: string;
        hackathons: string;
        hackathonsDesc: string;
      };
      howHeading: string;
      principles: readonly {
        title: string;
        body: string;
      }[];
      principlesTail: string;
      hostHeading: string;
      hostBody: {
        intro: string;
        cta: string;
        tail: string;
      };
    };
    join: {
      title: string;
      metaDesc: string;
      lead: string;
      steps: readonly {
        n: string;
        title: string;
        body: string;
        ctaLabel: string;
      }[];
    };
    submit: {
      title: string;
      metaDesc: string;
      lead: string;
      form: {
        nameLabel: string;
        namePlaceholder: string;
        emailLabel: string;
        emailPlaceholder: string;
        cityLabel: string;
        cityPlaceholder: string;
        messageLabel: string;
        messagePlaceholder: string;
        submit: string;
        sending: string;
        success: string;
        error: string;
      };
    };
    codeOfConduct: {
      title: string;
      metaDesc: string;
      tldrHeading: string;
      tldrBody: string;
      introHeading: string;
      introBody: string;
      expectedHeading: string;
      expectedItems: readonly { title: string; body: string }[];
      notHeading: string;
      notItems: readonly string[];
      reportingHeading: string;
      reportingIntro: string;
      reportingItems: readonly string[];
      reportingNote: string;
      consequencesHeading: string;
      consequencesBody: string;
      ackHeading: string;
      ackBody: string;
      contactHeading: string;
      contactBody: {
        prefix: string;
        suffix: string;
      };
      backToAbout: string;
    };
    /** Static page entries surfaced by the Cmd+K search. */
    searchPages: readonly {
      title: string;
      href: string;
      subtitle: string;
    }[];
  };
}

const en: Dict = {
  nav: {
    events: "Events",
    cities: "Cities",
    ambassadors: "Ambassadors",
    gallery: "Gallery",
    about: "About",
    join: "Join",
    joinFull: "Join the community",
    homeAria: "Cursor India home",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    primaryAria: "Primary",
    mobileAria: "Mobile",
  },
  locale: {
    label: "Language",
    switchTo: (next) => `Switch language to ${next.toUpperCase()}`,
  },
  meta: {
    description:
      "A community of builders shipping with Cursor across India. Café Cursor, workshops, meetups, and hackathons in cities across the country.",
    titleSuffix: "Build with Cursor in India",
  },
  footer: {
    sections: {
      site: "Site",
      general: "General",
      community: "Community",
    },
    tagline: "Cursor community in India",
    nav: {
      events: "Events",
      cities: "Cities",
      ambassadors: "Ambassadors",
      gallery: "Gallery",
      about: "About",
      codeOfConduct: "Code of Conduct",
    },
    cursor: {
      community: "Cursor Community",
      followX: "Follow us on X",
      joinWhatsapp: "Join WhatsApp Community",
    },
  },
  hero: {
    eyebrow: "Cursor India",
    title: "Build with Cursor in India.",
    lead: "The official hub of builders shipping with Cursor in India. We meet up in person for Café Cursor, workshops, hackathons and more in cities across the country.",
    primaryCta: "Explore events",
    secondaryCta: "See cities",
  },
  intro: {
    h1: "AI is here.",
    h2: "And the way we build with it is still being figured out.",
    line1: "Wherever you are in that, you are welcome.",
    line2: "Cursor India is built for whoever shows up.",
    audiences: {
      developers: {
        title: "Developers",
        description:
          "Ship faster with agents, autocomplete, and Cmd+K. Compare workflows with people who use Cursor every day.",
      },
      designers: {
        title: "Designers",
        description:
          "Build real things in real code, not just mockups. Cross the line into shipping, with people who do it.",
      },
      students: {
        title: "AI Evangelists",
        description:
          "Start with the same tools the industry uses. Meet engineers and founders in your city.",
      },
      founders: {
        title: "Founders/Solopreneurs",
        description:
          "Cut weeks off your roadmap. Find collaborators and feedback at every meetup.",
      },
    },
  },
  stats: {
    cities: "Cities",
    members: "Members",
    events: "Events",
    sectionAria: "Community statistics",
  },
  nextEvent: {
    eyebrow: "What's next",
    titlePrefix: "Coming up in",
    saveTheDate: "Save the date",
    ist: "IST",
    capacity: "Capacity",
    register: "Register on Luma",
    details: "Event details",
    seeAll: "See all events →",
  },
  upcoming: {
    eyebrow: "Calendar",
    title: "More on the schedule",
    cta: "All events",
    empty: "Nothing else on the calendar yet. More coming soon.",
  },
  citiesGrid: {
    eyebrow: "Cities",
    title: "One Community, Many Cities",
    cta: "All cities",
  },
  ambassadorsStrip: {
    eyebrow: "Ambassadors",
    title: "Cursor Ambassadors across India",
    cta: "All ambassadors",
  },
  photoCarousel: {
    eyebrow: "Gallery",
    title: "Moments from the community",
    subhead:
      "Meetups, workshops, and hackathons across India — a quiet scroll through what we build together.",
    cta: "View gallery",
    sectionAria: "Photos from Cursor India events",
  },
  letter: {
    heading: "Hey Builder,",
    paragraphs: [
      "AI is changing how we build software.",
      "It is exciting; it is also a lot to keep up with.",
      "The truth is:",
      "No one has this fully figured out yet.",
      "But the way software gets made is shifting under our feet, and the people who learn together will move faster than the people who learn alone.",
      "That is why Cursor India exists.",
      "We get together in person: cafe meetups, workshops, and hackathons, in cities across the country. You bring whatever you are working on. We bring the people and the space.",
      "It is open to anyone shipping with Cursor: developers, designers, students, founders, hobbyists. There is no qualification beyond curiosity.",
      "Welcome to Cursor India! Let us figure this out together.",
    ],
    role: "Cursor APAC Region Lead",
  },
  globalEvents: {
    title: "Cursor Community events globally",
    body: "Cursor community events around the world. Find a meetup or café near you.",
    cta: "All events on Luma",
  },
  faq: {
    heading: "Frequently asked questions",
    items: [
      {
        question: "What is Cursor India?",
        parts: [
          {
            type: "text",
            value:
              "Cursor India is an unofficial, community-run hub for meetups, hackathons, and recaps centred on the Cursor AI code editor in India. We are not affiliated with Anysphere (the maker of Cursor) or with any other entity using the Cursor name.",
          },
        ],
      },
      {
        question: "Is this the official Cursor website?",
        parts: [
          {
            type: "text",
            value: "No. The official Cursor product website is ",
          },
          {
            type: "link",
            label: "cursor.com",
            href: "https://cursor.com",
            external: true,
          },
          {
            type: "text",
            value:
              ". This site is run by community ambassadors and volunteers based in India. All trademarks belong to their respective owners.",
          },
        ],
      },
      {
        question: "How do I attend a Cursor India event?",
        parts: [
          {
            type: "text",
            value: "Browse upcoming events on the ",
          },
          { type: "link", label: "Events", href: "/events" },
          {
            type: "text",
            value:
              " page or open Luma. Most events are free and on-site in Indian cities. Hosts are ambassadors in your city; details are listed on each event card.",
          },
        ],
      },
    ],
  },
  common: {
    cursorAmbassador: "Cursor Ambassador",
    eventDetails: "Event details",
    details: "Details",
    backTo: (label) => `← ${label}`,
    going: "going",
    capacity: "Capacity",
    moreOnEventPage: (n) => `+${n} more on the event page`,
  },
  pages: {
    events: {
      title: "Events",
      metaDesc:
        "All Cursor India events: Café Cursor, workshops, meetups, and hackathons across Indian cities.",
      lead: "Events across Indian cities. Free unless we say otherwise. Bring your laptop and what you're currently building.",
      upcomingHeading: "Upcoming",
      pastHeading: "Past events",
      emptyUpcoming:
        "Nothing scheduled right now. Join the chat to suggest one in your city.",
      emptyPast: "We haven't done one yet. Watch this space.",
    },
    eventDetail: {
      notFound: "Event not found",
      free: "Free",
      capacity: "Capacity",
      to: "to",
      ist: "IST",
      register: "Register on Luma",
      originalRsvp: "Original RSVP",
      aboutCursorCity: (city) => `About Cursor ${city}`,
      aboutThisEvent: "About this event",
      agenda: "Agenda",
      recap: "Recap",
      hostedBy: "Hosted by",
      ambassadorAt: (city) => `Cursor Ambassador, ${city}`,
      partners: "Partners",
      codeOfConductEyebrow: "Code of conduct",
      codeOfConductBody: {
        prefix: "All Cursor India events are governed by our",
        link: "code of conduct",
        suffix: ". By attending you agree to it.",
      },
      galleryEyebrow: "Gallery",
      galleryHeading: "Photos from the event",
      allPhotos: "All photos →",
    },
    cities: {
      title: "Cities",
      metaDesc: "Cursor community in India by city.",
      lead: "Each city is run by a local ambassador.",
    },
    cityDetail: {
      back: "← Cities",
      cursorPrefix: "Cursor",
      subscribeLuma: "Subscribe on Luma",
      subscribeUpdates: "Subscribe for Updates",
      ambassadorsHeading: "Ambassadors",
      upcomingHeading: (city) => `Upcoming in ${city}`,
      pastHeading: (city) => `Past events in ${city}`,
      emptyUpcoming: "Nothing scheduled yet.",
      notFound: "Chapter not found",
      metaDesc: (city) => `Cursor India chapter for ${city}.`,
    },
    ambassadors: {
      title: "Cursor Ambassadors",
      metaDesc: "Cursor Ambassadors across India.",
      lead: "The people who run Cursor India in their cities. Reach out, they organise the meetups in your area.",
      empty: "No ambassadors listed yet.",
      cta: {
        heading: "Want to be one?",
        body: "No chapter in your city yet, or one that could use a hand? Tell us a bit about yourself and where you're based. We're always looking for people who want to bring this to their corner of India.",
        link: "Apply to host",
      },
    },
    ambassadorDetail: {
      back: "← Ambassadors",
      eventsHeading: "Events",
      notFound: "Ambassador not found",
      metaDesc: (name, city) => `${name}, Cursor Ambassador, ${city}.`,
    },
    gallery: {
      title: "Gallery",
      metaDesc: "Photos from Cursor India events across the country.",
      lead: "Faces, demos, and the occasional whiteboard from Café Cursor, workshops, meetups, and hackathons across India.",
      emptyPrefix: "No photos yet — drop images under",
      emptySuffix: "and they'll appear here automatically.",
      eventDetails: "Event details →",
    },
    about: {
      title: "About",
      metaDesc:
        "Cursor India is part of the global Cursor community — cafes, workshops, meetups, and hackathons across India.",
      lead: "Cursor India is the local chapter for builders shipping with Cursor across the country. We run the same kinds of events you will find in 200+ cities worldwide — free, casual, and open to everyone.",
      globalHeading: "Part of a global community",
      globalBody:
        "Cursor's community spans 80+ countries with 700+ events hosted by 300+ ambassadors. From Café Cursor in Austin to hackathons in Berlin, Madrid, and Istanbul, the format is the same everywhere: bring your laptop, build together, meet other developers, and share what you ship. India is one chapter in that network — Bengaluru, Delhi, Mumbai, Hyderabad, and more.",
      whatHeading: "Events we run",
      whatBody: {
        intro: "Four formats, aligned with cursor.com/community:",
        cafe: "Café Cursor",
        cafeDesc:
          "We take over a cafe or co-working space for the day. Build with local Cursor users, grab coffee and Cursor credits, and meet the community. No formal agenda — just bring your laptop and whatever you are working on.",
        workshops: "Workshops",
        workshopsDesc:
          "Hands-on sessions, often two to three hours, with ambassadors and power users. Learn new features, patterns, and advanced workflows you can use the same week.",
        meetups: "Meetups",
        meetupsDesc:
          "Casual evening gatherings in your city. Short talks, live demos, and plenty of hallway time to swap notes with other builders.",
        hackathons: "Hackathons",
        hackathonsDesc:
          "Weekend builds with the community. Ship something real, compete for prizes and Cursor credits, and find collaborators for what comes next.",
      },
      howHeading: "How we run",
      principles: [
        { title: "Free, always.", body: "No tickets, no upsell." },
        { title: "Builders first.", body: "Show, don't just talk." },
        {
          title: "Respect time.",
          body: "Start when we say, end when we say.",
        },
        { title: "No drama.", body: "Read the" },
      ],
      principlesTail: "before you come.",
      hostHeading: "Host in your city",
      hostBody: {
        intro:
          "If you're in a city that doesn't have a chapter yet, or you want to help in one that's forming,",
        cta: "get in touch",
        tail: ".",
      },
    },
    join: {
      title: "Three ways in.",
      metaDesc: "Three ways to join the Cursor India community.",
      lead: "Pick whichever feels right.",
      steps: [
        {
          n: "01",
          title: "Come to an event",
          body: "Easiest way in. Look at the events page, pick the one closest to you, RSVP on Luma.",
          ctaLabel: "See events",
        },
        {
          n: "02",
          title: "Join the WhatsApp group",
          body: "Our main community channel. People share what they are building, post about upcoming meetups, and help each other out between events.",
          ctaLabel: "Join WhatsApp",
        },
        {
          n: "03",
          title: "Help run it",
          body: "Want to host in your city, or volunteer at events? Drop a note. It goes straight to the ambassadors.",
          ctaLabel: "Submit interest",
        },
      ],
    },
    submit: {
      title: "Get in touch.",
      metaDesc: "Tell us about yourself or an event you want to host.",
      lead: "Want to host in your city, run an event, or partner a venue? Send us a note — a few lines about you and your city is plenty.",
      form: {
        nameLabel: "Name",
        namePlaceholder: "Your name",
        emailLabel: "Email",
        emailPlaceholder: "you@example.com",
        cityLabel: "City",
        cityPlaceholder: "Where are you based?",
        messageLabel: "Message",
        messagePlaceholder: "Tell us what you have in mind…",
        submit: "Send message",
        sending: "Sending…",
        success: "Message sent. We will get back to you soon.",
        error: "Something went wrong. Please try again.",
      },
    },
    codeOfConduct: {
      title: "Code of Conduct",
      metaDesc:
        "How we keep Cursor India events and community spaces safe, inclusive, and respectful.",
      tldrHeading: "TL;DR",
      tldrBody:
        "Cursor India is committed to a safe, inclusive, and respectful environment. Treat everyone with respect and avoid discrimination. Unacceptable behavior includes harassment, offensive comments, unwelcome sexual attention, disruptions, and sharing private information without consent. Violations may lead to removal from the event. By participating, you agree to follow this Code of Conduct. Report issues to event organizers or email at",
      introHeading: "Introduction",
      introBody:
        "At Cursor India, we are dedicated to providing a safe, welcoming, and inclusive space for all participants regardless of gender, sexual orientation, disability, physical appearance, body size, race, ethnicity, religion, or technology choices. We do not tolerate harassment of participants in any form. This Code of Conduct applies to all Cursor India events — Café Cursor sessions, workshops, meetups, hackathons, community gatherings — and online spaces including WhatsApp. By participating, you agree to follow this Code of Conduct.",
      expectedHeading: "Expected behavior",
      expectedItems: [
        {
          title: "Be respectful",
          body: "Treat all participants with respect and consideration. Communicate openly and thoughtfully, and be mindful of differing viewpoints and experiences.",
        },
        {
          title: "Be inclusive",
          body: "Create a welcoming environment where everyone feels included. Avoid language or behavior that excludes or discriminates.",
        },
        {
          title: "Be considerate",
          body: "Remember that event spaces are shared. Be aware of your surroundings and considerate of your fellow participants.",
        },
        {
          title: "Be collaborative",
          body: "Support a community where everyone feels comfortable sharing ideas and working together.",
        },
        {
          title: "Be mindful",
          body: "Understand how your words and actions may affect others. Offer and receive constructive feedback with kindness.",
        },
      ],
      notHeading: "Unacceptable behavior",
      notItems: [
        "Harassment, intimidation, or discrimination of any kind.",
        "Verbal or written abuse, including offensive comments or jokes related to gender, sexual orientation, disability, physical appearance, body size, race, ethnicity, religion, or technology choices.",
        "Unwelcome sexual attention, including inappropriate physical contact or sexual remarks.",
        "Sustained disruption of talks, workshops, sessions, or activities.",
        "Sharing others' private information without explicit permission.",
        "Encouraging or advocating any of the above behaviors.",
      ],
      reportingHeading: "Reporting incidents",
      reportingIntro:
        "If you experience or witness any form of unacceptable behavior, or have other concerns, please report it as soon as possible. You can report by:",
      reportingItems: [
        "Contacting an event organizer or ambassador on the spot.",
        "Email at the address below.",
      ],
      reportingNote:
        "All reports will be handled with discretion and confidentiality. We will take appropriate action, which may include removal of the participant from the event.",
      consequencesHeading: "Consequences of unacceptable behavior",
      consequencesBody:
        "Participants asked to stop inappropriate behavior are expected to comply immediately. If a participant continues or engages in unacceptable behavior, organizers may take any action they find appropriate, including warnings or expulsion from the event.",
      ackHeading: "Acknowledgement",
      ackBody:
        "By participating in Cursor India events and community spaces, you agree to abide by this Code of Conduct. We appreciate your participation and aim to create a positive, safe, and meaningful experience for everyone.",
      contactHeading: "Contact",
      contactBody: {
        prefix: "For any questions or concerns about this Code of Conduct, email at",
        suffix: ".",
      },
      backToAbout: "← About",
    },
    searchPages: [
      { title: "Events", href: "/events", subtitle: "All events" },
      { title: "Cities", href: "/cities", subtitle: "All chapters" },
      { title: "Ambassadors", href: "/ambassadors", subtitle: "All ambassadors" },
      { title: "Gallery", href: "/gallery", subtitle: "Photos from past events" },
      { title: "About", href: "/about", subtitle: "About Cursor India" },
      { title: "Join", href: "/join", subtitle: "Join the community" },
      { title: "Code of Conduct", href: "/code-of-conduct", subtitle: "Event rules" },
    ],
  },
};

const hi: Dict = {
  nav: {
    events: "इवेंट्स",
    cities: "शहर",
    ambassadors: "एंबेसडर",
    gallery: "गैलरी",
    about: "हमारे बारे में",
    join: "जॉइन",
    joinFull: "कम्युनिटी जॉइन करें",
    homeAria: "Cursor India होम",
    openMenu: "मेनू खोलें",
    closeMenu: "मेनू बंद करें",
    primaryAria: "मुख्य",
    mobileAria: "मोबाइल",
  },
  locale: {
    label: "भाषा",
    switchTo: (next) => `भाषा ${next.toUpperCase()} में बदलें`,
  },
  meta: {
    description:
      "Cursor के साथ बनाने वालों की कम्युनिटी, भारत भर में। Café Cursor, वर्कशॉप, मीटअप और हैकाथॉन देश भर के शहरों में।",
    titleSuffix: "भारत में Cursor के साथ बनाएं",
  },
  footer: {
    sections: {
      site: "साइट",
      general: "सामान्य",
      community: "कम्युनिटी",
    },
    tagline: "भारत में Cursor कम्युनिटी",
    nav: {
      events: "इवेंट्स",
      cities: "शहर",
      ambassadors: "एंबेसडर",
      gallery: "गैलरी",
      about: "हमारे बारे में",
      codeOfConduct: "कोड ऑफ कंडक्ट",
    },
    cursor: {
      community: "Cursor Community",
      followX: "X पर फॉलो करें",
      joinWhatsapp: "WhatsApp कम्युनिटी जॉइन करें",
    },
  },
  hero: {
    eyebrow: "Cursor India",
    title: "भारत में Cursor के साथ बनाएं।",
    lead: "भारत में Cursor के साथ काम कर रहे बनाने वालों का आधिकारिक हब। हम देश भर के शहरों में Café Cursor, वर्कशॉप, हैकाथॉन और बहुत कुछ के लिए मिलते हैं।",
    primaryCta: "इवेंट्स देखें",
    secondaryCta: "शहर देखें",
  },
  intro: {
    h1: "AI आ चुका है।",
    h2: "और इसके साथ कैसे बनाना है, ये अभी भी समझा जा रहा है।",
    line1: "आप इसमें कहीं भी हों, यहाँ आपका स्वागत है।",
    line2: "Cursor India उन सबके लिए है जो आते हैं।",
    audiences: {
      developers: {
        title: "डेवलपर्स",
        description:
          "एजेंट्स, ऑटोकंप्लीट और Cmd+K के साथ तेज़ी से शिप करें। उन लोगों से वर्कफ़्लो की तुलना करें जो रोज़ Cursor यूज़ करते हैं।",
      },
      designers: {
        title: "डिज़ाइनर्स",
        description:
          "सिर्फ मॉकअप नहीं, असली कोड में असली चीज़ें बनाएं। शिप करने वालों के साथ मिलकर वो लाइन क्रॉस करें।",
      },
      students: {
        title: "स्टूडेंट्स",
        description:
          "वही टूल्स से शुरू करें जो इंडस्ट्री यूज़ करती है। अपने शहर में इंजीनियर्स और फ़ाउंडर्स से मिलें।",
      },
      founders: {
        title: "फ़ाउंडर्स",
        description:
          "अपने रोडमैप से हफ्ते बचाएं। हर मीटअप पर कोलैबोरेटर्स और फ़ीडबैक पाएं।",
      },
    },
  },
  stats: {
    cities: "शहर",
    members: "मेंबर्स",
    events: "इवेंट्स",
    sectionAria: "कम्युनिटी आँकड़े",
  },
  nextEvent: {
    eyebrow: "अगला क्या है",
    titlePrefix: "आगे आ रहा है",
    saveTheDate: "तारीख याद रखें",
    ist: "IST",
    capacity: "क्षमता",
    register: "Luma पर रजिस्टर करें",
    details: "इवेंट डिटेल्स",
    seeAll: "सभी इवेंट्स देखें →",
  },
  upcoming: {
    eyebrow: "कैलेंडर",
    title: "शेड्यूल में और भी",
    cta: "सभी इवेंट्स",
    empty: "कैलेंडर पर अभी और कुछ नहीं। जल्द ही और आ रहे हैं।",
  },
  citiesGrid: {
    eyebrow: "शहर",
    title: "एक कम्युनिटी, कई शहर",
    cta: "सभी शहर",
  },
  ambassadorsStrip: {
    eyebrow: "एंबेसडर",
    title: "भारत भर के Cursor एंबेसडर",
    cta: "सभी एंबेसडर",
  },
  photoCarousel: {
    eyebrow: "गैलरी",
    title: "कम्युनिटी के पल",
    subhead:
      "भारत भर के मीटअप, वर्कशॉप और हैकाथॉन — जो हम साथ में बनाते हैं उसकी एक शांत झलक।",
    cta: "गैलरी देखें",
    sectionAria: "Cursor India इवेंट्स की फ़ोटो",
  },
  letter: {
    heading: "हे बिल्डर,",
    paragraphs: [
      "AI बदल रहा है कि हम सॉफ्टवेयर कैसे बनाते हैं।",
      "ये एक्साइटिंग है; और साथ ही बहुत कुछ है जिसके साथ चलना है।",
      "सच ये है:",
      "अभी तक किसी ने भी इसे पूरी तरह से समझा नहीं है।",
      "लेकिन सॉफ्टवेयर बनाने का तरीका हमारे पैरों के नीचे बदल रहा है, और जो लोग साथ मिलकर सीखते हैं वो अकेले सीखने वालों से तेज़ चलेंगे।",
      "इसी वजह से Cursor India है।",
      "हम असली में मिलते हैं: कैफ़े मीटअप, वर्कशॉप और हैकाथॉन, देश भर के शहरों में। आप जो भी बना रहे हैं वो लाएं। हम लोग और जगह लाते हैं।",
      "ये उन सबके लिए है जो Cursor के साथ शिप कर रहे हैं: डेवलपर्स, डिज़ाइनर्स, स्टूडेंट्स, फ़ाउंडर्स, हॉबीइस्ट। बस उत्सुकता चाहिए।",
      "Cursor India में स्वागत है! चलिए मिलकर इसे समझते हैं।",
    ],
    role: "Cursor APAC रीजन लीड",
  },
  globalEvents: {
    title: "वैश्विक Cursor कम्युनिटी इवेंट्स",
    body: "दुनिया भर के Cursor कम्युनिटी इवेंट्स। अपने पास मीटअप या Café Cursor खोजें।",
    cta: "Luma पर सभी इवेंट्स",
  },
  faq: {
    heading: "अक्सर पूछे जाने वाले सवाल",
    items: [
      {
        question: "Cursor India क्या है?",
        parts: [
          {
            type: "text",
            value:
              "Cursor India एक अनौपचारिक, कम्युनिटी-चलित हब है — भारत में Cursor AI कोड एडिटर पर केंद्रित मीटअप, हैकाथॉन और रीकैप के लिए। हम Anysphere (Cursor के निर्माता) या Cursor नाम का इस्तेमाल करने वाली किसी अन्य संस्था से जुड़े नहीं हैं।",
          },
        ],
      },
      {
        question: "क्या यह आधिकारिक Cursor वेबसाइट है?",
        parts: [
          {
            type: "text",
            value: "नहीं। आधिकारिक Cursor प्रोडक्ट वेबसाइट ",
          },
          {
            type: "link",
            label: "cursor.com",
            href: "https://cursor.com",
            external: true,
          },
          {
            type: "text",
            value:
              " है। यह साइट भारत में कम्युनिटी एंबेसडर और वॉलंटियर्स द्वारा चलाई जाती है। सभी ट्रेडमार्क उनके संबंधित मालिकों के हैं।",
          },
        ],
      },
      {
        question: "Cursor India इवेंट में कैसे शामिल हूँ?",
        parts: [
          { type: "link", label: "इवेंट्स", href: "/events" },
          {
            type: "text",
            value:
              " पेज पर आगे आने वाले इवेंट्स देखें या Luma खोलें। ज़्यादातर इवेंट्स भारतीय शहरों में फ्री और ऑन-साइट होते हैं। होस्ट आपके शहर के एंबेसडर होते हैं; डिटेल्स हर इवेंट कार्ड पर दी होती हैं।",
          },
        ],
      },
    ],
  },
  common: {
    cursorAmbassador: "Cursor एंबेसडर",
    eventDetails: "इवेंट डिटेल्स",
    details: "डिटेल्स",
    backTo: (label) => `← ${label}`,
    going: "जा रहे हैं",
    capacity: "क्षमता",
    moreOnEventPage: (n) => `+${n} और इवेंट पेज पर`,
  },
  pages: {
    events: {
      title: "इवेंट्स",
      metaDesc:
        "Cursor India के सभी इवेंट्स: Café Cursor, वर्कशॉप, मीटअप और हैकाथॉन, भारत के शहरों में।",
      lead: "भारत के शहरों में पब्लिक इवेंट्स। जब तक हम न कहें, सब फ्री हैं। अपना लैपटॉप लाएं और जो भी अभी बना रहे हैं वो भी।",
      upcomingHeading: "आगे आने वाले",
      pastHeading: "पिछले इवेंट्स",
      emptyUpcoming:
        "अभी कुछ शेड्यूल नहीं है। चैट में जुड़ें और अपने शहर में एक सजेस्ट करें।",
      emptyPast: "अभी तक कुछ नहीं किया है। थोड़ा रुकें।",
    },
    eventDetail: {
      notFound: "इवेंट नहीं मिला",
      free: "फ्री",
      capacity: "क्षमता",
      to: "से",
      ist: "IST",
      register: "Luma पर रजिस्टर करें",
      originalRsvp: "ओरिजिनल RSVP",
      aboutCursorCity: (city) => `Cursor ${city} के बारे में`,
      aboutThisEvent: "इस इवेंट के बारे में",
      agenda: "एजेंडा",
      recap: "रीकैप",
      hostedBy: "होस्ट किया",
      ambassadorAt: (city) => `Cursor एंबेसडर, ${city}`,
      partners: "पार्टनर्स",
      codeOfConductEyebrow: "कोड ऑफ कंडक्ट",
      codeOfConductBody: {
        prefix: "Cursor India के सभी इवेंट्स हमारे",
        link: "कोड ऑफ कंडक्ट",
        suffix: " के मुताबिक चलते हैं। आकर आप इसे मानने से सहमत हैं।",
      },
      galleryEyebrow: "गैलरी",
      galleryHeading: "इवेंट की फ़ोटो",
      allPhotos: "सभी फ़ोटो →",
    },
    cities: {
      title: "शहर",
      metaDesc: "भारत में शहर के हिसाब से Cursor कम्युनिटी।",
      lead: "हर शहर एक लोकल एंबेसडर चलाते हैं।",
    },
    cityDetail: {
      back: "← शहर",
      cursorPrefix: "Cursor",
      subscribeLuma: "Luma पर सब्सक्राइब करें",
      subscribeUpdates: "अपडेट्स के लिए सब्सक्राइब करें",
      ambassadorsHeading: "एंबेसडर",
      upcomingHeading: (city) => `${city} में आगे आने वाले`,
      pastHeading: (city) => `${city} में पिछले इवेंट्स`,
      emptyUpcoming: "अभी कुछ शेड्यूल नहीं है।",
      notFound: "चैप्टर नहीं मिला",
      metaDesc: (city) => `${city} के लिए Cursor India चैप्टर।`,
    },
    ambassadors: {
      title: "Cursor एंबेसडर",
      metaDesc: "भारत भर के Cursor एंबेसडर।",
      lead: "वो लोग जो अपने शहरों में Cursor India चलाते हैं। संपर्क करें, ये आपके एरिया में मीटअप ऑर्गनाइज़ करते हैं।",
      empty: "अभी कोई एंबेसडर नहीं है।",
      cta: {
        heading: "एक बनना चाहते हैं?",
        body: "आपके शहर में अभी कोई चैप्टर नहीं है, या किसी को मदद की ज़रूरत है? हमें अपने बारे में और बताएं कि आप कहाँ से हैं। हम हमेशा ऐसे लोगों की तलाश में हैं जो इसे भारत के अपने कोने में लाना चाहते हैं।",
        link: "होस्ट करने के लिए अप्लाई करें",
      },
    },
    ambassadorDetail: {
      back: "← एंबेसडर",
      eventsHeading: "इवेंट्स",
      notFound: "एंबेसडर नहीं मिला",
      metaDesc: (name, city) => `${name}, Cursor एंबेसडर, ${city}।`,
    },
    gallery: {
      title: "गैलरी",
      metaDesc: "देश भर के Cursor India इवेंट्स की फ़ोटो।",
      lead: "Café Cursor, वर्कशॉप, मीटअप और हैकाथॉन से चेहरे, डेमो और कभी कभार व्हाइटबोर्ड भी, भारत भर से।",
      emptyPrefix: "अभी कोई फ़ोटो नहीं — इस पाथ के नीचे इमेज डालें",
      emptySuffix: "और वो अपने आप यहाँ दिख जाएँगी।",
      eventDetails: "इवेंट डिटेल्स →",
    },
    about: {
      title: "हमारे बारे में",
      metaDesc:
        "Cursor India वैश्विक Cursor कम्युनिटी का हिस्सा है — भारत भर में कैफ़े, वर्कशॉप, मीटअप और हैकाथॉन।",
      lead: "Cursor India देश भर में Cursor के साथ बनाने वालों का स्थानीय चैप्टर है। हम वही तरह के इवेंट्स चलाते हैं जो दुनिया भर के 200+ शहरों में होते हैं — फ्री, आरामदायक, और सबके लिए खुले।",
      globalHeading: "वैश्विक कम्युनिटी का हिस्सा",
      globalBody:
        "Cursor की कम्युनिटी 80+ देशों में फैली है — 300+ एंबेसडर्स द्वारा 700+ इवेंट्स। Austin में Café Cursor से लेकर Berlin, Madrid और Istanbul में हैकाथॉन तक, फ़ॉर्मेट हर जगह एक जैसा है: लैपटॉप लाएं, साथ में बनाएं, दूसरे डेवलपर्स से मिलें, और जो शिप करें उसे साझा करें। India उस नेटवर्क का एक चैप्टर है — Bengaluru, Delhi, Mumbai, Hyderabad और भी।",
      whatHeading: "हम जो इवेंट्स चलाते हैं",
      whatBody: {
        intro: "चार फ़ॉर्मेट, cursor.com/community के अनुरूप:",
        cafe: "Café Cursor",
        cafeDesc:
          "हम पूरे दिन के लिए कैफ़े या को-वर्किंग स्पेस लेते हैं। स्थानीय Cursor यूज़र्स के साथ बनाएं, कॉफ़ी और Cursor credits लें, और कम्युनिटी से मिलें। कोई फ़ॉर्मल एजेंडा नहीं — बस लैपटॉप और जो भी प्रोजेक्ट चल रहा हो, लेकर आएं।",
        workshops: "वर्कशॉप",
        workshopsDesc:
          "हैंड्स-ऑन सेशन, अक्सर दो से तीन घंटे, एंबेसडर्स और पावर यूज़र्स के साथ। नई फ़ीचर्स, पैटर्न और एडवांस्ड वर्कफ़्लो सीखें जिन्हें आप उसी हफ़्ते इस्तेमाल कर सकें।",
        meetups: "मीटअप",
        meetupsDesc:
          "आपके शहर में आरामदायक शाम की मुलाकातें। छोटे टॉक, लाइव डेमो, और दूसरे बिल्डर्स से बातचीत के लिए काफ़ी समय।",
        hackathons: "हैकाथॉन",
        hackathonsDesc:
          "कम्युनिटी के साथ वीकेंड बिल्ड। कुछ असली शिप करें, prizes और Cursor credits के लिए प्रतिस्पर्धा करें, और अगले कदम के लिए सहयोगी ढूँढें।",
      },
      howHeading: "हम कैसे चलाते हैं",
      principles: [
        { title: "हमेशा फ्री।", body: "कोई टिकट नहीं, कोई अपसेल नहीं।" },
        { title: "बिल्डर्स पहले।", body: "दिखाएं, सिर्फ बोलें नहीं।" },
        {
          title: "समय का सम्मान।",
          body: "जब कहें तब शुरू, जब कहें तब ख़त्म।",
        },
        { title: "कोई ड्रामा नहीं।", body: "आने से पहले" },
      ],
      principlesTail: "ज़रूर पढ़ें।",
      hostHeading: "अपने शहर में होस्ट करें",
      hostBody: {
        intro:
          "अगर आप किसी ऐसे शहर में हैं जहाँ अभी कोई चैप्टर नहीं है, या जो बन रहा है उसमें मदद करना चाहते हैं,",
        cta: "संपर्क करें",
        tail: "।",
      },
    },
    join: {
      title: "जुड़ने के तीन तरीके।",
      metaDesc: "Cursor India कम्युनिटी से जुड़ने के तीन तरीके।",
      lead: "जो भी सही लगे, वो चुनें।",
      steps: [
        {
          n: "01",
          title: "इवेंट पर आएं",
          body: "सबसे आसान तरीका। इवेंट्स पेज देखें, अपने पास का एक चुनें, Luma पर RSVP करें।",
          ctaLabel: "इवेंट्स देखें",
        },
        {
          n: "02",
          title: "WhatsApp ग्रुप से जुड़ें",
          body: "हमारा मुख्य कम्युनिटी चैनल। लोग बताते हैं वो क्या बना रहे हैं, आने वाले मीटअप के बारे में पोस्ट करते हैं, और इवेंट्स के बीच एक दूसरे की मदद करते हैं।",
          ctaLabel: "WhatsApp से जुड़ें",
        },
        {
          n: "03",
          title: "चलाने में मदद करें",
          body: "अपने शहर में होस्ट करना है, या इवेंट्स पर वॉलंटियर करना है? एक नोट छोड़ें। ये सीधे एंबेसडर्स तक जाता है।",
          ctaLabel: "इंटरेस्ट सबमिट करें",
        },
      ],
    },
    submit: {
      title: "संपर्क करें।",
      metaDesc: "हमें अपने बारे में या किसी इवेंट के बारे में बताएं जिसे आप होस्ट करना चाहते हैं।",
      lead: "अपने शहर में होस्ट करना है, कोई इवेंट चलाना है, या किसी वेन्यू के साथ पार्टनर करना है? एक संदेश भेजें — अपने बारे में और अपने शहर के बारे में कुछ लाइनें काफी हैं।",
      form: {
        nameLabel: "नाम",
        namePlaceholder: "आपका नाम",
        emailLabel: "ईमेल",
        emailPlaceholder: "you@example.com",
        cityLabel: "शहर",
        cityPlaceholder: "आप कहाँ हैं?",
        messageLabel: "संदेश",
        messagePlaceholder: "बताएं आपके मन में क्या है…",
        submit: "संदेश भेजें",
        sending: "भेजा जा रहा है…",
        success: "संदेश भेज दिया गया। हम जल्द ही जवाब देंगे।",
        error: "कुछ गलत हो गया। कृपया फिर से कोशिश करें।",
      },
    },
    codeOfConduct: {
      title: "कोड ऑफ कंडक्ट",
      metaDesc:
        "Cursor India इवेंट्स और कम्युनिटी स्पेस को सुरक्षित, समावेशी और सम्मानजनक कैसे रखते हैं।",
      tldrHeading: "TL;DR",
      tldrBody:
        "Cursor India एक सुरक्षित, समावेशी और सम्मानजनक माहौल के लिए प्रतिबद्ध है। सभी के साथ सम्मान से पेश आएं और भेदभाव से बचें। अस्वीकार्य व्यवहार में उत्पीड़न, आपत्तिजनक टिप्पणियाँ, अवांछित यौन ध्यान, व्यवधान और बिना सहमति के निजी जानकारी साझा करना शामिल है। उल्लंघन पर इवेंट से हटाया जा सकता है। भाग लेकर आप इस कोड ऑफ कंडक्ट का पालन करने से सहमत हैं। इवेंट ऑर्गनाइज़र्स से संपर्क करें या इस पते पर ईमेल करें",
      introHeading: "परिचय",
      introBody:
        "Cursor India सभी प्रतिभागियों के लिए — लिंग, यौन अभिविन्यास, विकलांगता, शारीरिक रूप, शरीर का आकार, नस्ल, जाति, धर्म या तकनीकी पसंद की परवाह किए बिना — एक सुरक्षित, स्वागत योग्य और समावेशी स्थान प्रदान करने के लिए प्रतिबद्ध है। हम किसी भी रूप में उत्पीड़न बर्दाश्त नहीं करते। यह कोड ऑफ कंडक्ट सभी Cursor India इवेंट्स — Café Cursor, वर्कशॉप, मीटअप, हैकाथॉन, कम्युनिटी गैदरिंग — और WhatsApp सहित ऑनलाइन स्पेस पर लागू होता है। भाग लेकर आप इस कोड का पालन करने से सहमत हैं।",
      expectedHeading: "अपेक्षित व्यवहार",
      expectedItems: [
        {
          title: "सम्मानजनक रहें",
          body: "सभी प्रतिभागियों के साथ सम्मान और विचार से पेश आएं। खुलकर और सोच-समझकर बात करें, और अलग दृष्टिकोणों और अनुभवों का ध्यान रखें।",
        },
        {
          title: "समावेशी रहें",
          body: "ऐसा माहौल बनाएं जहाँ सभी को शामिल महसूस हो। ऐसी भाषा या व्यवहार से बचें जो किसी को बाहर करे या भेदभाव करे।",
        },
        {
          title: "विचारशील रहें",
          body: "याद रखें कि इवेंट स्पेस साझा हैं। अपने आस-पास के प्रति जागरूक रहें और साथी प्रतिभागियों का ख्याल रखें।",
        },
        {
          title: "सहयोगी रहें",
          body: "ऐसी कम्युनिटी का समर्थन करें जहाँ हर कोई विचार साझा करने और साथ मिलकर काम करने में सहज महसूस करे।",
        },
        {
          title: "सजग रहें",
          body: "समझें कि आपके शब्द और कार्य दूसरों पर कैसे असर डाल सकते हैं। रचनात्मक फीडबैक दें और स्वीकार करें, दया से।",
        },
      ],
      notHeading: "अस्वीकार्य व्यवहार",
      notItems: [
        "किसी भी तरह की उत्पीड़न, धमकी या भेदभाव।",
        "मौखिक या लिखित दुर्व्यवहार, जिसमें लिंग, यौन अभिविन्यास, विकलांगता, शारीरिक रूप, शरीर का आकार, नस्ल, जाति, धर्म या तकनीकी पसंद से जुड़ी आपत्तिजनक टिप्पणियाँ या मज़ाक शामिल हैं।",
        "अवांछित यौन ध्यान, जिसमें अनुचित शारीरिक संपर्क या यौन टिप्पणियाँ शामिल हैं।",
        "टॉक, वर्कशॉप, सेशन या गतिविधियों में लगातार व्यवधान।",
        "बिना स्पष्ट अनुमति के दूसरों की निजी जानकारी साझा करना।",
        "उपरोक्त में से किसी भी व्यवहार को प्रोत्साहित या समर्थन करना।",
      ],
      reportingHeading: "घटनाओं की रिपोर्ट",
      reportingIntro:
        "अगर आप किसी अस्वीकार्य व्यवहार का अनुभव करते हैं या देखते हैं, या कोई और चिंता हो, तो जल्द से जल्द रिपोर्ट करें। आप रिपोर्ट कर सकते हैं:",
      reportingItems: [
        "वहीं इवेंट ऑर्गनाइज़र या एंबेसडर से संपर्क करके।",
        "नीचे दिए पते पर ईमेल करके।",
      ],
      reportingNote:
        "सभी रिपोर्टों को विवेक और गोपनीयता के साथ संभाला जाएगा। हम उचित कार्रवाई करेंगे, जिसमें प्रतिभागी को इवेंट से हटाना भी शामिल हो सकता है।",
      consequencesHeading: "अस्वीकार्य व्यवहार के परिणाम",
      consequencesBody:
        "जिन प्रतिभागियों से अनुचित व्यवहार रोकने को कहा जाए, उनसे तुरंत पालन की अपेक्षा है। अगर कोई प्रतिभागी जारी रखता है या अस्वीकार्य व्यवहार करता है, तो ऑर्गनाइज़र्स चेतावनी या इवेंट से निष्कासन सहित कोई भी उचित कार्रवाई कर सकते हैं।",
      ackHeading: "स्वीकृति",
      ackBody:
        "Cursor India इवेंट्स और कम्युनिटी स्पेस में भाग लेकर, आप इस कोड ऑफ कंडक्ट का पालन करने से सहमत हैं। हम आपकी भागीदारी की सराहना करते हैं और सभी के लिए एक सकारात्मक, सुरक्षित और सार्थक अनुभव बनाने का लक्ष्य रखते हैं।",
      contactHeading: "संपर्क",
      contactBody: {
        prefix: "इस कोड ऑफ कंडक्ट के बारे में कोई सवाल या चिंता हो, तो ईमेल करें",
        suffix: " पर।",
      },
      backToAbout: "← हमारे बारे में",
    },
    searchPages: [
      { title: "इवेंट्स", href: "/events", subtitle: "सभी इवेंट्स" },
      { title: "शहर", href: "/cities", subtitle: "सभी चैप्टर" },
      { title: "एंबेसडर", href: "/ambassadors", subtitle: "सभी एंबेसडर" },
      { title: "गैलरी", href: "/gallery", subtitle: "पिछले इवेंट्स की फ़ोटो" },
      { title: "हमारे बारे में", href: "/about", subtitle: "Cursor India के बारे में" },
      { title: "जॉइन", href: "/join", subtitle: "कम्युनिटी जॉइन करें" },
      { title: "कोड ऑफ कंडक्ट", href: "/code-of-conduct", subtitle: "इवेंट के नियम" },
    ],
  },
};

export const dictionaries: Record<Locale, Dict> = { en, hi };

export function isLocale(value: unknown): value is Locale {
  return value === "en" || value === "hi";
}
