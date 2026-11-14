// Konkan Creative: small interactions, no dependencies.
(function () {
  'use strict';
  window.__ready = true;

  // ── WhatsApp ───────────────────────────────────────────────────────────
  // Put your WhatsApp number here, with country code and no + or spaces,
  // e.g. '919876543210'. While it is empty, every chat button falls back
  // to email and the WhatsApp icon stays hidden.
  var WHATSAPP = '';

  var d = document, root = d.documentElement;
  var $ = function (s, r) { return (r || d).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); };

  if (WHATSAPP) {
    $$('.js-wa').forEach(function (a) {
      var text = a.getAttribute('data-wa-text') || 'Hi Fuzail';
      a.href = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(text + ' ');
      a.target = '_blank'; a.rel = 'noopener';
      a.classList.add('is-wa');
      var l = $('.js-wa-label', a);
      if (l) l.textContent = a.getAttribute('data-wa-label') || 'Chat on WhatsApp';
      if (a.classList.contains('wa-float')) a.setAttribute('aria-label', 'Chat on WhatsApp');
    });
  }

  // ── Menu ───────────────────────────────────────────────────────────────
  var btn = $('[data-menu-btn]'), menu = $('[data-menu]'), lab = $('[data-menu-label]');
  function setMenu(open) {
    btn.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('is-open', open);
    lab.textContent = open ? 'Close menu' : 'Open menu';
  }
  if (btn && menu) {
    btn.addEventListener('click', function () { setMenu(btn.getAttribute('aria-expanded') !== 'true'); });
    $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') { setMenu(false); btn.focus(); } });
  }

  // ── Nav border ─────────────────────────────────────────────────────────
  var nav = $('[data-nav]');
  var onScroll = function () { nav.classList.toggle('is-scrolled', window.scrollY > 8); };
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

  // ── Fade-ins and scene playback ────────────────────────────────────────
  var fades = $$('[data-fade]');
  if (root.classList.contains('motion') && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    fades.forEach(function (f) { io.observe(f); });
    var scene = $('.scene');
    if (scene) new IntersectionObserver(function (es) { es.forEach(function (e) { scene.classList.toggle('is-playing', e.isIntersecting); }); }).observe(scene);
  } else {
    fades.forEach(function (f) { f.classList.add('is-in'); });
  }

  // ── Motion switch ──────────────────────────────────────────────────────
  var mt = $('[data-motion-toggle]'), ms = $('[data-motion-state]');
  function sync() { var on = root.classList.contains('motion'); mt.setAttribute('aria-pressed', String(on)); ms.textContent = on ? 'On' : 'Off'; }
  if (mt) {
    sync();
    mt.addEventListener('click', function () {
      var on = !root.classList.contains('motion');
      try { localStorage.setItem('kc-motion', on ? 'on' : 'off'); } catch (e) {}
      root.classList.toggle('motion', on && !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
      fades.forEach(function (f) { f.classList.add('is-in'); });
      var sc = $('.scene'); if (sc) sc.classList.add('is-playing');
      sync();
    });
  }

  var y = $('[data-year]'); if (y) y.textContent = new Date().getFullYear();

  // ═══ Advanced layer ═══════════════════════════════════════════════════
  var motionOn = function () { return root.classList.contains('motion'); };
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Live Goa time
  var clocks = $$('[data-clock]');
  function tick() {
    try {
      var t = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' }).format(new Date());
      clocks.forEach(function (c) { c.textContent = t + ' IST'; });
    } catch (e) {}
  }
  if (clocks.length) { tick(); setInterval(tick, 30000); }

  // Scroll-lit statement: split into words
  var scrub = $('[data-scrub]'), words = [];
  if (scrub) {
    scrub.innerHTML = scrub.textContent.trim().split(/\s+/).map(function (w) { return '<span class="w">' + w + '</span>'; }).join(' ');
    words = $$('.w', scrub);
  }

  // Progress bar + statement
  var bar = $('[data-progress]'), ticking = false;
  function frame() {
    ticking = false;
    var max = d.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.setProperty('--p', max > 0 ? (window.scrollY / max).toFixed(4) : 0);
    if (words.length && motionOn()) {
      var r = scrub.getBoundingClientRect(), vh = window.innerHeight;
      var p = (vh * 0.85 - r.top) / (r.height + vh * 0.35);
      var lit = Math.round(Math.min(1, Math.max(0, p)) * words.length);
      for (var i = 0; i < words.length; i++) words[i].classList.toggle('is-lit', i < lit);
    }
  }
  function req() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener('scroll', req, { passive: true });
  window.addEventListener('resize', req);
  frame();

  // Sun spotlight follows the pointer in the hero
  var spot = $('[data-spotlight]');
  if (spot && fine) {
    spot.addEventListener('pointermove', function (e) {
      if (!motionOn()) return;
      var r = spot.getBoundingClientRect();
      spot.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
      spot.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
    });
  }

  // Glow on service cards
  $$('[data-glow]').forEach(function (c) {
    c.addEventListener('pointermove', function (e) {
      var r = c.getBoundingClientRect();
      c.style.setProperty('--gx', (e.clientX - r.left) + 'px');
      c.style.setProperty('--gy', (e.clientY - r.top) + 'px');
    });
  });

  // Magnetic buttons
  if (fine) {
    $$('[data-magnetic]').forEach(function (b) {
      b.addEventListener('pointermove', function (e) {
        if (!motionOn()) return;
        var r = b.getBoundingClientRect();
        b.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * 0.22).toFixed(1) + 'px,' + ((e.clientY - r.top - r.height / 2) * 0.3).toFixed(1) + 'px)';
      });
      b.addEventListener('pointerleave', function () { b.style.transform = ''; });
    });
  }

  // Cursor label over service cards
  var cur = $('[data-cursor-el]'), curLabel = $('[data-cursor-label]');
  if (cur && fine) {
    var cx = 0, cy = 0, tx = 0, ty = 0, running = false;
    var loop = function () {
      cx += (tx - cx) * 0.2; cy += (ty - cy) * 0.2;
      cur.style.transform = 'translate(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px)';
      if (Math.abs(tx - cx) + Math.abs(ty - cy) > 0.5) requestAnimationFrame(loop); else running = false;
    };
    d.addEventListener('pointermove', function (e) { tx = e.clientX; ty = e.clientY; if (!running) { running = true; requestAnimationFrame(loop); } }, { passive: true });
    $$('.svc').forEach(function (card) {
      var link = $('[data-cursor]', card);
      if (!link) return;
      card.addEventListener('pointerenter', function () { curLabel.textContent = link.getAttribute('data-cursor'); cur.classList.add('is-on'); });
      card.addEventListener('pointerleave', function () { cur.classList.remove('is-on'); });
    });
  }

  // Count-up numbers
  var counters = $$('[data-count]');
  if (counters.length && motionOn() && 'IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        co.unobserve(en.target);
        var el = en.target, end = +el.getAttribute('data-count'), start = end > 1000 ? end - 12 : 0, t0 = null;
        var step = function (t) {
          if (!t0) t0 = t;
          var k = Math.min(1, (t - t0) / 1100), e = 1 - Math.pow(1 - k, 3);
          el.textContent = Math.round(start + (end - start) * e);
          if (k < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { co.observe(c); });
  }

  // Keep the motion switch in step with the new effects
  if (mt) mt.addEventListener('click', function () {
    if (!motionOn()) { words.forEach(function (w) { w.classList.add('is-lit'); }); if (cur) cur.classList.remove('is-on'); }
    else frame();
  });
})();
