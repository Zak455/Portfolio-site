// Hearthwild · the hearth in 3D. Mirrors CookScene's state every frame:
// the game logic and input stay in cook.js, this module only renders.
import { THREE, Dish3D, T, M, blob, leaf, instanced, berryCluster, chanterelle, flecks, fillet, carrotCoin, meatChunk, breastWhole, porciniSlice, handPie, juniper, shadowed, canvasTex, rr, rnd, setSeed, fbm, speckle, screenCam, unproject, floorZ } from './dish3d.js';

const TAU = Math.PI * 2;
const SKYP = (t) => (window.SKY ? window.SKY[t] : null);

// ── shared geometry ─────────────────────────────────────────────────────────
export function roundedBox(w, h, d, r, seg = 3) {
  const g = new THREE.BoxGeometry(w, h, d, seg * 2, seg * 2, seg * 2), p = g.attributes.position, v = new THREE.Vector3(), c = new THREE.Vector3();
  const hx = w / 2 - r, hy = h / 2 - r, hz = d / 2 - r;
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    c.set(Math.max(-hx, Math.min(hx, v.x)), Math.max(-hy, Math.min(hy, v.y)), Math.max(-hz, Math.min(hz, v.z)));
    v.sub(c); if (v.lengthSq() > 0) v.normalize().multiplyScalar(r);
    p.setXYZ(i, c.x + v.x, c.y + v.y, c.z + v.z);
  }
  g.computeVertexNormals(); return g;
}
const tex = {
  plaster: (night) => canvasTex('plaster' + night, 512, 512, (c, w, h) => {
    setSeed(3); c.fillStyle = night ? '#4a3a32' : '#a88a6c'; c.fillRect(0, 0, w, h);
    for (let y = 0; y < h; y += 4) for (let x = 0; x < w; x += 4) { const n = fbm(x / 70, y / 70); c.fillStyle = `rgba(${n > 0.5 ? '255,235,210' : '60,36,20'},${Math.abs(n - 0.5) * 0.35})`; c.fillRect(x, y, 4, 4); }
    speckle(c, w, h, 600, ['#6a4a34', '#d8c0a0'], 0.5, 1.6);
  }, { repeat: 3 }),
  flag: () => canvasTex('flag', 1024, 1024, (c, w, h) => {
    setSeed(4); c.fillStyle = '#2a201a'; c.fillRect(0, 0, w, h);
    const rows = 6; for (let r = 0; r < rows; r++) { let x = -rnd() * 120; const y = (r * h) / rows; while (x < w) { const sw = rr(120, 240); const base = ['#6e5e50', '#5e5044', '#7a6a5a', '#665648'][(rnd() * 4) | 0]; c.fillStyle = base; c.beginPath(); c.roundRect(x + 4, y + 4, sw - 8, h / rows - 8, 14); c.fill(); for (let k = 0; k < 40; k++) { c.fillStyle = `rgba(${rnd() < 0.5 ? '255,240,220' : '20,10,4'},${rr(0.03, 0.09)})`; c.beginPath(); c.ellipse(x + rnd() * sw, y + rnd() * h / rows, rr(4, 26), rr(3, 12), rnd() * 6, 0, TAU); c.fill(); } x += sw; } }
  }, { repeat: 2 }),
  bark: () => canvasTex('bark', 256, 256, (c, w, h) => {
    setSeed(6); c.fillStyle = '#4a3020'; c.fillRect(0, 0, w, h);
    for (let i = 0; i < 90; i++) { c.strokeStyle = `rgba(${rnd() < 0.5 ? '20,10,4' : '140,100,70'},${rr(0.2, 0.5)})`; c.lineWidth = rr(1, 4); c.beginPath(); const x = rnd() * w; c.moveTo(x, 0); c.bezierCurveTo(x + rr(-10, 10), h * 0.3, x + rr(-10, 10), h * 0.6, x + rr(-6, 6), h); c.stroke(); }
  }),
  ember: () => canvasTex('ember', 256, 256, (c, w, h) => {
    setSeed(8); c.fillStyle = '#000'; c.fillRect(0, 0, w, h);
    for (let i = 0; i < 70; i++) { c.strokeStyle = `rgba(255,${(rr(80, 160)) | 0},30,${rr(0.4, 1)})`; c.lineWidth = rr(1, 3); c.beginPath(); let x = rnd() * w, y = rnd() * h; c.moveTo(x, y); for (let k = 0; k < 4; k++) { x += rr(-20, 20); y += rr(-14, 14); c.lineTo(x, y); } c.stroke(); }
    const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(0.6, 'rgba(255,90,20,.25)'); g.addColorStop(1, 'rgba(255,120,30,.6)'); c.fillStyle = g; c.fillRect(0, 0, w, h);
  }),
  brick: () => canvasTex('brick', 512, 512, (c, w, h) => {
    setSeed(10); c.fillStyle = '#140a06'; c.fillRect(0, 0, w, h);
    for (let y = 0, r = 0; y < h; y += 32, r++) for (let x = (r % 2) * -32; x < w; x += 64) { c.fillStyle = `rgb(${(rr(50, 80)) | 0},${(rr(24, 36)) | 0},${(rr(14, 22)) | 0})`; c.fillRect(x + 2, y + 2, 60, 28); }
  }, { repeat: 2 }),
};
function windowSky(P, ww, wh) {
  const cv = document.createElement('canvas'); cv.width = 256; cv.height = 300; const c = cv.getContext('2d'), w = 256, h = 300;
  const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, P.top); g.addColorStop(0.6, P.mid); g.addColorStop(1, P.hor); c.fillStyle = g; c.fillRect(0, 0, w, h);
  setSeed(12); if (P.stars) for (let i = 0; i < 40; i++) { c.fillStyle = 'rgba(255,250,230,.9)'; c.fillRect(rnd() * w, rnd() * h * 0.5, 1.4, 1.4); }
  const sg = c.createRadialGradient(w * P.sunX, h * P.sunY * 0.8, 0, w * P.sunX, h * P.sunY * 0.8, w * 0.5); sg.addColorStop(0, P.sun); sg.addColorStop(0.2, P.sun + 'cc'); sg.addColorStop(1, P.sun + '00'); c.fillStyle = sg; c.fillRect(0, 0, w, h);
  c.fillStyle = P.far; c.beginPath(); c.moveTo(0, h * 0.72); for (let x = 0; x <= w; x += 8) c.lineTo(x, h * 0.7 - Math.sin(x * 0.05) * 8 - Math.sin(x * 0.13) * 4); c.lineTo(w, h); c.lineTo(0, h); c.fill();
  c.fillStyle = P.tree; for (let x = 0; x < w; x += 9) { const th = rr(18, 40); c.beginPath(); c.ellipse(x, h * 0.8 - th * 0.3, 7, th * 0.5, 0, 0, TAU); c.fill(); }
  c.fillStyle = P.grass; c.fillRect(0, h * 0.86, w, h * 0.14);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; return t;
}

// ── 3D ingredients for the pan (vessel radius = 1) ─────────────────────────
const RAW = { rabbitPiece: '#e2a294', pheasantBreast: '#e08a7a', venisonDice: '#8a2424', troutFillet: null };
export function ing3d(id) {
  setSeed(id.length * 31 + 7);
  let o;
  switch (id) {
    case 'butter': { o = new THREE.Mesh(roundedBox(0.3, 0.16, 0.22, 0.04), M.phys({ color: '#f0c850', roughness: 0.3, clearcoat: 0.6, sheen: 0.5, sheenColor: new THREE.Color('#fff4c0') })); o.position.y = 0.08; break; }
    case 'chanterelleSlice': o = new THREE.Group().add(chanterelle(0.2)); o.children[0].position.y = 0.06; break;
    case 'garlicChop': o = flecks(16, 0.18, '#4e8a30', 0.045, 0.02); break;
    case 'sorrelChop': o = flecks(14, 0.18, '#4a9a34', 0.06, 0.02); break;
    case 'thymeLeaves': o = flecks(18, 0.2, '#6a8a48', 0.03, 0.02); break;
    case 'rosemaryChop': o = flecks(18, 0.2, '#3f5a3a', 0.035, 0.02); break;
    case 'troutFillet': { const f = fillet(); f.scale.setScalar(1.05); f.position.y = 0.05; o = new THREE.Group().add(f); break; }
    case 'pheasantBreast': { const b = breastWhole(0); b.scale.setScalar(1.15); b.position.y = 0.06; o = new THREE.Group().add(b); break; }
    case 'rabbitPiece': o = new THREE.Group().add(meatChunk(0.13, '#a0602c', rnd() * 9)); o.children[0].position.y = 0.08; break;
    case 'venisonDice': o = new THREE.Group().add(meatChunk(0.075, '#6a2416', rnd() * 9)); o.children[0].position.y = 0.06; break;
    case 'carrotCoin': o = new THREE.Group().add(carrotCoin()); o.children[0].position.y = 0.03; break;
    case 'blackberry': o = berryCluster(0.055, 0.024, '#1e0a22'); break;
    case 'juniperCrushed': o = juniper(10, 0.18, 0); break;
    case 'chanterelle': o = new THREE.Group().add(chanterelle(0.32)); o.children[0].position.y = 0.1; break;
    case 'porcini': { o = new THREE.Group(); const st2 = new THREE.Mesh(blob(0.09, 0.14, 0.09, 0.06, 3, 2), M.phys({ color: '#efe2c4', roughness: 0.6 })); st2.position.y = 0.12; const cap = new THREE.Mesh(new THREE.SphereGeometry(0.17, 24, 14, 0, TAU, 0, Math.PI / 2), M.phys({ color: '#8a4e22', roughness: 0.4, clearcoat: 0.6 })); cap.scale.y = 0.6; cap.position.y = 0.22; o.add(st2, cap); o.rotation.z = 1.3; o.position.y = 0.05; break; }
    case 'carrot': { const cg = new THREE.ConeGeometry(0.07, 0.55, 18); cg.rotateZ(Math.PI / 2); o = new THREE.Group().add(new THREE.Mesh(cg, M.phys({ color: '#ec7a22', roughness: 0.35, clearcoat: 0.5 }))); o.children[0].position.y = 0.07; break; }
    case 'trout': { const fg = blob(0.42, 0.09, 0.11, 0.03, 2, 4, 32), pp = fg.attributes.position; for (let i = 0; i < pp.count; i++) { const x = pp.getX(i) / 0.42; pp.setZ(i, pp.getZ(i) * (1 - Math.max(0, x) * 0.4)); pp.setY(i, pp.getY(i) * (1 - Math.abs(x) * 0.3)); } fg.computeVertexNormals(); o = new THREE.Group().add(new THREE.Mesh(fg, M.phys({ map: T.skin(), color: '#c8c0b0', roughness: 0.2, clearcoat: 1, metalness: 0.2 }))); o.children[0].position.y = 0.08; break; }
    case 'pheasantPlucked': o = new THREE.Group().add(new THREE.Mesh(blob(0.22, 0.14, 0.17, 0.08, 3, 5), M.phys({ color: '#e8c0a8', roughness: 0.5, sheen: 0.5 }))); o.children[0].position.y = 0.12; break;
    case 'pastry': o = new THREE.Group().add(pastryDisc()); o.children[0].scale.set(1.4, 1, 1.4); o.children[0].position.y = 0.02; break;
    case 'porciniSlice': { const p = porciniSlice(); p.scale.setScalar(1.4); p.position.y = 0.02; o = new THREE.Group().add(p); break; }
    default: o = new THREE.Mesh(blob(0.1, 0.06, 0.1, 0.1, 3, 1), M.phys({ color: '#b08050', roughness: 0.4 }));
  }
  shadowed(o);
  // remember each material's finished colour so browning can be applied on top
  o.traverse((m) => { if (m.material) [].concat(m.material).forEach((mt) => { mt.userData.base = mt.color.clone(); }); });
  if (RAW[id]) o.traverse((m) => { if (m.material) [].concat(m.material).forEach((mt) => { mt.userData.raw = new THREE.Color(RAW[id]); }); });
  o.userData.id = id;
  return o;
}
const BURNT = new THREE.Color('#3a1a08'), GLAZE = new THREE.Color('#4a1030');
function tint(o, brown, glaze) {
  o.traverse((m) => {
    if (!m.material) return;
    [].concat(m.material).forEach((mt) => {
      const u = mt.userData; if (!u.base) return;
      if (u.raw) mt.color.copy(u.raw).lerp(u.base, Math.min(1, brown * 1.8)); else mt.color.copy(u.base);
      mt.color.lerp(BURNT, Math.max(0, brown - 0.45) * 0.9);
      if (glaze) mt.color.lerp(GLAZE, glaze * 0.55);
    });
  });
}

// ── vessels ────────────────────────────────────────────────────────────────
const iron = () => M.phys({ color: '#2c2c30', metalness: 0.65, roughness: 0.42, clearcoat: 0.25, clearcoatRoughness: 0.5 });
function skillet() {
  const prof = [[0, 0], [0.86, 0], [0.96, 0.05], [1.02, 0.24], [0.98, 0.26], [0.9, 0.08], [0.8, 0.065], [0, 0.065]].map(([x, y]) => new THREE.Vector2(x, y));
  const g = new THREE.Group(); g.add(new THREE.Mesh(new THREE.LatheGeometry(prof, 80), iron()));
  const h = new THREE.Mesh(roundedBox(0.95, 0.07, 0.15, 0.03), iron()); h.position.set(1.42, 0.2, 0); h.rotation.z = 0.12; g.add(h);
  const grip = new THREE.Mesh(new THREE.CapsuleGeometry(0.075, 0.42, 4, 12), M.phys({ color: '#7a4a28', roughness: 0.55, clearcoat: 0.3 })); grip.rotation.z = Math.PI / 2 + 0.12; grip.position.set(1.72, 0.24, 0); g.add(grip);
  g.userData.floor = 0.07; return shadowed(g);
}
function pot() {
  const prof = [[0, 0], [0.7, 0], [0.9, 0.08], [1.0, 0.4], [1.0, 0.76], [1.07, 0.8], [1.0, 0.83], [0.93, 0.79], [0.93, 0.12], [0.7, 0.075], [0, 0.075]].map(([x, y]) => new THREE.Vector2(x, y));
  const g = new THREE.Group(); g.add(new THREE.Mesh(new THREE.LatheGeometry(prof, 80), iron()));
  const bail = new THREE.Mesh(new THREE.TorusGeometry(1.04, 0.022, 8, 60, Math.PI), iron()); bail.position.y = 0.78; bail.rotation.x = -0.55; g.add(bail);
  for (const s of [-1, 1]) { const lug = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.02, 6, 16), iron()); lug.position.set(s * 1.03, 0.76, 0); lug.rotation.y = Math.PI / 2; g.add(lug); }
  g.userData.floor = 0.09; return shadowed(g);
}
function slab() {
  const geo = roundedBox(2.3, 0.14, 1.0, 0.06, 3), p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) p.setY(i, p.getY(i) + (fbm(p.getX(i) * 3, p.getZ(i) * 3) - 0.5) * 0.03);
  geo.computeVertexNormals();
  const g = new THREE.Group(); g.add(new THREE.Mesh(geo, M.phys({ color: '#8a7c6e', map: T.stone(), roughness: 0.85 }))); g.userData.floor = 0.08; return shadowed(g);
}
export function pastryDisc() {
  const g = new THREE.CylinderGeometry(0.27, 0.28, 0.025, 40), p = g.attributes.position;
  for (let i = 0; i < p.count; i++) { const a = Math.atan2(p.getZ(i), p.getX(i)), r = Math.hypot(p.getX(i), p.getZ(i)); if (r > 0.2) { const k = 1 + Math.sin(a * 7) * 0.04; p.setX(i, p.getX(i) * k); p.setZ(i, p.getZ(i) * k); } }
  g.computeVertexNormals();
  const m = new THREE.Mesh(g, M.phys({ map: T.pastry(), color: '#fff0d8', roughness: 0.6, sheen: 0.4 })); m.userData.pastry = true; return shadowed(m);
}
function spoon() {
  const g = new THREE.Group(), wood = M.phys({ color: '#c08a52', roughness: 0.5, clearcoat: 0.3 });
  const bowl = new THREE.Mesh(new THREE.SphereGeometry(1, 20, 12, 0, TAU, Math.PI / 2, Math.PI / 2), wood); bowl.scale.set(0.16, 0.06, 0.22); g.add(bowl);
  const h = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 1.5, 10), wood); h.position.set(0, 0.75, -0.22); h.rotation.x = -0.28; g.add(h);
  return shadowed(g);
}
function jug() {
  const prof = [[0, 0], [0.3, 0], [0.36, 0.1], [0.38, 0.4], [0.3, 0.62], [0.26, 0.7], [0.3, 0.76], [0.28, 0.78], [0.23, 0.72], [0, 0.7]].map(([x, y]) => new THREE.Vector2(x, y));
  const g = new THREE.Group(); g.add(new THREE.Mesh(new THREE.LatheGeometry(prof, 40), M.phys({ color: '#d8c8a8', map: T.stone(), roughness: 0.4, clearcoat: 0.6, side: THREE.DoubleSide })));
  const hd = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.035, 8, 20, Math.PI), g.children[0].material); hd.position.set(-0.36, 0.42, 0); hd.rotation.z = Math.PI / 2; g.add(hd);
  return shadowed(g);
}

// ── the stage ──────────────────────────────────────────────────────────────
let S = null;
function build(cs) {
  const W = innerWidth, H = innerHeight, r = cs.r, P = SKYP(r.time) || {}, night = r.time === 'dusk';
  const scene = new THREE.Scene(); scene.background = new THREE.Color(night ? '#120a08' : '#24160e');
  const cam = screenCam(new THREE.PerspectiveCamera(), W, H, -H * 0.12);
  const { hw, hx, fy } = cs, top = fy - hw * 0.62, zw = -hw * 0.42, fz = -hw * 0.12;
  const st = { scene, cam, cs, key: W + 'x' + H, fire: [], sparks: [], contents: new Map() };
  const at = (x, y, z) => unproject(cam, x, y, z);

  // light
  scene.add(new THREE.HemisphereLight(night ? '#5a4a7a' : '#ffe8cc', '#2a1408', night ? 0.18 : 0.3));
  const sun = new THREE.DirectionalLight(P.light || '#ffd8a8', night ? 0.3 : 1.0); sun.position.set(W * 0.05, H * 0.2, hw * 2.4); sun.target.position.set(hx, -fy, 0);
  sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); const sc = sun.shadow.camera; sc.left = -W; sc.right = W; sc.top = H; sc.bottom = -H; sc.near = 10; sc.far = hw * 8; sun.shadow.bias = -0.0006; sun.shadow.normalBias = 1.5;
  scene.add(sun, sun.target);
  const fireL = new THREE.PointLight('#ff8a3a', 3, hw * 4, 0); fireL.position.copy(at(hx, cs.fireY - hw * 0.08, fz + hw * 0.08).p); scene.add(fireL); st.fireL = fireL;

  // wall, floor
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(W * 4, H * 4), M.std({ map: tex.plaster(night ? 1 : 0), roughness: 0.95 }));
  wall.position.copy(at(W / 2, H / 2, zw).p); wall.receiveShadow = true; scene.add(wall);
  const beam = new THREE.Mesh(roundedBox(W * 3, H * 0.08, hw * 0.3, 6), M.phys({ color: '#3a2416', roughness: 0.7 })); beam.position.copy(at(W / 2, H * 0.02, zw + hw * 0.15).p); scene.add(beam);
  const floorT = tex.flag().clone(); floorT.needsUpdate = true; floorT.repeat.set(W * 3 / (hw * 1.6), H * 3 / (hw * 1.6));
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W * 6, H * 6), M.phys({ map: floorT, roughness: 0.75, clearcoat: 0.15 }));
  floor.rotation.x = -Math.PI / 2; floor.position.set(W / 2, -fy, zw + H * 3); floor.receiveShadow = true; scene.add(floor);

  // hearth: stone pillars and lintel, firebox, mantel
  setSeed(55);
  const stoneMat = M.phys({ map: T.stone(), roughness: 0.82, color: '#ffffff' });
  const stones = []; const sh = hw * 0.058, sd = hw * 0.09;
  const course = (x0, x1, y0, y1, z) => { for (let y = y1 - sh / 2, row = 0; y > y0; y -= sh * 1.06, row++) { let x = x0 - (row % 2) * hw * 0.04; while (x < x1) { const w = Math.min(rr(hw * 0.07, hw * 0.12), x1 - x); if (w > hw * 0.025) stones.push([x + w / 2, y, w, z]); x += w + hw * 0.006; } } };
  course(hx - hw * 0.56, hx - hw * 0.39, top, fy, hw * 0.02);
  course(hx + hw * 0.39, hx + hw * 0.56, top, fy, hw * 0.02);
  course(hx - hw * 0.56, hx + hw * 0.56, top - hw * 0.09, top + hw * 0.02, hw * 0.02);
  const sg = roundedBox(1, 1, 1, 0.3, 3), cols = ['#8a7a6a', '#7a6c5e', '#968676', '#6e6256', '#84766a', '#a09080'];
  { const pp = sg.attributes.position; for (let i = 0; i < pp.count; i++) { const x = pp.getX(i), y = pp.getY(i), z = pp.getZ(i); const n = 1 + (fbm(x * 4 + 2, y * 4 + z * 3) - 0.5) * 0.12; pp.setXYZ(i, x * n, y * n, z); } sg.computeVertexNormals(); }
  const im = new THREE.InstancedMesh(sg, stoneMat, stones.length), o = new THREE.Object3D(), col = new THREE.Color();
  stones.forEach(([x, y, w, z], i) => { const q = at(x, y, z); o.position.copy(q.p); o.scale.set(w * q.s * 0.96, sh * q.s * 0.9, sd * rr(0.7, 1)); o.rotation.set(rr(-0.03, 0.03), rr(-0.04, 0.04), rr(-0.02, 0.02)); o.updateMatrix(); im.setMatrixAt(i, o.matrix); im.setColorAt(i, col.set(cols[(rnd() * cols.length) | 0])); });
  im.castShadow = im.receiveShadow = true; scene.add(im);
  // firebox
  const fb = at(hx, (top + fy) / 2 + hw * 0.02, zw + 2);
  const back = new THREE.Mesh(new THREE.PlaneGeometry(hw * 0.8 * fb.s * 1.05, (fy - top) * fb.s * 1.05), M.std({ map: tex.brick(), roughness: 0.95, emissive: '#ff5010', emissiveIntensity: 0, emissiveMap: tex.brick() }));
  back.position.copy(fb.p); scene.add(back); st.back = back;
  for (const s of [-1, 1]) { const side = new THREE.Mesh(new THREE.PlaneGeometry(-zw + hw * 0.05, (fy - top) * 1.02), M.std({ color: '#1a0e08', roughness: 1 })); const q = at(hx + s * hw * 0.385, (top + fy) / 2, (zw + hw * 0.03) / 2); side.position.copy(q.p); side.position.x = hx + s * hw * 0.385; side.rotation.y = -s * Math.PI / 2; scene.add(side); }
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(hw * 0.8, -zw + hw * 0.05), M.std({ color: '#0e0704' })); ceil.rotation.x = Math.PI / 2; ceil.position.set(hx, -top - hw * 0.02, (zw + hw * 0.03) / 2); scene.add(ceil);
  const hearthSlab = new THREE.Mesh(roundedBox(hw * 1.2, hw * 0.03, hw * 0.4, 4), M.phys({ map: T.stone(), color: '#8a7c70', roughness: 0.85 })); hearthSlab.position.set(hx, -fy + hw * 0.015, -hw * 0.12); hearthSlab.receiveShadow = true; scene.add(hearthSlab);
  // mantel beam with candles and a copper jar
  const mq = at(hx, top - hw * 0.12, hw * 0.1);
  const mantel = new THREE.Mesh(roundedBox(hw * 1.3 * mq.s, hw * 0.065 * mq.s, hw * 0.3, 5), M.phys({ color: '#5a341c', map: T.wood(), roughness: 0.6, clearcoat: 0.2 })); mantel.position.copy(mq.p); scene.add(shadowed(mantel));
  const mTop = mq.p.y + hw * 0.0325 * mq.s;
  st.candles = [];
  [[-0.5, 0.075], [-0.43, 0.05]].forEach(([dx, h]) => {
    const c = new THREE.Mesh(new THREE.CylinderGeometry(hw * 0.012, hw * 0.013, hw * h, 16), M.phys({ color: '#f2e6d0', roughness: 0.5, sheen: 0.5 }));
    c.position.set(hx + hw * dx * mq.s, mTop + hw * h / 2, hw * 0.12); scene.add(shadowed(c));
    const f = new THREE.Sprite(new THREE.SpriteMaterial({ map: T.flame(), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
    f.position.set(c.position.x, mTop + hw * h + hw * 0.016, hw * 0.12); f.scale.set(hw * 0.016, hw * 0.036, 1); scene.add(f);
    const gl = new THREE.Sprite(new THREE.SpriteMaterial({ map: T.soft(), color: '#ffa040', blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.3 })); gl.position.copy(f.position); gl.scale.setScalar(hw * 0.12); scene.add(gl);
    st.candles.push({ f, gl });
  });
  const jar = new THREE.Mesh(new THREE.SphereGeometry(hw * 0.035, 20, 14), M.phys({ color: '#c07a3a', metalness: 1, roughness: 0.28 })); jar.scale.y = 0.85; jar.position.set(hx + hw * 0.45 * mq.s, mTop + hw * 0.03, hw * 0.12); scene.add(shadowed(jar));

  // window with this hour's sky
  const portrait = W < H;
  const ww = portrait ? W * 0.42 : Math.min(W * 0.18, 230), wh = ww * 1.2, wx = W * 0.06, wy = portrait ? H * 0.1 : H * 0.16;
  const wq = at(wx + ww / 2, wy + wh / 2, zw + 1);
  const pane = new THREE.Mesh(new THREE.PlaneGeometry(ww * wq.s, wh * wq.s), new THREE.MeshBasicMaterial({ map: windowSky(P.top ? P : { top: '#4a90d2', mid: '#97c9e8', hor: '#e8f5ec', sun: '#fffbe8', sunX: .7, sunY: .2, far: '#a1c3cc', tree: '#2f5a49', grass: '#8dbb5c' }, ww, wh) }));
  pane.position.copy(wq.p); scene.add(pane);
  const frameM = M.phys({ color: '#3a2416', roughness: 0.6 }), fw = 10 * wq.s, fdep = 14;
  const bar = (x, y, w, h) => { const b = new THREE.Mesh(roundedBox(w, h, fdep, 2), frameM); b.position.set(x, y, wq.p.z + fdep / 2); scene.add(shadowed(b)); };
  const L = wq.p.x - ww * wq.s / 2, R = wq.p.x + ww * wq.s / 2, Tt = wq.p.y + wh * wq.s / 2, B = wq.p.y - wh * wq.s / 2;
  bar(wq.p.x, Tt, ww * wq.s + fw * 2, fw); bar(wq.p.x, B, ww * wq.s + fw * 2, fw); bar(L, wq.p.y, fw, wh * wq.s); bar(R, wq.p.y, fw, wh * wq.s); bar(wq.p.x, wq.p.y, fw * 0.6, wh * wq.s); bar(wq.p.x, wq.p.y, ww * wq.s, fw * 0.6);
  const sill = new THREE.Mesh(roundedBox(ww * wq.s + 40, 10, 50, 3), M.phys({ color: '#5a3a22', roughness: 0.6 })); sill.position.set(wq.p.x, B - 8, wq.p.z + 25); scene.add(shadowed(sill));
  const potP = new THREE.Mesh(new THREE.CylinderGeometry(13, 10, 22, 16), M.phys({ color: '#a4553a', roughness: 0.7 })); potP.position.set(wq.p.x + ww * wq.s * 0.2, B + 9, wq.p.z + 25); scene.add(shadowed(potP));
  for (let i = 0; i < 6; i++) { const l = leaf(30, 9, '#4f8a42'); l.rotation.set(-Math.PI / 2 + 0.4, i, rr(-0.6, 0.6)); l.position.set(potP.position.x, B + 22, potP.position.z); scene.add(shadowed(l)); }
  // window light shaft
  const shaft = new THREE.Sprite(new THREE.SpriteMaterial({ map: T.soft(), color: P.light || '#ffd8a8', blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: night ? 0.05 : 0.14 }));
  shaft.position.set(wq.p.x + ww * 0.6, wq.p.y - wh * 0.6, wq.p.z + 60); shaft.scale.set(ww * 3, wh * 3, 1); scene.add(shaft);

  // shelf with jars and hanging herbs
  const sx = portrait ? W * 0.56 : W * 0.78, sw = portrait ? W * 0.4 : W * 0.18, sy = portrait ? H * 0.2 : H * 0.3;
  const shq = at(sx + sw / 2, sy, zw + 30);
  const shelf = new THREE.Mesh(roundedBox(sw * shq.s, 9, 60, 3), M.phys({ color: '#4a2e1a', map: T.wood(), roughness: 0.6 })); shelf.position.copy(shq.p); scene.add(shadowed(shelf));
  setSeed(66); const jarCols = ['#d9a441', '#9b3a2e', '#e8e0c8', '#6a8a4a', '#c86a2a'];
  for (let x = shq.p.x - sw * shq.s / 2 + 16; x < shq.p.x + sw * shq.s / 2 - 16;) {
    const jr = rr(9, 14), jh = rr(26, 46);
    const fill = new THREE.Mesh(new THREE.CylinderGeometry(jr * 0.86, jr * 0.86, jh * 0.65, 18), M.phys({ color: jarCols[(rnd() * 5) | 0], roughness: 0.7 })); fill.position.set(x, shq.p.y + 4.5 + jh * 0.33, shq.p.z); scene.add(shadowed(fill));
    const glass = new THREE.Mesh(new THREE.CylinderGeometry(jr, jr, jh, 20, 1, true), M.phys({ color: '#ffffff', roughness: 0.05, transparent: true, opacity: 0.25, clearcoat: 1, side: THREE.DoubleSide })); glass.position.set(x, shq.p.y + 4.5 + jh / 2, shq.p.z); scene.add(glass);
    const lid = new THREE.Mesh(new THREE.CylinderGeometry(jr * 0.9, jr * 0.9, 6, 18), M.phys({ color: '#b08a60', roughness: 0.6 })); lid.position.set(x, shq.p.y + 4.5 + jh + 3, shq.p.z); scene.add(shadowed(lid));
    x += jr * 2 + rr(5, 12);
  }
  for (let i = 0; i < 4; i++) {
    const bx = shq.p.x - sw * shq.s / 2 + sw * shq.s * (0.15 + i * 0.22), bundle = new THREE.Group();
    for (let k = 0; k < 7; k++) { const l = leaf(40, 7, ['#6a7a4a', '#7a8a50', '#8a7a4a'][k % 3]); l.rotation.set(Math.PI / 2 + rr(-0.3, 0.3), rr(0, 6), rr(-0.3, 0.3)); bundle.add(l); }
    const tie = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 6, 8), M.std({ color: '#c8a870' })); bundle.add(tie);
    bundle.position.set(bx, shq.p.y - 30, shq.p.z + 10); bundle.rotation.z = rr(-0.1, 0.1); scene.add(shadowed(bundle));
  }

  // logs, embers, fire
  const fq = at(hx, fy - hw * 0.03, fz);
  const logs = new THREE.Group(); logs.position.copy(fq.p);
  const barkM = M.phys({ map: tex.bark(), roughness: 0.9, emissive: '#ff5a10', emissiveMap: tex.ember(), emissiveIntensity: 0.6 });
  [[-0.2, 0.18, 0.05], [0.2, -0.18, -0.03], [0, 0.02, 0.0]].forEach(([dx, rot, dz], i) => {
    const l = new THREE.Mesh(new THREE.CylinderGeometry(hw * 0.035, hw * 0.04, hw * 0.3, 14), barkM); l.rotation.set(Math.PI / 2 - 0.15, rot * 3, Math.PI / 2 + rot);
    l.position.set(dx * hw * 0.25, hw * (i === 2 ? 0.07 : 0.035), dz * hw); logs.add(l);
  });
  const embers = instanced(new THREE.SphereGeometry(1, 8, 6), new THREE.MeshStandardMaterial({ color: '#2a1006', emissive: '#ff6a20', emissiveIntensity: 1.2 }), 40, (o2) => { o2.position.set(rr(-1, 1) * hw * 0.16, rr(0, 0.01) * hw, rr(-1, 1) * hw * 0.08); o2.scale.setScalar(rr(4, 9) * hw / 600); });
  logs.add(embers); scene.add(shadowed(logs)); st.barkM = barkM; st.embers = embers;
  const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: T.soft(), color: '#ff7a2a', blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.4 }));
  glow.position.copy(fq.p).add(new THREE.Vector3(0, hw * 0.08, -2)); glow.scale.setScalar(hw * 0.7); scene.add(glow); st.glow = glow;
  st.fireBase = fq.p.clone(); st.fireBase.y += hw * 0.05;
  const flameMat = new THREE.SpriteMaterial({ map: T.flame(), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true });
  for (let i = 0; i < 70; i++) { const s = new THREE.Sprite(flameMat.clone()); s.visible = false; s.userData = { life: 0 }; scene.add(s); st.fire.push(s); }
  const sparkMat = new THREE.SpriteMaterial({ map: T.soft(), color: '#ffc870', blending: THREE.AdditiveBlending, depthWrite: false, transparent: true });
  for (let i = 0; i < 30; i++) { const s = new THREE.Sprite(sparkMat.clone()); s.visible = false; s.userData = { life: 0 }; scene.add(s); st.sparks.push(s); }

  // trivet and vessel
  const V = r.vessel, vr = cs.vr;
  if (V !== 'stone') {
    const tq = at(hx, fy - hw * 0.12, 0), tri = new THREE.Group();
    const bar1 = new THREE.Mesh(new THREE.CylinderGeometry(hw * 0.008, hw * 0.008, hw * 0.42, 8), iron()); bar1.rotation.z = Math.PI / 2; tri.add(bar1);
    for (const s of [-1, 1]) for (const zz of [-1, 1]) { const leg = new THREE.Mesh(new THREE.CylinderGeometry(hw * 0.007, hw * 0.007, hw * 0.13, 6), iron()); leg.position.set(s * hw * 0.19, -hw * 0.06, zz * hw * 0.06); tri.add(leg); }
    tri.position.copy(tq.p); scene.add(shadowed(tri));
  }
  const vessel = V === 'skillet' ? skillet() : V === 'pot' ? pot() : slab();
  const holder = new THREE.Group(), inner = new THREE.Group(); holder.add(inner); inner.add(vessel);
  holder.scale.setScalar(vr); holder.rotation.x = V === 'stone' ? 0.1 : 0.2;
  scene.add(holder); st.holder = holder; st.inner = inner; st.vessel = vessel;
  const food = new THREE.Group(); inner.add(food); st.food = food;
  if (V === 'pot') {
    const lp = []; for (let i = 0; i <= 16; i++) lp.push(new THREE.Vector2((i / 16) * 0.92, 0));
    const lg = new THREE.LatheGeometry(lp.reverse(), 64), pp = lg.attributes.position;
    for (let i = 0; i < pp.count; i++) pp.setY(i, (fbm(pp.getX(i) * 5 + 3, pp.getZ(i) * 5) - 0.5) * 0.03);
    lg.computeVertexNormals();
    st.liquid = new THREE.Mesh(lg, M.phys({ color: '#8a5a2a', roughness: 0.1, clearcoat: 1, side: THREE.DoubleSide })); st.liquid.visible = false; inner.add(st.liquid);
  }
  if (cs.pies) {
    st.pies = cs.pies.map((_, i) => { const g = new THREE.Group(), d = pastryDisc(), hp = handPie(i * 3); hp.scale.setScalar(0.001); hp.visible = false; g.add(d, hp); g.position.set((i - 1) * 0.62, 0.08, 0); inner.add(g); return { g, d, hp }; });
  }
  // tray bowl, spoon, jug
  const trayBowl = new THREE.Group();
  const tb = new THREE.Mesh(new THREE.LatheGeometry([[0, 0.04], [0.5, 0.04], [0.55, 0], [0.7, 0.02], [0.95, 0.3], [1.0, 0.42], [0.95, 0.42], [0.88, 0.3], [0.6, 0.1], [0, 0.08]].map(([x, y]) => new THREE.Vector2(x, y)), 48), M.phys({ color: '#cdbfa8', map: T.stone(), roughness: 0.45, clearcoat: 0.6, side: THREE.DoubleSide }));
  trayBowl.add(tb); trayBowl.visible = false; scene.add(shadowed(trayBowl)); st.trayBowl = trayBowl;
  const trayGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: T.soft(), color: '#ffd890', blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.3 })); trayGlow.visible = false; scene.add(trayGlow); st.trayGlow = trayGlow;
  st.spoon = spoon(); st.spoon.visible = false; scene.add(st.spoon);
  st.jug = jug(); st.jug.visible = false; scene.add(st.jug);
  st.stream = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 1, 10), M.phys({ color: '#b88a50', roughness: 0.1, clearcoat: 1, transparent: true, opacity: 0.9 })); st.stream.visible = false; scene.add(st.stream);
  scene.traverse((m) => { if (m.material) [].concat(m.material).forEach((mt) => { if (mt.envMapIntensity !== undefined) mt.envMapIntensity = mt.metalness > 0.5 ? 0.55 : 0.25; }); });
  return st;
}

function placeVessel(st) {
  const cs = st.cs, vr = cs.vr, V = cs.r.vessel;
  const base = V === 'pot' ? cs.vy + vr * 0.8 : cs.vy + vr * 0.08;
  let tossY = 0, tossRot = 0;
  if (cs.toss) { const t = cs.toss.t; tossY = Math.sin(t * Math.PI) * 10; tossRot = Math.sin(t * Math.PI) * 0.15; }
  st.holder.position.set(cs.vx, -base + tossY, 0); st.inner.rotation.z = tossRot;
}

function tick(dt, time) {
  const st = S, cs = st.cs;
  if (!G.scene || G.scene !== cs) return;
  const key = innerWidth + 'x' + innerHeight;
  if (key !== st.key) { relayout(); return; }
  const h = cs.heat, hw = cs.hw, vr = cs.vr, fl = 0.85 + 0.15 * Math.sin(time * 13) * Math.sin(time * 7.3);
  placeVessel(st);
  // fire
  st.fireL.intensity = (1.8 + h * 5) * fl;
  st.barkM.emissiveIntensity = (0.15 + h * 0.7) * fl;
  st.embers.material.emissiveIntensity = 0.8 + h * 2.2 * fl;
  st.back.material.emissiveIntensity = (0.03 + h * 0.12) * fl;
  st.glow.material.opacity = (0.22 + h * 0.4) * fl; st.glow.scale.setScalar(hw * (0.5 + h * 0.5));
  const rate = dt * (28 + h * 110);
  for (let n = 0; n < rate || (Math.random() < rate - n && n < rate + 1); n++) {
    const s = st.fire.find((f) => !f.visible); if (!s) break;
    const u = s.userData, w = hw * 0.15 * (0.4 + h * 0.6);
    u.life = 0; u.max = rr(0.35, 0.8) * (0.6 + h * 0.8); u.x = rr(-w, w) * 1.7; u.z = rr(hw * 0.0, hw * 0.07); u.vy = rr(90, 170) * (0.6 + h * 1.1) * hw / 600; u.size = rr(40, 80) * (0.6 + h * 0.9) * hw / 600; u.y = 0;
    s.visible = true;
  }
  for (const s of st.fire) {
    if (!s.visible) continue; const u = s.userData; u.life += dt; const k = u.life / u.max;
    if (k >= 1) { s.visible = false; continue; }
    u.y += u.vy * dt; u.x *= 1 - dt * 0.6;
    s.position.set(st.fireBase.x + u.x, st.fireBase.y + u.y, st.fireBase.z + u.z);
    const sz = u.size * (1 - k * 0.6); s.scale.set(sz * 0.7, sz * 1.3, 1);
    s.material.opacity = Math.sin(Math.min(1, k * 4) * Math.PI / 2) * (1 - k);
    s.material.color.setRGB(1, 0.92 - k * 0.45, 0.75 - k * 0.6);
  }
  if (Math.random() < dt * (1 + h * 10)) { const s = st.sparks.find((f) => !f.visible); if (s) { const u = s.userData; u.life = 0; u.max = rr(0.8, 1.8); u.x = rr(-1, 1) * hw * 0.1; u.y = 0; u.vx = rr(-40, 40); u.vy = rr(120, 260) * (0.5 + h); u.seed = rr(0, 9); s.visible = true; } }
  for (const s of st.sparks) { if (!s.visible) continue; const u = s.userData; u.life += dt; if (u.life > u.max) { s.visible = false; continue; } u.y += u.vy * dt; u.x += (u.vx + Math.sin(u.life * 6 + u.seed) * 30) * dt; s.position.set(st.fireBase.x + u.x, st.fireBase.y + u.y, st.fireBase.z + 10); s.scale.setScalar(5); s.material.opacity = 1 - u.life / u.max; }
  st.candles.forEach((c, i) => { const f = 0.85 + Math.sin(time * 9 + i * 2) * 0.1 + Math.random() * 0.05; c.f.scale.set(hw * 0.016 * f, hw * 0.036 * f, 1); c.gl.material.opacity = 0.28 * f; });

  // contents
  const seen = new Set();
  const floorY = st.vessel.userData.floor;
  const lift = cs.toss ? Math.sin(cs.toss.t * Math.PI) * 1.1 : 0;
  const flipA = cs.toss && cs.step && cs.step.def.flip ? cs.toss.t * Math.PI : cs.toss ? Math.sin(cs.toss.t * Math.PI) * 0.6 : 0;
  const surf = st.liquid ? 0.1 + cs.liquid * 0.5 + (cs.contents.length ? 0.06 : 0) : floorY;
  cs.contents.forEach((q, i) => {
    let m = st.contents.get(q);
    if (!m) { m = ing3d(q.ing); m.rotation.y = q.rot; st.food.add(m); st.contents.set(q, m); }
    seen.add(q);
    const pie = q.pie >= 0 && st.pies ? st.pies[q.pie] : null;
    if (pie) {
      const folded = cs.pies[q.pie].fold;
      m.visible = folded < 0.6; m.position.set(pie.g.position.x + q.u * 0.12, 0.1 - q.y / vr, q.v * 0.12); m.scale.setScalar(0.55 * (1 - folded * 0.6));
    } else {
      const wob = st.liquid ? Math.sin(time * 2 + q.u * 5) * 0.015 : 0;
      m.position.set(q.u * 0.82, (st.liquid ? surf - 0.04 : floorY) - q.y / vr + lift * (0.6 + 0.4 * Math.sin(q.u * 4)) + wob, q.v * 0.7);
      m.rotation.x = flipA; m.rotation.y = q.rot;
      if (q.ing === 'butter') { const k = q.melt; m.scale.set(1 + k * 1.6, Math.max(0.12, 1 - k * 0.88), 1 + k * 1.6); }
    }
    tint(m, q.ing === 'butter' ? cs.brown * 0.7 : cs.brown, q.ing === 'pheasantBreast' ? cs.glaze : 0);
  });
  for (const [q, m] of st.contents) if (!seen.has(q)) { st.food.remove(m); st.contents.delete(q); }
  if (st.liquid) {
    const on = cs.liquid > 0 || cs.contents.length > 0; st.liquid.visible = on;
    if (on) { st.liquid.position.y = surf; const L = cs.liquid, b = cs.brown; st.liquid.material.color.set('#a8682e').lerp(new THREE.Color('#6a3010'), b).lerp(new THREE.Color('#2a1a12'), 1 - Math.min(1, L * 1.2)); st.liquid.rotation.y = time * 0.05; }
  }
  if (st.pies) st.pies.forEach((p, i) => {
    const f = cs.pies[i].fold; p.d.visible = f < 0.55; p.d.scale.set(1, 1, 1 - f * 0.5);
    p.hp.visible = f > 0.05; p.hp.scale.setScalar(Math.max(0.001, f) * 0.95); p.hp.position.set(0, -0.05, -0.08);
    tint(p.d, cs.brown * 0.7, 0); tint(p.hp, cs.brown, 0);
  });

  // tray, spoon, jug
  const step = cs.step, T2 = step && step.def.type;
  const tr = step && T2 === 'add' && !step.added ? step.tray : null;
  st.trayBowl.visible = st.trayGlow.visible = !!tr;
  if (tr) {
    const z = Math.max(hw * 0.25, Math.min(hw * 0.6, floorZ(st.cam, tr.y + tr.s * 0.5, cs.fy))), q = unproject(st.cam, tr.x, tr.y + tr.s * 0.4, z);
    st.trayBowl.position.copy(q.p); st.trayBowl.scale.setScalar(tr.s * 1.25 * q.s);
    st.trayGlow.position.copy(q.p); st.trayGlow.scale.setScalar(tr.s * 4.5 * q.s); st.trayGlow.material.opacity = 0.18 + 0.08 * Math.sin(time * 3);
    if (!st.trayIng || st.trayIng.userData.id !== step.def.ing) { if (st.trayIng) scene().remove(st.trayIng); st.trayIng = ing3d(step.def.ing); scene().add(st.trayIng); }
    const ip = tr.drag ? unproject(st.cam, tr.dx, tr.dy, 0) : { p: q.p.clone().add(new THREE.Vector3(0, tr.s * 0.15 * q.s + Math.sin(time * 2.5) * 3, 0)), s: q.s };
    st.trayIng.visible = true; st.trayIng.position.copy(ip.p); st.trayIng.scale.setScalar(tr.s * 2.1 * ip.s * (tr.drag ? 1.15 : 1)); st.trayIng.rotation.set(0.5, time * 0.6, 0);
  } else if (st.trayIng) st.trayIng.visible = false;
  const sp = cs.spoon && (T2 === 'stir' || T2 === 'simmer' || T2 === 'baste') ? cs.spoon : null;
  st.spoon.visible = !!sp;
  if (sp) { const q = unproject(st.cam, sp.x, sp.y, vr * 0.2); st.spoon.position.copy(q.p); st.spoon.scale.setScalar(vr * 0.9); st.spoon.rotation.set(0.25 + (sp.baste || 0) * 0.5, 0.3, -0.5 + (sp.baste || 0) * 0.4); }
  const pouring = T2 === 'pour' && step.pouring;
  st.jug.visible = st.stream.visible = pouring;
  if (pouring) {
    const jp = st.holder.position.clone().add(new THREE.Vector3(vr * 0.55, vr * 0.95, vr * 0.2));
    st.jug.position.copy(jp); st.jug.scale.setScalar(vr * 0.85); st.jug.rotation.set(0, 0, 1.05);
    const top = jp.clone().add(new THREE.Vector3(-vr * 0.62, vr * 0.15, 0)), bot = st.holder.position.clone().add(new THREE.Vector3(vr * 0.05, -vr * 0.2 + surf * vr, 0));
    st.stream.position.copy(top).add(bot).multiplyScalar(0.5); st.stream.scale.set(vr * 0.035, top.distanceTo(bot), vr * 0.035);
    st.stream.lookAt(bot); st.stream.rotateX(Math.PI / 2);
  }
}
const scene = () => S.scene;

function dispose() {}
function relayout() {
  const cs = S.cs; S = build(cs); Dish3D.custom({ scene: S.scene, camera: S.cam, tick, dispose });
}
window.Cook3D = {
  start(cs) {
    if (!Dish3D.ok) return false;
    try { S = build(cs); } catch (e) { console.warn('3D hearth unavailable', e); S = null; return false; }
    return Dish3D.custom({ scene: S.scene, camera: S.cam, tick, dispose });
  },
  stop() { if (S) Dish3D.stop(); S = null; },
};
