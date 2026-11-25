// Hearthwild · the forest in 3D. Mirrors ForageScene every frame: the game logic and input stay in
// forage.js, this module renders the woods and writes each item's on-screen position back, so taps,
// halos, the stalk zoom and the fishing line all line up with the 3D world.
import { roundedBox } from './cook3d.js';
import { THREE, Dish3D, M, blob, leaf, instanced, sprig, berryCluster, chanterelle, elderflower, hazelnut, shadowed, canvasTex, rr, rnd, setSeed, fbm, screenCam } from './dish3d.js';

const TAU = Math.PI * 2;
let S = null;
const C = (c) => new THREE.Color(c);
const mixC = (a, b, k) => C(a).lerp(C(b), k);
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, k) => a + (b - a) * k;

// ── small geometry tools ────────────────────────────────────────────────────
function merge(list) {
  const parts = list.map((g) => (g.index ? g.toNonIndexed() : g));
  let n = 0; parts.forEach((g) => (n += g.attributes.position.count));
  const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3); let o = 0;
  for (const g of parts) { pos.set(g.attributes.position.array, o * 3); if (g.attributes.normal) nor.set(g.attributes.normal.array, o * 3); o += g.attributes.position.count; }
  const out = new THREE.BufferGeometry(); out.setAttribute('position', new THREE.BufferAttribute(pos, 3)); out.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  return out;
}
function lumpy(g, amp, f, s) {
  const p = g.attributes.position, v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); const n = 1 + (fbm(v.x * f + s, v.y * f + v.z * f * 0.7 + s * 2) - 0.5) * amp * 2; p.setXYZ(i, v.x * n, v.y * n, v.z * n); }
  return g;
}
const mat = (color, o = {}) => M.std(Object.assign({ color, roughness: 0.85 }, o));
const glowTex = () => canvasTex('glow', 128, 128, (c, w) => { const g = c.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.35, 'rgba(255,255,255,.35)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.fillRect(0, 0, w, w); });

// ── trees (unit height, base at y = 0) ──────────────────────────────────────
function canopyGeo(type) {
  setSeed(type.length * 13 + 5);
  if (type === 'pine') {
    const tiers = []; for (let i = 0; i < 5; i++) { const r = 0.3 * (1 - i * 0.17), g = new THREE.ConeGeometry(r, 0.34, 9, 2, true); g.translate(0, 0.28 + i * 0.15, 0); g.rotateY(i * 0.7); lumpy(g, 0.12, 6, i * 3); tiers.push(g); }
    return merge(tiers);
  }
  const blobs = [], n = type === 'birch' ? 9 : 7;
  for (let i = 0; i < n; i++) {
    const r = type === 'birch' ? rr(0.07, 0.12) : rr(0.13, 0.2), g = new THREE.IcosahedronGeometry(r, 3);
    lumpy(g, 0.3, 7, i * 7 + 1);
    const a = (i / n) * TAU * 2.3, d = i === 0 ? 0 : rr(0.07, type === 'birch' ? 0.15 : 0.19);
    g.translate(Math.cos(a) * d, (type === 'birch' ? 0.66 : 0.62) + rr(-0.08, 0.2) + (i === 0 ? 0.1 : 0), Math.sin(a) * d * 0.8);
    blobs.push(g);
  }
  return merge(blobs);
}
const barkTex = (birch) => canvasTex(birch ? 'birchbark' : 'treebark', 64, 256, (c, w, h) => {
  setSeed(birch ? 41 : 42);
  c.fillStyle = birch ? '#e8e2d6' : '#4a3424'; c.fillRect(0, 0, w, h);
  if (birch) for (let i = 0; i < 40; i++) { c.fillStyle = `rgba(30,24,20,${rr(0.5, 0.9)})`; c.fillRect(rr(-10, w), rr(0, h), rr(8, 30), rr(1.5, 4)); }
  else for (let i = 0; i < 30; i++) { c.fillStyle = `rgba(${rnd() < 0.5 ? '20,10,4' : '120,90,60'},.4)`; c.fillRect(rr(0, w), 0, rr(1, 4), h); }
});
function forest(st, type, list, color) {
  const canopy = canopyGeo(type), trunkG = new THREE.CylinderGeometry(type === 'birch' ? 0.016 : 0.028, type === 'birch' ? 0.022 : 0.04, 1, 7); trunkG.translate(0, 0.5, 0);
  const cm = mat('#ffffff', { flatShading: type === 'pine', roughness: 0.9 }), tm = mat('#ffffff', { map: barkTex(type === 'birch'), roughness: 0.95 });
  const ci = new THREE.InstancedMesh(canopy, cm, list.length), ti = new THREE.InstancedMesh(trunkG, tm, list.length), o = new THREE.Object3D();
  list.forEach((t, i) => {
    o.position.set(t.x, t.y, t.z); o.rotation.set(0, t.r, rr(-0.03, 0.03)); o.scale.set(t.h * t.w, t.h, t.h * t.w); o.updateMatrix(); ci.setMatrixAt(i, o.matrix);
    o.scale.set(t.h, t.h * (type === 'pine' ? 0.4 : 0.72), t.h); o.updateMatrix(); ti.setMatrixAt(i, o.matrix);
    ci.setColorAt(i, mixC(color, i % 3 ? '#000000' : '#fff6d0', rr(0.0, 0.18)).offsetHSL(rr(-0.02, 0.02), rr(-0.05, 0.05), 0));
    ti.setColorAt(i, C(type === 'birch' ? '#ffffff' : '#bfa890'));
  });
  ci.castShadow = ti.castShadow = true; ci.receiveShadow = true;
  st.scene.add(ci, ti);
}

// ── plants (unit height ≈ 1, base at y = 0) ─────────────────────────────────
function upLeaf(len, wid, color, tilt, yaw, arrow) { const l = leaf(len, wid, color, arrow); l.rotation.x = tilt; const g = new THREE.Group(); g.add(l); g.rotation.y = yaw; return g; }
function upSprig(len, ll, color, needles, tilt, yaw) { const s = sprig(len, ll, color, needles); s.rotation.x = tilt; const g = new THREE.Group(); g.add(s); g.rotation.y = yaw; return g; }
function shrub(r, color) { const m = new THREE.Mesh(lumpy(new THREE.IcosahedronGeometry(1, 2), 0.22, 3, r * 9).scale(r, r * 0.78, r * 0.8), mat(color, { flatShading: true })); m.position.y = r * 0.62; return m; }
function plant3d(id) {
  setSeed(id.length * 17 + 3);
  const g = new THREE.Group();
  const litter = () => { for (let i = 0; i < 5; i++) { const l = leaf(0.16, 0.07, ['#8a5a2a', '#a8743a', '#6a4a2a'][i % 3]); l.position.set(rr(-0.35, 0.35), 0.01, rr(-0.25, 0.25)); l.rotation.y = rnd() * TAU; g.add(l); } };
  switch (id) {
    case 'chanterelle': {
      litter();
      [[0, 0, 0.62], [0.2, 0.08, 0.46], [-0.18, 0.1, 0.4], [0.05, -0.16, 0.34]].forEach(([x, z, s]) => { const m = chanterelle(s); m.rotation.set(rr(-0.15, 0.15), rnd() * TAU, rr(-0.18, 0.18)); m.position.set(x, 0, z); g.add(m); });
      break;
    }
    case 'porcini': {
      litter();
      [[0, 0, 1], [0.24, 0.1, 0.66]].forEach(([x, z, s]) => {
        const p = new THREE.Group();
        const stem = new THREE.Mesh(blob(0.13, 0.24, 0.13, 0.06, 3, 2), M.phys({ color: '#efe2c4', roughness: 0.6 })); stem.position.y = 0.2;
        const cap = new THREE.Mesh(new THREE.SphereGeometry(0.27, 28, 14, 0, TAU, 0, Math.PI / 2), M.phys({ color: '#8a4e22', roughness: 0.35, clearcoat: 0.7 })); cap.scale.y = 0.62; cap.position.y = 0.38;
        const under = new THREE.Mesh(new THREE.CircleGeometry(0.265, 28), mat('#d8c690')); under.rotation.x = Math.PI / 2; under.position.y = 0.381;
        p.add(stem, cap, under); p.scale.setScalar(s); p.position.set(x, 0, z); p.rotation.z = rr(-0.1, 0.1); g.add(p);
      });
      break;
    }
    case 'garlic': {
      for (let i = 0; i < 7; i++) g.add(upLeaf(rr(0.6, 0.8), 0.13, '#3f8a30', rr(0.9, 1.25), (i / 7) * TAU + rr(-0.2, 0.2)));
      for (let i = 0; i < 2; i++) { const st = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.01, 0.85, 5), mat('#5a8a3a')); st.position.set(i ? 0.06 : -0.05, 0.42, i ? -0.04 : 0.03); g.add(st); const f = elderflower(); f.scale.setScalar(1.9); f.position.set(st.position.x, 0.84, st.position.z); g.add(f); }
      break;
    }
    case 'sorrel': {
      for (let i = 0; i < 9; i++) g.add(upLeaf(rr(0.42, 0.6), 0.13, i % 2 ? '#4a9a34' : '#3e8a2c', rr(0.7, 1.15), (i / 9) * TAU, true));
      const st = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.01, 0.9, 5), mat('#8a3a2a')); st.position.y = 0.45; g.add(st);
      g.add(instanced(new THREE.SphereGeometry(0.018, 6, 4), mat('#a83a2a'), 22, (o, i) => o.position.set(rr(-0.03, 0.03), 0.6 + i * 0.016, rr(-0.03, 0.03))));
      break;
    }
    case 'carrot': {
      for (let i = 0; i < 9; i++) g.add(upSprig(rr(0.55, 0.85), 0.11, i % 2 ? '#6aaa4a' : '#5a9a3a', false, rr(0.8, 1.35), (i / 9) * TAU + rr(-0.2, 0.2)));
      const root = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.4, 18), M.phys({ color: '#ec7a22', roughness: 0.4, clearcoat: 0.4 })); root.rotation.set(Math.PI, 0, 0.5); root.position.set(0.04, -0.16, 0.02); g.add(root);
      break;
    }
    case 'thyme': case 'rosemary': {
      const ros = id === 'rosemary';
      for (let i = 0; i < (ros ? 7 : 9); i++) g.add(upSprig(ros ? rr(0.75, 0.95) : rr(0.4, 0.55), ros ? 0.09 : 0.05, ros ? '#3f5a3a' : '#6a8a48', ros, ros ? rr(1.25, 1.45) : rr(0.6, 1.1), (i / 9) * TAU + rr(-0.3, 0.3)));
      g.add(instanced(new THREE.SphereGeometry(ros ? 0.016 : 0.013, 6, 4), mat(ros ? '#a8b8f0' : '#c890d8'), 26, (o) => { const a = rnd() * TAU, d = rr(0.05, ros ? 0.18 : 0.3); o.position.set(Math.cos(a) * d, ros ? rr(0.5, 0.9) : rr(0.18, 0.42), Math.sin(a) * d); }));
      break;
    }
    case 'blackberry': {
      g.add(shrub(0.5, '#2f5a2c'));
      for (let i = 0; i < 7; i++) { const a = rnd() * TAU, b = berryCluster(0.05, 0.022, i % 4 ? '#1e0a22' : '#a02a2a'); b.scale.setScalar(1.7); b.position.set(Math.cos(a) * 0.42, rr(0.25, 0.6), Math.abs(Math.sin(a)) * 0.34 + 0.06); g.add(b); }
      for (let i = 0; i < 6; i++) g.add(upLeaf(0.24, 0.11, '#3a6a30', rr(0.2, 0.6), rnd() * TAU));
      break;
    }
    case 'juniper': {
      const cone = new THREE.Mesh(lumpy(new THREE.ConeGeometry(0.34, 0.95, 10, 4), 0.14, 5, 3), mat('#3e5a48', { flatShading: true })); cone.position.y = 0.47; g.add(cone);
      g.add(instanced(new THREE.SphereGeometry(0.03, 10, 8), M.phys({ color: '#33405e', roughness: 0.55, sheen: 1, sheenColor: C('#9ab0d8') }), 30, (o) => { const t = rr(0.1, 0.85), a = rnd() * TAU, r = 0.34 * (1 - t) + 0.02; o.position.set(Math.cos(a) * r, t * 0.95, Math.sin(a) * r); }));
      break;
    }
    case 'strawberry': {
      for (let i = 0; i < 6; i++) g.add(upLeaf(0.3, 0.13, '#3f7a34', rr(0.25, 0.6), (i / 6) * TAU));
      for (let i = 0; i < 4; i++) { const b = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.11, 14), M.phys({ color: '#d8202a', roughness: 0.25, clearcoat: 1 })); b.rotation.x = Math.PI; const a = (i / 4) * TAU + 0.4; b.position.set(Math.cos(a) * 0.22, 0.08, Math.sin(a) * 0.2); g.add(b); }
      const f = elderflower(); f.scale.setScalar(1.2); f.position.set(0, 0.22, 0); g.add(f);
      break;
    }
    case 'elderflower': {
      g.add(shrub(0.42, '#3e6a34'));
      for (let i = 0; i < 4; i++) { const f = elderflower(); f.scale.setScalar(2.4); const a = (i / 4) * TAU; f.position.set(Math.cos(a) * 0.24, 0.62 + rr(0, 0.12), Math.sin(a) * 0.2 + 0.1); g.add(f); }
      break;
    }
    case 'hazelnut': {
      g.add(shrub(0.45, '#4a6a30'));
      for (let i = 0; i < 4; i++) { const h = hazelnut(0.06); const a = (i / 4) * TAU + 0.3; h.position.set(Math.cos(a) * 0.38, rr(0.3, 0.55), Math.abs(Math.sin(a)) * 0.3 + 0.08); g.add(h); }
      break;
    }
    default: g.add(shrub(0.4, '#4a7a3a'));
  }
  return shadowed(g);
}

// ── animals (facing +x, base at y = 0) ──────────────────────────────────────
function fur(color) { return M.phys({ color, roughness: 0.85, sheen: 1, sheenColor: C('#fff0dc'), sheenRoughness: 0.6 }); }
function eye(r) { return new THREE.Mesh(new THREE.SphereGeometry(r, 10, 8), M.phys({ color: '#0a0806', roughness: 0.05, clearcoat: 1 })); }
function rabbit() {
  const g = new THREE.Group(), body = new THREE.Group(); g.add(body);
  const f = fur('#a88466'), lt = fur('#e6d2bb');
  const b = new THREE.Mesh(blob(0.34, 0.25, 0.22, 0.05, 2, 1), f); b.position.set(-0.05, 0.26, 0); b.rotation.z = -0.15;
  const hn = new THREE.Mesh(new THREE.SphereGeometry(0.2, 18, 14), f); hn.position.set(-0.2, 0.2, 0);
  const belly = new THREE.Mesh(new THREE.SphereGeometry(0.16, 14, 10), lt); belly.position.set(0.06, 0.18, 0); belly.scale.set(1.2, 0.8, 1.1);
  const tail = new THREE.Mesh(new THREE.SphereGeometry(0.075, 12, 10), fur('#ffffff')); tail.position.set(-0.4, 0.3, 0);
  for (const s of [-1, 1]) { const ft = new THREE.Mesh(new THREE.CapsuleGeometry(0.04, 0.16, 3, 8), f); ft.rotation.z = Math.PI / 2; ft.position.set(-0.12, 0.04, s * 0.1); body.add(ft); }
  const head = new THREE.Group(); head.position.set(0.24, 0.36, 0);
  const hd = new THREE.Mesh(blob(0.16, 0.13, 0.12, 0.04, 2, 3), f); hd.position.set(0.08, 0, 0);
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.022, 8, 6), M.phys({ color: '#d89a9a' })); nose.position.set(0.23, -0.01, 0);
  const ears = new THREE.Group(); ears.position.set(0.02, 0.08, 0);
  for (const s of [-1, 1]) { const e = new THREE.Mesh(new THREE.CapsuleGeometry(0.04, 0.26, 4, 10), f); e.scale.z = 0.5; e.position.set(0, 0.15, s * 0.05); e.rotation.x = s * -0.15; ears.add(e); const e2 = new THREE.Mesh(new THREE.CapsuleGeometry(0.022, 0.2, 3, 8), M.phys({ color: '#e8b0a8', roughness: 0.6 })); e2.position.set(0.02, 0.15, s * 0.05); e2.rotation.x = s * -0.15; ears.add(e2); }
  for (const s of [-1, 1]) { const ey = eye(0.026); ey.position.set(0.15, 0.03, s * 0.085); head.add(ey); }
  head.add(hd, nose, ears); body.add(b, hn, belly, tail, head);
  g.userData = { body, head, ears, kind: 'rabbit', h: 0.62 };
  return shadowed(g);
}
function pheasant() {
  const g = new THREE.Group(), body = new THREE.Group(); g.add(body);
  const cop = M.phys({ color: '#b0582a', roughness: 0.4, clearcoat: 0.6, sheen: 0.6, sheenColor: C('#ffb060') });
  const b = new THREE.Mesh(blob(0.26, 0.2, 0.17, 0.04, 3, 4), cop); b.position.set(0, 0.34, 0); b.rotation.z = 0.25;
  const wing = new THREE.Mesh(blob(0.2, 0.11, 0.18, 0.05, 4, 8), M.phys({ color: '#7a4a24', roughness: 0.5, clearcoat: 0.3 })); wing.position.set(-0.06, 0.38, 0); wing.rotation.z = 0.2;
  const tm = M.phys({ color: '#9a6a34', roughness: 0.5, clearcoat: 0.4 });
  for (const [l, a, z] of [[0.8, 0.42, 0], [0.6, 0.55, 0.03], [0.6, 0.3, -0.03]]) { const tail = new THREE.Mesh(new THREE.ConeGeometry(0.035, l, 6), tm); tail.scale.z = 0.35; tail.geometry.translate(0, l / 2, 0); tail.rotation.z = Math.PI / 2 - a; tail.position.set(-0.2, 0.4, z); body.add(tail); }
  for (const s of [-1, 1]) { const l = new THREE.Mesh(new THREE.CylinderGeometry(0.013, 0.011, 0.2, 5), mat('#8a7a6a')); l.position.set(0.03, 0.1, s * 0.06); body.add(l); }
  const head = new THREE.Group(); head.position.set(0.2, 0.42, 0);
  const iri = M.phys({ color: '#1f4a3a', roughness: 0.2, metalness: 0.5, clearcoat: 1, iridescence: 1, iridescenceIOR: 1.5 });
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 0.24, 10), iri); neck.position.set(0.04, 0.1, 0); neck.rotation.z = -0.4;
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.066, 0.016, 6, 14), mat('#f4f0e6')); ring.rotation.set(Math.PI / 2, 0.4, 0); ring.position.set(0.0, 0.01, 0);
  const hd = new THREE.Mesh(new THREE.SphereGeometry(0.07, 14, 10), iri); hd.position.set(0.1, 0.23, 0);
  const wat = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 8), M.phys({ color: '#c8202a', roughness: 0.5 })); wat.scale.set(1, 1.3, 1.4); wat.position.set(0.12, 0.22, 0);
  const beak = new THREE.Mesh(new THREE.ConeGeometry(0.02, 0.07, 6), mat('#e0d0a0')); beak.rotation.z = -Math.PI / 2; beak.position.set(0.19, 0.22, 0);
  for (const s of [-1, 1]) { const e = eye(0.012); e.position.set(0.14, 0.25, s * 0.05); head.add(e); }
  head.add(neck, ring, hd, wat, beak); body.add(b, wing, head);
  g.userData = { body, head, kind: 'pheasant', h: 0.6 };
  return shadowed(g);
}
function deer() {
  const g = new THREE.Group(), body = new THREE.Group(); g.add(body);
  const f = fur('#a8743e'), lt = fur('#e8d4b4'), dk = mat('#2a1a10');
  const b = new THREE.Mesh(blob(0.42, 0.24, 0.19, 0.04, 2, 5), f); b.position.set(0, 0.7, 0);
  const chest = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 12), f); chest.position.set(0.26, 0.72, 0); chest.scale.set(1, 1.15, 0.95);
  const rump = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 12), f); rump.position.set(-0.28, 0.74, 0); rump.scale.set(1, 1.1, 0.95);
  const belly = new THREE.Mesh(blob(0.26, 0.08, 0.12, 0.03, 2, 6), fur('#c89a6a')); belly.position.set(0, 0.56, 0);
  const tail = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 8), fur('#ffffff')); tail.position.set(-0.43, 0.8, 0);
  const legs = [];
  for (const [x, z] of [[0.28, 0.08], [0.28, -0.08], [-0.28, 0.08], [-0.28, -0.08]]) {
    const leg = new THREE.Group(); leg.position.set(x, 0.66, z);
    const th = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.035, 0.3, 8), f); th.position.y = -0.12;
    const up = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.022, 0.42, 7), f); up.position.y = -0.4;
    const hoof = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.028, 0.05, 7), dk); hoof.position.y = -0.63;
    leg.add(th, up, hoof); legs.push(leg); body.add(leg);
  }
  const head = new THREE.Group(); head.position.set(0.34, 0.82, 0);
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.12, 0.44, 10), f); neck.position.set(0.08, 0.17, 0); neck.rotation.z = -0.5;
  const hd = new THREE.Mesh(blob(0.15, 0.08, 0.075, 0.03, 2, 7), f); hd.position.set(0.24, 0.38, 0); hd.rotation.z = -0.35;
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 6), dk); nose.position.set(0.37, 0.33, 0);
  for (const s of [-1, 1]) {
    const e = eye(0.02); e.position.set(0.24, 0.42, s * 0.06); head.add(e);
    const ear = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 8), f); ear.scale.set(0.5, 1, 0.3); ear.position.set(0.14, 0.5, s * 0.07); ear.rotation.x = s * -0.5; head.add(ear);
    const ant = new THREE.Group(); ant.position.set(0.18, 0.46, s * 0.04);
    const am = mat('#d8c8a8');
    const a1 = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.013, 0.22, 5), am); a1.position.y = 0.1; a1.rotation.set(s * -0.3, 0, -0.3);
    const a2 = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.009, 0.1, 5), am); a2.position.set(0.05, 0.12, 0); a2.rotation.z = -1;
    ant.add(a1, a2); head.add(ant);
  }
  head.add(neck, hd, nose); body.add(b, chest, rump, belly, tail, head);
  g.userData = { body, head, legs, kind: 'deer', h: 1.1 };
  return shadowed(g);
}

// ── the cottage on the title screen (unit: walls 1.24 wide, ridge ≈ 1.05 high) ─
function cottage() {
  setSeed(77);
  const g = new THREE.Group();
  const stone = canvasTex('cottagestone', 256, 128, (c, w, h) => { c.fillStyle = '#e4d6be'; c.fillRect(0, 0, w, h); for (let i = 0; i < 90; i++) { c.fillStyle = `rgba(${rnd() < 0.5 ? '120,96,70' : '255,248,230'},${rr(0.12, 0.3)})`; c.beginPath(); c.ellipse(rnd() * w, rnd() * h, rr(6, 14), rr(3, 7), 0, 0, TAU); c.fill(); } });
  const walls = new THREE.Mesh(roundedBox(1.24, 0.52, 0.8, 0.04, 2), mat('#ffffff', { map: stone })); walls.position.y = 0.26; g.add(walls);
  const sh = new THREE.Shape(); sh.moveTo(-0.8, 0); sh.quadraticCurveTo(-0.42, 0.56, 0, 0.6); sh.quadraticCurveTo(0.42, 0.56, 0.8, 0); sh.quadraticCurveTo(0, 0.06, -0.8, 0);
  const thatch = canvasTex('thatch', 256, 256, (c, w, h) => { c.fillStyle = '#b08a4a'; c.fillRect(0, 0, w, h); for (let i = 0; i < 500; i++) { c.strokeStyle = `rgba(${rnd() < 0.5 ? '90,60,25' : '240,210,140'},${rr(0.15, 0.4)})`; c.lineWidth = rr(0.6, 1.6); const x = rnd() * w, y = rnd() * h; c.beginPath(); c.moveTo(x, y); c.lineTo(x + rr(-2, 2), y + rr(10, 26)); c.stroke(); } });
  const rg = new THREE.ExtrudeGeometry(sh, { depth: 0.92, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.05, bevelSegments: 4, curveSegments: 14 }); rg.translate(0, 0, -0.46);
  lumpy(rg, 0.02, 9, 4);
  const roof = new THREE.Mesh(rg, mat('#ffffff', { map: thatch, roughness: 1 })); roof.position.y = 0.48; g.add(roof);
  const chim = new THREE.Mesh(roundedBox(0.15, 0.56, 0.15, 0.02, 2), mat('#8a7c70', { map: stone })); chim.position.set(0.3, 0.98, -0.05); g.add(chim);
  const glass = new THREE.MeshStandardMaterial({ color: '#ffd090', emissive: C('#ff9a40'), emissiveIntensity: 3, roughness: 0.4 });
  for (const wx of [-0.38, 0.32]) {
    const w = new THREE.Mesh(new THREE.PlaneGeometry(0.17, 0.15), glass); w.position.set(wx, 0.3, 0.405); g.add(w);
    const fm = mat('#4a3020');
    const f1 = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.15, 0.01), fm); f1.position.set(wx, 0.3, 0.41); const f2 = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.012, 0.01), fm); f2.position.set(wx, 0.3, 0.41);
    const sill = new THREE.Mesh(new THREE.BoxGeometry(0.21, 0.02, 0.05), mat('#6a5040')); sill.position.set(wx, 0.215, 0.42); g.add(f1, f2, sill);
  }
  const door = new THREE.Mesh(roundedBox(0.16, 0.28, 0.03, 0.02, 2), mat('#5a3a22')); door.position.set(-0.04, 0.14, 0.405); g.add(door);
  for (let i = 0; i < 6; i++) { const b = shrub(rr(0.07, 0.11), i % 2 ? '#4a6a30' : '#5a7a34'); b.position.set(rr(-0.6, 0.6), b.position.y, rr(0.42, 0.55)); g.add(b); }
  return shadowed(g);
}

// ── sky, ground and water textures ──────────────────────────────────────────
function skyTex(P, key) {
  return canvasTex('sky' + key, 512, 512, (c, w, h) => {
    const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, P.top); g.addColorStop(0.62, P.mid); g.addColorStop(1, P.hor); c.fillStyle = g; c.fillRect(0, 0, w, h);
    setSeed(31);
    if (P.stars) for (let i = 0; i < 220; i++) { c.fillStyle = `rgba(255,250,230,${rr(0.3, 1) * P.stars})`; const s = rr(0.6, 1.8); c.fillRect(rnd() * w, rnd() * h * 0.7, s, s); }
    const sx = w * P.sunX, sy = h * Math.min(0.92, P.sunY);
    const sg = c.createRadialGradient(sx, sy, 0, sx, sy, w * 0.6); sg.addColorStop(0, P.sun); sg.addColorStop(0.08, P.sun + 'ee'); sg.addColorStop(0.3, P.sun + '44'); sg.addColorStop(1, P.sun + '00'); c.fillStyle = sg; c.fillRect(0, 0, w, h);
    c.fillStyle = P.sun; c.beginPath(); c.arc(sx, sy, w * 0.03, 0, TAU); c.fill();
    for (let i = 0; i < 9; i++) { const cx = rnd() * w, cy = rr(0.12, 0.6) * h, cw = rr(40, 120); for (let k = 0; k < 7; k++) { c.fillStyle = P.cloud + '30'; c.beginPath(); c.ellipse(cx + rr(-cw, cw) * 0.6, cy + rr(-6, 6), cw * rr(0.3, 0.6), cw * rr(0.08, 0.16), 0, 0, TAU); c.fill(); } }
  });
}
function groundTex(P, key) {
  const t = canvasTex('ground' + key, 512, 512, (c, w, h) => {
    setSeed(32); c.fillStyle = P.grass; c.fillRect(0, 0, w, h);
    for (let y = 0; y < h; y += 4) for (let x = 0; x < w; x += 4) { const n = fbm(x / 60, y / 60); c.fillStyle = n > 0.5 ? `rgba(255,250,210,${(n - 0.5) * 0.3})` : `rgba(10,30,10,${(0.5 - n) * 0.5})`; c.fillRect(x, y, 4, 4); }
    for (let i = 0; i < 1600; i++) { c.strokeStyle = `rgba(${rnd() < 0.5 ? '20,40,10' : '230,240,180'},${rr(0.08, 0.2)})`; c.lineWidth = 1; const x = rnd() * w, y = rnd() * h; c.beginPath(); c.moveTo(x, y); c.lineTo(x + rr(-2, 2), y - rr(3, 7)); c.stroke(); }
  });
  return t;
}
function waterTex(P, key) {
  const t = canvasTex('water' + key, 512, 128, (c, w, h) => {
    const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, mixC(P.top, P.hor, 0.7).getStyle()); g.addColorStop(0.5, mixC(P.top, P.hor, 0.45).getStyle()); g.addColorStop(1, mixC(P.top, P.grassDark, 0.45).getStyle()); c.fillStyle = g; c.fillRect(0, 0, w, h);
    setSeed(33); for (let i = 0; i < 160; i++) { c.strokeStyle = `rgba(255,255,255,${rr(0.08, 0.35)})`; c.lineWidth = rr(0.8, 2); const x = rnd() * w, y = rnd() * h, l = rr(10, 50); c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + l / 2, y + rr(-2, 2), x + l, y); c.stroke(); }
  });
  t.wrapS = THREE.RepeatWrapping; t.wrapT = THREE.ClampToEdgeWrapping;
  return t;
}

// ── scene ───────────────────────────────────────────────────────────────────
function build(fs) {
  const W = innerWidth, H = innerHeight, P = fs.P, r = fs.r, B = r.biome, gy = fs.gy, worldW = fs.worldW, kk = fs.k;
  const key = r.id + r.time;
  const scene = new THREE.Scene();
  const cam = screenCam(new THREE.PerspectiveCamera(), W, H, gy, 36);
  const D0 = cam.userData.D; cam.near = D0 * 0.04; cam.far = D0 * 30; cam.updateProjectionMatrix();
  const st = { scene, cam, fs, key: W + 'x' + H, D0, W, H, gy, items: [], anim: [] };
  const kOf = (z) => D0 / (D0 - z), zOf = (k) => D0 * (1 - 1 / k);
  const FY = H; // floor at world y = -H (the bottom of the screen at z = 0)
  // visible x-range at depth z across the whole pan
  const xr = (z, m = 1.1) => { const k = kOf(z); return [W / 2 - (W / 2) / k * m, worldW - W / 2 + (W / 2) / k * m]; };
  setSeed(B.seed);
  if (B.stream) st.streamZ0 = zOf(0.5);

  scene.background = skyTex(P, key);
  const night = r.time === 'dusk';
  scene.fog = new THREE.Fog(C(P.fog), D0 * 1.2, D0 * (night ? 9 : 11));

  // lights: low sun in the sky ahead, so shadows fall towards the viewer
  const elev = { dawn: 0.32, morning: 0.8, noon: 1.6, golden: 0.3, dusk: 0.6 }[r.time] || 0.7;
  const hemi = new THREE.HemisphereLight(C(P.mid), C(P.grassDark), night ? 0.45 : 0.6); scene.add(hemi);
  const sun = new THREE.DirectionalLight(C(night ? '#a898e0' : P.light), night ? 1.0 : r.time === 'noon' ? 3.0 : 2.8);
  st.sunDir = new THREE.Vector3((P.sunX - 0.5) * 2.2, elev, -1).normalize();
  sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
  const sc = sun.shadow.camera; sc.left = -W * 1.7; sc.right = W * 1.7; sc.top = D0 * 2; sc.bottom = -D0 * 2; sc.near = 1; sc.far = D0 * 10; sun.shadow.bias = -0.0006; sun.shadow.normalBias = 2;
  scene.add(sun, sun.target); st.sun = sun;
  const fill = new THREE.DirectionalLight(C(P.rim), night ? 0.25 : 0.55); fill.position.set(0, 1, 1); scene.add(fill);

  // ground
  const gt = groundTex(P, key).clone(); gt.needsUpdate = true; gt.wrapS = gt.wrapT = THREE.RepeatWrapping; gt.anisotropy = 8;
  const gw = worldW + D0 * 40, gd = D0 * 24; gt.repeat.set(gw / (H * 0.7), gd / (H * 0.7));
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(gw, gd), mat('#ffffff', { map: gt, roughness: 1 }));
  ground.rotation.x = -Math.PI / 2; ground.position.set(worldW / 2, -FY, -gd / 2 + D0 * 0.6); ground.receiveShadow = true; scene.add(ground);

  // distant ridges (flat silhouettes, already in atmospheric colours)
  [[-15, P.far, 0.07, 0.16], [-8.5, P.hill, 0.035, 0.1]].forEach(([zz, color, a, b], li) => {
    const z = zz * D0, k = kOf(z), [x0, x1] = xr(z, 1.3), s = new THREE.Shape(), f1 = rr(0.6, 1.2), f2 = rr(2, 3.5), p1 = rnd() * 9;
    s.moveTo(x0, -FY - 10);
    for (let i = 0; i <= 160; i++) { const x = lerp(x0, x1, i / 160), u = (x - x0) / (x1 - x0) * 6; const hgt = (a + (b - a) * (0.5 + 0.35 * Math.sin(u * f1 + p1) + 0.15 * Math.sin(u * f2 * 3 + p1))) * H; s.lineTo(x, -gy + hgt / k); }
    s.lineTo(x1, -FY - 10);
    const m = new THREE.Mesh(new THREE.ShapeGeometry(s), new THREE.MeshBasicMaterial({ color: C(color), fog: false })); m.position.z = z; m.renderOrder = -1 + li; scene.add(m);
  });

  // trees
  const types = B.trees === 'mixed' ? ['round', 'pine'] : [B.trees];
  const tcol = mixC(P.tree, P.grass, 0.22);
  const itemXZ = [];
  const place = (it, fyT) => { const k = fyT, z = zOf(k), camRef = clamp(it.fx * worldW - W / 2, 0, worldW - W), sx = it.fx * worldW - camRef; return { x: camRef + W / 2 + (sx - W / 2) / k, z, k }; };
  for (const it of fs.items) { if (it.kind !== 'fish') { const p = place(it, 0.3 + 0.62 * it.fy); itemXZ.push(p); } }
  for (const type of types) {
    const list = [];
    const n = Math.round((type === 'birch' ? 120 : 90) / types.length * Math.max(1, worldW / 2600));
    for (let i = 0; i < n; i++) { const z = -D0 * (2.1 + Math.pow(rnd(), 0.7) * 8), [a, b] = xr(z); list.push({ x: rr(a, b), y: -FY, z, h: H * rr(0.9, 1.7) * (type === 'pine' ? 1.25 : 1), w: rr(0.85, 1.25), r: rnd() * TAU }); }
    // a few trees standing in among the clearings, never in front of something to find
    const near = fs.cottage ? 0 : Math.round(worldW / 420 / types.length);
    for (let i = 0, tries = 0; i < near && tries < 200; tries++) {
      const z = -D0 * rr(W < H ? 1.0 : 0.6, 1.7), [a, b] = xr(z, 0.9), x = rr(a, b), k = kOf(z);
      if (itemXZ.concat(fs.avoid3 || []).some((p) => Math.abs((p.x - x) * Math.min(k, p.k)) < Math.max(W * 0.14, 120) + 60)) continue;
      if (B.stream && Math.abs(z - st.streamZ0) < D0 * 0.5) continue;
      list.push({ x, y: -FY, z, h: H * rr(1.2, 1.6) * (type === 'pine' ? 1.2 : 1), w: rr(0.9, 1.2), r: rnd() * TAU }); i++;
    }
    forest(st, B.trees === 'birch' ? 'birch' : type, list, type === 'pine' ? mixC(tcol, '#173a26', 0.6) : B.trees === 'birch' ? mixC(tcol, '#b8c870', 0.3) : tcol);
  }

  // stream
  if (B.stream) {
    const zs = zOf(0.5); st.streamZ0 = zs;
    const zAt = (x) => zs + D0 * (0.12 * Math.sin(x * 0.0021) + 0.05 * Math.sin(x * 0.0057));
    st.zAt = zAt;
    const [x0, x1] = xr(zs, 1.2), n = 140, half = D0 * 0.17;
    const ribbon = (hw, y) => { const pos = [], uv = [], idx = []; for (let i = 0; i <= n; i++) { const x = lerp(x0, x1, i / n), z = zAt(x), w = hw * (1 + 0.15 * Math.sin(x * 0.009)); pos.push(x, y, z - w, x, y, z + w); uv.push((x - x0) / 600, 0, (x - x0) / 600, 1); if (i < n) idx.push(i * 2, i * 2 + 1, i * 2 + 2, i * 2 + 1, i * 2 + 3, i * 2 + 2); } const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx); g.computeVertexNormals(); return g; };
    const bank = new THREE.Mesh(ribbon(half * 1.25, -FY + 0.6), mat(mixC(P.grassDark, '#5a4430', 0.45), { roughness: 1 })); bank.receiveShadow = true; scene.add(bank);
    const wt = waterTex(P, key); st.water = wt;
    const water = new THREE.Mesh(ribbon(half, -FY + 1.2), M.phys({ map: wt, emissiveMap: wt, emissive: C('#ffffff'), emissiveIntensity: night ? 0.25 : 0.45, roughness: 0.08, clearcoat: 1, metalness: 0.1 }));
    water.receiveShadow = true; scene.add(water);
    scene.add(instanced(new THREE.IcosahedronGeometry(1, 1), mat('#9a9184', { flatShading: true }), 220, (o) => { const x = rr(x0, x1), side = rnd() < 0.5 ? -1 : 1, z = zAt(x) + side * half * rr(1.0, 1.25), k = kOf(z); o.position.set(x, -FY + 1, z); o.scale.set(rr(3, 7) / k, rr(1.5, 3) / k, rr(2.5, 5) / k); o.rotation.y = rnd() * 6; }));
  }

  // path of trodden earth
  if (B.path) {
    const y1 = (x) => H * 0.86 + Math.sin(x * 0.003) * 30 - gy, n = 120;
    const pos = [], idx = [];
    for (let i = 0; i <= n; i++) { const x = lerp(-W, worldW + W, i / n), a = y1(x), b2 = a + 26 + Math.sin(x * 0.01) * 6; const za = zOf(a / (H - gy)), zb = zOf(b2 / (H - gy)); pos.push(x, -FY + 0.8, za, x, -FY + 0.8, zb); if (i < n) idx.push(i * 2, i * 2 + 1, i * 2 + 2, i * 2 + 1, i * 2 + 3, i * 2 + 2); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
    const pm = new THREE.Mesh(g, mat('#b59a72', { transparent: true, opacity: 0.5, roughness: 1, depthWrite: false })); pm.receiveShadow = true; scene.add(pm);
  }

  // grass and flowers, swaying
  st.time = { value: 0 };
  const blade = new THREE.PlaneGeometry(0.12, 1, 1, 3); blade.translate(0, 0.5, 0);
  { const p = blade.attributes.position; for (let i = 0; i < p.count; i++) { const y = p.getY(i); p.setX(i, p.getX(i) * (1 - y * 0.9)); p.setZ(i, y * y * 0.25); } blade.computeVertexNormals(); }
  const gm = mat('#ffffff', { side: THREE.DoubleSide, roughness: 0.8 });
  const sway = (m) => { m.onBeforeCompile = (sh) => { sh.uniforms.uT = st.time; sh.vertexShader = 'uniform float uT;\n' + sh.vertexShader.replace('#include <begin_vertex>', '#include <begin_vertex>\n#ifdef USE_INSTANCING\nfloat ph = instanceMatrix[3].x * 0.004 + instanceMatrix[3].z * 0.002;\ntransformed.x += sin(uT * 1.6 + ph) * position.y * position.y * 0.22 + sin(uT * 3.1 + ph * 3.0) * position.y * 0.04;\n#endif'); }; return m; };
  sway(gm);
  const nb = Math.round(4200 * Math.min(1.6, worldW / 2600));
  const grass = instanced(blade, gm, nb, (o) => {
    const z = -D0 * 2.4 * Math.pow(rnd(), 1.5) - D0 * 0.02, k = kOf(z), [a, b] = xr(z, 1.05);
    o.position.set(rr(a, b), -FY, z); const h = rr(12, 30) * kk / k; o.scale.set(h * rr(0.8, 1.4), h, h); o.rotation.y = rr(-0.8, 0.8);
  });
  grass.castShadow = false; scene.add(grass);
  setSeed(B.seed + 1);
  for (let i = 0; i < nb; i++) grass.setColorAt(i, mixC(P.grass, rnd() < 0.5 ? P.grassDark : '#e8f0b0', rr(0, 0.45)));
  const fl = B.flowers || ['#ffffff'];
  const fm = sway(mat('#ffffff', { roughness: 0.6, emissive: C('#ffffff'), emissiveIntensity: 0.04 }));
  const nf = night ? 180 : 380;
  const flowers = instanced(new THREE.IcosahedronGeometry(1, 0), fm, nf, (o) => {
    const z = -D0 * 2.2 * Math.pow(rnd(), 1.3) - D0 * 0.03, k = kOf(z), [a, b] = xr(z, 1.05);
    const s = rr(1.8, 3.4) * kk / k; o.position.set(rr(a, b), -FY + rr(8, 20) * kk / k, z); o.scale.setScalar(s);
  });
  for (let i = 0; i < nf; i++) flowers.setColorAt(i, night ? mixC(fl[i % fl.length], '#40406a', 0.5) : C(fl[i % fl.length])); flowers.castShadow = false; scene.add(flowers);

  // things to find
  const halo = glowTex();
  for (const it of fs.items) {
    let o = null, p;
    if (it.kind === 'fish') {
      p = place(it, 0.5); if (st.zAt) p.z = st.zAt(p.x);
      o = new THREE.Group();
      const fish = new THREE.Mesh(blob(0.42, 0.08, 0.12, 0.03, 2, 4), new THREE.MeshBasicMaterial({ color: '#10181a', transparent: true, opacity: 0.4, depthWrite: false }));
      fish.position.y = 0.02; o.add(fish); o.userData.fish = fish;
    } else if (it.kind === 'animal') {
      p = place(it, 0.3 + 0.62 * it.fy);
      o = it.id === 'deer' ? deer() : it.id === 'pheasant' ? pheasant() : rabbit();
    } else {
      p = place(it, 0.3 + 0.62 * it.fy);
      o = new THREE.Group(); const pl = plant3d(it.id); o.add(pl); o.userData.pl = pl;
    }
    const sm = new THREE.SpriteMaterial({ map: halo, color: C(it.bonus ? '#ffd6f0' : P.rim), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.5 });
    const hs = new THREE.Sprite(sm); scene.add(hs);
    o.position.set(p.x, -FY + (it.kind === 'fish' ? 1.6 : 0), p.z);
    scene.add(o);
    st.items.push({ it, o, hs, x: p.x, z: p.z, k: p.k });
  }

  if (fs.cottage) {
    const ck = fs.cottage.k, cz = zOf(ck), cx = W / 2 + (fs.cottage.sx - W / 2) / ck, cs = fs.cottage.s / ck;
    const c = cottage(); c.position.set(cx, -FY, cz); c.scale.setScalar(cs); c.rotation.y = -0.25; scene.add(c);
    const lamp = new THREE.PointLight('#ffb060', 1.4, cs * 2.2, 0); lamp.position.set(cx, -FY + cs * 0.3, cz + cs * 0.6); scene.add(lamp);
    st.cottage = { c, lamp, chim: new THREE.Vector3(0.3, 1.28, -0.05) };
  }
  scene.traverse((m) => { if (m.material) [].concat(m.material).forEach((mt) => { if (mt.envMapIntensity !== undefined) mt.envMapIntensity = 0.25; }); });
  st.kOf = kOf;
  return st;
}

// ── per frame ───────────────────────────────────────────────────────────────
function tick(dt, t) {
  const st = S, fs = st.fs, { W, H, gy, D0, cam } = st;
  if (!G.scene || G.scene !== fs) return;
  if (innerWidth + 'x' + innerHeight !== st.key) { relayout(); return; }
  st.time.value = t;
  const camX = fs.camX;
  cam.position.x = W / 2 + camX;
  if (fs.zoom !== 1 && fs.focus) {
    const f = fs.focus, z = fs.zoom, x0 = (f.x - camX) - (W / 2) / z, y0 = f.y - f.sy / z;
    cam.setViewOffset(W, H, x0, H / 2 - gy + y0, W / z, H / z);
  } else cam.setViewOffset(W, H, 0, H / 2 - gy, W, H);
  cam.updateProjectionMatrix();
  // shadows follow the view
  const tgt = st.sun.target.position; tgt.set(camX + W / 2, -H, -D0 * 1.6);
  st.sun.position.copy(tgt).addScaledVector(st.sunDir, D0 * 4);
  if (st.water) st.water.offset.x = -t * 0.04;
  if (st.cottage) {
    const cc = st.cottage, v = cc.chim.clone(); cc.c.localToWorld(v); const k = st.kOf(v.z);
    fs.chim = [W / 2 + (v.x - camX - W / 2) * k, gy + (-v.y - gy) * k];
    cc.lamp.intensity = 1.2 + 0.25 * Math.sin(t * 6) * Math.sin(t * 2.3);
  }
  // items: animate, then write their on-screen spot back for the 2D layer
  for (const e of st.items) {
    const it = e.it, o = e.o, k = e.k;
    let X = e.x;
    if (it.kind === 'animal') {
      const a = it, moving = a.state === 'flee' || a.state === 'gone' || a.state === 'return';
      if (moving && a.homeX != null) X = e.x + (a.wx - a.homeX) / k;
      o.visible = !a.taken && a.state !== 'gone';
      const u = o.userData, s = a.st, sz = a.s / k * (u.kind === 'deer' ? 0.9 : u.kind === 'pheasant' ? 1.5 : 1.3);
      o.scale.setScalar(sz);
      o.rotation.y = a.state === 'return' ? Math.PI + 0.35 : -0.35;
      u.body.position.y = s.hop * 0.25;
      if (u.kind === 'rabbit') { u.head.rotation.z = lerp(-0.55, 0.15, s.head); u.head.position.y = lerp(0.26, 0.4, s.head); u.ears.rotation.z = lerp(-0.9, 0.05, s.ear); }
      else if (u.kind === 'pheasant') { u.head.rotation.z = lerp(-1.05, 0.05, clamp(s.head)); }
      else { u.head.rotation.z = lerp(-1.25, 0.05, clamp(s.head)); u.legs.forEach((l, i) => (l.rotation.z = Math.sin(s.walk + (i % 2 ? 0 : Math.PI) + (i > 1 ? 0.6 : 0)) * 0.5 * s.moving)); }
      o.position.x = X;
      if (!moving) { const sx = W / 2 + (X - camX - W / 2) * k; it.wx = sx + camX; it.wy = gy + (H - gy) * k; }
      e.hs.visible = false;
    } else if (it.kind === 'fish') {
      o.visible = !it.taken;
      const f = o.userData.fish; f.position.x = Math.sin(t * 0.7) * 30 / k; f.rotation.y = Math.cos(t * 0.7) > 0 ? 0 : Math.PI; f.scale.setScalar(16 * fs.k / k * 2.2);
      const sx = W / 2 + (X - camX - W / 2) * k; it.wx = sx + camX; it.wy = gy + (H - gy) * k;
      e.hs.visible = !it.taken; const pulse = 0.5 + 0.5 * Math.sin(t * 2);
      e.hs.position.set(X, -H + 2, e.z - 4); e.hs.scale.setScalar(90 * fs.k / k); e.hs.material.opacity = 0.3 + pulse * 0.2;
    } else {
      o.visible = !it.taken;
      const s = it.s / k * 1.45;
      o.scale.setScalar(s); o.userData.pl.rotation.z = Math.sin(t * 1.6 + it.ph) * 0.05; o.userData.pl.rotation.x = Math.sin(t * 1.1 + it.ph * 2) * 0.03;
      const sx = W / 2 + (X - camX - W / 2) * k; it.wx = sx + camX; it.wy = gy + (H - gy) * k;
      const pulse = 0.5 + 0.5 * Math.sin(t * 2.2 + it.ph);
      e.hs.visible = !it.taken; e.hs.position.set(X, -H + s * 0.5, e.z - s * 0.6); e.hs.scale.setScalar(s * (2.6 + pulse * 0.5)); e.hs.material.opacity = 0.2 + pulse * 0.14;
    }
  }
}
function dispose() {}
function relayout() { const fs = S.fs; S = build(fs); Dish3D.custom({ scene: S.scene, camera: S.cam, tick, dispose }); }
window.Forage3D = {
  start(fs) {
    if (!Dish3D.ok) return false;
    try { S = build(fs); } catch (e) { console.warn('3D forest unavailable', e); S = null; return false; }
    return Dish3D.custom({ scene: S.scene, camera: S.cam, tick, dispose });
  },
  stop() { if (S) Dish3D.stop(); S = null; },
  // the title screen: a golden meadow with the cottage, panning slowly
  title(ts) {
    if (!Dish3D.ok) return false;
    const W = innerWidth, H = innerHeight;
    const fake = ts; fake.items = fake.items || []; fake.zoom = 1; fake.focus = null; fake.k = Math.min(H / 900, W / 520);
    fake.r = { id: 'title', time: 'golden', biome: { trees: 'mixed', seed: 909, clearings: 0.5, flowers: ['#ffd36a', '#ffffff', '#ff9f6a'] } };
    fake.cottage = { sx: W * 0.72, k: 0.34, s: ts.cs * 1.05 * 0.9 };
    fake.avoid3 = [{ x: W / 2 + (W * 0.72 - W / 2) / 0.34, k: 0.34 }];
    return this.start(fake);
  },
};
