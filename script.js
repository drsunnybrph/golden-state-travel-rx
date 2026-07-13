// ─── NAV ACTIVE STATE ───
// Highlights the correct nav link based on current page
document.addEventListener('DOMContentLoaded', () => {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link[data-nav]').forEach(link => {
    const nav = link.dataset.nav;
    if (nav === 'home'   && (page === 'index.html' || page === '')) link.classList.add('active');
    if (nav === 'travel' && page === 'travel-health.html')          link.classList.add('active');
    if (nav === 'plan'   && page === 'plan.html')                   link.classList.add('active');
    if (nav === 'naloxone' && page === 'naloxone.html')             link.classList.add('active');
    if (nav === 'about'  && page === 'about.html')                  link.classList.add('active');
    if (nav === 'pay'    && page === 'pay.html')                    link.classList.add('active');
    if (nav === 'book'   && page === 'book.html')                   link.classList.add('active');
  });
});

// ─── MOBILE MENU ───
function toggleMobileMenu() {
  const menu = document.getElementById('navMenu');
  const btn  = document.getElementById('hamburger');
  const isOpen = menu.classList.toggle('mobile-open');
  btn.textContent = isOpen ? '✕' : '☰';
}

function closeMobileMenu() {
  const menu = document.getElementById('navMenu');
  const btn  = document.getElementById('hamburger');
  if (menu) menu.classList.remove('mobile-open');
  if (btn)  btn.textContent = '☰';
}

// Escape key closes the mobile menu
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMobileMenu();
});

// ─── COPY TO CLIPBOARD (payment handles) ───
function copyToClipboard(text, btnId) {
  const btn = document.getElementById(btnId);
  const original = btn.innerHTML;

  const finish = () => {
    btn.classList.add('copied');
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
    setTimeout(() => {
      btn.classList.remove('copied');
      btn.innerHTML = original;
    }, 2000);
  };

  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(finish).catch(() => fallbackCopy(text, finish));
  } else {
    fallbackCopy(text, finish);
  }
}

function fallbackCopy(text, callback) {
  const el = document.createElement('textarea');
  el.value = text;
  el.style.position = 'fixed';
  el.style.opacity = '0';
  document.body.appendChild(el);
  el.focus();
  el.select();
  try { document.execCommand('copy'); } catch (e) {}
  document.body.removeChild(el);
  if (callback) callback();
}


// ─── BOOKING REQUEST FORM → GOOGLE SHEET ───
// Paste your Google Apps Script Web App URL (ends in /exec) between the quotes below.
// Until you do, the form will tell visitors to email instead (no broken submits).
const BOOKING_ENDPOINT = 'https://script.google.com/macros/s/AKfycbzg7hH5-NYjwgSfGMI6WVFHekI2kRu0KM7EbTm2QDRBfm0kG69SOZVzq2VIlon04MPQPw/exec';

function selectService(prefix) {
  const sel = document.getElementById('bf-service');
  if (sel) {
    for (const opt of sel.options) {
      if (opt.value.indexOf(prefix) === 0) { opt.selected = true; break; }
    }
  }
  const form = document.getElementById('bookForm');
  if (form) form.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function bfStatus(kind, msg) {
  const s = document.getElementById('bf-status');
  if (!s) return;
  s.className = 'bf-status show ' + kind;
  s.textContent = msg;
  s.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function submitBooking() {
  const val = id => { const e = document.getElementById(id); return e ? e.value.trim() : ''; };
  let ok = true;
  ['bf-name', 'bf-email', 'bf-service'].forEach(id => {
    const e = document.getElementById(id);
    if (e && !e.value.trim()) { e.classList.add('bf-err'); ok = false; }
    else if (e) { e.classList.remove('bf-err'); }
  });
  const email = val('bf-email');
  const emailEl = document.getElementById('bf-email');
  if (email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { if (emailEl) emailEl.classList.add('bf-err'); ok = false; }
  const ack = document.getElementById('bf-ack');
  if (!ack || !ack.checked) ok = false;
  if (!ok) { bfStatus('err', 'Please complete the required fields (name, email, service) and check the acknowledgment box.'); return; }

  const data = {
    service: val('bf-service'), name: val('bf-name'), email: email, phone: val('bf-phone'),
    language: val('bf-lang'), timeframe: val('bf-when'), time_of_day: val('bf-tod'),
    pharmacy: val('bf-pharm'), page: (location.pathname.split('/').pop() || 'index.html'),
    submitted_at: new Date().toISOString()
  };

  if (!BOOKING_ENDPOINT) {
    bfStatus('err', 'This form isn\'t connected yet. Please email drsunnybrph@gmail.com to book and I\'ll get you scheduled.');
    return;
  }

  const btn = document.querySelector('.bf-submit');
  if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…'; }
  const reset = () => { if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Booking Request'; } };

  fetch(BOOKING_ENDPOINT, {
    method: 'POST', mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(data)
  }).then(() => {
    const first = data.name.split(' ')[0];
    bfStatus('ok', 'Thank you, ' + first + '! Your request was received. You\'ll get an email from drsunnybrph@gmail.com with a secure link to schedule and complete your private intake.');
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-check"></i> Request Sent'; }
  }).catch(() => {
    reset();
    bfStatus('err', 'Sorry — the form could not send just now. Please email drsunnybrph@gmail.com and I\'ll get you scheduled.');
  });
}


// ─── ABOUT TRAVEL GALLERY (full-width strip of destination photos) ───
// Edit a line per photo. Files sit next to the .html. Order = left-to-right.
const ABOUT_SLIDES = [
  { src: 'sunny.jpg',    caption: 'Lisbon, Portugal' },
  { src: 'japan.jpg',    caption: 'Hakone, Japan' },
  { src: 'rome.jpg',     caption: 'Rome, Italy' },
  { src: 'guatape.jpg',  caption: 'Guatapé, Colombia' },
  { src: 'positano.jpg', caption: 'Positano, Amalfi Coast' },
  { src: 'mayabay.jpg',  caption: 'Maya Bay, Thailand' },
];

function initAboutGallery() {
  const wrap = document.getElementById('aboutGallery');
  if (!wrap || typeof ABOUT_SLIDES === 'undefined') return;
  ABOUT_SLIDES.forEach(function (s) {
    const fig = document.createElement('figure');
    fig.className = 'gtile';
    const img = document.createElement('img');
    img.loading = 'lazy';
    img.alt = s.caption || 'Travel';
    img.addEventListener('error', function () { if (fig.parentNode) fig.parentNode.removeChild(fig); });
    img.src = s.src;
    fig.appendChild(img);
    if (s.caption) {
      const cap = document.createElement('figcaption');
      cap.innerHTML = '<i class="fa-solid fa-location-dot"></i> ' + s.caption;
      fig.appendChild(cap);
    }
    wrap.appendChild(fig);
  });
}
document.addEventListener('DOMContentLoaded', initAboutGallery);
