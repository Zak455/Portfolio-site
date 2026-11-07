import { esc, brandLink, wordmark, availability, arrow } from './components.mjs';

const navItems = [
  ['Work', '/#work', 'work'],
  ['About', '/#about', 'about'],
  ['Playground', '/#playground', 'playground'],
  ['Contact', '/#contact', 'contact'],
];

export function nav(site, { home = true } = {}) {
  const href = (h) => (home ? h.replace('/#', '#') : h);
  const links = navItems
    .map(([label, h, id], i) => `<li><a class="nav-link" href="${href(h)}" data-nav="${id}"><span class="nav-idx" aria-hidden="true">0${i + 1}</span><span class="nav-text" data-label="${label}">${label}</span></a></li>`)
    .join('');
  const mobileLinks = navItems
    .map(([label, h], i) => `<li><a href="${href(h)}" class="menu-link"><span class="menu-idx" aria-hidden="true">0${i + 1}</span><span class="menu-text">${label}</span></a></li>`)
    .join('');
  const talk = site.contact.email ? `mailto:${site.contact.email}` : href('/#contact');
  return `<a class="skip" href="#main">Skip to content</a>
<header class="nav" data-nav-root>
  <div class="nav-inner">
    ${brandLink(home ? '#top' : '/')}
    <nav class="nav-primary" aria-label="Primary">
      <ul role="list">${links}</ul>
    </nav>
    <div class="nav-end">
      ${availability(site, 'status--nav')}
      <a class="nav-cta" href="${talk}"><span>Let’s talk</span>${arrow}</a>
      <button class="menu-btn" type="button" aria-expanded="false" aria-controls="menu" data-menu-btn>
        <span class="sr-only">Menu</span><span class="menu-btn-lines" aria-hidden="true"><i></i><i></i></span>
      </button>
    </div>
  </div>
  <div class="menu" id="menu" data-menu hidden>
    <nav aria-label="Mobile">
      <ul role="list" class="menu-list">${mobileLinks}</ul>
    </nav>
    <div class="menu-foot">
      ${availability(site)}
      <a href="${esc(site.contact.linkedin)}" target="_blank" rel="noopener">LinkedIn ↗</a>
    </div>
  </div>
</header>`;
}

export function footer(site, { home = true } = {}) {
  const year = new Date().getFullYear();
  const link = (h) => (home ? h.replace('/#', '#') : h);
  return `<footer class="footer" data-footer>
  <div class="footer-top wrap">
    <p class="footer-note">${esc(site.name)} — ${esc(site.designation)}</p>
    <ul class="footer-links" role="list">
      <li><a href="${link('/#work')}">Work</a></li>
      <li><a href="${link('/#about')}">About</a></li>
      <li><a href="${link('/#playground')}">Playground</a></li>
      <li><a href="${link('/#contact')}">Contact</a></li>
      <li><a href="${esc(site.contact.linkedin)}" target="_blank" rel="noopener">LinkedIn ↗</a></li>
      ${site.contact.github ? `<li><a href="${esc(site.contact.github)}" target="_blank" rel="noopener">GitHub ↗</a></li>` : ''}
    </ul>
  </div>
  <div class="footer-mark" data-footer-mark>${wordmark({ animate: true, className: 'wm--footer' })}</div>
  <div class="footer-bottom wrap">
    <p>© ${year} ${esc(site.name)}. Designed & built by me.</p>
    <a class="to-top" href="#top">Back to top ↑</a>
  </div>
</footer>`;
}

export function layout({ site, title, description, path = '/', body, home = true, assetVersion = '', ogImage, bodyClass = '' }) {
  const url = site.url + path;
  const og = site.url + (ogImage || site.seo.ogImage);
  const fullTitle = title ? `${title} — ${site.brand}` : `${site.name} — ${site.designation}`;
  const v = assetVersion ? `?v=${assetVersion}` : '';
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description || site.seo.description)}">
<link rel="canonical" href="${esc(url)}">
<meta name="theme-color" content="#0a0a0b">
<meta name="color-scheme" content="dark">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.brand)}">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description || site.seo.description)}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:image" content="${esc(og)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(fullTitle)}">
<meta name="twitter:description" content="${esc(description || site.seo.description)}">
<meta name="twitter:image" content="${esc(og)}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preload" href="/assets/fonts/bricolage-grotesque-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/main.css${v}">
<script>
  // Motion is progressive enhancement: content is visible by default and only
  // hidden for animation once we know JS + motion are allowed. A failsafe
  // reveals everything if the animation script never initialises.
  (function (d) {
    var r = d.documentElement; r.classList.add('js');
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) r.classList.add('motion');
    setTimeout(function () { if (!window.__motion) r.classList.add('motion-failed'); }, 2500);
  })(document);
</script>
<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.name,
    jobTitle: site.title,
    worksFor: { '@type': 'Organization', name: site.company },
    url: site.url,
    sameAs: [site.contact.linkedin, site.contact.github].filter(Boolean),
  })}</script>
</head>
<body class="${bodyClass}" id="top">
${nav(site, { home })}
<main id="main">
${body}
</main>
${footer(site, { home })}
<script src="/assets/js/vendor/gsap.min.js${v}" defer></script>
<script src="/assets/js/vendor/ScrollTrigger.min.js${v}" defer></script>
<script src="/assets/js/main.js${v}" defer></script>
</body>
</html>
`;
}
