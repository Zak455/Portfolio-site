// Aetherbound: the opening, shot as a film in the diorama look. Same timeline and story beats as intro.js
// (which still owns timing, voice, input and the 2D type on top); this file builds the sets and moves the camera.
(function () {
  const X = { ok: false };
  AB.Intro3D = X;
  let THREE, K, A, H, PAL, S = null, cv = null, scene, camera, fx, built = false;
  const sets = {};
  let rain, rainPos = [], pages, pageData = [], myPage, myPageMat, car, carBeams = [], carSpots = [], man, kid, umbrella, phoneMat, neonLight;
  let roomFire, roomFireLight, windowLight, mother, father, orb, orbLight, kid1, kid3, kid5, babyMira, motherYard, voidLight;
  const T0 = { city: 0, void: 21.0, birth: 36, boot: 48.3 };

  // ---------------------------------------------------------------- boot
  X.init = function () {
    if (built) return X.ok;
    built = true;
    try {
      THREE = window.THREE; K = window.K; A = window.AetherDiorama;
      if (!THREE || !K || !A) return false;
      const test = document.createElement('canvas');
      if (!(test.getContext('webgl2') || test.getContext('webgl'))) return false;
      PAL = A.PAL; H = A.helpers;
      cv = document.createElement('canvas'); cv.id = 'gl-intro'; cv.setAttribute('aria-hidden', 'true');
      cv.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;display:block;visibility:hidden';
      const game = document.getElementById('game'); game.parentNode.insertBefore(cv, game);
      const mobile = Math.min(innerWidth, innerHeight) < 600, budget = mobile ? 0.8e6 : 1.5e6, dpr = Math.min(1.5, devicePixelRatio || 1);
      let w = innerWidth * dpr, h = innerHeight * dpr; const k = Math.min(1, Math.sqrt(budget / (w * h)));
      S = K.createStage(cv, { id: 'aetherbound-opening', duration: 1e9, fonts: [], render: { samples: 1, shutter: 0, tone: 'filmic', exposure: 1.0, bloom: 0.6, bloomThreshold: 0.85, bloomRadius: 1.2, vignette: 0.5, grain: 0.045, ca: 0.012, saturation: 1.05, contrast: 1.08, fov: 30, near: 0.1, far: 700, background: '#05070c' } }, { samples: 1, width: Math.round(w * k), height: Math.round(h * k) });
      scene = S.scene; camera = S.camera;
      S.setApi({ update() {} });
      fx = S.addFilter(`uniform float focus, amt, radial, flash, fade, bars, warm;
        void main(){
          vec2 uv = vUv; float d = radial > 0.5 ? length((uv - vec2(0.5, focus)) * vec2(res.x / res.y, 1.0)) * 0.8 : abs(uv.y - focus);
          float r = amt * smoothstep(0.04, 0.5, d) * 10.0 * res.y / 900.0;
          vec3 c = texture2D(tex, uv).rgb;
          if (r > 0.35) { vec3 acc = c; float wt = 1.0;
            for (int i = 0; i < 22; i++) { float a = float(i) * 2.39996; float rr = sqrt((float(i) + 0.5) / 22.0) * r; acc += texture2D(tex, uv + vec2(cos(a), sin(a)) * rr / res).rgb; wt += 1.0; }
            c = acc / wt; }
          c = mix(c, c * vec3(1.06, 0.98, 0.86), warm);
          c = mix(c, vec3(1.0), flash); c *= 1.0 - fade;
          if (uv.y < bars || uv.y > 1.0 - bars) c = vec3(0.0);
          gl_FragColor = vec4(c, 1.0);
        }`, { focus: { value: 0.5 }, amt: { value: 0 }, radial: { value: 0 }, flash: { value: 0 }, fade: { value: 0 }, bars: { value: 0.1 }, warm: { value: 0 } });
      K.env(S, { top: '#101833', horizon: '#1a2236', bottom: '#06070a', intensity: 0.25 });
      buildCity(); buildVoid(); buildRoom(); buildYard(); buildBarn();
      X.ok = true;
    } catch (e) { console.warn('3D opening unavailable', e); X.ok = false; }
    return X.ok;
  };
  X.show = function (on) { if (cv) cv.style.visibility = on ? 'visible' : 'hidden'; };

  // helpers ------------------------------------------------------------
  const ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const lerp = (a, b, k) => a + (b - a) * k;
  const lerp3 = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];
  const seg = (t, a, b) => ease(K.clamp((t - a) / (b - a)));
  function glow(hex, k) { return new THREE.MeshBasicMaterial({ color: new THREE.Color(hex).multiplyScalar(k), toneMapped: false }); }
  function group(name, x) { const g = new THREE.Group(); g.position.x = x; scene.add(g); sets[name] = g; g.visible = false; return g; }
  function pointLight(parent, col, power, dist, p) { const l = new THREE.PointLight(col, power, dist, 2); l.position.set(p[0], p[1], p[2]); parent.add(l); return l; }

  // ---------------------------------------------------------------- CITY: a rainy block at 23:47
  function buildCity() {
    const g = group('city', 0);
    const asphalt = new THREE.MeshPhysicalMaterial({ color: '#1e222c', roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.08 });
    H.put(g, new THREE.BoxGeometry(60, 0.4, 14), asphalt, [0, -0.2, 0]);
    for (const s of [-1, 1]) H.put(g, new THREE.BoxGeometry(60, 0.5, 5), new THREE.MeshPhysicalMaterial({ color: '#2a2f39', roughness: 0.35, clearcoat: 0.6 }), [0, -0.15, s * 9.5]);
    for (const s of [-1, 1]) H.put(g, new THREE.BoxGeometry(60, 0.12, 0.25), '#4a505c', [0, 0.06, s * 7]);
    for (let i = 0; i < 9; i++) H.put(g, new THREE.BoxGeometry(0.55, 0.012, 3.4), new THREE.MeshStandardMaterial({ color: '#d8dde4', roughness: 0.4 }), [-2.4 + i * 0.6, 0.006, -1.5]);
    for (let i = -14; i <= 14; i++) if (Math.abs(i) > 3) H.put(g, new THREE.BoxGeometry(1.3, 0.012, 0.1), new THREE.MeshStandardMaterial({ color: '#b8a560', roughness: 0.5 }), [i * 2, 0.006, 1.2]);
    // buildings with lit windows
    const rng = K.rng(11), lit = [], dark = [];
    const winG = new THREE.PlaneGeometry(0.34, 0.46);
    for (const side of [-1, 1]) {
      let x = -30;
      while (x < 30) {
        const bw = 2.6 + rng() * 3, bh = (side < 0 ? 5 : 3.5) + rng() * (side < 0 ? 9 : 5), bd = 4;
        const col = ['#2c3449', '#363b52', '#3b3046', '#2c3d44'][Math.floor(rng() * 4)];
        const z = side * (12 + bd / 2);
        H.box(g, bw - 0.12, bh, bd, col, [x + bw / 2, bh / 2 - 0.2, z], 0.05);
        const fz = z - side * (bd / 2 + 0.01);
        for (let wy = 1.2; wy < bh - 0.6; wy += 1.05) for (let wx = x + 0.6; wx < x + bw - 0.5; wx += 0.75) (rng() < 0.32 ? lit : dark).push([wx, wy, fz, side]);
        x += bw;
      }
    }
    const mk = (arr, mat) => { const m = new THREE.InstancedMesh(winG, mat, Math.max(1, arr.length)); arr.forEach((p, i) => K.place(m, i, [p[0], p[1], p[2]], [0, p[3] < 0 ? 0 : Math.PI, 0], 1)); g.add(m); return m; };
    mk(lit, glow('#ffc98a', 1.6)); mk(dark, new THREE.MeshStandardMaterial({ color: '#0d1018', roughness: 0.2, metalness: 0.2 }));
    // neon sign over a corner shop
    const neonTex = K.canvasTex(512, 128, (ctx, W, Hh) => { ctx.font = '700 86px "JetBrains Mono", monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#ffffff'; ctx.fillText('OPEN 24H', W / 2, Hh / 2 + 4); });
    const neon = H.put(g, new THREE.PlaneGeometry(3.2, 0.8), new THREE.MeshBasicMaterial({ map: neonTex, color: new THREE.Color('#ff3a48').multiplyScalar(3), transparent: true, toneMapped: false }), [5.5, 3.2, -11.96], null, false);
    neonLight = pointLight(g, '#ff3040', 6, 9, [5.5, 3, -10.6]);
    // shop window spilling warm light onto the wet pavement
    H.put(g, new THREE.PlaneGeometry(3.6, 1.5), glow('#ffd9a8', 1.1), [5.5, 1.0, -11.96], null, false);
    H.box(g, 4.2, 0.12, 1.1, '#7a1f27', [5.5, 1.95, -11.45], 0.04, [0.18, 0, 0]);
    H.box(g, 4.0, 0.2, 0.1, '#1a1d25', [5.5, 0.15, -11.92], 0.02);
    pointLight(g, '#ffcf96', 30, 12, [5.5, 1.4, -10.4]);
    // streetlamps
    [[-9, -7.6], [-4.4, -7.6], [6, 7.6]].forEach(([x, z], i) => {
      H.put(g, new THREE.CylinderGeometry(0.06, 0.08, 4.2, 10), '#3a3f4a', [x, 2.1, z]);
      H.put(g, new THREE.BoxGeometry(0.9, 0.08, 0.1), '#3a3f4a', [x, 4.15, z + (z < 0 ? 0.4 : -0.4)], [0, Math.PI / 2, 0]);
      H.put(g, new THREE.SphereGeometry(0.16, 16, 10), glow('#ffd29a', 4), [x, 4.0, z + (z < 0 ? 0.8 : -0.8)], null, false);
      if (i === 1) { const sp = K.spot(S, { pos: [0, 0, 0], color: '#ffc98a', power: 320, angle: 0.62, penumbra: 0.7, mapSize: 1024 }); g.add(sp); g.add(sp.target); sp.position.set(x, 3.95, z + 0.8); sp.target.position.set(x, 0, z + 1.2); }
      else pointLight(g, '#ffc07a', 40, 14, [x, 3.8, z + (z < 0 ? 0.8 : -0.8)]);
    });
    // moonlight
    const moon = K.sun(S, { pos: [-12, 18, 10], color: '#8ea4e6', power: 1.0, size: 20, mapSize: 1024, far: 80 });
    sets.cityLights = [moon];
    // the man, the kid, the phone
    man = A.villager(g, '#4a5160', 'hair', 1.6); man.position.set(-2.6, 0.1, -7.9); man.rotation.y = Math.PI;
    phoneMat = glow('#bfe0ff', 2.2);
    H.put(man, new THREE.BoxGeometry(0.1, 0.16, 0.015), phoneMat, [0.1, 0.42, 0.2], [-0.6, 0, 0], false);
    pointLight(man, '#9fc8ff', 1.6, 2.2, [0.1, 0.5, 0.35]);
    pointLight(g, '#7f9cff', 18, 9, [-5, 3, -4]);
    kid = A.villager(g, '#f2c230', 'cap', 0.95); kid.position.set(2.6, 0.1, 7.4); kid.rotation.y = Math.PI;
    umbrella = new THREE.Group(); kid.add(umbrella); umbrella.position.set(0, 0.62, 0);
    H.put(umbrella, new THREE.ConeGeometry(0.42, 0.22, 16, 1, true), new THREE.MeshStandardMaterial({ color: '#2f7fd0', roughness: 0.4, side: THREE.DoubleSide }), [0, 0.32, 0]);
    H.put(umbrella, new THREE.CylinderGeometry(0.01, 0.01, 0.42, 6), '#ddd', [0, 0.15, 0]);
    // the car
    car = new THREE.Group(); g.add(car);
    H.box(car, 3.6, 0.7, 1.7, '#22262f', [0, 0.55, 0], 0.18);
    H.box(car, 2.0, 0.6, 1.5, '#1a1d24', [-0.2, 1.15, 0], 0.2);
    H.put(car, new THREE.BoxGeometry(1.7, 0.42, 1.52), new THREE.MeshPhysicalMaterial({ color: '#2b3a4a', roughness: 0.05, clearcoat: 1 }), [-0.2, 1.16, 0], null, false);
    for (const [x, z] of [[-1.2, 0.8], [1.2, 0.8], [-1.2, -0.8], [1.2, -0.8]]) H.put(car, new THREE.CylinderGeometry(0.34, 0.34, 0.26, 18), '#0b0c10', [x, 0.34, z], [Math.PI / 2, 0, 0]);
    for (const z of [-0.55, 0.55]) {
      H.put(car, new THREE.SphereGeometry(0.13, 14, 10), glow('#fff6dc', 8), [-1.82, 0.62, z], null, false);
      const beam = new THREE.Mesh(new THREE.ConeGeometry(1.6, 9, 24, 1, true), new THREE.MeshBasicMaterial({ color: '#fff3d6', transparent: true, opacity: 0.05, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
      beam.rotation.z = -Math.PI / 2; beam.position.set(-6.3, 0.6, z); car.add(beam); carBeams.push(beam);
      const sp = new THREE.SpotLight('#fff1d0', 0, 40, 0.45, 0.5, 1.4); sp.position.set(-1.9, 0.62, z); sp.target.position.set(-12, 0, z); car.add(sp, sp.target); carSpots.push(sp);
    }
    car.position.set(28, 0, 2.6);
    // rain: instanced streaks in a box around the camera's target
    rain = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.006, 0.006, 0.42, 3), new THREE.MeshBasicMaterial({ color: '#aac0e6', transparent: true, opacity: 0.38, depthWrite: false }), 1400);
    for (let i = 0; i < 1400; i++) rainPos.push([rng() * 26 - 13, rng() * 12, rng() * 22 - 11, 9 + rng() * 5]);
    rain.frustumCulled = false; g.add(rain);
  }

  // ---------------------------------------------------------------- VOID: a filing system of lives
  function buildVoid() {
    const g = group('void', 400);
    const pageTex = K.canvasTex(256, 340, (ctx, W, Hh) => { ctx.fillStyle = '#efe6d2'; ctx.fillRect(0, 0, W, Hh); ctx.fillStyle = 'rgba(40,40,50,0.55)'; for (let i = 0; i < 16; i++) ctx.fillRect(26, 36 + i * 17, 140 + ((i * 53) % 70), 5); ctx.fillStyle = '#c8323c'; ctx.fillRect(26, 310, 90, 8); });
    const pm = new THREE.MeshStandardMaterial({ map: pageTex, roughness: 0.8, emissive: '#f3e8cf', emissiveIntensity: 0.25, emissiveMap: pageTex, side: THREE.DoubleSide });
    pages = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.6, 0.8), pm, 900); pages.frustumCulled = false; g.add(pages);
    const rng = K.rng(5);
    for (let i = 0; i < 900; i++) { const a = rng() * 6.283, r = 1.6 + Math.pow(rng(), 0.7) * 9; pageData.push({ x: Math.cos(a) * r, y: Math.sin(a) * r * 0.75, z: -rng() * 120, rx: rng() * 6, ry: rng() * 6, vr: (rng() - 0.5) * 0.6, s: 0.6 + rng() * 0.8 }); }
    const myTex = K.canvasTex(512, 680, (ctx, W, Hh) => {
      ctx.fillStyle = '#f6eed9'; ctx.fillRect(0, 0, W, Hh);
      ctx.strokeStyle = '#c8323c'; ctx.lineWidth = 10; ctx.strokeRect(14, 14, W - 28, Hh - 28);
      ctx.fillStyle = '#c8323c'; ctx.font = '700 30px "JetBrains Mono", monospace'; ctx.textAlign = 'center'; ctx.fillText('ENTRY 2026-Δ-00', W / 2, 80);
      ctx.fillStyle = 'rgba(40,40,50,0.6)'; for (let i = 0; i < 3; i++) ctx.fillRect(60, 130 + i * 34, 230 - i * 60, 9);
      ctx.fillStyle = 'rgba(40,40,50,0.12)'; for (let i = 3; i < 15; i++) ctx.fillRect(60, 130 + i * 34, 390, 2);
    });
    myPageMat = new THREE.MeshStandardMaterial({ map: myTex, emissive: '#ffffff', emissiveMap: myTex, emissiveIntensity: 0.4, roughness: 0.7, side: THREE.DoubleSide });
    myPage = H.put(g, new THREE.PlaneGeometry(1.5, 2.0), myPageMat, [0, 0, -40], null, false);
    voidLight = pointLight(g, '#ff4a50', 0, 12, [0, 0, -38]);
    pointLight(g, '#8fa6ff', 3, 60, [0, 6, -10]);
  }

  // ---------------------------------------------------------------- ROOM: the rebirth, a warm cottage at night
  function buildRoom() {
    const g = group('room', 800);
    H.put(g, new THREE.BoxGeometry(9, 0.3, 7), '#9a6b45', [0, -0.15, 0]);
    for (let i = -4; i <= 4; i++) H.put(g, new THREE.BoxGeometry(0.02, 0.01, 7), '#7c5233', [i, 0.005, 0], null, false);
    H.box(g, 9, 4, 0.3, '#e9d8b8', [0, 2, -3.5], 0.04); H.box(g, 0.3, 4, 7, '#e2cfac', [-4.5, 2, 0], 0.04);
    for (let x = -4; x <= 4; x += 2) H.box(g, 0.22, 0.22, 7.2, '#7a5238', [x, 3.9, 0], 0.03);
    // window with a blue night outside
    H.put(g, new THREE.PlaneGeometry(1.2, 1.4), glow('#3a5a9a', 0.9), [2.2, 2.3, -3.33], null, false);
    H.box(g, 1.4, 0.12, 0.2, '#7a5238', [2.2, 1.55, -3.3], 0.03); H.box(g, 0.08, 1.5, 0.12, '#7a5238', [2.2, 2.3, -3.3], 0.02);
    windowLight = K.spot(S, { pos: [0, 0, 0], color: '#9fb8ff', power: 0, angle: 0.7, penumbra: 0.8, mapSize: 1024 }); g.add(windowLight, windowLight.target);
    windowLight.position.set(2.6, 3.2, -2.5); windowLight.target.position.set(0.4, 0, 0.8);
    // hearth
    H.box(g, 2.2, 1.6, 0.9, '#a9a9b0', [-2.6, 0.8, -3.0], 0.08); H.box(g, 1.3, 0.9, 0.6, '#3a2a22', [-2.6, 0.55, -2.75], 0.06);
    const cf = A.campfire(g, { x: 0, y: 0 }); cf.g.position.set(-2.6, 0.1, -2.5); cf.g.scale.setScalar(1.3); roomFire = cf;
    roomFireLight = pointLight(g, '#ff9a4a', 14, 9, [-2.6, 0.9, -1.9]);
    // shelf, jars, a rug, the cradle
    H.box(g, 1.6, 0.08, 0.4, '#7a5238', [-4.25, 2.2, 0.8], 0.02, [0, Math.PI / 2, 0]);
    [['#5fa574', 0.2], ['#c9a26a', 0.6], ['#8fd0e0', 1.0], ['#b9674b', 1.4]].forEach(([c, z]) => H.put(g, new THREE.CylinderGeometry(0.1, 0.1, 0.24, 12), c, [-4.2, 2.36, z]));
    H.put(g, new THREE.CylinderGeometry(1.5, 1.5, 0.02, 40), '#b9674b', [0.2, 0.01, 0.6]);
    const crib = new THREE.Group(); crib.position.set(0.3, 0, 1.4); g.add(crib); sets.crib = crib;
    H.box(crib, 1.4, 0.5, 0.8, '#c9a26a', [0, 0.45, 0], 0.18); H.box(crib, 1.2, 0.1, 0.6, '#f6ebd8', [0, 0.7, 0], 0.05);
    for (const s of [-1, 1]) H.box(crib, 0.1, 0.7, 0.9, '#a4774c', [s * 0.7, 0.35, 0], 0.04, [0, 0, s * 0.1]);
    // parents
    mother = A.villager(g, '#5f8fb0', 'hair', 2.0); mother.position.set(0.1, 0, 0.1); mother.rotation.set(0.32, 0.05, 0);
    H.put(mother, new THREE.SphereGeometry(0.18, 16, 10, 0, 7, 0, 1.9), '#c9a46a', [0, 0.6, -0.04], [-0.5, 0, 0]);
    father = A.villager(g, '#5b6676', 'hair', 2.2); father.position.set(-1.7, 0, -1.2); father.rotation.y = 0.6;
    // the boy at five, a sister, a mother in the yard are built in their own sets
    kid1 = A.villager(g, PAL.accent, 'hair', 0.75); kid1.position.set(1.4, 0, 1.6); kid1.rotation.y = -0.9; kid1.visible = false;
    pointLight(g, '#ffc489', 7, 4, [0.9, 1.7, 1.3]);
    sets.roomLights = [roomFireLight];
  }
  function buildYard() {
    const g = group('yard', 1200);
    const land = H.tile(g, { w: 10, d: 7, r: 0.8 });
    const tx = K.canvasTex(256, 256, (ctx) => { ctx.fillStyle = PAL.grass; ctx.fillRect(0, 0, 256, 256); ctx.fillStyle = '#b3d38f'; for (let i = 0; i < 60; i++) ctx.fillRect(Math.random() * 256, Math.random() * 256, 4, 4); });
    H.put(land, new THREE.PlaneGeometry(10, 7), new THREE.MeshStandardMaterial({ map: tx, roughness: 0.95 }), [0, 0.004, 0], [-Math.PI / 2, 0, 0], false);
    const c = A.cottage(land, { x: 0, y: 0, w: 4 * 32, h: 3 * 32, name: 'Break house' }, K.rng(2)); c.g.position.set(-1.8, 0, -1.6);
    if (c.wins) c.wins.forEach(m => m.emissiveIntensity = 1.6);
    H.tree(land, 3.4, -2.2, 1.6, 'round'); H.tree(land, 4.1, 0.6, 1.3, 'fir'); H.tree(land, -4.2, 1.8, 1.4, 'round');
    for (let i = 0; i < 7; i++) H.box(land, 0.08, 0.5, 0.08, PAL.timber, [-4 + i * 0.9, 0.25, 2.9], 0.02);
    H.box(land, 6, 0.06, 0.06, PAL.timber, [-1.3, 0.42, 2.9], 0.02);
    motherYard = A.villager(land, '#5f8fb0', 'hair', 1.05); motherYard.position.set(0.6, 0, 0.6); motherYard.rotation.y = 0.5;
    H.put(motherYard, new THREE.SphereGeometry(0.18, 16, 10, 0, 7, 0, 1.9), '#c9a46a', [0, 0.6, -0.04], [-0.5, 0, 0]);
    babyMira = H.put(motherYard, new THREE.SphereGeometry(0.11, 14, 10), '#f2a7c0', [0.02, 0.38, 0.18]);
    kid3 = A.villager(land, PAL.accent, 'hair', 0.6); kid3.position.set(1.2, 0, 0.9); kid3.rotation.y = -0.6;
    sets.yardLights = [K.sun(S, { pos: [1200 - 8, 9, 6], target: [1200, 0, 0], color: '#ffc995', power: 0, size: 9, mapSize: 1024 })];
  }
  function buildBarn() {
    const g = group('barn', 1600);
    const land = H.tile(g, { w: 8, d: 6, r: 0.8 });
    H.put(land, new THREE.PlaneGeometry(8, 6), '#86a868', [0, 0.004, 0], [-Math.PI / 2, 0, 0], false);
    H.box(land, 6, 2.6, 0.3, '#8a4b3a', [0, 1.3, -2.2], 0.05);
    for (let x = -2.8; x <= 2.8; x += 0.4) H.box(land, 0.04, 2.5, 0.04, '#6e382c', [x, 1.3, -2.04], 0.01);
    for (const [x, z] of [[-2.2, -1.4], [-1.4, -1.6], [2.3, -1.2]]) H.box(land, 0.9, 0.6, 0.6, '#d9b45a', [x, 0.3, z], 0.15);
    H.tree(land, 3.2, 1.6, 1.5, 'fir'); H.tree(land, -3.2, 1.2, 1.2, 'round');
    kid5 = A.villager(land, PAL.accent, 'hair', 0.72); kid5.position.set(0, 0, 0.3); kid5.rotation.y = 0.2;
    orb = H.put(land, new THREE.SphereGeometry(0.16, 20, 14), new THREE.MeshStandardMaterial({ color: '#bfe8ff', emissive: PAL.mana, emissiveIntensity: 2.2, roughness: 0.2 }), [0.12, 0.85, 0.62], null, false);
    orbLight = pointLight(land, PAL.mana, 6, 6, [0.12, 0.9, 0.8]);
    sets.barnLights = [K.sun(S, { pos: [1600 + 6, 6, 8], target: [1600, 0, 0], color: '#ff9a6a', power: 0, size: 8, mapSize: 1024 })];
  }

  // ---------------------------------------------------------------- per frame
  // state: { phase, t, montageT, beat, fistT, shake }
  let rainT = 0, fogCity = null, fogVoid = null;
  X.frame = function (st, dt) {
    if (!X.ok) return;
    const t = st.t, ph = st.phase;
    Object.keys(sets).forEach(k => { if (sets[k] && sets[k].isGroup && ['city', 'void', 'room', 'yard', 'barn'].includes(k)) sets[k].visible = false; });
    sets.cityLights.forEach(l => l.intensity = 0); sets.yardLights[0].intensity = 0; sets.barnLights[0].intensity = 0;
    roomFireLight.intensity = 0; windowLight.intensity = 0;
    const R = S.R, u = fx.uniforms;
    u.flash.value = 0; u.fade.value = 0; u.amt.value = 0.6; u.radial.value = 0; u.focus.value = 0.5; u.warm.value = 0;
    const asp = innerWidth / innerHeight; u.bars.value = asp > 1.2 ? Math.max(0, Math.min(0.12, (1 - asp / 2.39) / 2)) : 0.05;
    R.exposure = 1; R.vignette = 0.5; R.saturation = 1.05; R.bloom = 0.6; R.grain = 0.045; R.ca = 0.012; scene.fog = null;
    let pos, tgt, fov = 30, roll = 0;

    if (ph === 'city') {
      sets.city.visible = true; sets.cityLights[0].intensity = 1.0;
      scene.background.set('#0a0f1c'); scene.environmentIntensity = 0.55; R.exposure = 1.45;
      scene.fog = fogCity || (fogCity = new THREE.FogExp2('#0b1020', 0.028));
      R.saturation = 0.9;
      // rain
      rainT += dt;
      const cx = st.camT ? st.camT[0] : 0;
      for (let i = 0; i < rainPos.length; i++) { const r = rainPos[i]; let y = r[1] - rainT * r[3]; y = ((y % 12) + 12) % 12; K.place(rain, i, [r[0] + cx, y, r[2]], [0, 0, 0.12], 1); }
      rain.instanceMatrix.needsUpdate = true;
      neonLight.intensity = 14 * (Math.random() < 0.04 ? 0.2 : 1);
      // the action
      const kidK = seg(t, 12.4, 15.6), manRun = seg(t, 16.6, 18.3);
      kid.position.set(lerp(2.6, 0.2, kidK), 0.1 * (1 - kidK), lerp(7.4, 1.0, kidK)); kid.rotation.y = Math.PI;
      if (t > 17.6) { const k = seg(t, 17.6, 18.4); kid.position.set(lerp(0.2, 0.6, k), 0, lerp(1.0, 4.6, k)); kid.rotation.z = k * 0.4; }
      man.position.set(lerp(-2.6, -0.2, manRun), 0.1 * (1 - manRun), lerp(-7.9, 1.4, manRun)); man.rotation.set(manRun > 0 && manRun < 1 ? 0.35 : 0, manRun > 0 ? 0 : Math.PI, 0);
      umbrella.rotation.z = t > 17.6 ? seg(t, 17.6, 18.4) * 1.4 : 0;
      phoneMat.color.set('#bfe0ff').multiplyScalar(t < 15 ? 2.2 : 0.2);
      const carK = t < 14 ? 0 : t < 17.2 ? Math.pow(seg(t, 14, 17.2), 0.8) : 1 + (t - 17.2) * 0.12;
      car.position.set(lerp(30, 3.2, Math.min(1.08, carK)), 0, 2.6); car.rotation.y = t > 15.2 ? Math.sin(Math.min(1, (t - 15.2) / 2.5) * 1.2) * 0.12 : 0;
      const beam = t > 13.4 ? Math.min(1, (t - 13.4) / 1.2) : 0;
      carSpots.forEach(s => s.intensity = 160 * beam); carBeams.forEach(b => b.material.opacity = 0.05 * beam);
      // cameras
      if (t < 7) { const k = seg(t, 0, 7); pos = lerp3([-16, 13, 20], [-7, 3.6, 7], k); tgt = lerp3([0, 2, -3], [-2.6, 1.2, -6.5], k); fov = 30; }
      else if (t < 12.2) { const k = (t - 7) / 5.2, a = -0.5 + k * 0.7; pos = [-2.6 + Math.sin(a) * 4.6, 1.5 + k * 0.15, -7.9 + Math.cos(a) * 4.6]; tgt = [-2.6, 0.95, -7.9]; fov = 30 - k * 6; u.radial.value = 1; u.amt.value = 1.4; u.focus.value = 0.45; }
      else if (t < 15.2) { const k = seg(t, 12.2, 15.2); pos = lerp3([6, 0.5, 9], [4.5, 0.6, 6], k); tgt = lerp3([1.5, 0.8, 3], [0.5, 0.8, 1.6], k); fov = 34; u.amt.value = 1.1; u.focus.value = 0.55; }
      else if (t < 17.4) { const k = seg(t, 15.2, 17.4); pos = lerp3([-1.2, 0.55, 3.3], [-1.0, 0.5, 3.0], k); tgt = [car.position.x, 0.7, 2.4]; fov = 38 - k * 10; roll = 0.04; u.amt.value = 0.9; R.ca = 0.03; }
      else { const k = seg(t, 17.4, 18.4); pos = lerp3([1.6, 1.0, 9.5], [1.2, 0.9, 6.5], k); tgt = [0.3, 0.9, 2.2]; fov = 24 + k * 22; u.amt.value = 1.2; R.ca = 0.045; }
      if (t > 18.4) { u.flash.value = t < 19.2 ? 1 : Math.max(0, 1 - (t - 19.2) / 0.8); u.fade.value = t > 20 ? Math.min(1, (t - 20) / 0.6) : 0; }
      if (t > 15.2 && t < 18.4) { const sh = 0.012 * seg(t, 15.2, 18.4); pos = [pos[0] + (Math.random() - 0.5) * sh * 4, pos[1] + (Math.random() - 0.5) * sh * 4, pos[2]]; }
    } else if (ph === 'void') {
      sets.void.visible = true; const lt = t - T0.void, ox = 400;
      scene.background.set('#04050a'); scene.environmentIntensity = 0.12; scene.fog = fogVoid || (fogVoid = new THREE.Fog('#04050a', 6, 46));
      R.saturation = 0.85; R.bloom = 0.9;
      const camZ = -lt * 1.6;
      for (let i = 0; i < pageData.length; i++) { const p = pageData[i]; let z = p.z; while (z > camZ + 4) z -= 120; while (z < camZ - 116) z += 120; K.place(pages, i, [p.x + Math.sin(lt * 0.3 + i) * 0.2, p.y + Math.cos(lt * 0.25 + i) * 0.2, z], [p.rx + lt * p.vr, p.ry + lt * p.vr * 0.7, 0], p.s); }
      pages.instanceMatrix.needsUpdate = true;
      const pk = seg(lt, 6, 11);
      myPage.position.set(0, Math.sin(lt * 0.8) * 0.05, camZ - lerp(30, 3.4, pk)); myPage.rotation.set(0, Math.sin(lt * 0.4) * 0.15 * (1 - pk), 0);
      myPageMat.emissiveIntensity = 0.4 + seg(lt, 12, 15) * 6; voidLight.position.set(0, 0, myPage.position.z + 1.5); voidLight.intensity = 4 * pk + seg(lt, 12, 15) * 30;
      pos = [ox + Math.sin(lt * 0.2) * 0.4, 0.3 + Math.sin(lt * 0.15) * 0.3, camZ]; tgt = [ox, 0, camZ - 10]; fov = 40 - pk * 8; roll = Math.sin(lt * 0.2) * 0.05;
      u.radial.value = 1; u.amt.value = 0.9; u.focus.value = 0.5;
      u.fade.value = lt < 1.2 ? 1 - lt / 1.2 : 0; if (lt > 13.6) u.flash.value = seg(lt, 13.6, 15);
    } else if (ph === 'birth' || ph === 'boot' || (ph === 'montage' && st.beat === 0)) {
      sets.room.visible = true; const ox = 800;
      scene.background.set('#120b08'); scene.environmentIntensity = 0.3;
      const fl = 1 + Math.sin(t * 13) * 0.08 + Math.sin(t * 5.7) * 0.06;
      roomFireLight.intensity = 14 * fl; roomFire.f1.scale.set(1, fl, 1); windowLight.intensity = 30;
      R.saturation = 1.12; u.warm.value = 0.5;
      if (ph === 'birth') {
        const lt = t - T0.birth;
        sets.crib.visible = true; mother.visible = true; father.visible = true; kid1.visible = false;
        mother.rotation.x = 0.32 + Math.sin(lt * 0.9) * 0.04;
        pos = [ox + 0.4 + Math.sin(lt * 0.5) * 0.08, 0.95 + Math.sin(lt * 0.7) * 0.04, 1.55]; tgt = [ox + 0.1, 1.7, 0.35]; fov = 50; roll = Math.sin(lt * 0.4) * 0.06;
        u.radial.value = 1; u.focus.value = 0.55; u.amt.value = lerp(4.5, 1.0, seg(lt, 0.5, 6));
        u.fade.value = lt < 2 ? 1 - lt / 2 : lt > 9.5 ? Math.min(1, (lt - 9.5) * 0.6) : 0;
        R.exposure = 0.9 + seg(lt, 0, 3) * 0.7; R.bloom = 1.1;
      } else if (ph === 'boot') {
        const lt = t - T0.boot;
        pos = [ox + 0.4, 0.95, 1.55]; tgt = [ox + 0.1, 1.7, 0.35]; fov = 50; u.radial.value = 1; u.amt.value = 3.2; R.exposure = 0.75; u.fade.value = Math.max(0, 0.4 - lt * 0.1);
      } else {
        const k = seg(st.montageT, 0, 6);
        kid1.visible = true; mother.rotation.x = 0.1; father.visible = false;
        mother.position.set(1.1, 0, 0.5);
        pos = lerp3([ox + 4.6, 2.6, 5.4], [ox + 3.6, 2.0, 4.2], k); tgt = [ox + 1.0, 0.8, 0.9]; fov = 32; u.amt.value = 1.3; u.focus.value = 0.55;
        windowLight.intensity = 140; windowLight.color.set('#ffe7c2'); R.exposure = 1.1;
      }
    } else if (ph === 'montage' && st.beat === 1) {
      sets.yard.visible = true; const ox = 1200, k = seg(st.montageT - 6, 0, 6);
      scene.background.set('#e8b98f'); scene.environmentIntensity = 0.5; sets.yardLights[0].intensity = 3.2;
      kid3.rotation.y = -0.6 + Math.sin(st.montageT * 2) * 0.1; babyMira.position.y = 0.38 + Math.sin(st.montageT * 3) * 0.01;
      pos = lerp3([ox + 5.5, 4.5, 8], [ox + 3.6, 2.4, 5.2], k); tgt = [ox + 0.8, 0.6, 0.7]; fov = 30; u.amt.value = 1.2; u.focus.value = 0.56; u.warm.value = 0.6;
    } else if (ph === 'montage' && st.beat === 2) {
      sets.barn.visible = true; const ox = 1600, mt = st.montageT - 12, k = seg(mt, 0, 6);
      scene.background.set('#4a4f78'); scene.environmentIntensity = 0.35; sets.barnLights[0].intensity = 1.6;
      orb.position.y = 0.85 + Math.sin(mt * 3) * 0.06; orb.scale.setScalar(0.6 + Math.sin(mt * 6) * 0.05 + k * 0.2); orbLight.intensity = 5 + k * 8;
      pos = lerp3([ox + 2.4, 1.2, 4.6], [ox + 1.5, 1.0, 3.2], k); tgt = [ox + 0.1, 0.7, 0.4]; fov = 34; u.radial.value = 1; u.amt.value = 1.6; u.focus.value = 0.52;
    } else { X.show(false); return; }

    X.show(true);
    K.look(camera, pos, tgt, fov, roll);
    st.camT = pos;
    S.seek(0, 1);
  };
  X.dispose = function () { if (!S) return; try { S.renderer.dispose(); S.renderer.forceContextLoss(); } catch (e) {} if (cv) cv.remove(); S = null; X.ok = false; };
})();
