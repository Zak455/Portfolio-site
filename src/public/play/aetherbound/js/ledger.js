// Aetherbound: LEDGER, the System. Skills by use, levels, stats, offers, titles, save.
(function () {
  const L = {};
  const SAVE_KEY = 'aetherbound.save.v1';

  L.newState = function () {
    const skills = {};
    Object.keys(AB.SKILLS).forEach(id => skills[id] = { lvl: 1, xp: 0, unlocked: false });
    ['oneHand', 'water', 'manaSense', 'foraging', 'woodcutting', 'stealth'].forEach(id => skills[id].unlocked = true);
    return {
      name: 'Kayden Break', age: 6, level: 1, xp: 0, statPts: 0,
      stats: { str: 3, agi: 3, int: 4, vit: 3 },
      hp: 40, mp: 30, skills, abilities: [], titles: { reborn: true }, title: 'reborn',
      counts: { casts: 0, slimes: 0, wolves: 0, healed: 0, dummy: 0, herbs: 0, chops: 0, deaths: 0 },
      quests: {}, flags: {}, debt: 0, bestiary: {}, novelty: {}, entry: 1, offers: [],
      pos: null, herbsGone: [], deadGone: [], time: 0,
    };
  };

  L.S = L.newState();
  const S = () => L.S;

  L.maxHp = () => 30 + S().stats.vit * 8 + S().level * 2;
  L.maxMp = () => 18 + S().stats.int * 5 + S().skills.manaSense.lvl * 2;
  L.speed = () => 118 + S().stats.agi * 4;
  L.has = a => S().abilities.includes(a);
  L.swordDmg = () => 3 + S().stats.str * 1.2 + S().skills.oneHand.lvl * 0.35 + (S().flags.swordUp ? 3 : 0);
  L.boltDmg = () => (4 + S().stats.int * 1.3 + S().skills.water.lvl * 0.45) * (S().title === 'prodigy' ? 1.1 : 1);
  L.healAmt = () => 10 + S().skills.healing.lvl * 1.5 + S().stats.int;
  L.healCost = () => S().title === 'littleHealer' ? 7 : 10;

  L.skillNeed = l => Math.round(8 * Math.pow(l, 1.45));
  L.levelNeed = l => 8 + l * 6;

  function log(text, kind) { if (AB.UI) AB.UI.log(text, kind); }
  L.entryNo = function () { S().entry++; return String(S().entry).padStart(4, '0'); };

  L.unlockSkill = function (id) {
    const sk = S().skills[id];
    if (sk.unlocked) return;
    sk.unlocked = true;
    log(`New skill: ${AB.SKILLS[id].name}`, 'new');
    AB.Audio.sfx('skill');
  };

  // XP = base x challenge x novelty x risk (see design doc).
  L.skillXP = function (id, base, opt) {
    opt = opt || {};
    const st = S(), sk = st.skills[id];
    if (!sk || !sk.unlocked || sk.lvl >= 100) return 0;
    let challenge = 1;
    if (opt.target != null) challenge = Math.max(0.12, Math.min(3, 1 + (opt.target * 3 - sk.lvl) / 12));
    let novelty = 1;
    if (opt.key) { const n = st.novelty[opt.key] = (st.novelty[opt.key] || 0) + 1; if (n <= 3) novelty = 2; }
    const risk = AB.Game && AB.Game.player && st.hp < L.maxHp() * 0.25 ? 1.5 : 1;
    let mult = (L.has('quickStudy') ? 1.25 : 1) * (st.debt > 0 ? 0.9 : 1);
    const gain = base * challenge * novelty * risk * mult;
    sk.xp += gain;
    while (sk.xp >= L.skillNeed(sk.lvl) && sk.lvl < 100) {
      sk.xp -= L.skillNeed(sk.lvl);
      sk.lvl++;
      log(`${AB.SKILLS[id].name} +1 → ${sk.lvl}`, 'skill');
      AB.Audio.sfx('skill');
      L.charXP(sk.lvl, true);
    }
    return gain;
  };

  L.charXP = function (n, quiet) {
    const st = S();
    st.xp += n;
    while (st.xp >= L.levelNeed(st.level)) {
      st.xp -= L.levelNeed(st.level);
      st.level++;
      st.statPts++;
      st.hp = L.maxHp(); st.mp = L.maxMp();
      log(`LEVEL ${st.level}. +1 stat point. Wounds closed.`, 'level');
      AB.Audio.sfx('level');
      if (AB.Game) AB.Game.fx.levelUp();
      if (st.level % 5 === 0) L.queueOffer(`Level ${st.level} offer`);
    }
  };

  L.queueOffer = function (label) {
    const pool = Object.keys(AB.ABILITIES).filter(a => !S().abilities.includes(a));
    const pick = [];
    while (pick.length < 3 && pool.length) pick.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
    if (pick.length) S().offers.push({ label, options: pick });
  };

  L.takeAbility = function (a) {
    S().abilities.push(a);
    log(`Ability granted: ${AB.ABILITIES[a].name}`, 'new');
    if (a === 'herbalist' || a === 'bloodSense') AB.World.buildMinimap();
  };

  L.grantTitle = function (id) {
    if (S().titles[id]) return;
    S().titles[id] = true;
    log(`Title earned: ${AB.TITLES[id].name}`, 'title');
    AB.Audio.sfx('level');
  };

  L.checkTitles = function () {
    const c = S().counts;
    if (c.casts >= 40) L.grantTitle('prodigy');
    if (c.slimes >= 12) L.grantTitle('slimeBane');
    if (c.healed >= 150) L.grantTitle('littleHealer');
  };

  L.addStat = function (k) {
    if (S().statPts <= 0) return;
    S().statPts--; S().stats[k]++;
    if (k === 'vit') S().hp += 8;
    if (k === 'int') S().mp += 5;
  };

  L.save = function () {
    try {
      const st = S();
      const g = AB.Game;
      if (g && g.player) st.pos = { x: g.player.x, y: g.player.y };
      st.herbsGone = AB.World.herbs.map((h, i) => h.alive ? -1 : i).filter(i => i >= 0);
      st.deadGone = AB.World.deadTrees.map((d, i) => d.alive ? -1 : i).filter(i => i >= 0);
      localStorage.setItem(SAVE_KEY, JSON.stringify(st));
    } catch (e) { /* storage may be blocked */ }
  };
  L.hasSave = function () { try { return !!localStorage.getItem(SAVE_KEY); } catch (e) { return false; } };
  L.load = function () {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return false;
      const fresh = L.newState();
      const st = Object.assign(fresh, JSON.parse(raw));
      Object.keys(AB.SKILLS).forEach(id => { if (!st.skills[id]) st.skills[id] = { lvl: 1, xp: 0, unlocked: false }; });
      L.S = st;
      (st.herbsGone || []).forEach(i => { if (AB.World.herbs[i]) AB.World.herbs[i].alive = false; });
      (st.deadGone || []).forEach(i => { if (AB.World.deadTrees[i]) AB.World.deadTrees[i].alive = false; });
      return true;
    } catch (e) { return false; }
  };
  L.wipe = function () { try { localStorage.removeItem(SAVE_KEY); } catch (e) {} L.S = L.newState(); };

  AB.Ledger = L;
})();
