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

