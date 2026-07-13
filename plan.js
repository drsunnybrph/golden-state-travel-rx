/* ============================================================
   Golden State Travel Rx — Trip Planner engine
   Loads DEST from plan-data.js.
   Hybrid: curated itineraries + live U.S. gov't feeds via a
   free Cloudflare Worker (see worker.js). Set WORKER_URL below
   after deploying; empty = graceful curated fallback.
   ============================================================ */

const WORKER_URL = ""; // e.g. "https://gstr-feeds.YOURNAME.workers.dev"

const CDC_URL   = c => `https://wwwnc.cdc.gov/travel/destinations/traveler/none/${DEST[c].cdc}`;
const STATE_URL = c => `https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/${DEST[c].adv}-travel-advisory.html`;

/* flexible filler days for longer trips */
const FLEX = [
  ["","Free morning — café & neighborhood wander","food","slow travel, local pace"],
  ["","Local market & street-food crawl","food","eat where locals eat"],
  ["","Optional day trip or excursion","adventure","add-on based on your interests"],
  ["","Beach / spa / rest day","beach","recover and recharge"],
  ["","Museum & culture morning","culture","go deeper on the history"],
  ["","Sunset viewpoint & farewell dinner","food","toast the trip"]
];

const TAG_ICON={culture:"fa-landmark",nature:"fa-mountain-sun",food:"fa-utensils",adventure:"fa-person-hiking",beach:"fa-umbrella-beach",history:"fa-monument",spiritual:"fa-place-of-worship"};
const TIER={budget:{d:.55,f:.8,label:"Budget"},mid:{d:1,f:1,label:"Mid-range"},luxury:{d:2.2,f:2.4,label:"Luxury"}};
const money=n=>"$"+(Math.round(n/5)*5).toLocaleString();
const monthMult=(c,m)=>DEST[c].peak.includes(m)?1.22:DEST[c].low.includes(m)?.82:1;
const seasonLabel=(c,m)=>DEST[c].peak.includes(m)?"peak season":DEST[c].low.includes(m)?"low season":"shoulder season";

/* ---- itinerary ---- */
function buildItinerary(code,days){
  const d=DEST[code]; let slots=[...d.exp]; const need=days*2; let i=0;
  while(slots.length<need){ const f=[...FLEX[i%FLEX.length]]; if(!f[0]) f[0]=d.exp[i%d.exp.length][0]; slots.push(f); i++; }
  slots=slots.slice(0,need);
  const out=[];
  for(let n=0;n<days;n++){ const am=slots[n*2],pm=slots[n*2+1]; out.push({day:n+1,city:am[0]||pm[0],am,pm}); }
  return out;
}

/* ---- budget ---- */
function calcBudget(code,days,travelers,tierKey,month){
  const d=DEST[code],t=TIER[tierKey],sm=monthMult(code,month),shared=travelers>=2?.85:1;
  const flights=d.flight*t.f*travelers;
  const ground=d.day*t.d*sm*shared*days*travelers;
  const consult=travelers>=3?199:travelers===2?125:75;
  const total=flights+ground+consult;
  return {flights,ground,consult,total,low:total*.88,high:total*1.12,perDay:d.day*t.d*sm,sm};
}

/* ---- gov't feeds via Worker (graceful fallback) ---- */
let FEEDS=null,tried=false;
async function getFeeds(){
  if(tried) return FEEDS;
  tried=true;
  if(!WORKER_URL) return null;
  try{ const r=await fetch(WORKER_URL.replace(/\/$/,"")+"/data",{cache:"no-store"}); if(!r.ok) throw 0; FEEDS=await r.json(); return FEEDS; }
  catch(e){ return null; }
}
const LEVEL={1:{c:"lv1",t:"Level 1 — Exercise Normal Precautions"},2:{c:"lv2",t:"Level 2 — Exercise Increased Caution"},3:{c:"lv3",t:"Level 3 — Reconsider Travel"},4:{c:"lv4",t:"Level 4 — Do Not Travel"}};
const matchAdvisory=(f,c)=>{ if(!f||!f.advisories) return null; const al=DEST[c].aliases;
  return f.advisories.find(a=>{const n=(a.country||"").toLowerCase(); return al.some(x=>n.includes(x));})||null; };
const matchNotices=(f,c)=>{ if(!f||!f.notices) return []; const al=DEST[c].aliases;
  return f.notices.filter(n=>{const b=((n.title||"")+" "+(n.countries||"")).toLowerCase(); return al.some(x=>b.includes(x));}).slice(0,4); };

/* ---- risk profile ---- */
const MAL=[
  {c:"r-ok",  i:"fa-circle-check",        t:"No malaria risk"},
  {c:"r-warn",i:"fa-triangle-exclamation",t:"Malaria in certain regions"},
  {c:"r-hi",  i:"fa-mosquito",            t:"Malaria in most areas"}
];
const FOOD=[null,
  {c:"r-ok",  i:"fa-utensils",t:"Food & water — low risk"},
  {c:"r-warn",i:"fa-utensils",t:"Food & water — moderate risk"},
  {c:"r-hi",  i:"fa-utensils",t:"Food & water — high risk"}
];

function riskCards(code){
  const r=DEST[code].risk, out=[];
  out.push({...MAL[r.mal], note:r.malNote});
  out.push({...FOOD[r.food], note:r.foodNote});
  if(r.yf)    out.push({c:"r-hi",  i:"fa-syringe",         t:"Yellow fever",              note:r.yf});
  if(r.alt)   out.push({c:"r-warn",i:"fa-mountain-sun",    t:"Altitude",                  note:r.alt});
  if(r.bug)   out.push({c:"r-warn",i:"fa-bug",             t:"Mosquito / insect-borne",   note:r.bugNote||"Insect-bite precautions are recommended."});
  if(r.other) out.push({c:"r-note",i:"fa-circle-info",     t:"Also worth knowing",        note:r.other});
  return out;
}

/* ---- render ---- */
function render(code,days,travelers,tierKey,month){
  const d=DEST[code];
  document.getElementById("planResults").style.display="block";
  document.getElementById("resTitle").innerHTML=`${d.emoji} ${d.name} · <span>${days} days</span>`;
  document.getElementById("resSub").textContent=`${TIER[tierKey].label} · ${travelers} traveler${travelers>1?"s":""} · ${seasonLabel(code,month)}`;

  document.getElementById("itinerary").innerHTML=buildItinerary(code,days).map(day=>{
    const slot=s=>`<div class="slot"><i class="fa-solid ${TAG_ICON[s[2]]||"fa-location-dot"}"></i><div><strong>${s[1]}</strong><span>${s[0]?s[0]+" · ":""}${s[3]}</span></div></div>`;
    return `<div class="dayrow"><div class="daynum">Day ${day.day}<em>${day.city}</em></div>
      <div class="dayslots">${slot(day.am)}${slot(day.pm)}
      <div class="slot dine"><i class="fa-solid fa-wine-glass"></i><div><strong>Evening</strong><span>Local dining &amp; wander</span></div></div></div></div>`;
  }).join("");

  const b=calcBudget(code,days,travelers,tierKey,month);
  document.getElementById("budget").innerHTML=`
    <div class="brow"><span>Flights (${travelers}× roundtrip, est.)</span><b>${money(b.flights)}</b></div>
    <div class="brow"><span>On the ground · ${money(b.perDay)}/person/day × ${days}d</span><b>${money(b.ground)}</b></div>
    <div class="brow"><span>Pre-travel consult</span><b>${money(b.consult)}</b></div>
    <div class="btot"><span>Estimated total</span><b>${money(b.low)}–${money(b.high)}</b></div>
    <p class="bnote">Rough planning estimate in USD for ${seasonLabel(code,month)} (${b.sm>1?"+":""}${Math.round((b.sm-1)*100)}% vs. shoulder). Excludes visas, insurance, and medication cost (billed by your pharmacy). Not a quote.</p>`;

  renderSafety(code);
  document.getElementById("planResults").scrollIntoView({behavior:"smooth",block:"start"});
}

async function renderSafety(code){
  const d=DEST[code], box=document.getElementById("safety"), short=d.name.split(" (")[0];
  box.innerHTML=`<div class="loadingline"><i class="fa-solid fa-circle-notch fa-spin"></i> Checking current U.S. government advisories…</div>`;
  const feeds=await getFeeds();
  const adv=matchAdvisory(feeds,code), notices=matchNotices(feeds,code);

  const banner = (adv&&LEVEL[adv.level])
    ? `<div class="advbanner ${LEVEL[adv.level].c}">
         <div class="advlvl"><i class="fa-solid fa-triangle-exclamation"></i> ${LEVEL[adv.level].t}</div>
         ${adv.categories?`<div class="advcats">${adv.categories.split(",").map(c=>`<span>${c.trim()}</span>`).join("")}</div>`:""}
         <div class="advmeta">U.S. State Department${adv.updated?" · updated "+adv.updated:""} · <a href="${adv.link||STATE_URL(code)}" target="_blank" rel="noopener">read the full advisory →</a></div>
       </div>`
    : `<div class="advbanner lv2">
         <div class="advlvl"><i class="fa-solid fa-triangle-exclamation"></i> Check the current travel advisory</div>
         <div class="advmeta">Advisory levels change often and can differ sharply by region within a single country.<br>
         <a href="${STATE_URL(code)}" target="_blank" rel="noopener">Official U.S. State Department advisory for ${short} →</a></div>
       </div>`;

  const noticeHtml = notices.length
    ? `<div class="notices"><h4><i class="fa-solid fa-virus-covid"></i> Active CDC travel health notices</h4>
       ${notices.map(n=>`<a class="notice" href="${n.link||"https://wwwnc.cdc.gov/travel/notices"}" target="_blank" rel="noopener">${n.title}</a>`).join("")}</div>`
    : `<div class="notices muted"><i class="fa-solid fa-notes-medical"></i> No destination-specific CDC notice matched right now. <a href="https://wwwnc.cdc.gov/travel/notices" target="_blank" rel="noopener">See all current CDC notices →</a></div>`;

  const cards=riskCards(code).map(r=>
    `<div class="rcard ${r.c}"><div class="rhead"><i class="fa-solid ${r.i}"></i> ${r.t}</div><p>${r.note}</p></div>`).join("");

  const profile=`
    <div class="riskgrid">${cards}</div>
    <div class="cdcline"><i class="fa-solid fa-book-medical"></i>
      Risk summary based on CDC Travelers' Health guidance.
      <a href="${CDC_URL(code)}" target="_blank" rel="noopener">Official CDC destination page for ${short} →</a>
    </div>
    <div class="healthcard">
      <h4><i class="fa-solid fa-user-doctor"></i> What this means for <em>your</em> trip</h4>
      <p>Notice what isn't above: <strong>a list of exactly which vaccines and medications you need.</strong> That's deliberate — it isn't a question any country page can honestly answer.</p>
      <p>CDC directs clinicians to build the plan around not just the country, but your <strong>specific cities, the season, how long you're staying, where you're sleeping, and your own health history</strong> — pregnancy, G6PD status, current medications, and prior reactions all change the answer. Two people flying to the same country in the same week can need completely different plans. Malaria risk alone can be zero in one city and real three hours away.</p>
      <div class="hcta">
        <div><strong>That's what a pre-travel consult produces.</strong>
          <span>A destination-specific risk assessment, a written travel medication plan, and eligible medications furnished straight to your pharmacy — under California pharmacist authority, with no separate doctor's appointment.</span></div>
        <a class="btn-orange" href="book.html"><i class="fa-solid fa-calendar-check"></i> Book a consult</a>
      </div>
    </div>`;

  box.innerHTML = banner + noticeHtml + profile + `
    <p class="srcline">Sources: U.S. Department of State (travel advisories) and U.S. CDC Travelers' Health / Yellow Book (health risk)${feeds?" — live":""}. Both are U.S. government public-domain sources. Advisory levels, outbreak notices, and health recommendations change frequently — always confirm on the official pages linked above before you travel. This page is general educational information, not individualized medical advice, and is not a substitute for a consultation or your primary care provider.</p>`;
}

/* ---- UI ---- */
document.addEventListener("DOMContentLoaded",()=>{
  const sel=document.getElementById("pDest");
  if(!sel || typeof DEST==="undefined") return;

  ["Asia","Europe","Middle East","Africa","Americas","Oceania"].forEach(rg=>{
    const codes=Object.keys(DEST).filter(k=>DEST[k].region===rg).sort((a,b)=>DEST[a].name.localeCompare(DEST[b].name));
    if(!codes.length) return;
    const g=document.createElement("optgroup"); g.label=rg;
    codes.forEach(k=>{ const o=document.createElement("option"); o.value=k; o.textContent=`${DEST[k].emoji}  ${DEST[k].name}`; g.appendChild(o); });
    sel.appendChild(g);
  });
  const n=document.getElementById("destCount"); if(n) n.textContent=Object.keys(DEST).length;

  let days=7;
  const slider=document.getElementById("pDays"), lbl=document.getElementById("pDaysLabel");
  const setDays=v=>{ days=+v; slider.value=v; lbl.textContent=v+" days";
    document.querySelectorAll(".chip").forEach(c=>c.classList.toggle("on",+c.dataset.d===days)); };
  document.querySelectorAll(".chip").forEach(c=>c.addEventListener("click",()=>setDays(c.dataset.d)));
  slider.addEventListener("input",e=>setDays(e.target.value));
  setDays(7);

  document.getElementById("pBuild").addEventListener("click",()=>{
    const code=sel.value; if(!code){ sel.focus(); return; }
    render(code,days,+document.getElementById("pTravelers").value,
           document.getElementById("pTier").value,+document.getElementById("pMonth").value);
  });
});
