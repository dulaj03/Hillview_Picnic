/* ========================================================
   HILLVIEW PICNIC - app.js
   WhatsApp RSVP, Countdown, Scroll Animations, Particles
======================================================== */

// ── WHATSAPP CONFIG ────────────────────────────────────
const WA_NUMBER = '14163563729'; // +1 (416) 356-3729

// ── PARTICLES ──────────────────────────────────────────
(function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const count = window.innerWidth < 600 ? 12 : 25;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 10 + 4;
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${size}px;
      height: ${size}px;
      animation-duration: ${Math.random() * 20 + 12}s;
      animation-delay: ${Math.random() * 10}s;
      background: ${['rgba(76,175,120,0.12)','rgba(232,168,62,0.10)','rgba(255,255,255,0.08)'][Math.floor(Math.random()*3)]};
    `;
    container.appendChild(p);
  }
})();

// ── NAVBAR SCROLL ──────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

// ── COUNTDOWN TIMER ────────────────────────────────────
(function initCountdown() {
  // Target: August 6, 2026 at 11:00 AM EST (UTC-5)
  const target = new Date('2026-08-06T11:00:00-05:00').getTime();

  const elDays    = document.getElementById('cd-days');
  const elHours   = document.getElementById('cd-hours');
  const elMinutes = document.getElementById('cd-minutes');
  const elSeconds = document.getElementById('cd-seconds');

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    const now  = Date.now();
    const diff = target - now;

    if (diff <= 0) {
      elDays.textContent    = '00';
      elHours.textContent   = '00';
      elMinutes.textContent = '00';
      elSeconds.textContent = '00';
      return;
    }

    const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    elDays.textContent    = pad(days);
    elHours.textContent   = pad(hours);
    elMinutes.textContent = pad(minutes);
    elSeconds.textContent = pad(seconds);
  }

  tick();
  setInterval(tick, 1000);
})();

// ── SCROLL REVEAL ──────────────────────────────────────
(function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

// ── GUEST COUNTER ──────────────────────────────────────
const guestsInput    = document.getElementById('guests');
const decreaseBtn    = document.getElementById('decreaseGuests');
const increaseBtn    = document.getElementById('increaseGuests');

decreaseBtn.addEventListener('click', () => {
  const val = parseInt(guestsInput.value, 10) || 1;
  if (val > 1) guestsInput.value = val - 1;
  animateBtnClick(decreaseBtn);
});

increaseBtn.addEventListener('click', () => {
  const val = parseInt(guestsInput.value, 10) || 1;
  if (val < 20) guestsInput.value = val + 1;
  animateBtnClick(increaseBtn);
});

function animateBtnClick(btn) {
  btn.style.transform = 'scale(0.85)';
  setTimeout(() => { btn.style.transform = ''; }, 150);
}

// ── RADIO CARD ANIMATION ───────────────────────────────
document.querySelectorAll('.radio-card input[type="radio"]').forEach(radio => {
  radio.addEventListener('change', () => {
    document.querySelectorAll('.radio-inner').forEach(ri => ri.style.transform = '');
    if (radio.checked) {
      radio.closest('.radio-card').querySelector('.radio-inner').style.transform = 'scale(1.04)';
      setTimeout(() => {
        radio.closest('.radio-card').querySelector('.radio-inner').style.transform = '';
      }, 200);
    }
  });
});

// ── FORM VALIDATION & WHATSAPP SUBMIT ─────────────────
const form       = document.getElementById('rsvpForm');
const modal      = document.getElementById('successModal');
const modalClose = document.getElementById('modalClose');
const waFallback = document.getElementById('waFallback');
let waUrl        = '';

form.addEventListener('submit', function(e) {
  e.preventDefault();

  // Clear previous errors
  clearErrors();

  const fullName  = document.getElementById('fullName').value.trim();
  const phone     = document.getElementById('phone').value.trim();
  const email     = document.getElementById('email').value.trim();
  const attending = document.querySelector('input[name="attending"]:checked');
  const guests    = parseInt(document.getElementById('guests').value, 10) || 0;
  const dietary   = document.getElementById('dietary').value.trim();
  const message   = document.getElementById('message').value.trim();

  let valid = true;

  // Validate name
  if (!fullName) {
    showError('fullName', 'nameError');
    valid = false;
  }

  // Validate attendance
  if (!attending) {
    document.getElementById('attendingError').classList.add('show');
    valid = false;
  }

  // Validate guests (only if attending YES or MAYBE)
  if (attending && attending.value !== "Sorry, I can't make it 😢" && guests < 1) {
    showError('guests', 'guestsError');
    valid = false;
  }

  if (!valid) {
    // Scroll to first error
    const firstError = form.querySelector('.error, .field-error.show');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return;
  }

  // Build WhatsApp message
  const guestLine = attending && attending.value !== "Sorry, I can't make it 😢"
    ? `👥 *Number of Guests:* ${guests}`
    : '';

  const dietaryLine = dietary ? `🥗 *Dietary/Allergies:* ${dietary}` : '';
  const messageLine = message ? `💬 *Message to Host:* ${message}` : '';
  const phoneLine   = phone   ? `📞 *Phone:* ${phone}` : '';
  const emailLine   = email   ? `📧 *Email:* ${email}` : '';

  const lines = [
    `🌿 *RSVP — The Great Summer Get-Together*`,
    `📅 *Event:* Hillview Picnic at Boyd Conservation Park`,
    `📆 *Date:* Thursday, August 6, 2026 | 11:00 AM Onwards`,
    ``,
    `━━━━━━━━━━━━━━━━━━━━━`,
    `👤 *Name:* ${fullName}`,
    phoneLine,
    emailLine,
    `✅ *Attendance:* ${attending ? attending.value : 'N/A'}`,
    guestLine,
    dietaryLine,
    messageLine,
  ]
  .filter(l => l !== undefined && l !== '')
  .join('\n');

  const encoded = encodeURIComponent(lines);
  waUrl = `https://wa.me/${WA_NUMBER}?text=${encoded}`;

  // Update fallback link
  waFallback.href = waUrl;

  // Show modal
  modal.classList.add('show');

  // Auto-open WhatsApp
  setTimeout(() => {
    window.open(waUrl, '_blank');
  }, 600);
});

function showError(inputId, errorId) {
  const input = document.getElementById(inputId);
  if (input) {
    input.classList.add('error');
    input.addEventListener('input', () => input.classList.remove('error'), { once: true });
  }
  const err = document.getElementById(errorId);
  if (err) err.classList.add('show');
}

function clearErrors() {
  document.querySelectorAll('.field-error').forEach(el => el.classList.remove('show'));
  document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
}

// Modal close
modalClose.addEventListener('click', () => {
  modal.classList.remove('show');
  form.reset();
  // Remove radio highlights
  document.querySelectorAll('.radio-inner').forEach(ri => ri.style.transform = '');
});

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.remove('show');
  }
});

// ── SMOOTH ANCHOR NAVIGATION ───────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── INPUT FOCUS ANIMATION ─────────────────────────────
document.querySelectorAll('input, textarea').forEach(el => {
  el.addEventListener('focus', () => {
    el.closest('.form-group')?.classList.add('focused');
  });
  el.addEventListener('blur', () => {
    el.closest('.form-group')?.classList.remove('focused');
  });
});

// ── SUBMIT BUTTON RIPPLE ─────────────────────────────
document.getElementById('submitBtn').addEventListener('mousedown', function(e) {
  const btn    = this;
  const circle = document.createElement('span');
  const rect   = btn.getBoundingClientRect();
  const size   = Math.max(rect.width, rect.height);
  circle.style.cssText = `
    position:absolute;
    width:${size}px;
    height:${size}px;
    left:${e.clientX - rect.left - size/2}px;
    top:${e.clientY - rect.top - size/2}px;
    background:rgba(255,255,255,0.3);
    border-radius:50%;
    transform:scale(0);
    animation:ripple 0.6s linear;
    pointer-events:none;
  `;
  const style = document.createElement('style');
  style.textContent = '@keyframes ripple{to{transform:scale(4);opacity:0}}';
  document.head.appendChild(style);
  btn.style.position = 'relative';
  btn.style.overflow = 'hidden';
  btn.appendChild(circle);
  setTimeout(() => circle.remove(), 700);
});
