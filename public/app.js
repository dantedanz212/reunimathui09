/* ============================================================
   app.js — Reuni Matek 09
   ============================================================ */

// ---- CONFIG: Masukkan jumlah alumni yang sudah mendaftar di sini ----
const TOTAL_ALUMNI_PENDAFTAR = 0; // Ganti angka ini sesuai dengan jumlah pendaftar aktual!

// ---- Navbar scroll effect ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ---- Hamburger menu ----
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
});
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.textContent = '☰';
  });
});

// ---- Countdown Timer ----
const eventDate = new Date('2026-07-11T10:00:00+07:00');
function updateCountdown() {
  const now  = new Date();
  const diff = eventDate - now;
  if (diff <= 0) {
    document.getElementById('countdown').innerHTML = '<div class="countdown-item" style="min-width:200px"><span style="font-size:1.5rem">Acara Sedang Berlangsung! 🎉</span></div>';
    return;
  }
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  document.getElementById('cd-hari').textContent   = String(d).padStart(2, '0');
  document.getElementById('cd-jam').textContent    = String(h).padStart(2, '0');
  document.getElementById('cd-menit').textContent  = String(m).padStart(2, '0');
  document.getElementById('cd-detik').textContent  = String(s).padStart(2, '0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ---- Reveal on Scroll (Intersection Observer) ----
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ---- Particle Canvas ----
const canvas = document.getElementById('particle-canvas');
const ctx    = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function randomBetween(a, b) { return a + Math.random() * (b - a); }

// Math symbols for particles
const mathSymbols = ['∑', 'π', '∫', '∞', 'θ', 'λ', 'μ', '∂', '√', '≡', 'φ', 'Δ'];

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x    = randomBetween(0, canvas.width);
    this.y    = randomBetween(0, canvas.height);
    this.size = randomBetween(14, 28);
    this.sym  = mathSymbols[Math.floor(Math.random() * mathSymbols.length)];
    this.speed = randomBetween(0.15, 0.45);
    this.opacity = randomBetween(0.25, 0.60);
    this.drift = randomBetween(-0.2, 0.2);
  }
  update() {
    this.y -= this.speed;
    this.x += this.drift;
    if (this.y < -30) this.reset();
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = '#C9A84C';
    ctx.font = `${this.size}px 'Playfair Display', serif`;
    ctx.fillText(this.sym, this.x, this.y);
    ctx.restore();
  }
}

// Create particles
for (let i = 0; i < 55; i++) particles.push(new Particle());

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ---- Staggered section tag reveals ----
// (already handled by IntersectionObserver above)

// ---- Smooth active nav link highlight ----
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navAnchors.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--gold)' : '';
  });
});

// ---- Registration Counter Animation ----
function animateCounter() {
  const counterEl = document.getElementById('registered-count');
  const statCounterEl = document.getElementById('stat-registered-count');
  if (!counterEl && !statCounterEl) return;
  
  const end = TOTAL_ALUMNI_PENDAFTAR;
  if (end === 0) {
    if (counterEl) counterEl.textContent = '0';
    if (statCounterEl) statCounterEl.textContent = '0';
    return;
  }
  
  const duration = 1200; // ms
  let start = 0;
  const stepTime = Math.max(Math.floor(duration / end), 12);
  
  const timer = setInterval(() => {
    start++;
    if (counterEl) counterEl.textContent = start;
    if (statCounterEl) statCounterEl.textContent = start;
    if (start >= end) {
      if (counterEl) counterEl.textContent = end;
      if (statCounterEl) statCounterEl.textContent = end;
      clearInterval(timer);
    }
  }, stepTime);
}
// Trigger counter animation once loaded
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(animateCounter, 800);
});
