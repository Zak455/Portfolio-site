// Aetherbound: the 3D view. Thornwick and the Ashwood as one floating model tile in the "Tiny Diorama" look
// (STAGE kit + three.js). The game logic still runs in 2D pixel space; this file mirrors it into the model each frame.
(function () {
  const R = { ok: false, mode: 'off' };
  AB.R3 = R;
  const T = AB.TILE;
  let A, H, PAL, wx, wz, THREE, K;
  let S = null, cv = null, building = false, lastAspect = 0;
  let waterU = null, bridgeAt = null;
  // height of the walking surface under a game-pixel position: the arched bridge deck, else the ground
  function deckY(px, py) {
    if (!bridgeAt) return 0;
    const dx = wx(px) - bridgeAt[0], dz = wz(py) - bridgeAt[1];
    if (Math.abs(dz) > 0.8 || Math.abs(dx) > 1.8) return 0;
    const top = 0.2 + 0.1 * Math.cos(Math.max(-1, Math.min(1, dx / 1.5)) * 1.4);
    return Math.abs(dx) <= 1.5 ? top : top * (1 - (Math.abs(dx) - 1.5) / 0.3);
  }
  const waterMirror = { tMirror: { value: null }, uMirrorMatrix: { value: null } }; // matrix is created once THREE is loaded
  let scene, camera, land, sun, sky, paper, woods, houses = [], runes = [], fire, wellWater, smoke, waterTex, herbMesh, herbSig = '', deadGroups = [], trackMesh, tilt, kay, npcs = new Map(), foes = new Map(), bolts = [], boltLight, glow, cards = [], cardQueue = [];
  const cam = { x: 0, z: 0, init: false };
  let lastCut = { x: 1e9, z: 1e9 };

  // ---------------------------------------------------------------- boot
  R.init = function () {
    try {
      THREE = window.THREE; K = window.K; A = window.AetherDiorama;
      if (!THREE || !K || !A) return false;
      const test = document.createElement('canvas');
      if (!(test.getContext('webgl2') || test.getContext('webgl'))) return false;
      ({ PAL, wx, wz } = A); H = A.helpers;
      build();
      addEventListener('resize', () => { clearTimeout(R._rt); R._rt = setTimeout(() => { const a = innerWidth / innerHeight; if (Math.abs(a - lastAspect) / lastAspect > 0.12) build(); }, 350); });
      hookLog();
      R.ok = true;
    } catch (e) { console.warn('3D view unavailable', e); R.ok = false; }
    return R.ok;
  };

  function size() {
    const mobile = Math.min(innerWidth, innerHeight) < 600;
    const budget = mobile ? 0.9e6 : 1.6e6, dpr = Math.min(1.5, devicePixelRatio || 1);
    let w = innerWidth * dpr, h = innerHeight * dpr; const k = Math.min(1, Math.sqrt(budget / (w * h)));
    return [Math.max(320, Math.round(w * k)), Math.max(240, Math.round(h * k))];
  }

  function build() {
    if (building) return; building = true;
    const old = cv; cv = document.createElement('canvas'); cv.id = 'gl'; cv.setAttribute('aria-hidden', 'true');
    const game = document.getElementById('game'); game.parentNode.insertBefore(cv, game);
    if (old) { try { S && S.renderer.dispose(); S && S.renderer.forceContextLoss(); } catch (e) {} old.remove(); }
    npcs.clear(); foes.clear(); bolts = []; cards = []; houses = []; runes = []; deadGroups = []; herbSig = ''; lastCut = { x: 1e9, z: 1e9 };
    const [w, h] = size(); lastAspect = innerWidth / innerHeight;
    const style = {
      id: 'aetherbound-live', duration: 1e9, fonts: [A.FONT],
      render: { samples: 1, shutter: 0, tone: 'neutral', exposure: 1.0, bloom: 0.3, bloomThreshold: 1.05, vignette: 0.22, grain: 0.0, saturation: 1.08, contrast: 1.03, fov: 20, near: 1, far: 400, background: PAL.backdrop },
    };
    S = K.createStage(cv, style, { samples: 1, width: w, height: h });
    scene = S.scene; camera = S.camera;
    makeWorld();
    S.setApi({ update() {} });
    tilt = S.addFilter(`uniform float focus, amt;
      void main(){
        float d = abs(vUv.y - focus);
        float r = amt * smoothstep(0.07, 0.48, d) * 9.0 * res.y / 900.0;
        vec3 c = texture2D(tex, vUv).rgb;
        if (r < 0.35) { gl_FragColor = vec4(c, 1.0); return; }
        vec3 acc = c; float wt = 1.0;
        for (int i = 0; i < 18; i++) { float a = float(i) * 2.39996; float rr = sqrt((float(i) + 0.5) / 18.0) * r; acc += texture2D(tex, vUv + vec2(cos(a), sin(a)) * rr / res).rgb; wt += 1.0; }
        gl_FragColor = vec4(acc / wt, 1.0);
      }`, { focus: { value: 0.5 }, amt: { value: 1 } });
    building = false;
  }

  // ---------------------------------------------------------------- the model
  function makeWorld() {
    const Wd = AB.World;
    K.env(S, { top: '#c4dcf2', horizon: '#f2e8da', bottom: '#9db39a', intensity: 0.4 });
    sun = K.sun(S, { pos: [-9, 13, 9], color: '#ffe3c0', power: 3.3, size: 12, mapSize: 2048, far: 120 });
    sky = K.skyLight(S, { color: '#bcd3ff', power: 0.95, size: 12, center: [0, 0, 0], mapSize: 1024, dist: 40 });
    const FLOOR = -4;
    paper = new THREE.MeshBasicMaterial({ color: PAL.backdrop });
    H.put(scene, new THREE.PlaneGeometry(900, 900), paper, [0, FLOOR, 0], [-Math.PI / 2, 0, 0], false);
    const shadeTex = K.canvasTex(512, 512, (ctx, Wc) => { ctx.filter = 'blur(30px)'; ctx.fillStyle = 'rgba(38,62,92,0.55)'; ctx.beginPath(); ctx.roundRect(60, 60, Wc - 120, Wc - 120, 60); ctx.fill(); });
    H.put(scene, new THREE.PlaneGeometry(A.MW + 10, A.MD + 10), new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, map: shadeTex }), [1.6, FLOOR + 0.02, -1], [-Math.PI / 2, 0, 0], false);

    land = H.tile(scene, { w: A.MW + 0.6, d: A.MD + 0.6, r: 1.2 });
    land.traverse(o => { const m = o.material; if (m && !Array.isArray(m) && m.map && m.map.repeat && m.map.repeat.x === 2) m.map.repeat.set(9, 1); });
    const groundMat = new THREE.MeshPhysicalMaterial({ map: A.groundTexture(Wd), roughness: 0.95, sheen: 0.6, sheenRoughness: 0.7, sheenColor: new THREE.Color('#e8f5b0') });
    H.put(land, new THREE.PlaneGeometry(A.MW, A.MD), groundMat, [0, 0.004, 0], [-Math.PI / 2, 0, 0], false);
    // river
    const pts = []; for (let y = -0.4; y <= 64.4; y += 2) pts.push([wx(Wd.riverX(Math.min(63.9, Math.max(0, y))) * T), wz(y * T)]);
    const flat = (hex) => K.canvasTex(64, 64, (ctx) => { ctx.fillStyle = hex; ctx.fillRect(0, 0, 64, 64); });
    H.ribbon(land, pts, { width: 2.5, height: 0.05, texture: flat(PAL.stone[1]) });
    // water: a white map only so the mesh keeps its uvs (x = metres along the river, y = bank to bank);
    // colour, flow, ripples, caustics and bank foam are procedural in the shader below.
    waterTex = flat('#ffffff'); waterTex.wrapS = THREE.RepeatWrapping;
    H.ribbon(land, pts, { width: 1.65, height: 0.06, texture: waterTex, period: 1 });
    const water = land.children[land.children.length - 1];
    water.material = waterMaterial(waterTex); water.receiveShadow = true;
    // planar reflection: Stage re-renders the scene from a camera mirrored in the water plane each frame
    { land.updateMatrixWorld(true); const wy = land.localToWorld(new THREE.Vector3(0, 0.06, 0)).y;
      const rt = new THREE.WebGLRenderTarget(Math.round(S.W * 0.5), Math.round(S.H * 0.5), { type: THREE.HalfFloatType, generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter });
      waterMirror.tMirror.value = rt.texture; waterMirror.uMirrorMatrix.value = new THREE.Matrix4();
      S.mirrors.push({ mesh: water, rt, u: waterMirror, y: wy, rough: 0, cam: new THREE.PerspectiveCamera() }); }
    // bridge
    const bridge = new THREE.Group(); bridge.position.set(wx(Wd.riverX(21) * T), 0, wz(21.5 * T)); land.add(bridge); bridgeAt = [bridge.position.x, bridge.position.z];
    for (let i = -6; i <= 6; i++) H.box(bridge, 0.24, 0.08, 1.45, i % 2 ? PAL.kraft : '#b88a5a', [i * 0.25, 0.16 + 0.1 * Math.cos(i / 6 * 1.4), 0], 0.02);
    for (const s of [-1, 1]) { for (let i = -3; i <= 3; i++) H.box(bridge, 0.07, 0.42, 0.07, PAL.timber, [i * 0.5, 0.35 + 0.1 * Math.cos(i / 3 * 1.4), s * 0.68], 0.02); H.box(bridge, 3.3, 0.06, 0.06, PAL.timber, [0, 0.58, s * 0.68], 0.02); }

    // village and props
    const rng = K.rng(3); houses = Wd.buildings.map(b => A.cottage(land, b, rng));
    Wd.props.forEach(p => {
      if (p.type === 'well') { const g = A.well(land, p); g.traverse(o => { if (o.material && o.material.roughness === 0.2) wellWater = o.material; }); }
      else if (p.type === 'dummy') A.dummy(land, p);
      else if (p.type === 'fence') A.fence(land, p);
    });
    fire = A.campfire(land, Wd.campfire);
    runes = Wd.props.filter(p => p.type === 'stone').map((p, i) => A.standingStone(land, p, i));
    woods = A.forest(land, Wd.trees);
    // herbs: five little flowers each, hidden while picked
    herbMesh = A.herbs(land, Wd.herbs); herbMesh.userData.base = [];
    const m4 = new THREE.Matrix4(); for (let i = 0; i < herbMesh.count; i++) { herbMesh.getMatrixAt(i, m4); herbMesh.userData.base.push(m4.clone()); }
    // dead trees (woodcutting): grey snags with a red Ledger ribbon once Hesk hands over the hatchet
    deadGroups = Wd.deadTrees.map(d => {
      const g = new THREE.Group(); g.position.set(wx(d.x), 0, wz(d.y)); land.add(g);
      H.put(g, new THREE.CylinderGeometry(0.06, 0.1, 1.0, 8), '#9d9a94', [0, 0.5, 0]);
      H.put(g, new THREE.CylinderGeometry(0.03, 0.045, 0.5, 6), '#9d9a94', [0.13, 0.82, 0], [0, 0, -0.8]);
      H.put(g, new THREE.CylinderGeometry(0.025, 0.035, 0.4, 6), '#9d9a94', [-0.11, 0.7, 0], [0, 0, 0.9]);
      const mark = H.put(g, new THREE.TorusGeometry(0.1, 0.025, 8, 20), PAL.accent, [0, 0.55, 0], [Math.PI / 2, 0, 0]);
      const stump = H.put(g, new THREE.CylinderGeometry(0.1, 0.12, 0.14, 10), '#b89a74', [0, 0.07, 0]);
      return { g, d, mark, stump, parts: g.children.slice(0, 3) };
    });
    // wolf tracks (Tracking)
    trackMesh = new THREE.InstancedMesh(new THREE.CircleGeometry(0.06, 10), new THREE.MeshBasicMaterial({ color: PAL.accent, transparent: true, opacity: 0.75, depthWrite: false }), Math.max(1, Wd.tracks.length));
    Wd.tracks.forEach((tr, i) => K.place(trackMesh, i, [wx(tr.x), 0.012, wz(tr.y)], [-Math.PI / 2, 0, 0], [1, 1.35, 1]));
    land.add(trackMesh); trackMesh.visible = false;
    smoke = H.puffs(land, 30); for (let n = 0; n < 30; n++) K.place(smoke.mesh, n, [0, -9, 0], null, 1e-4);

    // the hero and the bolt pool
    kay = A.hero(land);
    const boltMat = new THREE.MeshStandardMaterial({ color: '#bfe8ff', emissive: PAL.mana, emissiveIntensity: 4, roughness: 0.3 });
    for (let i = 0; i < 8; i++) { const b = H.put(land, new THREE.SphereGeometry(0.13, 16, 10), boltMat, [0, -5, 0], null, false); b.visible = false; bolts.push(b); }
    boltLight = new THREE.PointLight(PAL.mana, 0, 4, 2); land.add(boltLight);
    glow = new THREE.PointLight(PAL.mana, 0, 5, 2); land.add(glow);
    makeLife();
  }

  // ambient life ---------------------------------------------------------
  // Purely visual: fish that leap from the river, ducks along the banks, birds crossing overhead and
  // two farmers working the big field. None of it touches game logic; the river mirror reflects it all.
  const WY = 0.066;                                   // water surface (land-local)
  let life = null;
  const rnd = (a, b) => a + Math.random() * (b - a);
  const riverAt = (ty) => [wx(AB.World.riverX(Math.max(0, Math.min(63.9, ty))) * T), wz(ty * T)];
  const tyOf = (z) => (z + A.MD / 2) / A.U;
  function makeLife() {
    life = { fish: null, jump: null, nextJump: 3, rings: [], drops: null, ducks: [], birds: null, nextBirds: 6, flock: null, farmers: [] };
    const ringMat = () => new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0, depthWrite: false });
    for (let i = 0; i < 10; i++) { const m = new THREE.Mesh(new THREE.RingGeometry(0.8, 1, 32), ringMat()); m.rotation.x = -Math.PI / 2; m.visible = false; land.add(m); life.rings.push({ m, age: 9, life: 1, size: 0.3 }); }
    // fish: a little silver-gold body and a forked tail, nose along +x
    { const g = new THREE.Group(); g.visible = false; land.add(g);
      const fm = new THREE.MeshPhysicalMaterial({ color: '#c9a35e', metalness: 0.55, roughness: 0.28, clearcoat: 1 });
      const body = H.put(g, new THREE.SphereGeometry(1, 16, 10), fm, [0, 0, 0]); body.scale.set(0.12, 0.045, 0.035);
      const tail = H.put(g, new THREE.ConeGeometry(0.05, 0.08, 4), fm, [-0.14, 0, 0], [0, 0, Math.PI / 2]); tail.scale.set(1, 1, 0.25);
      H.put(g, new THREE.ConeGeometry(0.02, 0.05, 3), fm, [0.01, 0.05, 0], [0, 0, -0.5]);
      g.scale.setScalar(1.5); life.fish = g; }
    const dm = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 6, 4), new THREE.MeshBasicMaterial({ color: '#e9f7ff', transparent: true, opacity: 0.85 }), 24);
    for (let i = 0; i < 24; i++) K.place(dm, i, [0, -9, 0], null, 1e-4); land.add(dm); life.drops = { m: dm, p: [] };
    // ducks: four mallards and a brown hen, homes spread along the village stretch of river
    [[14, -0.3, 1], [17.5, 0.35, 0], [25, -0.4, 1], [27.5, 0.2, 1], [33, 0.1, 0]].forEach(([ty, s, drake]) => {
      const g = new THREE.Group(); g.rotation.order = 'YXZ'; land.add(g);
      const body = H.put(g, new THREE.SphereGeometry(1, 16, 12), drake ? '#d8d2c4' : '#9a7650', [0, 0.05, 0]); body.scale.set(0.12, 0.065, 0.075);
      H.put(g, new THREE.ConeGeometry(0.045, 0.09, 8), drake ? '#3b3a38' : '#7f6040', [-0.12, 0.08, 0], [0, 0, 2.0]);
      const head = new THREE.Group(); head.position.set(0.09, 0.13, 0); g.add(head);
      H.put(head, new THREE.SphereGeometry(0.045, 14, 10), drake ? '#2f6e45' : '#8a6a46', [0, 0, 0]);
      if (drake) H.put(head, new THREE.TorusGeometry(0.035, 0.008, 6, 16), '#f4f1e8', [-0.01, -0.035, 0], [Math.PI / 2, 0, 0]);
      const bill = H.put(head, new THREE.SphereGeometry(1, 10, 6), '#e8a832', [0.05, -0.008, 0]); bill.scale.set(0.035, 0.012, 0.022);
      H.put(g, new THREE.SphereGeometry(1, 10, 8), drake ? '#7a7f8a' : '#7d5d3d', [-0.01, 0.075, 0.06]).scale.set(0.08, 0.03, 0.02);
      H.put(g, new THREE.SphereGeometry(1, 10, 8), drake ? '#7a7f8a' : '#7d5d3d', [-0.01, 0.075, -0.06]).scale.set(0.08, 0.03, 0.02);
      const legs = H.put(g, new THREE.BoxGeometry(0.02, 0.05, 0.08), '#e8a832', [0, -0.005, 0]);
      const wake = new THREE.Mesh(new THREE.RingGeometry(0.85, 1, 28), ringMat()); wake.rotation.x = -Math.PI / 2; land.add(wake);
      g.scale.setScalar(1.5);
      life.ducks.push({ g, head, legs, wake, home: ty, ty, s, tty: ty, ts: s, rest: 0, hd: 0, ph: Math.random() * 6, spd: 0.22 });
    });
    // birds: a small flock of dark gulls; wings are pivoted boxes
    { const flock = new THREE.Group(); flock.visible = false; land.add(flock); const birds = [];
      for (let i = 0; i < 5; i++) {
        const b = new THREE.Group(); flock.add(b);
        const bb = H.put(b, new THREE.SphereGeometry(1, 10, 8), '#3d4350', [0, 0, 0]); bb.scale.set(0.13, 0.04, 0.045);
        const wings = [-1, 1].map(sd => { const w = new THREE.Group(); w.position.set(0.01, 0.01, sd * 0.03); b.add(w); H.box(w, 0.09, 0.012, 0.24, '#4a505e', [0, 0, sd * 0.12], 0.005); return { w, sd }; });
        birds.push({ b, wings, off: [-Math.abs(i - 2) * 0.55 - (i ? 0.1 : 0), (i % 2 ? 0.12 : -0.08), (i - 2) * 0.5], ph: Math.random() * 6 });
      }
      flock.scale.setScalar(1.15);
      life.flock = { g: flock, birds, t: 0, dur: 0, from: null, dir: null }; }
    // farmers: one hoeing down the rows, one planting from a basket (field tiles x 8-16, y 31-40)
    const hoer = A.villager(land, '#7d8f5a', 'cap', 1);
    const hoe = new THREE.Group(); hoe.position.set(0.1, 0.32, 0.05); hoer.add(hoe);
    H.box(hoe, 0.03, 0.5, 0.03, PAL.timber, [0, 0.05, 0], 0.01); H.box(hoe, 0.1, 0.035, 0.16, '#9aa2aa', [0, -0.2, 0.07], 0.01);
    hoer.rotation.order = 'YXZ';
    const planter = A.villager(land, '#b06f4e', 'hair', 0.95); planter.rotation.order = 'YXZ';
    const basket = H.put(planter, new THREE.CylinderGeometry(0.07, 0.055, 0.08, 12), PAL.kraft, [0.02, 0.28, 0.13]);
    const seedlings = new THREE.InstancedMesh(new THREE.ConeGeometry(0.035, 0.08, 5), new THREE.MeshStandardMaterial({ color: '#6fae46', roughness: 0.8 }), 40);
    for (let i = 0; i < 40; i++) K.place(seedlings, i, [0, -9, 0], null, 1e-4); seedlings.castShadow = true; land.add(seedlings);
    for (let i = 0; i < 13; i++) K.place(seedlings, i, [wx((9 + i * 0.5) * T), 0.05, wz(38.1 * T)], [0, rnd(0, 3), 0], 1.2);   // the row already planted
    life.farmers = [
      { g: hoer, tool: hoe, kind: 'hoe', row: 33.2, x: 9.2, dir: 1, act: 0, step: 0, pc: 0 },
      { g: planter, tool: basket, kind: 'plant', row: 37.2, x: 14.8, dir: -1, act: 0, step: 0, seeds: seedlings, n: 13, pc: 0 }
    ];
  }
  function ring(x, z, size, dur, op) {
    const r = life.rings.reduce((a, b) => (b.age / b.life > a.age / a.life ? b : a));
    r.m.position.set(x, WY + 0.004, z); r.age = 0; r.life = dur; r.size = size; r.op = op || 0.55; r.m.visible = true;
  }
  function splash(x, z, n, up) {
    ring(x, z, 0.32, 1.1); ring(x, z, 0.18, 0.7, 0.4);
    for (let i = 0; i < n; i++) { const a = rnd(0, 6.3), v = rnd(0.3, 0.8); life.drops.p.push({ x, y: WY, z, vx: Math.cos(a) * v, vy: rnd(0.8, 1.6) * up, vz: Math.sin(a) * v, t: 0 }); }
    if (life.drops.p.length > 24) life.drops.p.splice(0, life.drops.p.length - 24);
  }
  R._life = () => life;
  function lifeTick(G, dt, fx, fz, kx, kz) {
    if (!life) return;
    const t = G.t || 0, near = (x, z) => Math.max(0, 1 - Math.hypot(x - fx, z - fz) / 6);
    // rings and droplets
    life.rings.forEach(r => { if (!r.m.visible) return; r.age += dt; const k = r.age / r.life; if (k >= 1) { r.m.visible = false; return; } r.m.scale.setScalar(r.size * (0.3 + k)); r.m.material.opacity = r.op * (1 - k) * (1 - k); });
    const dp = life.drops.p; for (let i = 0; i < 24; i++) {
      const d = dp[i]; if (!d) { K.place(life.drops.m, i, [0, -9, 0], null, 1e-4); continue; }
      d.t += dt; d.vy -= 5 * dt; d.x += d.vx * dt; d.y += d.vy * dt; d.z += d.vz * dt;
      K.place(life.drops.m, i, [d.x, d.y, d.z], null, d.y < WY ? 1e-4 : 0.016);
    }
    life.drops.p = dp.filter(d => d.y >= WY - 0.01); life.drops.m.instanceMatrix.needsUpdate = true;
    // fish: every few seconds one leaps somewhere in view
    const f = life.fish;
    if (!life.jump) {
      life.nextJump -= dt;
      if (life.nextJump <= 0) {
        let ty = tyOf(fz) + rnd(-7, 7); if (Math.abs(ty - 21.5) < 1.5) ty += 3; ty = Math.max(1, Math.min(63, ty));
        const [cx, cz] = riverAt(ty), s = rnd(-0.42, 0.42), a = (Math.random() < 0.5 ? 0 : Math.PI) + Math.PI / 2 + rnd(-0.5, 0.5);
        const len = rnd(0.45, 0.75);
        life.jump = { x0: cx + s, z0: cz, dx: Math.cos(a) * len, dz: Math.sin(a) * len, h: rnd(0.3, 0.55), t: 0, dur: rnd(0.75, 1.0), out: false };
        f.rotation.set(0, -a, 0); splash(life.jump.x0, life.jump.z0, 6, 1); AB.Audio && AB.Audio.sfx('splash', 0.35 * near(cx, cz));
      }
    } else {
      const j = life.jump; j.t += dt; const k = j.t / j.dur;
      if (k >= 1) { f.visible = false; splash(j.x0 + j.dx, j.z0 + j.dz, 8, 1.2); AB.Audio && AB.Audio.sfx('splash', 0.45 * near(j.x0, j.z0)); life.jump = null; life.nextJump = rnd(2.5, 6.5); }
      else {
        f.visible = true; const y = WY - 0.04 + 4 * j.h * k * (1 - k);
        f.position.set(j.x0 + j.dx * k, y, j.z0 + j.dz * k);
        const vy = 4 * j.h * (1 - 2 * k) / j.dur, vh = Math.hypot(j.dx, j.dz) / j.dur;
        f.rotation.z = Math.atan2(vy, vh); f.children[1].rotation.y = Math.sin(t * 30) * 0.5;
        if (Math.random() < dt * 30 && k > 0.1 && k < 0.9) life.drops.p.push({ x: f.position.x, y, z: f.position.z, vx: rnd(-0.2, 0.2), vy: 0, vz: rnd(-0.2, 0.2), t: 0 });
      }
    }
    // ducks: drift between spots, sometimes waddle up onto the bank to rest, scatter if Kayden gets close
    life.ducks.forEach(d => {
      const [cx, cz] = riverAt(d.ty), x = cx + d.s, z = cz;
      const scare = kx != null && Math.hypot(kx - x, kz - z) < 0.9;
      if (scare && d.spd < 0.5) { d.ts = Math.max(-0.6, Math.min(0.6, d.s + (x > kx ? 0.6 : -0.6))); d.tty = d.ty + (z > kz ? 2 : -2); d.rest = 0; d.spd = 0.7; d.ph += 2; }
      if (d.rest > 0) d.rest -= dt;
      else {
        const [tx] = riverAt(d.tty), ez = d.tty - d.ty, ex = d.ts - d.s, dist = Math.hypot(ex * 2, ez * A.U);
        if (dist < 0.03) {
          d.spd = 0.22; const r = Math.random();
          if (Math.abs(d.s) > 0.9) { d.ts = Math.sign(d.s) * 0.55; d.tty = d.ty + rnd(-0.6, 0.6); }
          else if (r < 0.22) { d.ts = (Math.random() < 0.5 ? -1 : 1) * rnd(1.0, 1.12); d.tty = d.ty + rnd(-0.5, 0.5); }
          else { d.ts = rnd(-0.6, 0.6); d.tty = d.home + rnd(-2.5, 2.5); }
          d.rest = Math.abs(d.s) > 0.9 ? rnd(4, 9) : rnd(0.5, 3);
        } else {
          const st = Math.min(1, d.spd * dt / dist); d.s += ex * st; d.ty += ez * st;
          const want = Math.atan2(ez * A.U, ex); let da = want - d.hd; da = Math.atan2(Math.sin(da), Math.cos(da)); d.hd += da * Math.min(1, dt * 4);
        }
      }
      const onBank = Math.abs(d.s) > 0.86, [nx, nz] = riverAt(d.ty), px = nx + d.s;
      const moving = d.rest <= 0;
      const bob = onBank ? (moving ? Math.abs(Math.sin(t * 10 + d.ph)) * 0.02 : 0) : Math.sin(t * 2.2 + d.ph) * 0.006;
      d.g.position.set(px, (onBank ? 0.075 : WY - 0.01) + bob, nz); const dab = d.rest > 0 && !onBank && Math.sin(t * 0.9 + d.ph) > 0.82;
      d.g.rotation.set(onBank && moving ? Math.sin(t * 10 + d.ph) * 0.12 : 0, -d.hd, dab ? -0.85 : 0);
      d.legs.visible = onBank;
      d.head.rotation.z = dab ? -0.6 : Math.sin(t * 1.7 + d.ph) * 0.08;   // tail up for a dabble now and then
      d.wake.visible = !onBank; d.wake.position.set(px, WY + 0.003, nz);
      const wk = (t * (moving ? 1.4 : 0.5) + d.ph) % 1; d.wake.scale.setScalar(0.12 + wk * (moving ? 0.22 : 0.12)); d.wake.material.opacity = 0.35 * (1 - wk);
    });
    // birds: every so often a flock crosses the view high overhead
    const fl = life.flock;
    if (!fl.g.visible) {
      life.nextBirds -= dt;
      if (life.nextBirds <= 0) {
        const a = rnd(0, 6.3), dir = [Math.cos(a), Math.sin(a)], side = rnd(-3, 3); fl.alt = rnd(3.2, 4.4);
        const cz = fz + fl.alt * 1.1;   // aim the path at the middle of the screen, allowing for height
        fl.from = [fx - dir[0] * 16 - dir[1] * side, cz - dir[1] * 16 + dir[0] * side]; fl.dir = dir; fl.t = 0; fl.dur = 32 / 2.6; fl.g.visible = true;
        fl.g.rotation.set(0, -a, 0);
      }
    } else {
      fl.t += dt; const k = fl.t / fl.dur;
      if (k >= 1) { fl.g.visible = false; life.nextBirds = rnd(14, 28); }
      else {
        fl.g.position.set(fl.from[0] + fl.dir[0] * 32 * k, fl.alt + Math.sin(k * 6) * 0.2, fl.from[1] + fl.dir[1] * 32 * k);
        fl.birds.forEach(b => {
          b.b.position.set(b.off[0], b.off[1] + Math.sin(t * 1.3 + b.ph) * 0.06, b.off[2]);
          const glide = Math.sin(t * 0.7 + b.ph) > 0.4, flap = glide ? 0.12 : Math.sin(t * 11 + b.ph) * 0.65;
          b.wings.forEach(w => w.w.rotation.x = -w.sd * flap);
        });
      }
    }
    // farmers
    life.farmers.forEach(fa => {
      const px = wx(fa.x * T), pz = wz(fa.row * T);
      // step aside for Kayden instead of walking through him
      let ox = 0, oz = 0; if (kx != null) { const ddx = px - kx, ddz = pz - kz, dd = Math.hypot(ddx, ddz); if (dd < 0.42) { ox = ddx / (dd || 1) * (0.42 - dd); oz = ddz / (dd || 1) * (0.42 - dd); } }
      const blocked = kx != null && Math.hypot(px - kx, pz - kz) < 0.6;
      fa.act += dt;
      if (fa.kind === 'hoe') {
        const cyc = 1.3, c = (fa.act % cyc) / cyc;          // raise, chop, pull back, step
        if (!blocked) {
          if (c > 0.75) fa.x += fa.dir * dt * 0.55;
          if (fa.act - fa.step > cyc && c < 0.1) { fa.step = fa.act; }
        }
        const lift = c < 0.4 ? K.smooth(0, 0.4, c) : c < 0.5 ? 1 - K.smooth(0.4, 0.5, c) : 0;
        fa.tool.rotation.x = -0.9 + lift * 1.6;
        const kk = Math.floor(fa.act / cyc - 0.48); if (kk !== fa.pc && !blocked) { AB.Audio && AB.Audio.sfx('pick', 0.12 * near(px, pz)); }
        fa.pc = kk;
        fa.g.position.set(px + ox, 0, pz + oz); fa.g.rotation.set((1 - lift) * 0.15, fa.dir > 0 ? Math.PI / 2 : -Math.PI / 2, 0);
      } else {
        const cyc = 1.8, c = (fa.act % cyc) / cyc, bend = c < 0.5 ? Math.sin(c / 0.5 * Math.PI) : 0;
        if (!blocked && c >= 0.5) fa.x += fa.dir * dt * 0.42;
        const kk = Math.floor(fa.act / cyc - 0.24), crossed = kk !== fa.pc; fa.pc = kk;
        if (crossed && !blocked) {    // a seedling goes in
          const i = fa.n++ % 40; K.place(fa.seeds, i, [px + fa.dir * 0.14, 0.05, pz], [0, rnd(0, 3), 0], 1.2); fa.seeds.instanceMatrix.needsUpdate = true;
        }
        fa.g.position.set(px + ox, -bend * 0.08, pz + oz); fa.g.rotation.set(bend * 0.55, fa.dir > 0 ? Math.PI / 2 : -Math.PI / 2, 0);
      }
      if (blocked) fa.g.rotation.y = Math.PI / 2 - Math.atan2(kz - pz, kx - px);
      // turn round at the end of a row and move to the next furrow
      if (fa.x > 15.2 || fa.x < 8.8) {
        fa.dir *= -1; fa.x = Math.max(8.8, Math.min(15.2, fa.x));
        fa.row += fa.kind === 'hoe' ? 0.9 : -0.9;
        if (fa.row > 39.4) fa.row = 31.6; if (fa.row < 31.6) fa.row = 39.4;
      }
    });
  }

  // people --------------------------------------------------------------
  const LOOK = { elowen: ['#5f8fb0', 'hair', 1], garrick: ['#5b6676', 'helmet', 1.08], hesk: ['#8a7350', 'cap', 1], mira: ['#d98aa8', 'hair', 0.68], sable: ['#4a3f6b', 'wizard', 1], villager: ['#a08a5c', 'cap', 1] };
  function npcModel(n) {
    let m = npcs.get(n); if (m) return m;
    const [col, hat, sc] = LOOK[n.id] || ['#8d8f9c', 'hair', 1];
    const g = A.villager(land, col, hat === 'wizard' ? 'hair' : hat, sc);
    if (hat === 'helmet') g.children[2].material = H.paint('#9aa3ad', 0.45);
    if (hat === 'wizard') { H.put(g, new THREE.ConeGeometry(0.17, 0.42, 16), '#2b2440', [0, 0.86, 0]); H.put(g, new THREE.CylinderGeometry(0.24, 0.24, 0.025, 20), '#2b2440', [0, 0.66, 0]); H.put(g, new THREE.TorusGeometry(0.16, 0.018, 6, 20), PAL.accent, [0, 0.69, 0], [Math.PI / 2, 0, 0]); }
    m = { g }; npcs.set(n, m); return m;
  }
  function foeModel(e) {
    let m = foes.get(e); if (m) return m;
    if (e.type === 'slime') { const s = A.slime(land); s.body.material = s.body.material.clone(); m = { kind: 'slime', ...s }; }
    else { const w = A.wolf(land, !!e.d.boss); const mats = []; w.body.traverse(o => { if (o.material && o.material.color && !o.material.emissiveIntensity) { o.material = o.material.clone(); mats.push(o.material); } }); m = { kind: 'wolf', mats, ...w }; }
    m.yaw = 0; foes.set(e, m); return m;
  }

  // Ledger cards: a flip-sign pops up beside Kayden for every skill-up, level, title and new ability
  function hookLog() {
    const orig = AB.UI.log;
    AB.UI.log = function (text, kind) {
      try { if (R.mode === 'play' && ['skill', 'level', 'title', 'new'].includes(kind)) cardQueue.push(cardFor(text, kind)); } catch (e) {}
      return orig.apply(this, arguments);
    };
  }
  function cardFor(text, kind) {
    let m;
    if (kind === 'skill' && (m = text.match(/^(.*) \+1 → (\d+)/))) return { word: `${m[1].toUpperCase()} +1`, num: m[2] };
    if (kind === 'level' && (m = text.match(/LEVEL (\d+)/))) return { word: 'LEVEL UP', num: m[1] };
    const word = text.replace(/^(New skill|Ability granted|Title earned): /, '').toUpperCase();
    return { word: word.slice(0, 22), num: kind === 'title' ? '!' : '+' };
  }
  function spawnCard(c) {
    const s = H.sign(land, c.word, c.num); s.setHeight(1.35); s.g.scale.setScalar(0.001);
    cards.push({ s, t: 0, slot: cards.length % 2 });
  }
  function disposeTree(o) { o.traverse(x => { if (x.geometry) x.geometry.dispose(); const ms = Array.isArray(x.material) ? x.material : [x.material]; ms.forEach(mm => { if (mm && mm.map) mm.map.dispose(); }); }); }


  // ---------------------------------------------------------------- river water
  // A standard PBR material (so it keeps the sun, sky reflections and tree shadows) with the colour and
  // surface normal replaced: deep teal in the channel, shallow turquoise at the banks, two layers of
  // drifting noise for ripples, bright caustic threads and foam where the water meets the stones.
  function waterMaterial(map) {
    const m = new THREE.MeshPhysicalMaterial({ map, roughness: 0.07, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 1.1, ior: 1.33 });
    m.onBeforeCompile = (sh) => {
      sh.uniforms.uTime = { value: 0 }; waterU = sh.uniforms;
      if (!waterMirror.uMirrorMatrix.value) waterMirror.uMirrorMatrix.value = new THREE.Matrix4();
      Object.assign(sh.uniforms, waterMirror);
      sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nuniform mat4 uMirrorMatrix; varying vec4 vMirrorCoord;')
        .replace('#include <begin_vertex>', '#include <begin_vertex>\nvMirrorCoord = uMirrorMatrix * (modelMatrix * vec4(transformed, 1.0));');
      const lib = `uniform float uTime; uniform sampler2D tMirror; varying vec4 vMirrorCoord;
        float wH(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
        float wN(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(wH(i),wH(i+vec2(1,0)),f.x),mix(wH(i+vec2(0,1)),wH(i+vec2(1,1)),f.x),f.y);}
        float wF(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*wN(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}
        vec2 wP(){return vec2(vMapUv.x, vMapUv.y*1.65);}
        float wHeight(vec2 p){return wF(p*vec2(2.2,3.)+vec2(-uTime*.55,0.))*.6+wF(p*vec2(4.5,5.)+vec2(-uTime*.9,uTime*.12))*.4;}
      `;
      sh.fragmentShader = sh.fragmentShader.replace('#include <uv_pars_fragment>', '#include <uv_pars_fragment>\n' + lib)
        .replace('#include <map_fragment>', `
          vec2 wp = wP(); float across = vMapUv.y; float edge = min(across, 1. - across);
          float depth = smoothstep(0.04, 0.5, edge);
          float n1 = wF(wp*vec2(2.2,3.)+vec2(-uTime*.55,0.)), n2 = wF(wp*vec2(4.5,5.)+vec2(-uTime*.9,uTime*.12));
          vec3 shallow = vec3(.30,.66,.68), deep = vec3(.035,.24,.34), sand = vec3(.78,.74,.60);
          vec3 wc = mix(shallow, deep, depth);
          wc = mix(sand, wc, smoothstep(0.0, 0.09, edge));
          wc *= .92 + .16 * n1;
          float foam = smoothstep(.16, .05, edge) * smoothstep(.42, .7, wF(wp*vec2(6.,8.)+vec2(-uTime*.7,0.)));
          foam += smoothstep(.78, .95, n2) * .15 * (1. - depth);
          wc = mix(wc, vec3(.95,.98,1.), clamp(foam, 0., .85));
          diffuseColor.rgb = wc;`)
        .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
          { float hh = wHeight(wP());
            vec3 sx = dFdx(-vViewPosition), sy = dFdy(-vViewPosition);
            float dhx = dFdx(hh), dhy = dFdy(hh);
            vec3 r1 = cross(sy, normal), r2 = cross(normal, sx); float det = dot(sx, r1);
            vec3 grad = sign(det) * (dhx * r1 + dhy * r2);
            normal = normalize(abs(det) * normal - grad * 0.016); }`)
        .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>
          { float c = pow(1. - abs(sin((n1 + n2) * 11.)), 7.); totalEmissiveRadiance += vec3(.75,.95,1.) * c * .1 * (.4 + depth); }`)
        .replace('#include <opaque_fragment>', `{
            vec4 mc = vMirrorCoord; mc.xy += vec2(n1 - .5, n2 - .5) * .022 * mc.w;
            vec3 refl = min(texture2DProj(tMirror, mc, 1.2).rgb, vec3(8.));
            float cv = saturate(dot(normalize(vViewPosition), normal));
            float k = (.58 + .35 * pow(1. - cv, 2.)) * (1. - clamp(foam, 0., 1.) * .8) * smoothstep(.0, .06, edge);
            outgoingLight = mix(outgoingLight, refl * vec3(.68,.82,.88), k); }
          #include <opaque_fragment>`);
    };
    m.customProgramCacheKey = () => 'aetherbound-water';
    return m;
  }

  // ---------------------------------------------------------------- per frame
  // mode: 'title' (the model turns slowly behind the menu) or 'play' (follow Kayden)
  R.frame = function (G, dt) {
    if (!R.ok || !S) return;
    const t = G.t || 0, Wd = AB.World, Ls = AB.Ledger.S;
    cv.style.visibility = R.mode === 'off' ? 'hidden' : 'visible';
    if (R.mode === 'off') return;
    R.titleT = (R.titleT || 0) + dt;
    // ambient life
    if (waterU) waterU.uTime.value += dt;
    const fl = 1 + Math.sin(t * 17) * 0.12 + Math.sin(t * 7.3) * 0.08; fire.f1.scale.set(1, fl, 1); fire.f2.scale.set(1, 2 - fl, 1); fire.light.intensity = 2.2 * fl;
    let n = 0;
    houses.forEach((h, k) => { if (!h.chimney) return; for (let j = 0; j < 3 && n < 30; j++, n++) { const age = ((t * 0.35 + j / 3 + k * 0.17) % 1); smoke.set(n, h.chimney, age, { size: 0.09, rise: 1.3, drift: 0.45 }); } });
    smoke.mesh.instanceMatrix.needsUpdate = true;
    if (wellWater) wellWater.color.set(Ls.flags.wellClean ? '#4fa8c4' : '#5d7a4a');
    // herbs picked / regrown
    const sig = Wd.herbs.map(h => h.alive ? 1 : 0).join('');
    if (sig !== herbSig) { herbSig = sig; const zero = new THREE.Matrix4().makeScale(0, 0, 0); Wd.herbs.forEach((h, j) => { for (let i = 0; i < 5; i++) herbMesh.setMatrixAt(j * 5 + i, h.alive ? herbMesh.userData.base[j * 5 + i] : zero); }); herbMesh.instanceMatrix.needsUpdate = true; }
    deadGroups.forEach(o => { const up = o.d.alive; o.parts.forEach(p => p.visible = up); o.mark.visible = up && !!Ls.flags.hatchet; o.stump.visible = !up; });
    trackMesh.visible = !!Ls.skills.tracking.unlocked;

    let ax, az, dist, el, yaw = 0, depth = 0;
    const portrait = innerWidth / innerHeight;
    if (R.mode === 'title' || R.mode === 'reveal' || !G.player) {
      const a = R.titleT * 0.03;
      // frame the whole tile; on wide screens slide it right of the menu card, on tall ones below it
      const wide = innerWidth >= 980 && portrait >= 1.25;
      const useW = wide ? 0.6 : 0.96, useH = wide ? 0.9 : 0.55;
      const fitW = 30 / (Math.tan(10 * Math.PI / 180) * portrait * useW), fitH = 21 / (Math.tan(10 * Math.PI / 180) * useH);
      ax = Math.sin(a) * 1.2; az = 1; dist = Math.max(fitW, fitH); el = 32; yaw = -12 + Math.sin(a * 0.7) * 9;
      R.viewShift = wide ? [-0.2, 0] : [0, -0.2];
      if (R.mode === 'reveal') {
        // end of the opening: drop from high above the whole tile down onto Thornwick
        const k = K.smooth(0, 1, R.revealK || 0), vx = wx(22 * T), vz = wz(20 * T);
        const far = Math.max(fitW, fitH) * 1.15;
        ax = vx * k; az = 1 + (vz - 1) * k; dist = far + (30 - far) * k; el = 64 - 26 * k; yaw = -48 + 36 * k;
        R.viewShift = null;
      }
      [kay.g].forEach(o => o.visible = false); npcs.forEach(m => m.g.visible = false); foes.forEach(m => m.g.visible = false);
      woods.cut(0, -999, 0); lastCut = { x: 1e9, z: 1e9 };
    } else {
      const p = G.player;
      depth = Wd.depth(p.x);
      const tx = wx(p.x), tz = wz(p.y);
      if (!cam.init) { cam.x = tx; cam.z = tz; cam.init = true; }
      const k = 1 - Math.exp(-dt * 5); cam.x += (tx - cam.x) * k; cam.z += (tz - cam.z) * k;
      ax = cam.x; az = cam.z;
      dist = Math.min(44, Math.max(22, 9 / (0.353 * Math.min(1.2, portrait)))); el = 42;
      R.viewShift = null;
      syncPlay(G, dt, t);
      if (Math.hypot(tx - lastCut.x, tz - lastCut.z) > 0.08) { woods.cut(tx, tz, 3.4); lastCut = { x: tx, z: tz }; }
    }
    lifeTick(G, dt, ax, az, G.player && R.mode === 'play' ? wx(G.player.x) : null, G.player ? wz(G.player.y) : null);
    const shake = G.shake > 0 ? G.shake * 0.006 : 0;
    const e = el * Math.PI / 180, y = yaw * Math.PI / 180;
    const pos = [ax + Math.sin(y) * Math.cos(e) * dist + (Math.random() - 0.5) * shake, Math.sin(e) * dist, az + Math.cos(y) * Math.cos(e) * dist + (Math.random() - 0.5) * shake];
    K.look(camera, pos, [ax, 0.35, az], 20);
    if (R.viewShift) camera.setViewOffset(1000 * portrait, 1000, R.viewShift[0] * 1000 * portrait, R.viewShift[1] * 1000, 1000 * portrait, 1000);
    else if (camera.view && camera.view.enabled) camera.clearViewOffset();
    camera.far = Math.max(400, dist * 2.5); camera.updateProjectionMatrix();
    // light: bright day in Thornwick, warm dusk deep in the Ashwood
    const dusk = K.smooth(0.15, 0.95, depth);
    const c1 = new THREE.Color('#ffe9cc'), c2 = new THREE.Color('#ffaf78');
    sun.color.copy(c1.lerp(c2, dusk)); sun.intensity = 3.3 - 0.9 * dusk;
    sky.color.set('#bcd3ff').lerp(new THREE.Color('#93a2ee'), dusk); sky.intensity = 0.95 - 0.2 * dusk;
    paper.color.set(PAL.backdrop).lerp(new THREE.Color(PAL.evening), dusk);
    sun.target.position.set(ax, 0, az); sun.position.set(ax - 9, 13 - 4 * dusk, az + 9); sky.target.position.set(ax, 0, az);
    const sz = R.mode === 'title' ? 30 : Math.max(10, dist * 0.42), sc = sun.shadow.camera;
    if (sc.right !== sz) { sc.left = sc.bottom = -sz; sc.right = sc.top = sz; sc.updateProjectionMatrix(); const kc = sky.shadow.camera; kc.left = kc.bottom = -sz; kc.right = kc.top = sz; kc.updateProjectionMatrix(); }
    houses.forEach(h => h.wins.forEach(m => m.emissiveIntensity = 2.4 * dusk));
    runes.forEach(m => m.emissiveIntensity = 3 * K.smooth(0.75, 1, depth));
    // tilt-shift band sits on Kayden (or the village on the title)
    const f = R.project(R.mode === 'play' && G.player ? G.player.x : 22 * T, R.mode === 'play' && G.player ? G.player.y : 20 * T, 0.4);
    tilt.uniforms.focus.value = 1 - f.y / innerHeight; tilt.uniforms.amt.value = R.mode === 'title' ? 1.2 : R.mode === 'reveal' ? 1.6 : 1;
    S.seek(0, 1);
  };

  function syncPlay(G, dt, t) {
    const p = G.player, Ls = AB.Ledger.S;
    // Kayden
    const kg = kay.g; kg.visible = !(p.inv > 0 && Math.floor(p.t * 20) % 2 === 0) && G.alive !== false;
    const bob = p.moving ? Math.abs(Math.sin(p.t * 12)) * 0.07 : 0;
    kg.position.set(wx(p.x), bob + deckY(p.x, p.y), wz(p.y)); kg.rotation.set(0, Math.PI / 2 - p.face, 0);
    if (p.dashT > 0) kg.rotateX(0.35);
    const sw = p.swing > 0 ? p.swing / 0.22 : 0;
    if (sw > 0) { kay.sword.position.set(0.0, 0.42, 0.12); kay.sword.rotation.set(Math.PI / 2, 0, (sw - 0.5) * 2.6); }
    else { kay.sword.position.set(0.12, 0.3, 0); kay.sword.rotation.set(0, 0, 0); }
    kay.sword.children[0].material = H.paint(Ls.flags.swordUp ? '#c9ccd1' : PAL.kraft);
    glow.position.set(kg.position.x, 1.0, kg.position.z); glow.intensity = 0.6 + 2.2 * K.smooth(0.3, 1, AB.World.depth(p.x));
    // villagers
    G.npcs.forEach(n => { const m = npcModel(n); m.g.visible = n.visible !== false; m.g.position.set(wx(n.x), deckY(n.x, n.y), wz(n.y)); const a = Math.atan2(p.y - n.y, p.x - n.x); m.g.rotation.set(0, Math.PI / 2 - a, 0); });
    // enemies
    foes.forEach((m, e) => { if (!G.enemies.includes(e)) { land.remove(m.g); disposeTree(m.g); foes.delete(e); } });
    G.enemies.forEach(e => {
      const m = foeModel(e); m.g.visible = !e.dead; if (e.dead) return;
      const want = e.aware ? Math.atan2(p.y - e.y, p.x - e.x) : Math.atan2(e.wy || 0.0001, e.wx || 0.0001);
      if (m.kind === 'slime') {
        const hop = e.aware ? Math.abs(Math.sin(e.t * 5)) : Math.abs(Math.sin(e.t * 2.5)) * 0.4, sq = 1 + (e.aware ? Math.sin(e.t * 5) * 0.12 : 0);
        m.g.position.set(wx(e.x), hop * 0.28 + deckY(e.x, e.y), wz(e.y)); m.g.rotation.set(0, Math.PI / 2 - want, 0); m.body.scale.set(sq, 0.9 / sq, sq);
        m.body.material.emissive.set(e.flash > 0 ? '#ffffff' : '#000000'); m.body.material.emissiveIntensity = e.flash > 0 ? 0.8 : 0;
      } else {
        // wolves face +x in their own frame
        let d = (want - m.yaw); d = Math.atan2(Math.sin(d), Math.cos(d)); m.yaw += d * Math.min(1, dt * 8);
        m.g.position.set(wx(e.x), deckY(e.x, e.y), wz(e.y)); m.g.rotation.set(0, -m.yaw, 0);
        const run = e.aware || (e.wx || e.wy) ? Math.sin(e.t * 16) * 0.55 : 0;
        m.legs.forEach((l, i) => l.rotation.z = (i % 2 ? run : -run));
        m.body.rotation.z = e.lunge > 0 ? 0.18 : 0; m.tail.rotation.z = 1.0 + Math.sin(e.t * 9) * 0.2;
        m.mats.forEach(mm => { mm.emissive.set('#ffffff'); mm.emissiveIntensity = e.flash > 0 ? 0.7 : 0; });
      }
    });
    // bolts
    bolts.forEach(b => b.visible = false); boltLight.intensity = 0;
    G.bolts.slice(0, bolts.length).forEach((b, i) => { const m = bolts[i]; m.visible = true; m.position.set(wx(b.x), 0.5, wz(b.y)); if (i === 0) { boltLight.position.copy(m.position); boltLight.intensity = 3; } });
    // Ledger cards
    if (cardQueue.length && cards.length < 2) spawnCard(cardQueue.shift());
    cards.forEach(c => {
      c.t += dt;
      const pop = K.ease.outBack ? K.ease.outBack(K.clamp(c.t / 0.35)) : K.clamp(c.t / 0.35), out = K.smooth(2.6, 3.0, c.t);
      c.s.g.scale.setScalar(Math.max(0.001, 0.62 * pop * (1 - out)));
      c.s.g.position.set(kg.position.x + 0.6 + c.slot * 0.35, 0, kg.position.z - 0.3 - c.slot * 1.25);
      c.s.flip.rotation.x = Math.PI * K.smooth(0.35, 0.75, c.t);
    });
    cards = cards.filter(c => { if (c.t > 3.05) { land.remove(c.s.g); disposeTree(c.s.g); return false; } return true; });
  }

  // ---------------------------------------------------------------- screen mapping
  // game pixel position (+ height in model units) -> CSS pixels on screen
  R.project = function (px, py, h = 0) {
    if (!S) return { x: 0, y: 0 };
    const v = new THREE.Vector3(wx(px), h, wz(py)); camera.updateMatrixWorld(); v.project(camera);
    return { x: (v.x + 1) / 2 * innerWidth, y: (1 - v.y) / 2 * innerHeight, behind: v.z > 1 };
  };
  // CSS pixels -> game pixel position on the ground
  R.ground = function (mx, my) {
    const ray = new THREE.Raycaster(); ray.setFromCamera(new THREE.Vector2(mx / innerWidth * 2 - 1, -(my / innerHeight * 2 - 1)), camera);
    const o = ray.ray.origin, d = ray.ray.direction; if (Math.abs(d.y) < 1e-6) return null;
    const k = -o.y / d.y, x = o.x + d.x * k, z = o.z + d.z * k;
    return { x: (x + A.MW / 2) / A.U * T, y: (z + A.MD / 2) / A.U * T };
  };
  // the 2D overlay (particles, floating text, health bars) maps game pixels through this: an affine fit around a point
  R.overlayTransform = function (px, py, h = 0.45) {
    const o = R.project(px, py, h), ex = R.project(px + T, py, h), ey = R.project(px, py + T, h);
    return [(ex.x - o.x) / T, (ex.y - o.y) / T, (ey.x - o.x) / T, (ey.y - o.y) / T, o.x - (ex.x - o.x) / T * px - (ey.x - o.x) / T * py, o.y - (ex.y - o.y) / T * px - (ey.y - o.y) / T * py];
  };
  R.reset = function () { cam.init = false; cards.forEach(c => { land.remove(c.s.g); disposeTree(c.s.g); }); cards = []; cardQueue = []; };
})();
