'use strict';

/* ============================================
   1. UI BASELINE
   ============================================ */
document.documentElement.classList.add('js-ready');

/* ============================================
   2. PAGE TRANSITION ON NAVIGATION
   ============================================ */
const transition = document.getElementById('page-transition');

function navigate(url) {
  if (!transition) { window.location.href = url; return; }
  transition.classList.add('active');
  setTimeout(() => { window.location.href = url; }, 350);
}

// Intercept all internal nav links
document.querySelectorAll('a[href]').forEach(link => {
  const href = link.getAttribute('href');
  // Only internal links (not external, not anchors, not mailto)
  if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto')) {
    link.addEventListener('click', e => {
      e.preventDefault();
      navigate(href);
    });
  }
});

// Fade in on page load
window.addEventListener('pageshow', () => {
  if (transition) {
    transition.classList.remove('active');
  }
});

/* ============================================
   3. NAVBAR SCROLL
   ============================================ */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ============================================
   4. HAMBURGER
   ============================================ */
const hamburger  = document.getElementById('hamburger');
const navLinksEl = document.getElementById('nav-links');

hamburger?.addEventListener('click', () => {
  const open = hamburger.classList.toggle('open');
  navLinksEl.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', String(open));
  document.body.style.overflow = open ? 'hidden' : '';
});

navLinksEl?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger?.classList.remove('open');
    navLinksEl.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

/* ============================================
   5. SCROLL REVEAL
   ============================================ */
const revealEls = document.querySelectorAll('[data-reveal]');
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.transitionDelay = '0s';
      entry.target.classList.add('visible');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObs.observe(el));

/* ============================================
   6. CONTACT PAGE
   ============================================ */

/* ============================================
   9. SMOOTH ANCHOR SCROLL (for work.html anchors)
   ============================================ */
const hash = window.location.hash;
if (hash) {
  setTimeout(() => {
    const target = document.querySelector(hash);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 400);
}

/* ============================================
   10. HOME — ANIMATED STATS ON SCROLL
   ============================================ */
function animateNum(el, target, suffix = '') {
  const duration = 1800;
  const start    = performance.now();
  function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    const v = Math.round(target * (1 - Math.pow(1 - t, 4)));
    el.textContent = v.toLocaleString() + suffix;
    if (t < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// Animate any element with data-count attribute
document.querySelectorAll('[data-count]').forEach(el => {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateNum(el, parseInt(el.dataset.count), el.dataset.suffix || '');
        obs.disconnect();
      }
    });
  }, { threshold: 0.5 });
  obs.observe(el);
});

/* ============================================
   11. WORK PAGE — PROJECT IMAGE TILT
   ============================================ */
document.querySelectorAll('.project-img-wrap').forEach(wrap => {
  const img = wrap.querySelector('img');
  if (!img) return;

  wrap.addEventListener('mousemove', e => {
    const rect = wrap.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    img.style.transform = `scale(1.04) perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 4}deg)`;
  });

  wrap.addEventListener('mouseleave', () => {
    img.style.transform = '';
  });
});

/* ============================================
   12. FOOTER — CURRENT YEAR
   ============================================ */
document.querySelectorAll('.footer-copy').forEach(el => {
  el.textContent = el.textContent.replace('2026', new Date().getFullYear());
});

/* ============================================
   13. PROFILE PHOTO FALLBACK
   ============================================ */
const profileFallbackSvg =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000">' +
    '<defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1">' +
    '<stop offset="0%" stop-color="#252f46"/><stop offset="100%" stop-color="#101722"/>' +
    '</linearGradient></defs>' +
    '<rect width="800" height="1000" fill="url(#g)"/>' +
    '<circle cx="400" cy="360" r="120" fill="#e38745" fill-opacity="0.35"/>' +
    '<rect x="220" y="525" width="360" height="210" rx="38" fill="#e38745" fill-opacity="0.28"/>' +
    '<text x="400" y="830" fill="#f0d7c4" font-family="Segoe UI, sans-serif" font-size="34" text-anchor="middle">Add profile-photo.jpg</text>' +
    '</svg>'
  );

document.querySelectorAll('img[src="profile-photo.jpg"]').forEach(img => {
  img.addEventListener('error', () => {
    img.src = profileFallbackSvg;
    img.classList.add('is-fallback-photo');
  }, { once: true });
});

