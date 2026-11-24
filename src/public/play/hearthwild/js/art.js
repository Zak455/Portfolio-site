// Hearthwild — painted art, all drawn in code.
'use strict';

// ── Time-of-day palettes ────────────────────────────────────────────────────
const SKY = {
  dawn: { name: 'Dawn', top: '#58669f', mid: '#d896a2', hor: '#ffd29e', sun: '#fff1cc', sunX: 0.2, sunY: 0.6, light: '#ffd5ac', fog: '#efc2b6', far: '#b29ebd', hill: '#8a86a8', tree: '#4f5a6e', grass: '#7f9a5c', grassDark: '#3d5640', rim: '#ffcf9e', cloud: '#ffe1d0', stars: 0.15 },
  morning: { name: 'Morning', top: '#4a90d2', mid: '#97c9e8', hor: '#e8f5ec', sun: '#fffbe8', sunX: 0.72, sunY: 0.22, light: '#fff5d6', fog: '#dff0e8', far: '#a1c3cc', hill: '#7aa592', tree: '#2f5a49', grass: '#8dbb5c', grassDark: '#3a6a3e', rim: '#fff3c4', cloud: '#ffffff', stars: 0 },
  noon: { name: 'Midday', top: '#3b86cf', mid: '#86c3ea', hor: '#d8f0f2', sun: '#ffffff', sunX: 0.42, sunY: 0.1, light: '#fffbe8', fog: '#d4ebe6', far: '#9fc2c4', hill: '#86ad82', tree: '#355f3c', grass: '#9dc55c', grassDark: '#477a39', rim: '#fff9d8', cloud: '#ffffff', stars: 0 },
  golden: { name: 'Golden hour', top: '#4b5893', mid: '#e0866a', hor: '#ffc370', sun: '#ffe7a8', sunX: 0.8, sunY: 0.58, light: '#ffc985', fog: '#f0ae80', far: '#bf8a82', hill: '#9a6f68', tree: '#5a4a45', grass: '#b6a252', grassDark: '#5c5a30', rim: '#ffd89a', cloud: '#ffd2a8', stars: 0 },
  dusk: { name: 'Dusk', top: '#10163a', mid: '#33295c', hor: '#c46e6c', sun: '#ffb28a', sunX: 0.3, sunY: 0.78, light: '#9c86d0', fog: '#5a4878', far: '#56456f', hill: '#352f52', tree: '#211f36', grass: '#3a4c4a', grassDark: '#1a2629', rim: '#e7a2a8', cloud: '#8c6f9e', stars: 1 },
};

// ── Landscape painter ───────────────────────────────────────────────────────
// Returns parallax layers drawn once into offscreen canvases.
function ridge(R, w, base, amp, rough, step = 8) {
  const n = Math.ceil(w / step) + 2, pts = [];
  // Sum of sines plus noise → soft natural ridgeline.
  const f1 = R.r(0.0015, 0.003), f2 = R.r(0.004, 0.008), f3 = R.r(0.01, 0.02), p1 = R.r(0, 9), p2 = R.r(0, 9), p3 = R.r(0, 9);
  for (let i = 0; i < n; i++) {
    const x = i * step - step;
    const y = base - amp * (0.55 * Math.sin(x * f1 + p1) + 0.3 * Math.sin(x * f2 + p2) + rough * 0.15 * Math.sin(x * f3 + p3) + rough * 0.06 * (R() - 0.5));
    pts.push([x, y]);
  }
  return pts;
}
function fillRidge(c, pts, h, fill) {
  c.beginPath(); c.moveTo(pts[0][0], h + 10);
  for (const p of pts) c.lineTo(p[0], p[1]);
  c.lineTo(pts[pts.length - 1][0], h + 10); c.closePath();
  c.fillStyle = fill; c.fill();
}

function drawPine(c, x, y, h, col, lit, dir, R) {
  const w = h * 0.36;
  c.fillStyle = mix(col, '#000000', 0.2);
  c.fillRect(x - h * 0.02, y - h * 0.12, h * 0.04, h * 0.14);
  const tiers = 6;
  for (let i = 0; i < tiers; i++) {
    const t0 = i / tiers, ty = y - h * 0.1 - t0 * h * 0.86, tw = w * (1 - t0 * 0.82), th = h * 0.26;
    c.beginPath();
    c.moveTo(x, ty - th);
    const jag = 5;
    for (let j = 0; j <= jag; j++) { const k = j / jag; c.lineTo(x + tw * k, ty - th + th * k + (j % 2 ? -th * 0.08 : 0)); }
    c.quadraticCurveTo(x, ty + th * 0.12, x - tw, ty);
    for (let j = jag; j >= 0; j--) { const k = j / jag; c.lineTo(x - tw * k, ty - th + th * k + (j % 2 ? -th * 0.08 : 0)); }
    c.closePath();
    const g = c.createLinearGradient(x - tw, 0, x + tw, 0);
    g.addColorStop(dir > 0 ? 0 : 1, mix(col, '#000000', 0.12));
    g.addColorStop(0.55, col);
    g.addColorStop(dir > 0 ? 1 : 0, mix(col, lit, 0.35));
    c.fillStyle = g; c.fill();
  }
}
function drawRoundTree(c, x, y, h, col, lit, dir, R, birch = false) {
  const tw = h * (birch ? 0.035 : 0.06);
  // trunk
  c.fillStyle = birch ? mix('#e9e4da', col, 0.25) : mix(col, '#2a1a10', 0.55);
  c.beginPath(); c.moveTo(x - tw, y); c.lineTo(x - tw * 0.5, y - h * 0.62); c.lineTo(x + tw * 0.5, y - h * 0.62); c.lineTo(x + tw, y); c.fill();
  if (birch) {
    c.fillStyle = mix(col, '#111111', 0.5);
    for (let i = 0; i < 6; i++) c.fillRect(x - tw * 0.8, y - R.r(0.05, 0.6) * h, tw * R.r(0.6, 1.4), h * 0.012);
  }
  const cy = y - h * 0.62, rr = h * (birch ? 0.2 : 0.3);
  // branches
  c.strokeStyle = birch ? mix('#e9e4da', col, 0.35) : mix(col, '#2a1a10', 0.55); c.lineCap = 'round';
  for (let i = 0; i < 4; i++) { const a = -Math.PI / 2 + R.r(-1, 1); c.lineWidth = tw * 0.5; c.beginPath(); c.moveTo(x, cy + rr * 0.3); c.lineTo(x + Math.cos(a) * rr * 0.7, cy + Math.sin(a) * rr * 0.5); c.stroke(); }
  // dark interior mass
  c.fillStyle = mix(col, '#000000', 0.12);
  c.beginPath(); c.ellipse(x, cy - rr * 0.1, rr * 0.95, rr * 0.7, 0, 0, TAU); c.fill();
  const blobs = birch ? 16 : 24;
  for (let i = 0; i < blobs; i++) {
    const a = R.r(0, TAU), d = Math.sqrt(R()) * rr * 0.95;
    const bx = x + Math.cos(a) * d * 1.15, by = cy + Math.sin(a) * d * 0.78 - rr * 0.15, br = rr * R.r(0.22, 0.42) * (1 - d / rr * 0.3);
    const g = c.createRadialGradient(bx + dir * br * 0.45, by - br * 0.45, br * 0.1, bx, by, br);
    g.addColorStop(0, mix(col, lit, 0.45));
    g.addColorStop(0.6, col);
    g.addColorStop(1, mix(col, '#000000', 0.18));
    c.fillStyle = g; c.beginPath(); c.arc(bx, by, br, 0, TAU); c.fill();
  }
  // leaf speckle
  for (let i = 0; i < 60; i++) { const a = R.r(0, TAU), d = Math.sqrt(R()) * rr; const lx = x + Math.cos(a) * d * 1.1, ly = cy + Math.sin(a) * d * 0.75 - rr * 0.15; const sunny = (lx - x) * dir > -rr * 0.2 && ly < cy + rr * 0.1; if (!sunny) continue; c.fillStyle = rgba(mix(col, lit, 0.5), R.r(0.15, 0.35)); c.beginPath(); c.ellipse(lx, ly, rr * 0.06, rr * 0.035, R.r(0, 3), 0, TAU); c.fill(); }
  // highlight dabs
  c.fillStyle = rgba(lit, 0.18);
  for (let i = 0; i < 10; i++) { const a = R.r(-1.2, 0.2) + (dir > 0 ? 0 : Math.PI * 0.6); c.beginPath(); c.arc(x + Math.cos(a) * rr * 0.7 * dir, cy + Math.sin(a) * rr * 0.6 - rr * 0.2, rr * R.r(0.08, 0.18), 0, TAU); c.fill(); }
}

function paintLandscape(cfg, P, W, H, worldW) {
  const R = rng(cfg.seed || 7);
  const dir = P.sunX > 0.5 ? 1 : -1;
  const layers = [];
  const scale = Math.min(G.dpr, 1.5);
  const gy = cfg.groundY; // horizon of the meadow, screen px
  const mk = (par) => { const w = W + (worldW - W) * par + 40; const cv = makeCanvas(w, H, scale); return { cv, c: cv.getContext('2d'), par, w }; };

  // Sky (fixed)
  const sky = mk(0.02);
  {
    const c = sky.c, w = sky.w;
    const g = c.createLinearGradient(0, 0, 0, gy);
    g.addColorStop(0, P.top); g.addColorStop(0.55, P.mid); g.addColorStop(1, P.hor);
    c.fillStyle = g; c.fillRect(0, 0, w, H);
    if (P.stars) {
      for (let i = 0; i < 220; i++) {
        const sx = R.r(0, w), sy = R.r(0, gy * 0.7), a = R.r(0.2, 0.9) * P.stars * (1 - sy / (gy * 0.7));
        c.fillStyle = `rgba(255,248,230,${a})`; c.beginPath(); c.arc(sx, sy, R.r(0.4, 1.4), 0, TAU); c.fill();
      }
    }
    const sx = W * P.sunX, sy = gy * P.sunY;
    c.globalCompositeOperation = 'lighter';
    softCircle(c, sx, sy, H * 0.9, P.light, 0.35);
    softCircle(c, sx, sy, H * 0.35, P.sun, 0.45);
    c.globalCompositeOperation = 'source-over';
    if (sy < gy) { softCircle(c, sx, sy, H * 0.06, '#ffffff', 0.9); c.fillStyle = P.sun; c.beginPath(); c.arc(sx, sy, H * 0.028, 0, TAU); c.fill(); }
    // Painterly clouds
    for (let i = 0; i < 9; i++) {
      const cx = R.r(-100, w), cy = R.r(gy * 0.08, gy * 0.55), cw = R.r(120, 320), ch = cw * R.r(0.18, 0.3);
      for (let j = 0; j < 14; j++) {
        const bx = cx + R.r(-cw / 2, cw / 2), by = cy + R.r(-ch / 4, ch / 5), br = ch * R.r(0.35, 0.8);
        c.save(); c.translate(bx, by); c.scale(2.6, 1);
        const gg = c.createRadialGradient(0, -br * 0.35, 0, 0, 0, br);
        gg.addColorStop(0, rgba(P.cloud, 0.32)); gg.addColorStop(0.6, rgba(mix(P.cloud, P.mid, 0.5), 0.16)); gg.addColorStop(1, rgba(P.mid, 0));
        c.fillStyle = gg; c.beginPath(); c.arc(0, 0, br, 0, TAU); c.fill(); c.restore();
      }
    }
  }
  layers.push(sky);

  // Far mountains
  const far = mk(0.1);
  {
    const c = far.c;
    const pts = ridge(R, far.w, gy - H * 0.13, H * 0.12, 1.4, 6);
    const g = c.createLinearGradient(0, gy - H * 0.3, 0, gy);
    g.addColorStop(0, mix(P.far, P.light, 0.15)); g.addColorStop(1, mix(P.far, P.fog, 0.7));
    fillRidge(c, pts, H, g);
    // light rim along the ridge
    c.strokeStyle = rgba(P.rim, 0.35); c.lineWidth = 1.5; c.beginPath(); pts.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]))); c.stroke();
    const pts2 = ridge(R, far.w, gy - H * 0.06, H * 0.07, 1, 6);
    fillRidge(c, pts2, H, mix(P.far, P.fog, 0.45));
    // mist band
    const mg = c.createLinearGradient(0, gy - H * 0.08, 0, gy + 10);
    mg.addColorStop(0, rgba(P.fog, 0)); mg.addColorStop(1, rgba(P.fog, 0.85));
    c.fillStyle = mg; c.fillRect(0, gy - H * 0.08, far.w, H);
  }
  layers.push(far);

  // Hills with distant tree line
  const hills = mk(0.28);
  {
    const c = hills.c;
    const pts = ridge(R, hills.w, gy - H * 0.035, H * 0.05, 0.6, 10);
    const g = c.createLinearGradient(0, gy - H * 0.1, 0, gy + 20);
    g.addColorStop(0, mix(P.hill, P.fog, 0.25)); g.addColorStop(1, mix(P.hill, P.fog, 0.55));
    fillRidge(c, pts, H, g);
    const tcol = mix(P.tree, P.fog, 0.55);
    for (let x = 0; x < hills.w; x += R.r(6, 16)) {
      const i = Math.min(pts.length - 1, Math.max(0, Math.round(x / 10) + 1));
      const y = pts[i][1] + 4, h = R.r(16, 34) * (H / 900);
      if (cfg.trees === 'pine' || (cfg.trees === 'mixed' && R() < 0.5)) drawPine(c, x, y, h * 1.4, tcol, P.rim, dir, R);
      else { c.fillStyle = tcol; c.beginPath(); c.ellipse(x, y - h * 0.5, h * 0.45, h * 0.55, 0, 0, TAU); c.fill(); }
    }
    const mg = c.createLinearGradient(0, gy - 30, 0, gy + 30);
    mg.addColorStop(0, rgba(P.fog, 0)); mg.addColorStop(1, rgba(P.fog, 0.7));
    c.fillStyle = mg; c.fillRect(0, gy - 30, hills.w, H);
  }
  layers.push(hills);

  // Mid trees (behind the meadow)
  const mid = mk(0.55);
  {
    const c = mid.c, k = H / 900;
    const tcol = mix(P.tree, P.fog, 0.22);
    let x = R.r(-40, 40);
    while (x < mid.w + 60) {
      const h = R.r(170, 300) * k;
      const y = gy + R.r(4, 18);
      const t = cfg.trees === 'pine' ? 'pine' : cfg.trees === 'birch' ? (R() < 0.7 ? 'birch' : 'round') : cfg.trees === 'mixed' ? R.pick(['pine', 'round', 'round']) : 'round';
      if (R() < (cfg.clearings || 0.25)) { x += R.r(80, 200) * k; continue; }
      if (t === 'pine') drawPine(c, x, y, h * 1.15, tcol, P.rim, dir, R);
      else drawRoundTree(c, x, y, h, t === 'birch' ? mix(P.grass, tcol, 0.55) : tcol, P.rim, dir, R, t === 'birch');
      x += R.r(40, 110) * k;
    }
    const mg = c.createLinearGradient(0, gy - 60 * k, 0, gy + 20);
    mg.addColorStop(0, rgba(P.fog, 0)); mg.addColorStop(1, rgba(P.fog, 0.45));
    c.fillStyle = mg; c.fillRect(0, gy - 60 * k, mid.w, H);
  }
  layers.push(mid);

  // Meadow ground (moves 1:1 with the world)
  const ground = mk(1);
  {
    const c = ground.c, w = ground.w;
    const g = c.createLinearGradient(0, gy, 0, H);
    g.addColorStop(0, mix(P.grass, P.fog, 0.35)); g.addColorStop(0.25, P.grass); g.addColorStop(1, P.grassDark);
    c.fillStyle = g; c.fillRect(0, gy, w, H - gy);
    // soft gently curved top edge
    c.fillStyle = mix(P.grass, P.fog, 0.4);
    c.beginPath(); c.moveTo(0, gy + 6);
    for (let x = 0; x <= w; x += 30) c.lineTo(x, gy + 2 + Math.sin(x * 0.01) * 4);
    c.lineTo(w, gy + 14); c.lineTo(0, gy + 14); c.fill();
    // dappled light pools
    c.globalCompositeOperation = 'soft-light';
    for (let i = 0; i < 26; i++) { const x = R.r(0, w), y = R.r(gy + 20, H); softCircle(c, x, y, R.r(80, 220), P.light, 0.55); }
    c.globalCompositeOperation = 'source-over';
    // brush strokes of grass
    for (let i = 0; i < w * 1.6; i++) {
      const y = R.r(gy + 4, H), depth = (y - gy) / (H - gy), x = R.r(0, w);
      const len = (3 + depth * 14) * R.r(0.6, 1.4);
      c.strokeStyle = rgba(R() < 0.5 ? mix(P.grass, P.rim, 0.35) : P.grassDark, R.r(0.15, 0.45));
      c.lineWidth = 0.6 + depth * 1.4;
      c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + R.r(-2, 2), y - len * 0.6, x + R.r(-4, 4), y - len); c.stroke();
    }
    // wildflowers
    const fl = cfg.flowers || ['#fff6e8', '#f6d65b', '#c9a4e8'];
    for (let i = 0; i < w * 0.12; i++) {
      const y = R.r(gy + 10, H), depth = (y - gy) / (H - gy), x = R.r(0, w);
      c.fillStyle = rgba(R.pick(fl), 0.85 - (1 - depth) * 0.4);
      c.beginPath(); c.arc(x, y, 0.8 + depth * 2.4, 0, TAU); c.fill();
    }
    // stream
    if (cfg.stream) {
      const sy = gy + (H - gy) * 0.32;
      const top = [], bot = [];
      for (let x = -20; x <= w + 20; x += 20) {
        const yy = sy + Math.sin(x * 0.004) * 26 + Math.sin(x * 0.011) * 9;
        const th = 26 + (yy - gy) * 0.18 + Math.sin(x * 0.007) * 8;
        top.push([x, yy - th / 2]); bot.push([x, yy + th / 2]);
      }
      cfg.streamPts = top.map((p, i) => [p[0], (p[1] + bot[i][1]) / 2, bot[i][1] - p[1]]);
      // banks
      c.fillStyle = mix(P.grassDark, '#5a4430', 0.4);
      c.beginPath(); curve(c, top.map((p) => [p[0], p[1] - 5])); for (let i = bot.length - 1; i >= 0; i--) c.lineTo(bot[i][0], bot[i][1] + 7); c.fill();
      const wg = c.createLinearGradient(0, sy - 40, 0, sy + 50);
      wg.addColorStop(0, mix(P.top, P.hor, 0.6)); wg.addColorStop(1, mix(P.top, P.grassDark, 0.4));
      c.fillStyle = wg;
      c.beginPath(); curve(c, top); for (let i = bot.length - 1; i >= 0; i--) c.lineTo(bot[i][0], bot[i][1]); c.closePath(); c.fill();
      // pebbles
      for (let i = 0; i < w * 0.06; i++) {
        const sp = R.pick(cfg.streamPts), side = R() < 0.5 ? -1 : 1;
        c.fillStyle = rgba(R.pick(['#9a9184', '#b8ad9c', '#7d7468']), 0.9);
        c.beginPath(); c.ellipse(sp[0] + R.r(-10, 10), sp[1] + side * sp[2] * R.r(0.45, 0.6), R.r(2, 5), R.r(1.5, 3), 0, 0, TAU); c.fill();
      }
    }
    // path of trodden earth
    if (cfg.path) {
      c.fillStyle = rgba('#b59a72', 0.35);
      c.beginPath();
      for (let x = 0; x <= w; x += 20) c.lineTo(x, H * 0.86 + Math.sin(x * 0.003) * 30);
      for (let x = w; x >= 0; x -= 20) c.lineTo(x, H * 0.86 + Math.sin(x * 0.003) * 30 + 26 + Math.sin(x * 0.01) * 6);
      c.fill();
    }
  }
  layers.push(ground);
  return layers;
}

// Grass tufts and ferns drawn live so they sway.
function makeTufts(R, worldW, gy, H, n) {
  const t = [];
  for (let i = 0; i < n; i++) {
    const y = gy + (H - gy) * Math.pow(R(), 0.7);
    t.push({ x: R.r(0, worldW), y, h: (8 + (y - gy) * 0.09) * R.r(0.7, 1.4), n: 3 + ((R() * 5) | 0), ph: R.r(0, TAU), fern: R() < 0.15 });
  }
  t.sort((a, b) => a.y - b.y);
  return t;
}
function drawTuft(c, t, P, wind, depthTint = 0) {
  const sway = Math.sin(G.t * 1.4 + t.ph + t.x * 0.004) * wind;
  c.strokeStyle = mix(P.grassDark, P.grass, 0.35 + depthTint);
  c.lineCap = 'round';
  if (t.fern) {
    c.lineWidth = 1.2;
    for (let i = 0; i < 5; i++) {
      const a = -Math.PI / 2 + (i - 2) * 0.45 + sway * 0.08;
      const L = t.h * 2.2;
      const ex = t.x + Math.cos(a) * L, ey = t.y + Math.sin(a) * L;
      c.beginPath(); c.moveTo(t.x, t.y); c.quadraticCurveTo(t.x + Math.cos(a) * L * 0.5, t.y + Math.sin(a) * L * 0.7, ex + sway * 4, ey + L * 0.25); c.stroke();
    }
    return;
  }
  for (let i = 0; i < t.n; i++) {
    const off = (i - t.n / 2) * 2.2;
    c.lineWidth = 0.7 + t.h * 0.035;
    c.strokeStyle = i % 2 ? mix(P.grass, P.rim, 0.25) : mix(P.grassDark, P.grass, 0.5);
    c.beginPath(); c.moveTo(t.x + off, t.y);
    c.quadraticCurveTo(t.x + off + sway * 2, t.y - t.h * 0.6, t.x + off * 1.8 + sway * (3 + i), t.y - t.h * (0.8 + (i % 3) * 0.15));
    c.stroke();
  }
}

// ── Animals ─────────────────────────────────────────────────────────────────
// All drawn facing right, origin at feet centre, size s ≈ body length.
function drawRabbit(c, s, st) {
  // st: {head:0 graze..1 alert, ear:0..1, hop:0..1, blink}
  const fur = '#a88466', dark = '#6e5240', light = '#e6d2bb';
  const hy = -s * 0.32 - st.head * s * 0.12;
  c.save();
  c.translate(0, -st.hop * s * 0.3);
  // shadow handled by caller
  // haunch + body
  const g = c.createRadialGradient(-s * 0.1, -s * 0.42, s * 0.05, -s * 0.05, -s * 0.28, s * 0.5);
  g.addColorStop(0, mix(fur, '#fff2dc', 0.35)); g.addColorStop(1, dark);
  c.fillStyle = g;
  c.beginPath(); c.ellipse(-s * 0.08, -s * 0.26, s * 0.36, s * 0.26, -0.15 + st.head * 0.2, 0, TAU); c.fill();
  c.beginPath(); c.ellipse(-s * 0.22, -s * 0.2, s * 0.22, s * 0.2, 0, 0, TAU); c.fill();
  // tail
  c.fillStyle = '#f7efe4'; c.beginPath(); c.arc(-s * 0.44, -s * 0.28, s * 0.07, 0, TAU); c.fill();
  // front paw
  c.fillStyle = dark; c.beginPath(); c.ellipse(s * 0.18, -s * 0.04, s * 0.07, s * 0.04, 0, 0, TAU); c.fill();
  c.beginPath(); c.ellipse(-s * 0.18, -s * 0.03, s * 0.14, s * 0.04, 0, 0, TAU); c.fill();
  // head
  c.save(); c.translate(s * 0.22, hy + s * (1 - st.head) * 0.16);
  c.rotate(0.35 * (1 - st.head));
  // ears
  const ea = -1.9 + st.ear * 0.55 - (1 - st.head) * 0.2;
  for (const k of [0, 1]) {
    c.save(); c.translate(-s * 0.04 - k * s * 0.03, -s * 0.07); c.rotate(ea - k * 0.18);
    c.fillStyle = k ? dark : fur; c.beginPath(); c.ellipse(s * 0.17, 0, s * 0.19, s * 0.05, 0, 0, TAU); c.fill();
    if (!k) { c.fillStyle = '#d9a49a'; c.beginPath(); c.ellipse(s * 0.17, 0, s * 0.14, s * 0.022, 0, 0, TAU); c.fill(); }
    c.restore();
  }
  const hg = c.createRadialGradient(0, -s * 0.06, 0, 0, 0, s * 0.16);
  hg.addColorStop(0, mix(fur, '#fff2dc', 0.3)); hg.addColorStop(1, mix(fur, dark, 0.4));
  c.fillStyle = hg; c.beginPath(); c.ellipse(s * 0.02, 0, s * 0.16, s * 0.12, 0.2, 0, TAU); c.fill();
  c.fillStyle = light; c.beginPath(); c.ellipse(s * 0.12, s * 0.04, s * 0.06, s * 0.05, 0, 0, TAU); c.fill();
  c.fillStyle = '#1d140f'; c.beginPath(); c.arc(s * 0.06, -s * 0.03, s * 0.028 * (st.blink ? 0.2 : 1), 0, TAU); c.fill();
  c.fillStyle = 'rgba(255,255,255,.8)'; c.beginPath(); c.arc(s * 0.068, -s * 0.04, s * 0.008, 0, TAU); c.fill();
  c.fillStyle = '#c98a84'; c.beginPath(); c.arc(s * 0.17, s * 0.01, s * 0.015, 0, TAU); c.fill();
  c.restore();
  c.restore();
}

function drawPheasant(c, s, st) {
  const body = '#b5652d', dark = '#5e2f16', gold = '#e0a250';
  c.save();
  c.translate(0, -st.hop * s * 0.2);
  // tail
  c.save(); c.translate(-s * 0.3, -s * 0.3); c.rotate(0.2 + Math.sin(G.t * 2) * 0.02);
  const tg = c.createLinearGradient(0, 0, -s * 0.9, 0); tg.addColorStop(0, body); tg.addColorStop(1, '#8a6a42');
  c.fillStyle = tg; c.beginPath(); c.moveTo(0, -s * 0.05); c.quadraticCurveTo(-s * 0.5, -s * 0.08, -s * 0.95, s * 0.02); c.quadraticCurveTo(-s * 0.5, s * 0.06, 0, s * 0.05); c.fill();
  c.strokeStyle = 'rgba(40,20,10,.45)'; c.lineWidth = 1;
  for (let i = 1; i < 9; i++) { const x = -s * 0.1 * i; c.beginPath(); c.moveTo(x, -s * 0.05 + i * 0.6); c.lineTo(x - 3, s * 0.04); c.stroke(); }
  c.restore();
  // legs
  c.strokeStyle = '#8c6a52'; c.lineWidth = s * 0.025;
  c.beginPath(); c.moveTo(-s * 0.02, -s * 0.15); c.lineTo(-s * 0.04, 0); c.moveTo(s * 0.06, -s * 0.15); c.lineTo(s * 0.08, 0); c.stroke();
  // body
  const bg = c.createRadialGradient(s * 0.05, -s * 0.38, s * 0.02, 0, -s * 0.28, s * 0.36);
  bg.addColorStop(0, gold); bg.addColorStop(0.6, body); bg.addColorStop(1, dark);
  c.fillStyle = bg; c.beginPath(); c.ellipse(0, -s * 0.28, s * 0.34, s * 0.19, -0.12, 0, TAU); c.fill();
  // scalloped feather marks
  c.fillStyle = 'rgba(50,25,10,.35)';
  for (let i = 0; i < 18; i++) { const a = (i * 2.39) % TAU, d = (i % 5) / 5; c.beginPath(); c.arc(Math.cos(a) * s * 0.22 * d - s * 0.02, -s * 0.28 + Math.sin(a) * s * 0.11 * d, s * 0.018, 0, Math.PI); c.fill(); }
  // neck + head
  const peck = st.head; // 0 pecking, 1 upright
  c.save(); c.translate(s * 0.24, -s * 0.36); c.rotate(-0.4 + (1 - peck) * 1.1);
  c.fillStyle = '#1f4a4a'; c.beginPath(); c.ellipse(s * 0.06, -s * 0.08, s * 0.07, s * 0.14, 0.3, 0, TAU); c.fill();
  c.fillStyle = '#f4efe6'; c.beginPath(); c.ellipse(s * 0.0, 0, s * 0.07, s * 0.025, 0.3, 0, TAU); c.fill();
  c.save(); c.translate(s * 0.1, -s * 0.2);
  const hg = c.createRadialGradient(0, -s * 0.02, 0, 0, 0, s * 0.08); hg.addColorStop(0, '#3f8f7c'); hg.addColorStop(1, '#1b3348');
  c.fillStyle = hg; c.beginPath(); c.ellipse(0, 0, s * 0.075, s * 0.06, 0, 0, TAU); c.fill();
  c.fillStyle = '#c8322b'; c.beginPath(); c.ellipse(s * 0.02, 0, s * 0.035, s * 0.04, 0, 0, TAU); c.fill();
  c.fillStyle = '#e8d6a8'; c.beginPath(); c.moveTo(s * 0.06, -s * 0.005); c.lineTo(s * 0.12, s * 0.01); c.lineTo(s * 0.06, s * 0.02); c.fill();
  c.fillStyle = '#111'; c.beginPath(); c.arc(s * 0.025, -s * 0.012, s * 0.01, 0, TAU); c.fill();
  c.restore(); c.restore();
  c.restore();
}

function drawDeer(c, s, st) {
  const coat = '#a8714a', dark = '#5f3c26', light = '#e8d1b4';
  const graze = 1 - st.head;
  c.save(); c.translate(0, -st.hop * s * 0.25);
  // far legs
  c.strokeStyle = dark; c.lineCap = 'round'; c.lineWidth = s * 0.035;
  const leg = (x, ph) => { const k = Math.sin(st.walk + ph) * 0.15 * st.moving; c.beginPath(); c.moveTo(x, -s * 0.42); c.lineTo(x + k * s * 0.3, -s * 0.2); c.lineTo(x + k * s * 0.2, 0); c.stroke(); };
  leg(-s * 0.26, 1); leg(s * 0.18, 3);
  // body
  const bg = c.createLinearGradient(0, -s * 0.65, 0, -s * 0.3);
  bg.addColorStop(0, mix(coat, '#ffe2bd', 0.25)); bg.addColorStop(1, dark);
  c.fillStyle = bg;
  c.beginPath(); c.ellipse(-s * 0.04, -s * 0.5, s * 0.34, s * 0.15, 0, 0, TAU); c.fill();
  c.fillStyle = light; c.beginPath(); c.ellipse(-s * 0.38, -s * 0.52, s * 0.05, s * 0.07, 0, 0, TAU); c.fill();
  c.strokeStyle = coat; c.lineWidth = s * 0.04;
  leg(-s * 0.3, 0); leg(s * 0.22, 2);
  // neck and head
  c.save(); c.translate(s * 0.24, -s * 0.55); c.rotate(-0.55 + graze * 1.55);
  c.fillStyle = coat; c.beginPath(); c.moveTo(-s * 0.06, s * 0.06); c.lineTo(s * 0.04, -s * 0.28); c.lineTo(s * 0.13, -s * 0.24); c.lineTo(s * 0.08, s * 0.06); c.fill();
  c.translate(s * 0.1, -s * 0.28); c.rotate(0.9 - graze * 0.4);
  // ears
  for (const k of [0, 1]) { c.save(); c.translate(-s * 0.02, -s * 0.04); c.rotate(-0.9 - k * 0.3 + st.ear * 0.4); c.fillStyle = k ? dark : coat; c.beginPath(); c.ellipse(0, -s * 0.06, s * 0.025, s * 0.07, 0, 0, TAU); c.fill(); c.restore(); }
  // little antlers
  c.strokeStyle = '#d8c3a0'; c.lineWidth = s * 0.012;
  c.beginPath(); c.moveTo(0, -s * 0.05); c.lineTo(-s * 0.03, -s * 0.15); c.lineTo(-s * 0.05, -s * 0.19); c.moveTo(-s * 0.03, -s * 0.15); c.lineTo(0, -s * 0.18); c.stroke();
  const hg = c.createLinearGradient(0, -s * 0.05, s * 0.15, s * 0.05); hg.addColorStop(0, coat); hg.addColorStop(1, mix(coat, dark, 0.5));
  c.fillStyle = hg; c.beginPath(); c.ellipse(s * 0.05, 0, s * 0.11, s * 0.05, 0.25, 0, TAU); c.fill();
  c.fillStyle = '#1b120d'; c.beginPath(); c.arc(s * 0.14, s * 0.025, s * 0.016, 0, TAU); c.fill();
  c.beginPath(); c.arc(s * 0.02, -s * 0.01, s * 0.014 * (st.blink ? 0.2 : 1), 0, TAU); c.fill();
  c.restore();
  c.restore();
}

function drawTrout(c, s, opt = {}) {
  // horizontal fish, centred, length 2s
  const cleaned = opt.clean ?? 1;
  c.save();
  if (opt.flex) c.transform(1, 0, Math.sin(G.t * 9) * 0.05 * opt.flex, 1, 0, 0);
  const body = new Path2D();
  body.moveTo(s, 0);
  body.bezierCurveTo(s * 0.7, -s * 0.36, -s * 0.3, -s * 0.34, -s * 0.72, -s * 0.06);
  body.lineTo(-s * 0.98, -s * 0.28); body.quadraticCurveTo(-s * 0.9, 0, -s * 0.98, s * 0.28);
  body.lineTo(-s * 0.72, s * 0.06);
  body.bezierCurveTo(-s * 0.3, s * 0.3, s * 0.7, s * 0.3, s, 0);
  const g = c.createLinearGradient(0, -s * 0.34, 0, s * 0.3);
  g.addColorStop(0, '#5d6e4c'); g.addColorStop(0.42, '#a7ab7f'); g.addColorStop(0.55, '#e6a4a0'); g.addColorStop(0.7, '#e8e2d2'); g.addColorStop(1, '#f6f1e6');
  c.fillStyle = g; c.fill(body);
  c.save(); c.clip(body);
  // iridescent stripe
  c.globalCompositeOperation = 'soft-light'; softCircle(c, s * 0.2, -s * 0.05, s * 0.6, '#b4f0ff', 0.6); c.globalCompositeOperation = 'source-over';
  const R = rng(5);
  for (let i = 0; i < 36; i++) {
    const x = R.r(-0.7, 0.8) * s, y = R.r(-0.28, 0.05) * s;
    c.fillStyle = i % 5 === 0 ? 'rgba(190,60,50,.8)' : 'rgba(40,40,30,.55)';
    c.beginPath(); c.arc(x, y, s * R.r(0.012, 0.025), 0, TAU); c.fill();
  }
  if (cleaned < 1) {
    // unscaled sheen: diamond lattice
    c.globalAlpha = 1 - cleaned;
    c.strokeStyle = 'rgba(230,240,240,.55)'; c.lineWidth = 0.8;
    for (let x = -s; x < s; x += s * 0.06) { c.beginPath(); c.moveTo(x, -s); c.lineTo(x + s * 0.6, s); c.moveTo(x, s); c.lineTo(x + s * 0.6, -s); c.stroke(); }
    c.globalAlpha = 1;
  }
  c.restore();
  // fins
  c.fillStyle = 'rgba(120,110,80,.85)';
  c.beginPath(); c.moveTo(s * 0.1, -s * 0.27); c.quadraticCurveTo(-s * 0.05, -s * 0.42, -s * 0.18, -s * 0.27); c.fill();
  c.beginPath(); c.moveTo(s * 0.3, s * 0.18); c.quadraticCurveTo(s * 0.18, s * 0.34, s * 0.1, s * 0.2); c.fill();
  // gill + eye
  c.strokeStyle = 'rgba(90,60,50,.5)'; c.lineWidth = 1.2;
  c.beginPath(); c.arc(s * 0.62, 0, s * 0.18, -1.1, 1.1); c.stroke();
  c.fillStyle = '#f4e6c2'; c.beginPath(); c.arc(s * 0.8, -s * 0.06, s * 0.05, 0, TAU); c.fill();
  c.fillStyle = '#121212'; c.beginPath(); c.arc(s * 0.81, -s * 0.06, s * 0.03, 0, TAU); c.fill();
  c.restore();
}

// ── Ingredients ─────────────────────────────────────────────────────────────
// Each draws centred at 0,0 at roughly radius s. opt.cook 0..1 browns, opt.dirt 0..1.
const ING = {};

ING.chanterelle = (c, s, o = {}) => {
  const k = o.cook || 0;
  const col = mix('#f2b23a', '#a8641e', k), lite = mix('#ffd97a', '#d58f3b', k);
  // stem
  const sg = c.createLinearGradient(-s * 0.2, 0, s * 0.2, 0); sg.addColorStop(0, mix(col, '#7a4d15', 0.3)); sg.addColorStop(1, lite);
  c.fillStyle = sg; c.beginPath(); c.moveTo(-s * 0.16, s * 0.9); c.quadraticCurveTo(-s * 0.2, s * 0.2, -s * 0.55, -s * 0.3); c.lineTo(s * 0.55, -s * 0.3); c.quadraticCurveTo(s * 0.2, s * 0.2, s * 0.16, s * 0.9); c.closePath(); c.fill();
  // gill ridges
  c.strokeStyle = rgba(mix(col, '#7a4d15', 0.45), 0.6); c.lineWidth = Math.max(0.6, s * 0.03);
  for (let i = -4; i <= 4; i++) { c.beginPath(); c.moveTo(i * s * 0.12, -s * 0.28); c.quadraticCurveTo(i * s * 0.05, s * 0.1, i * s * 0.02, s * 0.5); c.stroke(); }
  // wavy cap rim
  const cg = c.createLinearGradient(0, -s * 0.6, 0, -s * 0.2); cg.addColorStop(0, lite); cg.addColorStop(1, col);
  c.fillStyle = cg; c.beginPath();
  c.moveTo(-s * 0.75, -s * 0.32);
  c.bezierCurveTo(-s * 0.7, -s * 0.62, -s * 0.2, -s * 0.5, 0, -s * 0.6);
  c.bezierCurveTo(s * 0.25, -s * 0.68, s * 0.72, -s * 0.6, s * 0.75, -s * 0.34);
  c.bezierCurveTo(s * 0.5, -s * 0.2, s * 0.25, -s * 0.36, 0, -s * 0.28);
  c.bezierCurveTo(-s * 0.3, -s * 0.2, -s * 0.5, -s * 0.38, -s * 0.75, -s * 0.32);
  c.fill();
  if (o.dirt) dirtSpeckle(c, s, o.dirt, 11);
};
ING.chanterelleSlice = (c, s, o = {}) => {
  const k = o.cook || 0, col = mix('#f6c45a', '#9b5a1c', k);
  c.fillStyle = col; c.beginPath(); c.moveTo(-s * 0.15, s); c.quadraticCurveTo(-s * 0.2, 0, -s * 0.7, -s * 0.5); c.quadraticCurveTo(0, -s * 0.9, s * 0.7, -s * 0.5); c.quadraticCurveTo(s * 0.2, 0, s * 0.15, s); c.fill();
  c.strokeStyle = rgba(mix(col, '#6b3d10', 0.4), 0.5); c.lineWidth = 1; c.beginPath(); c.moveTo(-s * 0.5, -s * 0.45); c.quadraticCurveTo(0, -s * 0.2, s * 0.5, -s * 0.45); c.stroke();
};

ING.garlic = (c, s, o = {}) => {
  // wild garlic: bunch of broad leaves with a white star flower cluster
  const R = rng(11);
  for (let i = 0; i < 5; i++) {
    c.save(); c.rotate(-0.5 + i * 0.25); leaf(c, 0, s * 0.9, s * 1.7, s * 0.34, mix('#3e8a3a', '#6dbb4f', i / 5), '#b9e48c'); c.restore();
  }
  c.strokeStyle = '#7fae5c'; c.lineWidth = s * 0.04; c.beginPath(); c.moveTo(0, s * 0.9); c.quadraticCurveTo(s * 0.1, 0, s * 0.05, -s * 0.85); c.stroke();
  for (let i = 0; i < 9; i++) { const a = R.r(0, TAU), d = R.r(0, s * 0.18); flower(c, s * 0.05 + Math.cos(a) * d, -s * 0.9 + Math.sin(a) * d, s * 0.07, '#ffffff', '#eef7c8'); }
};
ING.garlicChop = (c, s, o = {}) => {
  const k = o.cook || 0; const R = rng(4);
  for (let i = 0; i < 14; i++) { c.fillStyle = mix(i % 3 ? '#4f9a40' : '#7cc45a', '#3f5a20', k * 0.6); c.save(); c.translate(R.r(-s, s) * 0.8, R.r(-s, s) * 0.5); c.rotate(R.r(0, 3)); c.fillRect(-s * 0.12, -s * 0.05, s * 0.24, s * 0.1); c.restore(); }
};

ING.sorrel = (c, s) => {
  for (let i = 0; i < 4; i++) { c.save(); c.rotate(-0.7 + i * 0.45); arrowLeaf(c, 0, s * 0.8, s * 1.4, s * 0.42, mix('#4b9a3e', '#8acb5a', i / 4)); c.restore(); }
};
ING.sorrelChop = (c, s, o = {}) => {
  const R = rng(9);
  for (let i = 0; i < 10; i++) { c.strokeStyle = mix('#5aa845', '#3e6a28', (o.cook || 0) * 0.8); c.lineWidth = s * 0.12; c.lineCap = 'round'; c.save(); c.translate(R.r(-s, s) * 0.7, R.r(-s, s) * 0.45); c.rotate(R.r(-0.5, 0.5)); c.beginPath(); c.moveTo(-s * 0.3, 0); c.quadraticCurveTo(0, -s * 0.12, s * 0.3, 0); c.stroke(); c.restore(); }
};

ING.trout = (c, s, o = {}) => drawTrout(c, s, o);
ING.troutFillet = (c, s, o = {}) => {
  const k = o.cook || 0, skin = o.skin;
  const p = new Path2D();
  p.moveTo(s, -s * 0.05); p.bezierCurveTo(s * 0.6, -s * 0.42, -s * 0.5, -s * 0.36, -s, -s * 0.06); p.bezierCurveTo(-s * 0.5, s * 0.24, s * 0.6, s * 0.3, s, -s * 0.05);
  if (skin) {
    const g = c.createLinearGradient(0, -s * 0.4, 0, s * 0.3); g.addColorStop(0, mix('#8b8f6a', '#6b3c16', k)); g.addColorStop(1, mix('#d8d1bb', '#c98a3a', k));
    c.fillStyle = g; c.fill(p);
    c.save(); c.clip(p);
    c.globalCompositeOperation = 'soft-light'; softCircle(c, -s * 0.1, -s * 0.15, s * 0.8, '#fff0c0', 0.4 + k * 0.4); c.globalCompositeOperation = 'source-over';
    const R2 = rng(6); for (let i = 0; i < 40; i++) { c.fillStyle = `rgba(40,30,20,${0.35 - k * 0.15})`; c.beginPath(); c.arc(R2.r(-0.8, 0.8) * s, R2.r(-0.3, 0.1) * s, s * 0.012, 0, TAU); c.fill(); }
    c.strokeStyle = `rgba(255,235,190,${0.2 + k * 0.3})`; c.lineWidth = s * 0.03; c.beginPath(); c.moveTo(-s * 0.8, -s * 0.05); c.quadraticCurveTo(0, -s * 0.3, s * 0.85, -s * 0.08); c.stroke();
    c.restore();
  } else {
    const g = c.createLinearGradient(0, -s * 0.4, 0, s * 0.3); g.addColorStop(0, mix('#f08f72', '#f3d6b8', k)); g.addColorStop(1, mix('#f7b69a', '#ffe9d0', k));
    c.fillStyle = g; c.fill(p);
    c.save(); c.clip(p); c.strokeStyle = `rgba(255,245,235,${0.6 - k * 0.3})`; c.lineWidth = s * 0.025;
    for (let i = -6; i < 8; i++) { c.beginPath(); c.moveTo(i * s * 0.15, -s * 0.5); c.quadraticCurveTo(i * s * 0.15 + s * 0.1, 0, i * s * 0.15, s * 0.4); c.stroke(); }
    c.restore();
  }
};

ING.carrot = (c, s, o = {}) => {
  // horizontal root, greens to the left
  const k = o.cook || 0, peeled = o.peeled || 0;
  const col = mix(mix('#d9782b', '#f08a2c', peeled), '#a8501c', k);
  c.strokeStyle = '#5f9a3e'; c.lineWidth = s * 0.04; c.lineCap = 'round';
  if (!o.noTop) for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(-s * 0.85, 0); c.quadraticCurveTo(-s * 1.1, (i - 2.5) * s * 0.06, -s * 1.45, (i - 2.5) * s * 0.16); c.stroke(); }
  const g = c.createLinearGradient(0, -s * 0.2, 0, s * 0.2); g.addColorStop(0, mix(col, '#ffd08a', 0.35)); g.addColorStop(1, mix(col, '#5a2a0a', 0.25));
  c.fillStyle = g; c.beginPath(); c.moveTo(-s * 0.9, -s * 0.18); c.quadraticCurveTo(0, -s * 0.2, s * 1.0, -s * 0.01); c.lineTo(s * 1.0, s * 0.01); c.quadraticCurveTo(0, s * 0.2, -s * 0.9, s * 0.18); c.quadraticCurveTo(-s * 0.98, 0, -s * 0.9, -s * 0.18); c.fill();
  c.strokeStyle = rgba('#7a3a10', 0.35 * (1 - peeled)); c.lineWidth = 1;
  for (let i = 0; i < 9; i++) { const x = -s * 0.8 + i * s * 0.2; c.beginPath(); c.moveTo(x, -s * 0.14 * (1 - i / 10)); c.lineTo(x + s * 0.03, s * 0.05); c.stroke(); }
};
ING.carrotCoin = (c, s, o = {}) => {
  const col = mix('#f39033', '#b8561c', o.cook || 0);
  c.fillStyle = col; c.beginPath(); c.ellipse(0, 0, s, s * 0.9, 0, 0, TAU); c.fill();
  c.fillStyle = mix(col, '#ffd08a', 0.4); c.beginPath(); c.ellipse(0, 0, s * 0.5, s * 0.45, 0, 0, TAU); c.fill();
};

ING.thyme = (c, s, o = {}) => {
  c.strokeStyle = '#7a6a4a'; c.lineWidth = s * 0.05; c.lineCap = 'round';
  c.beginPath(); c.moveTo(-s, s * 0.1); c.quadraticCurveTo(0, -s * 0.1, s, 0); c.stroke();
  const n = o.stripped ? Math.round(14 * (1 - o.stripped)) : 14;
  for (let i = 0; i < n; i++) { const t = i / 14, x = -s * 0.85 + t * s * 1.8, y = Math.sin(t * 3) * -s * 0.05; c.fillStyle = i % 2 ? '#6f9a5a' : '#8fb874'; for (const sd of [-1, 1]) { c.beginPath(); c.ellipse(x, y + sd * s * 0.09, s * 0.07, s * 0.04, sd * 0.5, 0, TAU); c.fill(); } }
};
ING.thymeLeaves = (c, s, o = {}) => { const R = rng(3); for (let i = 0; i < 18; i++) { c.fillStyle = mix(i % 2 ? '#6f9a5a' : '#8fb874', '#4a5a30', (o.cook || 0) * 0.5); c.beginPath(); c.ellipse(R.r(-s, s) * 0.8, R.r(-s, s) * 0.5, s * 0.08, s * 0.05, R.r(0, 3), 0, TAU); c.fill(); } };

ING.rosemary = (c, s, o = {}) => {
  c.strokeStyle = '#6d5a3f'; c.lineWidth = s * 0.05; c.beginPath(); c.moveTo(-s, 0); c.lineTo(s, -s * 0.05); c.stroke();
  for (let i = 0; i < 18; i++) { const x = -s * 0.9 + i * s * 0.105; for (const sd of [-1, 1]) { c.strokeStyle = i % 2 ? '#3f6b55' : '#5f8a70'; c.lineWidth = s * 0.05; c.beginPath(); c.moveTo(x, 0); c.lineTo(x + s * 0.1, sd * s * 0.22); c.stroke(); } }
};
ING.rosemaryChop = (c, s, o = {}) => { const R = rng(8); c.lineCap = 'round'; for (let i = 0; i < 16; i++) { c.strokeStyle = mix('#4f7a62', '#384a30', (o.cook || 0) * 0.5); c.lineWidth = s * 0.06; c.save(); c.translate(R.r(-s, s) * 0.8, R.r(-s, s) * 0.5); c.rotate(R.r(0, 3)); c.beginPath(); c.moveTo(-s * 0.12, 0); c.lineTo(s * 0.12, 0); c.stroke(); c.restore(); } };

ING.blackberry = (c, s, o = {}) => {
  const R = rng(21), k = o.cook || 0;
  for (let i = 0; i < 19; i++) {
    const a = i * 2.4, d = Math.sqrt(i / 19) * s * 0.7;
    const x = Math.cos(a) * d * 0.85, y = Math.sin(a) * d;
    const g = c.createRadialGradient(x - s * 0.06, y - s * 0.06, 0, x, y, s * 0.24);
    g.addColorStop(0, mix('#6b3a7a', '#a04a6a', k)); g.addColorStop(0.5, mix('#2a1033', '#5a1838', k)); g.addColorStop(1, '#12060f');
    c.fillStyle = g; c.beginPath(); c.arc(x, y, s * 0.22, 0, TAU); c.fill();
    c.fillStyle = 'rgba(255,255,255,.55)'; c.beginPath(); c.arc(x - s * 0.07, y - s * 0.07, s * 0.04, 0, TAU); c.fill();
  }
  if (!o.noLeaf) { c.fillStyle = '#4c7a3a'; for (let i = 0; i < 5; i++) { c.save(); c.translate(0, -s * 0.72); c.rotate(i * 1.25); c.beginPath(); c.ellipse(0, -s * 0.12, s * 0.06, s * 0.14, 0, 0, TAU); c.fill(); c.restore(); } }
};

ING.juniper = (c, s, o = {}) => {
  c.strokeStyle = '#6a5a3c'; c.lineWidth = s * 0.05; c.beginPath(); c.moveTo(-s, s * 0.3); c.quadraticCurveTo(0, 0, s, -s * 0.3); c.stroke();
  c.strokeStyle = '#4a7356'; c.lineWidth = s * 0.03;
  for (let i = 0; i < 16; i++) { const t = i / 16, x = -s + t * 2 * s, y = s * 0.3 - t * s * 0.6; for (const sd of [-1, 1]) { c.beginPath(); c.moveTo(x, y); c.lineTo(x + s * 0.08, y + sd * s * 0.2); c.stroke(); } }
  for (let i = 0; i < 6; i++) { const x = -s * 0.6 + i * s * 0.25, y = s * 0.2 - i * s * 0.15 + (i % 2 ? -s * 0.15 : s * 0.15); berry(c, x, y, s * 0.13, '#4b5d8f'); }
};
ING.juniperBerries = (c, s, o = {}) => { const R = rng(2); for (let i = 0; i < 9; i++) berry(c, R.r(-s, s) * 0.6, R.r(-s, s) * 0.5, s * 0.18, '#4b5d8f'); };
ING.juniperCrushed = (c, s, o = {}) => { const R = rng(2); for (let i = 0; i < 26; i++) { c.fillStyle = R.pick(['#3b4a74', '#5a6a95', '#6a5a40']); c.beginPath(); c.arc(R.r(-s, s) * 0.7, R.r(-s, s) * 0.5, s * R.r(0.03, 0.08), 0, TAU); c.fill(); } };

ING.porcini = (c, s, o = {}) => {
  const k = o.cook || 0;
  const sg = c.createLinearGradient(-s * 0.4, 0, s * 0.4, 0); sg.addColorStop(0, '#d9c9a7'); sg.addColorStop(1, '#f6ecd6');
  c.fillStyle = sg; c.beginPath(); c.moveTo(-s * 0.3, -s * 0.2); c.bezierCurveTo(-s * 0.55, s * 0.3, -s * 0.5, s * 0.9, 0, s * 0.92); c.bezierCurveTo(s * 0.5, s * 0.9, s * 0.55, s * 0.3, s * 0.3, -s * 0.2); c.fill();
  c.strokeStyle = 'rgba(160,140,100,.35)'; c.lineWidth = 0.8; for (let i = 0; i < 8; i++) { c.beginPath(); c.moveTo(-s * 0.3 + i * s * 0.08, s * 0.1 + (i % 2) * s * 0.1); c.lineTo(-s * 0.26 + i * s * 0.08, s * 0.2 + (i % 2) * s * 0.1); c.stroke(); }
  const cg = c.createRadialGradient(-s * 0.2, -s * 0.55, s * 0.05, 0, -s * 0.3, s * 0.8);
  cg.addColorStop(0, mix('#b07a45', '#6a3a1a', k)); cg.addColorStop(0.7, mix('#7a4522', '#3a1c0a', k)); cg.addColorStop(1, '#4a2812');
  c.fillStyle = cg; c.beginPath(); c.moveTo(-s * 0.78, -s * 0.18); c.bezierCurveTo(-s * 0.8, -s * 0.8, s * 0.8, -s * 0.8, s * 0.78, -s * 0.18); c.quadraticCurveTo(0, -s * 0.05, -s * 0.78, -s * 0.18); c.fill();
  c.fillStyle = 'rgba(255,235,200,.25)'; c.beginPath(); c.ellipse(-s * 0.25, -s * 0.5, s * 0.2, s * 0.08, -0.3, 0, TAU); c.fill();
  if (o.dirt) dirtSpeckle(c, s, o.dirt, 13);
};
ING.porciniSlice = (c, s, o = {}) => {
  const k = o.cook || 0;
  c.fillStyle = mix('#f3e6c8', '#b07a3a', k); c.beginPath(); c.moveTo(-s * 0.25, s); c.lineTo(-s * 0.3, -s * 0.2); c.bezierCurveTo(-s * 0.9, -s * 0.2, -s * 0.8, -s * 0.85, 0, -s * 0.85); c.bezierCurveTo(s * 0.8, -s * 0.85, s * 0.9, -s * 0.2, s * 0.3, -s * 0.2); c.lineTo(s * 0.25, s); c.closePath(); c.fill();
  c.strokeStyle = mix('#6a3a1a', '#3a1c0a', k); c.lineWidth = s * 0.08; c.beginPath(); c.moveTo(-s * 0.85, -s * 0.25); c.bezierCurveTo(-s * 0.85, -s * 0.85, s * 0.85, -s * 0.85, s * 0.85, -s * 0.25); c.stroke();
};

ING.strawberry = (c, s) => {
  const g = c.createRadialGradient(-s * 0.2, -s * 0.2, 0, 0, 0, s); g.addColorStop(0, '#ff6b5a'); g.addColorStop(1, '#b3172a');
  c.fillStyle = g; c.beginPath(); c.moveTo(0, s); c.bezierCurveTo(-s, s * 0.2, -s * 0.7, -s * 0.7, 0, -s * 0.6); c.bezierCurveTo(s * 0.7, -s * 0.7, s, s * 0.2, 0, s); c.fill();
  c.fillStyle = '#ffe9a0'; for (let i = 0; i < 10; i++) { c.beginPath(); c.arc(Math.sin(i * 2.4) * s * 0.4, -s * 0.2 + (i / 10) * s, s * 0.04, 0, TAU); c.fill(); }
  c.fillStyle = '#4c8a3a'; for (let i = 0; i < 5; i++) { c.save(); c.translate(0, -s * 0.6); c.rotate(-1.2 + i * 0.6); c.beginPath(); c.ellipse(0, -s * 0.15, s * 0.08, s * 0.22, 0, 0, TAU); c.fill(); c.restore(); }
};
ING.hazelnut = (c, s) => {
  const g = c.createRadialGradient(-s * 0.3, -s * 0.2, 0, 0, 0, s); g.addColorStop(0, '#c58a4e'); g.addColorStop(1, '#6a3c1a');
  c.fillStyle = g; c.beginPath(); c.ellipse(0, s * 0.1, s * 0.7, s * 0.75, 0, 0, TAU); c.fill();
  c.fillStyle = '#7c9a4a'; c.beginPath(); c.moveTo(-s * 0.8, -s * 0.2); c.quadraticCurveTo(0, -s * 1.2, s * 0.8, -s * 0.2); c.quadraticCurveTo(s * 0.3, -s * 0.45, 0, -s * 0.3); c.quadraticCurveTo(-s * 0.3, -s * 0.45, -s * 0.8, -s * 0.2); c.fill();
};
ING.elderflower = (c, s) => {
  c.strokeStyle = '#6a8a4a'; c.lineWidth = s * 0.05;
  for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * 0.32; c.beginPath(); c.moveTo(0, s * 0.8); c.lineTo(Math.cos(a) * s * 0.7, Math.sin(a) * s * 0.4); c.stroke(); }
  const R = rng(14);
  for (let i = 0; i < 40; i++) { const a = R.r(-Math.PI, 0), d = R.r(0.2, 0.85) * s; flower(c, Math.cos(a) * d, Math.sin(a) * d * 0.6 - s * 0.1, s * 0.07, '#fffbe8', '#f3e4a0'); }
};

// Larder items
ING.butter = (c, s, o = {}) => {
  const m = o.melt || 0;
  if (m > 0.6) { c.fillStyle = `rgba(255,214,120,${0.8 - (m - 0.6)})`; c.beginPath(); c.ellipse(0, 0, s * (1 + m), s * 0.55 * (1 + m), 0, 0, TAU); c.fill(); return; }
  c.save(); c.scale(1 + m * 0.6, 1 - m * 0.5);
  c.fillStyle = '#f9e08a'; rrect(c, -s * 0.7, -s * 0.45, s * 1.4, s * 0.9, s * 0.12); c.fill();
  c.fillStyle = '#fff3c0'; rrect(c, -s * 0.7, -s * 0.45, s * 1.4, s * 0.3, s * 0.12); c.fill();
  c.restore();
};
ING.bread = (c, s, o = {}) => {
  const k = o.cook || 0;
  c.fillStyle = mix('#b8763c', '#7a4418', k); c.beginPath(); c.ellipse(0, 0, s * 1.1, s * 0.75, 0, 0, TAU); c.fill();
  c.fillStyle = mix('#f2dcae', '#d9a25a', k); c.beginPath(); c.ellipse(0, 0, s * 0.98, s * 0.64, 0, 0, TAU); c.fill();
  const R = rng(31); c.fillStyle = 'rgba(160,110,60,.35)'; for (let i = 0; i < 24; i++) { c.beginPath(); c.arc(R.r(-0.8, 0.8) * s, R.r(-0.5, 0.5) * s, R.r(1, 3), 0, TAU); c.fill(); }
};
ING.pastry = (c, s, o = {}) => {
  const k = o.cook || 0, r = o.rolled || 0;
  const rx = s * (0.55 + r * 0.6), ry = s * (0.5 + r * 0.5);
  const g = c.createRadialGradient(-rx * 0.3, -ry * 0.3, 0, 0, 0, rx);
  g.addColorStop(0, mix('#fbeed2', '#e4a24e', k)); g.addColorStop(1, mix('#e9cf9f', '#b0631e', k));
  c.fillStyle = g; c.beginPath(); c.ellipse(0, 0, rx, ry, 0, 0, TAU); c.fill();
  c.fillStyle = 'rgba(255,255,255,.25)'; c.beginPath(); c.ellipse(-rx * 0.3, -ry * 0.35, rx * 0.3, ry * 0.12, -0.3, 0, TAU); c.fill();
};
ING.handPie = (c, s, o = {}) => {
  const k = o.cook || 0;
  const g = c.createLinearGradient(0, -s * 0.6, 0, s * 0.6); g.addColorStop(0, mix('#f3d9a6', '#d98a2e', k)); g.addColorStop(1, mix('#e2bd82', '#9a5214', k));
  c.fillStyle = g; c.beginPath(); c.moveTo(-s, s * 0.35); c.bezierCurveTo(-s, -s * 0.9, s, -s * 0.9, s, s * 0.35); c.closePath(); c.fill();
  c.strokeStyle = mix('#d8b27a', '#8a4a14', k); c.lineWidth = s * 0.06;
  for (let i = 0; i < 11; i++) { const x = -s * 0.92 + i * s * 0.184; c.beginPath(); c.moveTo(x, s * 0.36); c.lineTo(x, s * 0.2); c.stroke(); }
  c.strokeStyle = mix('#c9965a', '#6a3410', k); c.lineWidth = s * 0.04;
  for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(-s * 0.3 + i * s * 0.3, -s * 0.35); c.lineTo(-s * 0.2 + i * s * 0.3, -s * 0.1); c.stroke(); }
  c.fillStyle = `rgba(255,240,200,${0.25 + k * 0.2})`; c.beginPath(); c.ellipse(-s * 0.3, -s * 0.35, s * 0.3, s * 0.1, -0.4, 0, TAU); c.fill();
};

// Game meat: shown plainly, never gory.
ING.rabbitDressed = (c, s, o = {}) => {
  const k = o.cook || 0;
  const meat = (x, y, rx, ry, rot) => {
    const g = c.createRadialGradient(x - rx * 0.3, y - ry * 0.4, 0, x, y, Math.max(rx, ry));
    g.addColorStop(0, mix('#f4c6b6', '#d88e4a', k)); g.addColorStop(0.7, mix('#e3a090', '#b0642a', k)); g.addColorStop(1, mix('#c47a6c', '#7a3e14', k));
    c.fillStyle = g; c.beginPath(); c.ellipse(x, y, rx, ry, rot, 0, TAU); c.fill();
  };
  const parts = o.parts || { fore: 1, hind: 1, saddle: 1 };
  if (parts.saddle) meat(0, 0, s * 0.62, s * 0.26, 0);
  if (parts.fore) { meat(s * 0.72, -s * 0.2, s * 0.22, s * 0.11, -0.5); meat(s * 0.72, s * 0.2, s * 0.22, s * 0.11, 0.5); }
  if (parts.hind) { meat(-s * 0.78, -s * 0.22, s * 0.3, s * 0.15, 0.4); meat(-s * 0.78, s * 0.22, s * 0.3, s * 0.15, -0.4); }
  c.fillStyle = 'rgba(255,255,255,.25)'; c.beginPath(); c.ellipse(-s * 0.1, -s * 0.1, s * 0.35, s * 0.06, 0, 0, TAU); c.fill();
};
ING.rabbitPiece = (c, s, o = {}) => {
  const k = o.cook || 0;
  const g = c.createRadialGradient(-s * 0.3, -s * 0.3, 0, 0, 0, s);
  g.addColorStop(0, mix('#f4c6b6', '#d8954e', k)); g.addColorStop(1, mix('#c47a6c', '#7a3e14', k));
  c.fillStyle = g; c.beginPath(); c.ellipse(0, 0, s, s * 0.55, 0.3, 0, TAU); c.fill();
};

ING.pheasantPlucked = (c, s, o = {}) => {
  // plump bird shape, top-down-ish, pale skin
  const k = o.cook || 0;
  const g = c.createRadialGradient(-s * 0.2, -s * 0.3, s * 0.1, 0, 0, s);
  g.addColorStop(0, mix('#fbe3cf', '#e8a24a', k)); g.addColorStop(0.75, mix('#ecc0a2', '#b86a24', k)); g.addColorStop(1, mix('#d19c80', '#7a3e12', k));
  c.fillStyle = g;
  c.beginPath(); c.ellipse(0, 0, s * 0.8, s * 0.6, 0, 0, TAU); c.fill();
  c.beginPath(); c.ellipse(-s * 0.72, s * 0.32, s * 0.28, s * 0.14, 0.6, 0, TAU); c.fill();
  c.beginPath(); c.ellipse(-s * 0.72, -s * 0.32, s * 0.28, s * 0.14, -0.6, 0, TAU); c.fill();
  c.fillStyle = mix('#f3d7c2', '#d6923e', k); c.beginPath(); c.ellipse(-s * 0.95, s * 0.42, s * 0.08, s * 0.06, 0, 0, TAU); c.fill(); c.beginPath(); c.ellipse(-s * 0.95, -s * 0.42, s * 0.08, s * 0.06, 0, 0, TAU); c.fill();
  c.strokeStyle = `rgba(150,90,60,${0.25})`; c.lineWidth = 1.2; c.beginPath(); c.moveTo(s * 0.7, 0); c.quadraticCurveTo(0, -s * 0.05, -s * 0.6, 0); c.stroke();
  c.fillStyle = 'rgba(255,255,255,.3)'; c.beginPath(); c.ellipse(-s * 0.1, -s * 0.3, s * 0.4, s * 0.1, -0.1, 0, TAU); c.fill();
};
ING.pheasantBreast = (c, s, o = {}) => {
  const k = o.cook || 0, glaze = o.glaze || 0;
  const g = c.createRadialGradient(-s * 0.3, -s * 0.3, 0, 0, 0, s);
  g.addColorStop(0, mix(mix('#f1c3a8', '#e09a4a', k), '#7a2a4a', glaze * 0.6)); g.addColorStop(1, mix(mix('#d08a70', '#8a4412', k), '#3a1028', glaze * 0.6));
  c.fillStyle = g; c.beginPath(); c.moveTo(s, 0); c.bezierCurveTo(s * 0.8, -s * 0.6, -s * 0.8, -s * 0.6, -s, 0); c.bezierCurveTo(-s * 0.6, s * 0.45, s * 0.6, s * 0.45, s, 0); c.fill();
  c.fillStyle = `rgba(255,255,255,${0.2 + glaze * 0.3})`; c.beginPath(); c.ellipse(-s * 0.2, -s * 0.22, s * 0.4, s * 0.07, -0.1, 0, TAU); c.fill();
};

ING.venison = (c, s, o = {}) => {
  const k = o.cook || 0;
  c.save();
  const g = c.createLinearGradient(0, -s * 0.6, 0, s * 0.6); g.addColorStop(0, mix('#9a2f2c', '#6a3a1c', k)); g.addColorStop(1, mix('#6a1a1c', '#3a1e0c', k));
  c.fillStyle = g; rrect(c, -s, -s * 0.55, s * 2, s * 1.1, s * 0.3); c.fill();
  c.fillStyle = mix('#f6e9da', '#d0a060', k); rrect(c, -s, -s * 0.55, s * 2, s * 0.14, s * 0.1); c.fill();
  c.strokeStyle = `rgba(255,230,220,${0.35 - k * 0.2})`; c.lineWidth = 1;
  const R = rng(19); for (let i = 0; i < 10; i++) { c.beginPath(); const x = R.r(-0.9, 0.9) * s, y = R.r(-0.3, 0.45) * s; c.moveTo(x, y); c.quadraticCurveTo(x + 8, y - 4, x + 16, y + 2); c.stroke(); }
  c.fillStyle = 'rgba(255,255,255,.12)'; c.beginPath(); c.ellipse(-s * 0.3, -s * 0.2, s * 0.5, s * 0.08, 0, 0, TAU); c.fill();
  c.restore();
};
ING.venisonDice = (c, s, o = {}) => {
  const k = o.cook || 0;
  c.fillStyle = mix('#8a2a28', '#5a2c12', k); rrect(c, -s * 0.8, -s * 0.8, s * 1.6, s * 1.6, s * 0.3); c.fill();
  c.fillStyle = mix('#b04a40', '#8a4a1c', k); rrect(c, -s * 0.8, -s * 0.8, s * 1.6, s * 0.5, s * 0.25); c.fill();
};

// ── Small painting helpers ──────────────────────────────────────────────────
function leaf(c, x, y, len, w, col, vein) {
  const g = c.createLinearGradient(-w, 0, w, 0); g.addColorStop(0, mix(col, '#000000', 0.15)); g.addColorStop(1, mix(col, '#ffffff', 0.12));
  c.fillStyle = g;
  c.beginPath(); c.moveTo(x, y); c.bezierCurveTo(x - w, y - len * 0.3, x - w * 0.6, y - len * 0.8, x, y - len); c.bezierCurveTo(x + w * 0.6, y - len * 0.8, x + w, y - len * 0.3, x, y); c.fill();
  c.strokeStyle = rgba(vein || '#d8f0b0', 0.5); c.lineWidth = Math.max(0.6, w * 0.08);
  c.beginPath(); c.moveTo(x, y); c.lineTo(x, y - len * 0.95); c.stroke();
}
function arrowLeaf(c, x, y, len, w, col) {
  c.strokeStyle = mix(col, '#2a4a1a', 0.3); c.lineWidth = w * 0.12; c.beginPath(); c.moveTo(x, y); c.lineTo(x, y - len * 0.5); c.stroke();
  c.fillStyle = col;
  c.beginPath(); c.moveTo(x, y - len); c.bezierCurveTo(x + w, y - len * 0.8, x + w, y - len * 0.5, x + w * 0.7, y - len * 0.35); c.lineTo(x, y - len * 0.5); c.lineTo(x - w * 0.7, y - len * 0.35); c.bezierCurveTo(x - w, y - len * 0.5, x - w, y - len * 0.8, x, y - len); c.fill();
  c.strokeStyle = 'rgba(220,245,190,.5)'; c.lineWidth = 0.8; c.beginPath(); c.moveTo(x, y - len * 0.5); c.lineTo(x, y - len * 0.95); c.stroke();
}
function flower(c, x, y, r, col, mid) {
  c.fillStyle = col;
  for (let i = 0; i < 5; i++) { const a = (i / 5) * TAU; c.beginPath(); c.arc(x + Math.cos(a) * r * 0.6, y + Math.sin(a) * r * 0.6, r * 0.5, 0, TAU); c.fill(); }
  c.fillStyle = mid; c.beginPath(); c.arc(x, y, r * 0.35, 0, TAU); c.fill();
}
function berry(c, x, y, r, col) {
  const g = c.createRadialGradient(x - r * 0.3, y - r * 0.3, 0, x, y, r);
  g.addColorStop(0, mix(col, '#c8d4f0', 0.5)); g.addColorStop(1, mix(col, '#101830', 0.4));
  c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill();
}
function dirtSpeckle(c, s, amt, seed) {
  const R = rng(seed);
  for (let i = 0; i < 40 * amt; i++) { c.fillStyle = `rgba(${R.pick(['70,50,30', '100,75,45', '50,40,30'])},${R.r(0.35, 0.8)})`; c.beginPath(); c.arc(R.r(-0.7, 0.7) * s, R.r(-0.6, 0.8) * s, R.r(0.5, 2.2), 0, TAU); c.fill(); }
}

// Cached sprite rendering so heavy ingredients draw once per size/state.
const SpriteCache = new Map();
function sprite(name, s, opt = {}) {
  const key = name + '|' + Math.round(s) + '|' + JSON.stringify(opt);
  let cv = SpriteCache.get(key);
  if (!cv) {
    const pad = s * 1.8, sc = Math.min(G.dpr, 2);
    cv = makeCanvas(pad * 2, pad * 2, sc);
    const c = cv.getContext('2d');
    c.translate(pad, pad);
    (ING[name] || ING.butter)(c, s, opt);
    cv.pad = pad;
    if (SpriteCache.size > 400) SpriteCache.clear();
    SpriteCache.set(key, cv);
  }
  return cv;
}
function drawSprite(c, name, x, y, s, opt, rot = 0, alpha = 1, scale = 1) {
  const cv = sprite(name, s, opt);
  c.save(); c.translate(x, y); if (rot) c.rotate(rot); if (scale !== 1) c.scale(scale, scale);
  c.globalAlpha *= alpha;
  c.drawImage(cv, -cv.pad, -cv.pad, cv.pad * 2, cv.pad * 2);
  c.restore();
}

// Basket icon used in HUD
function drawBasket(c, x, y, s) {
  c.save(); c.translate(x, y);
  c.strokeStyle = '#7a5230'; c.lineWidth = s * 0.08; c.beginPath(); c.arc(0, -s * 0.1, s * 0.6, Math.PI, 0); c.stroke();
  const g = c.createLinearGradient(0, -s * 0.1, 0, s * 0.6); g.addColorStop(0, '#c48a4e'); g.addColorStop(1, '#7a4f2a');
  c.fillStyle = g; c.beginPath(); c.moveTo(-s * 0.75, -s * 0.1); c.lineTo(s * 0.75, -s * 0.1); c.lineTo(s * 0.55, s * 0.6); c.lineTo(-s * 0.55, s * 0.6); c.closePath(); c.fill();
  c.strokeStyle = 'rgba(60,35,15,.4)'; c.lineWidth = 1;
  for (let i = 1; i < 4; i++) { c.beginPath(); c.moveTo(-s * 0.75 + i * 0.05 * s, -s * 0.1 + i * s * 0.17); c.lineTo(s * 0.75 - i * 0.05 * s, -s * 0.1 + i * s * 0.17); c.stroke(); }
  c.restore();
}
