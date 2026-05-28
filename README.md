# ASTE — AI Smart Travel Ecosystem

> Plan your perfect trip with AI. Personalized multi-day itineraries, live eco impact scoring, and real-time safety intelligence.

This is the **functional UI demo** build of ASTE: a Next.js 14 application that implements the full spec front-end with mock itinerary generation, working Leaflet maps, eco scoring, safety widgets, and a brand-locked design system.

---

## 🚀 Run locally

```bash
# 1. Install dependencies (Node.js 18+ recommended)
npm install

# 2. Start the dev server
npm run dev

# 3. Open in browser
# http://localhost:3000
```

The app auto-redirects to `/app/planner` which is the main mockup screen.

### Production build

```bash
npm run build
npm run start
```

---

## 🧭 What's inside

| Route                  | Description                                                                 |
| ---------------------- | --------------------------------------------------------------------------- |
| `/`                    | Marketing landing page                                                      |
| `/app/planner`         | **Main workspace** — Planner form + Trip display + Eco/Safety/Experiences   |
| `/app/experiences`     | Browse curated experiences catalog                                          |
| `/app/eco-travel`      | Eco hub — tips, certified hotels, low-carbon routes                         |
| `/app/safety`          | Global safety dashboard with country safety scores                          |
| `/app/bookings`        | Sample flight / hotel / experience bookings                                 |
| `/app/saved`           | Saved trips & favorites                                                     |
| `/app/profile`         | Account, preferences, eco goals                                             |
| `/app/help`            | FAQ & support                                                               |
| `/pricing`             | Free / Plus / Pro plans                                                     |
| `/api/trips/generate`  | POST endpoint that produces a mock itinerary (instant, offline)             |

---

## ✨ Try it

In the planner form, type any of these destinations in the **To** field for rich, real-coordinate itineraries:

- `Istanbul, Turkey` *(default, matches the mockup)*
- `Paris, France`
- `Tokyo, Japan`
- `Barcelona, Spain`
- `Bali, Indonesia`
- `New York, USA`

Any other input falls back to Istanbul.

Click **Generate My Trip Plan** → the right-side panel will:
- Animate in day cards (Framer Motion stagger)
- Populate Eco Score ring with carbon footprint
- Show localized safety info (emergency number, hospital, police)
- Render an interactive Leaflet map with day-grouped colored routes
- Plot a budget breakdown (donut + daily bar chart)

---

## 🎨 Brand system (locked)

CSS variables in `src/app/globals.css` and Tailwind tokens in `tailwind.config.ts` match the spec exactly:

| Token                  | Value     |
| ---------------------- | --------- |
| `--brand-ink`          | `#0F172A` |
| `--brand-green-500`    | `#22C55E` |
| `--brand-green-600`    | `#16A34A` |
| `--brand-green-soft`   | `#DFF7E8` |
| `--brand-blue-500`     | `#3B82F6` |
| `--brand-blue-soft`    | `#E0EAFF` |
| `--bg`                 | `#F8FAFC` |
| `--surface`            | `#FFFFFF` |
| `--border`             | `#E2E8F0` |

Typography: **Inter** (loaded from Google Fonts).
Icons: **Lucide React**.

---

## 🧱 Tech stack used in this build

- **Next.js 14** (App Router, RSC)
- **TypeScript** strict mode
- **Tailwind CSS** + custom design tokens
- **Zustand** for client state
- **Zod** for form & API validation
- **Framer Motion** for card stagger and ring fill
- **Recharts** for budget visualizations
- **Leaflet + react-leaflet** for the Map View tab
- **Lucide React** icons

---

## 🔌 What's mocked vs. real

**Real and working:**
- Full UI matching the spec mockup (1:1 brand system, layout, typography)
- Form validation (Zod schemas)
- API route `/api/trips/generate` that validates input and returns a structured JSON itinerary
- Interactive Leaflet map with real POI coordinates for 6 destinations
- Animated SVG eco-score ring
- Recharts donut + daily bar chart
- All navigation and routing
- Responsive layout (desktop / tablet / mobile)

**Mocked (per your scope choice):**
- LLM call replaced by deterministic in-memory generator (`src/lib/mockGenerator.ts`)
- No database — trips live only in client state
- No auth — UI shows a static avatar
- No Stripe / Duffel / Climatiq — stub data only

To upgrade this demo to the full production stack described in the original spec, the next steps are:

1. Replace `src/lib/mockGenerator.ts` calls inside the API route with an OpenAI/Claude structured-output call.
2. Add Prisma + Postgres for trip persistence (schema is provided in the spec).
3. Wire Clerk or Auth.js for authentication.
4. Swap mock places/safety data for Google Places + Numbeo + Overpass.
5. Swap Leaflet for Mapbox GL if richer styling is needed.

---

## 📁 Project structure

```
src/
├── app/
│   ├── api/trips/generate/route.ts    # POST endpoint (mock generator)
│   ├── app/
│   │   ├── layout.tsx                 # Sidebar + Header shell
│   │   ├── planner/page.tsx           # ★ Main mockup screen
│   │   ├── experiences/page.tsx
│   │   ├── eco-travel/page.tsx
│   │   ├── safety/page.tsx
│   │   ├── bookings/page.tsx
│   │   ├── saved/page.tsx
│   │   ├── profile/page.tsx
│   │   └── help/page.tsx
│   ├── pricing/page.tsx
│   ├── page.tsx                       # Marketing landing
│   ├── layout.tsx                     # Root layout + Inter font + Leaflet CSS
│   └── globals.css                    # Brand tokens + utility classes
├── components/
│   ├── Logo.tsx
│   ├── Sidebar.tsx
│   ├── Header.tsx
│   ├── PageHeader.tsx
│   ├── planner/PlannerForm.tsx
│   ├── trip/
│   │   ├── TripDisplay.tsx
│   │   ├── TripHero.tsx
│   │   ├── TripTabs.tsx
│   │   ├── DayCard.tsx
│   │   ├── TripBudget.tsx
│   │   ├── TripMap.tsx
│   │   └── TripMapWrapper.tsx
│   └── widgets/
│       ├── EcoWidget.tsx
│       ├── SafetyWidget.tsx
│       └── ExperiencesWidget.tsx
└── lib/
    ├── types.ts
    ├── utils.ts
    ├── store.ts                       # Zustand store
    └── mockGenerator.ts               # ★ Itinerary engine
```

---

## ⚖️ License

Demo / prototype code. Use freely as a foundation for your production build.
