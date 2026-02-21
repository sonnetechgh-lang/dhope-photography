/* ===== PARTICLES CANVAS ===== */
(function () {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const container = document.getElementById('particlesCanvas');
  if (!container) return;
  container.appendChild(canvas);

  let width, height, particles = [];

  function resize() {
    width = canvas.width = container.offsetWidth;
    height = canvas.height = container.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COLORS = ['rgba(139,92,246,0.7)', 'rgba(191,128,255,0.5)', 'rgba(196,181,253,0.4)', 'rgba(255,255,255,0.3)'];

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x = Math.random() * width;
      this.y = init ? Math.random() * height : height + 10;
      this.r = Math.random() * 2.5 + 0.5;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = -(Math.random() * 0.5 + 0.2);
      this.life = Math.random();
      this.decay = Math.random() * 0.003 + 0.001;
      this.blink = Math.random() * Math.PI * 2;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.blink += 0.04;
      this.life -= this.decay;
      if (this.life <= 0 || this.y < -10) this.reset(false);
    }
    draw() {
      const alpha = Math.max(0, this.life) * (0.5 + 0.5 * Math.sin(this.blink));
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < 80; i++) particles.push(new Particle());

  function loop() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ===== AOS INIT ===== */
AOS.init({ duration: 800, once: true, offset: 60, easing: 'ease-out-cubic' });

/* ===== SCROLL PROGRESS ===== */
const progressBar = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
  if (progressBar) progressBar.style.width = scrolled + '%';
}, { passive: true });

/* ===== NAVBAR SCROLL EFFECT ===== */
const navbar = document.getElementById('navbar');
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const s = window.scrollY;
  if (navbar) {
    navbar.classList.toggle('scrolled', s > 60);
    navbar.style.transform = s > lastScroll && s > 120 ? 'translateY(-100%)' : 'translateY(0)';
    lastScroll = s;
  }
}, { passive: true });
navbar.style.transition = 'transform 0.4s ease, background 0.4s ease, padding 0.4s ease, box-shadow 0.4s ease';

/* ===== HAMBURGER MENU ===== */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ===== CUSTOM CURSOR ===== */
const cursor = document.getElementById('cursor');

document.addEventListener('mousemove', e => {
  if (cursor) {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  }
});

document.querySelectorAll('a, button, .grid-item, .service-card, .filter-btn').forEach(el => {
  el.addEventListener('mouseenter', () => cursor?.classList.add('hovered'));
  el.addEventListener('mouseleave', () => cursor?.classList.remove('hovered'));
});

/* ===== HERO TYPING TAGLINE ===== */
const taglineEl = document.getElementById('heroTagline');
const tagline = 'Turning moments into lasting memories.';
let charIdx = 0;
function typeTagline() {
  if (!taglineEl) return;
  if (charIdx <= tagline.length) {
    taglineEl.textContent = tagline.slice(0, charIdx);
    charIdx++;
    setTimeout(typeTagline, 55);
  }
}
setTimeout(typeTagline, 1200);

/* ===== HERO SLIDESHOW ===== */
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.slide-dot');
let currentSlide = 0;
let slideTimer;

function goToSlide(idx) {
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = (idx + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}

function nextSlide() { goToSlide(currentSlide + 1); }

function startSlideTimer() {
  clearInterval(slideTimer);
  slideTimer = setInterval(nextSlide, 5500);
}
startSlideTimer();

dots.forEach(d => {
  d.addEventListener('click', () => {
    goToSlide(parseInt(d.dataset.index));
    startSlideTimer();
  });
});

/* ===== STATS COUNTER ===== */
function runCounters() {
  document.querySelectorAll('.stat-number').forEach(el => {
    const target = parseInt(el.dataset.target);
    const duration = 2000;
    const start = performance.now();
    const update = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.floor(ease * target);
      if (t < 1) requestAnimationFrame(update);
      else el.textContent = target;
    };
    requestAnimationFrame(update);
  });
}
const statsObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    runCounters();
    statsObserver.disconnect();
  }
}, { threshold: 0.4 });
const statsSection = document.getElementById('stats');
if (statsSection) statsObserver.observe(statsSection);

/* ===== PORTFOLIO FILTER ===== */
const filterBtns = document.querySelectorAll('.filter-btn');
const gridItems = document.querySelectorAll('.grid-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    gridItems.forEach(item => {
      const show = filter === 'all' || item.classList.contains(filter);
      item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      if (show) {
        item.style.opacity = '1';
        item.style.transform = 'scale(1)';
        item.classList.remove('hidden');
      } else {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.95)';
        setTimeout(() => { if (!item.classList.contains(filter) && filter !== 'all') item.classList.add('hidden'); }, 400);
      }
    });
  });
});

/* ===== LIGHTBOX ===== */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
let lightboxImages = [];
let lightboxIdx = 0;

function buildLightboxImages() {
  lightboxImages = [];
  document.querySelectorAll('.lightbox-open').forEach(btn => {
    lightboxImages.push({ src: btn.dataset.src, caption: btn.dataset.caption });
  });
}

function openLightbox(idx) {
  buildLightboxImages();
  lightboxIdx = idx;
  lightboxImg.src = lightboxImages[lightboxIdx].src;
  lightboxCaption.textContent = lightboxImages[lightboxIdx].caption;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  lightboxImg.src = '';
}

function lightboxNavigate(dir) {
  lightboxIdx = (lightboxIdx + dir + lightboxImages.length) % lightboxImages.length;
  lightboxImg.style.opacity = '0';
  setTimeout(() => {
    lightboxImg.src = lightboxImages[lightboxIdx].src;
    lightboxCaption.textContent = lightboxImages[lightboxIdx].caption;
    lightboxImg.style.opacity = '1';
  }, 200);
  lightboxImg.style.transition = 'opacity 0.2s';
}

document.querySelectorAll('.lightbox-open').forEach((btn, i) => {
  btn.addEventListener('click', (e) => { e.stopPropagation(); openLightbox(i); });
});
document.querySelectorAll('.grid-item').forEach((item, i) => {
  item.addEventListener('click', () => openLightbox(i));
});

lightboxClose?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
lightboxPrev?.addEventListener('click', () => lightboxNavigate(-1));
lightboxNext?.addEventListener('click', () => lightboxNavigate(1));

document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') lightboxNavigate(-1);
  if (e.key === 'ArrowRight') lightboxNavigate(1);
});

/* ===== TESTIMONIALS CAROUSEL ===== */
const track = document.getElementById('testimonialTrack');
const testimonialCards = document.querySelectorAll('.testimonial-card');
const dotsContainer = document.getElementById('carouselDots');
const prevBtn = document.getElementById('carouselPrev');
const nextBtn = document.getElementById('carouselNext');

let carouselIdx = 0;
let cardsVisible = window.innerWidth > 900 ? 3 : window.innerWidth > 600 ? 2 : 1;
const totalCards = testimonialCards.length;
let autoPlay;

function getCardWidth() {
  if (!testimonialCards[0]) return 0;
  return testimonialCards[0].offsetWidth + 24;
}

function buildCarouselDots() {
  if (!dotsContainer) return;
  dotsContainer.innerHTML = '';
  const pages = totalCards - cardsVisible + 1;
  for (let i = 0; i < pages; i++) {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goCarousel(i));
    dotsContainer.appendChild(dot);
  }
}

function goCarousel(idx) {
  const pages = totalCards - cardsVisible + 1;
  carouselIdx = Math.max(0, Math.min(idx, pages - 1));
  if (track) track.style.transform = `translateX(-${carouselIdx * getCardWidth()}px)`;
  document.querySelectorAll('.carousel-dot').forEach((d, i) => d.classList.toggle('active', i === carouselIdx));
}

function nextCarousel() { goCarousel(carouselIdx + 1 >= totalCards - cardsVisible + 1 ? 0 : carouselIdx + 1); }
function prevCarousel() { goCarousel(carouselIdx - 1 < 0 ? totalCards - cardsVisible : carouselIdx - 1); }

prevBtn?.addEventListener('click', () => { prevCarousel(); resetAuto(); });
nextBtn?.addEventListener('click', () => { nextCarousel(); resetAuto(); });

function resetAuto() { clearInterval(autoPlay); autoPlay = setInterval(nextCarousel, 4500); }

window.addEventListener('resize', () => {
  cardsVisible = window.innerWidth > 900 ? 3 : window.innerWidth > 600 ? 2 : 1;
  buildCarouselDots();
  goCarousel(0);
});

buildCarouselDots();
autoPlay = setInterval(nextCarousel, 4500);

/* ===== CONTACT FORM ===== */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const submitBtn = document.getElementById('submitBtn');

/* Float label for select via .has-value class */
const serviceSelect = document.getElementById('serviceType');
serviceSelect?.addEventListener('change', () => {
  serviceSelect.classList.toggle('has-value', serviceSelect.value !== '');
});

contactForm?.addEventListener('submit', e => {
  e.preventDefault();
  submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
  submitBtn.disabled = true;
  setTimeout(() => {
    contactForm.style.display = 'none';
    if (formSuccess) formSuccess.style.display = 'block';
  }, 1600);
});

/* ===== SMOOTH ACTIVE NAV LINKS ===== */
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-links a:not(.nav-cta)');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinkEls.forEach(a => {
        a.style.color = '';
        if (a.getAttribute('href') === '#' + entry.target.id) a.style.color = 'var(--purple-300)';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

/* ===== PARALLAX ON SCROLL ===== */
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const heroContent = document.querySelector('.hero-content');
  if (heroContent && scrollY < window.innerHeight) {
    heroContent.style.transform = `translateY(${scrollY * 0.35}px)`;
    heroContent.style.opacity = 1 - scrollY / (window.innerHeight * 0.75);
  }
}, { passive: true });

/* ===== RIPPLE EFFECT ON BUTTONS ===== */
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    ripple.style.cssText = `
      position:absolute;border-radius:50%;
      width:4px;height:4px;
      background:rgba(255,255,255,0.5);
      left:${e.clientX - rect.left - 2}px;
      top:${e.clientY - rect.top - 2}px;
      animation:rippleAnim 0.6s ease-out forwards;
      pointer-events:none;
    `;
    if (!document.getElementById('rippleStyle')) {
      const s = document.createElement('style');
      s.id = 'rippleStyle';
      s.textContent = '@keyframes rippleAnim{to{width:300px;height:300px;margin-left:-150px;margin-top:-150px;opacity:0;}}';
      document.head.appendChild(s);
    }
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });
});

/* ===== CURSOR STYLE FIX ===== */
if (cursor) {
  cursor.style.transform = 'translate(-50%, -50%)';
}
