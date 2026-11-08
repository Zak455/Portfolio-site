/* FUZAIL. — interaction & motion (progressive enhancement throughout) */
(function () {
  'use strict';

  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var store = {
    get: function (k, s) { try { return (s ? sessionStorage : localStorage).getItem(k); } catch (e) { return null; } },
    set: function (k, v, s) { try { (s ? sessionStorage : localStorage).setItem(k, v); } catch (e) {} },
  };

  /* ── Top bar + menu ─────────────────────────────────────────────────── */
  var bar = $('[data-nav-root]');
  var menuBtn = $('[data-menu-btn]');
  var menuLabel = $('[data-menu-label]');
  var menu = $('[data-menu]');

  function setMenu(open) {
    bar.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    if (menuLabel) menuLabel.textContent = open ? 'Close' : 'Menu';
    document.body.classList.toggle('menu-open', open);
    if (open) {
      menu.hidden = false;
      var first = $('a', menu);
      if (first) setTimeout(function () { first.focus(); }, 150);
    } else {
      setTimeout(function () { if (!bar.classList.contains('is-open')) menu.hidden = true; }, 820);
    }
  }
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', function () { setMenu(!bar.classList.contains('is-open')); });
    $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) {
      if (!bar.classList.contains('is-open')) return;
      if (e.key === 'Escape') { setMenu(false); menuBtn.focus(); }
      if (e.key === 'Tab') {
        var items = [menuBtn].concat($$('a', menu));
        var i = items.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); items[items.length - 1].focus(); }
        else if (!e.shiftKey && i === items.length - 1) { e.preventDefault(); items[0].focus(); }
      }
    });
  }

  var lastY = window.scrollY, ticking = false;
  var navLinks = $$('[data-nav]');
  var sections = $$('[data-section]');
  function onScroll() {
    var y = window.scrollY;
    if (!bar.classList.contains('is-open')) bar.classList.toggle('is-hidden', y > lastY && y > window.innerHeight * 0.7 && !bar.contains(document.activeElement));
    lastY = y;
    var mark = window.innerHeight * 0.45, current = null;
    sections.forEach(function (s) { var r = s.getBoundingClientRect(); if (r.top <= mark && r.bottom > mark) current = s.getAttribute('data-section'); });
    navLinks.forEach(function (l) {
      var on = l.getAttribute('data-nav') === current;
      l.classList.toggle('is-active', on);
      if (on) l.setAttribute('aria-current', 'location'); else l.removeAttribute('aria-current');
    });
    ticking = false;
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* ── Layout grid toggle (like a design tool's Ctrl+G) ───────────────── */
  var gridBtn = $('[data-grid-toggle]');
  var gridState = $('[data-grid-state]');
  function syncGrid() {
    var on = root.classList.contains('show-grid');
    if (gridBtn) gridBtn.setAttribute('aria-pressed', String(on));
    if (gridState) gridState.textContent = on ? 'On' : 'Off';
  }
  if (gridBtn) {
    gridBtn.addEventListener('click', function () {
      root.classList.toggle('show-grid');
      store.set('fz-grid', root.classList.contains('show-grid') ? '1' : '0');
      syncGrid();
    });
    syncGrid();
  }

  /* ── Credentials filter ─────────────────────────────────────────────── */
  $$('[data-filter]').forEach(function (bar) {
    var tabs = $$('[data-filter-key]', bar);
    var items = $$('[data-type]', bar.parentNode);
    tabs.forEach(function (t) {
      t.addEventListener('click', function () {
        var key = t.getAttribute('data-filter-key');
        tabs.forEach(function (x) { x.setAttribute('aria-pressed', String(x === t)); });
        items.forEach(function (it) {
          var show = key === 'all' || it.getAttribute('data-type') === key;
          it.hidden = !show;
        });
        if (window.ScrollTrigger) window.ScrollTrigger.refresh();
      });
    });
  });

  /* ── Pointer light on work canvases ─────────────────────────────────── */
  if (finePointer) {
    $$('.work-visual').forEach(function (el) {
      var c = $('.work-canvas', el);
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        c.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%');
        c.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%');
      });
    });
  }

  /* ── Case study: before/after, TOC, progress ────────────────────────── */
  $$('[data-compare]').forEach(function (fig) {
    var range = $('.compare-range', fig), frame = $('.compare-frame', fig);
    var set = function () { frame.style.setProperty('--c', range.value + '%'); };
    range.addEventListener('input', set); set();
  });
  var tocLinks = $$('[data-toc]');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) tocLinks.forEach(function (l) { l.classList.toggle('is-active', l.getAttribute('data-toc') === en.target.id); });
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    $$('[data-cs-section]').forEach(function (s) { io.observe(s); });
    var progress = $('[data-cs-progress]'), content = $('.cs-content');
    if (progress && content) {
      var upd = function () {
        var r = content.getBoundingClientRect();
        progress.style.setProperty('--p', Math.min(1, Math.max(0, (window.innerHeight * 0.5 - r.top) / r.height)).toFixed(3));
      };
      window.addEventListener('scroll', function () { requestAnimationFrame(upd); }, { passive: true });
      upd();
    }
  }

  /* ── Motion ─────────────────────────────────────────────────────────── */
  if (reduce || !root.classList.contains('motion')) { window.__motion = true; return; }
  if (!window.gsap || !window.ScrollTrigger || root.classList.contains('motion-failed')) { root.classList.add('motion-failed'); return; }
  window.__motion = true;
  var gsap = window.gsap, ST = window.ScrollTrigger;
  gsap.registerPlugin(ST);
  var ease = 'expo.out';
  // CSS pre-hides with translate(%); GSAP reads that as px, so % tweens also zero x/y.

  // Intro splash: once per session, skippable with any click or key.
  var intro = $('[data-intro]');
  var heroDelay = 0.1;
  if (intro && root.classList.contains('intro-on')) {
    heroDelay = 0;
    var count = $('[data-intro-count]', intro), n = { v: 0 };
    var tl = gsap.timeline({
      onComplete: function () { root.classList.remove('intro-on'); store.set('fz-intro', '1', true); intro.remove(); heroIn(0); },
    });
    tl.fromTo($$('.intro-word .c', intro), { y: 0, yPercent: 105 }, { y: 0, yPercent: 0, duration: 0.9, stagger: 0.06, ease: ease }, 0.1)
      .fromTo($('.intro-mark', intro), { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: ease }, 0)
      .to($('.intro-band', intro), { clipPath: 'inset(0 0% 0 0)', duration: 1.1, ease: 'power2.inOut' }, 0.15)
      .to(n, { v: 100, duration: 1.1, ease: 'power2.inOut', onUpdate: function () { if (count) count.textContent = String(Math.round(n.v)).padStart(2, '0'); } }, 0.15)
      .to(intro, { yPercent: -100, duration: 0.85, ease: 'expo.inOut' }, 1.45);
    var skip = function () { tl.progress(1); };
    intro.addEventListener('click', skip);
    document.addEventListener('keydown', function k() { skip(); document.removeEventListener('keydown', k); });
  } else {
    heroIn(heroDelay);
  }

  function heroIn(d) {
    var t = gsap.timeline({ delay: d, defaults: { ease: ease } });
    var l = $('[data-name-l]'), r = $('[data-name-r]');
    if (l) t.fromTo(l, { x: 0, xPercent: -30, opacity: 0 }, { x: 0, xPercent: 0, opacity: 1, duration: 1.4 }, 0.1);
    if (r) t.fromTo(r, { x: 0, xPercent: 30, opacity: 0 }, { x: 0, xPercent: 0, opacity: 1, duration: 1.4 }, 0.1);
    var p = $('[data-portrait]');
    if (p) t.fromTo(p, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'expo.inOut' }, 0);
    var f = $$('[data-fade], [data-hero-fade]');
    if (f.length) t.fromTo(f, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 1, stagger: 0.08 }, 0.35);
    var lines = $$('[data-hero-line]');
    if (lines.length) t.fromTo(lines, { y: 0, yPercent: 105 }, { y: 0, yPercent: 0, duration: 1.2, stagger: 0.08 }, 0.05);
  }

  // Giant frame titles: characters rise in.
  $$('[data-giant]').forEach(function (g) {
    gsap.fromTo($$('.c', g), { y: 0, yPercent: 105 }, { y: 0, yPercent: 0, duration: 1.1, stagger: 0.035, ease: ease, scrollTrigger: { trigger: g, start: 'top 88%' } });
  });

  // Reading paragraph: words light up as you scroll through it.
  $$('[data-words]').forEach(function (p) {
    gsap.fromTo($$('.w', p), { opacity: 0.16 }, { opacity: 1, stagger: 0.05, ease: 'none', scrollTrigger: { trigger: p, start: 'top 80%', end: 'bottom 45%', scrub: 0.4 } });
  });

  // Pixel bands draw in from the left.
  $$('.band').forEach(function (b) {
    if (b.closest('.bar, .intro, .menu, [data-portrait], .work-visual')) return;
    gsap.fromTo(b, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 1.4, ease: 'power2.inOut', scrollTrigger: { trigger: b, start: 'top 95%' } });
  });

  // Generic reveals, batched.
  ST.batch('[data-reveal]:not([data-reveal="image"])', {
    start: 'top 92%', once: true,
    onEnter: function (els) { gsap.to(els, { opacity: 1, y: 0, duration: 1, ease: ease, stagger: 0.06, overwrite: true }); },
  });
  $$('[data-reveal="image"]').forEach(function (el) {
    gsap.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'expo.inOut', scrollTrigger: { trigger: el, start: 'top 86%', once: true } });
  });

  // Object parallax inside work canvases + case covers.
  $$('[data-parallax]').forEach(function (o) {
    gsap.fromTo(o, { yPercent: 8 }, { yPercent: -8, ease: 'none', scrollTrigger: { trigger: o.parentNode, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  // Footer: title lines settle, dot-matrix name scales up.
  var ft = $('.foot-title');
  if (ft) gsap.from(ft, { y: 40, opacity: 0, duration: 1.1, ease: ease, scrollTrigger: { trigger: ft, start: 'top 90%' } });
  var fm = $('[data-foot-mark]');
  if (fm) gsap.fromTo(fm, { scale: 0.92, opacity: 0.3 }, { scale: 1, opacity: 1, ease: 'none', scrollTrigger: { trigger: fm, start: 'top bottom', end: 'bottom bottom', scrub: 0.5 } });

  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ST.refresh(); });
})();
