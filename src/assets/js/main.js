/* FUZAIL. — interaction & motion
   Everything here is progressive enhancement: the HTML is complete and readable
   without it, and motion only runs when the visitor hasn't asked for less. */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ── Navigation ─────────────────────────────────────────────────────── */
  var nav = $('[data-nav-root]');
  var menuBtn = $('[data-menu-btn]');
  var menu = $('[data-menu]');

  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('menu-open', open);
    if (open) {
      menu.hidden = false;
      var first = $('a', menu);
      if (first) setTimeout(function () { first.focus(); }, 120);
    } else {
      setTimeout(function () { if (!nav.classList.contains('is-open')) menu.hidden = true; }, 1100);
    }
  }
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', function () { setMenu(!nav.classList.contains('is-open')); });
    $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); menuBtn.focus(); }
      // Keep focus inside the open menu
      if (e.key === 'Tab' && nav.classList.contains('is-open')) {
        var items = [menuBtn].concat($$('a', menu));
        var i = items.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); items[items.length - 1].focus(); }
        else if (!e.shiftKey && i === items.length - 1) { e.preventDefault(); items[0].focus(); }
      }
    });
    window.matchMedia('(min-width: 960px)').addEventListener('change', function (m) { if (m.matches) setMenu(false); });
  }

  // Sticky behaviour: solid after the fold, hides on scroll down, returns on scroll up.
  var lastY = window.scrollY;
  var ticking = false;
  function onScroll() {
    var y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 24);
    if (!nav.classList.contains('is-open')) {
      nav.classList.toggle('is-hidden', y > lastY && y > window.innerHeight * 0.6 && !nav.contains(document.activeElement));
    }
    lastY = y;
    ticking = false;
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  // Active section indicator — the section crossing the upper-middle of the viewport.
  var navLinks = $$('[data-nav]');
  var sections = $$('[data-section]');
  function updateActive() {
    var mark = window.innerHeight * 0.45, current = null;
    sections.forEach(function (s) { var r = s.getBoundingClientRect(); if (r.top <= mark && r.bottom > mark) current = s.getAttribute('data-section'); });
    navLinks.forEach(function (l) {
      var on = l.getAttribute('data-nav') === current;
      l.classList.toggle('is-active', on);
      if (on) l.setAttribute('aria-current', 'location'); else l.removeAttribute('aria-current');
    });
  }
  if (navLinks.length && sections.length) {
    window.addEventListener('scroll', function () { requestAnimationFrame(updateActive); }, { passive: true });
    updateActive();
  }

  /* ── Pointer-driven depth (hero + project covers) ─────────────────── */
  var hero = $('[data-hero]');
  if (hero && finePointer && !reduce) {
    var raf = 0, tx = 0, ty = 0;
    hero.addEventListener('pointermove', function (e) {
      var r = hero.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width - 0.5;
      ty = (e.clientY - r.top) / r.height - 0.5;
      if (!raf) raf = requestAnimationFrame(function () {
        hero.style.setProperty('--px', tx.toFixed(3));
        hero.style.setProperty('--py', ty.toFixed(3));
        raf = 0;
      });
    });
    hero.addEventListener('pointerleave', function () { hero.style.setProperty('--px', 0); hero.style.setProperty('--py', 0); });
  }

  if (finePointer) {
    $$('.project-visual').forEach(function (el) {
      var cover = $('.cover', el);
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var x = e.clientX - r.left, y = e.clientY - r.top;
        el.style.setProperty('--vx', x + 'px');
        el.style.setProperty('--vy', y + 'px');
        if (cover) { cover.style.setProperty('--mx', (x / r.width) * 100 + '%'); cover.style.setProperty('--my', (y / r.height) * 100 + '%'); }
      });
    });
  }

  /* ── Before / after comparisons ───────────────────────────────────── */
  $$('[data-compare]').forEach(function (fig) {
    var range = $('.compare-range', fig);
    var frame = $('.compare-frame', fig);
    var set = function () { frame.style.setProperty('--c', range.value + '%'); };
    range.addEventListener('input', set); set();
  });

  /* ── Case study: section nav + progress ───────────────────────────── */
  var tocLinks = $$('[data-toc]');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    var csIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        tocLinks.forEach(function (l) { l.classList.toggle('is-active', l.getAttribute('data-toc') === en.target.id); });
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    $$('[data-cs-section]').forEach(function (s) { csIo.observe(s); });
    var bar = $('[data-cs-progress]');
    var content = $('.cs-content');
    if (bar && content) {
      var upd = function () {
        var r = content.getBoundingClientRect();
        var p = Math.min(1, Math.max(0, (window.innerHeight * 0.5 - r.top) / r.height));
        bar.style.setProperty('--p', p.toFixed(3));
      };
      window.addEventListener('scroll', function () { requestAnimationFrame(upd); }, { passive: true });
      upd();
    }
  }

  /* ── Motion (GSAP) ─────────────────────────────────────────────────── */
  if (reduce || !root.classList.contains('motion')) { window.__motion = true; return; }
  if (!window.gsap || !window.ScrollTrigger || root.classList.contains('motion-failed')) {
    root.classList.add('motion-failed');
    return;
  }
  window.__motion = true;
  var gsap = window.gsap;
  gsap.registerPlugin(window.ScrollTrigger);
  var ease = 'expo.out';
  // Note: CSS pre-hides elements with translateY(%). GSAP reads that as a pixel `y`,
  // so tweens that use yPercent also reset `y: 0` explicitly.

  // Entrance: hero (home) or case-study header
  var intro = gsap.timeline({ defaults: { ease: ease } });
  var heroLines = $$('[data-hero-line]');
  if (heroLines.length) intro.fromTo(heroLines, { y: 0, yPercent: 105 }, { y: 0, yPercent: 0, duration: 1.4, stagger: 0.09 }, 0.1);
  var heroObject = $('.hero-object');
  if (heroObject) intro.fromTo(heroObject, { opacity: 0, scale: 0.86, rotate: -6 }, { opacity: 1, scale: 1, rotate: 0, duration: 1.8, clearProps: 'scale,rotate' }, 0.2);
  var heroFade = $$('[data-hero-fade]');
  if (heroFade.length) intro.fromTo(heroFade, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 1.1, stagger: 0.08, clearProps: 'transform' }, 0.55);
  var heroMark = $$('[data-hero-mark] [data-wm]');
  if (heroMark.length) intro.fromTo(heroMark, { y: 0, yPercent: 100 }, { y: 0, yPercent: 0, duration: 1.6, stagger: 0.05, ease: 'expo.out' }, 0.45);

  // Hero wordmark drifts as you leave the hero (layered depth)
  if (hero) {
    gsap.to('.wm--hero', { yPercent: 18, ease: 'none', scrollTrigger: { trigger: hero, start: 'bottom bottom', end: 'bottom top', scrub: true } });
    gsap.to('.hero-object-img', { yPercent: -18, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
  }

  // Section headlines: masked line reveal
  $$('.section-title .mask-inner, .contact-title .mask-inner').forEach(function (el) {
    gsap.fromTo(el, { y: 0, yPercent: 105 }, { y: 0, yPercent: 0, duration: 1.3, ease: ease, scrollTrigger: { trigger: el.parentNode, start: 'top 88%' } });
  });

  // Generic reveals, batched so elements entering together stagger together
  window.ScrollTrigger.batch('[data-reveal]:not([data-reveal="image"])', {
    start: 'top 90%',
    once: true,
    onEnter: function (els) { gsap.to(els, { opacity: 1, y: 0, duration: 1.1, ease: ease, stagger: 0.07, overwrite: true }); },
  });

  // Image reveals: a clip mask that opens upward, with a slight settle in scale
  $$('[data-reveal="image"]').forEach(function (el) {
    var img = $('img', el);
    var tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
    tl.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut' });
    if (img && !el.closest('.cover') && !$('.cover', el)) tl.fromTo(img, { scale: 1.18 }, { scale: 1, duration: 1.8, ease: ease, clearProps: 'transform' }, 0);
  });

  // Project covers: object parallax + number drift while scrolling
  $$('.project-visual, .cs-cover').forEach(function (v) {
    var obj = $('[data-parallax]', v);
    var num = $('.cover-num', v);
    if (obj) gsap.fromTo(obj, { yPercent: 8 }, { yPercent: -8, ease: 'none', scrollTrigger: { trigger: v, start: 'top bottom', end: 'bottom top', scrub: true } });
    if (num) gsap.fromTo(num, { xPercent: -6 }, { xPercent: 6, ease: 'none', scrollTrigger: { trigger: v, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  // Footer: the wordmark rises letter by letter as the page closes
  var footMark = $$('[data-footer-mark] [data-wm]');
  if (footMark.length) {
    gsap.fromTo(footMark, { y: 0, yPercent: 100 }, {
      y: 0, yPercent: 0, ease: 'none', stagger: 0.06,
      scrollTrigger: { trigger: '[data-footer-mark]', start: 'top bottom', end: 'bottom bottom', scrub: 0.6 },
    });
  }

  // Fonts can shift layout after load — keep trigger positions accurate.
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { window.ScrollTrigger.refresh(); });
})();
