// Hearthwild · real-time 3D plating. Builds each finished dish as a small
// lit still life (glazed plates, glossy sauces, steam) and the night feast table.
// Exposes window.Dish3D; the 2D game falls back to its painted dishes if WebGL is missing.
import * as THREE from 'three';
import { RoomEnvironment } from '../vendor/RoomEnvironment.js';

const TAU = Math.PI * 2;
let seed = 1;
const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const rr = (a, b) => a + (b - a) * rnd();
const hash = (x, y) => { const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return s - Math.floor(s); };
function vnoise(x, y) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
const fbm = (x, y) => vnoise(x, y) * 0.55 + vnoise(x * 2.1, y * 2.1) * 0.3 + vnoise(x * 4.3, y * 4.3) * 0.15;

// ── Canvas textures ────────────────────────────────────────────────────────
const texCache = {};
function canvasTex(key, w, h, paint, { repeat = 1, srgb = true } = {}) {
  if (texCache[key]) return texCache[key];
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
  const c = cv.getContext('2d'); paint(c, w, h);
  const t = new THREE.CanvasTexture(cv);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(repeat, repeat);
  t.anisotropy = 8;
  return (texCache[key] = t);
}
function speckle(c, w, h, n, colors, rmin, rmax) {
  for (let i = 0; i < n; i++) {
    c.fillStyle = colors[(rnd() * colors.length) | 0];
    c.globalAlpha = rr(0.15, 0.7);
    c.beginPath(); c.ellipse(rnd() * w, rnd() * h, rr(rmin, rmax), rr(rmin, rmax) * rr(0.5, 1), rnd() * 6, 0, TAU); c.fill();
  }
  c.globalAlpha = 1;
}
const T = {
  wood: () => canvasTex('wood', 1024, 1024, (c, w, h) => {
    seed = 11;
    const planks = 5, ph = h / planks;
    for (let p = 0; p < planks; p++) {
      const base = ['#7a4a2a', '#6c3f22', '#835233', '#734628', '#6a3d20'][p];
      c.fillStyle = base; c.fillRect(0, p * ph, w, ph);
      for (let i = 0; i < 70; i++) {
        const y = p * ph + rnd() * ph, a = rr(0.04, 0.16);
        c.strokeStyle = rnd() < 0.5 ? `rgba(40,20,8,${a})` : `rgba(200,140,90,${a * 0.6})`;
        c.lineWidth = rr(0.6, 2.6); c.beginPath(); c.moveTo(0, y);
        for (let x = 0; x <= w; x += 32) c.lineTo(x, y + Math.sin(x * 0.006 + i + p) * rr(1, 5));
        c.stroke();
      }
      if (rnd() < 0.8) { const kx = rr(100, w - 100), ky = p * ph + rr(20, ph - 20); for (let k = 0; k < 7; k++) { c.strokeStyle = `rgba(50,24,10,${0.25 - k * 0.03})`; c.lineWidth = 1.4; c.beginPath(); c.ellipse(kx, ky, 6 + k * 7, 3 + k * 3, 0, 0, TAU); c.stroke(); } }
      c.fillStyle = 'rgba(20,10,4,.55)'; c.fillRect(0, p * ph, w, 3);
    }
  }, { repeat: 3 }),
  linen: () => canvasTex('linen', 512, 512, (c, w, h) => {
    seed = 5; c.fillStyle = '#efe6d6'; c.fillRect(0, 0, w, h);
    for (let x = 0; x < w; x += 3) { c.fillStyle = `rgba(150,128,96,${rr(0.04, 0.12)})`; c.fillRect(x, 0, 1, h); }
    for (let y = 0; y < h; y += 3) { c.fillStyle = `rgba(150,128,96,${rr(0.04, 0.12)})`; c.fillRect(0, y, w, 1); }
    for (let i = 0; i < 400; i++) { c.fillStyle = `rgba(255,255,255,${rr(0.05, 0.2)})`; c.fillRect(rnd() * w, rnd() * h, rr(4, 14), 1); }
  }, { repeat: 4 }),
  stripe: () => canvasTex('stripe', 64, 512, (c, w, h) => {
    c.fillStyle = '#efe6d6'; c.fillRect(0, 0, w, h);
    c.fillStyle = '#a5503c'; c.fillRect(0, 0, w, 10); c.fillRect(0, 18, w, 4); c.fillRect(0, h - 10, w, 10); c.fillRect(0, h - 22, w, 4);
  }),
  stone: () => canvasTex('stone', 512, 512, (c, w, h) => {
    seed = 9; c.fillStyle = '#c9bca6'; c.fillRect(0, 0, w, h);
    speckle(c, w, h, 2600, ['#7a6a58', '#9a8a74', '#5a4c40', '#e8dcc6'], 0.6, 2.2);
  }),
  crumb: () => canvasTex('crumb', 512, 512, (c, w, h) => {
    seed = 21; const g = c.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w * 0.7);
    g.addColorStop(0, '#e9b766'); g.addColorStop(0.7, '#c98a3e'); g.addColorStop(1, '#8a5222');
    c.fillStyle = g; c.fillRect(0, 0, w, h);
    speckle(c, w, h, 700, ['#6a3a14', '#f6d398', '#a8682a'], 1.5, 7);
    for (let i = 0; i < 260; i++) { c.fillStyle = `rgba(80,40,12,${rr(0.2, 0.5)})`; c.beginPath(); c.ellipse(rnd() * w, rnd() * h, rr(2, 8), rr(1.5, 5), rnd() * 6, 0, TAU); c.fill(); }
  }),
  skin: () => canvasTex('skin', 512, 512, (c, w, h) => {
    seed = 31; const g = c.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#3a2e22'); g.addColorStop(0.35, '#7a5a34'); g.addColorStop(0.6, '#c8924a'); g.addColorStop(0.8, '#b8a890'); g.addColorStop(1, '#6a4a2a');
    c.fillStyle = g; c.fillRect(0, 0, w, h);
    for (let i = 0; i < 60; i++) { c.strokeStyle = `rgba(255,230,180,${rr(0.04, 0.12)})`; c.lineWidth = rr(1, 3); c.beginPath(); const y = rnd() * h; c.moveTo(0, y); c.bezierCurveTo(w * 0.3, y + rr(-20, 20), w * 0.6, y + rr(-20, 20), w, y + rr(-10, 10)); c.stroke(); }
    speckle(c, w, h * 0.55, 500, ['#2a1c10', '#3a2614'], 1, 3.5);
    for (let i = 0; i < 90; i++) { c.fillStyle = `rgba(40,18,6,${rr(0.15, 0.4)})`; c.beginPath(); c.ellipse(rnd() * w, rnd() * h, rr(6, 22), rr(3, 9), rnd() * 6, 0, TAU); c.fill(); }
  }),
  pastry: () => canvasTex('pastry', 512, 512, (c, w, h) => {
    seed = 41; c.fillStyle = '#d99a48'; c.fillRect(0, 0, w, h);
    for (let y = 0; y < h; y += 4) for (let x = 0; x < w; x += 4) { const n = fbm(x / 60, y / 60); c.fillStyle = `rgba(${n > 0.55 ? '120,58,16' : '255,214,140'},${Math.abs(n - 0.5) * 0.9})`; c.fillRect(x, y, 4, 4); }
    speckle(c, w, h, 300, ['#fff2d0', '#7a3a10'], 0.8, 2.4);
  }),
  carrot: () => canvasTex('carrot', 256, 256, (c, w, h) => {
    const g = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    g.addColorStop(0, '#ffc060'); g.addColorStop(0.42, '#ffb048'); g.addColorStop(0.5, '#e87a1e'); g.addColorStop(0.9, '#f08a28'); g.addColorStop(1, '#c45a10');
    c.fillStyle = g; c.fillRect(0, 0, w, h);
    c.strokeStyle = 'rgba(255,220,150,.35)'; for (let a = 0; a < TAU; a += TAU / 18) { c.beginPath(); c.moveTo(w / 2, h / 2); c.lineTo(w / 2 + Math.cos(a) * w * 0.4, h / 2 + Math.sin(a) * h * 0.4); c.stroke(); }
  }),
  porcini: () => canvasTex('porcini', 256, 256, (c, w, h) => {
    seed = 51; c.fillStyle = '#f2e2c0'; c.fillRect(0, 0, w, h);
    const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, 'rgba(110,60,24,1)'); g.addColorStop(0.18, 'rgba(140,80,34,1)'); g.addColorStop(0.24, 'rgba(210,160,100,.45)'); g.addColorStop(1, 'rgba(200,150,90,.15)');
    c.fillStyle = g; c.fillRect(0, 0, w, h);
    speckle(c, w, h, 200, ['#b07a3e', '#fff6e0'], 1, 4);
  }),
  breast: () => canvasTex('breast', 256, 256, (c, w, h) => {
    const g = c.createRadialGradient(w / 2, h * 0.05, 0, w / 2, h * 0.05, h * 1.0);
    g.addColorStop(0, '#e88a84'); g.addColorStop(0.55, '#d87268'); g.addColorStop(0.8, '#c06a50'); g.addColorStop(0.92, '#8a4a22'); g.addColorStop(1, '#5a2a10');
    c.fillStyle = g; c.fillRect(0, 0, w, h);
    for (let i = 0; i < 40; i++) { c.strokeStyle = `rgba(255,220,210,${rr(0.05, 0.15)})`; c.beginPath(); c.moveTo(rnd() * w, 0); c.lineTo(rnd() * w, h); c.stroke(); }
  }),
  soft: () => canvasTex('soft', 128, 128, (c, w, h) => {
    const g = c.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.35, 'rgba(255,255,255,.45)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    c.fillStyle = g; c.fillRect(0, 0, w, h);
  }),
  flame: () => canvasTex('flame', 64, 128, (c, w, h) => {
    const g = c.createRadialGradient(w / 2, h * 0.68, 2, w / 2, h * 0.62, h * 0.5);
    g.addColorStop(0, 'rgba(255,255,235,1)'); g.addColorStop(0.25, 'rgba(255,214,120,.95)'); g.addColorStop(0.6, 'rgba(255,140,40,.4)'); g.addColorStop(1, 'rgba(255,90,20,0)');
    c.fillStyle = g; c.beginPath(); c.moveTo(w / 2, 4); c.bezierCurveTo(w, h * 0.5, w * 0.9, h, w / 2, h); c.bezierCurveTo(w * 0.1, h, 0, h * 0.5, w / 2, 4); c.fill();
  }),
  night: () => canvasTex('night', 1024, 1024, (c, w, h) => {
    seed = 77; const g = c.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#070a1e'); g.addColorStop(0.45, '#1a1840'); g.addColorStop(0.7, '#3a2a58'); g.addColorStop(0.86, '#7a4a62'); g.addColorStop(1, '#2a1a26');
    c.fillStyle = g; c.fillRect(0, 0, w, h);
    for (let i = 0; i < 900; i++) { const y = Math.pow(rnd(), 1.6) * h * 0.75, s = rr(0.3, 1.4); c.fillStyle = `rgba(255,${(rr(225, 255)) | 0},${(rr(200, 255)) | 0},${rr(0.25, 1) * (1 - y / h)})`; c.beginPath(); c.arc(rnd() * w, y, s, 0, TAU); c.fill(); }
    // milky way haze
    c.save(); c.globalCompositeOperation = 'lighter'; c.translate(w / 2, h * 0.3); c.rotate(-0.4);
    for (let i = 0; i < 70; i++) { const gx = rr(-w * 0.7, w * 0.7), gy = rr(-40, 40); const rg = c.createRadialGradient(gx, gy, 0, gx, gy, rr(40, 120)); rg.addColorStop(0, 'rgba(170,160,220,.05)'); rg.addColorStop(1, 'rgba(170,160,220,0)'); c.fillStyle = rg; c.fillRect(gx - 120, gy - 120, 240, 240); }
    c.restore();
    // pine silhouettes
    const ridge = (base, amp, col, n) => { c.fillStyle = col; c.beginPath(); c.moveTo(0, h); for (let x = 0; x <= w; x += w / n) { const t = base - rr(0, amp); c.lineTo(x - w / n * 0.5, base + 8); c.lineTo(x, t); } c.lineTo(w, h); c.fill(); };
    ridge(h * 0.86, h * 0.1, '#1e1530', 50); ridge(h * 0.92, h * 0.16, '#120c1c', 36);
  }, { repeat: 1 }),
};

// ── Materials ──────────────────────────────────────────────────────────────
const M = {
  phys: (o) => new THREE.MeshPhysicalMaterial(o),
  std: (o) => new THREE.MeshStandardMaterial(o),
};
function glossy(color, o = {}) { return M.phys(Object.assign({ color, roughness: 0.38, clearcoat: 0.7, clearcoatRoughness: 0.25 }, o)); }

// ── Geometry helpers ───────────────────────────────────────────────────────
function shadowed(o) { o.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } }); return o; }
function blob(rx, ry, rz, amp = 0.08, freq = 3, s = 1, seg = 28) {
  const g = new THREE.SphereGeometry(1, seg, Math.round(seg * 0.7));
  const p = g.attributes.position, v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const n = 1 + (fbm(v.x * freq + s * 7, v.y * freq + v.z * freq + s * 3) - 0.5) * amp * 2;
    p.setXYZ(i, v.x * rx * n, v.y * ry * n * (v.y < 0 ? 0.45 : 1), v.z * rz * n);
  }
  g.computeVertexNormals();
  return g;
}
function flatLie(geo) { geo.rotateX(-Math.PI / 2); return geo; }
function normUV(geo) {
  geo.computeBoundingBox(); const b = geo.boundingBox, uv = geo.attributes.uv, p = geo.attributes.position;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, (p.getX(i) - b.min.x) / (b.max.x - b.min.x), (p.getY(i) - b.min.y) / (b.max.y - b.min.y));
  return geo;
}
function leafShape(len, wid, arrow = 0) {
  const s = new THREE.Shape(); s.moveTo(0, 0);
  if (arrow) { s.bezierCurveTo(wid * 0.2, -wid * 0.6, wid * 0.9, -wid * 0.3, wid, len * 0.25); }
  s.bezierCurveTo(wid * 1.1, len * 0.55, wid * 0.4, len * 0.9, 0, len);
  s.bezierCurveTo(-wid * 0.4, len * 0.9, -wid * 1.1, len * 0.55, -wid, len * 0.25);
  if (arrow) s.bezierCurveTo(-wid * 0.9, -wid * 0.3, -wid * 0.2, -wid * 0.6, 0, 0);
  else s.lineTo(0, 0);
  return s;
}
function leaf(len, wid, color, arrow) {
  const g = new THREE.ShapeGeometry(leafShape(len, wid, arrow), 10), p = g.attributes.position;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i); p.setZ(i, (x * x) / (wid * wid) * wid * 0.5 + Math.sin(y / len * Math.PI) * len * 0.06); }
  g.computeVertexNormals(); flatLie(g);
  const mesh = new THREE.Mesh(g, M.phys({ color, roughness: 0.45, side: THREE.DoubleSide, sheen: 0.15, sheenColor: new THREE.Color('#d8ffb0'), clearcoat: 0.3 }));
  // central vein
  const vein = new THREE.Mesh(new THREE.CylinderGeometry(len * 0.012, len * 0.006, len * 0.9, 4), M.std({ color: new THREE.Color(color).offsetHSL(0.02, -0.1, 0.12), roughness: 0.6 }));
  vein.rotation.x = Math.PI / 2; vein.position.set(0, wid * 0.05, -len * 0.47);
  const gr = new THREE.Group(); gr.add(mesh, vein); return gr;
}
function instanced(geo, mat, n, place) {
  const im = new THREE.InstancedMesh(geo, mat, n), o = new THREE.Object3D();
  for (let i = 0; i < n; i++) { o.position.set(0, 0, 0); o.rotation.set(0, 0, 0); o.scale.set(1, 1, 1); place(o, i); o.updateMatrix(); im.setMatrixAt(i, o.matrix); }
  im.castShadow = im.receiveShadow = true; return im;
}
function sprig(len, leafLen, color, needles = false) {
  const pts = []; for (let i = 0; i <= 6; i++) { const t = i / 6; pts.push(new THREE.Vector3(Math.sin(t * 2) * len * 0.08, 0.02 + Math.sin(t * Math.PI) * 0.02, -t * len)); }
  const curve = new THREE.CatmullRomCurve3(pts);
  const g = new THREE.Group();
  g.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 20, len * 0.012, 5), M.std({ color: needles ? '#6a5a3a' : '#7a6a48', roughness: 0.7 })));
  const n = needles ? 34 : 22;
  const lg = needles ? new THREE.CapsuleGeometry(leafLen * 0.09, leafLen, 2, 5) : new THREE.SphereGeometry(leafLen * 0.5, 7, 5);
  if (!needles) lg.scale(1, 0.35, 0.6);
  g.add(instanced(lg, M.phys({ color, roughness: 0.5, sheen: 0.5, sheenColor: new THREE.Color('#c0e0b0') }), n, (o, i) => {
    const t = 0.05 + (i / n) * 0.95, p = curve.getPointAt(t), side = i % 2 ? 1 : -1;
    if (needles) { o.position.copy(p).add(new THREE.Vector3(side * leafLen * 0.45, 0.01, 0)); o.rotation.set(Math.PI / 2, 0, side * 1.0 + rr(-0.2, 0.2)); }
    else { o.position.copy(p).add(new THREE.Vector3(side * leafLen * 0.5, 0.006, rr(-0.01, 0.01))); o.rotation.y = side * 0.6 + rr(-0.3, 0.3); }
    const k = 1 - t * 0.45; o.scale.setScalar(k);
  }));
  return g;
}
function berryCluster(r, drupe, color) {
  const n = 26, gold = Math.PI * (3 - Math.sqrt(5));
  const g = new THREE.Group();
  g.add(instanced(new THREE.SphereGeometry(drupe, 10, 8), M.phys({ color, roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.05, sheen: 0.3, sheenColor: new THREE.Color('#a04080') }), n, (o, i) => {
    const y = 1 - (i / (n - 1)) * 1.6, rad = Math.sqrt(Math.max(0, 1 - y * y)), th = gold * i;
    o.position.set(Math.cos(th) * rad * r, y * r * 1.15 + r, Math.sin(th) * rad * r);
    o.scale.setScalar(rr(0.85, 1.1));
  }));
  return g;
}

// ── Vessels ────────────────────────────────────────────────────────────────
function plateMesh(rim = '#5f7fa3') {
  const prof = [[0, 0.012], [0.46, 0.012], [0.5, 0], [0.56, 0], [0.62, 0.02], [0.7, 0.03], [0.84, 0.085], [0.97, 0.125], [1.0, 0.12], [0.99, 0.1], [0.86, 0.07], [0.7, 0.045], [0.6, 0.045], [0, 0.045]].reverse().map(([x, y]) => new THREE.Vector2(x, y));
  const g = new THREE.LatheGeometry(prof, 128);
  const m = new THREE.Mesh(g, M.phys({ color: '#fdfaf4', side: THREE.DoubleSide, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.06, sheen: 0.2 }));
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.925, 0.0055, 6, 160), M.phys({ color: rim, roughness: 0.3, clearcoat: 1 }));
  ring.rotation.x = Math.PI / 2; ring.position.y = 0.114;
  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.0025, 6, 160), ring.material); ring2.rotation.x = Math.PI / 2; ring2.position.y = 0.106;
  const gr = new THREE.Group(); gr.add(m, ring, ring2); gr.userData.top = 0.045; return shadowed(gr);
}
function bowlMesh() {
  const prof = [[0, 0.03], [0.34, 0.03], [0.38, 0], [0.46, 0], [0.5, 0.03], [0.64, 0.14], [0.74, 0.3], [0.77, 0.4], [0.765, 0.42], [0.74, 0.415], [0.7, 0.32], [0.6, 0.18], [0.42, 0.1], [0, 0.085]].reverse().map(([x, y]) => new THREE.Vector2(x, y));
  const g = new THREE.LatheGeometry(prof, 96);
  const m = new THREE.Mesh(g, M.phys({ color: '#d8ccb6', side: THREE.DoubleSide, map: T.stone(), roughness: 0.42, clearcoat: 0.6, clearcoatRoughness: 0.2 }));
  const lip = new THREE.Mesh(new THREE.TorusGeometry(0.755, 0.012, 8, 120), M.phys({ color: '#7a5a3e', roughness: 0.4, clearcoat: 0.8 }));
  lip.rotation.x = Math.PI / 2; lip.position.y = 0.418;
  const gr = new THREE.Group(); gr.add(m, lip); return shadowed(gr);
}
function boardMesh() {
  const s = new THREE.Shape();
  const w = 1.0, h = 0.72, r = 0.22;
  s.moveTo(-w + r, -h); s.lineTo(w - r, -h); s.quadraticCurveTo(w, -h, w, -h + r); s.lineTo(w, -0.12);
  s.lineTo(w + 0.36, -0.1); s.quadraticCurveTo(w + 0.46, 0, w + 0.36, 0.1); s.lineTo(w, 0.12);
  s.lineTo(w, h - r); s.quadraticCurveTo(w, h, w - r, h); s.lineTo(-w + r, h); s.quadraticCurveTo(-w, h, -w, h - r); s.lineTo(-w, -h + r); s.quadraticCurveTo(-w, -h, -w + r, -h);
  const hole = new THREE.Path(); hole.absarc(w + 0.3, 0, 0.035, 0, TAU, true); s.holes.push(hole);
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.07, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 4, curveSegments: 24 });
  flatLie(g); g.translate(0, 0.02, 0);
  const tex = T.wood().clone(); tex.needsUpdate = true; tex.repeat.set(0.6, 0.6);
  const m = new THREE.Mesh(g, [M.phys({ color: '#f6dcbc', map: tex, roughness: 0.55, clearcoat: 0.25 }), M.phys({ color: '#b07a40', roughness: 0.6 })]);
  const gr = new THREE.Group(); gr.add(m); gr.rotation.y = -0.25; gr.userData.top = 0.11; return shadowed(gr);
}

// ── Dishes ─────────────────────────────────────────────────────────────────
function breadSlice() {
  const s = new THREE.Shape();
  s.moveTo(-0.44, -0.3); s.lineTo(0.44, -0.3); s.quadraticCurveTo(0.5, -0.3, 0.5, -0.2); s.lineTo(0.5, 0.12);
  s.bezierCurveTo(0.58, 0.32, 0.36, 0.42, 0.22, 0.34); s.bezierCurveTo(0.1, 0.44, -0.12, 0.44, -0.22, 0.34);
  s.bezierCurveTo(-0.38, 0.42, -0.58, 0.32, -0.5, 0.12); s.lineTo(-0.5, -0.2); s.quadraticCurveTo(-0.5, -0.3, -0.44, -0.3);
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.07, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.03, bevelSegments: 5, curveSegments: 24 });
  normUV(g); flatLie(g);
  const p = g.attributes.position; for (let i = 0; i < p.count; i++) p.setY(i, p.getY(i) + (fbm(p.getX(i) * 8, p.getZ(i) * 8) - 0.5) * 0.025);
  g.computeVertexNormals();
  return new THREE.Mesh(g, [M.phys({ map: T.crumb(), roughness: 0.75, sheen: 0.4, sheenColor: new THREE.Color('#ffd08a') }), M.phys({ color: '#5a2e10', roughness: 0.6, clearcoat: 0.2 })]);
}
function chanterelle(sz) {
  const prof = [new THREE.Vector2(0, 0), new THREE.Vector2(0.16, 0.0)]; for (let i = 1; i <= 16; i++) { const t = i / 16; prof.push(new THREE.Vector2(0.16 + Math.pow(t, 2.6) * 0.84, t * 1.0)); }
  prof.push(new THREE.Vector2(1.0, 1.06), new THREE.Vector2(0.9, 1.1), new THREE.Vector2(0.5, 1.02), new THREE.Vector2(0, 0.96));
  const g = new THREE.LatheGeometry(prof, 40), p = g.attributes.position;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), z = p.getZ(i), y = p.getY(i), a = Math.atan2(z, x), k = 1 + Math.sin(a * 5 + y) * 0.12 * y + Math.sin(a * 11) * 0.04 * y; p.setXYZ(i, x * k, y + Math.sin(a * 6) * 0.06 * y, z * k * 0.8); }
  g.computeVertexNormals(); g.scale(sz * 0.5, sz, sz * 0.5);
  const m = new THREE.Mesh(g, M.phys({ color: '#e8922a', roughness: 0.32, clearcoat: 0.9, clearcoatRoughness: 0.2, sheen: 0.5, sheenColor: new THREE.Color('#ffd27a'), side: THREE.DoubleSide }));
  m.rotation.z = Math.PI / 2 - 0.15; return m;
}
function flecks(n, area, col, size, y) {
  return instanced(new THREE.BoxGeometry(size, size * 0.35, size * 0.7), M.phys({ color: col, roughness: 0.4, clearcoat: 0.6 }), n, (o) => {
    const a = rnd() * TAU, d = Math.sqrt(rnd()) * area; o.position.set(Math.cos(a) * d, y, Math.sin(a) * d * 0.75); o.rotation.set(rr(-0.3, 0.3), rnd() * 6, rr(-0.3, 0.3)); o.scale.setScalar(rr(0.6, 1.3));
  });
}
function salt(n, area, y) {
  return instanced(new THREE.BoxGeometry(0.012, 0.004, 0.012), M.phys({ color: '#ffffff', roughness: 0.05, clearcoat: 1 }), n, (o) => {
    const a = rnd() * TAU, d = Math.sqrt(rnd()) * area; o.position.set(Math.cos(a) * d, y, Math.sin(a) * d * 0.7); o.rotation.set(rr(-0.5, 0.5), rnd() * 6, rr(-0.5, 0.5)); o.scale.set(rr(0.6, 1.6), 1, rr(0.6, 1.6));
  });
}
function elderflower() {
  const g = new THREE.Group();
  g.add(instanced(new THREE.CircleGeometry(0.014, 5).rotateX(-Math.PI / 2), M.phys({ color: '#fffbea', roughness: 0.6, side: THREE.DoubleSide, sheen: 1, sheenColor: new THREE.Color('#ffffff') }), 40, (o) => {
    const a = rnd() * TAU, d = Math.sqrt(rnd()) * 0.09; o.position.set(Math.cos(a) * d, 0.02 + rr(0, 0.025) * (1 - d * 8), Math.sin(a) * d); o.rotation.set(rr(-0.4, 0.4), rnd() * 6, rr(-0.4, 0.4));
  }));
  g.add(instanced(new THREE.SphereGeometry(0.004, 5, 4), M.std({ color: '#f2d25a' }), 40, (o) => { const a = rnd() * TAU, d = Math.sqrt(rnd()) * 0.09; o.position.set(Math.cos(a) * d, 0.035, Math.sin(a) * d); }));
  return g;
}
function pool(r, color, o = {}) {
  const s = new THREE.Shape(); const n = 48;
  for (let i = 0; i <= n; i++) { const a = (i / n) * TAU, k = r * (1 + (fbm(Math.cos(a) * 2 + 4, Math.sin(a) * 2) - 0.5) * 0.5); const x = Math.cos(a) * k * (o.sx || 1), y = Math.sin(a) * k; i ? s.lineTo(x, y) : s.moveTo(x, y); }
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.002, bevelEnabled: true, bevelThickness: o.h || 0.006, bevelSize: 0.01, bevelSegments: 4, curveSegments: 6 }); flatLie(g);
  const m = new THREE.Mesh(g, M.phys({ color, roughness: 0.06, clearcoat: 1, clearcoatRoughness: 0.02, transparent: o.alpha != null, opacity: o.alpha ?? 1, ior: 1.45 }));
  m.receiveShadow = true; return m;
}
function droplets(n, area, color, rmax, y, sx = 1) {
  return instanced(new THREE.SphereGeometry(1, 14, 8, 0, TAU, 0, Math.PI / 2), M.phys({ color, roughness: 0.04, clearcoat: 1, transparent: true, opacity: 0.85 }), n, (o) => {
    const a = rnd() * TAU, d = Math.sqrt(rnd()) * area, r = rr(0.25, 1) * rmax; o.position.set(Math.cos(a) * d * sx, y, Math.sin(a) * d); o.scale.set(r, r * 0.35, r);
  });
}
function fillet() {
  const s = new THREE.Shape();
  s.moveTo(-0.6, 0.02); s.bezierCurveTo(-0.5, 0.22, -0.1, 0.27, 0.3, 0.2); s.bezierCurveTo(0.5, 0.16, 0.62, 0.06, 0.66, 0.0);
  s.bezierCurveTo(0.6, -0.08, 0.4, -0.16, 0.1, -0.18); s.bezierCurveTo(-0.25, -0.2, -0.5, -0.14, -0.6, 0.02);
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.06, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.03, bevelSegments: 6, curveSegments: 30 });
  normUV(g); flatLie(g);
  const p = g.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i); if (p.getY(i) > 0.03) p.setY(i, p.getY(i) + Math.cos(x * 2.2) * 0.03); }
  g.computeVertexNormals();
  return new THREE.Mesh(g, [M.phys({ map: T.skin(), color: '#b88a5a', roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.12, sheen: 0.4, sheenColor: new THREE.Color('#ffe0a0') }), M.phys({ color: '#e8865a', roughness: 0.4, clearcoat: 0.5 })]);
}
function hazelnut(sz) {
  const g = new THREE.Group();
  const geo = new THREE.SphereGeometry(sz, 18, 14), p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) { const y = p.getY(i) / sz; p.setY(i, p.getY(i) * (y > 0 ? 1.15 + y * 0.15 : 0.9)); }
  geo.computeVertexNormals();
  g.add(new THREE.Mesh(geo, M.phys({ color: '#9a5a26', roughness: 0.35, clearcoat: 0.8 })));
  const cap = new THREE.Mesh(new THREE.SphereGeometry(sz * 1.02, 16, 6, 0, TAU, Math.PI * 0.62, Math.PI * 0.38), M.std({ color: '#d8b888', roughness: 0.8 })); g.add(cap);
  g.rotation.set(rr(0.6, 1.4), rnd() * 6, 0); return g;
}
function stewSurface(r, brown) {
  const prof = []; for (let i = 0; i <= 24; i++) prof.push(new THREE.Vector2((i / 24) * r, 0));
  const g = new THREE.LatheGeometry(prof.reverse(), 72), p = g.attributes.position;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), z = p.getZ(i), d = Math.hypot(x, z) / r; p.setY(i, (fbm(x * 6 + 3, z * 6) - 0.5) * 0.05 + (1 - d * d) * 0.03); }
  g.computeVertexNormals();
  const c = new THREE.Color('#8a4a1c').lerp(new THREE.Color('#4a200a'), brown * 0.8);
  return new THREE.Mesh(g, M.phys({ color: c, side: THREE.DoubleSide, roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.05, sheen: 0.4, sheenColor: new THREE.Color('#ffb060') }));
}
function carrotCoin() {
  const g = new THREE.CylinderGeometry(0.075, 0.07, 0.03, 28);
  const top = M.phys({ map: T.carrot(), roughness: 0.25, clearcoat: 1 }), side = M.phys({ color: '#e0741c', roughness: 0.3, clearcoat: 0.8 });
  const m = new THREE.Mesh(g, [side, top, top]); m.rotation.set(rr(-0.4, 0.4), rnd() * 6, rr(-0.4, 0.4)); return shadowed(m);
}
function meatChunk(sz, color, s) {
  const m = new THREE.Mesh(blob(sz, sz * 0.75, sz * 0.85, 0.16, 4, s), glossy(color, { roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.1, sheen: 0.4, sheenColor: new THREE.Color('#ffb070') }));
  m.rotation.set(rr(-0.4, 0.4), rnd() * 6, rr(-0.3, 0.3)); return m;
}
function breastWhole(brown) {
  const g = blob(0.34, 0.11, 0.17, 0.09, 4, 3, 40), p = g.attributes.position;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), k = 1 - Math.max(0, x / 0.34) * 0.55; p.setZ(i, p.getZ(i) * k); p.setY(i, p.getY(i) * (0.8 + k * 0.2)); }
  g.computeVertexNormals();
  const c = new THREE.Color('#8a4416').lerp(new THREE.Color('#4a1e08'), brown);
  return new THREE.Mesh(g, M.phys({ color: c, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.06, sheen: 0.5, sheenColor: new THREE.Color('#ffc080') }));
}
function breastSlices(brown) {
  const g = new THREE.Group();
  const crust = M.phys({ color: new THREE.Color('#a85a22').lerp(new THREE.Color('#5a2810'), brown), roughness: 0.25, clearcoat: 1 });
  const face = M.phys({ map: T.breast(), roughness: 0.4, clearcoat: 0.4, sheen: 0.4, sheenColor: new THREE.Color('#ffd8d0') });
  for (let i = 0; i < 5; i++) {
    const w = 0.2 - Math.abs(i - 2) * 0.014, h = 0.11 - Math.abs(i - 2) * 0.01;
    const s = new THREE.Shape(); s.moveTo(-w, 0); s.bezierCurveTo(-w, h * 1.3, w, h * 1.3, w, 0); s.quadraticCurveTo(0, -h * 0.25, -w, 0);
    const geo = new THREE.ExtrudeGeometry(s, { depth: 0.018, bevelEnabled: true, bevelThickness: 0.006, bevelSize: 0.006, bevelSegments: 3, curveSegments: 20 });
    normUV(geo); flatLie(geo);
    const m = new THREE.Mesh(geo, [face, crust]); m.position.set(0, 0.014 + i * 0.008, -i * 0.07 + 0.14); m.rotation.x = 0.35; m.rotation.y = i * 0.07;
    g.add(m);
  }
  return g;
}
function swoosh(color) {
  const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(-0.55, 0, 0.32), new THREE.Vector3(-0.2, 0, 0.45), new THREE.Vector3(0.2, 0, 0.42), new THREE.Vector3(0.52, 0, 0.18)]);
  const tub = 80, rad = 12, g = new THREE.TubeGeometry(curve, tub, 0.06, rad, false), p = g.attributes.position, c = new THREE.Vector3();
  for (let i = 0; i <= tub; i++) {
    const t = i / tub; curve.getPointAt(t, c); const k = Math.pow(Math.sin(Math.PI * Math.min(1, t * 1.15)), 0.5) * (1 - t * 0.4);
    for (let j = 0; j <= rad; j++) { const idx = i * (rad + 1) + j; p.setXYZ(idx, c.x + (p.getX(idx) - c.x) * k, Math.max(0, (p.getY(idx) - c.y) * k * 0.22), c.z + (p.getZ(idx) - c.z) * k); }
  }
  g.computeVertexNormals();
  return new THREE.Mesh(g, M.phys({ color, roughness: 0.08, clearcoat: 1, clearcoatRoughness: 0.02, sheen: 0.5, sheenColor: new THREE.Color('#c04080') }));
}
function handPie(s) {
  const R0 = 0.22, sh = new THREE.Shape(); sh.moveTo(-R0, 0);
  for (let i = 1; i <= 36; i++) { const a = Math.PI - (i / 36) * Math.PI; sh.lineTo(Math.cos(a) * R0, Math.sin(a) * R0); }
  sh.quadraticCurveTo(0, -0.02, -R0, 0);
  const g = new THREE.ExtrudeGeometry(sh, { depth: 0.02, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.03, bevelSegments: 8, curveSegments: 36 });
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i) - 0.1, z = p.getZ(i) - 0.01, d = Math.min(1.2, Math.hypot(x / 0.25, y / 0.15)); p.setZ(i, 0.01 + z * (1.25 - d * d * 0.5) + (fbm(x * 9 + s, y * 9) - 0.5) * 0.012); }
  normUV(g); g.computeVertexNormals(); flatLie(g); g.translate(0, 0.06, 0.11);
  const pastry = M.phys({ map: T.pastry(), color: '#e8a464', roughness: 0.36, clearcoat: 0.8, clearcoatRoughness: 0.18, sheen: 0.6, sheenColor: new THREE.Color('#ffd890') });
  const gr = new THREE.Group(); gr.add(new THREE.Mesh(g, pastry));
  // fork-crimped edge
  gr.add(instanced(new THREE.CapsuleGeometry(0.012, 0.03, 3, 6), pastry, 15, (o, i) => {
    const a = (i / 14) * Math.PI, r = 0.24; o.position.set(Math.cos(a) * r, 0.06, -Math.sin(a) * r + 0.11);
    o.rotation.order = 'YXZ'; o.rotation.set(Math.PI / 2, Math.atan2(Math.cos(a), -Math.sin(a)), 0);
  }));
  // steam vents
  gr.add(instanced(new THREE.CapsuleGeometry(0.006, 0.04, 2, 5), M.std({ color: '#4a2208', roughness: 0.9 }), 3, (o, i) => { o.position.set((i - 1) * 0.06, 0.135 - Math.abs(i - 1) * 0.01, 0.0); o.rotation.set(Math.PI / 2, 0, 0.4 + (i - 1) * 0.2); }));
  gr.add(salt(14, 0.12, 0.13));
  return gr;
}
function porciniSlice() {
  const s = new THREE.Shape(); s.moveTo(-0.04, -0.12); s.lineTo(0.04, -0.12); s.bezierCurveTo(0.05, -0.04, 0.05, -0.01, 0.12, 0.0); s.bezierCurveTo(0.14, 0.09, -0.14, 0.09, -0.12, 0.0); s.bezierCurveTo(-0.05, -0.01, -0.05, -0.04, -0.04, -0.12);
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.02, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.006, bevelSegments: 3, curveSegments: 18 });
  normUV(g); flatLie(g);
  return new THREE.Mesh(g, [M.phys({ map: T.porcini(), roughness: 0.4, clearcoat: 0.6 }), M.phys({ color: '#7a4a22', roughness: 0.4, clearcoat: 0.6 })]);
}
function berries(n, r, col, drupe) { const g = new THREE.Group(); for (let i = 0; i < n; i++) g.add(berryCluster(r, drupe, col)); return g; }
function juniper(n, area, y) {
  return instanced(new THREE.SphereGeometry(0.022, 12, 10), M.phys({ color: '#33405e', roughness: 0.55, sheen: 1, sheenColor: new THREE.Color('#9ab0d8') }), n, (o) => { const a = rnd() * TAU, d = Math.sqrt(rnd()) * area; o.position.set(Math.cos(a) * d, y + 0.02, Math.sin(a) * d); o.scale.setScalar(rr(0.8, 1.15)); });
}

const FOOD = { toast: 1.18, trout: 1.18, stew: 1, pheasant: 1.25, pies: 1.1 };
const at = (o, x, y, z, ry = 0) => { o.position.set(x, y, z); o.rotation.y += ry; return o; };
// Each builder returns { vessel, pieces[] } so pieces can be revealed one at a time.
const BUILD = {
  toast(b) {
    seed = 101; const v = plateMesh(), y = 0.045, P = [];
    const bread = breadSlice(); bread.rotation.y = 0.18; P.push(at(new THREE.Group().add(bread), 0, y, 0.02));
    const ty = y + 0.13;
    [[-0.22, -0.04, 0.3], [0.08, -0.12, -0.6], [0.26, 0.06, 1.2], [-0.04, 0.12, 2.2], [-0.28, 0.14, -1.6], [0.14, 0.16, 0.4]].forEach(([x, z, r], i) => P.push(at(new THREE.Group().add(chanterelle(0.2 + (i % 2) * 0.03)), x, ty + 0.02, z, r)));
    P.push(at(new THREE.Group().add(flecks(70, 0.36, '#4e8a30', 0.022, 0)), 0, ty + 0.01, 0.03));
    P.push(at(new THREE.Group().add(droplets(22, 0.6, '#d8b030', 0.025, 0.002)), 0, y, 0));
    P.push(at(new THREE.Group().add(salt(60, 0.4, 0)), 0, ty + 0.04, 0.02));
    P.push(at(new THREE.Group().add(elderflower()), 0.5, y, -0.42));
    P.push(at(new THREE.Group().add(leaf(0.22, 0.06, '#4f8a34')), -0.62, y + 0.005, 0.3, 2.2));
    return { v, P, steam: [0, ty, 0] };
  },
  trout(b) {
    seed = 202; const v = plateMesh(), y = 0.045, P = [];
    P.push(at(new THREE.Group().add(pool(0.4, '#a8641e', { sx: 1.4, alpha: 0.92 })), 0.02, y, 0.08));
    P.push(at(new THREE.Group().add(droplets(10, 0.55, '#d89830', 0.03, 0.002, 1.2)), 0, y + 0.006, 0.1));
    const f = fillet(); f.rotation.y = -0.15; P.push(at(new THREE.Group().add(f), 0, y + 0.012, 0));
    [[-0.12, 0.34, 2.6, 0.24], [0.22, 0.32, 3.4, 0.2], [0.48, -0.28, 0.9, 0.18], [-0.1, 0.26, -2.0, 0.17]].forEach(([x, z, r, l]) => P.push(at(new THREE.Group().add(leaf(l, l * 0.42, '#3e8a2a', true)), x, y + 0.09, z, r)));
    P.push(at(new THREE.Group().add(droplets(14, 0.12, '#3f8a2a', 0.022, 0)), -0.48, y + 0.005, -0.3));
    const nuts = new THREE.Group(); [[0, 0], [0.07, 0.05], [-0.05, 0.07], [0.02, -0.08]].forEach(([x, z]) => nuts.add(at(hazelnut(0.035), x, 0.04, z)));
    nuts.add(flecks(16, 0.12, '#c08a4a', 0.02, 0.01)); P.push(at(nuts, 0.5, y, 0.42));
    return { v, P, steam: [0, y + 0.1, 0] };
  },
  stew(b) {
    seed = 303; const v = new THREE.Group(); v.add(plateMesh()); const bowl = bowlMesh(); bowl.position.y = 0.045; v.add(bowl);
    const y = 0.045 + 0.31, P = [];
    P.push(at(new THREE.Group().add(stewSurface(0.66, b)), 0, y, 0));
    [[-0.16, -0.1], [0.2, 0.08], [0.02, 0.24], [-0.24, 0.18]].forEach(([x, z], i) => P.push(at(new THREE.Group().add(meatChunk(0.14 - i * 0.01, i % 2 ? '#a8642c' : '#8e4c20', i)), x, y + 0.06, z)));
    const coins = new THREE.Group(); [[0.08, -0.26], [-0.3, -0.02], [0.32, -0.12], [-0.06, 0.04], [0.26, 0.3], [-0.12, -0.34]].forEach(([x, z]) => coins.add(at(carrotCoin(), x, 0.045, z))); P.push(at(coins, 0, y, 0));
    P.push(at(new THREE.Group().add(droplets(26, 0.58, '#f0b840', 0.028, 0.03)), 0, y, 0));
    P.push(at(new THREE.Group().add(flecks(50, 0.5, '#5f8a3a', 0.016, 0.04)), 0, y, 0));
    P.push(at(new THREE.Group().add(sprig(0.5, 0.05, '#5a8a3c')), 0.16, y + 0.08, 0.1, -0.9));
    P.push(at(new THREE.Group().add(sprig(0.36, 0.045, '#5a8a3c')), -0.3, y + 0.07, -0.18, 0.6));
    return { v, P, steam: [0, y + 0.05, 0] };
  },
  pheasant(b) {
    seed = 404; const v = plateMesh('#7a6a8a'), y = 0.045, P = [];
    P.push(at(new THREE.Group().add(swoosh('#3a0f2c')), 0, y, 0.02));
    const w = breastWhole(b); w.rotation.y = 0.5; P.push(at(new THREE.Group().add(w), -0.16, y + 0.05, -0.12));
    const sl = breastSlices(b); sl.rotation.y = -0.7; P.push(at(sl, 0.26, y, 0.12));
    P.push(at(new THREE.Group().add(droplets(12, 0.12, '#4a1438', 0.03, 0)), 0.42, y, -0.38));
    const bb = new THREE.Group(); [[-0.42, 0.3], [-0.06, 0.48], [0.5, 0.0], [0.02, 0.44]].forEach(([x, z]) => bb.add(at(berryCluster(0.05, 0.022, '#1e0a22'), x, 0, z))); P.push(at(bb, 0, y, 0));
    P.push(at(new THREE.Group().add(juniper(9, 0.6, 0)), 0, y, 0));
    P.push(at(new THREE.Group().add(sprig(0.34, 0.035, '#6a8a4a')), -0.5, y + 0.01, -0.36, 2.4));
    return { v, P, steam: [0, y + 0.12, 0] };
  },
  pies(b) {
    seed = 505; const v = boardMesh(), y = 0.11, P = [];
    [[-0.38, -0.1, 0.4], [0.32, -0.14, -0.3], [-0.02, 0.28, 3.3]].forEach(([x, z, r], i) => P.push(at(handPie(i * 3), x, y, z, r)));
    P.push(at(new THREE.Group().add(sprig(0.5, 0.06, '#3f5a3a', true)), -0.5, y + 0.01, 0.52, -1.2));
    const ps = new THREE.Group(); [[0, 0, 0.2], [0.1, 0.06, -0.5]].forEach(([x, z, r]) => { const m = porciniSlice(); m.rotation.y = r; ps.add(at(m, x, 0.006, z)); }); P.push(at(ps, 0.52, y, 0.42));
    P.push(at(new THREE.Group().add(salt(40, 0.8, 0)), 0, y + 0.003, 0));
    return { v, P, steam: [0, y + 0.12, 0] };
  },
};

// ── Stage ──────────────────────────────────────────────────────────────────
const D = { ok: false };
let renderer, cv3d, scene, camera, raf = 0, mode = null, t0 = 0, last = 0, cust = null;
const anims = [];
let steam = [], flies = null, flames = [], lights = {}, view = null, camRig = {};

function init() {
  cv3d = document.createElement('canvas'); cv3d.id = 'cv3d';
  document.body.insertBefore(cv3d, document.getElementById('cv'));
  try {
    renderer = new THREE.WebGLRenderer({ canvas: cv3d, antialias: true, powerPreference: 'high-performance' });
  } catch (e) { cv3d.remove(); return false; }
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const pm = new THREE.PMREMGenerator(renderer);
  D.env = pm.fromScene(new RoomEnvironment(renderer), 0.04).texture;
  window.addEventListener('resize', size);
  return true;
}
function size() {
  if (!renderer || !mode) return;
  const W = innerWidth, H = innerHeight;
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, W < 700 ? 1.75 : 2));
  renderer.setSize(W, H, false); cv3d.style.width = W + 'px'; cv3d.style.height = H + 'px';
  if (mode === 'custom') { cust.resize && cust.resize(W, H); return; }
  camera.aspect = W / H; frame(); camera.updateProjectionMatrix();
  if (scene.fog) { scene.fog.near = camRig.dist * camRig.fogN; scene.fog.far = camRig.dist * camRig.fogF; }
}
function frame() {
  const W = innerWidth, H = innerHeight, v = view ? view() : { x: W / 2, y: H / 2, R: Math.min(W, H) * 0.3 };
  camera.setViewOffset(W, H, W / 2 - v.x, H / 2 - v.y, W, H);
  camRig.dist = (H / (2 * Math.tan((camera.fov * Math.PI) / 360) * v.R)) * camRig.fit;
}
function baseScene(bg, fogNear, fogFar, top) {
  scene = new THREE.Scene(); scene.background = bg; scene.environment = D.env;
  if (fogFar) scene.fog = new THREE.Fog(bg.isColor ? bg : new THREE.Color('#0c0a18'), fogNear, fogFar);
  const tex = T.wood();
  const table = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), M.phys({ map: tex, roughness: 0.48, clearcoat: 0.35, clearcoatRoughness: 0.3, color: '#c4a48c' }));
  table.rotation.x = -Math.PI / 2; table.receiveShadow = true;
  if (top) {
    table.geometry.dispose(); table.geometry = new THREE.PlaneGeometry(top[0], top[1]);
    const edge = new THREE.Mesh(new THREE.BoxGeometry(top[0], 0.14, top[1]), M.phys({ color: '#4a2c18', roughness: 0.6 })); edge.position.y = -0.071; scene.add(edge);
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(120, 120), M.std({ color: '#141c16', roughness: 1 })); ground.rotation.x = -Math.PI / 2; ground.position.y = -1.1; ground.receiveShadow = true; scene.add(ground);
  }
  scene.add(table);
  return table;
}
function runner(w, len, x = 0, z = 0, rot = 0) {
  const g = new THREE.Group();
  const lin = new THREE.Mesh(new THREE.PlaneGeometry(w, len, 1, 1), M.phys({ map: T.linen(), color: '#d6c8b2', roughness: 0.9, sheen: 1, sheenColor: new THREE.Color('#ffffff'), sheenRoughness: 0.6 }));
  lin.rotation.x = -Math.PI / 2; lin.position.y = 0.004; lin.receiveShadow = true; g.add(lin);
  for (const s of [-1, 1]) { const st = new THREE.Mesh(new THREE.PlaneGeometry(0.07, len), M.std({ color: '#a5503c', roughness: 0.9 })); st.rotation.x = -Math.PI / 2; st.position.set(s * (w / 2 - 0.12), 0.005, 0); st.receiveShadow = true; g.add(st); }
  g.position.set(x, 0, z); g.rotation.y = rot; return g;
}
const LIGHT = {
  dawn: ['#ffcfa8', 2.4, '#b4a4d0', '#2a1810', 0.5],
  morning: ['#fff0d4', 2.7, '#bcd4e8', '#2a1e12', 0.55],
  noon: ['#fff8ec', 2.9, '#c8dcf0', '#2a1e12', 0.6],
  golden: ['#ffb060', 3.0, '#a090c0', '#2a160a', 0.5],
  dusk: ['#ffa060', 2.4, '#5a5090', '#1a0c10', 0.45],
};
function keyLight(color, I, mobile) {
  const k = new THREE.DirectionalLight(color, I); k.position.set(-3.2, 5.5, 2.6); k.castShadow = true;
  k.shadow.mapSize.set(mobile ? 1024 : 2048, mobile ? 1024 : 2048);
  const sc = k.shadow.camera; sc.left = sc.bottom = -2.6; sc.right = sc.top = 2.6; sc.near = 1; sc.far = 14;
  k.shadow.bias = -0.0004; k.shadow.normalBias = 0.015; k.shadow.radius = 6;
  return k;
}
function steamSprites(n, at, spread, scale = 1) {
  const mat = new THREE.SpriteMaterial({ map: T.soft(), color: '#ffffff', transparent: true, opacity: 0, depthWrite: false });
  for (let i = 0; i < n; i++) {
    const s = new THREE.Sprite(mat.clone()); s.userData = { base: new THREE.Vector3(...at), spread, life: rr(0, 1), sp: rr(0.16, 0.26), scale, seed: rnd() * 9 };
    scene.add(s); steam.push(s);
  }
}
function tickSteam(dt) {
  for (const s of steam) {
    const u = s.userData; if (!u.on) continue;
    u.life += dt * u.sp; if (u.life > 1) { u.life -= 1; u.ox = rr(-1, 1) * u.spread; u.oz = rr(-1, 1) * u.spread * 0.6; }
    const L = u.life, k = u.scale;
    s.position.set(u.base.x + (u.ox || 0) + Math.sin(L * 5 + u.seed) * 0.05 * k, u.base.y + L * 0.9 * k, u.base.z + (u.oz || 0));
    s.scale.setScalar((0.18 + L * 0.5) * k);
    s.material.opacity = Math.sin(L * Math.PI) * 0.12;
    s.material.rotation = u.seed + L;
  }
}
function start(m) {
  scene.traverse((o) => { if (o.material) [].concat(o.material).forEach((mt) => { if (mt.envMapIntensity !== undefined) mt.envMapIntensity = mt.metalness > 0.5 ? 0.9 : 0.42; }); });
  mode = m; cv3d.classList.add('on'); size();
  t0 = last = performance.now();
  const loop = (now) => {
    raf = requestAnimationFrame(loop);
    const dt = Math.min(0.05, (now - last) / 1000), t = (now - t0) / 1000; last = now;
    for (let i = anims.length - 1; i >= 0; i--) { const a = anims[i], k = Math.min(1, (now - a.s) / a.d); a.f(k); if (k >= 1) anims.splice(i, 1); }
    tickSteam(dt);
    if (mode === 'custom') { if (cust.tick(dt, t) === false) return; } else if (mode === 'plate') camPlate(t); else camFeast(t, dt);
    renderer.render(scene, camera);
  };
  raf = requestAnimationFrame(loop);
}
function stop() {
  cancelAnimationFrame(raf); raf = 0; anims.length = 0; mode = null; steam = []; flames = []; flies = null;
  if (cv3d) cv3d.classList.remove('on');
  if (cust && cust.dispose) cust.dispose(); cust = null;
  if (scene) { scene.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material) [].concat(o.material).forEach((m) => m.dispose()); }); scene = null; }
}
const easeOut = (k) => 1 - Math.pow(1 - k, 3);
const easeBack = (k) => { const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2); };

function camPlate(t) {
  const intro = easeOut(Math.min(1, t / 3.2));
  const az = 0.5 - intro * 0.4 + Math.sin(t * 0.18) * 0.22, el = (56 - intro * 14 + Math.sin(t * 0.13) * 2) * Math.PI / 180;
  const d = camRig.dist * (1.25 - intro * 0.25);
  camera.position.set(Math.sin(az) * Math.cos(el) * d, Math.sin(el) * d + camRig.ty, Math.cos(az) * Math.cos(el) * d);
  camera.lookAt(0, camRig.ty, 0);
}
function camFeast(t, dt) {
  const intro = easeOut(Math.min(1, t / 6));
  const az = Math.sin(t * 0.07) * 0.14 - (1 - intro) * 0.3, el = (camRig.el + (1 - intro) * 14) * Math.PI / 180, d = camRig.dist * (1.3 - intro * 0.3);
  camera.position.set(Math.sin(az) * Math.cos(el) * d, Math.sin(el) * d, Math.cos(az) * Math.cos(el) * d + camRig.tz);
  camera.lookAt(0, 0.2, camRig.tz);
  const now = performance.now() / 1000;
  flames.forEach((f, i) => { const fl = 0.85 + Math.sin(now * 9 + i * 2) * 0.08 + Math.sin(now * 23 + i) * 0.05 + (Math.random() - 0.5) * 0.06; f.light.intensity = f.I * fl; f.spr.scale.set(0.1 * fl, 0.22 * (0.9 + fl * 0.15), 1); f.glow.material.opacity = 0.35 * fl; });
  if (flies) {
    const p = flies.geometry.attributes.position, s = flies.userData;
    for (let i = 0; i < p.count; i++) { const b = s.base[i]; p.setXYZ(i, b[0] + Math.sin(now * 0.4 + b[3]) * 0.6, b[1] + Math.sin(now * 0.7 + b[3] * 2) * 0.25, b[2] + Math.cos(now * 0.35 + b[3]) * 0.5); }
    p.needsUpdate = true; flies.material.opacity = 0.75 + Math.sin(now * 2.2) * 0.25;
  }
}

// Build a plate. Returns the number of pieces to reveal.
D.plate = (r, o = {}) => {
  if (!D.ok) return 0;
  stop();
  const L = LIGHT[r.time] || LIGHT.golden, mobile = innerWidth < 700;
  baseScene(new THREE.Color('#1a0f08'), 9, 22);
  scene.add(runner(2.9, 30, 0.2, 0, -0.08));
  scene.add(keyLight(L[0], L[1], mobile));
  scene.add(new THREE.HemisphereLight(L[2], L[3], L[4]));
  const rim = new THREE.DirectionalLight('#ffe6c8', 1.1); rim.position.set(3, 2, -4); scene.add(rim);
  // a fork and a napkin at the side, a few scattered herbs
  const fork = new THREE.Group(), steel = M.phys({ color: '#d8dade', metalness: 1, roughness: 0.18 });
  const handle = new THREE.Mesh(new THREE.CapsuleGeometry(0.035, 0.9, 4, 10), steel); handle.scale.set(1, 1, 0.35); handle.rotation.x = Math.PI / 2; handle.position.z = 0.55; fork.add(handle);
  for (let i = -1.5; i <= 1.5; i++) { const tine = new THREE.Mesh(new THREE.CapsuleGeometry(0.009, 0.26, 3, 6), steel); tine.rotation.x = Math.PI / 2; tine.position.set(i * 0.028, 0.012, -0.08); fork.add(tine); }
  const neck = new THREE.Mesh(new THREE.CapsuleGeometry(0.05, 0.08, 4, 10), steel); neck.scale.set(1, 1, 0.3); neck.rotation.x = Math.PI / 2; neck.position.set(0, 0.008, 0.1); fork.add(neck);
  fork.position.set(1.45, 0.02, 0.15); fork.rotation.y = 0.12; scene.add(shadowed(fork));
  seed = 7; for (let i = 0; i < 5; i++) { const l = leaf(rr(0.14, 0.2), 0.05, '#5a8a42'); l.position.set(rr(-1.6, 1.8), 0.01, rr(-1.2, 1.4)); if (Math.hypot(l.position.x, l.position.z) < 1.3) l.position.x += 2.2 * Math.sign(l.position.x || 1); l.rotation.y = rnd() * 6; scene.add(shadowed(l)); }
  const { v, P, steam: st } = BUILD[r.id](o.brown ?? 0.7);
  const dish = new THREE.Group(), food = new THREE.Group(); dish.add(v, food); food.scale.setScalar(FOOD[r.id] || 1);
  P.forEach((p) => { shadowed(p); p.visible = false; p.userData.y = p.position.y; food.add(p); });
  dish.rotation.y = -0.2; scene.add(dish);
  D.pieces = P;
  camera = new THREE.PerspectiveCamera(26, innerWidth / innerHeight, 0.1, 60);
  camRig = { fit: 1.08, ty: 0.05, fogN: 1.25, fogF: 2.6 }; view = o.view || null;
  steamSprites(14, st, 0.3);
  start('plate');
  return P.length;
};
D.reveal = (i) => {
  const p = D.pieces && D.pieces[i]; if (!p) return;
  p.visible = true; const y = p.userData.y, s0 = 0.55;
  p.scale.setScalar(s0); p.position.y = y + 0.5;
  anims.push({ s: performance.now(), d: 520, f: (k) => { const e = easeBack(k); p.position.y = y + (1 - easeOut(k)) * 0.5; p.scale.setScalar(s0 + (1 - s0) * e); } });
  if (i === D.pieces.length - 1) setTimeout(() => steam.forEach((s) => (s.userData.on = true)), 300);
};
D.revealAll = () => { if (D.pieces) D.pieces.forEach((_, i) => D.reveal(i)); };

// The night feast: all five dishes on a long table under the stars.
D.feast = (recipes, o = {}) => {
  if (!D.ok) return false;
  stop();
  const mobile = innerWidth < 700, portrait = innerWidth < innerHeight;
  baseScene(T.night(), 10, 30, portrait ? [5.2, 8.4] : [12.4, 4.2]);
  scene.fog.color = new THREE.Color('#120c1e');
  scene.add(runner(2.6, portrait ? 8.4 : 12.4, 0, 0, portrait ? 0 : Math.PI / 2));
  const moon = keyLight('#8a9ad8', 0.9, mobile); moon.position.set(-4, 7, -3); scene.add(moon);
  scene.add(new THREE.HemisphereLight('#4a4a8a', '#1a0e10', 0.55));
  const pos = portrait ? [[-1.15, -2.3], [1.15, -2.3], [0, 0], [-1.15, 2.3], [1.15, 2.3]] : [[-4.4, 0.3], [-2.2, -0.35], [0, 0.35], [2.2, -0.35], [4.3, 0.3]];
  recipes.forEach((r, i) => {
    const { v, P, steam: st } = BUILD[r.id](0.7);
    const g = new THREE.Group(), food = new THREE.Group(); food.scale.setScalar(FOOD[r.id] || 1); g.add(v, food); P.forEach((p) => food.add(p)); shadowed(g);
    g.position.set(pos[i][0], 0, pos[i][1]); g.rotation.y = rr(-0.4, 0.4); scene.add(g);
    steamSprites(5, [pos[i][0] + st[0], st[1], pos[i][1] + st[2]], 0.25);
  });
  // candles between the dishes
  const cpos = portrait ? [[0, -1.6], [-1.6, 0.6], [1.6, 0.6]] : [[-3.3, 1.0], [1.1, 1.05], [3.3, -1.05], [-1.1, -1.05]];
  cpos.forEach(([x, z], i) => {
    const h = 0.75 + (i % 2) * 0.3, c = new THREE.Group();
    const wax = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.095, h, 24), M.phys({ color: '#f4ead6', roughness: 0.5, sheen: 0.6 }));
    wax.position.y = h / 2 + 0.05; c.add(wax);
    const dish = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.04, 28), M.phys({ color: '#b87a3a', metalness: 1, roughness: 0.25 })); dish.position.y = 0.02; c.add(dish);
    const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: T.flame(), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
    spr.position.y = h + 0.18; spr.scale.set(0.1, 0.22, 1); c.add(spr);
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: T.soft(), color: '#ff9a40', blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.35 }));
    glow.position.y = h + 0.16; glow.scale.setScalar(1.3); c.add(glow);
    const I = mobile ? 3 : 4.2, light = new THREE.PointLight('#ffa050', I, 7, 1.6); light.position.y = h + 0.2; c.add(light);
    c.position.set(x, 0, z); scene.add(shadowed(c)); flames.push({ spr, light, I, glow });
  });
  // lantern string behind the table
  const lz = portrait ? -4.2 : -2.6, lw = portrait ? 4 : 8;
  const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(-lw, 3.2, lz), new THREE.Vector3(0, 2.2, lz + 0.3), new THREE.Vector3(lw, 3.2, lz)]);
  scene.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 60, 0.008, 4), M.std({ color: '#1a1414' })));
  for (let i = 1; i < 12; i++) {
    const p = curve.getPointAt(i / 12);
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 8), new THREE.MeshBasicMaterial({ color: '#ffd890' })); bulb.position.copy(p).add(new THREE.Vector3(0, -0.08, 0)); scene.add(bulb);
    const g = new THREE.Sprite(new THREE.SpriteMaterial({ map: T.soft(), color: '#ffb060', blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.5 })); g.position.copy(bulb.position); g.scale.setScalar(0.6); scene.add(g);
  }
  // fireflies
  const n = mobile ? 40 : 70, geo = new THREE.BufferGeometry(), arr = new Float32Array(n * 3), base = [];
  for (let i = 0; i < n; i++) base.push([rr(-7, 7), rr(0.4, 2.6), rr(-5, 3), rr(0, 9)]);
  geo.setAttribute('position', new THREE.BufferAttribute(arr, 3));
  flies = new THREE.Points(geo, new THREE.PointsMaterial({ map: T.soft(), color: '#e8ff90', size: 0.16, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  flies.userData.base = base; scene.add(flies);
  camera = new THREE.PerspectiveCamera(portrait ? 40 : 32, innerWidth / innerHeight, 0.1, 80);
  camRig = portrait ? { fit: 1, el: 52, tz: 0.3, fogN: 1.2, fogF: 2.4 } : { fit: 0.92, el: 32, tz: 0.4, fogN: 1.15, fogF: 2.2 };
  view = () => { const W = innerWidth, H = innerHeight; return { x: W / 2, y: portrait ? H * 0.64 : H * 0.56, R: portrait ? W * 0.15 : Math.min(H * 0.13, W * 0.08) }; };
  steam.forEach((s) => (s.userData.on = true));
  start('feast');
  return true;
};

// Journal thumbnails: one small offscreen renderer, cached as data URLs.
let thumbR = null; const thumbs = {};
D.thumb = (r) => {
  if (!D.ok) return null;
  if (thumbs[r.id]) return thumbs[r.id];
  try {
    if (!thumbR) { thumbR = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true }); thumbR.setSize(192, 192, false); thumbR.outputColorSpace = THREE.SRGBColorSpace; thumbR.toneMapping = THREE.ACESFilmicToneMapping; thumbR.shadowMap.enabled = true; thumbR.shadowMap.type = THREE.PCFSoftShadowMap; D.tenv = new THREE.PMREMGenerator(thumbR).fromScene(new RoomEnvironment(thumbR), 0.04).texture; }
    const s = new THREE.Scene(); s.environment = D.tenv;
    const k = keyLight('#ffe0c0', 2.8, true); s.add(k); s.add(new THREE.HemisphereLight('#d0c8e8', '#3a2418', 0.9));
    const { v, P } = BUILD[r.id](0.7); const g = new THREE.Group(), food = new THREE.Group(); food.scale.setScalar(FOOD[r.id] || 1); g.add(v, food); P.forEach((p) => food.add(p)); shadowed(g); g.rotation.y = -0.2; s.add(g);
    const cam = new THREE.PerspectiveCamera(30, 1, 0.1, 30), el = 58 * Math.PI / 180, d = 4.6 * (r.id === 'pies' ? 1.12 : 1);
    cam.position.set(Math.sin(0.25) * Math.cos(el) * d, Math.sin(el) * d, Math.cos(0.25) * Math.cos(el) * d); cam.lookAt(0, 0.08, 0);
    thumbR.render(s, cam);
    thumbs[r.id] = thumbR.domElement.toDataURL('image/png');
    s.traverse((o) => { if (o.geometry) o.geometry.dispose(); });
    return thumbs[r.id];
  } catch (e) { return null; }
};

// Generic hook for the other 3D stages: they build their own scene and drive it every frame.
D.custom = (o) => {
  if (!D.ok) return false;
  stop();
  scene = o.scene; camera = o.camera; cust = o; scene.environment = scene.environment || D.env;
  start('custom');
  return true;
};
D.env3 = () => D.env;
D.stop = () => stop();
// A camera whose z=0 plane maps 1:1 onto screen pixels: world (x, -y, 0) lands on screen (x, y).
// The eye sits at screen height ey and looks straight ahead (a shift lens), so verticals stay upright.
export function screenCam(cam, W, H, ey, fov = 30) {
  const D0 = H / (2 * Math.tan((fov * Math.PI) / 360));
  cam.fov = fov; cam.aspect = W / H; cam.near = 2; cam.far = D0 * 6;
  cam.position.set(W / 2, -ey, D0); cam.lookAt(W / 2, -ey, 0);
  cam.setViewOffset(W, H, 0, H / 2 - ey, W, H); cam.updateProjectionMatrix();
  cam.userData = { D: D0, W, H, ey };
  return cam;
}
// Screen point (x, y) at depth z: world position plus the factor that keeps pixel sizes true.
export function unproject(cam, x, y, z = 0) {
  const { D: D0, W, ey } = cam.userData, k = D0 / (D0 - z);
  return { p: new THREE.Vector3(W / 2 + (x - W / 2) / k, -(ey + (y - ey) / k), z), s: 1 / k };
}
// Depth at which a screen point lands on a horizontal floor at screen height fy (as seen at z=0).
export function floorZ(cam, y, fy) { const { D: D0, ey } = cam.userData; const k = (y - ey) / (fy - ey); return D0 * (1 - 1 / k); }
export const setSeed = (v) => { seed = v; };
export { THREE, T, M, glossy, blob, leaf, instanced, sprig, berryCluster, chanterelle, elderflower, flecks, salt, droplets, fillet, hazelnut, carrotCoin, meatChunk, breastWhole, breastSlices, porciniSlice, handPie, juniper, shadowed, flatLie, normUV, canvasTex, rr, rnd, fbm, keyLight, speckle, RoomEnvironment, D as Dish3D };

D.ok = (() => { try { return init(); } catch (e) { console.warn('3D plating unavailable', e); return false; } })();
window.Dish3D = D;
window.dispatchEvent(new Event('dish3d'));
