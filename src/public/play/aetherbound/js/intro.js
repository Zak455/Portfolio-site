// Aetherbound: the opening. 2026 city, the accident, the Ledger, rebirth, first boot.
(function () {
  const I = {};
  let t = 0, done = null, phase = 'city', waitFist = false, fistT = -1, montageT = -1, offerShown = false;
  let rain = [], pages = [], windows = [], lastDt = 1 / 60;
  const st3 = {};
  // [start, end, text, voice file]. Ends cover the recorded line length.
  const subs = [
    [0.8, 6.4, 'Thirty-four years old. Same rain, same street, same excuses.', 'n01'],
    [7.0, 11.1, 'My mother kept calling. I kept meaning to call back.', 'n02'],
    [12.2, 17.6, 'A kid on the crossing. Headlights. I moved before I thought.', 'n03'],
    [23.0, 27.2, 'So this is what dying looks like. A filing system.', 'n04'],
    [29.0, 33.7, 'My page was almost empty. I had wasted all of it.', 'n05'],
    [36.6, 42.5, 'Warm. Loud. Someone was crying, and I realised it was me.', 'n06'],
    [42.9, 47.9, 'A woman sang words I did not know. One of them was my new name.', 'n07'],
  ];
  const notes = [
    [2.0, 'Mom', 'Are you eating okay?'],
    [4.5, 'Mom', 'Call me back when you can.'],
    [7.5, 'Mom', 'Your dad asked about you.'],
    [10.0, 'System', 'Battery 3%'],
  ];

  function rand(a, b) { return a + Math.random() * (b - a); }

  I.start = function (cb) {
    done = cb; t = 0; phase = 'city'; waitFist = false; fistT = -1; montageT = -1; offerShown = false;
    rain = Array.from({ length: 220 }, () => ({ x: Math.random(), y: Math.random(), s: rand(0.6, 1.4) }));
    pages = Array.from({ length: 40 }, (_, i) => ({ x: Math.random(), y: Math.random(), z: rand(0.3, 1.2), r: rand(-0.4, 0.4), vr: rand(-0.2, 0.2), id: i }));
    windows = Array.from({ length: 140 }, () => ({ b: Math.floor(Math.random() * 9), x: Math.random(), y: Math.random(), on: Math.random() < 0.35 }));
    AB.Audio.ambience('rain');
    if (AB.Intro3D) AB.Intro3D.init();
    AB.Audio.preloadVoices(['n01','n02','n03','n04','n05','n06','n07','m01','m02','m03','m04']);
    I.cues = {};
  };

  function cue(name, at, fn) { if (t >= at && !I.cues[name]) { I.cues[name] = true; fn(); } }

  I.skip = function () {
    if (phase === 'boot' && !offerShown) { offerShown = true; birthOffer(); return; }
    if (phase === 'boot' || phase === 'montage') { if (AB.UI.offerOpen()) return; finish(); return; }
    AB.Audio.stopVoice(); t = 48.3; phase = 'boot'; AB.Audio.ambience('void');
  };

  function finish() {
    AB.Audio.stopVoice(); const d = done; done = null; AB.Audio.ambience(null);
    if (AB.Intro3D) AB.Intro3D.dispose();
    if (d) d();
  }
  // 0..1 while the last montage beat flies down onto the real village model; -1 otherwise.
  I.revealK = function () {
    if (phase !== 'montage' || !AB.Intro3D || !AB.Intro3D.ok || montageT < 3 * BEAT) return -1;
    return Math.min(1, (montageT - 3 * BEAT) / (MONTAGE_END - 3 * BEAT - 0.6));
  };

  function birthOffer() {
    AB.Ledger.S.offers = [];
    AB.Ledger.queueOffer('Birth gift');
    const o = AB.Ledger.S.offers.shift();
    AB.UI.showOffer(o, a => { AB.Ledger.takeAbility(a); phase = 'montage'; montageT = 0; AB.Audio.ambience('forest'); AB.Audio.sfx('whoosh'); });
  }

  I.input = function () {
    if (phase === 'boot' && waitFist && fistT < 0) {
      fistT = 0; AB.Audio.sfx('skill');
      AB.Ledger.skillXP('manaSense', 30, {});
    }
  };

  I.update = function (dt) {
    t += dt; lastDt = dt;
    if (phase !== 'boot' && phase !== 'montage') for (const sb of subs) cue('v' + sb[3], sb[0], () => AB.Audio.voice(sb[3]));
    if (phase === 'city') {
      cue('str', 0.4, () => AB.Audio.sfx('strings'));
      cue('pass', 3.5, () => AB.Audio.sfx('carpass'));
      cue('brake', 15.2, () => AB.Audio.sfx('brake'));
      cue('riser', 16.2, () => AB.Audio.sfx('riser'));
      cue('impact', 18.4, () => { AB.Audio.sfx('impact'); AB.Audio.ambienceCut(); AB.Audio.ambience(null); });
      if (t > 21.0) { phase = 'void'; AB.Audio.ambience('void'); AB.Audio.sfx('glitch'); }
    } else if (phase === 'void') {
      cue('uw', 21.1, () => AB.Audio.sfx('underwater'));
      cue('g2', 26, () => AB.Audio.sfx('glitch'));
      cue('sear', 33.2, () => AB.Audio.sfx('searing'));
      cue('wh', 34.5, () => AB.Audio.sfx('whoosh'));
      cue('g3', 31, () => AB.Audio.sfx('glitch'));
      if (t > 36) { phase = 'birth'; AB.Audio.ambience(null); AB.Audio.sfx('gong'); }
    } else if (phase === 'birth') {
      if (Math.floor(t / 0.9) !== Math.floor((t - dt) / 0.9)) AB.Audio.sfx('heartbeat');
      if (t > 48.3) { phase = 'boot'; AB.Audio.ambience('void'); AB.Audio.sfx('glitch'); }
    } else if (phase === 'boot') {
      if (t > 53.8 && !waitFist) waitFist = true;
      if (fistT >= 0) { fistT += dt; if (fistT > 1.8 && !offerShown) { offerShown = true; birthOffer(); } }
    } else if (phase === 'montage') {
      const before = montageT;
      montageT += dt;
      for (let i = 0; i < 4; i++) if (before < i * BEAT + 0.15 && montageT >= i * BEAT + 0.15) AB.Audio.voice('m0' + (i + 1));
      for (let i = 1; i < 3; i++) if (before < i * BEAT - 0.25 && montageT >= i * BEAT - 0.25) AB.Audio.sfx('whoosh');
      if (before < 3 * BEAT - 0.3 && montageT >= 3 * BEAT - 0.3) { AB.Audio.sfx('reveal'); AB.Audio.sfx('chorn'); }
      if (montageT > MONTAGE_END) finish();
    }
  };

  // ---------- Drawing ----------
  I.draw = function (ctx, w, h) {
    const X = AB.Intro3D;
    if (X && X.ok) {
      st3.phase = phase; st3.t = t; st3.montageT = montageT;
      st3.beat = phase === 'montage' ? Math.min(3, Math.floor(Math.max(0, montageT) / BEAT)) : -1;
      X.frame(st3, lastDt);
      ctx.clearRect(0, 0, w, h);
      drawFilm(ctx, w, h);
      return;
    }
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, w, h);
    if (phase === 'city') drawCity(ctx, w, h);
    else if (phase === 'void') drawVoid(ctx, w, h);
    else if (phase === 'birth') drawBirth(ctx, w, h);
    else if (phase === 'boot') drawBoot(ctx, w, h);
    else if (phase === 'montage') drawMontage(ctx, w, h);
    // Subtitles.
    for (const [a, b, s] of subs) if (t >= a && t <= b) subtitle(ctx, w, h, s, Math.min(1, (t - a) * 2, (b - t) * 2));
  };

  function subtitle(ctx, w, h, s, al) {
    ctx.globalAlpha = Math.max(0, al);
    ctx.font = `italic ${Math.max(15, Math.min(22, w / 45))}px "Cormorant Garamond", Georgia, serif`;
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    const tw = ctx.measureText(s).width;
    ctx.fillRect(w / 2 - tw / 2 - 14, h - 92, tw + 28, 34);
    ctx.fillStyle = '#e8e1d3'; ctx.fillText(s, w / 2, h - 69);
    ctx.globalAlpha = 1;
  }

  function drawCity(ctx, w, h) {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#05060a'); g.addColorStop(1, '#141824');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    const pan = t * 6;
    // Buildings, two layers.
    for (let layer = 0; layer < 2; layer++) {
      const n = 9, bw = w / 6;
      for (let i = 0; i < n; i++) {
        const x = ((i * bw * 1.1 - pan * (layer + 1)) % (n * bw * 1.1) + n * bw * 1.1) % (n * bw * 1.1) - bw;
        const bh = h * (0.35 + ((i * 37 + layer * 13) % 7) / 14) * (layer ? 1 : 0.8);
        ctx.fillStyle = layer ? '#0b0d14' : '#10131c';
        ctx.fillRect(x, h * 0.72 - bh, bw * 0.9, bh);
        for (const wi of windows) if (wi.b === i && wi.on) {
          ctx.fillStyle = layer ? 'rgba(255,200,120,0.55)' : 'rgba(150,180,255,0.25)';
          ctx.fillRect(x + 8 + wi.x * (bw * 0.9 - 20), h * 0.72 - bh + 10 + wi.y * (bh - 30), 6, 8);
        }
      }
    }
    // Street, crossing, reflections.
    ctx.fillStyle = '#0a0b10'; ctx.fillRect(0, h * 0.72, w, h * 0.28);
    ctx.fillStyle = 'rgba(232,225,211,0.12)';
    for (let i = 0; i < 9; i++) ctx.fillRect(w * 0.3 + i * w * 0.045, h * 0.8, w * 0.025, h * 0.12);
    // Streetlight + neon sign.
    ctx.fillStyle = 'rgba(255,190,110,0.08)'; ctx.beginPath(); ctx.moveTo(w * 0.15, h * 0.3); ctx.lineTo(w * 0.05, h); ctx.lineTo(w * 0.27, h); ctx.fill();
    ctx.fillStyle = `rgba(200,50,60,${0.5 + Math.sin(t * 9) * 0.2 * (Math.random() < 0.05 ? 0 : 1)})`;
    ctx.font = '700 22px "JetBrains Mono", monospace'; ctx.textAlign = 'left'; ctx.fillText('OPEN 24H', w * 0.68, h * 0.42);
    // Kid on the crossing and the man.
    if (t > 13) {
      ctx.fillStyle = '#1b1b22';
      ctx.fillRect(w * 0.55, h * 0.78, 10, 26); ctx.beginPath(); ctx.arc(w * 0.55 + 5, h * 0.77, 7, 0, 7); ctx.fill();
      const mx = t > 16 ? w * 0.45 + Math.min(1, (t - 16) / 1.5) * w * 0.08 : w * 0.45;
      ctx.fillRect(mx, h * 0.74, 14, 42); ctx.beginPath(); ctx.arc(mx + 7, h * 0.73, 9, 0, 7); ctx.fill();
    }
    // Headlights.
    if (t > 14) {
      const k = Math.min(1, (t - 14) / 5);
      const hx = w * (1.1 - k * 0.5), r = 30 + k * w * 0.6;
      const lg = ctx.createRadialGradient(hx, h * 0.8, 0, hx, h * 0.8, r);
      lg.addColorStop(0, `rgba(255,255,240,${0.4 + k * 0.6})`); lg.addColorStop(1, 'rgba(255,255,240,0)');
      ctx.fillStyle = lg; ctx.fillRect(0, 0, w, h);
    }
    // Rain.
    ctx.strokeStyle = 'rgba(170,190,220,0.35)'; ctx.lineWidth = 1;
    ctx.beginPath();
    for (const r of rain) {
      const y = ((r.y + t * 0.9 * r.s) % 1) * h, x = (r.x * w + y * 0.12) % w;
      ctx.moveTo(x, y); ctx.lineTo(x - 2, y + 14 * r.s);
    }
    ctx.stroke();
    // Phone in hand.
    if (t < 14) {
      const pw = Math.min(260, w * 0.34), ph = pw * 1.25, px = w - pw - 30, py = h - ph - 110;
      ctx.fillStyle = 'rgba(12,12,16,0.92)'; ctx.fillRect(px, py, pw, ph);
      ctx.strokeStyle = '#2a2a33'; ctx.strokeRect(px, py, pw, ph);
      ctx.font = '12px "JetBrains Mono", monospace'; ctx.textAlign = 'left';
      ctx.fillStyle = '#c8323c'; ctx.fillText('3%', px + pw - 34, py + 18);
      ctx.fillStyle = '#9a958c'; ctx.fillText('23:47 · Wed', px + 12, py + 18);
      let ny = py + 40;
      for (const [at, who, msg] of notes) {
        if (t < at) continue;
        ctx.fillStyle = 'rgba(255,255,255,0.06)'; ctx.fillRect(px + 10, ny, pw - 20, 44);
        ctx.fillStyle = who === 'System' ? '#c8323c' : '#e8e1d3'; ctx.font = '700 12px "JetBrains Mono", monospace'; ctx.fillText(who, px + 18, ny + 17);
        ctx.fillStyle = '#b8b2a6'; ctx.font = '12px "JetBrains Mono", monospace'; ctx.fillText(msg, px + 18, ny + 34);
        ny += 52;
      }
    }
    // White flash, then black.
    if (t > 18.6) {
      const k = t < 19.2 ? (t - 18.6) / 0.6 : Math.max(0, 1 - (t - 19.2) / 0.8);
      ctx.fillStyle = `rgba(255,255,255,${k})`; ctx.fillRect(0, 0, w, h);
      if (t > 20) { ctx.fillStyle = `rgba(0,0,0,${Math.min(1, (t - 20) / 0.5)})`; ctx.fillRect(0, 0, w, h); }
    }
  }

  function drawPage(ctx, x, y, s, r, label, hot) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(r); ctx.scale(s, s);
    ctx.fillStyle = hot ? '#e8e1d3' : 'rgba(232,225,211,0.16)'; ctx.fillRect(-30, -40, 60, 80);
    ctx.fillStyle = hot ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.35)';
    for (let i = 0; i < 9; i++) ctx.fillRect(-22, -30 + i * 7, 30 + ((i * 13) % 14), 2);
    if (label) { ctx.fillStyle = '#c8323c'; ctx.font = '700 7px "JetBrains Mono", monospace'; ctx.textAlign = 'center'; ctx.fillText(label, 0, 36); }
    ctx.restore();
  }

  function drawVoid(ctx, w, h) {
    const lt = t - 21.0;
    for (const p of pages) {
      const z = p.z;
      const x = ((p.x + Math.sin(lt * 0.1 + p.id) * 0.02) * w);
      const y = ((p.y - lt * 0.02 * z + 2) % 1) * h;
      const label = p.id % 9 === 3 ? `ENTRY 2026-Δ-${String(p.id).padStart(2, '0')}` : null;
      ctx.globalAlpha = Math.min(1, lt / 2) * (0.3 + z * 0.5);
      drawPage(ctx, x, y, z * 1.2, p.r + lt * p.vr, label, false);
    }
    ctx.globalAlpha = 1;
    // His page, centre.
    if (lt > 6) {
      const k = Math.min(1, (lt - 6) / 2);
      ctx.globalAlpha = k; drawPage(ctx, w / 2, h * 0.42, 2.4, 0, 'ENTRY 2026-Δ-00', true); ctx.globalAlpha = 1;
    }
    const lines = [[1.5, '[SUBJECT EXPIRED]'], [4.0, 'Cause: blunt trauma. Others recorded: 7.'], [8.0, 'Record review: 34 years. Mostly blank.'], [11.5, 'Opening new entry.']];
    ctx.textAlign = 'center';
    let y = h * 0.72;
    for (const [at, s] of lines) {
      if (lt < at) continue;
      const n = Math.min(s.length, Math.floor((lt - at) * 28));
      const glitch = Math.random() < 0.04;
      ctx.font = '700 16px "JetBrains Mono", monospace';
      ctx.fillStyle = glitch ? '#e8e1d3' : '#c8323c';
      ctx.fillText(s.slice(0, n) + (n < s.length ? '█' : ''), w / 2 + (glitch ? rand(-4, 4) : 0), y);
      y += 26;
    }
  }

  function drawBirth(ctx, w, h) {
    const lt = t - 36;
    const g = ctx.createRadialGradient(w / 2, h * 0.4, 10, w / 2, h * 0.4, Math.max(w, h) * (0.4 + lt * 0.04));
    g.addColorStop(0, `rgba(255,214,160,${Math.min(1, lt / 2)})`); g.addColorStop(0.5, 'rgba(160,90,60,0.6)'); g.addColorStop(1, 'rgba(20,10,10,1)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    // Blurry faces / shapes.
    ctx.filter = 'blur(18px)';
    ctx.fillStyle = 'rgba(80,50,40,0.6)'; ctx.beginPath(); ctx.arc(w * 0.45 + Math.sin(lt) * 10, h * 0.35, Math.min(w, h) * 0.18, 0, 7); ctx.fill();
    ctx.fillStyle = 'rgba(201,164,106,0.6)'; ctx.beginPath(); ctx.arc(w * 0.45 + Math.sin(lt) * 10, h * 0.26, Math.min(w, h) * 0.16, Math.PI, 0); ctx.fill();
    ctx.filter = 'none';
    // Tiny hands.
    const hy = h * 0.92 - Math.min(1, lt / 3) * h * 0.12;
    ctx.fillStyle = '#e0b090';
    for (const sx of [-1, 1]) {
      const x = w / 2 + sx * w * 0.14;
      ctx.beginPath(); ctx.ellipse(x, hy, 34, 26, 0, 0, 7); ctx.fill();
      for (let f = 0; f < 4; f++) { ctx.beginPath(); ctx.ellipse(x - 22 + f * 14, hy - 26, 7, 12, 0, 0, 7); ctx.fill(); }
      ctx.beginPath(); ctx.ellipse(x - sx * 34, hy - 6, 8, 14, sx * 0.8, 0, 7); ctx.fill();
    }
    // Unknown words.
    if (lt > 5) {
      ctx.globalAlpha = Math.min(1, (lt - 5));
      ctx.font = '24px "Cormorant Garamond", Georgia, serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#3a2418';
      ctx.fillText('ᚲᚨᛃᛞᛖᚾ · ᛗᛁ ᛚᛁᛏᛚᛖ ᛚᛁᚷᚺᛏ', w / 2, h * 0.16);
      ctx.globalAlpha = 1;
    }
    if (lt > 9.5) { ctx.fillStyle = `rgba(0,0,0,${Math.min(1, (lt - 9.5) * 2)})`; ctx.fillRect(0, 0, w, h); }
  }

  function drawBoot(ctx, w, h) {
    const lt = t - 48.3;
    ctx.fillStyle = '#050506'; ctx.fillRect(0, 0, w, h);
    // Faint warm room behind the glass.
    const g = ctx.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, Math.max(w, h));
    g.addColorStop(0, 'rgba(90,50,30,0.35)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    const S = AB.Ledger.S;
    const lines = [
      '╔═ LEDGER · SUBJECT 2026-Δ-00 ══════════╗',
      `  NAME     ${S.name.toUpperCase()}`,
      '  AGE      0',
      '  LEVEL    1',
      '  HP 4/4   MANA 1/1',
      '  ORIGIN   Earthborn',
      '  TRAIT    Ledger-Marked (no effect)',
      '  STATUS   Infant. Helpless. Watched.',
      '╚══════════════════════════════════════╝',
    ];
    const fs = Math.max(12, Math.min(18, w / 42));
    ctx.font = `${fs}px "JetBrains Mono", monospace`; ctx.textAlign = 'left';
    const bw = ctx.measureText(lines[0]).width;
    const x0 = w / 2 - bw / 2, y0 = h * 0.26;
    lines.forEach((s, i) => {
      const at = i * 0.45;
      if (lt < at) return;
      const n = Math.min(s.length, Math.floor((lt - at) * 60));
      const glitch = Math.random() < 0.03;
      ctx.fillStyle = i === 0 || i === lines.length - 1 ? '#c8323c' : (i === 6 ? '#e8b04a' : '#e8e1d3');
      ctx.fillText(s.slice(0, n), x0 + (glitch ? rand(-3, 3) : 0), y0 + i * fs * 1.5);
    });
    if (waitFist) {
      ctx.textAlign = 'center';
      if (fistT < 0) {
        ctx.globalAlpha = 0.6 + Math.sin(t * 4) * 0.4;
        ctx.fillStyle = '#c8323c'; ctx.font = `700 ${fs}px "JetBrains Mono", monospace`;
        ctx.fillText(AB.Input.touch ? '[DIRECTIVE] Clench your fist. (tap)' : '[DIRECTIVE] Clench your fist. (Space / click)', w / 2, y0 + 11 * fs * 1.5);
        ctx.globalAlpha = 1;
      } else {
        ctx.fillStyle = '#7cc6ff'; ctx.font = `700 ${fs + 2}px "JetBrains Mono", monospace`;
        ctx.fillText('[Mana Sense +1]   A faint warmth answers.', w / 2, y0 + 11 * fs * 1.5);
        ctx.fillStyle = 'rgba(124,198,255,0.2)';
        ctx.beginPath(); ctx.arc(w / 2, h * 0.86, 30 + fistT * 40, 0, 7); ctx.fill();
      }
    }
  }

  const BEAT = 6.0, MONTAGE_END = BEAT * 3 + 5.6;
  function drawMontage(ctx, w, h) {
    const beats = [[0 * BEAT, 'Age 1', 'First words. Nobody expects them to be this clear.'], [1 * BEAT, 'Age 3', 'A sister is born. Mira. She grabs my finger and does not let go.'], [2 * BEAT, 'Age 5', 'Secret spell practice behind the barn. The Ledger counts every one.'], [3 * BEAT, 'Age 6', 'Thornwick. A frontier village at the edge of the Ashwood.']];
    let cur = beats[0];
    for (const b of beats) if (montageT >= b[0]) cur = b;
    const lt = montageT - cur[0];
    const al = Math.min(1, lt * 2, (BEAT - lt) * 2 + (cur === beats[3] ? 9 : 0));
    ctx.fillStyle = '#050506'; ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = Math.max(0, al);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#c8323c'; ctx.font = `800 ${Math.min(56, w / 12)}px Cinzel, serif`; ctx.fillText(cur[1].toUpperCase(), w / 2, h * 0.45);
    ctx.fillStyle = '#e8e1d3'; ctx.font = `italic ${Math.max(16, Math.min(24, w / 40))}px "Cormorant Garamond", Georgia, serif`; ctx.fillText(cur[2], w / 2, h * 0.45 + 48);
    ctx.globalAlpha = 1;
    if (montageT > MONTAGE_END - 0.9) { ctx.fillStyle = `rgba(0,0,0,${Math.min(1, (montageT - MONTAGE_END + 0.9) / 0.9)})`; ctx.fillRect(0, 0, w, h); }
  }

  // ---------- Film overlays (3D opening) ----------
  // The 3D sets are drawn by AB.Intro3D underneath; this canvas only carries type: subtitles in the
  // letterbox, the phone, the Ledger's typed lines, the boot window and the chapter cards.
  let dispFont = null;
  function display() {
    if (!dispFont) { try { dispFont = getComputedStyle(document.documentElement).getPropertyValue('--display').trim(); } catch (e) {} dispFont = dispFont || 'Cinzel, serif'; }
    return dispFont;
  }
  function barH(w, h) { const asp = w / h; return (asp > 1.2 ? Math.max(0, Math.min(0.12, (1 - asp / 2.39) / 2)) : 0.05) * h; }
  function fadeIn(x, a, b) { return Math.max(0, Math.min(1, (x - a) / (b - a))); }
  function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
  function spaced(ctx, s, x, y, sp) {
    // letter-spaced text, centred on x
    let tw = 0; for (const ch of s) tw += ctx.measureText(ch).width + sp; tw -= sp;
    let cx = x - tw / 2; const al = ctx.textAlign; ctx.textAlign = 'left';
    for (const ch of s) { ctx.fillText(ch, cx, y); cx += ctx.measureText(ch).width + sp; }
    ctx.textAlign = al;
  }

  function filmSub(ctx, w, h, s, al) {
    const bh = barH(w, h), fs = Math.max(15, Math.min(23, w / 46));
    ctx.save();
    ctx.globalAlpha = Math.max(0, al);
    ctx.font = `italic 500 ${fs}px "Cormorant Garamond", Georgia, serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const y = bh > fs * 2.2 ? h - bh / 2 : h - Math.max(54, h * 0.09);
    ctx.shadowColor = 'rgba(0,0,0,0.9)'; ctx.shadowBlur = 10;
    ctx.fillStyle = '#efe7d6'; ctx.fillText(s, w / 2, y);
    ctx.restore();
  }

  function drawFilm(ctx, w, h) {
    const bh = barH(w, h);
    ctx.textBaseline = 'alphabetic';
    if (phase === 'city') {
      // opening slug
      const sa = Math.min(fadeIn(t, 0.6, 1.6), 1 - fadeIn(t, 5.2, 6.2));
      if (sa > 0) {
        ctx.save(); ctx.globalAlpha = sa; ctx.textAlign = 'left'; ctx.fillStyle = '#e8e1d3';
        const fs = Math.max(11, Math.min(14, w / 90)), x = Math.max(20, w * 0.05), y = bh + Math.max(34, h * 0.07);
        ctx.font = `600 ${fs}px "JetBrains Mono", monospace`; ctx.fillText('EARTH · 2026', x, y);
        ctx.fillStyle = '#9aa3b5'; ctx.fillText('WEDNESDAY, 23:47', x, y + fs * 1.6);
        ctx.fillStyle = '#c8323c'; ctx.fillRect(x, y + fs * 2.4, 34, 2);
        ctx.restore();
      }
      // the phone: messages he never answers
      const pa = Math.min(fadeIn(t, 1.6, 2.4), 1 - fadeIn(t, 12.4, 13.2));
      if (pa > 0) {
        const pw = Math.min(250, w * 0.3), x = w - pw - Math.max(20, w * 0.05);
        let y = bh + Math.max(28, h * 0.06);
        ctx.save(); ctx.globalAlpha = pa;
        ctx.font = `600 11px "JetBrains Mono", monospace`; ctx.textAlign = 'left';
        ctx.fillStyle = 'rgba(232,225,211,0.7)'; ctx.fillText('23:47', x + 4, y); ctx.textAlign = 'right'; ctx.fillStyle = '#ff5a5f'; ctx.fillText('▮ 3%', x + pw - 4, y); ctx.textAlign = 'left';
        y += 12;
        for (const [at, who, msg] of notes) {
          if (t < at) continue;
          const k = fadeIn(t, at, at + 0.35), nh = 50;
          ctx.globalAlpha = pa * k;
          const yy = y + (1 - k) * -10;
          ctx.fillStyle = 'rgba(18,22,32,0.62)'; rr(ctx, x, yy, pw, nh, 12); ctx.fill();
          ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 1; ctx.stroke();
          ctx.fillStyle = who === 'System' ? '#ff5a5f' : '#7cc6ff'; ctx.beginPath(); ctx.arc(x + 18, yy + 18, 6, 0, 7); ctx.fill();
          ctx.fillStyle = '#f1ece2'; ctx.font = `700 12px "Nunito Sans", system-ui, sans-serif`; ctx.fillText(who, x + 32, yy + 22);
          ctx.fillStyle = 'rgba(241,236,226,0.75)'; ctx.font = `12px "Nunito Sans", system-ui, sans-serif`; ctx.fillText(msg, x + 14, yy + 40);
          y += nh + 8;
        }
        ctx.restore();
      }
    } else if (phase === 'void') {
      const lt = t - 21.0;
      const lines = [[1.5, '[SUBJECT EXPIRED]'], [4.0, 'Cause: blunt trauma. Others recorded: 7.'], [8.0, 'Record review: 34 years. Mostly blank.'], [11.5, 'Opening new entry.']];
      const fs = Math.max(12, Math.min(16, w / 60));
      ctx.save(); ctx.textAlign = 'center'; ctx.shadowColor = 'rgba(200,50,60,0.7)'; ctx.shadowBlur = 12;
      let y = h * 0.2 + bh * 0.4;
      for (const [at, s] of lines) {
        if (lt < at) continue;
        const n = Math.min(s.length, Math.floor((lt - at) * 28));
        const glitch = Math.random() < 0.04;
        ctx.globalAlpha = lt > 13.4 ? Math.max(0, 1 - (lt - 13.4)) : 1;
        ctx.font = `700 ${fs}px "JetBrains Mono", monospace`;
        ctx.fillStyle = glitch ? '#e8e1d3' : '#ff4d57';
        ctx.fillText(s.slice(0, n) + (n < s.length ? '█' : ''), w / 2 + (glitch ? rand(-4, 4) : 0), y);
        y += fs * 1.8;
      }
      ctx.restore();
    } else if (phase === 'birth') {
      const lt = t - 36;
      if (lt > 5 && lt < 10) {
        ctx.save(); ctx.globalAlpha = Math.min(1, lt - 5, (10 - lt) * 1.5) * 0.85;
        ctx.font = `${Math.max(18, Math.min(28, w / 40))}px "Cormorant Garamond", Georgia, serif`; ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(255,190,120,0.8)'; ctx.shadowBlur = 16; ctx.fillStyle = '#fff1dc';
        ctx.fillText('ᚲᚨᛃᛞᛖᚾ · ᛗᛁ ᛚᛁᛏᛚᛖ ᛚᛁᚷᚺᛏ', w / 2, bh + h * 0.12);
        ctx.restore();
      }
    } else if (phase === 'boot') {
      drawBootPanel(ctx, w, h);
    } else if (phase === 'montage') {
      drawChapter(ctx, w, h, bh);
    }
    for (const [a, b, s] of subs) if (t >= a && t <= b) filmSub(ctx, w, h, s, Math.min(1, (t - a) * 2, (b - t) * 2));
  }

  function drawBootPanel(ctx, w, h) {
    const lt = t - 48.3, S = AB.Ledger.S;
    const rows = [['NAME', S.name.toUpperCase()], ['AGE', '0'], ['LEVEL', '1'], ['HP', '4 / 4'], ['MANA', '1 / 1'], ['ORIGIN', 'Earthborn'], ['TRAIT', 'Ledger-Marked (no effect)'], ['STATUS', 'Infant. Helpless. Watched.']];
    const fs = Math.max(12, Math.min(16, w / 52)), lh = fs * 1.75;
    const pw = Math.min(w - 32, fs * 30), ph = lh * (rows.length + 2.6), x = w / 2 - pw / 2, y = h * 0.47 - ph / 2;
    const open = fadeIn(lt, 0, 0.5);
    ctx.save();
    ctx.globalAlpha = open;
    ctx.fillStyle = 'rgba(8,8,12,0.78)'; rr(ctx, x, y, pw, ph * (0.2 + 0.8 * open), 6); ctx.fill();
    ctx.strokeStyle = 'rgba(200,50,60,0.85)'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = '#c8323c'; ctx.fillRect(x, y, pw, lh * 1.25);
    ctx.fillStyle = '#fff2ea'; ctx.font = `700 ${fs}px "JetBrains Mono", monospace`; ctx.textAlign = 'left';
    ctx.fillText('LEDGER', x + 14, y + lh * 0.85); ctx.textAlign = 'right'; ctx.fillText('SUBJECT 2026-Δ-00', x + pw - 14, y + lh * 0.85);
    ctx.textAlign = 'left';
    rows.forEach(([k, v], i) => {
      const at = 0.4 + i * 0.4; if (lt < at) return;
      const n = Math.min(v.length, Math.floor((lt - at) * 50)), glitch = Math.random() < 0.03, ry = y + lh * (2.2 + i);
      ctx.fillStyle = '#8b8577'; ctx.font = `600 ${fs * 0.85}px "JetBrains Mono", monospace`; ctx.fillText(k, x + 16, ry);
      ctx.fillStyle = k === 'TRAIT' ? '#e8b04a' : '#efe7d6'; ctx.font = `${fs}px "JetBrains Mono", monospace`;
      ctx.fillText(v.slice(0, n), x + 16 + fs * 6.2 + (glitch ? rand(-3, 3) : 0), ry);
    });
    ctx.restore();
    if (waitFist) {
      ctx.save(); ctx.textAlign = 'center';
      const py = y + ph + lh * 1.6;
      if (fistT < 0) {
        ctx.globalAlpha = 0.6 + Math.sin(t * 4) * 0.4;
        ctx.fillStyle = '#ff4d57'; ctx.font = `700 ${fs}px "JetBrains Mono", monospace`;
        ctx.shadowColor = 'rgba(200,50,60,0.8)'; ctx.shadowBlur = 10;
        ctx.fillText(AB.Input.touch ? '[DIRECTIVE] Clench your fist. (tap)' : '[DIRECTIVE] Clench your fist. (Space / click)', w / 2, py);
      } else {
        ctx.fillStyle = '#9fd8ff'; ctx.font = `700 ${fs + 2}px "JetBrains Mono", monospace`;
        ctx.shadowColor = 'rgba(124,198,255,0.9)'; ctx.shadowBlur = 14;
        ctx.fillText('[Mana Sense +1]   A faint warmth answers.', w / 2, py);
        const g = ctx.createRadialGradient(w / 2, h, 0, w / 2, h, 60 + fistT * 260);
        g.addColorStop(0, `rgba(124,198,255,${0.35 * Math.max(0, 1 - fistT / 1.8)})`); g.addColorStop(1, 'rgba(124,198,255,0)');
        ctx.shadowBlur = 0; ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      }
      ctx.restore();
    }
  }

  function drawChapter(ctx, w, h, bh) {
    const beats = [['AGE 1', 'First words. Nobody expects them to be this clear.'], ['AGE 3', 'A sister is born. Mira. She grabs my finger and does not let go.'], ['AGE 5', 'Secret spell practice behind the barn. The Ledger counts every one.']];
    const b = Math.min(3, Math.floor(Math.max(0, montageT) / BEAT)), lt = montageT - b * BEAT;
    ctx.save();
    if (b < 3) {
      // lower-third chapter card
      const al = Math.min(1, fadeIn(lt, 0.3, 1.0), (BEAT - 0.3 - lt) * 2);
      const x = Math.max(22, w * 0.06), y = h - bh - Math.max(70, h * 0.14), big = Math.max(30, Math.min(64, w / 15));
      ctx.globalAlpha = Math.max(0, al); ctx.textAlign = 'left';
      ctx.shadowColor = 'rgba(0,0,0,0.7)'; ctx.shadowBlur = 18;
      ctx.fillStyle = '#ffe7b8'; ctx.font = `800 ${big}px ${display()}`;
      ctx.fillText(beats[b][0], x + (1 - fadeIn(lt, 0.3, 1.3)) * -20, y);
      ctx.fillStyle = '#e8b04a'; ctx.fillRect(x, y + 12, Math.min(260, w * 0.3) * fadeIn(lt, 0.5, 1.5), 2);
      ctx.fillStyle = '#f6efe2'; ctx.font = `italic 500 ${Math.max(15, Math.min(22, w / 48))}px "Cormorant Garamond", Georgia, serif`;
      wrapText(ctx, beats[b][1], x, y + 40, Math.min(560, w - x * 2), Math.max(20, Math.min(28, w / 38)));
    } else {
      // the reveal: Thornwick
      const al = Math.min(fadeIn(lt, 1.4, 2.6), 1 - fadeIn(montageT, MONTAGE_END - 1.2, MONTAGE_END - 0.5));
      ctx.globalAlpha = Math.max(0, al); ctx.textAlign = 'center';
      const big = Math.max(40, Math.min(96, w / 10)), y = h * 0.3;
      const sh = ctx.createRadialGradient(w / 2, y, 0, w / 2, y, Math.max(w * 0.42, big * 4));
      sh.addColorStop(0, 'rgba(20,14,8,0.5)'); sh.addColorStop(1, 'rgba(20,14,8,0)');
      ctx.save(); ctx.translate(w / 2, y); ctx.scale(1, 0.45); ctx.translate(-w / 2, -y); ctx.fillStyle = sh; ctx.fillRect(0, y - w, w, w * 2); ctx.restore();
      ctx.shadowColor = 'rgba(40,20,10,0.7)'; ctx.shadowBlur = 24;
      ctx.fillStyle = '#fff4dc'; ctx.font = `800 ${big}px ${display()}`;
      spaced(ctx, 'THORNWICK', w / 2, y, big * 0.08 * (1 + (1 - fadeIn(lt, 1.4, 4)) * 0.6));
      ctx.fillStyle = '#ffe7b8'; ctx.font = `700 ${Math.max(11, Math.min(14, w / 80))}px "JetBrains Mono", monospace`;
      spaced(ctx, 'AGE 6 · CHAPTER 1 · CHILDHOOD', w / 2, y + big * 0.55, 3);
      ctx.fillStyle = '#fff8ec'; ctx.font = `italic 500 ${Math.max(16, Math.min(24, w / 44))}px "Cormorant Garamond", Georgia, serif`;
      ctx.fillText('A frontier village at the edge of the Ashwood.', w / 2, y + big * 0.55 + 34);
    }
    ctx.restore();
    if (montageT > MONTAGE_END - 0.9) { ctx.fillStyle = `rgba(0,0,0,${Math.min(1, (montageT - MONTAGE_END + 0.9) / 0.9)})`; ctx.fillRect(0, 0, w, h); }
  }
  function wrapText(ctx, s, x, y, mw, lh) {
    const words = s.split(' '); let line = '';
    for (const wd of words) { const tst = line ? line + ' ' + wd : wd; if (ctx.measureText(tst).width > mw && line) { ctx.fillText(line, x, y); y += lh; line = wd; } else line = tst; }
    if (line) ctx.fillText(line, x, y);
  }

  // debug/screenshot hook: jump the film to a time (>= 100 means montage time - 100)
  I._seek = function (tt) { if (tt >= 100) { phase = 'montage'; montageT = tt - 100; t = 60; } else { t = tt; phase = tt < 21 ? 'city' : tt < 36 ? 'void' : tt < 48.3 ? 'birth' : 'boot'; if (tt > 53.8) waitFist = true; } };
  I.phase = () => phase;
  AB.Intro = I;
})();
