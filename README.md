# Golden State Travel Rx — Website

Static site for **Golden State Travel Rx** — an independent California travel-medicine
practice (telehealth, CA only): pre-travel consultations, travel-medication furnishing,
and naloxone furnishing. Public provider name: **Dr. Sunny B, PharmD** — licensed California pharmacist (a Doctor of
Pharmacy, not a medical doctor). Legal name + license # appear only in the clinical layer
(Charm consent/intake, prescriptions, PCP notification), where the law requires them — not
on the marketing pages.

## Files (upload to repo root)
| File | What it is |
|---|---|
| `index.html` | Home |
| `travel-health.html` | Travel consult services & pricing |
| `naloxone.html` | Naloxone furnishing page |
| `about.html` | About the practice (names the pharmacist per §2054) |
| `book.html` | Booking request form |
| `pay.html` | Billing / payment |
| `styles.css` | All styling (Golden Gate palette lives in `:root`) |
| `script.js` | Nav, mobile menu, booking form → Google Sheet, About gallery |
| `sunny.jpg`, `japan.jpg`, `rome.jpg`, `guatape.jpg`, `positano.jpg`, `mayabay.jpg` | About gallery photos |
| `CNAME` | Custom domain (see **Domain** below) |

## Branding / legal notes (read before launch)
- Business name is impersonal: **Golden State Travel Rx**. The **provider** (Dr. Sunny B, PharmD) is named on the About page and in the footer §2054 line only —
  this is the "name-forward, brand-impersonal" split, and it's required so patients can
  identify their licensed pharmacist and can't mistake a PharmD for an MD.
- Every page footer carries the §2054 disclosure ("a Doctor of Pharmacy, not a medical
  doctor") and the furnishing authority (BPC §4052(a)(10)(A)(3), 16 CCR §1746.5; naloxone
  under BPC §4052.01 / 16 CCR §1746.3). **Do not remove these.**
- California cues are legally clean: original suspension-bridge line-art (not the Golden
  Gate Bridge District logo), California-gold + international-orange color only. No state
  seal, no Bear Flag artwork — both are restricted, so they were deliberately avoided.
- Naloxone furnishing needs your **1-hour opioid-antagonist CE (16 CCR §1746.3)** on file
  before going live.

## Domain (do this in order — don't skip)
`CNAME` is set to `goldenstatetravelrx.com`. Before that works:
1. **Register `goldenstatetravelrx.com`** (Namecheap) — confirm the trademark/entity check first.
2. Point DNS to GitHub Pages, then Settings → Pages → Custom domain → `goldenstatetravelrx.com`.
3. **Until the domain is live, keep your old CNAME** (`www.drsunnybrph.com`) or the site's
   custom domain will 404. The `github.io` URL keeps working regardless.

## Still on the old identity (swap when ready — not blockers)
- **Email:** still `drsunnybrph@gmail.com` (kept so contact works today). Migrate to
  `hello@goldenstatetravelrx.com` once the domain + inbox exist, then find/replace it site-wide.
- **Booking endpoint** in `script.js` is unchanged and still posts to your Bookings sheet.
- Social handle references were removed (no live @goldenstatetravelrx handle yet — claim it).

## Hosting (GitHub Pages)
Push to repo root → Settings → Pages → Deploy from branch → `main` / root.

## Brand imagery (added)
- `emblem-512.png` + `favicon.ico` / `favicon-32.png` / `apple-touch-icon.png` — logo + favicons (nav mark + browser tab).
- `hero-bridge-bear.jpg` — home hero (bear + Golden Gate, right-weighted; headline sits on the left scrim).
- `page-hero-fog.jpg` — interior page-hero band (foggy towers).
- `og-card.jpg` — social/link-preview image (1200×630). The `og:image` tag uses the
  `goldenstatetravelrx.com` absolute URL, so previews only render once that domain is live;
  until then it's harmless. All images are AI-generated originals (generic grizzly, no Bear
  Flag/state seal) — free for you to use.

## Trip Planner (`plan.html` + `plan-data.js` + `plan.js`)
Interactive planner: day-by-day itineraries for 43 countries, live U.S. State Dept safety
advisories + CDC health notices, a CDC-sourced risk profile, and a budget estimate — all
client-side and free to run.

### ⚠️ DESIGN RULE — read before editing `plan-data.js`
The destination library deliberately contains **NO specific vaccine or drug recommendations.**
Malaria/yellow-fever/food-water risk varies by REGION, SEASON and the traveler's own health —
CDC says so explicitly. Country-level drug lists are misleading (e.g. CDC reports no malaria
in Bangkok, Chiang Mai, Phuket, Ubud or the Bali resorts, so "malaria meds for Thailand/Bali"
is wrong for most tourist itineraries) and they go stale (Sri Lanka, Maldives, Egypt, Argentina
and China are all now WHO-certified malaria-free).

So the page publishes: (1) a coarse, factual RISK PROFILE sourced to CDC, and (2) a deep link
to the official CDC destination page — and states plainly that the specific plan is what the
CONSULT produces. That is both the defensible position for a licensed pharmacist and the
better funnel: it creates the need instead of giving away a (possibly wrong) answer.
**Do not add drug names to this file.**
It's a lead funnel: every destination ends in a "Book a consult" call-to-action.

**It works immediately on its own** using curated per-country safety/health summaries.
To turn on the *live* government feeds, deploy the Worker below and paste its URL into
`plan.js` → `const WORKER_URL = "…"`. Until then it gracefully shows the curated fallback.

## Feeds Worker (`worker.js` — deploy to Cloudflare, NOT part of the website)
`worker.js` is a Cloudflare Worker (free tier) that fetches, parses, caches (6h), and
CORS-serves two public-domain U.S. government RSS feeds so the static site can read them:
State Dept travel advisories + CDC Travelers' Health notices.

Deploy (~2 min, free):
1. cloudflare.com → Workers & Pages → Create → Worker
2. Paste the contents of `worker.js`, click Deploy
3. Copy the URL (e.g. `https://gstr-feeds.YOURNAME.workers.dev`)
4. In `plan.js`, set `WORKER_URL` to that URL, re-upload `plan.js`

`worker.js` does not need to live in your GitHub repo — it runs on Cloudflare. It's kept
here only as the source of record. Both feeds are U.S. government works (public domain).

## AI upgrade (later)
The planner is "hybrid": the itinerary comes from the curated library today. To add live
AI generation later, we point the "Build my trip" action at a Claude API call (through a
Worker, keeping the key server-side) and merge the result into the same UI — no redesign.

### Accuracy audit (July 2026)
- CDC destination slugs verified live against `wwwnc.cdc.gov` (incl. Türkiye → `turkey`,
  which CDC still serves under the old slug despite displaying "Türkiye (Turkey)").
- **Türkiye corrected to "malaria in certain regions"** — CDC's own destination page states
  malaria is a risk in some parts of Türkiye, so a "no risk" badge would have contradicted
  the page linked right next to it.
- Malaria-free claims are anchored to WHO certification dates (Sri Lanka 2016, Maldives 2015,
  Argentina 2019, Egypt Oct 2024) rather than to a clinical recommendation.
- Verified: 0 drug names and 0 prophylaxis recommendations anywhere in the public data.

**Re-audit before each major update.** Advisory levels, outbreak notices, and malaria maps
change. The live Worker feed keeps notices/advisories current automatically; the coarse risk
profile in `plan-data.js` is the part that needs a human (you) to re-check periodically.

## Itinerary routing (`plan-legs.js`) — the fix for city ping-ponging
Early versions paired experiences off a flat list and cycled cities for filler days, which
produced nonsense like Cartagena → Medellín → Bogotá → Coffee Region → **back to Cartagena**.

Each country is now a **route**: an ordered list of city legs, each with suggested nights and
a transit line ("Fly to Medellín (1h30)"). The builder allocates the traveler's days across
those legs *in order*:
- Short trips take the first legs and stay put; long trips add legs AND lengthen stays.
- Moving between cities costs a **travel day**, shown explicitly.
- Extra days become in-city free time — never a jump back to a city you already left.
- The trip ends with a departure day.
- If the requested trip is much longer than the route naturally supports (e.g. 21 days in
  Singapore), an honest pacing note says so rather than inventing filler.

Verified: 43 countries × 19 trip lengths = **817 itineraries, all passing** (no back-tracking,
no repeated sights, correct day counts). If you add a country, add its `legs` in route order.

## Geography / privacy policy for this site
The site is **statewide only**. No county, city, or region is named anywhere — the practice
is positioned as "telehealth for patients anywhere in California, all 58 counties." This is
deliberate: it protects the provider's location while accurately describing a CA-only
furnishing scope.

**Do not re-add** county/city names (Solano, Ventura, Fairfield, Vacaville, Suisun, Vallejo,
Simi Valley, Oxnard, Thousand Oaks, Camarillo) to page copy, meta descriptions, keywords, or
form placeholders. The legal line "Services are available to patients physically located in
California" stays — that's scope, not location.
