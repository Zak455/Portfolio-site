// Aetherbound in the Tiny Diorama look: builders for Thornwick, the Ashwood and its people.
// Reads the real map from AB.World (game data), turns it into a floating model tile.
(function () {
  const THREE = window.THREE, K = window.K;
  const PAL = {
    backdrop: '#b4d2de', evening: '#8f9fc4', night: '#3a4560', grass: '#9fc47c', forest: '#6f9a63', leaf: ['#5fa574', '#3f866c', '#84ba6b', '#2f6a58'], trunk: '#8b5b3e',
    earth: ['#5c4135', '#8f6248', '#c9955f', '#7c7f8e'], stone: ['#a9a9b0', '#d9cdb8', '#8d8f9c'],
    cream: '#f6ebd8', slate: '#44718a', mustard: '#f0b040', accent: '#c8323c', glass: '#2c4658', dark: '#272b36',
    road: '#d8c193', kraft: '#cb9c68', skin: '#f2c8a2', smoke: '#ffffff', water: '#8fd0e0', lampGlow: '#ffc56e',
    terracotta: '#b9674b', thatch: '#c9a26a', timber: '#7a5238', soil: '#7d5a40', slime: '#7cc46a', wolf: '#6d6f7c', mana: '#7cc6ff',
  };
  const FONT = '700 160px "Almendra"';
  const D2R = Math.PI / 180;
  const mix = (a, b, k) => a.map((v, i) => v + (b[i] - v) * k);

  // SHAPES ----------------------------------------------------------
  // A rounded rectangle lying on the ground, as a loop of points with outward normals and the distance walked so far.
  function ring(w, d, r, n = 10) {
    const pts = [], hx = w / 2 - r, hz = d / 2 - r; let u = 0, px = 0, pz = 0;
    for (let k = 0; k < 4; k++) for (let i = 0; i <= n; i++) {
      const a = (k + i / n) * Math.PI / 2, x = (k === 0 || k === 3 ? hx : -hx) + r * Math.cos(a), z = (k < 2 ? hz : -hz) + r * Math.sin(a);
      if (pts.length) u += Math.hypot(x - px, z - pz);
      px = x; pz = z; pts.push({ x, z, nx: Math.cos(a), nz: Math.sin(a), u });
    }
    pts.push({ ...pts[0], u: u + Math.hypot(pts[0].x - px, pts[0].z - pz) });
    pts.around = pts[pts.length - 1].u;
    return pts;
  }
  // Sweep a side profile around that loop: this is how the tile, its grass cap, plinths and ponds are made.
  // profile = [[inset, y, slope?], ...] from the top edge down; slope is the normal's angle from straight up
  // (0 = up, PI/2 = out, PI = down) and is worked out from the neighbours when left out. Group 0 = sides, 1 = top.
  function loft(loop, profile, cap = true) {
    const P = profile.map(([inset, y, a], j) => { const p0 = profile[Math.max(0, j - 1)], p1 = profile[Math.min(profile.length - 1, j + 1)]; return [inset, y, a == null ? Math.atan2(p0[1] - p1[1], p0[0] - p1[0]) : a]; });
    const M = loop.length, pos = [], nor = [], uv = [], idx = [], y0 = P[0][1], y1 = P[P.length - 1][1];
    for (const [inset, y, a] of P) for (const p of loop) { pos.push(p.x - p.nx * inset, y, p.z - p.nz * inset); nor.push(p.nx * Math.sin(a), Math.cos(a), p.nz * Math.sin(a)); uv.push(p.u / loop.around, (y - y1) / (y0 - y1 || 1)); }
    for (let j = 0; j < P.length - 1; j++) for (let i = 0; i < M - 1; i++) { const a = j * M + i, b = a + 1, c = a + M, d = c + 1; idx.push(a, b, c, b, d, c); }
    const g = new THREE.BufferGeometry(), sideCount = idx.length;
    if (cap) {
      const base = pos.length / 3; pos.push(0, y0, 0); nor.push(0, 1, 0); uv.push(0, 0);
      for (const p of loop) { const x = p.x - p.nx * P[0][0], z = p.z - p.nz * P[0][0]; pos.push(x, y0, z); nor.push(0, 1, 0); uv.push(x, z); }
      for (let i = 0; i < M - 1; i++) idx.push(base, base + 2 + i, base + 1 + i);
    }
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    g.setIndex(idx); g.addGroup(0, sideCount, 0); if (cap) g.addGroup(sideCount, idx.length - sideCount, 1);
    return g;
  }
  const lip = (r, y, n = 5) => Array.from({ length: n + 1 }, (_, i) => { const a = i / n * Math.PI / 2; return [r * (1 - Math.sin(a)), y - r * (1 - Math.cos(a)), a]; });   // a quarter-round top edge
  // A flat outline with rounded corners, pushed out into a solid with soft edges: roofs, the van body, anything with a silhouette.
  function prism(pts, r, depth, bevel = 0.04) {
    const s = new THREE.Shape(), n = pts.length;
    pts.forEach((p, i) => {
      const a = pts[(i + n - 1) % n], b = pts[(i + 1) % n], da = Math.hypot(a[0] - p[0], a[1] - p[1]), db = Math.hypot(b[0] - p[0], b[1] - p[1]), k = Math.min(Array.isArray(r) ? r[i] : r, da / 2, db / 2);
      const p0 = [p[0] + (a[0] - p[0]) * k / da, p[1] + (a[1] - p[1]) * k / da], p1 = [p[0] + (b[0] - p[0]) * k / db, p[1] + (b[1] - p[1]) * k / db];
      if (i === 0) s.moveTo(p0[0], p0[1]); else s.lineTo(p0[0], p0[1]);
      s.quadraticCurveTo(p[0], p[1], p1[0], p1[1]);
    });
    s.closePath();
    const g = new THREE.ExtrudeGeometry(s, { depth: depth - 2 * bevel, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelOffset: -bevel, bevelSegments: 3, curveSegments: 6 });
    g.translate(0, 0, -(depth - 2 * bevel) / 2);
    return g;
  }

  // PAINT -----------------------------------------------------------
  // Everything is matte model paint. One material per colour, shared.
  const paints = new Map();
  const paint = (hex, rough = 0.86) => { const key = hex + rough; if (!paints.has(key)) paints.set(key, new THREE.MeshStandardMaterial({ color: hex, roughness: rough, metalness: 0 })); return paints.get(key); };
  // something that can light up: dark glass by day, a warm lamp when `.emissiveIntensity` is raised
  const lampPaint = (hex = PAL.glass, glow = PAL.lampGlow) => new THREE.MeshStandardMaterial({ color: hex, roughness: 0.45, emissive: glow, emissiveIntensity: 0 });
  function put(parent, geo, mat, p = [0, 0, 0], r, cast = true) {
    const m = new THREE.Mesh(geo, typeof mat === 'string' ? paint(mat) : mat); m.position.set(p[0], p[1], p[2]); if (r) m.rotation.set(r[0], r[1], r[2]);
    m.castShadow = cast; m.receiveShadow = true; parent.add(m); return m;
  }
  const box = (parent, w, h, d, color, p, r = 0.06, rot) => put(parent, K.roundedBox(w, h, d, r, 4), color, p, rot);
  const decal = (parent, w, h, r, mat, p, rot) => put(parent, K.roundedRect(w, h, r), mat, p, rot, false);   // a flat painted panel just off a surface

  // THE TILE --------------------------------------------------------
  // A thick slab cut out of the ground: a grass cap with a soft lip, then the cut side showing topsoil, clay and
  // rock, tapering away underneath so it reads as floating. Returns the group everything else is planted on.
  function tile(parent, { w, d, r }) {
    const g = new THREE.Group(); parent.add(g);
    const rr = K.rng(7);
    const grass = K.canvasTex(1024, 1024, (ctx, W) => {            // flock: soft blotches of two greens and a fine speckle
      ctx.fillStyle = PAL.grass; ctx.fillRect(0, 0, W, W);
      for (let i = 0; i < 90; i++) { const x = rr.range(0, W), y = rr.range(0, W), s = rr.range(60, 190), c = rr.chance(0.5) ? '255,246,190' : '60,120,70'; for (const ox of [-W, 0, W]) for (const oy of [-W, 0, W]) { const gr = ctx.createRadialGradient(x + ox, y + oy, 0, x + ox, y + oy, s); gr.addColorStop(0, `rgba(${c},0.11)`); gr.addColorStop(1, `rgba(${c},0)`); ctx.fillStyle = gr; ctx.fillRect(x + ox - s, y + oy - s, 2 * s, 2 * s); } }
      for (let i = 0; i < 26000; i++) { ctx.fillStyle = rr.chance(0.5) ? 'rgba(255,255,210,0.10)' : 'rgba(40,90,50,0.10)'; ctx.fillRect(rr.range(0, W), rr.range(0, W), 2, 2); }
    }, { repeat: [1 / 5, 1 / 5] });
    const grassMat = new THREE.MeshPhysicalMaterial({ map: grass, roughness: 0.95, sheen: 0.6, sheenRoughness: 0.7, sheenColor: new THREE.Color('#e8f5b0') });
    const cap = put(g, loft(ring(w + 0.18, d + 0.18, r + 0.09, 12), [...lip(0.11, 0), [0, -0.19, Math.PI / 2], [0.1, -0.27, Math.PI]]), [grassMat, grassMat]);
    cap.material[0] = new THREE.MeshPhysicalMaterial({ color: PAL.grass, roughness: 0.95, sheen: 0.6, sheenRoughness: 0.7, sheenColor: new THREE.Color('#e8f5b0') });   // the lip has no flat UVs, so it gets the plain colour

    // the cut: a painted cross-section that wraps twice around the tile
    const H = 1.8, strata = K.canvasTex(2048, 512, (ctx, W, Hh) => {
      const wave = (base, amp, k, ph) => (x) => base + amp * Math.sin(x / W * Math.PI * 2 * k + ph) + amp * 0.5 * Math.sin(x / W * Math.PI * 2 * (k * 2 + 1) + ph * 2.3);
      const band = (top, color) => { ctx.fillStyle = color; ctx.beginPath(); ctx.moveTo(0, Hh); for (let x = 0; x <= W; x += 8) ctx.lineTo(x, top(x)); ctx.lineTo(W, Hh); ctx.fill(); };
      ctx.fillStyle = PAL.earth[0]; ctx.fillRect(0, 0, W, Hh);
      band(wave(44, 7, 5, 0.4), PAL.earth[1]); band(wave(170, 14, 3, 1.9), PAL.earth[2]); band(wave(292, 16, 2, 4.0), PAL.earth[3]);
      const blob = (x, y, a, b, rot, color) => { for (const ox of [-W, 0, W]) { ctx.fillStyle = color; ctx.beginPath(); ctx.ellipse(x + ox, y, a, b, rot, 0, 7); ctx.fill(); } };
      for (let i = 0; i < 6; i++) { ctx.strokeStyle = 'rgba(255,240,205,0.28)'; ctx.lineWidth = 5; ctx.beginPath(); const f = wave(194 + i * 15, 12, 3, 1.9 + i * 0.25); for (let x = 0; x <= W; x += 8) ctx.lineTo(x, f(x)); ctx.stroke(); }   // seams in the clay
      for (let i = 0; i < 46; i++) blob(rr.range(0, W), rr.range(66, 160), rr.range(7, 20), rr.range(5, 12), rr.range(-0.5, 0.5), rr.pick(['#d7c4a6', '#a88a70', '#6f4c3b']));   // pebbles in the soil
      for (let i = 0; i < 30; i++) blob(rr.range(0, W), rr.range(322, 500), rr.range(24, 70), rr.range(10, 24), rr.range(-0.3, 0.3), rr.pick(['#8b8e9d', '#6e7181', '#73768a']));   // rock faces
      for (let i = 0; i < 40; i++) { const x = rr.range(0, W); ctx.strokeStyle = 'rgba(60,40,30,0.5)'; ctx.lineWidth = rr.range(2, 4); ctx.beginPath(); ctx.moveTo(x, 0); ctx.quadraticCurveTo(x + rr.range(-18, 18), 30, x + rr.range(-26, 26), rr.range(40, 90)); ctx.stroke(); }   // roots
    }, { repeat: [2, 1] });
    put(g, loft(ring(w, d, r, 12), [[0, -0.19, Math.PI / 2], [0, -1.32, Math.PI / 2], [0.07, -1.52], [0.3, -1.76], [0.62, -1.9], [0.95, -H - 0.19]], false), new THREE.MeshStandardMaterial({ map: strata, roughness: 0.9 }));
    put(g, loft(ring(w - 1.9, d - 1.9, 0.3), [[0, -H - 0.17, 0]]), PAL.earth[3]);   // closes the underside
    // stones pressed half-way into the cut, so the side is not only paint
    const loop = ring(w, d, r, 12), stones = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 14, 10), paint('#ffffff', 0.9), 30); stones.castShadow = stones.receiveShadow = true; g.add(stones);
    for (let i = 0; i < stones.count; i++) {
      const at = rr.range(0, loop.around), j = loop.findIndex((q) => q.u >= at), a = loop[Math.max(0, j - 1)], b = loop[j], f = (at - a.u) / (b.u - a.u || 1), p = { x: K.lerp(a.x, b.x, f), z: K.lerp(a.z, b.z, f), nx: b.nx, nz: b.nz }, y = rr.range(-0.45, -1.25), s = rr.range(0.05, 0.11);
      K.place(stones, i, [p.x - p.nx * s * 0.25, y, p.z - p.nz * s * 0.25], [rr.range(0, 3), rr.range(0, 3), 0], [s * rr.range(1, 1.7), s * rr.range(0.6, 1), s]);
      stones.setColorAt(i, new THREE.Color(y > -1.0 ? rr.pick(PAL.stone) : PAL.stone[2]));
    }
    g.userData.grass = cap.material[0];
    return g;
  }
  // A raised ribbon along a path (road, river, track). Returns the curve so things can travel on it.
  function ribbon(parent, pts, { width = 1.1, height = 0.05, texture, period = 1 }) {
    const curve = new THREE.CatmullRomCurve3(pts.map(([x, z]) => new THREE.Vector3(x, 0, z)), false, 'centripetal'); curve.arcLengthDivisions = 600;
    const len = curve.getLength(), n = Math.ceil(len * 14), pos = [], uv = [], idx = [], cross = [[-width / 2, 0, 0], [-width / 2 + 0.05, height, 0.06], [width / 2 - 0.05, height, 0.94], [width / 2, 0, 1]];
    for (let i = 0; i <= n; i++) {
      const p = curve.getPointAt(i / n), tg = curve.getTangentAt(i / n);
      for (const [o, y, v] of cross) { pos.push(p.x - tg.z * o, y, p.z + tg.x * o); uv.push(i / n * len / period, v); }
      if (i < n) for (let k = 0; k < 3; k++) { const a = i * 4 + k; idx.push(a, a + 1, a + 4, a + 1, a + 5, a + 4); }
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx); g.computeVertexNormals();
    put(parent, g, new THREE.MeshStandardMaterial({ map: texture, roughness: 0.9 }), [0, 0, 0], null, false);
    return Object.assign(curve, { len });
  }

  // BUILDING BLOCKS -------------------------------------------------
  const gable = (w, h, len, r = 0.1) => prism([[-w / 2, 0], [w / 2, 0], [0, h]], [r, r, r * 1.6], len, 0.05);   // ridge along z
  // a window: a frame with a pane that can light up. Returns the pane's material.
  function windowPane(parent, w, h, p, rotY = 0, frame = PAL.cream) {
    const g = new THREE.Group(); g.position.set(p[0], p[1], p[2]); g.rotation.y = rotY; parent.add(g);
    box(g, w + 0.12, h + 0.12, 0.07, frame, [0, 0, 0], 0.03);
    const m = lampPaint(); decal(g, w, h, 0.04, m, [0, 0, 0.04]); box(g, 0.035, h, 0.02, frame, [0, 0, 0.045], 0.008);
    return m;
  }
  // tiny people are turned wooden pegs: a body, a ball for a head and one prop that says who they are
  function peg(parent, color, hat) {
    const g = new THREE.Group(); parent.add(g);
    const body = new THREE.LatheGeometry([[0, 0], [0.15, 0], [0.185, 0.04], [0.17, 0.3], [0.12, 0.43], [0, 0.46]].map(([x, y]) => new THREE.Vector2(x, y)), 20);
    put(g, body, color); put(g, new THREE.SphereGeometry(0.15, 20, 14), PAL.skin, [0, 0.58, 0]);
    if (hat === 'cap') { put(g, new THREE.SphereGeometry(0.158, 20, 10, 0, 7, 0, 1.25), color, [0, 0.6, 0]); box(g, 0.2, 0.03, 0.14, color, [0, 0.64, 0.15], 0.012); }
    if (hat === 'helmet') put(g, new THREE.SphereGeometry(0.17, 20, 10, 0, 7, 0, 1.5), PAL.mustard, [0, 0.6, 0]);
    if (hat === 'hair') put(g, new THREE.SphereGeometry(0.162, 20, 10, 0, 7, 0, 1.75), PAL.trunk, [0, 0.59, -0.012], [-0.35, 0, 0]);
    return g;
  }
  function tree(parent, x, z, s, kind, y = 0) {
    const g = new THREE.Group(); g.position.set(x, y, z); g.scale.setScalar(s); parent.add(g);
    put(g, new THREE.CylinderGeometry(0.06, 0.09, 0.6, 10), PAL.trunk, [0, 0.3, 0]);
    if (kind === 'fir') {      // a gumdrop
      // profile runs bottom to top: the other way round the faces point inwards and the trunk shows through
      put(g, new THREE.LatheGeometry([[0, 0.38], [0.4, 0.4], [0.5, 0.52], [0.47, 0.72], [0.3, 1.2], [0.1, 1.68], [0, 1.75]].map(([a, b]) => new THREE.Vector2(a, b)), 22), PAL.leaf[1]);
    } else {                   // a lollipop with a smaller ball on its shoulder
      put(g, new THREE.SphereGeometry(0.52, 24, 16), PAL.leaf[kind === 'pale' ? 2 : 0], [0, 0.98, 0]).scale.set(1, 0.92, 1);
      put(g, new THREE.SphereGeometry(0.3, 20, 14), PAL.leaf[kind === 'pale' ? 2 : 0], [0.3, 0.74, 0.22]);
    }
    return g;
  }
  // The label of a stop: a card on a pin that always turns to face the lens. One side is grey ("not yet"), the other
  // is the accent colour ("done"); `flip` is the part to rotate about x by PI to change state.
  function sign(parent, word, number) {
    const g = new THREE.Group(), flip = new THREE.Group(); parent.add(g); g.add(flip);
    const PX = 380, SPACING = 0.05, m = document.createElement('canvas').getContext('2d'); m.font = FONT; m.letterSpacing = SPACING * 160 + 'px';
    const capPx = m.measureText('H').actualBoundingBoxAscent, k = 0.3 * PX / capPx, textW = m.measureText(word).width * k / PX;     // letters 0.3 units tall
    const bh = 0.62, coin = 0.4, bw = textW + coin * 2 + 0.34, tx = -bw / 2 + coin * 2 + 0.08;
    const face = (bg, fg) => new THREE.MeshStandardMaterial({ roughness: 0.8, map: K.canvasTex(Math.round(bw * PX), Math.round(bh * PX), (ctx, W, Hh) => {
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, Hh); ctx.fillStyle = fg; ctx.font = FONT.replace('160px', 160 * k + 'px'); ctx.letterSpacing = SPACING * 160 * k + 'px'; ctx.textBaseline = 'alphabetic';
      ctx.fillText(word, (tx + bw / 2) * PX, Hh / 2 + 0.15 * PX);
    }) });
    const disc = (bg, fg) => new THREE.MeshStandardMaterial({ roughness: 0.8, map: K.canvasTex(256, 256, (ctx) => {
      ctx.fillStyle = bg; ctx.fillRect(0, 0, 256, 256); ctx.fillStyle = fg; ctx.font = FONT.replace('160px', '190px'); ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
      const mm = ctx.measureText(String(number)); ctx.fillText(String(number), 128, 128 + mm.actualBoundingBoxAscent / 2);
    }) });
    box(flip, bw, bh, 0.1, PAL.cream, [0, 0, 0], 0.05);
    put(flip, new THREE.CylinderGeometry(coin + 0.07, coin + 0.07, 0.16, 40), PAL.cream, [-bw / 2 + coin, 0, 0], [Math.PI / 2, 0, 0]);
    for (const [side, bg, fg, cbg, cfg] of [[1, '#ece8df', '#7d8996', '#aab3bd', '#f4f1ea'], [-1, PAL.accent, '#fff6e6', '#fff6e6', PAL.accent]]) {
      const s = new THREE.Group(); s.rotation.x = side > 0 ? 0 : Math.PI; flip.add(s);
      decal(s, bw - 0.09, bh - 0.09, 0.03, face(bg, fg), [0, 0, 0.052]);
      put(s, new THREE.CircleGeometry(coin, 40), disc(cbg, cfg), [-bw / 2 + coin, 0, 0.082], null, false);
    }
    const pole = put(g, new THREE.CylinderGeometry(0.05, 0.06, 1, 12), PAL.cream, [0, 0, -0.1]);
    put(g, new THREE.CylinderGeometry(0.13, 0.15, 0.08, 16), PAL.slate, [0, 0.04, -0.1]);
    return { g, flip, pole, setHeight(h) { flip.position.y = h; pole.scale.y = h; pole.position.y = h / 2; } };
  }
  // The vehicle: a silhouette pushed out sideways, four wheels, glass, lamps and a hatch. x is forward.
  function van(parent, color) {
    const g = new THREE.Group(), body = new THREE.Group(); parent.add(g); g.add(body);
    put(body, prism([[-0.92, 0.2], [0.92, 0.2], [0.94, 0.52], [0.68, 0.61], [0.4, 1.05], [-0.92, 1.05]], [0.08, 0.1, 0.1, 0.05, 0.14, 0.12], 0.86, 0.06), color);
    const glass = paint(PAL.glass, 0.6), n = new THREE.Vector3(0.44, 0.28, 0).normalize();
    const ws = decal(body, 0.66, 0.38, 0.07, glass, [0.54 + n.x * 0.012, 0.835 + n.y * 0.012, 0]); ws.lookAt(ws.position.clone().add(n));
    for (const s of [1, -1]) {
      const rot = [0, s > 0 ? 0 : Math.PI, 0];
      decal(body, 0.3, 0.26, 0.05, glass, [0.2, 0.83, s * 0.432], rot);
      decal(body, 1.5, 0.09, 0.03, PAL.cream, [-0.1, 0.44, s * 0.432], rot);
      decal(body, 0.46, 0.34, 0.05, PAL.cream, [-0.42, 0.78, s * 0.432], rot);
      box(body, 0.2, 0.15, 0.012, PAL.kraft, [-0.42, 0.765, s * 0.436], 0.005); box(body, 0.045, 0.152, 0.014, color, [-0.42, 0.765, s * 0.437], 0.004);   // a parcel painted on the side
    }
    box(body, 0.09, 0.1, 0.82, PAL.slate, [0.93, 0.27, 0], 0.03); box(body, 0.09, 0.1, 0.82, PAL.slate, [-0.92, 0.25, 0], 0.03);
    const lamps = lampPaint('#fff3d6', '#fff0c8'); for (const s of [1, -1]) put(body, new THREE.CylinderGeometry(0.065, 0.065, 0.04, 16), lamps, [0.945, 0.42, s * 0.28], [0, 0, Math.PI / 2]);
    decal(body, 0.72, 0.62, 0.05, PAL.dark, [-0.923, 0.64, 0], [0, -Math.PI / 2, 0]);              // the dark inside, seen when the hatch is up
    const hatch = new THREE.Group(); hatch.position.set(-0.94, 1.0, 0); body.add(hatch);
    box(hatch, 0.05, 0.74, 0.76, color, [0, -0.37, 0], 0.025); box(hatch, 0.02, 0.2, 0.44, PAL.glass, [-0.02, -0.2, 0], 0.01);
    const wheels = [];
    for (const [x, z] of [[0.56, 0.37], [0.56, -0.37], [-0.56, 0.37], [-0.56, -0.37]]) {
      const w = new THREE.Group(); w.position.set(x, 0.2, z); g.add(w); wheels.push(w);
      put(w, new THREE.CylinderGeometry(0.2, 0.2, 0.17, 24), PAL.dark, [0, 0, 0], [Math.PI / 2, 0, 0]);
      put(w, new THREE.CylinderGeometry(0.1, 0.1, 0.19, 16), PAL.cream, [0, 0, 0], [Math.PI / 2, 0, 0]);
      put(w, new THREE.CylinderGeometry(0.028, 0.028, 0.2, 8), PAL.dark, [0.055, 0, 0], [Math.PI / 2, 0, 0]);   // one off-centre dot so the spin shows
    }
    return { g, body, hatch, wheels, lamps };
  }
  // Puffs: matte white balls that swell, drift and shrink away. `list` = [{ at:[x,y,z], t0, life, size, rise, drift }]
  function puffs(parent, count) {
    const m = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 16, 12), paint(PAL.smoke, 0.95), count); m.castShadow = true; m.frustumCulled = false; parent.add(m);
    return { mesh: m, set(i, at, age, o) {      // age 0..1
      const s = age <= 0 || age >= 1 ? 0 : o.size * K.smooth(0, 0.3, age) * (1 - K.smooth(0.55, 1, age)) * (0.7 + 0.5 * age);
      K.place(m, i, [at[0] + (o.drift || 0) * age * age, at[1] + o.rise * age, at[2] + (o.driftZ || 0) * age], null, Math.max(s, 1e-4));
    } };
  }

  // MOTION ----------------------------------------------------------
  // distance travelled for a move that speeds up for `a` of the time, cruises, and brakes for `b` of it (0..1 in, 0..1 out)
  const trap = (u, a, b) => { u = K.clamp(u); const v = 1 / (1 - a / 2 - b / 2); return u < a ? v * u * u / (2 * a) : u < 1 - b ? v * (u - a / 2) : 1 - v * (1 - u) * (1 - u) / (2 * b); };
  // a hop from one spot to another: returns [x, y, z, squash] (squash > 0 just after landing)
  const hop = (t, t0, len, from, to, height) => { const u = K.clamp((t - t0) / len), e = K.ease.inOut(u), land = t - t0 - len; return [from[0] + (to[0] - from[0]) * e, height * Math.sin(Math.PI * u), from[1] + (to[1] - from[1]) * e, land > 0 ? Math.exp(-land * 14) * Math.sin(land * 30) * 0.12 : 0]; };


  // ---------------------------------------------------------------- Aetherbound pieces
  const U = 0.5, TS = 32;                         // one game tile = half a unit
  const MW = 92 * U, MD = 64 * U;                 // the map slab
  const wx = (px) => px / TS * U - MW / 2, wz = (py) => py / TS * U - MD / 2;

  // the ground: painted from the real tile map (paths, fields, yard, garden, forest floor, the stone clearing)
  function groundTexture(world) {
    const PX = 24, W = 92 * PX, H = 64 * PX, rr = K.rng(11);
    return K.canvasTex(W, H, (ctx) => {
      const col = { 0: PAL.grass, 1: PAL.road, 2: '#7fae8c', 3: PAL.road, 4: '#9c7a52', 5: PAL.forest, 6: '#a3a98c', 7: '#d9cdb0', 8: '#c8ac80', 9: '#6e5038' };
      for (let y = 0; y < 64; y++) for (let x = 0; x < 92; x++) { ctx.fillStyle = col[world.tileAt(x, y)] || PAL.grass; ctx.fillRect(x * PX, y * PX, PX + 1, PX + 1); }
      ctx.filter = 'blur(10px)'; ctx.drawImage(ctx.canvas, 0, 0); ctx.filter = 'none';
      for (let y = 31; y < 40; y += 0.5) { ctx.fillStyle = 'rgba(70,45,25,0.28)'; ctx.fillRect(8 * PX, y * PX, 8 * PX, PX * 0.16); }
      for (let x = 22; x < 27; x += 0.7) { ctx.fillStyle = 'rgba(120,180,90,0.7)'; for (let y = 16.3; y < 19.7; y += 0.55) { ctx.beginPath(); ctx.arc(x * PX + 6, y * PX, 5, 0, 7); ctx.fill(); } }
      for (let i = 0; i < 520; i++) { const x = rr.range(0, W), y = rr.range(0, H), s = rr.range(40, 140), c = rr.chance(0.5) ? '255,246,190' : '40,90,60'; const g = ctx.createRadialGradient(x, y, 0, x, y, s); g.addColorStop(0, `rgba(${c},0.10)`); g.addColorStop(1, `rgba(${c},0)`); ctx.fillStyle = g; ctx.fillRect(x - s, y - s, 2 * s, 2 * s); }
      for (let i = 0; i < 90000; i++) { ctx.fillStyle = rr.chance(0.5) ? 'rgba(255,255,210,0.10)' : 'rgba(30,70,40,0.10)'; ctx.fillRect(rr.range(0, W), rr.range(0, H), 2, 2); }
    });
  }

  // a cottage: stone plinth, cream walls with timber, a pitched roof, windows that light up, a door, a chimney
  function cottage(parent, b, rng) {
    const w = b.w / TS * U, d = b.h / TS * U, g = new THREE.Group(); g.position.set(wx(b.x) + w / 2, 0, wz(b.y) + d / 2); parent.add(g);
    const big = b.name === 'Break house', shed = b.name.includes('shed');
    const roofCol = big ? PAL.slate : shed ? PAL.thatch : ['#8a5a48', PAL.terracotta, '#5d7f6a', PAL.thatch, '#6b6f86', PAL.terracotta][(b.x / 32 + b.y / 32) % 6 | 0];
    const wallH = big ? 1.25 : 0.95, dd = d * 0.75, cz = d * 0.12;
    put(g, loft(ring(w + 0.2, dd + 0.2, 0.14), [...lip(0.05, 0.1), [0, 0, Math.PI / 2]]), PAL.stone[1], [0, 0, cz]);
    box(g, w - 0.1, wallH, dd, shed ? PAL.kraft : PAL.cream, [0, wallH / 2 + 0.08, cz], 0.08);
    if (!shed) for (const x of [-w / 2 + 0.06, w / 2 - 0.06]) box(g, 0.08, wallH, 0.08, PAL.timber, [x, wallH / 2 + 0.08, cz + dd / 2], 0.02);
    put(g, gable(dd + 0.45, big ? 0.95 : 0.75, w + 0.22), roofCol, [0, wallH + 0.04, cz], [0, Math.PI / 2, 0]);
    const fz = cz + dd / 2 + 0.01, wins = [];
    const n = Math.max(2, Math.floor(w / 0.9));
    for (let i = 0; i < n; i++) { const x = -w / 2 + (i + 0.5) * w / n; if (Math.abs(x) < 0.4) continue; wins.push(windowPane(g, 0.32, 0.32, [x, wallH * 0.62, fz], 0, PAL.timber)); }
    box(g, 0.52, 0.78, 0.06, PAL.timber, [0, 0.47, fz], 0.03);
    const doorway = lampPaint(PAL.dark, '#ffca7a'); decal(g, 0.4, 0.68, 0.04, doorway, [0, 0.42, fz + 0.035]);
    box(g, 0.4, 0.68, 0.045, big ? PAL.mustard : PAL.kraft, [0, 0.42, fz + 0.05], 0.02);
    let chimney = null;
    if (!shed) { const cx = w * 0.28, czz = cz - 0.1; box(g, 0.26, 0.7, 0.26, PAL.stone[0], [cx, wallH + 0.55, czz], 0.04); chimney = [g.position.x + cx, wallH + 0.95, g.position.z + czz]; }
    return { g, wins, doorway, chimney };
  }

  function well(parent, p) {
    const g = new THREE.Group(); g.position.set(wx(p.x), 0, wz(p.y)); parent.add(g);
    put(g, loft(ring(0.9, 0.9, 0.44, 8), [...lip(0.06, 0.38), [0, 0, Math.PI / 2]]), PAL.stone[0]);
    put(g, new THREE.CylinderGeometry(0.34, 0.34, 0.02, 24), new THREE.MeshStandardMaterial({ color: '#3d7d8f', roughness: 0.2 }), [0, 0.3, 0], null, false);
    for (const s of [-1, 1]) box(g, 0.07, 0.95, 0.07, PAL.timber, [s * 0.4, 0.75, 0], 0.02);
    put(g, gable(1.15, 0.38, 0.7), PAL.terracotta, [0, 1.18, 0]);
    put(g, new THREE.CylinderGeometry(0.06, 0.06, 0.8, 10), PAL.timber, [0, 1.0, 0], [0, 0, Math.PI / 2]);
    box(g, 0.16, 0.16, 0.16, PAL.kraft, [0.05, 0.72, 0], 0.03);
    return g;
  }
  function dummy(parent, p) {
    const g = new THREE.Group(); g.position.set(wx(p.x), 0, wz(p.y)); parent.add(g);
    put(g, new THREE.CylinderGeometry(0.05, 0.06, 1.0, 10), PAL.timber, [0, 0.5, 0]);
    put(g, new THREE.CylinderGeometry(0.035, 0.035, 0.7, 8), PAL.timber, [0, 0.72, 0], [0, 0, Math.PI / 2]);
    const sack = put(g, new THREE.SphereGeometry(0.22, 18, 12), PAL.thatch, [0, 0.72, 0]); sack.scale.set(1, 1.25, 0.9);
    put(g, new THREE.SphereGeometry(0.15, 16, 12), PAL.thatch, [0, 1.08, 0]);
    put(g, new THREE.CylinderGeometry(0.1, 0.1, 0.05, 16), PAL.mustard, [0, 0.74, 0.19], [Math.PI / 2, 0, 0]);
    return g;
  }
  function campfire(parent, p) {
    const g = new THREE.Group(); g.position.set(wx(p.x), 0, wz(p.y)); parent.add(g);
    for (let i = 0; i < 8; i++) { const a = i / 8 * 6.283; put(g, new THREE.SphereGeometry(0.09, 10, 8), PAL.stone[i % 3], [Math.cos(a) * 0.3, 0.05, Math.sin(a) * 0.3]).scale.set(1.2, 0.7, 1); }
    for (const a of [0.3, 1.9, 3.4]) put(g, new THREE.CylinderGeometry(0.04, 0.045, 0.45, 8), PAL.timber, [0, 0.08, 0], [Math.PI / 2 - 0.25, a, 0]);
    const flame = new THREE.MeshStandardMaterial({ color: '#ffb347', emissive: '#ff8a2a', emissiveIntensity: 3, roughness: 0.6 });
    const f1 = put(g, new THREE.ConeGeometry(0.13, 0.42, 12), flame, [0, 0.26, 0], null, false);
    const f2 = put(g, new THREE.ConeGeometry(0.08, 0.3, 10), new THREE.MeshStandardMaterial({ color: '#fff1b0', emissive: '#ffd26a', emissiveIntensity: 4 }), [0.03, 0.22, 0.02], null, false);
    const light = new THREE.PointLight('#ff9a4a', 3, 4, 2); light.position.set(0, 0.5, 0); g.add(light);
    return { g, f1, f2, light, flame };
  }
  function fence(parent, p) { const g = new THREE.Group(); g.position.set(wx(p.x), 0, wz(p.y)); parent.add(g); box(g, 0.07, 0.34, 0.07, PAL.cream, [0, 0.17, 0], 0.02); box(g, 0.52, 0.05, 0.04, PAL.cream, [0, 0.25, 0], 0.015); box(g, 0.52, 0.05, 0.04, PAL.cream, [0, 0.12, 0], 0.015); return g; }
  function standingStone(parent, p, i) {
    const h = (p.h / 30) * 0.9, g = new THREE.Group(); g.position.set(wx(p.x), 0, wz(p.y)); g.rotation.y = i * 0.7; parent.add(g);
    put(g, K.roundedBox(0.42, h, 0.28, 0.1, 4), PAL.stone[2], [0, h / 2 - 0.04, 0], [0, 0, (i % 2 ? 0.06 : -0.05)]);
    const rune = new THREE.MeshStandardMaterial({ color: '#2c3e50', emissive: PAL.mana, emissiveIntensity: 0, roughness: 0.6 });
    decal(g, 0.12, 0.3, 0.03, rune, [0, h * 0.55, 0.145]);
    return rune;
  }

  // instanced trees: round lollipops in the village, gumdrop firs in the Ashwood, darker ones near the circle
  function forest(parent, trees) {
    const round = trees.filter(t => !t.pine), firs = trees.filter(t => t.pine);
    const trunkG = new THREE.CylinderGeometry(0.06, 0.09, 0.6, 8); trunkG.translate(0, 0.3, 0);
    const ballG = new THREE.SphereGeometry(0.52, 18, 12); ballG.scale(1, 0.92, 1); ballG.translate(0, 0.98, 0);
    const small = new THREE.SphereGeometry(0.3, 14, 10); small.translate(0.3, 0.74, 0.22);
    const firG = new THREE.LatheGeometry([[0, 0.38], [0.4, 0.4], [0.5, 0.52], [0.47, 0.72], [0.3, 1.2], [0.1, 1.68], [0, 1.75]].map(([a, b]) => new THREE.Vector2(a, b)), 18);
    const mk = (geo, mat, n) => { const m = new THREE.InstancedMesh(geo, mat, Math.max(1, n)); m.castShadow = m.receiveShadow = true; m.count = n; parent.add(m); return m; };
    const trunks = mk(trunkG, paint(PAL.trunk), trees.length), balls = mk(ballG, paint('#ffffff'), round.length), smalls = mk(small, paint('#ffffff'), round.length), fir = mk(firG, paint('#ffffff'), firs.length);
    const c = new THREE.Color();
    trees.forEach((t, i) => K.place(trunks, i, [wx(t.x), 0, wz(t.y)], [0, t.hue * 6, 0], t.s * 0.95));
    round.forEach((t, i) => { const s = t.s * 0.95, p = [wx(t.x), 0, wz(t.y)]; K.place(balls, i, p, [0, t.hue * 6, 0], s); K.place(smalls, i, p, [0, t.hue * 6, 0], s); c.set(t.dark ? PAL.leaf[3] : PAL.leaf[t.hue < 0.33 ? 2 : 0]); balls.setColorAt(i, c); smalls.setColorAt(i, c); });
    firs.forEach((t, i) => { K.place(fir, i, [wx(t.x), 0, wz(t.y)], [0, t.hue * 6, 0], t.s); fir.setColorAt(i, c.set(t.dark ? PAL.leaf[3] : PAL.leaf[1])); });
    // cutaway: trees standing between the lens and the action sink down to stumps so the player is never hidden
    function cut(cx, cz, r = 3.2) {
      const k = (t) => { const x = wx(t.x) - cx, z = wz(t.y) - cz; if (z < -0.6) return 1; const d = Math.hypot(x * 0.8, z * 0.55); return 0.25 + 0.75 * K.smooth(r * 0.6, r, d); };
      trees.forEach((t, i) => K.place(trunks, i, [wx(t.x), 0, wz(t.y)], [0, t.hue * 6, 0], t.s * 0.95 * k(t)));
      round.forEach((t, i) => { const s = t.s * 0.95 * k(t), p = [wx(t.x), 0, wz(t.y)]; K.place(balls, i, p, [0, t.hue * 6, 0], s); K.place(smalls, i, p, [0, t.hue * 6, 0], s); });
      firs.forEach((t, i) => K.place(fir, i, [wx(t.x), 0, wz(t.y)], [0, t.hue * 6, 0], t.s * k(t)));
      trunks.instanceMatrix.needsUpdate = balls.instanceMatrix.needsUpdate = smalls.instanceMatrix.needsUpdate = fir.instanceMatrix.needsUpdate = true;
    }
    return { trunks, balls, smalls, fir, round, firs, cut };
  }
  function herbs(parent, list) {
    const m = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 10, 8), paint('#ffffff', 0.8), Math.max(1, list.length * 5)); m.castShadow = m.receiveShadow = true; parent.add(m);
    const rr = K.rng(5), cols = ['#e8f0ff', '#9a5fc8', '#f0b040'];
    list.forEach((h, j) => { for (let i = 0; i < 5; i++) { const a = rr.range(0, 6.3), d = rr.range(0.02, 0.16), s = rr.range(0.04, 0.06); K.place(m, j * 5 + i, [wx(h.x) + Math.cos(a) * d, s * 0.7, wz(h.y) + Math.sin(a) * d], null, [s, s * 0.7, s]); m.setColorAt(j * 5 + i, new THREE.Color(cols[h.k])); } });
    return m;
  }

  // characters ------------------------------------------------------
  // Kayden: a small peg in the accent red (the one thing the story follows), dark hair, a wooden sword
  function hero(parent) {
    const p = peg(parent, PAL.accent, 'hair'); p.scale.setScalar(0.85);
    const sword = new THREE.Group(); sword.position.set(0.12, 0.3, 0); p.add(sword);
    box(sword, 0.05, 0.42, 0.03, PAL.kraft, [0, 0.12, 0], 0.012); box(sword, 0.16, 0.035, 0.04, PAL.timber, [0, -0.08, 0], 0.01);
    return { g: p, sword };
  }
  function villager(parent, col, hat, scale = 1) { const p = peg(parent, col, hat); p.scale.setScalar(scale); return p; }
  function slime(parent) {
    const g = new THREE.Group(); parent.add(g);
    const mat = new THREE.MeshPhysicalMaterial({ color: PAL.slime, roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.15 });
    const body = put(g, new THREE.SphereGeometry(0.3, 24, 16, 0, 6.283, 0, Math.PI * 0.62), mat, [0, 0, 0]); body.scale.set(1, 0.9, 1);
    for (const s of [-1, 1]) { put(g, new THREE.SphereGeometry(0.06, 12, 8), '#ffffff', [s * 0.1, 0.18, 0.22]); put(g, new THREE.SphereGeometry(0.032, 10, 8), PAL.dark, [s * 0.1, 0.18, 0.27]); }
    return { g, body };
  }
  function wolf(parent, boss) {
    const g = new THREE.Group(), body = new THREE.Group(); parent.add(g); g.add(body);
    const col = boss ? '#4b4c57' : PAL.wolf, light = boss ? '#8a8b96' : '#b9bac4';
    box(body, 0.9, 0.38, 0.4, col, [0, 0.5, 0], 0.16);
    box(body, 0.42, 0.34, 0.34, col, [0.55, 0.68, 0], 0.13); box(body, 0.22, 0.16, 0.2, light, [0.82, 0.62, 0], 0.06);
    const eyeMat = boss ? new THREE.MeshStandardMaterial({ color: '#ff5a4a', emissive: '#ff3a2a', emissiveIntensity: 2.5 }) : PAL.dark;
    for (const s of [-1, 1]) { put(body, new THREE.ConeGeometry(0.07, 0.18, 8), col, [0.5, 0.93, s * 0.1]); put(body, new THREE.SphereGeometry(0.035, 10, 8), eyeMat, [0.74, 0.74, s * 0.1]); }
    const legs = [];
    for (const [x, z] of [[0.3, 0.14], [0.3, -0.14], [-0.3, 0.14], [-0.3, -0.14]]) { const l = new THREE.Group(); l.position.set(x, 0.42, z); body.add(l); box(l, 0.11, 0.42, 0.11, col, [0, -0.2, 0], 0.04); legs.push(l); }
    const tail = put(body, new THREE.CylinderGeometry(0.06, 0.1, 0.42, 10), col, [-0.55, 0.62, 0], [0, 0, 1.0]);
    if (boss) { g.scale.setScalar(1.2); box(body, 0.5, 0.18, 0.44, '#2d2e36', [0.15, 0.72, 0], 0.08); }
    return { g, body, legs, tail };
  }

  window.AetherDiorama = { PAL, FONT, U, MW, MD, wx, wz, groundTexture, cottage, well, dummy, campfire, fence, standingStone, forest, herbs, hero, villager, slime, wolf, helpers: { ring, loft, lip, prism, paint, lampPaint, put, box, decal, tile, ribbon, gable, windowPane, peg, tree, sign, puffs, trap, hop } };
})();
