// Aetherbound: DOM interface. HUD, LEDGER log, dialogue, LEDGER window, offers.
(function () {
  const U = {};
  const $ = s => document.querySelector(s);
  const L = AB.Ledger;
  let dlg = null, ledgerTab = 'status', offerCb = null;

  U.init = function () {
    U.el = {
      hud: $('#hud'), name: $('#hudName'), lvl: $('#hudLvl'), title: $('#hudTitle'),
      hp: $('#barHp i'), mp: $('#barMp i'), xp: $('#barXp i'), hpT: $('#barHp b'), mpT: $('#barMp b'),
      log: $('#log'), quest: $('#quest'), prompt: $('#prompt'), badge: $('#badge'),
      dialogue: $('#dialogue'), who: $('#dlgWho'), text: $('#dlgText'),
      ledger: $('#ledger'), ledgerBody: $('#ledgerBody'), offer: $('#offer'), offerCards: $('#offerCards'), offerLabel: $('#offerLabel'),
      banner: $('#banner'), slots: document.querySelectorAll('#hotbar .slot'), minimap: $('#minimap'),
    };
    document.querySelectorAll('#ledger [data-tab]').forEach(b => b.addEventListener('click', () => { ledgerTab = b.dataset.tab; AB.Audio.sfx('ui'); U.renderLedger(); }));
    $('#ledgerClose').addEventListener('click', () => U.closeLedger());
    U.el.dialogue.addEventListener('click', () => U.advance());
    U.el.badge.addEventListener('click', () => U.openLedger('status'));
    $('#btnLedger').addEventListener('click', () => U.openLedger());
    $('#btnMute').addEventListener('click', () => { AB.Audio.setMuted(!AB.Audio.muted); $('#btnMute').textContent = AB.Audio.muted ? 'Sound off' : 'Sound on'; });
  };

  U.show = (el, on) => { el.hidden = !on; };

  // ---------- HUD ----------
  U.updateHud = function () {
    const S = L.S, e = U.el;
    e.name.textContent = S.name.toUpperCase();
    e.lvl.textContent = 'LV ' + S.level;
    e.title.textContent = AB.TITLES[S.title].name + (S.debt > 0 ? ' · LEDGER DEBT' : '');
    const mh = L.maxHp(), mm = L.maxMp();
    e.hp.style.width = (S.hp / mh * 100) + '%'; e.hpT.textContent = `${Math.ceil(S.hp)} / ${mh}`;
    e.mp.style.width = (S.mp / mm * 100) + '%'; e.mpT.textContent = `${Math.floor(S.mp)} / ${mm}`;
    e.xp.style.width = (S.xp / L.levelNeed(S.level) * 100) + '%';
    const pend = S.statPts > 0;
    e.badge.hidden = !pend;
    if (pend) e.badge.textContent = `+${S.statPts} stat point${S.statPts > 1 ? 's' : ''} · open LEDGER`;
    // Hotbar state.
    const slots = e.slots;
    slots[2].classList.toggle('locked', !S.skills.healing.unlocked);
    slots[3].classList.toggle('locked', !(L.has('aquaDash')));
    slots[4].classList.toggle('locked', !(L.has('bloodSense')));
  };

  // ---------- LEDGER log (toasts) ----------
  U.log = function (text, kind) {
    const d = document.createElement('div');
    d.className = 'entry ' + (kind || '');
    d.innerHTML = `<span>[LEDGER] ${L.entryNo()}</span>${escapeHtml(text)}`;
    U.el.log.prepend(d);
    while (U.el.log.children.length > 6) U.el.log.lastChild.remove();
    setTimeout(() => d.classList.add('out'), kind === 'level' || kind === 'title' || kind === 'new' ? 6000 : 3800);
    setTimeout(() => d.remove(), 7000);
  };
  function escapeHtml(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }

  U.setQuest = function (q) {
    if (!q) { U.el.quest.hidden = true; return; }
    U.el.quest.hidden = false;
    U.el.quest.innerHTML = `<div class="qk">${q.kind === 'Directive' ? '[LEDGER] DIRECTIVE' : q.kind === 'Earthborn' ? 'EARTHBORN' : 'QUEST'}</div><div class="qt">${escapeHtml(q.title)}</div><div class="qx">${escapeHtml(q.progress || q.text)}</div>`;
    U.el.quest.classList.toggle('directive', q.kind === 'Directive');
  };

  U.prompt = function (t) {
    if (!t) { U.el.prompt.hidden = true; return; }
    U.el.prompt.hidden = false; U.el.prompt.textContent = t;
  };

  U.banner = function (title, sub, ms) {
    const b = U.el.banner;
    b.innerHTML = `<div class="b1">${escapeHtml(title)}</div>${sub ? `<div class="b2">${escapeHtml(sub)}</div>` : ''}`;
    b.classList.remove('on'); void b.offsetWidth; b.classList.add('on');
    clearTimeout(U._bt); U._bt = setTimeout(() => b.classList.remove('on'), ms || 3200);
  };

  // ---------- Dialogue ----------
  U.dialogueActive = () => !!dlg;
  U.showDialogue = function (lines, done) {
    dlg = { lines, i: 0, done, typed: 0 };
    U.show(U.el.dialogue, true);
    renderLine();
  };
  function renderLine() {
    const l = dlg.lines[dlg.i];
    U.el.who.textContent = l.who || '';
    U.el.who.className = 'who ' + (l.who === 'LEDGER' ? 'sys' : l.who === 'Kayden' ? 'me' : '');
    U.el.text.textContent = '';
    dlg.full = l.text; dlg.typed = 0;
    U.el.dialogue.classList.toggle('thought', l.who === 'Kayden' && l.thought);
  }
  U.tickDialogue = function (dt) {
    if (!dlg) return;
    if (dlg.typed < dlg.full.length) {
      dlg.typed = Math.min(dlg.full.length, dlg.typed + dt * 70);
      U.el.text.textContent = dlg.full.slice(0, Math.floor(dlg.typed));
    }
  };
  U.advance = function () {
    if (!dlg) return;
    if (dlg.typed < dlg.full.length) { dlg.typed = dlg.full.length; U.el.text.textContent = dlg.full; return; }
    AB.Audio.sfx('ui');
    dlg.i++;
    if (dlg.i >= dlg.lines.length) { const d = dlg.done; dlg = null; U.show(U.el.dialogue, false); if (d) d(); return; }
    renderLine();
  };

  // ---------- LEDGER window ----------
  U.ledgerOpen = () => !U.el.ledger.hidden;
  U.openLedger = function (tab) { if (tab) ledgerTab = tab; U.show(U.el.ledger, true); AB.Audio.sfx('glitch'); U.renderLedger(); };
  U.closeLedger = function () { U.show(U.el.ledger, false); AB.Audio.sfx('ui'); };
  U.renderLedger = function () {
    const S = L.S;
    document.querySelectorAll('#ledger [data-tab]').forEach(b => b.classList.toggle('on', b.dataset.tab === ledgerTab));
    let h = '';
    if (ledgerTab === 'status') {
      const stat = (k, label, note) => `<div class="stat"><span>${label}</span><b>${S.stats[k]}</b><em>${note}</em>${S.statPts > 0 ? `<button data-stat="${k}" aria-label="Add a point to ${label}">+</button>` : ''}</div>`;
      h += `<pre class="status">SUBJECT    ${S.name.toUpperCase()}
ORIGIN     Earthborn (reborn)
AGE        ${S.age}
LEVEL      ${S.level}   (${Math.floor(S.xp / L.levelNeed(S.level) * 100)}%)
TITLE      ${AB.TITLES[S.title].name}
HP ${Math.ceil(S.hp)}/${L.maxHp()}   MANA ${Math.floor(S.mp)}/${L.maxMp()}
TRAIT      Ledger-Marked (no effect)</pre>`;
      h += `<div class="pts">${S.statPts > 0 ? `UNASSIGNED POINTS: ${S.statPts}` : 'Stat points come with each level.'}</div>`;
      h += stat('str', 'STR', 'sword damage') + stat('agi', 'AGI', 'move speed') + stat('int', 'INT', 'mana, spell power') + stat('vit', 'VIT', 'max HP');
      if (S.debt > 0) h += `<p class="warn">LEDGER DEBT: skills earn 10% less XP until you finish a Directive.</p>`;
    } else if (ledgerTab === 'skills') {
      for (const tree of AB.TREES) {
        h += `<h4>${tree.name}</h4>`;
        for (const id of tree.skills) {
          const sk = S.skills[id], def = AB.SKILLS[id];
          if (!sk.unlocked) { h += `<div class="skill locked"><div class="sn">${tree.id === 'earth' ? '███████' : def.name}</div><div class="sl">LOCKED</div></div>`; continue; }
          const pct = Math.floor(sk.xp / L.skillNeed(sk.lvl) * 100);
          h += `<div class="skill"><div class="sn">${def.name}</div><div class="sl">${sk.lvl}</div><div class="sb"><i style="width:${pct}%"></i></div><div class="sh">${def.how}</div></div>`;
        }
      }
      h += `<p class="note">Every skill level also feeds your character level. You get better at exactly what you do.</p>`;
    } else if (ledgerTab === 'abilities') {
      if (!S.abilities.length) h += '<p class="note">None yet.</p>';
      for (const a of S.abilities) { const d = AB.ABILITIES[a]; h += `<div class="ab"><b>${d.name}</b><span>${d.type}</span><p>${d.desc}</p></div>`; }
      h += `<p class="note">The Ledger makes an offer every 5 levels. Pick 1 of 3. Unpicked offers are gone for good.</p>`;
    } else if (ledgerTab === 'titles') {
      for (const id of Object.keys(AB.TITLES)) {
        const d = AB.TITLES[id], got = S.titles[id];
        h += `<div class="ti ${got ? '' : 'locked'} ${S.title === id ? 'eq' : ''}"><b>${got ? d.name : '???'}</b><span>${got ? d.effect : d.how}</span>${got && S.title !== id ? `<button data-title="${id}">Equip</button>` : S.title === id ? '<em>Equipped</em>' : ''}</div>`;
      }
    } else if (ledgerTab === 'quests') {
      const g = AB.Game;
      for (const q of AB.QUESTS) {
        const st = S.quests[q.id];
        if (!st) continue;
        h += `<div class="qq ${st}"><div class="qk">${q.kind.toUpperCase()}</div><b>${q.title}</b><p>${st === 'done' ? 'Complete.' : (g.questProgress(q.id) || q.text)}</p><span>Reward: ${q.reward}</span></div>`;
      }
    } else if (ledgerTab === 'bestiary') {
      for (const k of Object.keys(AB.ENEMIES)) {
        const d = AB.ENEMIES[k], n = S.bestiary[k];
        h += `<div class="bx ${n ? '' : 'locked'}"><b>${n ? d.name : 'Unrecorded'}</b><span>${n ? `Lv ${d.lvl} · HP ${d.hp} · slain ${n}` : '???'}</span></div>`;
      }
    }
    U.el.ledgerBody.innerHTML = h;
    U.el.ledgerBody.querySelectorAll('[data-stat]').forEach(b => b.addEventListener('click', () => { L.addStat(b.dataset.stat); AB.Audio.sfx('skill'); U.renderLedger(); U.updateHud(); }));
    U.el.ledgerBody.querySelectorAll('[data-title]').forEach(b => b.addEventListener('click', () => { L.S.title = b.dataset.title; AB.Audio.sfx('ui'); U.renderLedger(); U.updateHud(); }));
  };

  // ---------- Offers ----------
  U.offerOpen = () => !U.el.offer.hidden;
  U.showOffer = function (offer, cb) {
    offerCb = cb;
    U.el.offerLabel.textContent = offer.label.toUpperCase();
    U.el.offerCards.innerHTML = offer.options.map(a => {
      const d = AB.ABILITIES[a];
      return `<button class="card" data-ab="${a}"><span class="ct">${d.type}</span><b>${d.name}</b><p>${d.desc}</p></button>`;
    }).join('');
    U.el.offerCards.querySelectorAll('[data-ab]').forEach(b => b.addEventListener('click', () => {
      U.show(U.el.offer, false); AB.Audio.sfx('level'); const c = offerCb; offerCb = null; if (c) c(b.dataset.ab);
    }));
    U.show(U.el.offer, true);
    AB.Audio.sfx('glitch');
  };

  // ---------- Minimap ----------
  U.drawMinimap = function (g) {
    const c = U.el.minimap, ctx = c.getContext('2d'), W = AB.World, T = AB.TILE;
    const scale = 2, vw = c.width / scale, vh = c.height / scale;
    const px = g.player.x / T, py = g.player.y / T;
    const ox = Math.max(0, Math.min(W.W - vw, px - vw / 2)), oy = Math.max(0, Math.min(W.H - vh, py - vh / 2));
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, c.width, c.height);
    ctx.drawImage(W.minimap, ox, oy, vw, vh, 0, 0, c.width, c.height);
    const dot = (x, y, col, r) => { ctx.fillStyle = col; ctx.fillRect((x / T - ox) * scale - r / 2, (y / T - oy) * scale - r / 2, r, r); };
    if (L.has('herbalist')) W.herbs.forEach(h => h.alive && dot(h.x, h.y, '#b8e0a0', 2));
    g.npcs.forEach(n => n.visible && dot(n.x, n.y, g.npcMarker(n.id) ? '#e8b04a' : '#e8e1d3', 3));
    if (g.senseT > 0) g.enemies.forEach(e => !e.dead && dot(e.x, e.y, '#ff2a3a', 3));
    const qt = g.questTarget();
    if (qt) dot(qt.x, qt.y, '#c8323c', 4);
    dot(g.player.x, g.player.y, '#ffffff', 4);
  };

  AB.UI = U;
})();
