import { esc, arrow } from './components.mjs';

const navItems = [
  ['Work', '/#work', 'work'],
  ['About', '/#about', 'about'],
  ['Services', '/#services', 'services'],
  ['Experience', '/#experience', 'experience'],
];

const mailOr = (site, fallback) => (site.contact.email ? `mailto:${site.contact.email}` : fallback);

/* ── Top navigation ───────────────────────────────────────────────────────── */
export function nav(site, { home = true } = {}) {
  const href = (h) => (home ? h.replace('/#', '#') : h);
  const links = navItems
    .map(([label, h, id]) => `<li><a class="nav-link" href="${href(h)}" data-nav="${id}">${label}</a></li>`)
    .join('');
  return `<a class="skip" href="#main">Skip to content</a>
<header class="nav" data-nav-root>
  <span class="nav-progress" aria-hidden="true"><span data-progress></span></span>
  <div class="wrap nav-inner">
    <a class="brand" href="${home ? '#top' : '/'}" aria-label="${esc(site.name)}, home">
      <span class="brand-mark" aria-hidden="true">F</span>
      <span class="brand-name">${esc(site.name)}</span>
    </a>
    <nav class="nav-menu" id="menu" aria-label="Primary" data-menu>
      <ul class="nav-list" role="list">${links}</ul>
      <a class="btn btn-dark btn-sm nav-cta" href="#contact" data-magnetic>Get in touch</a>
    </nav>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="menu" data-menu-btn>
      <span class="sr-only" data-menu-label>Open menu</span><span class="nav-toggle-bars" aria-hidden="true"><i></i><i></i></span>
    </button>
  </div>
</header>`;
}

/* ── Footer = contact (on every page) ─────────────────────────────────────── */
export function footer(site) {
  const c = site.contact;
  const year = new Date().getFullYear();
  const ext = c.email ? '' : ' target="_blank" rel="noopener"';
  return `<footer class="foot" id="contact" data-section="contact" aria-labelledby="contact-title">
  <div class="wrap">
    <div class="foot-cta" data-fade>
      <p class="eyebrow eyebrow--dark">Contact</p>
      <h2 class="foot-title" id="contact-title">Let’s make something <span class="accent">real.</span></h2>
      <p class="foot-lead">Have a product, a problem or a role in mind? Good work starts with a conversation.</p>
      <div class="btn-row">
        <a class="btn btn-primary btn-lg" href="${mailOr(site, c.linkedin)}"${ext} data-magnetic>${c.email ? 'Send an email' : 'Message on LinkedIn'} ${arrow}</a>
        ${c.email ? `<button class="btn btn-ghost-dark" type="button" data-copy="${esc(c.email)}"><span data-copy-label>Copy email</span></button>` : ''}
      </div>
    </div>
    <div class="foot-grid">
      <div class="foot-col">
        <p class="foot-label">Based in</p>
        <p>${esc(site.place.city)}, India<br>${esc(site.place.timezone)}</p>
      </div>
      <div class="foot-col">
        <p class="foot-label">Direct</p>
        ${c.email ? `<a href="mailto:${esc(c.email)}">${esc(c.email)}</a>` : ''}
        ${c.cv ? `<a href="${esc(c.cv)}" target="_blank" rel="noopener">View CV ↗<span class="sr-only"> (opens in a new tab)</span></a>` : ''}
      </div>
      <div class="foot-col">
        <p class="foot-label">Elsewhere</p>
        <a href="${esc(c.linkedin)}" target="_blank" rel="noopener">LinkedIn ↗<span class="sr-only"> (opens in a new tab)</span></a>
        ${c.github ? `<a href="${esc(c.github)}" target="_blank" rel="noopener">GitHub ↗<span class="sr-only"> (opens in a new tab)</span></a>` : ''}
      </div>
    </div>
    <div class="foot-meta">
      <span>© ${year} ${esc(site.name)} · ${esc(site.title)}</span>
      <span class="foot-meta-r">
        <button class="motion-toggle" type="button" aria-pressed="true" data-motion-toggle>Motion <span data-motion-state>On</span></button>
        <a href="#top">Back to top ↑</a>
      </span>
    </div>
  </div>
</footer>`;
}

export function layout({ site, title, description, path = '/', body, home = true, assetVersion = '', ogImage, bodyClass = '' }) {
  const url = site.url + path;
  const og = site.url + (ogImage || site.seo.ogImage);
  const fullTitle = title ? `${title} · ${site.name}` : `${site.name} · ${site.title}`;
  const desc = description || site.seo.description;
  const v = assetVersion ? `?v=${assetVersion}` : '';
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${esc(url)}">
<meta name="theme-color" content="#ffffff">
<meta name="color-scheme" content="light">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:image" content="${esc(og)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(fullTitle)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${esc(og)}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preload" href="/assets/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/main.css${v}">
<script>
  // Content is visible by default; fades only apply once JS runs and motion is allowed.
  (function (d) {
    var r = d.documentElement; r.classList.add('js');
    var off = false; try { off = localStorage.getItem('fz-motion') === 'off'; } catch (e) {}
    if (!off && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) r.classList.add('motion');
    setTimeout(function () { if (!window.__ready) r.classList.add('motion-failed'); }, 3000);
  })(document);
</script>
<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.name,
    jobTitle: site.title,
    worksFor: { '@type': 'Organization', name: site.company },
    address: { '@type': 'PostalAddress', addressRegion: 'Goa', addressCountry: 'IN' },
    url: site.url,
    sameAs: [site.contact.linkedin, site.contact.github].filter(Boolean),
  })}</script>
</head>
<body class="${bodyClass}" id="top">
${nav(site, { home })}
<main id="main">
${body}
</main>
${footer(site)}
<div class="cursor" aria-hidden="true" data-cursor-el><span data-cursor-label>View</span></div>
<script src="/assets/js/main.js${v}" defer></script>
</body>
</html>
`;
}
