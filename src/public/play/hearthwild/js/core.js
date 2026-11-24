// Hearthwild — core: canvas, loop, input, tweening, maths, particles.
'use strict';

const TAU = Math.PI * 2;
const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
const lerp = (a, b, t) => a + (b - a) * t;
const ilerp = (a, b, v) => clamp((v - a) / (b - a));
const smooth = (t) => t * t * (3 - 2 * t);
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const easeBack = (t) => { const c = 1.70158, c3 = c + 1; return 1 + c3 * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
const dist = (ax, ay, bx, by) => Math.hypot(ax - bx, ay - by);
const rand = (a = 0, b = 1) => a + Math.random() * (b - a);
const pick = (arr) => arr[(Math.random() * arr.length) | 0];

// Seeded RNG so landscapes are the same every visit.
function rng(seed) {
  let s = seed >>> 0 || 1;
  const f = () => { s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
  f.r = (a = 0, b = 1) => a + f() * (b - a);
  f.pick = (arr) => arr[(f() * arr.length) | 0];
  return f;
}

// ── Colour helpers ──────────────────────────────────────────────────────────
function hex(c) { const n = parseInt(c.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
function mix(a, b, t) {
  const A = hex(a), B = hex(b);
  const r = (i) => Math.round(lerp(A[i], B[i], t)).toString(16).padStart(2, '0');
  return '#' + r(0) + r(1) + r(2);
}
function rgba(c, a) { const [r, g, b] = hex(c); return `rgba(${r},${g},${b},${a})`; }

// ── Canvas ──────────────────────────────────────────────────────────────────
const G = {
  cv: null, cx: null, W: 0, H: 0, dpr: 1, t: 0, dt: 0,
  scene: null, next: null, fade: 0, fading: 0,
  pointer: { x: 0, y: 0, down: false, id: null, sx: 0, sy: 0, moved: 0 },
  hooks: [],
};

function makeCanvas(w, h, scale = 1) {
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.ceil(w * scale));
  c.height = Math.max(1, Math.ceil(h * scale));
  const x = c.getContext('2d');
  x.scale(scale, scale);
  c.lw = w; c.lh = h; c.s = scale;
  return c;
}

function resize() {
  const vw = window.innerWidth, vh = window.innerHeight;
  G.dpr = Math.min(window.devicePixelRatio || 1, 2);
  G.W = vw; G.H = vh;
  G.cv.width = Math.round(vw * G.dpr);
  G.cv.height = Math.round(vh * G.dpr);
  G.cv.style.width = vw + 'px';
  G.cv.style.height = vh + 'px';
  if (G.scene && G.scene.resize) G.scene.resize();
}

// Scene switching with a warm cross-fade through the veil element.
function go(scene, opts = {}) {
  const veil = document.getElementById('veil');
  const swap = () => {
    if (G.scene && G.scene.exit) G.scene.exit();
    G.scene = scene;
    if (scene.resize) scene.resize();
    if (scene.enter) scene.enter();
    requestAnimationFrame(() => veil.classList.remove('on'));
  };
  if (opts.instant || !G.scene) { swap(); return; }
  veil.style.background = opts.color || '';
  veil.classList.add('on');
  setTimeout(swap, opts.ms || 650);
}

function loop(now) {
  const t = now / 1000;
  G.dt = Math.min(0.05, G.t ? t - G.t : 0.016);
  G.t = t;
  const c = G.cx;
  c.setTransform(G.dpr, 0, 0, G.dpr, 0, 0);
  if (G.scene) {
    G.scene.update && G.scene.update(G.dt);
    G.scene.draw && G.scene.draw(c);
  }
  for (const h of G.hooks) h(G.dt);
  requestAnimationFrame(loop);
}

function initCanvas() {
  G.cv = document.getElementById('cv');
  G.cx = G.cv.getContext('2d');
  resize();
  window.addEventListener('resize', resize);
  const P = G.pointer;
  const pos = (e) => { const r = G.cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  G.cv.addEventListener('pointerdown', (e) => {
    if (P.id !== null && P.id !== e.pointerId) return;
    P.id = e.pointerId;
    try { G.cv.setPointerCapture(e.pointerId); } catch (_) {}
    const [x, y] = pos(e);
    P.x = P.sx = x; P.y = P.sy = y; P.down = true; P.moved = 0; P.t0 = G.t;
    Audio2.unlock();
    G.scene && G.scene.down && G.scene.down(x, y, e);
    e.preventDefault();
  });
  G.cv.addEventListener('pointermove', (e) => {
    const [x, y] = pos(e);
    if (P.id !== null && e.pointerId !== P.id) return;
    P.moved += Math.hypot(x - P.x, y - P.y);
    P.x = x; P.y = y;
    G.scene && G.scene.move && G.scene.move(x, y, e);
  });
  const up = (e) => {
    if (e.pointerId !== P.id) return;
    const [x, y] = pos(e);
    P.down = false; P.id = null;
    G.scene && G.scene.up && G.scene.up(x, y, e);
  };
  G.cv.addEventListener('pointerup', up);
  G.cv.addEventListener('pointercancel', up);
  requestAnimationFrame(loop);
}

// ── Tweens & timers ─────────────────────────────────────────────────────────
const Tw = {
  list: [],
  to(obj, props, dur, ease = easeOut, delay = 0) {
    return new Promise((res) => {
      const from = {};
      for (const k in props) from[k] = obj[k];
      this.list.push({ obj, props, from, dur, ease, t: -delay, res });
    });
  },
  wait(s) { return new Promise((res) => this.list.push({ dur: s, t: 0, res, obj: null })); },
  update(dt) {
    for (let i = this.list.length - 1; i >= 0; i--) {
      const w = this.list[i];
      w.t += dt;
      if (w.t < 0) continue;
      const k = clamp(w.t / w.dur);
      if (w.obj) { const e = w.ease(k); for (const p in w.props) w.obj[p] = lerp(w.from[p], w.props[p], e); }
      if (k >= 1) { this.list.splice(i, 1); w.res(); }
    }
  },
  clear() { this.list.length = 0; },
};
G.hooks.push((dt) => Tw.update(dt));

// ── Particles ───────────────────────────────────────────────────────────────
// Each particle: {x,y,vx,vy,life,max,size,color,kind,rot,vr,g,drag,add}
class Particles {
  constructor() { this.p = []; }
  add(o) { this.p.push(Object.assign({ vx: 0, vy: 0, life: 1, max: 1, size: 3, rot: 0, vr: 0, g: 0, drag: 0.98, a: 1, kind: 'dot', color: '#fff' }, o, { max: o.life || 1 })); }
  burst(x, y, n, f) { for (let i = 0; i < n; i++) this.add(f(i, x, y)); }
  update(dt) {
    const P = this.p;
    for (let i = P.length - 1; i >= 0; i--) {
      const q = P[i];
      q.life -= dt;
      if (q.life <= 0) { P.splice(i, 1); continue; }
      q.vy += q.g * dt;
      const d = Math.pow(q.drag, dt * 60);
      q.vx *= d; q.vy *= d;
      if (q.flutter) { q.vx += Math.sin(G.t * q.flutter + q.seed) * 18 * dt; }
      q.x += q.vx * dt; q.y += q.vy * dt;
      q.rot += q.vr * dt;
      if (q.floor !== undefined && q.y > q.floor) { q.y = q.floor; q.vy *= -0.3; q.vx *= 0.6; q.vr *= 0.5; }
    }
  }
  draw(c) {
    for (const q of this.p) {
      const k = q.life / q.max;
      const fade = q.fadeIn ? Math.min(1, (1 - k) * 6) * Math.min(1, k * 3) : Math.min(1, k * 2.5);
      c.globalAlpha = q.a * fade;
      if (q.add) c.globalCompositeOperation = 'lighter';
      if (q.kind === 'dot') {
        c.fillStyle = q.color; c.beginPath(); c.arc(q.x, q.y, q.size * (q.shrink ? k : 1), 0, TAU); c.fill();
      } else if (q.kind === 'glow') {
        const r = q.size * (q.shrink ? 0.4 + 0.6 * k : 1);
        const g = c.createRadialGradient(q.x, q.y, 0, q.x, q.y, r);
        g.addColorStop(0, q.color); g.addColorStop(1, rgba(q.color.length === 7 ? q.color : '#ffffff', 0));
        c.fillStyle = g; c.fillRect(q.x - r, q.y - r, r * 2, r * 2);
      } else if (q.kind === 'spark') {
        c.strokeStyle = q.color; c.lineWidth = q.size; c.lineCap = 'round';
        c.beginPath(); c.moveTo(q.x, q.y); c.lineTo(q.x - q.vx * 0.04, q.y - q.vy * 0.04); c.stroke();
      } else if (q.kind === 'star') {
        c.save(); c.translate(q.x, q.y); c.rotate(q.rot); c.fillStyle = q.color;
        const s = q.size * (0.5 + 0.5 * Math.sin(k * Math.PI));
        c.beginPath();
        for (let i = 0; i < 8; i++) { const r = i % 2 ? s * 0.28 : s; const a = (i / 8) * TAU; c.lineTo(Math.cos(a) * r, Math.sin(a) * r); }
        c.fill(); c.restore();
      } else if (q.draw) {
        c.save(); c.translate(q.x, q.y); c.rotate(q.rot); q.draw(c, q, k); c.restore();
      }
      c.globalCompositeOperation = 'source-over';
    }
    c.globalAlpha = 1;
  }
  clear() { this.p.length = 0; }
}

// Shared helpers for soft painted shapes.
function softCircle(c, x, y, r, color, a = 1) {
  const g = c.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, rgba(color, a));
  g.addColorStop(1, rgba(color, 0));
  c.fillStyle = g;
  c.fillRect(x - r, y - r, r * 2, r * 2);
}
function rrect(c, x, y, w, h, r) {
  c.beginPath();
  c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
}
// Smooth closed/open curve through points (Catmull-Rom → Bézier).
function curve(c, pts, closed = false) {
  const n = pts.length;
  if (n < 2) return;
  const P = (i) => pts[closed ? (i + n) % n : clamp(i, 0, n - 1)];
  c.moveTo(pts[0][0], pts[0][1]);
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    c.bezierCurveTo(p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6, p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6, p2[0], p2[1]);
  }
  if (closed) c.closePath();
}

// Save data (per viewer, best effort).
const Save = {
  key: 'hearthwild.v1',
  data: { done: {}, finds: {}, sound: true },
  load() { try { const s = JSON.parse(localStorage.getItem(this.key) || 'null'); if (s) this.data = Object.assign(this.data, s); } catch (_) {} },
  store() { try { localStorage.setItem(this.key, JSON.stringify(this.data)); } catch (_) {} },
};
