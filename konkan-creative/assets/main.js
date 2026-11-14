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
})();
