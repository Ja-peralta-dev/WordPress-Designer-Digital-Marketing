/* ============================================
   JA PERALTA SERVICES — script.js
   Premium Interactions & Animations
   ============================================ */

'use strict';

/* ---- Announcement Bar Close ---- */
const annClose = document.getElementById('annClose');
const announcementBar = document.getElementById('announcementBar');
if (annClose && announcementBar) {
  annClose.addEventListener('click', () => {
    announcementBar.style.display = 'none';
  });
}

/* ---- Navbar Scroll Effect ---- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }
}, { passive: true });

/* ---- Hamburger / Mobile Menu ---- */
const hamburger = document.getElementById('hamburger');
const navMobile = document.getElementById('navMobile');

if (hamburger && navMobile) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMobile.classList.toggle('open');
  });

  // Close menu when a nav link is clicked
  navMobile.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMobile.classList.remove('open');
    });
  });
}

/* ---- Smooth Scroll for Anchor Links ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 80; // account for sticky nav
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ---- Scroll Reveal Animation ---- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger delay based on sibling index
      const siblings = entry.target.parentElement
        ? Array.from(entry.target.parentElement.children)
        : [];
      const idx = siblings.indexOf(entry.target);
      const delay = Math.min(idx * 80, 400);
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -60px 0px'
});

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ---- FAQ Accordion ---- */
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-item.open').forEach(openItem => {
      openItem.classList.remove('open');
    });

    // Toggle current
    if (!isOpen) item.classList.add('open');
  });
});

/* ---- Portfolio Filter ---- */
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active button
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    portfolioItems.forEach(item => {
      const cat = item.dataset.cat;
      if (filter === 'all' || cat === filter) {
        item.classList.remove('hidden');
        // Re-trigger reveal animation
        item.classList.remove('visible');
        setTimeout(() => item.classList.add('visible'), 50);
      } else {
        item.classList.add('hidden');
      }
    });
  });
});

/* ---- Portfolio Lightbox ---- */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');

portfolioItems.forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    const caption = item.querySelector('.portfolio-overlay span');
    const sub = item.querySelector('.portfolio-overlay small');

    if (img && lightbox && lightboxImg) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      if (lightboxCaption) {
        lightboxCaption.textContent =
          (caption ? caption.textContent : '') +
          (sub ? ' — ' + sub.textContent : '');
      }
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  });
});

if (lightboxClose) {
  lightboxClose.addEventListener('click', closeLightbox);
}
if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

function closeLightbox() {
  if (lightbox) {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
}

/* ---- Floating Buttonizer ---- */
const floatMainBtn = document.getElementById('floatMainBtn');
const floatBtns = document.getElementById('floatBtns');
const floatTooltip = document.getElementById('floatTooltip');

if (floatMainBtn && floatBtns) {
  floatMainBtn.addEventListener('click', () => {
    floatBtns.classList.toggle('open');
    // Hide tooltip once user interacts
    if (floatTooltip) floatTooltip.style.display = 'none';
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!floatBtns.contains(e.target)) {
      floatBtns.classList.remove('open');
    }
  });
}

/* ---- Active Nav Link Highlight on Scroll ---- */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.remove('active-link');
        if (link.getAttribute('href') === '#' + id) {
          link.classList.add('active-link');
        }
      });
    }
  });
}, {
  threshold: 0.4
});

sections.forEach(section => sectionObserver.observe(section));

/* Add active-link style dynamically */
const linkStyle = document.createElement('style');
linkStyle.textContent = `.active-link { color: var(--gold-light) !important; }
.active-link::after { width: 100% !important; }`;
document.head.appendChild(linkStyle);

/* ---- Stats Counter Animation ---- */
function animateCounter(el, target, duration = 1800) {
  const isDecimal = target.toString().includes('.');
  const suffix = el.dataset.suffix || '';
  let start = 0;
  const increment = target / (duration / 16);
  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      start = target;
      clearInterval(timer);
    }
    el.textContent = isDecimal
      ? start.toFixed(1) + suffix
      : Math.floor(start) + suffix;
  }, 16);
}

const statNums = document.querySelectorAll('.stat-num');
let statsAnimated = false;

const statsObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !statsAnimated) {
    statsAnimated = true;
    statNums.forEach(el => {
      const raw = el.textContent.trim();
      // Parse numbers like "50+", "100%", "3–7"
      const num = parseFloat(raw.replace(/[^0-9.]/g, ''));
      if (!isNaN(num) && raw.indexOf('–') === -1) {
        const suffix = raw.replace(/[0-9.]/g, '');
        el.dataset.suffix = suffix;
        animateCounter(el, num);
      }
    });
  }
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

/* ---- Image Lazy Load Fallback ---- */
// In case GitHub raw images fail to load, show a placeholder
document.querySelectorAll('img[src*="githubusercontent"]').forEach(img => {
  img.addEventListener('error', function () {
    // Only apply fallback once
    if (!this.dataset.fallback) {
      this.dataset.fallback = 'true';
      const w = this.width || 400;
      const h = this.height || 300;
      this.src = `https://placehold.co/${w}x${h}/111928/C9922A?text=JA+Peralta`;
    }
  });
});

/* ---- Scroll-to-top on Logo Click ---- */
document.querySelectorAll('.nav-logo').forEach(logo => {
  logo.addEventListener('click', (e) => {
    const href = logo.getAttribute('href');
    if (href === '#' || href === '#home') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
});

/* ---- Marquee Pause on Hover ---- */
const marqueeContent = document.querySelector('.marquee-content');
const trustStrip = document.querySelector('.trust-strip');
if (marqueeContent && trustStrip) {
  trustStrip.addEventListener('mouseenter', () => {
    marqueeContent.style.animationPlayState = 'paused';
  });
  trustStrip.addEventListener('mouseleave', () => {
    marqueeContent.style.animationPlayState = 'running';
  });
}

/* ---- Page Load Progress Bar ---- */
const progressBar = document.createElement('div');
progressBar.style.cssText = `
  position: fixed;
  top: 0; left: 0;
  height: 2px;
  background: linear-gradient(90deg, #C9922A, #E8B84B);
  z-index: 9999;
  width: 0%;
  transition: width 0.3s ease;
  pointer-events: none;
`;
document.body.prepend(progressBar);

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + '%';
}, { passive: true });

/* ---- Console Branding ---- */
console.log(
  '%c JA Peralta Services %c Premium Web Solutions PH & US ',
  'background: #C9922A; color: #070C18; font-weight: bold; padding: 4px 8px; border-radius: 4px 0 0 4px;',
  'background: #111928; color: #E8B84B; font-weight: bold; padding: 4px 8px; border-radius: 0 4px 4px 0;'
);
console.log('%c Built with ❤️ by James Angelo Peralta + Claude AI', 'color: #94A3B8; font-size: 12px;');

