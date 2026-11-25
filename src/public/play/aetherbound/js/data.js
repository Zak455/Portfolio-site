// Aetherbound: static game data (skills, abilities, titles, quests, dialogue).
window.AB = window.AB || {};

AB.TILE = 32;

// Skill trees. Each skill levels only by doing the thing.
AB.TREES = [
  { id: 'blade',   name: 'Blade',     skills: ['oneHand'] },
  { id: 'arcane',  name: 'Arcane',    skills: ['water', 'healing', 'manaSense'] },
  { id: 'hunter',  name: 'Hunter',    skills: ['tracking', 'stealth'] },
  { id: 'survival',name: 'Survival',  skills: ['foraging', 'woodcutting'] },
  { id: 'earth',   name: 'Earthborn', skills: ['science'] },
];

AB.SKILLS = {
  oneHand:     { name: 'One-Hand',      how: 'Land sword hits on living things. The training dummy only teaches so much.' },
  water:       { name: 'Water Magic',   how: 'Cast Water Bolt. Hitting a real enemy teaches more than hitting air.' },
  healing:     { name: 'Healing Magic', how: 'Heal real wounds. XP scales with the HP you restore.' },
  manaSense:   { name: 'Mana Sense',    how: 'Spend mana, or stand still and breathe while your mana refills.' },
  tracking:    { name: 'Tracking',      how: 'Walk along fresh animal tracks in the forest.' },
  stealth:     { name: 'Stealth',       how: 'Move close to enemies that have not noticed you.' },
  foraging:    { name: 'Foraging',      how: 'Pick herbs, berries and mushrooms.' },
  woodcutting: { name: 'Woodcutting',   how: 'Chop marked dead trees with the hatchet.' },
  science:     { name: 'Science',       how: 'Apply knowledge from your first life to this world.' },
};

// Ledger Offers: pick 1 of 3. Granted at birth, then every 5 levels.
AB.ABILITIES = {
  appraise:    { name: 'Appraise',       type: 'Utility', desc: 'See the level and HP of every creature you look at.' },
  bloodSense:  { name: 'Blood Sense',    type: 'Active [Q]', desc: 'Reveal every living thing nearby for 6 s, even through trees.' },
  secondWind:  { name: 'Second Wind',    type: 'Passive', desc: 'Once per rest, survive a killing blow with 1 HP.' },
  aquaDash:    { name: 'Tide Step',      type: 'Active [Space]', desc: 'Dash a short distance on a burst of water. Costs 8 mana.' },
  manaFont:    { name: 'Mana Font',      type: 'Passive', desc: 'Mana refills 60% faster.' },
  keenEdge:    { name: 'Keen Edge',      type: 'Passive', desc: '20% chance for sword hits to crit for double damage.' },
  herbalist:   { name: 'Green Thumb',    type: 'Passive', desc: 'Gathering yields double, and herbs show on the minimap.' },
  splitBolt:   { name: 'Split Bolt',     type: 'Passive', desc: 'Water Bolt fires three bolts in a fan for the same mana.' },
  ironSkin:    { name: 'Iron Skin',      type: 'Passive', desc: 'Take 25% less damage.' },
  quickStudy:  { name: 'Quick Study',    type: 'Passive', desc: 'All skills gain 25% more XP.' },
};

AB.TITLES = {
  reborn:      { name: 'The Reborn',     how: 'Wake up in a new life.',               effect: 'No effect. Yet.' },
  prodigy:     { name: 'Prodigy',        how: 'Cast 40 spells.',                      effect: '+10% Water Magic damage' },
  slimeBane:   { name: 'Slime-Bane',     how: 'Kill 12 slimes.',                      effect: '+15% damage to slimes' },
  littleHealer:{ name: 'Little Healer',  how: 'Restore 150 HP with Healing Magic.',   effect: 'Heals cost 3 less mana' },
  physician:   { name: 'Well-Boiler',    how: 'Stop the fever in Thornwick.',         effect: 'Villagers greet you warmly' },
  wolfbane:    { name: 'Wolfbane',       how: 'Kill the Ash Wolf Alpha.',             effect: '+10% damage to beasts' },
  unwritten:   { name: 'Unwritten',      how: '???',                                  effect: '???' },
};

// Enemies.
AB.ENEMIES = {
  slime: { name: 'Bog Slime', lvl: 1, hp: 14, dmg: 4, speed: 38, aggro: 120, xp: 3, color: '#5f9a4a', r: 11, kind: 'slime' },
  wolf:  { name: 'Ash Wolf',  lvl: 4, hp: 34, dmg: 8, speed: 92, aggro: 190, xp: 8, color: '#55555e', r: 13, kind: 'beast' },
  alpha: { name: 'Ash Wolf Alpha', lvl: 9, hp: 220, dmg: 14, speed: 104, aggro: 260, xp: 40, color: '#3b3b44', r: 22, kind: 'beast', boss: true },
};

// Quests. Each step has a check, read by the quest system each frame.
AB.QUESTS = [
  { id: 'q_walk',   kind: 'Directive', title: 'Stand on your own feet', text: 'Walk to your mother in the garden.', reward: '+1 stat point' },
  { id: 'q_water',  kind: 'World',     title: "Mother's lesson",        text: 'Cast Water Bolt 10 times. [K / right-click]', reward: 'Healing Magic' },
  { id: 'q_sword',  kind: 'World',     title: "Father's drills",        text: 'Hit the training dummy 20 times. [J / left-click]', reward: 'Wooden sword upgrade' },
  { id: 'q_hesk',   kind: 'World',     title: "Old Hesk's errand",      text: 'Gather 6 herbs and chop 3 dead trees.', reward: 'Hesk teaches Tracking' },
  { id: 'q_slime',  kind: 'Directive', title: 'Cull the bog',           text: 'Kill 6 slimes east of the river.', reward: '+1 stat point' },
  { id: 'q_fever',  kind: 'Earthborn', title: 'The fever well',         text: 'Find out why the village is sick.', reward: 'Science' },
  { id: 'q_mira',   kind: 'Directive', title: 'Find Mira',              text: 'Mira followed the wolf tracks into the deep forest. Reach the stone circle.', reward: '???' },
];

AB.NPCS = [
  { id: 'elowen', name: 'Elowen Break', role: 'Mother, village healer', color: '#3f6f8f', hair: '#c9a46a', x: 23.5, y: 17.5 },
  { id: 'garrick', name: 'Garrick Break', role: 'Father, border knight', color: '#4a5563', hair: '#3a2416', x: 15.5, y: 24.5 },
  { id: 'hesk',   name: 'Old Hesk', role: 'Family retainer, hunter', color: '#5a4a32', hair: '#cfcfcf', x: 33.5, y: 13.5 },
  { id: 'mira',   name: 'Mira Break', role: 'Little sister', color: '#b56a8a', hair: '#c9a46a', x: 21.5, y: 18.8 },
  { id: 'sable',  name: 'Sable Vorne', role: 'Wandering mage, your tutor', color: '#2b2440', hair: '#101014', x: 30.5, y: 25.5 },
  { id: 'villager', name: 'Bren the Miller', role: 'Villager', color: '#6d6248', hair: '#4a3a2a', x: 30.5, y: 20.5 },
];
