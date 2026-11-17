/* Vidhi Halarnkar · portfolio interactions (no build step, no framework).
   Everything here is progressive enhancement: the page reads fine without JS,
   and all motion switches off for prefers-reduced-motion or the footer toggle. */
(function () {
  'use strict';
  var root = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  function readPref() { try { return localStorage.getItem('vh-motion'); } catch (e) { return null; } }
  function motionOn() { var p = readPref(); return p ? p === 'on' : !reduced; }
  function applyMotion() { root.classList.toggle('motion', motionOn()); }
  applyMotion();

  /* ── Split letters (hero name + contact title) ─────────────── */
  var letterIndex = 0;
  $$('[data-letters]').forEach(function (el) {
    var text = el.textContent;
    el.setAttribute('aria-hidden', 'true');
    el.textContent = '';
    Array.prototype.forEach.call(text, function (ch) {
      if (ch === ' ') { el.appendChild(document.createTextNode(' ')); return; }
      var s = document.createElement('span');
      s.className = 'ltr';
      s.textContent = ch;
      s.style.setProperty('--i', letterIndex++);
      el.appendChild(s);
    });
  });
  // Contact title letters shouldn't drop on load; only hero ones do.
  $$('.contact .ltr').forEach(function (l) { l.style.animation = 'none'; });
  requestAnimationFrame(function () { document.body.classList.add('is-loaded'); });

  // Letters boing on hover / tap.
  function boing(l) {
    if (!root.classList.contains('motion')) return;
    l.classList.remove('boing'); void l.offsetWidth; l.classList.add('boing');
  }
  $$('.ltr').forEach(function (l) {
    l.addEventListener('mouseenter', function () { boing(l); });
    l.addEventListener('click', function () { boing(l); });
    l.addEventListener('animationend', function (e) { if (e.animationName === 'boing') l.classList.remove('boing'); });
  });

  /* ── Rotating role word ─────────────────────────────────────── */
  var words = ['scroll-stopping posts', 'reels people replay', 'flyers that get picked up', 'posters with punch', 'brands that feel friendly'];
  var rw = $('.rotator-word');
  if (rw) {
    var wi = 0;
    setInterval(function () {
      if (!root.classList.contains('motion')) return;
      rw.classList.add('out');
      setTimeout(function () {
        wi = (wi + 1) % words.length;
        rw.textContent = words[wi];
        rw.classList.remove('out'); rw.classList.add('in');
        void rw.offsetWidth;
        rw.classList.remove('in');
      }, 380);
    }, 2600);
  }

  /* ── Draggable stickers ─────────────────────────────────────── */
  $$('.sticker.drag').forEach(function (st, i) {
    var rot = parseFloat(st.dataset.rot || 0);
    var x = 0, y = 0, sx, sy, ox, oy, dragging = false;
    st.style.setProperty('--r', rot + 'deg');
    st.style.setProperty('--d', (i * -1.1) + 's');
    st.classList.add('float');
    function set() { st.style.transform = 'translate(' + x + 'px,' + y + 'px) rotate(' + rot + 'deg)'; }
    st.addEventListener('pointerdown', function (e) {
      dragging = true; st.setPointerCapture(e.pointerId);
      sx = e.clientX; sy = e.clientY; ox = x; oy = y;
      st.classList.add('dragging'); st.classList.remove('float');
    });
    st.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      x = ox + e.clientX - sx; y = oy + e.clientY - sy;
      rot = Math.max(-25, Math.min(25, (e.clientX - sx) / 8));
      set();
    });
    function up() {
      if (!dragging) return;
      dragging = false; st.classList.remove('dragging');
      rot = parseFloat(st.dataset.rot || 0) + (Math.random() * 10 - 5);
      st.style.transition = 'transform .5s cubic-bezier(.34,1.56,.64,1)';
      set();
      setTimeout(function () { st.style.transition = ''; }, 500);
    }
    st.addEventListener('pointerup', up);
    st.addEventListener('pointercancel', up);
  });

  /* ── Polaroid tilt ──────────────────────────────────────────── */
  var tilt = $('.tilt');
  if (tilt && finePointer) {
    var art = $('.hero-art');
    art.addEventListener('pointermove', function (e) {
      if (!root.classList.contains('motion')) return;
      var r = art.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
      tilt.style.transform = 'rotate(3deg) rotateY(' + (px * 16) + 'deg) rotateX(' + (-py * 16) + 'deg)';
    });
    art.addEventListener('pointerleave', function () { tilt.style.transform = ''; });
  }

  /* ── Custom cursor + sparkles ───────────────────────────────── */
  var cursor = $('.cursor');
  if (cursor && finePointer) {
    root.classList.add('has-cursor');
    var label = $('.cursor-label');
    var cx = -100, cy = -100, tx = -100, ty = -100, lastSpark = 0;
    var sparks = ['✦', '✺', '●', '★', '♥'];
    var colors = ['#DB1E6C', '#FFC93C', '#2FA866', '#7BC4FF', '#FFA8CB'];
    window.addEventListener('pointermove', function (e) {
      tx = e.clientX; ty = e.clientY;
      var now = performance.now();
      if (root.classList.contains('motion') && now - lastSpark > 70 && !cursor.classList.contains('is-big')) {
        lastSpark = now;
        var s = document.createElement('span');
        s.className = 'spark';
        s.textContent = sparks[Math.floor(Math.random() * sparks.length)];
        s.style.color = colors[Math.floor(Math.random() * colors.length)];
        s.style.left = e.clientX + 'px'; s.style.top = e.clientY + 'px';
        s.style.setProperty('--dx', (Math.random() * 40 - 20) + 'px');
        s.style.setProperty('--dy', (Math.random() * 30 + 10) + 'px');
        document.body.appendChild(s);
        setTimeout(function () { s.remove(); }, 800);
      }
    });
    (function loop() {
      cx += (tx - cx) * .22; cy += (ty - cy) * .22;
      cursor.style.transform = 'translate(' + cx + 'px,' + cy + 'px)';
      requestAnimationFrame(loop);
    })();
    var labelFor = function (el) {
      if (el.closest('.sticker')) return 'drag me';
      if (el.closest('.project-cover')) return 'ooh';
      if (el.closest('.chip-x')) return 'throw!';
      if (el.closest('.copy-email')) return 'copy';
      return '';
    };
    document.addEventListener('pointerover', function (e) {
      var t = e.target.closest('a, button, .sticker, .project-cover, .chip-x');
      cursor.classList.toggle('is-big', !!t);
      label.textContent = t ? (labelFor(t) || (t.tagName === 'A' ? 'go' : 'click')) : '';
    });
  }

  /* ── Magnetic buttons ───────────────────────────────────────── */
  if (finePointer) {
    $$('.magnetic').forEach(function (b) {
      b.addEventListener('pointermove', function (e) {
        if (!root.classList.contains('motion')) return;
        var r = b.getBoundingClientRect();
        b.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * .25) + 'px,' + ((e.clientY - r.top - r.height / 2) * .35) + 'px)';
      });
      b.addEventListener('pointerleave', function () { b.style.transform = ''; });
    });
  }

  /* ── Scroll: progress, reveals, lit words, timeline ball ────── */
  var bar = $('.progress span');
  var tl = $('.timeline'), ball = $('.tl-ball');
  var lead = $('[data-words]');
  if (lead) {
    var ws = lead.textContent.split(/\s+/);
    lead.innerHTML = ws.map(function (w) { return '<span class="word">' + w.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</span>'; }).join(' ');
  }
  var wordEls = $$('.word');
  function onScroll() {
    var h = document.documentElement.scrollHeight - innerHeight;
    if (bar) bar.style.transform = 'scaleX(' + (h > 0 ? scrollY / h : 0) + ')';
    if (lead && root.classList.contains('motion')) {
      var r = lead.getBoundingClientRect();
      var p = Math.min(1, Math.max(0, (innerHeight * .85 - r.top) / (r.height + innerHeight * .35)));
      var n = Math.round(p * wordEls.length);
      wordEls.forEach(function (w, i) { w.classList.toggle('lit', i < n); });
    }
    if (tl && ball) {
      var tr = tl.getBoundingClientRect();
      var tp = Math.min(1, Math.max(0, (innerHeight * .6 - tr.top) / tr.height));
      var y = tp * (tr.height - 28);
      ball.style.setProperty('--y', y + 'px');
      ball.style.setProperty('--rot', (y * 3) + 'deg');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { threshold: .15 });
    $$('[data-reveal]').forEach(function (el) { io.observe(el); });
  } else {
    $$('[data-reveal]').forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ── Skills pit physics (Matter.js) ─────────────────────────── */
  var pit = $('#pit');
  var pitStarted = false;
  function startPit() {
    if (pitStarted || !window.Matter || !root.classList.contains('motion')) return;
    pitStarted = true;
    var M = window.Matter, chips = $$('.chip-x', pit);
    var W = pit.clientWidth, H = pit.clientHeight;
    var sizes = chips.map(function (c) { return { w: c.offsetWidth, h: c.offsetHeight }; });
    pit.classList.add('physics');
    var engine = M.Engine.create({ gravity: { y: 1.1 } });
    var wallOpts = { isStatic: true };
    var t = 200;
    M.Composite.add(engine.world, [
      M.Bodies.rectangle(W / 2, H + t / 2, W * 3, t, wallOpts),
      M.Bodies.rectangle(-t / 2, H / 2, t, H * 6, wallOpts),
      M.Bodies.rectangle(W + t / 2, H / 2, t, H * 6, wallOpts)
    ]);
    var bodies = chips.map(function (c, i) {
      var s = sizes[i];
      var b = M.Bodies.rectangle(40 + Math.random() * Math.max(10, W - 80 - s.w) + s.w / 2, -60 - i * 70, s.w, s.h, {
        chamfer: { radius: s.h / 2 }, restitution: .55, friction: .3, angle: (Math.random() - .5) * .8
      });
      return b;
    });
    M.Composite.add(engine.world, bodies);
    var mouse = M.Mouse.create(pit);
    // Let the page scroll with the wheel over the pit.
    mouse.element.removeEventListener('mousewheel', mouse.mousewheel);
    mouse.element.removeEventListener('DOMMouseScroll', mouse.mousewheel);
    mouse.element.removeEventListener('wheel', mouse.mousewheel);
    var mc = M.MouseConstraint.create(engine, { mouse: mouse, constraint: { stiffness: .18, render: { visible: false } } });
    M.Composite.add(engine.world, mc);
    // Touch: let vertical swipes scroll the page unless a chip is grabbed.
    mouse.element.removeEventListener('touchmove', mouse.mousemove);
    mouse.element.addEventListener('touchmove', function (e) { if (mc.body) { e.preventDefault(); mouse.mousemove(e); } }, { passive: false });
    // Click a chip to make it jump.
    M.Events.on(mc, 'mousedown', function () {
      var hit = M.Query.point(bodies, mouse.position)[0];
      if (hit) M.Body.setVelocity(hit, { x: (Math.random() - .5) * 8, y: -12 });
    });
    var last = performance.now();
    (function step(now) {
      var dt = Math.min(32, now - last); last = now;
      if (root.classList.contains('motion')) M.Engine.update(engine, dt);
      bodies.forEach(function (b, i) {
        var s = sizes[i];
        chips[i].style.transform = 'translate(' + (b.position.x - s.w / 2) + 'px,' + (b.position.y - s.h / 2) + 'px) rotate(' + b.angle + 'rad)';
      });
      requestAnimationFrame(step);
    })(last);
  }
  if (pit && 'IntersectionObserver' in window) {
    var pio = new IntersectionObserver(function (en) {
      if (en[0].isIntersecting) { if (window.Matter) startPit(); else window.addEventListener('load', startPit); pio.disconnect(); }
    }, { threshold: .3 });
    pio.observe(pit);
  }

  /* ── Confetti + copy email ──────────────────────────────────── */
  var canvas = $('.confetti'), ctx = canvas && canvas.getContext('2d'), bits = [];
  function burst(x, y) {
    if (!ctx || !root.classList.contains('motion')) return;
    var r = canvas.getBoundingClientRect();
    canvas.width = r.width * devicePixelRatio; canvas.height = r.height * devicePixelRatio;
    var cols = ['#DB1E6C', '#FFC93C', '#2FA866', '#7BC4FF', '#FFA8CB', '#FFF1F5'];
    for (var i = 0; i < 140; i++) {
      bits.push({ x: (x - r.left) * devicePixelRatio, y: (y - r.top) * devicePixelRatio, vx: (Math.random() - .5) * 22, vy: -Math.random() * 22 - 6, s: (Math.random() * 8 + 6) * devicePixelRatio, c: cols[i % cols.length], r: Math.random() * 6, vr: (Math.random() - .5) * .4, life: 0, circle: Math.random() < .35 });
    }
    if (bits.length === 140) requestAnimationFrame(draw);
  }
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    bits = bits.filter(function (b) { return b.life < 160 && b.y < canvas.height + 40; });
    bits.forEach(function (b) {
      b.life++; b.vy += .55; b.vx *= .985; b.x += b.vx; b.y += b.vy; b.r += b.vr;
      ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(b.r); ctx.fillStyle = b.c;
      if (b.circle) { ctx.beginPath(); ctx.arc(0, 0, b.s / 2, 0, 7); ctx.fill(); } else ctx.fillRect(-b.s / 2, -b.s / 4, b.s, b.s / 2);
      ctx.restore();
    });
    if (bits.length) requestAnimationFrame(draw); else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  var copyBtn = $('.copy-email'), toast = $('.toast');
  if (copyBtn) {
    copyBtn.addEventListener('click', function (e) {
      var email = copyBtn.dataset.email;
      var done = function () { toast.textContent = 'copied! talk soon ✌'; setTimeout(function () { toast.textContent = ''; }, 2600); };
      if (navigator.clipboard) navigator.clipboard.writeText(email).then(done, function () { location.href = 'mailto:' + email; });
      else location.href = 'mailto:' + email;
      burst(e.clientX || innerWidth / 2, e.clientY || innerHeight / 2);
    });
  }

  /* ── Motion toggle ──────────────────────────────────────────── */
  var mt = $('.motion-toggle');
  function syncToggle() { if (!mt) return; var on = root.classList.contains('motion'); mt.setAttribute('aria-pressed', String(on)); mt.querySelector('b').textContent = on ? 'On' : 'Off'; }
  if (mt) {
    syncToggle();
    mt.addEventListener('click', function () {
      var on = !root.classList.contains('motion');
      try { localStorage.setItem('vh-motion', on ? 'on' : 'off'); } catch (e) {}
      applyMotion(); syncToggle();
      $$('[data-reveal]').forEach(function (el) { el.classList.add('is-in'); });
      if (on) startPit();
    });
  }
})();
