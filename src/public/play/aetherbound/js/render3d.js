// Aetherbound: the 3D view. Thornwick and the Ashwood as one floating model tile in the "Tiny Diorama" look
// (STAGE kit + three.js). The game logic still runs in 2D pixel space; this file mirrors it into the model each frame.
(function () {
  const R = { ok: false, mode: 'off' };
  AB.R3 = R;
  const T = AB.TILE;
  let A, H, PAL, wx, wz, THREE, K;
  let S = null, cv = null, building = false, lastAspect = 0;
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
    waterTex = K.canvasTex(256, 128, (ctx, Wc, Hc) => { ctx.fillStyle = PAL.water; ctx.fillRect(0, 0, Wc, Hc); ctx.fillStyle = 'rgba(255,255,255,0.35)'; for (let i = 0; i < 6; i++) ctx.fillRect(20 + i * 40, 30 + (i % 3) * 25, 22, 4); });
    waterTex.wrapS = THREE.RepeatWrapping;
    H.ribbon(land, pts, { width: 1.65, height: 0.08, texture: waterTex, period: 1.4 });
    land.children[land.children.length - 1].material.roughness = 0.2;
    // bridge
    const bridge = new THREE.Group(); bridge.position.set(wx(Wd.riverX(21) * T), 0, wz(21.5 * T)); land.add(bridge);
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

  // ---------------------------------------------------------------- per frame
  // mode: 'title' (the model turns slowly behind the menu) or 'play' (follow Kayden)
  R.frame = function (G, dt) {
    if (!R.ok || !S) return;
    const t = G.t || 0, Wd = AB.World, Ls = AB.Ledger.S;
    cv.style.visibility = R.mode === 'off' ? 'hidden' : 'visible';
    if (R.mode === 'off') return;
    R.titleT = (R.titleT || 0) + dt;
    // ambient life
    waterTex.offset.x -= dt * 0.25;
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
    kg.position.set(wx(p.x), bob, wz(p.y)); kg.rotation.set(0, Math.PI / 2 - p.face, 0);
    if (p.dashT > 0) kg.rotateX(0.35);
    const sw = p.swing > 0 ? p.swing / 0.22 : 0;
    if (sw > 0) { kay.sword.position.set(0.0, 0.42, 0.12); kay.sword.rotation.set(Math.PI / 2, 0, (sw - 0.5) * 2.6); }
    else { kay.sword.position.set(0.12, 0.3, 0); kay.sword.rotation.set(0, 0, 0); }
    kay.sword.children[0].material = H.paint(Ls.flags.swordUp ? '#c9ccd1' : PAL.kraft);
    glow.position.set(kg.position.x, 1.0, kg.position.z); glow.intensity = 0.6 + 2.2 * K.smooth(0.3, 1, AB.World.depth(p.x));
    // villagers
    G.npcs.forEach(n => { const m = npcModel(n); m.g.visible = n.visible !== false; m.g.position.set(wx(n.x), 0, wz(n.y)); const a = Math.atan2(p.y - n.y, p.x - n.x); m.g.rotation.set(0, Math.PI / 2 - a, 0); });
    // enemies
    foes.forEach((m, e) => { if (!G.enemies.includes(e)) { land.remove(m.g); disposeTree(m.g); foes.delete(e); } });
    G.enemies.forEach(e => {
      const m = foeModel(e); m.g.visible = !e.dead; if (e.dead) return;
      const want = e.aware ? Math.atan2(p.y - e.y, p.x - e.x) : Math.atan2(e.wy || 0.0001, e.wx || 0.0001);
      if (m.kind === 'slime') {
        const hop = e.aware ? Math.abs(Math.sin(e.t * 5)) : Math.abs(Math.sin(e.t * 2.5)) * 0.4, sq = 1 + (e.aware ? Math.sin(e.t * 5) * 0.12 : 0);
        m.g.position.set(wx(e.x), hop * 0.28, wz(e.y)); m.g.rotation.set(0, Math.PI / 2 - want, 0); m.body.scale.set(sq, 0.9 / sq, sq);
        m.body.material.emissive.set(e.flash > 0 ? '#ffffff' : '#000000'); m.body.material.emissiveIntensity = e.flash > 0 ? 0.8 : 0;
      } else {
        // wolves face +x in their own frame
        let d = (want - m.yaw); d = Math.atan2(Math.sin(d), Math.cos(d)); m.yaw += d * Math.min(1, dt * 8);
        m.g.position.set(wx(e.x), 0, wz(e.y)); m.g.rotation.set(0, -m.yaw, 0);
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
