// Navigation, small interactions and gentle fade-ins. No dependencies.
(function () {
  'use strict';
  window.__ready = true;
  var d = document;
  var $ = function (s, r) { return (r || d).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); };

  /* ── Mobile menu ──────────────────────────────────────────────────────── */
  var btn = $('[data-menu-btn]'), menu = $('[data-menu]'), label = $('[data-menu-label]');
  function setMenu(open) {
    if (!btn || !menu) return;
    btn.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('is-open', open);
    if (label) label.textContent = open ? 'Close menu' : 'Open menu';
  }
  if (btn) {
    btn.addEventListener('click', function () { setMenu(btn.getAttribute('aria-expanded') !== 'true'); });
    $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    d.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && btn.getAttribute('aria-expanded') === 'true') { setMenu(false); btn.focus(); }
    });
    window.matchMedia('(min-width: 860px)').addEventListener('change', function (m) { if (m.matches) setMenu(false); });
  }

  /* ── Nav border on scroll + active section ─────────────────────────────── */
  var nav = $('[data-nav-root]');
  function onScroll() { if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 8); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  var links = $$('[data-nav]');
  if ('IntersectionObserver' in window && links.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var id = en.target.getAttribute('data-section');
        links.forEach(function (l) {
          var on = l.getAttribute('data-nav') === id;
          l.classList.toggle('is-active', on);
          if (on) l.setAttribute('aria-current', 'true'); else l.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('[data-section]').forEach(function (s) { io.observe(s); });
  }

  /* ── Fade-ins ─────────────────────────────────────────────────────────── */
  var fades = $$('[data-fade]');
  if (d.documentElement.classList.contains('motion') && 'IntersectionObserver' in window) {
    var fo = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); fo.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    fades.forEach(function (el) { fo.observe(el); });
  } else {
    fades.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ── Credentials filter ───────────────────────────────────────────────── */
  var filter = $('[data-filter]');
  if (filter) {
    var tabs = $$('[data-filter-key]', filter);
    tabs.forEach(function (t) {
      t.addEventListener('click', function () {
        var key = t.getAttribute('data-filter-key');
        tabs.forEach(function (o) { o.setAttribute('aria-pressed', String(o === t)); });
        $$('.cred').forEach(function (c) { c.hidden = key !== 'all' && c.getAttribute('data-type') !== key; });
      });
    });
  }

  /* ── Copy email ───────────────────────────────────────────────────────── */
  $$('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var text = b.getAttribute('data-copy'), lab = $('[data-copy-label]', b) || b;
      var done = function () { lab.textContent = 'Copied!'; setTimeout(function () { lab.textContent = 'Copy email'; }, 1800); };
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, function () { lab.textContent = text; });
      else lab.textContent = text;
    });
  });

  /* ── Before / after slider ────────────────────────────────────────────── */
  $$('[data-compare]').forEach(function (c) {
    var r = $('.compare-range', c), before = $('.compare-before', c), h = $('.compare-handle', c);
    if (!r) return;
    var set = function () { before.style.clipPath = 'inset(0 ' + (100 - r.value) + '% 0 0)'; h.style.left = r.value + '%'; };
    r.addEventListener('input', set); set();
  });

  /* ── Case study: active section + reading progress ────────────────────── */
  var toc = $$('[data-toc]'), prog = $('[data-cs-progress]'), content = $('.cs-content');
  if (toc.length && 'IntersectionObserver' in window) {
    var to = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        toc.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('data-toc') === en.target.id); });
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    $$('[data-cs-section]').forEach(function (s) { to.observe(s); });
  }
  if (prog && content) {
    var upd = function () {
      var r = content.getBoundingClientRect(), total = r.height - window.innerHeight * 0.5;
      var p = Math.min(1, Math.max(0, (window.innerHeight * 0.3 - r.top) / Math.max(1, total)));
      prog.style.width = (p * 100).toFixed(1) + '%';
    };
    upd(); window.addEventListener('scroll', upd, { passive: true });
  }

  /* ═══ Advanced layer ═════════════════════════════════════════════════ */
  var root = d.documentElement;
  var motionOn = function () { return root.classList.contains('motion'); };
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* Live Goa time */
  var clocks = $$('[data-clock]');
  function tick() {
    try {
      var t = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Kolkata' }).format(new Date());
      clocks.forEach(function (c) { c.textContent = t + ' IST'; });
    } catch (e) {}
  }
  if (clocks.length) { tick(); setInterval(tick, 30000); }

  /* Scroll progress (nav bar) + scroll-lit statement */
  var bar = $('[data-progress]');
  var scrub = $('[data-scrub]'), words = scrub ? $$('.w', scrub) : [];
  var ticking = false;
  function onFrame() {
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
  function req() { if (!ticking) { ticking = true; requestAnimationFrame(onFrame); } }
  window.addEventListener('scroll', req, { passive: true });
  window.addEventListener('resize', req);
  onFrame();

  /* Hero spotlight follows the pointer */
  var spot = $('[data-spotlight]');
  if (spot && fine) {
    spot.addEventListener('pointermove', function (e) {
      if (!motionOn()) return;
      var r = spot.getBoundingClientRect();
      spot.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
      spot.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
    });
  }

  /* Pointer glow on dark service cards */
  $$('[data-glow]').forEach(function (c) {
    c.addEventListener('pointermove', function (e) {
      var r = c.getBoundingClientRect();
      c.style.setProperty('--gx', (e.clientX - r.left) + 'px');
      c.style.setProperty('--gy', (e.clientY - r.top) + 'px');
    });
  });

  /* Magnetic buttons */
  if (fine) {
    $$('[data-magnetic]').forEach(function (b) {
      b.addEventListener('pointermove', function (e) {
        if (!motionOn()) return;
        var r = b.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * 0.22, y = (e.clientY - r.top - r.height / 2) * 0.3;
        b.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
      });
      b.addEventListener('pointerleave', function () { b.style.transform = ''; });
    });
  }

  /* Cursor label over project visuals */
  var cur = $('[data-cursor-el]'), curLabel = $('[data-cursor-label]');
  if (cur && fine) {
    var cx = 0, cy = 0, tx = 0, ty = 0, running = false;
    var loop = function () {
      cx += (tx - cx) * 0.2; cy += (ty - cy) * 0.2;
      cur.style.transform = 'translate(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px)';
      if (Math.abs(tx - cx) + Math.abs(ty - cy) > 0.5) requestAnimationFrame(loop); else running = false;
    };
    d.addEventListener('pointermove', function (e) {
      tx = e.clientX; ty = e.clientY;
      if (!running) { running = true; requestAnimationFrame(loop); }
    }, { passive: true });
    $$('[data-cursor]').forEach(function (el) {
      el.addEventListener('pointerenter', function () { curLabel.textContent = el.getAttribute('data-cursor'); cur.classList.add('is-on'); });
      el.addEventListener('pointerleave', function () { cur.classList.remove('is-on'); });
    });
  }

  /* Count-up numbers in the bento */
  var counters = $$('[data-count]');
  if (counters.length && motionOn() && 'IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
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

  /* Motion switch (footer), remembered on this device */
  var mt = $('[data-motion-toggle]'), ms = $('[data-motion-state]');
  function syncMotionBtn() {
    if (!mt) return;
    var on = motionOn();
    mt.setAttribute('aria-pressed', String(on));
    ms.textContent = on ? 'On' : 'Off';
  }
  if (mt) {
    syncMotionBtn();
    mt.addEventListener('click', function () {
      var on = !motionOn();
      try { localStorage.setItem('fz-motion', on ? 'on' : 'off'); } catch (e) {}
      root.classList.toggle('motion', on && !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
      $$('[data-fade]').forEach(function (el) { el.classList.add('is-in'); });
      if (!motionOn()) { words.forEach(function (w) { w.classList.add('is-lit'); }); if (cur) cur.classList.remove('is-on'); }
      else onFrame();
      syncMotionBtn();
    });
  }

  /* Motion graphics play only while visible */
  var mgs = $$('[data-mg]');
  if (mgs.length && 'IntersectionObserver' in window) {
    var mo = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { en.target.classList.toggle('is-playing', en.isIntersecting); });
    }, { rootMargin: '0px 0px -10% 0px' });
    mgs.forEach(function (m) { mo.observe(m); });
  } else {
    mgs.forEach(function (m) { m.classList.add('is-playing'); });
  }
})();
