import { esc, productShot, tagList, liveLinks, mediaFrame, arrowRight } from './components.mjs';

// Returns only the sections that have something to show; empty ones are listed
// in an HTML comment so they're easy to find and fill in.
function resolveSections(p, sectionOrder) {
  const shown = [];
  const pending = [];
  for (const [key, title] of sectionOrder) {
    const s = p.sections[key] || {};
    const list = s.useContribution ? p.contribution : s.list;
    const has = (s.body && s.body.length) || (list && list.length) || (s.media && s.media.length);
    (has ? shown : pending).push({ key, title, ...s, list });
  }
  return { shown, pending };
}

function sectionBlock(s, i, p) {
  const id = `s-${s.key}`;
  const body = (s.body || []).map((b) => `<p>${esc(b)}</p>`).join('');
  const list = s.list?.length
    ? `<ul class="cs-list" role="list">${s.list.map((l) => `<li>${esc(l)}</li>`).join('')}</ul>`
    : '';
  const isRole = s.key === 'role';
  const media = s.media?.length ? `<div class="cs-media">${s.media.map((m) => mediaFrame(m, p.slug)).join('')}</div>` : '';
  return `<section class="cs-section${isRole ? ' cs-section--role' : ''}" id="${id}" aria-labelledby="${id}-t" data-cs-section>
    <div class="cs-section-head" data-fade>
      <p class="cs-index">${String(i + 1).padStart(2, '0')}</p>
      <h2 class="cs-title" id="${id}-t">${esc(s.title)}</h2>
    </div>
    <div class="cs-section-body" data-fade>
      ${isRole ? '<p class="eyebrow">My contribution</p>' : ''}
      ${body}${list}
      ${isRole && p.teamNote ? `<p class="cs-team-note">${esc(p.teamNote)}</p>` : ''}
    </div>
    ${media}
  </section>`;
}

export function caseStudyPage({ site, project: p, next, sectionOrder }) {
  const { shown, pending } = resolveSections(p, sectionOrder);
  const toc = shown
    .map((s, i) => `<li><a href="#s-${s.key}" data-toc="s-${s.key}"><span>${String(i + 1).padStart(2, '0')}</span>${esc(s.title)}</a></li>`)
    .join('');
  return `<article class="cs">
  <!-- Sections waiting for content (edit content/projects.mjs): ${pending.map((s) => s.title).join(', ') || 'none'} -->
  <header class="cs-hero">
    <div class="wrap">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="/#work">Work</a><span aria-hidden="true">/</span><span aria-current="page">${esc(p.name)}</span></nav>
      <p class="eyebrow" data-fade>${esc(p.number)} · ${esc(p.category)}</p>
      <h1 class="cs-name" data-fade>${esc(p.name)}</h1>
      <p class="cs-summary" data-fade>${esc(p.summary)}</p>
      <dl class="cs-facts" data-fade>
        <div><dt>My role</dt><dd>${esc(p.role)}</dd></div>
        <div><dt>Company</dt><dd>${esc(site.company)}</dd></div>
        ${p.year ? `<div><dt>Year</dt><dd>${esc(p.year)}</dd></div>` : ''}
        <div><dt>Areas</dt><dd>${tagList(p.tags)}</dd></div>
        ${p.links?.length ? `<div><dt>Live</dt><dd>${liveLinks(p.links)}</dd></div>` : ''}
      </dl>
    </div>
    <div class="wrap cs-cover" data-fade>${productShot(p, { priority: true, caption: true, sizes: '(min-width: 1200px) 1140px, 94vw' })}</div>
  </header>

  <div class="cs-layout wrap">
    <aside class="cs-aside" aria-label="Case study sections">
      <div class="cs-aside-inner">
        <p class="cs-aside-label">On this page</p>
        <ol class="toc" role="list">${toc}</ol>
        <div class="cs-progress" aria-hidden="true"><span data-cs-progress></span></div>
      </div>
    </aside>
    <div class="cs-content">
      ${shown.map((s, i) => sectionBlock(s, i, p)).join('')}
      <aside class="cs-wip" data-fade>
        <p class="eyebrow">Case study in progress</p>
        <p>The full process story — research, explorations, wireframes and outcomes — is being written up. Want the walkthrough now? I’m happy to take you through it on a call.</p>
        <a class="text-link" href="#contact">Get in touch ${arrowRight}</a>
      </aside>
    </div>
  </div>

  <nav class="next wrap" aria-label="Next project">
    <a class="next-card" href="/work/${esc(next.slug)}/">
      <span class="next-text">
        <span class="eyebrow">Next project</span>
        <span class="next-name">${esc(next.name)}</span>
        <span class="next-cat">${esc(next.category)}</span>
        <span class="text-link">View case study ${arrowRight}</span>
      </span>
      <span class="next-visual" aria-hidden="true">${productShot(next, { sizes: '(min-width: 960px) 40vw, 90vw' })}</span>
    </a>
  </nav>
</article>`;
}

export function notFoundPage() {
  return `<section class="nf wrap">
    <p class="eyebrow">404</p>
    <h1 class="nf-title">Page not found.</h1>
    <p>This page doesn’t exist — but the work does.</p>
    <a class="btn btn-primary" href="/">Back to home ${arrowRight}</a>
  </section>`;
}
