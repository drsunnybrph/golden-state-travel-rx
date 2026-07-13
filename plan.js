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

/* in-city soft slots — used to LENGTHEN a stay, never to jump cities.
   Separate morning/afternoon pools so the wording always fits the slot,
   and deliberately generic so they read right in a city OR on an island. */
const AM_SOFT = [
  ["Slow morning & local café","food","travel at the local pace"],
  ["Market & street-food crawl","food","eat where locals eat"],
  ["Optional day trip from {c}","adventure","an add-on based on your interests"],
  ["Explore {c} at your own pace","culture","go past the highlights"],
  ["Guided half-day experience","culture","cooking, craft, or a local walk"],
  ["Walking tour with a local guide","culture","the stories behind the streets"],
  ["Hidden corners of {c}","culture","what the guidebooks skip"],
  ["Active morning","adventure","hike, bike, swim — your call"]
];
const PM_SOFT = [
  ["Afternoon at leisure","beach","recover, swim, or simply wander"],
  ["Sunset spot & golden hour","nature","the view worth waiting for"],
  ["Shopping & neighborhood wander","culture","bring something home"],
  ["Free afternoon in {c}","beach","nothing scheduled, on purpose"],
  ["Spa, rest & reset","beach","a real rest day, built in"],
  ["Local long lunch","food","the two-hour kind"],
  ["Photo walk at golden hour","culture","the light is best now"],
  ["Evening food tour","food","dinner as an activity"]
];
const softSlot = (city,i,pm) => {
  const pool = pm ? PM_SOFT : AM_SOFT;
  const s = pool[i % pool.length];
  return [city, s[0].replace("{c}", city), s[1], s[2]];
};

const TAG_ICON={culture:"fa-landmark",nature:"fa-mountain-sun",food:"fa-utensils",adventure:"fa-person-hiking",beach:"fa-umbrella-beach",history:"fa-monument",spiritual:"fa-place-of-worship",transit:"fa-plane-departure"};
const TIER={budget:{d:.55,f:.8,label:"Budget"},mid:{d:1,f:1,label:"Mid-range"},luxury:{d:2.2,f:2.4,label:"Luxury"}};
const money=n=>"$"+(Math.round(n/5)*5).toLocaleString();
const monthMult=(c,m)=>DEST[c].peak.includes(m)?1.22:DEST[c].low.includes(m)?.82:1;
const seasonLabel=(c,m)=>DEST[c].peak.includes(m)?"peak season":DEST[c].low.includes(m)?"low season":"shoulder season";

/* ---- itinerary: allocate the trip across REAL city legs, in route order ----
   Short trips take the first legs and stay put. Longer trips add legs AND
   lengthen stays. Moving between legs costs a travel day, shown explicitly.
   You never bounce back to a city you already left.                        */
function legCount(days,max){
  let n;
  if(days<=3)       n=1;
  else if(days<=5)  n=2;
  else if(days<=8)  n=3;
  else if(days<=12) n=4;
  else if(days<=17) n=5;
  else              n=6;
  return Math.max(1, Math.min(n, max));
}

function allocateDays(days,weights,minStay){
  const sum=weights.reduce((a,b)=>a+b,0);
  let alloc=weights.map(w=>Math.max(minStay, Math.round(days*w/sum)));
  let diff=days-alloc.reduce((a,b)=>a+b,0), guard=0;
  while(diff!==0 && guard++<500){
    // add days to the legs that "want" them most; take days from the longest stays
    let idx;
    if(diff>0){
      idx=weights.reduce((best,w,i)=>(w/alloc[i] > weights[best]/alloc[best] ? i : best),0);
      alloc[idx]++; diff--;
    }else{
      idx=alloc.reduce((best,a,i)=>(a>alloc[best] ? i : best),0);
      if(alloc[idx]<=minStay) break;
      alloc[idx]--; diff++;
    }
  }
  return alloc;
}

function buildItinerary(code,days){
  const d=DEST[code];
  const legs=d.legs;
  if(!legs || !legs.length) return [];            // routes are required

  const n=legCount(days,legs.length);
  const chosen=legs.slice(0,n);
  const minStay=days<=3?1:2;
  const alloc=allocateDays(days,chosen.map(l=>l.n||2),minStay);

  const out=[]; let dayNo=1;
  chosen.forEach((leg,li)=>{
    const heroes=[...leg.e];
    let sAM=0, sPM=0;
    const next=(pm)=> heroes.length
      ? [leg.c, ...heroes.shift()]
      : softSlot(leg.c, pm ? sPM++ : sAM++, pm);
    for(let i=0;i<alloc[li];i++){
      let am,pm;
      if(i===0){
        // arrival / travel day: how you get here, then ease into the first thing
        am=[leg.c, leg.t || (li===0?"Arrive in "+leg.c:"Travel to "+leg.c), "transit",
            li===0?"land, drop bags, get oriented":"onward — leave after breakfast"];
        pm=next(true);
      }else{
        am=next(false); pm=next(true);
      }
      out.push({day:dayNo++, city:leg.c, am, pm, nights:alloc[li]});
    }
  });
  // finish the trip honestly — you do have to fly home
  if(out.length>1){
    const last=out[out.length-1];
    last.pm=[last.city, "Depart from "+last.city, "transit", "last coffee, then the airport"];
  }
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

  const it=buildItinerary(code,days);

  // honest pacing note when the trip runs longer than the country's natural route
  const cap=(d.legs||[]).reduce((a,l)=>a+(l.n||2),0);
  const paceEl=document.getElementById("paceNote");
  if(paceEl){
    if(days > cap*1.25){
      paceEl.style.display="block";
      paceEl.innerHTML=`<i class="fa-solid fa-circle-info"></i> <strong>A note on pace:</strong> ${days} days is a long stay for ${d.name.split(" (")[0]} — this route naturally runs about ${cap} days. We've spread the extra time as unstructured days rather than inventing filler. Most travelers this long pair it with a neighbouring country, which is worth flagging at your consult (a second country can change your vaccine and medication plan).`;
    } else { paceEl.style.display="none"; }
  }

  let prevCity=null;
  document.getElementById("itinerary").innerHTML=it.map(day=>{
    const slot=s=>{
      const transit = s[2]==="transit";
      return `<div class="slot${transit?" move":""}"><i class="fa-solid ${TAG_ICON[s[2]]||"fa-location-dot"}"></i>
        <div><strong>${s[1]}</strong><span>${s[3]}</span></div></div>`;
    };
    const newLeg = day.city!==prevCity;
    prevCity = day.city;
    const header = newLeg
      ? `<div class="legbar"><i class="fa-solid fa-location-dot"></i> ${day.city}<em>${day.nights} ${day.nights===1?"day":"days"}</em></div>`
      : "";
    return header + `<div class="dayrow"><div class="daynum">Day ${day.day}</div>
      <div class="dayslots">${slot(day.am)}${slot(day.pm)}
      <div class="slot dine"><i class="fa-solid fa-wine-glass"></i><div><strong>Evening</strong><span>Dinner &amp; wander in ${day.city}</span></div></div></div></div>`;
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
