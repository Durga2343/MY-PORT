/* ==============================================
   PORTFOLIO SCRIPT — Durga Velumani
   ============================================== */

'use strict';

/* --------------------------------
   1. THEME TOGGLE
   -------------------------------- */
(function initTheme() {
  const html = document.documentElement;
  const btn  = document.getElementById('theme-toggle');
  if (!btn) return;

  const ICONS = { dark: '🌙', light: '☀️' };

  const saved = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', saved);
  btn.textContent = saved === 'dark' ? ICONS.dark : ICONS.light;

  btn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    btn.textContent = next === 'dark' ? ICONS.dark : ICONS.light;
    localStorage.setItem('theme', next);
  });
})();

/* --------------------------------
   2. NAVBAR SCROLL EFFECT
   -------------------------------- */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // initial check
})();

/* --------------------------------
   3. HAMBURGER / MOBILE MENU
   -------------------------------- */
(function initMobileMenu() {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!hamburger || !mobileMenu) return;

  let isOpen = false;

  const toggle = () => {
    isOpen = !isOpen;
    hamburger.classList.toggle('open', isOpen);
    mobileMenu.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  const close = () => {
    if (!isOpen) return;
    isOpen = false;
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', toggle);

  // Close when a mobile link is clicked
  mobileMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', close);
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (isOpen && !hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      close();
    }
  });
})();

/* --------------------------------
   4. ACTIVE NAV HIGHLIGHT
   -------------------------------- */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('#navbar .nav-link');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const href = link.getAttribute('href').replace('#', '');
            link.classList.toggle('active', href === id);
          });
        }
      });
    },
    { threshold: 0.35, rootMargin: '-60px 0px -35% 0px' }
  );

  sections.forEach(s => observer.observe(s));
})();

/* --------------------------------
   5. SCROLL REVEAL
   -------------------------------- */
(function initReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!els.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // animate once
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  els.forEach(el => observer.observe(el));
})();

/* --------------------------------
   6. TYPEWRITER EFFECT
   -------------------------------- */
(function initTypewriter() {
  const el = document.getElementById('tw-text');
  if (!el) return;

  const words = [
    'Software Developer',
    'Full Stack Developer',
    'Problem Solver',
    'Web Developer',
  ];

  let wordIdx  = 0;
  let charIdx  = 0;
  let deleting = false;
  const TYPING_SPEED  = 80;
  const DELETING_SPEED = 45;
  const PAUSE_END      = 1800;
  const PAUSE_START    = 350;

  const tick = () => {
    const word = words[wordIdx];

    if (!deleting) {
      el.textContent = word.slice(0, charIdx + 1);
      charIdx++;

      if (charIdx === word.length) {
        deleting = true;
        setTimeout(tick, PAUSE_END);
        return;
      }
      setTimeout(tick, TYPING_SPEED);
    } else {
      el.textContent = word.slice(0, charIdx - 1);
      charIdx--;

      if (charIdx === 0) {
        deleting = false;
        wordIdx = (wordIdx + 1) % words.length;
        setTimeout(tick, PAUSE_START);
        return;
      }
      setTimeout(tick, DELETING_SPEED);
    }
  };

  setTimeout(tick, 900);
})();

/* --------------------------------
   7. SMOOTH SCROLL (fallback)
   -------------------------------- */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      const target   = document.getElementById(targetId);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();

/* --------------------------------
   8. MONOGRAM PARALLAX (subtle)
   -------------------------------- */
(function initParallax() {
  const container = document.querySelector('.monogram-container');
  if (!container) return;

  // Only on desktop
  if (window.matchMedia('(max-width: 920px)').matches) return;

  const hero = document.getElementById('hero');

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    const cx   = rect.width  / 2;
    const cy   = rect.height / 2;
    const dx   = (e.clientX - rect.left - cx) / cx;
    const dy   = (e.clientY - rect.top  - cy) / cy;

    container.style.transform = `translate(${dx * 8}px, ${dy * 6}px)`;
  });

  hero.addEventListener('mouseleave', () => {
    container.style.transform = 'translate(0, 0)';
  });
})();

/* --------------------------------
   9. EMAIL COPY & TOAST NOTIFICATION
   -------------------------------- */
(function initEmailHandlers() {
  const EMAIL_ADDR = 'durgaa2343@gmail.com';

  function showToast(msg) {
    let toast = document.getElementById('toast-notification');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast-notification';
      toast.className = 'toast-notification';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span class="toast-icon">✓</span><span>${msg}</span>`;
    toast.classList.add('show');

    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  // Handle all mailto links to copy email and guarantee instant response
  document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
    link.addEventListener('click', () => {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(EMAIL_ADDR).catch(() => {});
      }
      showToast(`Copied ${EMAIL_ADDR} to clipboard!`);
    });
  });

  // Dedicated Copy Email button
  const copyBtn = document.getElementById('contact-copy-email-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const copyTextSpan = document.getElementById('copy-btn-text');

      const setCopiedState = () => {
        showToast(`Copied ${EMAIL_ADDR} to clipboard!`);
        if (copyTextSpan) {
          copyTextSpan.textContent = 'Copied!';
          setTimeout(() => {
            copyTextSpan.textContent = 'Copy Email';
          }, 2000);
        }
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(EMAIL_ADDR).then(setCopiedState).catch(() => {
          // Fallback if clipboard API is blocked
          fallbackCopy(EMAIL_ADDR);
          setCopiedState();
        });
      } else {
        fallbackCopy(EMAIL_ADDR);
        setCopiedState();
      }
    });
  }

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
    } catch (err) {}
    document.body.removeChild(ta);
  }
})();

