// Hearthwild · the prep board in 3D. Top-down camera: world (x, 0, y) is screen pixel (x, y),
// so the 2D task logic (and the painted ingredient being worked) stays perfectly aligned.
import { THREE, Dish3D, T, M, leaf, sprig, instanced, shadowed, canvasTex, rr, rnd, setSeed, fbm, speckle } from './dish3d.js';
import { roundedBox, ing3d, pastryDisc } from './cook3d.js';

const TAU = Math.PI * 2;
let S = null;

const counterTex = () => canvasTex('counter', 1024, 1024, (c, w, h) => {
  setSeed(21); const ph = h / 8;
  for (let p = 0; p < 8; p++) {
    c.fillStyle = ['#7a4e30', '#5f3a22', '#6e4529', '#83563a'][p % 4]; c.fillRect(0, p * ph, w, ph);
    for (let i = 0; i < 40; i++) { c.strokeStyle = `rgba(${rnd() < 0.5 ? '40,20,10' : '170,120,80'},${rr(0.06, 0.18)})`; c.lineWidth = rr(0.6, 2); const y = p * ph + rnd() * ph; c.beginPath(); c.moveTo(0, y); for (let x = 0; x <= w; x += 30) c.lineTo(x, y + Math.sin(x * 0.008 + i) * 3); c.stroke(); }
    c.fillStyle = 'rgba(20,10,4,.6)'; c.fillRect(0, p * ph, w, 3);
  }
}, { repeat: 1 });
const boardTex = () => canvasTex('board', 1024, 1024, (c, w, h) => {
  setSeed(22); const g = c.createLinearGradient(0, 0, w, h); g.addColorStop(0, '#e6bc84'); g.addColorStop(0.5, '#d4a066'); g.addColorStop(1, '#bc844c'); c.fillStyle = g; c.fillRect(0, 0, w, h);
  for (let i = 0; i < 120; i++) { c.strokeStyle = `rgba(${rnd() < 0.5 ? '130,76,34' : '255,232,195'},${rr(0.05, 0.16)})`; c.lineWidth = rr(0.6, 2.4); const y = rnd() * h; c.beginPath(); c.moveTo(0, y); for (let x = 0; x <= w; x += 20) c.lineTo(x, y + Math.sin(x * 0.01 + i) * 5); c.stroke(); }
  for (let i = 0; i < 70; i++) { c.strokeStyle = `rgba(100,56,22,${rr(0.06, 0.14)})`; c.lineWidth = 1; const x = rnd() * w, y = rnd() * h; c.beginPath(); c.moveTo(x, y); c.lineTo(x + rr(-8, 8), y + rr(14, 34)); c.stroke(); }
  // juice groove
  c.strokeStyle = 'rgba(110,60,25,.45)'; c.lineWidth = 7; c.beginPath(); c.roundRect(28, 28, w - 56, h - 56, 34); c.stroke();
  c.strokeStyle = 'rgba(255,235,200,.3)'; c.lineWidth = 2; c.beginPath(); c.roundRect(33, 33, w - 66, h - 66, 30); c.stroke();
});
function bowl() {
  const prof = [[0, 0.04], [0.5, 0.04], [0.55, 0], [0.7, 0.02], [0.95, 0.3], [1.0, 0.44], [0.95, 0.44], [0.88, 0.3], [0.6, 0.1], [0, 0.08]].map(([x, y]) => new THREE.Vector2(x, y));
  const m = new THREE.Mesh(new THREE.LatheGeometry(prof, 48), M.phys({ color: '#f0e6d6', roughness: 0.35, clearcoat: 0.7, side: THREE.DoubleSide }));
  const glaze = new THREE.Mesh(new THREE.CircleGeometry(0.8, 40), M.phys({ color: '#4e6270', roughness: 0.2, clearcoat: 1 })); glaze.rotation.x = -Math.PI / 2; glaze.position.y = 0.1;
  return shadowed(new THREE.Group().add(m, glaze));
}
function mortar() {
  const prof = [[0, 0], [0.85, 0], [1.0, 0.1], [1.1, 0.5], [1.1, 0.62], [1.02, 0.66], [0.86, 0.62], [0.82, 0.4], [0.6, 0.2], [0, 0.16]].map(([x, y]) => new THREE.Vector2(x, y));
  return shadowed(new THREE.Mesh(new THREE.LatheGeometry(prof, 64), M.phys({ map: T.stone(), color: '#d6d0c4', roughness: 0.75, side: THREE.DoubleSide })));
}
function pestle() {
  const prof = [[0, 0], [0.18, 0.02], [0.24, 0.12], [0.2, 0.3], [0.13, 0.6], [0.15, 0.95], [0.12, 1.02], [0, 1.03]].map(([x, y]) => new THREE.Vector2(x, y));
  return shadowed(new THREE.Mesh(new THREE.LatheGeometry(prof, 32), M.phys({ map: T.stone(), color: '#efe9dd', roughness: 0.6 })));
}
function rollingPin() {
  const g = new THREE.Group(), wood = M.phys({ color: '#d4a466', roughness: 0.5, clearcoat: 0.3 });
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 1.4, 28), wood); body.rotation.z = Math.PI / 2; g.add(body);
  for (const s of [-1, 1]) { const h = new THREE.Mesh(new THREE.CapsuleGeometry(0.045, 0.32, 4, 12), M.phys({ color: '#9a6a3a', roughness: 0.5 })); h.rotation.z = Math.PI / 2; h.position.x = s * 0.92; g.add(h); }
  return shadowed(g);
}

function build(ps) {
  const W = innerWidth, H = innerHeight, { bx, by, bw, bh, s } = ps, P = (window.SKY && SKY[ps.r.time]) || {};
  const scene = new THREE.Scene(); scene.background = new THREE.Color('#2a1a10');
  const fov = 30, D0 = H / (2 * Math.tan((fov * Math.PI) / 360));
  const cam = new THREE.PerspectiveCamera(fov, W / H, 2, D0 * 3); cam.position.set(W / 2, D0, H / 2); cam.up.set(0, 0, -1); cam.lookAt(W / 2, 0, H / 2);
  const st = { scene, cam, ps, key: W + 'x' + H, bowls: [], ready: [] };
  // light: low window sun with muntin shadows, warm fill
  scene.add(new THREE.HemisphereLight('#fff0dc', '#3a2010', 0.55));
  const sun = new THREE.DirectionalLight(P.light || '#ffe0b8', 2.2); sun.position.set(W * 0.1 - W * 0.9, D0 * 0.9, H * 0.05 - H * 0.6); sun.target.position.set(W / 2, 0, H / 2);
  sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); const sc = sun.shadow.camera; sc.left = -W; sc.right = W; sc.top = H; sc.bottom = -H; sc.near = 10; sc.far = D0 * 4; sun.shadow.bias = -0.0005; sun.shadow.normalBias = 1.2;
  scene.add(sun, sun.target);
  // invisible window frame high up, so the sun throws window-pane shadows across the counter
  const ghost = new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false });
  const fp = new THREE.Vector3().lerpVectors(sun.target.position, sun.position, 0.45);
  const frame = new THREE.Group(); frame.position.copy(fp); frame.lookAt(sun.position);
  for (const [w, h, x, y] of [[W * 0.06, H * 3, 0, 0], [W * 3, H * 0.05, 0, H * 0.25], [W * 3, H * 0.05, 0, -H * 0.55], [W * 0.06, H * 3, W * 0.7, 0]]) { const b = new THREE.Mesh(new THREE.PlaneGeometry(w, h), ghost); b.position.set(x, y, 0); b.castShadow = true; frame.add(b); }
  scene.add(frame);
  // counter and board
  const ct = counterTex().clone(); ct.needsUpdate = true; ct.repeat.set(W / 720, H / 720);
  const counter = new THREE.Mesh(new THREE.PlaneGeometry(W * 3, H * 3), M.phys({ map: ct, roughness: 0.55, clearcoat: 0.25 }));
  counter.rotation.x = -Math.PI / 2; counter.position.set(W / 2, -32, H / 2); counter.receiveShadow = true; scene.add(counter);
  const board = new THREE.Mesh(roundedBox(bw, 30, bh, Math.min(24, bh * 0.08), 4), M.phys({ map: boardTex(), roughness: 0.62, clearcoat: 0.15 }));
  // roundedBox UVs come from the box faces, which suits the top face
  board.position.set(bx, -15, by); board.castShadow = board.receiveShadow = true; scene.add(board);
  // flour dust on the board
  setSeed(5);
  scene.add(instanced(new THREE.CircleGeometry(1, 6).rotateX(-Math.PI / 2), new THREE.MeshStandardMaterial({ color: '#fffaf0', transparent: true, opacity: 0.35, roughness: 1 }), 140, (o) => { o.position.set(bx + bw * 0.3 + rr(-0.25, 0.2) * bw, 0.5, by + rr(-0.45, 0.45) * bh); o.scale.setScalar(rr(0.6, 2.4)); }));
  // props on the counter: herbs, a salt cellar, a linen cloth
  const prop = (o, x, z, r, sc2) => { o.position.set(x, 0, z); o.rotation.y = r; o.scale.setScalar(sc2); scene.add(shadowed(o)); };
  prop(sprig(1, 0.08, '#3f5a3a', true), W - 30, 30, 2.2, 170);
  prop(sprig(1, 0.07, '#6a8a48'), 40, H - 30, -0.6, 150);
  const cellar = new THREE.Mesh(new THREE.CylinderGeometry(1, 0.85, 0.9, 32, 1, true), M.phys({ color: '#efe6d6', roughness: 0.3, clearcoat: 0.8, side: THREE.DoubleSide })); const salt = new THREE.Mesh(new THREE.CircleGeometry(0.95, 24), M.std({ color: '#ffffff', roughness: 0.9 })); salt.rotation.x = -Math.PI / 2; salt.position.y = 0.3;
  const cel = new THREE.Group().add(cellar, salt); cellar.position.y = 0.45; prop(cel, W < H ? W - 48 : bx + bw / 2 + 70, W < H ? H - 60 : by - bh / 2 + 40, 0, 30);
  const cloth = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 20, 20), M.phys({ map: T.linen(), color: '#e8dcc8', roughness: 0.95, sheen: 1, sheenColor: new THREE.Color('#ffffff'), side: THREE.DoubleSide }));
  { const pp = cloth.geometry.attributes.position; for (let i = 0; i < pp.count; i++) pp.setZ(i, (fbm(pp.getX(i) * 4 + 1, pp.getY(i) * 4) - 0.5) * 0.06); cloth.geometry.computeVertexNormals(); }
  cloth.rotation.x = -Math.PI / 2; cloth.rotation.z = 0.3; prop(cloth, W < H ? 60 : bx - bw / 2 - 90, W < H ? 70 : by + bh * 0.3, 0.3, 200); cloth.position.y = -30;
  // bowls of finished prep along the board's lower edge (same layout as the 2D version)
  const n = ps.r.prep.length, gap = Math.min(86, bw / n), y = Math.min(H - 70, by + bh / 2 + 52);
  for (let i = 0; i < n; i++) {
    const x = bx + (i - (n - 1) / 2) * gap, r = Math.min(30, gap * 0.38);
    const b = bowl(); b.position.set(x, y > by + bh / 2 ? -30 : 0, y); b.scale.setScalar(r); scene.add(b);
    st.bowls.push({ b, x, y, r, item: null });
  }
  // task props
  st.mortar = mortar(); st.mortar.visible = false; scene.add(st.mortar);
  st.pestle = pestle(); st.pestle.visible = false; scene.add(st.pestle);
  st.berries = instanced(new THREE.SphereGeometry(1, 12, 10), M.phys({ color: '#3e4f82', roughness: 0.55, sheen: 1, sheenColor: new THREE.Color('#9ab0d8') }), 16, () => {}); st.berries.visible = false; scene.add(st.berries);
  st.powder = new THREE.Mesh(new THREE.CircleGeometry(1, 32), M.std({ color: '#46507a', roughness: 1 })); st.powder.rotation.x = -Math.PI / 2; st.powder.visible = false; scene.add(st.powder);
  st.pin = rollingPin(); st.pin.visible = false; scene.add(st.pin);
  st.pastry = pastryDisc(); st.pastry.visible = false; scene.add(st.pastry);
  st.flour = new THREE.Mesh(new THREE.CircleGeometry(1, 40), M.std({ color: '#fffaf0', transparent: true, opacity: 0.5, roughness: 1 })); st.flour.rotation.x = -Math.PI / 2; st.flour.visible = false; scene.add(st.flour);
  scene.traverse((m) => { if (m.material) [].concat(m.material).forEach((mt) => { if (mt.envMapIntensity !== undefined) mt.envMapIntensity = 0.35; }); });
  return st;
}

function tick(dt, time) {
  const st = S, ps = st.ps;
  if (!G.scene || G.scene !== ps) return;
  if (innerWidth + 'x' + innerHeight !== st.key) { relayout(); return; }
  const { bx, by, s } = ps;
  // bowls fill as tasks finish
  st.bowls.forEach((B, i) => {
    const b = ps.bowls[i];
    if (b && !B.item) { B.item = ing3d(b.ing); st.scene.add(B.item); }
    if (B.item) { const k = b ? b.t : 1; B.item.visible = !!b && !st.readyOn; B.item.position.set(B.x, B.b.position.y + B.r * 0.12 + (1 - k) * 40, B.y); B.item.scale.setScalar(B.r * 2.2 * Math.max(0.01, k)); }
  });
  // ready: everything gathered on the board, slowly turning
  const ready = !ps.task && ps.bowls.length;
  if (ready && !st.readyOn) { st.readyOn = true; st.ready = ps.bowls.map((b) => { const o = ing3d(b.ing); st.scene.add(o); return o; }); }
  if (st.readyOn) st.ready.forEach((o, i) => { const a = (i / st.ready.length) * TAU + time * 0.2; o.position.set(bx + Math.cos(a) * s * 1.1, 4, by + Math.sin(a) * s * 0.6); o.scale.setScalar(s * 0.9); o.rotation.y = time * 0.3 + i; });
  // grind
  const task = ps.task, k = task ? task.intro : 0;
  const grind = task && task.def.type === 'grind', roll = task && task.def.type === 'roll';
  st.mortar.visible = st.pestle.visible = st.berries.visible = st.powder.visible = !!grind;
  if (grind) {
    const R = task.R * (0.85 + 0.15 * k);
    st.mortar.position.set(bx, 0, by); st.mortar.scale.set(R, R * 0.6, R);
    const p = task.p, o = new THREE.Object3D();
    task.berries.forEach(([x, y, a], i) => { const kk = 1 - Math.min(1, Math.max(0, p * 1.3 - i * 0.02)); o.position.set(bx + x * R * 0.9 + Math.cos(time * 0.5 + a) * 2, R * 0.12 + R * 0.06, by + y * R * 0.9); o.scale.setScalar(Math.max(0.001, R * 0.1 * kk)); o.updateMatrix(); st.berries.setMatrixAt(i, o.matrix); });
    st.berries.instanceMatrix.needsUpdate = true;
    st.powder.position.set(bx, R * 0.1 + 2, by + R * 0.05); st.powder.scale.setScalar(Math.max(0.01, R * 0.62 * p));
    const down = G.pointer.down, px = down ? G.pointer.x : bx + R * 0.4, py = down ? G.pointer.y : by - R * 0.2;
    st.pestle.position.set(px, R * (down ? 0.12 : 0.3), py); st.pestle.scale.setScalar(R * 1.05); st.pestle.rotation.set(-0.5, 0, 0.35);
  }
  st.pin.visible = st.pastry.visible = st.flour.visible = !!roll;
  if (roll) {
    const p = task.p, sc = 0.85 + 0.15 * k;
    st.flour.position.set(bx, 0.6, by); st.flour.scale.set(s * 1.3, s * 1.0, 1);
    st.pastry.position.set(bx, 2, by); const rp = s * (0.55 + p * 0.65) * sc, th = s * 0.09 * (1 - p * 0.65); st.pastry.scale.set(rp / 0.28, th / 0.025, rp / 0.28 * 0.92);
    const yy = G.pointer.down ? task.py : by + Math.sin(time * 2) * 8 - s * 0.6;
    st.pin.position.set(bx, s * 0.1 + 6, yy); st.pin.scale.setScalar(s * 1.25);
  }
}
function dispose() {}
function relayout() { const ps = S.ps; S = build(ps); Dish3D.custom({ scene: S.scene, camera: S.cam, tick, dispose }); }
window.Prep3D = {
  start(ps) {
    if (!Dish3D.ok) return false;
    try { S = build(ps); } catch (e) { console.warn('3D board unavailable', e); S = null; return false; }
    return Dish3D.custom({ scene: S.scene, camera: S.cam, tick, dispose });
  },
  stop() { if (S) Dish3D.stop(); S = null; },
};
