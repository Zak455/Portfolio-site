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
})();
