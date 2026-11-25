// Aetherbound: generated audio (no files). Web Audio only.
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

  A.sfx = function (name) {
    if (!ctx || A.muted) return;
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
  };

  // Ambience: 'rain' (intro city), 'forest' (village day), 'void', or null.
  A.ambience = function (kind) {
    if (!ctx) return;
    ambNodes.forEach(n => { try { n.stop(); } catch (e) {} });
    ambNodes = [];
    ambGain.gain.cancelScheduledValues(ctx.currentTime);
    ambGain.gain.setValueAtTime(0, ctx.currentTime);
    if (!kind) return;
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(4); src.loop = true;
    const f = ctx.createBiquadFilter();
    if (kind === 'rain') { f.type = 'highpass'; f.frequency.value = 1400; }
    else if (kind === 'forest') { f.type = 'bandpass'; f.frequency.value = 500; f.Q.value = 0.4; }
    else { f.type = 'lowpass'; f.frequency.value = 180; }
    src.connect(f); f.connect(ambGain); src.start();
    ambNodes.push(src);
    // Drone pad under it.
    const base = kind === 'void' ? 55 : kind === 'rain' ? 73.4 : 98;
    [1, 1.5, 2.01].forEach(m => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = base * m;
      g.gain.value = kind === 'forest' ? 0.012 : 0.03;
      o.connect(g); g.connect(ambGain); o.start();
      ambNodes.push(o);
    });
    const target = kind === 'rain' ? 0.35 : kind === 'forest' ? 0.16 : 0.5;
    ambGain.gain.linearRampToValueAtTime(target, ctx.currentTime + 1.5);
    // Forest birds.
    if (kind === 'forest') {
      const bird = () => {
        if (!ambNodes.length || A._amb !== 'forest') return;
        const f0 = 1800 + Math.random() * 1600;
        for (let i = 0; i < 3; i++) tone(f0 * (1 + i * 0.08), 0.08, 'sine', 0.025, 1.2, i * 0.1);
        A._birdT = setTimeout(bird, 2500 + Math.random() * 5000);
      };
      clearTimeout(A._birdT);
      A._birdT = setTimeout(bird, 1500);
    }
    A._amb = kind;
  };

  AB.Audio = A;
})();
