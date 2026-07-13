/* ============================================================
   Golden State Travel Rx — feeds Worker (Cloudflare, free tier)
   Proxies + parses two PUBLIC-DOMAIN U.S. government RSS feeds:
     • State Dept travel advisories  (level 1–4 + risk categories)
     • CDC Travelers' Health notices (outbreaks by country/disease)
   Returns JSON with CORS so the static site can read it.
   Cached 6h so we never hammer the gov servers (stays in free limits).

   DEPLOY (2 min, free):
     1. cloudflare.com → Workers & Pages → Create → Worker
     2. Replace the default code with this file, click Deploy
     3. Copy your URL (e.g. https://gstr-feeds.YOURNAME.workers.dev)
     4. Put it in plan.js →  const WORKER_URL = "…"
   ============================================================ */

const STATE_RSS = "https://travel.state.gov/_res/rss/TAsTWs.xml";
const CDC_RSS   = "https://wwwnc.cdc.gov/travel/rss/notices.xml";
const UA = "GoldenStateTravelRx/1.0 (+travel-health static site)";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request, env, ctx) {
    if (request.method === "OPTIONS") return new Response(null, { headers: CORS });

    const url = new URL(request.url);
    if (url.pathname !== "/data" && url.pathname !== "/") {
      return json({ error: "Use /data" }, 404);
    }

    // serve from edge cache if fresh
    const cache = caches.default;
    const cacheKey = new Request(url.origin + "/data", request);
    const hit = await cache.match(cacheKey);
    if (hit) return hit;

    let advisories = [], notices = [], errors = [];
    try { advisories = parseAdvisories(await fetchText(STATE_RSS)); }
    catch (e) { errors.push("state:" + e); }
    try { notices = parseNotices(await fetchText(CDC_RSS)); }
    catch (e) { errors.push("cdc:" + e); }

    const body = JSON.stringify({
      fetched: new Date().toISOString(),
      count: { advisories: advisories.length, notices: notices.length },
      advisories, notices,
      ...(errors.length ? { errors } : {}),
    });

    const res = new Response(body, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=21600", // 6h
        ...CORS,
      },
    });
    ctx.waitUntil(cache.put(cacheKey, res.clone()));
    return res;
  },
};

async function fetchText(u) {
  const r = await fetch(u, { headers: { "User-Agent": UA, "Accept": "application/rss+xml, application/xml, text/xml" }, cf: { cacheTtl: 21600 } });
  if (!r.ok) throw r.status;
  return await r.text();
}
function json(o, status = 200) {
  return new Response(JSON.stringify(o), { status, headers: { "Content-Type": "application/json", ...CORS } });
}
function items(xml) {
  const out = []; const re = /<item\b[^>]*>([\s\S]*?)<\/item>/gi; let m;
  while ((m = re.exec(xml))) out.push(m[1]);
  return out;
}
function tag(block, name) {
  const m = block.match(new RegExp("<" + name + "\\b[^>]*>([\\s\\S]*?)<\\/" + name + ">", "i"));
  return m ? clean(m[1]) : "";
}
function tagAll(block, name) {
  const out = []; const re = new RegExp("<" + name + "\\b[^>]*>([\\s\\S]*?)<\\/" + name + ">", "gi"); let m;
  while ((m = re.exec(block))) out.push(clean(m[1]));
  return out;
}
function clean(s) {
  return s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
          .replace(/<[^>]+>/g, " ")
          .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
          .replace(/&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/&nbsp;/g, " ")
          .replace(/\s+/g, " ").trim();
}
function shortDate(s) {
  const d = new Date(s); if (isNaN(d)) return "";
  return d.toLocaleString("en-US", { month: "short", year: "numeric" });
}

/* State Dept: title = "<Country> - Level N: <text>" ; <category> = risk indicators */
function parseAdvisories(xml) {
  return items(xml).map((b) => {
    const title = tag(b, "title");
    const lm = title.match(/Level\s*(\d)/i);
    const country = title.split(/\s*-\s*Level/i)[0].trim();
    const cats = tagAll(b, "category").filter((c) => c && !/^Level/i.test(c));
    return {
      country,
      level: lm ? +lm[1] : null,
      title,
      categories: cats.join(", "),
      link: tag(b, "link"),
      updated: shortDate(tag(b, "pubDate")),
    };
  }).filter((a) => a.country && a.level);
}

/* CDC: title + description hold the disease/country; keep a blob for matching */
function parseNotices(xml) {
  return items(xml).map((b) => {
    const title = tag(b, "title");
    const desc = tag(b, "description");
    return {
      title,
      countries: desc,          // description usually lists affected countries
      link: tag(b, "link"),
      date: shortDate(tag(b, "pubDate")),
    };
  }).filter((n) => n.title);
}
