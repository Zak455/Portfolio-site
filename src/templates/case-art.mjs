// Case study hero motion graphics: one animated SVG scene per project, keyed by
// the project's `object` in content/projects.mjs. Abstract illustrations (not
// product screenshots); CSS-animated, paused off screen, still when motion is off.

const scenes = {
  // OptiSpaces.ai: four modules feeding one platform
  layers: () => {
    const mods = [['Access', 92, 70], ['Attendance', 308, 70], ['Lockers', 92, 232], ['Visitors', 308, 232]];
    return `<svg viewBox="0 0 400 300" role="img" aria-label="Illustration: four product modules connecting into one platform">
      ${mods.map(([, x, y]) => `<path d="M${x} ${y}L200 150" class="a-wire"/>`).join('')}
      ${mods.map(([, x, y], i) => `<path d="M${x} ${y}L200 150" class="a-pulse" pathLength="1" style="--d:${(i * 0.45).toFixed(2)}s"/>`).join('')}
      <circle cx="200" cy="150" r="38" class="a-ring"/>
      <circle cx="200" cy="150" r="38" class="a-ring" style="--d:1.2s"/>
      <circle cx="200" cy="150" r="38" class="a-hub"/>
      <text x="200" y="154" text-anchor="middle" class="a-hub-t">Platform</text>
      ${mods.map(([t, x, y], i) => `<g class="a-mod" style="--d:${(i * 0.45).toFixed(2)}s"><rect x="${x - 52}" y="${y - 18}" width="104" height="36" rx="10" class="a-panel"/><circle cx="${x - 36}" cy="${y}" r="4.5" class="a-led"/><text x="${x - 24}" y="${y + 4}" class="a-t">${t}</text></g>`).join('')}
    </svg>`;
  },

  // Spintly global website: a turning wireframe globe with an orbit and pins
  globe: () => `<svg viewBox="0 0 400 300" role="img" aria-label="Illustration: a rotating wireframe globe with location pins">
      <circle cx="200" cy="150" r="96" class="a-globe"/>
      ${[0, 1, 2, 3].map((i) => `<ellipse cx="200" cy="150" rx="96" ry="96" class="a-meridian" style="--d:${(-i * 1.5).toFixed(1)}s"/>`).join('')}
      ${[-56, -20, 20, 56].map((dy) => `<ellipse cx="200" cy="${150 + dy}" rx="${Math.round(Math.sqrt(96 * 96 - dy * dy))}" ry="9" class="a-parallel"/>`).join('')}
      <g transform="rotate(-16 200 150)">
        <ellipse cx="200" cy="150" rx="168" ry="44" class="a-orbit"/>
        <circle r="6" class="a-sat"/>
      </g>
      ${[[160, 110], [236, 128], [182, 190], [250, 176]].map(([x, y], i) => `<g style="--d:${(i * 0.7).toFixed(1)}s"><circle cx="${x}" cy="${y}" r="5" class="a-pin"/><circle cx="${x}" cy="${y}" r="5" class="a-ping"/></g>`).join('')}
    </svg>`,

  // Scypher: credentials (QR, card, key) cycle on a phone; the reader responds
  rings: () => `<svg viewBox="0 0 400 300" role="img" aria-label="Illustration: QR, card and key credentials cycling on a phone, unlocking a reader">
      <rect x="84" y="36" width="112" height="228" rx="22" class="a-phone"/>
      <rect x="120" y="48" width="40" height="6" rx="3" class="a-notch"/>
      <g class="a-cred" style="--d:0s">
        <rect x="100" y="112" width="80" height="80" rx="10" class="a-qr-bg"/>
        ${[[108, 120], [152, 120], [108, 164]].map(([x, y]) => `<rect x="${x}" y="${y}" width="20" height="20" rx="3" class="a-qr"/>`).join('')}
        ${[[136, 124], [140, 140], [124, 148], [152, 152], [160, 168], [136, 172], [148, 180], [164, 140]].map(([x, y]) => `<rect x="${x}" y="${y}" width="7" height="7" rx="1.5" class="a-qr"/>`).join('')}
      </g>
      <g class="a-cred" style="--d:2s">
        <rect x="96" y="124" width="88" height="56" rx="9" class="a-card"/>
        <rect x="106" y="138" width="16" height="12" rx="2.5" class="a-chip"/>
        <rect x="106" y="162" width="46" height="5" rx="2.5" class="a-card-l"/>
      </g>
      <g class="a-cred" style="--d:4s">
        <circle cx="122" cy="152" r="16" class="a-key"/>
        <circle cx="122" cy="152" r="6" class="a-key-hole"/>
        <path d="M138 152h34v12M160 152v9" class="a-key-bit"/>
      </g>
      <text x="140" y="236" text-anchor="middle" class="a-t a-t--dim">QR · Card · Key</text>
      ${[0, 1, 2].map((i) => `<path d="M${214 + i * 12} 128a${18 + i * 10} ${18 + i * 10} 0 0 1 0 44" class="a-wave" style="--d:${(i * 0.15).toFixed(2)}s"/>`).join('')}
      <rect x="276" y="84" width="64" height="132" rx="14" class="a-reader"/>
      <circle cx="308" cy="116" r="7" class="a-reader-led"/>
      ${[0, 1, 2].map((r) => `<rect x="292" y="${146 + r * 16}" width="32" height="6" rx="3" class="a-reader-l"/>`).join('')}
    </svg>`,

  // Spintly V3: a phone UI scrolls; the tab indicator moves; callouts float
  device: () => `<svg viewBox="0 0 400 300" role="img" aria-label="Illustration: a mobile app with a scrolling list and moving tab indicator">
      <defs><clipPath id="a-screen"><rect x="146" y="40" width="108" height="196" rx="10"/></clipPath></defs>
      <rect x="134" y="20" width="132" height="262" rx="26" class="a-phone"/>
      <g clip-path="url(#a-screen)">
        <rect x="146" y="40" width="108" height="196" class="a-screen"/>
        <g class="a-list">
          ${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<g transform="translate(0 ${74 + i * 34})"><rect x="154" y="0" width="92" height="28" rx="8" class="a-row${i === 1 ? ' a-row--on' : ''}"/><circle cx="168" cy="14" r="7" class="a-av"/><rect x="182" y="8" width="44" height="5" rx="2.5" class="a-l1"/><rect x="182" y="17" width="28" height="4" rx="2" class="a-l2"/></g>`).join('')}
        </g>
        <rect x="146" y="40" width="108" height="28" class="a-appbar"/>
        <rect x="156" y="51" width="40" height="6" rx="3" class="a-l1"/>
        <rect x="146" y="214" width="108" height="22" class="a-tabbar"/>
        ${[0, 1, 2, 3].map((i) => `<circle cx="${163 + i * 25}" cy="225" r="3.5" class="a-tab"/>`).join('')}
        <rect x="153" y="230" width="20" height="3" rx="1.5" class="a-ind"/>
      </g>
      <g class="a-call" style="--d:0s"><rect x="24" y="84" width="96" height="30" rx="15" class="a-chipbox"/><circle cx="42" cy="99" r="4" class="a-led"/><text x="52" y="103" class="a-t">Navigation</text><path d="M120 99h22" class="a-wire"/></g>
      <g class="a-call" style="--d:-2s"><rect x="280" y="184" width="96" height="30" rx="15" class="a-chipbox"/><circle cx="298" cy="199" r="4" class="a-led"/><text x="308" y="203" class="a-t">Usability</text><path d="M258 199h22" class="a-wire"/></g>
    </svg>`,

  // Apple Wallet integration: a badge rises in the wallet and taps a reader
  cards: () => `<svg viewBox="0 0 400 300" role="img" aria-label="Illustration: an employee badge rising in a phone wallet and tapping a reader">
      <defs><clipPath id="a-wallet"><rect x="102" y="44" width="100" height="212" rx="12"/></clipPath></defs>
      <rect x="90" y="26" width="124" height="248" rx="26" class="a-phone"/>
      <g clip-path="url(#a-wallet)">
        <rect x="102" y="44" width="100" height="212" class="a-screen"/>
        <rect x="110" y="58" width="84" height="54" rx="9" class="a-wcard a-wcard--1"/>
        <rect x="110" y="72" width="84" height="54" rx="9" class="a-wcard a-wcard--2"/>
        <g class="a-badge">
          <rect x="110" y="120" width="84" height="54" rx="9" class="a-card"/>
          <rect x="118" y="130" width="14" height="10" rx="2" class="a-chip"/>
          <text x="118" y="164" class="a-t a-t--sm">Employee badge</text>
        </g>
      </g>
      ${[0, 1, 2].map((i) => `<path d="M${226 + i * 13} 126a${20 + i * 11} ${20 + i * 11} 0 0 1 0 48" class="a-wave a-wave--tap" style="--d:${(i * 0.12).toFixed(2)}s"/>`).join('')}
      <rect x="282" y="86" width="62" height="128" rx="14" class="a-reader"/>
      <circle cx="313" cy="118" r="7" class="a-reader-led a-reader-led--tap"/>
      <circle cx="313" cy="166" r="18" class="a-ok-c"/>
      <path d="M304 166l6.5 6.5 12-12" pathLength="1" class="a-ok"/>
    </svg>`,
};

export function caseArt(p) {
  const scene = scenes[p.object];
  if (!scene) return '';
  return `<div class="cs-art mg" data-mg>${scene()}<span class="cs-art-tag">Illustration</span></div>`;
}
