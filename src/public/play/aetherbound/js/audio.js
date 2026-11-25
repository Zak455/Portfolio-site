// Aetherbound audio: recorded one-shots and ambience loops (audio/), narration (voice/),
// with the old Web Audio synth kept as a fallback for anything not loaded yet.
(function () {
  const A = {};
  let ctx = null, master = null, ambGain = null, ambNodes = [];
  A.muted = false;

  A.init = function () {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = A.muted ? 0 : 0.6;
    master.connect(ctx.destination);
    ambGain = ctx.createGain();
    ambGain.gain.value = 0;
    ambGain.connect(master);
    preloadBank();
  };

  // Narration (recorded voice files). HTMLAudio so it works without decoding up front.
  const voices = {};
  let curVoice = null;
  A.voice = function (name) {
    A.stopVoice();
    if (A.muted) return;
    let el = voices[name];
    if (!el) { el = voices[name] = new Audio('voice/' + name + '.mp3'); el.preload = 'auto'; }
    el.currentTime = 0; el.volume = 0.95;
    const p = el.play(); if (p && p.catch) p.catch(() => {});
    curVoice = el;
  };
  A.stopVoice = function () { if (curVoice) { try { curVoice.pause(); } catch (e) {} curVoice = null; } };
  A.preloadVoices = function (names) {
    names.forEach(n => { if (!voices[n]) { const el = new Audio('voice/' + n + '.mp3'); el.preload = 'auto'; voices[n] = el; } });
  };

  A.setMuted = function (m) {
    A.muted = m;
    if (m) A.stopVoice();
    if (master) master.gain.setTargetAtTime(m ? 0 : 0.6, ctx.currentTime, 0.05);
  };

  function noiseBuffer(sec) {
    const b = ctx.createBuffer(1, ctx.sampleRate * sec, ctx.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return b;
  }

  function tone(freq, dur, type, vol, slide, delay) {
    if (!ctx) return;
    const t = ctx.currentTime + (delay || 0);
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(freq, t);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq * slide), t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol || 0.2, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(master);
    o.start(t); o.stop(t + dur + 0.05);
  }

  function noise(dur, vol, freq, q, delay) {
    if (!ctx) return;
    const t = ctx.currentTime + (delay || 0);
    const s = ctx.createBufferSource();
    s.buffer = noiseBuffer(dur + 0.1);
    const f = ctx.createBiquadFilter();
    f.type = 'bandpass'; f.frequency.value = freq || 1200; f.Q.value = q || 1;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol || 0.2, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(master);
    s.start(t); s.stop(t + dur + 0.05);
  }

  function synth(name) {
    switch (name) {
      case 'swing': noise(0.12, 0.25, 2400, 0.8); break;
      case 'hit': noise(0.08, 0.35, 600, 1); tone(140, 0.12, 'square', 0.08, 0.6); break;
      case 'thud': noise(0.1, 0.3, 300, 1); break;
      case 'cast': tone(520, 0.25, 'sine', 0.12, 1.8); noise(0.25, 0.08, 3000, 2); break;
      case 'splash': noise(0.25, 0.25, 1600, 0.7); tone(300, 0.15, 'sine', 0.06, 0.5); break;
      case 'heal': [523, 659, 784].forEach((f, i) => tone(f, 0.4, 'sine', 0.08, 1, i * 0.07)); break;
      case 'pick': tone(880, 0.1, 'triangle', 0.1, 1.3); break;
      case 'chop': noise(0.09, 0.4, 900, 2); tone(90, 0.1, 'square', 0.06, 0.8); break;
      case 'hurt': tone(220, 0.2, 'sawtooth', 0.12, 0.5); break;
      case 'die': tone(300, 0.5, 'sawtooth', 0.12, 0.3); break;
      case 'skill': tone(1046, 0.12, 'square', 0.05, 1); tone(1568, 0.18, 'square', 0.04, 1, 0.06); break;
      case 'level': [392, 523, 659, 784, 1046].forEach((f, i) => tone(f, 0.5, 'triangle', 0.1, 1, i * 0.08)); break;
      case 'glitch':
        for (let i = 0; i < 6; i++) tone(80 + Math.random() * 1600, 0.05, 'square', 0.05, 1, i * 0.04);
        break;
      case 'ui': tone(660, 0.06, 'square', 0.04, 1); break;
      case 'howl': tone(300, 1.6, 'sawtooth', 0.06, 2.2); tone(310, 1.6, 'sine', 0.06, 2.1, 0.05); break;
      case 'brake': noise(1.2, 0.35, 2600, 6); tone(1800, 1.0, 'sawtooth', 0.04, 0.8); break;
      case 'impact': noise(0.6, 0.6, 200, 0.6); tone(60, 0.6, 'sine', 0.3, 0.5); break;
      case 'heartbeat': tone(60, 0.18, 'sine', 0.35, 0.7); tone(55, 0.2, 'sine', 0.3, 0.7, 0.22); break;
    }
  }

  // ---------- Recorded sounds (Sonniss GDC 2024 edits in audio/) ----------
  // name -> [variants, volume, extra layers]. Anything missing falls back to the synth above.
  const BANK = {
    swing: [['sfx-swing', 'sfx-swing2'], 0.45],
    hit: [['sfx-hit1', 'sfx-hit2', 'sfx-slash'], 0.7],
    thud: [['sfx-punch'], 0.6],
    cast: [['sfx-bolt'], 0.55],
    splash: [['sfx-splash'], 0.55],
    heal: [['sfx-heal'], 0.6, ['sfx-water-shimmer', 0.25]],
    pick: [['sfx-pop'], 0.6, ['sfx-rustle', 0.45]],
    chop: [['sfx-chop'], 0.8],
    treefall: [['sfx-treefall'], 0.7, ['sfx-wood-drop', 0.5, 1.1]],
    squelch: [['sfx-squelch'], 0.6],
    shield: [['sfx-shield'], 0.6],
    hurt: [['sfx-punch'], 0.55],
    die: [['c-boom'], 0.7],
    skill: [['ui-confirm'], 0.4],
    level: [['ui-confirm'], 0.5, ['c-gong', 0.45, 0.05]],
    glitch: [['ui-charge'], 0.35],
    ui: [['ui-click'], 0.45],
    pop: [['ui-pop'], 0.45],
    open: [['ui-open'], 0.45],
    page: [['ui-page'], 0.5],
    howl: [['dk-growl-a', 'dk-growl-b', 'dk-snarl'], 0.55],
    brake: [['sfx-horn'], 0.6, ['sfx-carpass', 0.6]],
    horn: [['sfx-horn'], 0.6],
    carpass: [['sfx-carpass'], 0.6],
    impact: [['c-impact'], 0.9, ['c-boom', 0.7]],
    boom: [['c-boom'], 0.8],
    hitc: [['c-hit'], 0.8],
    metal: [['c-metal-boom'], 0.7],
    perc: [['c-perc'], 0.7],
    whoosh: [['c-whoosh'], 0.6],
    riser: [['c-riser'], 0.6],
    strings: [['c-strings'], 0.55],
    reveal: [['c-reveal'], 0.6],
    chorn: [['c-horn'], 0.55],
    gong: [['c-gong'], 0.6],
    searing: [['c-searing'], 0.5],
    underwater: [['c-underwater'], 0.6],
  };
  const bufs = {}, loading = {};
  function load(f) {
    if (bufs[f] || loading[f] || !ctx) return;
    loading[f] = true;
    fetch('audio/' + f + '.mp3').then(r => r.ok ? r.arrayBuffer() : Promise.reject())
      .then(a => new Promise((res, rej) => ctx.decodeAudioData(a, res, rej)))
      .then(b => { bufs[f] = b; }).catch(() => {});
  }
  function preloadBank() {
    for (const k in BANK) { BANK[k][0].forEach(load); if (BANK[k][2]) load(BANK[k][2][0]); }
  }
  function play(f, vol, delay, rate) {
    const b = bufs[f]; if (!b) return false;
    const s = ctx.createBufferSource(); s.buffer = b;
    s.playbackRate.value = rate || 1;
    const g = ctx.createGain(); g.gain.value = vol;
    s.connect(g); g.connect(master);
    s.start(ctx.currentTime + (delay || 0));
    return true;
  }
  const lastAt = {};
  A.sfx = function (name) {
    if (!ctx || A.muted) return;
    const now = ctx.currentTime;
    if (lastAt[name] && now - lastAt[name] < 0.04) return; // no machine-gun stacking
    lastAt[name] = now;
    const e = BANK[name];
    if (e) {
      const v = e[0][Math.floor(Math.random() * e[0].length)];
      const rate = /^(swing|hit|thud|chop|squelch|pick|splash)$/.test(name) ? 0.93 + Math.random() * 0.14 : 1;
      if (play(v, e[1], 0, rate)) {
        if (e[2]) play(e[2][0], e[2][1], e[2][2] || 0);
        return;
      }
    }
    synth(name);
  };

  // ---------- Ambience ----------
  // Recorded loops are 40 s with 2 s fades baked in, so each layer runs two <audio> copies and
  // starts the next copy 2 s before the current one ends: the baked fades make the crossfade.
  const LOOP = { 'forest-day': 0, 'forest-night': 0, 'owls': 0, 'city-rain': 0, 'traffic-night': 0, 'rain-thunder': 0, 'creek': 0, 'wind-trees': 0 };
  const layers = {};
  function layer(name) {
    let L = layers[name];
    if (L) return L;
    const mk = () => { const el = new Audio('audio/amb-' + name + '.mp3'); el.preload = 'auto'; el.volume = 0; return el; };
    L = layers[name] = { a: [mk(), mk()], cur: 0, vol: 0, target: 0, on: false };
    return L;
  }
  function layerTick(L, dt) {
    L.vol += (L.target - L.vol) * Math.min(1, dt * 1.2);
    if (L.target <= 0.001 && L.vol < 0.003) {
      if (L.on) { L.a.forEach(el => { try { el.pause(); } catch (e) {} }); L.on = false; }
      L.vol = 0; return;
    }
    const v = A.muted ? 0 : Math.min(1, L.vol);
    if (!L.on) {
      L.on = true; L.cur = 0;
      const el = L.a[0]; el.currentTime = 2 + Math.random() * 20; const p = el.play(); if (p && p.catch) p.catch(() => {});
    }
    const el = L.a[L.cur], other = L.a[1 - L.cur];
    if (el.duration && el.currentTime > el.duration - 2.05 && other.paused) {
      other.currentTime = 0; const p = other.play(); if (p && p.catch) p.catch(() => {});
      L.cur = 1 - L.cur;
    }
    L.a.forEach(x => { x.volume = x.paused ? 0 : v; });
  }
  let mix = {};
  function setMix(m) {
    mix = m;
    for (const k in LOOP) { if (m[k] || layers[k]) layer(k).target = m[k] || 0; }
  }
  // Forest mix by where the player stands: d is 0 in the village and 1 deep in the Ashwood, r is
  // closeness to the river (0..1).
  A.ambDepth = function (d, r) {
    if (A._amb !== 'forest') return;
    d = Math.max(0, Math.min(1, d)); r = Math.max(0, Math.min(1, r));
    setMix({ 'forest-day': 0.55 * (1 - d * 0.75), 'wind-trees': 0.12 + 0.2 * d, 'forest-night': 0.5 * d, 'owls': d > 0.45 ? 0.35 * (d - 0.45) / 0.55 : 0, 'creek': 0.55 * r });
  };
  let tickId = 0, lastTick = 0;
  function startTick() {
    if (tickId) return;
    lastTick = performance.now();
    tickId = setInterval(() => {
      const n = performance.now(), dt = (n - lastTick) / 1000; lastTick = n;
      for (const k in layers) layerTick(layers[k], dt);
    }, 60);
  }

  // Ambience: 'rain' (intro city), 'forest' (village + Ashwood), 'void', or null.
  let droneNodes = [];
  function drone(kind) {
    droneNodes.forEach(n => { try { n.stop(); } catch (e) {} });
    droneNodes = [];
    ambGain.gain.cancelScheduledValues(ctx.currentTime);
    ambGain.gain.setValueAtTime(0, ctx.currentTime);
    if (kind !== 'void') return;
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(4); src.loop = true;
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 180;
    src.connect(f); f.connect(ambGain); src.start(); droneNodes.push(src);
    [1, 1.5, 2.01].forEach(m => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = 55 * m; g.gain.value = 0.03;
      o.connect(g); g.connect(ambGain); o.start(); droneNodes.push(o);
    });
    ambGain.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 1.5);
  }
  A.ambience = function (kind) {
    if (!ctx) return;
    A._amb = kind;
    startTick();
    drone(kind);
    if (kind === 'rain') setMix({ 'city-rain': 0.75, 'traffic-night': 0.3, 'rain-thunder': 0.35 });
    else if (kind === 'forest') { setMix({ 'forest-day': 0.55, 'wind-trees': 0.12 }); }
    else setMix({});
  };
  A.ambienceCut = function () { for (const k in layers) { const L = layers[k]; L.target = 0; L.vol = 0; } };

  AB.Audio = A;
})();
