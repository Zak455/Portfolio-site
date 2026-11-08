import { esc, projectCover, tagList, liveLinks, mediaFrame, arrowRight } from './components.mjs';

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
    <div class="cs-section-head" data-reveal>
      <p class="mono cs-index">${String(i + 1).padStart(2, '0')}</p>
      <h2 class="cs-title" id="${id}-t">${esc(s.title)}</h2>
    </div>
    <div class="cs-section-body" data-reveal>
      ${isRole ? '<p class="cs-role-note mono">My contribution</p>' : ''}
      ${body}${list}
      ${isRole && p.teamNote ? `<p class="cs-team-note">${esc(p.teamNote)}</p>` : ''}
    </div>
    ${media}
  </section>`;
}

export function caseStudyPage({ site, project: p, next, sectionOrder }) {
  const { shown, pending } = resolveSections(p, sectionOrder);
  const toc = shown
    .map((s, i) => `<li><a href="#s-${s.key}" data-toc="s-${s.key}"><span class="mono">${String(i + 1).padStart(2, '0')}</span>${esc(s.title)}</a></li>`)
    .join('');
  return `<article class="cs" style="--cover-accent:${esc(p.theme?.accent || '#c6ff3d')}">
  <!-- Sections waiting for content (edit content/projects.mjs): ${pending.map((s) => s.title).join(', ') || 'none'} -->
  <header class="cs-hero">
    <div class="wrap">
      <p class="mono caption" style="margin-bottom:10px">Frame ${esc(p.number)} · “Case study”</p>
      <nav class="crumbs mono" aria-label="Breadcrumb"><a href="/#work">Work</a><span aria-hidden="true">/</span><span aria-current="page">${esc(p.number)} — ${esc(p.name)}</span></nav>
      <p class="cs-num" aria-hidden="true">${esc(p.number)}</p>
      <h1 class="cs-name"><span class="mask"><span class="mask-inner" data-hero-line>${esc(p.name)}</span></span></h1>
      <p class="cs-cat mono" data-hero-fade>${esc(p.category)}</p>
      <p class="cs-summary" data-hero-fade>${esc(p.summary)}</p>
      <dl class="cs-facts" data-hero-fade>
        <div><dt>My role</dt><dd>${esc(p.role)}</dd></div>
        <div><dt>Company</dt><dd>${esc(site.company)}</dd></div>
        ${p.year ? `<div><dt>Year</dt><dd>${esc(p.year)}</dd></div>` : ''}
        <div><dt>Areas</dt><dd>${tagList(p.tags)}</dd></div>
        ${p.links?.length ? `<div><dt>Live</dt><dd>${liveLinks(p.links)}</dd></div>` : ''}
      </dl>
    </div>
    <div class="cs-cover wrap" data-reveal="image">${projectCover(p, { priority: true, sizes: '(min-width: 960px) 80vw, 100vw' })}</div>
  </header>

  <div class="cs-layout wrap">
    <aside class="cs-aside" aria-label="Case study sections">
      <div class="cs-aside-inner">
        <p class="mono cs-aside-label">${esc(p.number)} — ${esc(p.name)}</p>
        <ol class="toc" role="list">${toc}</ol>
        <div class="cs-progress" aria-hidden="true"><span data-cs-progress></span></div>
      </div>
    </aside>
    <div class="cs-content">
      ${shown.map((s, i) => sectionBlock(s, i, p)).join('')}
      <aside class="cs-wip" data-reveal>
        <p class="mono">Case study in progress</p>
        <p>The full process story — research, explorations, wireframes and outcomes — is being written up. Want the walkthrough now? I’m happy to take you through it on a call.</p>
        <a class="text-link" href="/#contact">Get in touch →</a>
      </aside>
    </div>
  </div>

  <nav class="next" aria-label="Next project">
    <a class="next-link" href="/work/${esc(next.slug)}/">
      <span class="wrap next-inner">
        <span class="mono next-label">Next project — ${esc(next.number)}</span>
        <span class="next-name">${esc(next.name)}</span>
        <span class="next-cat mono">${esc(next.category)}</span>
        <span class="next-arrow">${arrowRight}</span>
      </span>
      <span class="next-cover" aria-hidden="true">${projectCover(next, { sizes: '50vw' })}</span>
    </a>
  </nav>
</article>`;
}

export function notFoundPage() {
  return `<section class="nf wrap">
    <p class="mono caption">Frame 404 · “Missing layer”</p>
    <h1 class="nf-title"><span class="mask"><span class="mask-inner" data-hero-line>Layer</span></span><span class="mask"><span class="mask-inner" data-hero-line>not found.</span></span></h1>
    <p>This page doesn’t exist — but the work does.</p>
    <a class="btn-pixel" href="/">Back to the canvas ${arrowRight}</a>
  </section>`;
}
