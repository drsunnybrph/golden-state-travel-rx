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
