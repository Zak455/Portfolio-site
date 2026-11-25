// Aetherbound: Thornwick and the Ashwood. Tile map, props, collision and drawing.
(function () {
  const T = AB.TILE;
  const W = 92, H = 64;
  const G = 0, PATH = 1, WATER = 2, BRIDGE = 3, FIELD = 4, FOREST = 5, STONE = 6, BANK = 7, YARD = 8, GARDEN = 9;

  // Seeded RNG so the world is the same every time.
  function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

  const world = { W, H, tiles: new Uint8Array(W * H), trees: [], buildings: [], props: [], herbs: [], deadTrees: [], tracks: [], colliders: [] };
  world.CIRCLE = { x: 77 * T, y: 45 * T, r: 5.5 * T };
  world.HOME = { x: 21.5 * T, y: 15.6 * T };

  const idx = (x, y) => y * W + x;
  const setT = (x, y, v) => { if (x >= 0 && y >= 0 && x < W && y < H) world.tiles[idx(x, y)] = v; };
  world.tileAt = (x, y) => (x < 0 || y < 0 || x >= W || y >= H) ? -1 : world.tiles[idx(x, y)];
  function riverX(y) { return 45 + Math.sin(y * 0.18) * 1.6 + Math.sin(y * 0.05 + 1) * 1.2; }
  world.riverX = riverX;

  function line(points, half, v, under) {
    for (let i = 0; i < points.length - 1; i++) {
      const [x0, y0] = points[i], [x1, y1] = points[i + 1];
      const n = Math.ceil(Math.hypot(x1 - x0, y1 - y0) * 2);
      for (let k = 0; k <= n; k++) {
        const px = x0 + (x1 - x0) * k / n, py = y0 + (y1 - y0) * k / n;
        for (let dy = -half; dy <= half; dy++) for (let dx = -half; dx <= half; dx++) {
          const tx = Math.round(px + dx), ty = Math.round(py + dy);
          const cur = world.tileAt(tx, ty);
          if (cur === -1) continue;
          if (under && cur === WATER) continue;
          setT(tx, ty, v);
        }
      }
    }
  }

  function build() {
    const r = rng(2026);
    // Base: village grass west of the river, forest floor east of it.
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) setT(x, y, x > riverX(y) + 3 ? FOREST : G);
    // River with banks.
    for (let y = 0; y < H; y++) {
      const rx = riverX(y);
      for (let x = Math.floor(rx - 3); x <= Math.ceil(rx + 3); x++) {
        const d = Math.abs(x - rx);
        if (d < 1.6) setT(x, y, WATER); else if (d < 2.6) setT(x, y, BANK);
      }
    }
    // Fields, yard, garden.
    for (let y = 31; y < 40; y++) for (let x = 8; x < 16; x++) setT(x, y, FIELD);
    for (let y = 22; y < 28; y++) for (let x = 13; x < 19; x++) setT(x, y, YARD);
    for (let y = 16; y < 20; y++) for (let x = 22; x < 27; x++) setT(x, y, GARDEN);
    // Paths.
    line([[6, 21], [20, 21], [36, 21], [42, 21]], 0, PATH);
    line([[21, 14], [21, 21], [21, 31]], 0, PATH);
    line([[21, 25], [18, 25]], 0, PATH);
    line([[29, 20], [29, 21]], 0, PATH);
    line([[33, 13], [33, 21]], 0, PATH);
    line([[28, 21], [28, 26], [30, 26]], 0, PATH);
    // Bridge.
    for (let x = Math.floor(riverX(21) - 3); x <= Math.ceil(riverX(21) + 3); x++) for (let y = 20; y <= 22; y++) setT(x, y, BRIDGE);
    // Forest trail to the stone circle.
    line([[48, 21], [55, 22], [60, 27], [64, 33], [70, 38], [74, 43]], 0, PATH, true);
    // Stone circle clearing.
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const d = Math.hypot(x + 0.5 - world.CIRCLE.x / T, y + 0.5 - world.CIRCLE.y / T);
      if (d < 5.6) setT(x, y, STONE);
    }

    // Buildings (tile rects; door at bottom centre).
    const B = (x, y, w, h, roof, name) => world.buildings.push({ x: x * T, y: y * T, w: w * T, h: h * T, roof, name });
    B(18, 10, 7, 4, '#5d2a26', 'Break house');
    B(30, 10, 5, 3, '#4b3a2a', "Hesk's shed");
    B(27, 17, 4, 3, '#5a4630', 'Mill house');
    B(11, 16, 4, 3, '#4a3d33', 'House');
    B(35, 23, 4, 3, '#4f3330', 'House');
    B(11, 27, 4, 3, '#43392d', 'House');
    B(36, 14, 4, 3, '#55372b', 'House');
    world.buildings.forEach(b => world.colliders.push({ type: 'rect', x: b.x + 4, y: b.y + 18, w: b.w - 8, h: b.h - 18 }));

    // Props.
    const P = (type, tx, ty, extra) => { const p = Object.assign({ type, x: tx * T, y: ty * T }, extra || {}); world.props.push(p); return p; };
    world.well = P('well', 27.5, 23.5, { r: 14 });
    world.dummy = P('dummy', 17.5, 24.5, { r: 10, hp: 9999, hitFlash: 0 });
    world.campfire = P('campfire', 31.5, 26.2, { r: 10 });
    world.props.filter(p => p.r).forEach(p => world.colliders.push({ type: 'circle', x: p.x, y: p.y, r: p.r }));
    // Fences around the field.
    for (let x = 8; x < 16; x++) { P('fence', x + 0.5, 30.6); P('fence', x + 0.5, 40.3); }
    // Standing stones.
    for (let i = 0; i < 9; i++) {
      const a = i / 9 * Math.PI * 2;
      const s = P('stone', world.CIRCLE.x / T + Math.cos(a) * 4.6, world.CIRCLE.y / T + Math.sin(a) * 4.0, { r: 12, h: 30 + (i % 3) * 8 });
      world.colliders.push({ type: 'circle', x: s.x, y: s.y, r: 11 });
    }

    // Trees. Dense border + forest, sparse in village.
    const blocked = (x, y) => {
      const t = world.tileAt(x, y);
      if (t !== G && t !== FOREST) return true;
      for (const b of world.buildings) if (x * T > b.x - 40 && x * T < b.x + b.w + 40 && y * T > b.y - 50 && y * T < b.y + b.h + 50) return true;
      for (const p of world.props) if (Math.hypot(p.x - x * T, p.y - y * T) < 64) return true;
      // Keep trails wide open.
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (world.tileAt(x + dx, y + dy) === PATH || world.tileAt(x + dx, y + dy) === BRIDGE) return true;
      return false;
    };
    for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
      const border = x < 6 || y < 7 || x > W - 4 || y > H - 5;
      const forest = world.tileAt(x, y) === FOREST;
      const village = !forest && !border;
      let p = border ? 0.55 : forest ? (x > 62 ? 0.3 : 0.17) : 0.015;
      if (village && (x > 39 && x < 43)) p = 0.05;
      if (r() < p && !blocked(x, y)) {
        const tx = (x + 0.2 + r() * 0.6) * T, ty = (y + 0.2 + r() * 0.6) * T;
        const pine = forest && r() < 0.55;
        world.trees.push({ x: tx, y: ty, s: 0.8 + r() * 0.5, pine, dark: forest && x > 62, hue: r() });
      }
    }
    world.trees.forEach(t => world.colliders.push({ type: 'circle', x: t.x, y: t.y, r: 9 * t.s }));

    // Dead trees to chop (marked in red by the Ledger).
    const deadSpots = [[51, 13], [53, 17], [56, 12], [50, 30], [8, 13], [9, 24], [40, 30], [58, 18]];
    deadSpots.forEach(([x, y]) => {
      const d = { x: (x + 0.5) * T, y: (y + 0.5) * T, hp: 3, alive: true };
      world.deadTrees.push(d);
      world.colliders.push({ type: 'circle', x: d.x, y: d.y, r: 9, dead: d });
    });

    // Herbs, berries and mushrooms.
    const kinds = ['Silverleaf', 'Duskberry', 'Bellcap'];
    let tries = 0;
    while (world.herbs.length < 34 && tries++ < 3000) {
      const x = 7 + Math.floor(r() * (W - 12)), y = 8 + Math.floor(r() * (H - 14));
      const t = world.tileAt(x, y);
      if (t !== G && t !== FOREST) continue;
      if (t === G && !(x < 10 || y > 33 || x > 38 || y < 10)) continue; // village: only outskirts
      const hx = (x + 0.5) * T, hy = (y + 0.5) * T;
      if (world.trees.some(tr => Math.hypot(tr.x - hx, tr.y - hy) < 24)) continue;
      world.herbs.push({ x: hx, y: hy, kind: kinds[world.herbs.length % 3], k: world.herbs.length % 3, alive: true, regrow: 0 });
    }

    // Wolf tracks along the trail (revealed by Tracking).
    const trail = [[49, 21], [55, 22], [60, 27], [64, 33], [70, 38], [74, 43]];
    for (let i = 0; i < trail.length - 1; i++) {
      const [x0, y0] = trail[i], [x1, y1] = trail[i + 1];
      const n = Math.ceil(Math.hypot(x1 - x0, y1 - y0) * 1.5);
      for (let k = 0; k < n; k++) {
        const px = (x0 + (x1 - x0) * k / n + 0.5) * T, py = (y0 + (y1 - y0) * k / n + 0.5) * T;
        world.tracks.push({ x: px + (k % 2 ? 6 : -6), y: py, a: Math.atan2(y1 - y0, x1 - x0), seen: false });
      }
    }
  }

  // Solid check for a circle at (x, y).
  world.solidAt = function (x, y, rad) {
    const tx = Math.floor(x / T), ty = Math.floor(y / T);
    const t = world.tileAt(tx, ty);
    if (t === -1 || t === WATER) return true;
    for (const c of world.near(x, y)) {
      if (c.dead && !c.dead.alive) continue;
      if (c.type === 'circle') { if (Math.hypot(c.x - x, c.y - y) < c.r + rad) return true; }
      else if (x + rad > c.x && x - rad < c.x + c.w && y + rad > c.y && y - rad < c.y + c.h) return true;
    }
    return false;
  };
  world.inWater = (x, y) => world.tileAt(Math.floor(x / T), Math.floor(y / T)) === WATER;

  // Bucket colliders for speed.
  let buckets = null;
  const BS = 4 * T;
  function bucketize() {
    buckets = new Map();
    for (const c of world.colliders) {
      const x0 = c.type === 'rect' ? c.x : c.x - c.r, y0 = c.type === 'rect' ? c.y : c.y - c.r;
      const x1 = c.type === 'rect' ? c.x + c.w : c.x + c.r, y1 = c.type === 'rect' ? c.y + c.h : c.y + c.r;
      for (let by = Math.floor(y0 / BS); by <= Math.floor(y1 / BS); by++) for (let bx = Math.floor(x0 / BS); bx <= Math.floor(x1 / BS); bx++) {
        const k = bx + ',' + by; if (!buckets.has(k)) buckets.set(k, []); buckets.get(k).push(c);
      }
    }
  }
  world.near = function (x, y) {
    const out = [];
    const bx = Math.floor(x / BS), by = Math.floor(y / BS);
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const b = buckets.get((bx + dx) + ',' + (by + dy)); if (b) out.push(...b); }
    return out;
  };

  // How deep into the Ashwood (0 village .. 1 stone circle). Drives darkness.
  world.depth = function (x) { return Math.max(0, Math.min(1, (x / T - 50) / 26)); };

  // ---------- Drawing ----------
  let ground = null;
  function noise2(x, y) { const s = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453; return s - Math.floor(s); }
  const pal = {
    [G]: ['#2d3c24', '#2e3d25', '#2f3e26'], [FOREST]: ['#1c271a', '#1d281b', '#1e291c'], [PATH]: ['#4a3d2c', '#4c3f2d', '#493c2b'],
    [WATER]: ['#1c3340', '#1f3846', '#1a2f3b'], [BRIDGE]: ['#5b4632', '#634c36', '#56422f'], [FIELD]: ['#3b3122', '#41361f', '#3a3020'],
    [STONE]: ['#33322f', '#383733', '#2f2e2b'], [BANK]: ['#3a3a2a', '#3e3d2c', '#363627'], [YARD]: ['#4b402f', '#4f4431', '#473c2c'],
    [GARDEN]: ['#3a2f22', '#3e3324', '#362c20'],
  };
  function renderGround() {
    ground = document.createElement('canvas');
    ground.width = W * T; ground.height = H * T;
    const g = ground.getContext('2d');
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const t = world.tileAt(x, y);
      const c = pal[t] || pal[G];
      g.fillStyle = c[Math.floor(noise2(x, y) * 3)];
      g.fillRect(x * T, y * T, T, T);
      // Texture flecks.
      for (let i = 0; i < 6; i++) {
        const n = noise2(x * 7 + i, y * 3 - i);
        const px = x * T + noise2(x + i, y) * T, py = y * T + n * T;
        if (t === G || t === FOREST) { g.strokeStyle = t === G ? 'rgba(90,120,60,0.35)' : 'rgba(60,85,50,0.35)'; g.beginPath(); g.moveTo(px, py); g.lineTo(px + 1.5, py - 4); g.stroke(); }
        else if (t === PATH || t === YARD) { g.fillStyle = 'rgba(0,0,0,0.18)'; g.fillRect(px, py, 2, 2); }
        else if (t === WATER) { g.fillStyle = 'rgba(120,170,200,0.12)'; g.fillRect(px, py, 6, 1); }
        else if (t === FIELD) { g.fillStyle = i % 2 ? '#6a7d34' : '#55662a'; g.fillRect(x * T + i * 5 + 2, y * T + 6 + (i % 3) * 8, 2, 6); }
        else if (t === BRIDGE) { g.fillStyle = 'rgba(0,0,0,0.25)'; g.fillRect(x * T + (i * 6), y * T, 1, T); }
        else if (t === STONE) { g.fillStyle = 'rgba(255,255,255,0.04)'; g.fillRect(px, py, 3, 3); }
        else if (t === GARDEN) { g.fillStyle = i % 2 ? '#4c6b2e' : '#7a5a8a'; g.beginPath(); g.arc(x * T + 5 + i * 4, y * T + 8 + (i % 2) * 12, 2.5, 0, 7); g.fill(); }
      }
    }
    // Low-frequency colour patches so the grass doesn't read as a grid.
    for (let i = 0; i < 900; i++) {
      const x = noise2(i, 1) * W * T, y = noise2(1, i) * H * T, t = world.tileAt(Math.floor(x / T), Math.floor(y / T));
      if (t !== G && t !== FOREST) continue;
      const r = 30 + noise2(i, i) * 70;
      const gr = g.createRadialGradient(x, y, 0, x, y, r);
      const c = i % 3 === 0 ? 'rgba(70,90,40,0.18)' : i % 3 === 1 ? 'rgba(10,20,10,0.22)' : 'rgba(90,80,40,0.12)';
      gr.addColorStop(0, c); gr.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2);
    }
    // Soft edges between water and bank.
    g.globalAlpha = 0.25;
    for (let y = 0; y < H; y++) { const rx = riverX(y) * T; g.fillStyle = '#9ab'; g.fillRect(rx - 1.6 * T, y * T, 2, T); g.fillRect(rx + 1.6 * T - 2, y * T, 2, T); }
    g.globalAlpha = 1;
    // Stone circle rune ring.
    g.strokeStyle = 'rgba(200,50,60,0.25)'; g.lineWidth = 2;
    g.beginPath(); g.ellipse(world.CIRCLE.x, world.CIRCLE.y, 3.2 * T, 2.8 * T, 0, 0, 7); g.stroke();
  }

  world.buildMinimap = function () {
    const m = document.createElement('canvas'); m.width = W; m.height = H;
    const g = m.getContext('2d');
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { g.fillStyle = pal[world.tileAt(x, y)][1]; g.fillRect(x, y, 1, 1); }
    g.fillStyle = 'rgba(10,14,10,0.55)'; world.trees.forEach(t => g.fillRect(t.x / T, t.y / T, 1, 1));
    g.fillStyle = '#8a5a3a'; world.buildings.forEach(b => g.fillRect(b.x / T, b.y / T, b.w / T, b.h / T));
    world.minimap = m;
  };

  world.drawGround = function (ctx, cam, vw, vh, t) {
    ctx.drawImage(ground, cam.x, cam.y, vw, vh, 0, 0, vw, vh);
    // Water shimmer.
    ctx.save();
    ctx.translate(-cam.x, -cam.y);
    ctx.strokeStyle = 'rgba(160,200,220,0.12)'; ctx.lineWidth = 1;
    const y0 = Math.floor(cam.y / T), y1 = Math.ceil((cam.y + vh) / T);
    for (let y = y0; y <= y1; y++) {
      const rx = riverX(y) * T;
      if (rx < cam.x - 80 || rx > cam.x + vw + 80) continue;
      for (let k = 0; k < 2; k++) {
        const ox = Math.sin(t * 1.3 + y + k * 2) * 14;
        ctx.beginPath(); ctx.moveTo(rx - 20 + ox, y * T + k * 16 + 6); ctx.lineTo(rx - 6 + ox, y * T + k * 16 + 6); ctx.stroke();
      }
    }
    ctx.restore();
  };

  // Objects that are y-sorted with characters.
  world.sortables = function (cam, vw, vh) {
    const out = [];
    const inView = (x, y, m) => x > cam.x - m && x < cam.x + vw + m && y > cam.y - m && y < cam.y + vh + m + 40;
    for (const tr of world.trees) if (inView(tr.x, tr.y, 70)) out.push({ y: tr.y, draw: drawTree, o: tr });
    for (const b of world.buildings) if (inView(b.x + b.w / 2, b.y + b.h, b.w)) out.push({ y: b.y + b.h, draw: drawBuilding, o: b });
    for (const p of world.props) if (inView(p.x, p.y, 40)) out.push({ y: p.y, draw: drawProp, o: p });
    for (const d of world.deadTrees) if (d.alive && inView(d.x, d.y, 50)) out.push({ y: d.y, draw: drawDead, o: d });
    return out;
  };

  function drawTree(ctx, tr, st) {
    const s = tr.s, x = tr.x, y = tr.y;
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath(); ctx.ellipse(x + 4, y + 2, 16 * s, 7 * s, 0, 0, 7); ctx.fill();
    ctx.fillStyle = '#2a1d14'; ctx.fillRect(x - 3 * s, y - 14 * s, 6 * s, 15 * s);
    const fade = st.fadeNear && Math.hypot(st.px - x, st.py - (y - 24 * s)) < 34 * s ? 0.45 : 1;
    ctx.globalAlpha = fade;
    if (tr.pine) {
      const c1 = tr.dark ? '#0d1710' : '#13241a', c2 = tr.dark ? '#14211a' : '#1c3324';
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = i % 2 ? c2 : c1;
        ctx.beginPath(); ctx.moveTo(x, y - (52 - i * 10) * s); ctx.lineTo(x - (18 - i * 2) * s + i * 2, y - (16 + i * 4) * s); ctx.lineTo(x + (18 - i * 2) * s - i * 2, y - (16 + i * 4) * s); ctx.closePath(); ctx.fill();
      }
    } else {
      const base = tr.dark ? ['#101a10', '#16241a'] : (tr.hue > 0.7 ? ['#2c3a1a', '#3a4a22'] : ['#1a2d17', '#24391f']);
      ctx.fillStyle = base[0]; ctx.beginPath(); ctx.arc(x, y - 26 * s, 20 * s, 0, 7); ctx.fill();
      ctx.fillStyle = base[1]; ctx.beginPath(); ctx.arc(x - 5 * s, y - 31 * s, 13 * s, 0, 7); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.04)'; ctx.beginPath(); ctx.arc(x - 8 * s, y - 35 * s, 6 * s, 0, 7); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function drawDead(ctx, d, st) {
    const x = d.x, y = d.y;
    ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.ellipse(x + 3, y + 2, 12, 5, 0, 0, 7); ctx.fill();
    ctx.strokeStyle = '#4a3a2c'; ctx.lineWidth = 5; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - 34); ctx.moveTo(x, y - 20); ctx.lineTo(x - 12, y - 32); ctx.moveTo(x, y - 26); ctx.lineTo(x + 10, y - 38); ctx.stroke();
    ctx.lineCap = 'butt';
    if (st.ledgerMarks) { ctx.strokeStyle = 'rgba(200,50,60,0.8)'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]); ctx.strokeRect(x - 16, y - 44, 32, 48); ctx.setLineDash([]); }
    if (d.shake > 0) d.shake -= 1;
  }

  function drawBuilding(ctx, b) {
    const { x, y, w, h } = b;
    ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(x + 6, y + h - 4, w, 10);
    // Walls.
    ctx.fillStyle = '#5a4838'; ctx.fillRect(x, y + h * 0.45, w, h * 0.55);
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    for (let i = 0; i < w; i += 16) ctx.fillRect(x + i, y + h * 0.45, 1, h * 0.55);
    ctx.fillStyle = '#3a2c20'; ctx.fillRect(x, y + h * 0.45, 4, h * 0.55); ctx.fillRect(x + w - 4, y + h * 0.45, 4, h * 0.55);
    // Door and windows.
    ctx.fillStyle = '#1a1410'; ctx.fillRect(x + w / 2 - 9, y + h - 26, 18, 26);
    ctx.fillStyle = 'rgba(255,190,110,0.75)';
    ctx.fillRect(x + 12, y + h - 24, 12, 10); ctx.fillRect(x + w - 24, y + h - 24, 12, 10);
    // Roof.
    ctx.fillStyle = b.roof; ctx.beginPath(); ctx.moveTo(x - 8, y + h * 0.5); ctx.lineTo(x + w / 2, y - 10); ctx.lineTo(x + w + 8, y + h * 0.5); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.lineWidth = 1;
    for (let i = 1; i < 5; i++) { const yy = y - 10 + (h * 0.5 + 10) * i / 5; const dx = (w / 2 + 8) * i / 5; ctx.beginPath(); ctx.moveTo(x + w / 2 - dx, yy); ctx.lineTo(x + w / 2 + dx, yy); ctx.stroke(); }
    ctx.fillStyle = 'rgba(255,255,255,0.06)'; ctx.beginPath(); ctx.moveTo(x + w / 2, y - 10); ctx.lineTo(x - 8, y + h * 0.5); ctx.lineTo(x + w / 2 - 6, y + h * 0.5); ctx.closePath(); ctx.fill();
  }

  function drawProp(ctx, p, st) {
    const { x, y } = p;
    if (p.type === 'well') {
      ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.ellipse(x + 3, y + 4, 18, 8, 0, 0, 7); ctx.fill();
      ctx.fillStyle = '#55544e'; ctx.beginPath(); ctx.ellipse(x, y, 16, 10, 0, 0, 7); ctx.fill();
      ctx.fillStyle = st.wellClean ? '#2a5a70' : '#3c4a2a'; ctx.beginPath(); ctx.ellipse(x, y - 1, 10, 6, 0, 0, 7); ctx.fill();
      ctx.strokeStyle = '#3a2c20'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x - 14, y); ctx.lineTo(x - 14, y - 28); ctx.lineTo(x + 14, y - 28); ctx.lineTo(x + 14, y); ctx.stroke();
      ctx.fillStyle = '#5d2a26'; ctx.beginPath(); ctx.moveTo(x - 20, y - 26); ctx.lineTo(x, y - 40); ctx.lineTo(x + 20, y - 26); ctx.closePath(); ctx.fill();
    } else if (p.type === 'dummy') {
      ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.ellipse(x + 2, y + 3, 10, 4, 0, 0, 7); ctx.fill();
      ctx.fillStyle = '#4a3a2c'; ctx.fillRect(x - 2, y - 30, 4, 30); ctx.fillRect(x - 12, y - 24, 24, 4);
      ctx.fillStyle = p.hitFlash > 0 ? '#e8e1d3' : '#b09060'; ctx.beginPath(); ctx.ellipse(x, y - 18, 8, 11, 0, 0, 7); ctx.fill();
      ctx.beginPath(); ctx.arc(x, y - 34, 6, 0, 7); ctx.fill();
      if (p.hitFlash > 0) p.hitFlash -= 1;
    } else if (p.type === 'campfire') {
      ctx.fillStyle = '#3a2c20'; ctx.fillRect(x - 10, y - 2, 20, 4);
      const f = 6 + Math.sin(st.t * 12) * 1.5;
      ctx.fillStyle = '#ff8c2a'; ctx.beginPath(); ctx.moveTo(x - 6, y); ctx.quadraticCurveTo(x, y - f * 3, x + 6, y); ctx.fill();
      ctx.fillStyle = '#ffe08a'; ctx.beginPath(); ctx.moveTo(x - 3, y); ctx.quadraticCurveTo(x, y - f * 1.6, x + 3, y); ctx.fill();
    } else if (p.type === 'fence') {
      ctx.fillStyle = '#4a3a2c'; ctx.fillRect(x - 16, y - 10, 32, 3); ctx.fillRect(x - 16, y - 4, 32, 3); ctx.fillRect(x - 2, y - 14, 4, 14);
    } else if (p.type === 'stone') {
      ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.ellipse(x + 3, y + 2, 12, 5, 0, 0, 7); ctx.fill();
      ctx.fillStyle = '#5a5852'; ctx.fillRect(x - 8, y - p.h, 16, p.h);
      ctx.fillStyle = '#6a6862'; ctx.fillRect(x - 8, y - p.h, 5, p.h);
      ctx.fillStyle = `rgba(200,50,60,${0.35 + Math.sin(st.t * 2 + x) * 0.25})`; ctx.fillRect(x - 2, y - p.h + 8, 4, 8);
    }
  }

  world.drawHerbs = function (ctx, st) {
    for (const h of world.herbs) {
      if (!h.alive) continue;
      const { x, y } = h;
      if (x < st.cam.x - 30 || x > st.cam.x + st.vw + 30 || y < st.cam.y - 30 || y > st.cam.y + st.vh + 30) continue;
      const glow = 0.25 + Math.sin(st.t * 3 + x) * 0.15;
      ctx.fillStyle = `rgba(232,225,211,${glow * 0.5})`; ctx.beginPath(); ctx.arc(x, y - 4, 12, 0, 7); ctx.fill();
      if (h.k === 0) { ctx.fillStyle = '#b8c8b0'; for (let i = 0; i < 5; i++) { const a = i / 5 * 6.28; ctx.beginPath(); ctx.ellipse(x + Math.cos(a) * 4, y - 4 + Math.sin(a) * 3, 4, 2, a, 0, 7); ctx.fill(); } }
      else if (h.k === 1) { ctx.fillStyle = '#2a4a22'; ctx.beginPath(); ctx.arc(x, y - 3, 7, 0, 7); ctx.fill(); ctx.fillStyle = '#6a2a6a'; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(x - 3 + (i % 2) * 6, y - 6 + (i > 1 ? 5 : 0), 2.2, 0, 7); ctx.fill(); } }
      else { ctx.fillStyle = '#d8cfb0'; ctx.fillRect(x - 1.5, y - 6, 3, 6); ctx.fillStyle = '#9a3a2a'; ctx.beginPath(); ctx.ellipse(x, y - 7, 6, 4, 0, Math.PI, 0); ctx.fill(); }
    }
  };

  world.drawTracks = function (ctx, st) {
    if (!st.tracksVisible) return;
    for (const tr of world.tracks) {
      if (Math.abs(tr.x - st.px) > st.vw || Math.abs(tr.y - st.py) > st.vh) continue;
      ctx.save(); ctx.translate(tr.x, tr.y); ctx.rotate(tr.a + Math.PI / 2);
      ctx.fillStyle = tr.seen ? 'rgba(200,50,60,0.35)' : 'rgba(220,70,80,0.75)';
      ctx.beginPath(); ctx.ellipse(0, 0, 3, 4, 0, 0, 7); ctx.fill();
      for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.arc(i * 3, -5, 1.4, 0, 7); ctx.fill(); }
      ctx.restore();
    }
  };

  world.init = function () { build(); bucketize(); renderGround(); world.buildMinimap(); };
  AB.World = world;
})();
