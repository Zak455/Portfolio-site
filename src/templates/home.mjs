import {
  esc, wordmark, availability, sectionHeading, button, objectImage, projectCover, tagList, liveLinks, picture, arrow, arrowRight,
} from './components.mjs';

/* ── Hero ──────────────────────────────────────────────────────────────────── */
function hero(site) {
  const h = site.hero;
  const lines = h.headline
    .map((line) => {
      const html = esc(line).replace(esc(h.accentWord), `<em>${esc(h.accentWord)}</em>`);
      return `<span class="mask"><span class="mask-inner" data-hero-line>${html}</span></span>`;
    })
    .join('');
  const collab = site.contact.email ? `mailto:${site.contact.email}?subject=Let%E2%80%99s%20collaborate` : '#contact';
  return `<section class="hero" aria-labelledby="hero-title" data-hero>
  <div class="hero-stage" aria-hidden="true">
    <span class="hero-glow"></span>
    <span class="hero-rule hero-rule--v"></span>
    <span class="hero-rule hero-rule--h"></span>
    <div class="hero-object" data-hero-object>${objectImage('monogram', { priority: true, sizes: '(min-width: 960px) 42vw, 78vw', className: 'hero-object-img' })}</div>
  </div>
  <div class="hero-inner wrap">
    <div class="hero-meta" data-hero-fade>
      <p class="mono">(Portfolio)</p>
      <p class="mono hero-meta-role">${esc(site.designation)}</p>
      ${availability(site)}
    </div>
    <h1 class="hero-title" id="hero-title"><span class="sr-only">${esc(site.name)}, ${esc(site.title)}. </span>${lines}</h1>
    <div class="hero-foot">
      <div class="hero-copy" data-hero-fade>
        <p class="hero-intro">${esc(h.intro)}</p>
        <p class="hero-statement">${esc(h.statement)}</p>
      </div>
      <div class="hero-actions" data-hero-fade>
        ${button({ href: '#work', label: 'Explore selected work', icon: arrowRight })}
        ${button({ href: collab, label: 'Let’s collaborate', variant: 'ghost' })}
        <a class="text-link" href="${esc(site.contact.linkedin)}" target="_blank" rel="noopener">LinkedIn ↗<span class="sr-only"> (opens in a new tab)</span></a>
      </div>
    </div>
  </div>
  <div class="hero-mark" data-hero-mark>${wordmark({ animate: true, className: 'wm--hero' })}</div>
  <a class="scroll-cue" href="#work" data-hero-fade><span class="scroll-cue-line" aria-hidden="true"></span><span class="mono">Scroll</span></a>
</section>`;
}

/* ── Work ──────────────────────────────────────────────────────────────────── */
function projectRow(p, i, all) {
  return `<article class="project project--${esc(p.theme?.layout || 'split')}" data-project aria-labelledby="p-${esc(p.slug)}">
  <a class="project-visual" href="/work/${esc(p.slug)}/" tabindex="-1" aria-hidden="true" data-reveal="image">
    ${projectCover(p)}
    <span class="project-view" aria-hidden="true">View case ${arrow}</span>
  </a>
  <div class="project-body" data-reveal>
    <p class="project-num mono">${esc(p.number)} <span>/ ${String(all.length).padStart(2, '0')}</span></p>
    <h3 class="project-title" id="p-${esc(p.slug)}"><a href="/work/${esc(p.slug)}/">${esc(p.name)}</a></h3>
    <p class="project-cat mono">${esc(p.category)}</p>
    <p class="project-summary">${esc(p.summary)}</p>
    <dl class="project-meta">
      <div><dt>My role</dt><dd>${esc(p.role)}</dd></div>
      ${p.teamNote ? `<div><dt>Team</dt><dd>${esc(p.teamNote)}</dd></div>` : ''}
    </dl>
    ${tagList(p.tags)}
    ${liveLinks(p.links)}
    <a class="project-link" href="/work/${esc(p.slug)}/"><span>Read the case study</span>${arrowRight}<span class="sr-only">: ${esc(p.name)}</span></a>
  </div>
</article>`;
}

function work(projects, extra) {
  const marquee = extra.productAreas.map((a) => `<span>${esc(a)}</span><span class="marquee-sep" aria-hidden="true">✦</span>`).join('');
  return `<section class="section work" id="work" aria-labelledby="work-title" data-section="work">
  <div class="wrap">
    ${sectionHeading({ index: '01', label: 'Selected work', title: 'Products, brands & the systems between them.', accent: 'systems', id: 'work-title', intro: `${projects.length} case studies from enterprise SaaS, mobile, web and brand — each one shows what I did and what the team did.` })}
    <div class="projects">${projects.map(projectRow).join('')}</div>
  </div>
  <div class="archive">
    <div class="wrap archive-inner" data-reveal>
      <p class="eyebrow"><span class="eyebrow-index">(+)</span><span>${esc(extra.title)}</span></p>
      <p class="archive-body">${esc(extra.body)}</p>
    </div>
    <div class="marquee" aria-label="Product areas I have designed for: ${esc(extra.productAreas.join(', '))}">
      <div class="marquee-track" aria-hidden="true">${marquee}${marquee}</div>
    </div>
  </div>
</section>`;
}

/* ── About + Experience + Capabilities ────────────────────────────────────── */
function aboutSection(site, about, experience, education, capabilities, tools) {
  const exp = experience
    .map(
      (e) => `<li class="exp" data-reveal>
      <p class="exp-period mono">${esc(e.period)}</p>
      <div class="exp-main">
        <h4 class="exp-company">${esc(e.company)}</h4>
        <p class="exp-role">${esc(e.role)}</p>
        <p class="exp-summary">${esc(e.summary)}</p>
      </div>
      ${e.focus.length || e.highlights.length ? `<div class="exp-detail">
        ${e.focus.length ? `<div><p class="mono exp-label">Focus</p><ul role="list">${e.focus.map((f) => `<li>${esc(f)}</li>`).join('')}</ul></div>` : ''}
        ${e.highlights.length ? `<div><p class="mono exp-label">Selected work</p><ul role="list">${e.highlights.map((f) => `<li>${esc(f)}</li>`).join('')}</ul></div>` : ''}
      </div>` : '<div class="exp-detail"></div>'}
    </li>`,
    )
    .join('');

  const caps = capabilities
    .map(
      (c) => `<div class="cap" data-reveal>
      <p class="cap-index mono">${esc(c.index)}</p>
      <h4 class="cap-title">${esc(c.title)}</h4>
      <ul role="list">${c.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
    </div>`,
    )
    .join('');

  const toolList = tools
    .map(
      (t) => `<li><span class="tool-name">${esc(t.name)}</span><span class="tool-level" aria-label="${esc(t.label)}">${[1, 2, 3]
        .map((n) => `<i class="${n <= t.level ? 'on' : ''}"></i>`)
        .join('')}</span><span class="tool-label mono">${esc(t.label)}</span></li>`,
    )
    .join('');

  return `<section class="section about" id="about" aria-labelledby="about-title" data-section="about">
  <div class="wrap">
    ${sectionHeading({ index: '02', label: 'About', title: 'The designer behind the work.', accent: 'behind', id: 'about-title' })}
    <div class="about-grid">
      <figure class="about-portrait" data-reveal="image">
        ${picture({ base: about.portrait.src, widths: [560, 1000], sizes: '(min-width: 960px) 30vw, 70vw', alt: about.portrait.alt, ratio: [1000, 1501], className: 'portrait-img' })}
        <figcaption class="mono">${esc(site.name)} — ${esc(site.title)}, ${esc(site.company)}</figcaption>
      </figure>
      <div class="about-text">
        <p class="about-lead" data-reveal>${esc(about.lead)}</p>
        ${about.body.map((b) => `<p class="about-body" data-reveal>${esc(b)}</p>`).join('')}
        <blockquote class="philosophy" data-reveal><p>“${esc(about.philosophy)}”</p></blockquote>
        <dl class="about-facts" data-reveal>
          <div><dt>Experience</dt><dd>${esc(site.experienceYears)}+ years</dd></div>
          <div><dt>Currently</dt><dd>${esc(site.title)}, ${esc(site.company)}</dd></div>
          <div><dt>Based in</dt><dd>${esc(site.location)}</dd></div>
        </dl>
      </div>
    </div>
    <div class="principles">
      ${about.principles.map((p, i) => `<div class="principle" data-reveal><p class="mono">0${i + 1}</p><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p></div>`).join('')}
    </div>
    <p class="collab" data-reveal><span class="mono">How I collaborate</span>${esc(about.collaboration)}</p>
  </div>

  <div class="wrap sub-section" id="experience">
    ${sectionHeading({ index: '03', label: 'Experience', title: 'Where I’ve been building.', accent: 'building', level: 3 })}
    <ol class="timeline" role="list">${exp}</ol>
    ${education.length ? `<div class="edu" data-reveal>
      <p class="mono edu-label">Education</p>
      <ul role="list">${education.map((e) => `<li><span class="mono">${esc(e.period)}</span><span class="edu-degree">${esc(e.degree)}</span><span class="edu-school">${esc(e.school)}</span></li>`).join('')}</ul>
    </div>` : ''}
  </div>

  <div class="wrap sub-section" id="capabilities">
    ${sectionHeading({ index: '04', label: 'Capabilities', title: 'From research to the last pixel.', accent: 'last pixel', level: 3 })}
    <div class="caps">${caps}</div>
    <div class="tools" data-reveal>
      <p class="mono tools-label">Tools that support the work</p>
      <ul role="list" class="tool-list">${toolList}</ul>
    </div>
  </div>
</section>`;
}

/* ── Playground ───────────────────────────────────────────────────────────── */
function playgroundSection(items) {
  const content = items.length
    ? `<ul class="lab-grid" role="list">${items
        .map(
          (it, i) => `<li class="lab-item lab-item--${esc(it.shape)}" data-reveal="image">
          <figure>
            <div class="lab-frame">${picture({ base: it.image, widths: it.widths, sizes: it.shape === 'wide' ? '(min-width: 960px) 60vw, 92vw' : '(min-width: 960px) 30vw, 92vw', alt: `${it.title} — ${it.medium}`, ratio: it.ratio })}</div>
            <figcaption><span class="mono">EXP-${String(i + 1).padStart(2, '0')}</span><span class="lab-title">${esc(it.title)}</span><span class="mono lab-medium">${esc(it.medium)}</span></figcaption>
          </figure>
        </li>`,
        )
        .join('')}</ul>`
    : `<div class="lab-empty" data-reveal><p class="mono">EXP-00</p><p class="lab-empty-title">Experiments are brewing.</p><p>Motion studies, type explorations and interface experiments will land here.</p></div>`;
  return `<section class="section lab" id="playground" aria-labelledby="lab-title" data-section="playground">
  <div class="wrap">
    <div class="lab-head">
      ${sectionHeading({ index: '05', label: 'Playground', title: 'Off the clock, on the canvas.', accent: 'on the canvas', id: 'lab-title', intro: 'Experiments outside client and product work — motion, type, interface and 3D studies. Curiosity is where the craft gets sharpened.' })}
      ${items.length ? `<p class="lab-stamp mono" aria-hidden="true">LAB / ${String(items.length).padStart(2, '0')} PIECES</p>` : ''}
    </div>
    ${content}
  </div>
</section>`;
}

/* ── Contact ──────────────────────────────────────────────────────────────── */
function contact(site) {
  const c = site.contact;
  const inquiry = c.email ? `mailto:${c.email}?subject=Project%20inquiry` : c.linkedin;
  const external = !c.email;
  return `<section class="section contact" id="contact" aria-labelledby="contact-title" data-section="contact">
  <div class="wrap">
    <p class="eyebrow" data-reveal><span class="eyebrow-index">(06)</span><span>Contact</span></p>
    <h2 class="contact-title" id="contact-title"><span class="mask"><span class="mask-inner">Have something</span></span><span class="mask"><span class="mask-inner"><em>interesting</em> in mind?</span></span></h2>
    <p class="contact-sub" data-reveal>Let’s create something meaningful together.</p>
    ${availability(site, 'status--contact')}
    <div class="paths">
      <div class="path" data-reveal>
        <p class="mono path-for">For founders & businesses</p>
        <h3>Start a project</h3>
        <p>Product design, brand identity, websites and creative direction — for teams who care about the details.</p>
        ${button({ href: inquiry, label: c.email ? 'Send a work inquiry' : 'Send an inquiry on LinkedIn', external })}
      </div>
      <div class="path" data-reveal>
        <p class="mono path-for">For recruiters & hiring teams</p>
        <h3>Hiring a designer?</h3>
        <p>Senior UI/UX and product design roles. ${site.experienceYears}+ years of experience, currently ${esc(site.title)} at ${esc(site.company)}, based in ${esc(site.location)}.</p>
        <div class="path-actions">
          ${button({ href: c.linkedin, label: 'View LinkedIn profile', variant: 'ghost', external: true })}
          ${c.cv ? button({ href: c.cv, label: 'View CV', variant: 'ghost', external: true }) : ''}
        </div>
      </div>
    </div>
    <ul class="channels" role="list" data-reveal>
      <li><span class="mono">Email</span>${c.email ? `<a href="mailto:${esc(c.email)}">${esc(c.email)}</a>` : '<span class="channel-pending">Coming soon — reach me on LinkedIn</span>'}</li>
      <li><span class="mono">LinkedIn</span><a href="${esc(c.linkedin)}" target="_blank" rel="noopener">linkedin.com/in/fuzail-360 ↗</a></li>
      ${c.github ? `<li><span class="mono">GitHub</span><a href="${esc(c.github)}" target="_blank" rel="noopener">${esc(c.github.replace('https://', ''))} ↗</a></li>` : ''}
    </ul>
  </div>
</section>`;
}

export function homePage({ site, projects, additionalWork, about, experience, education = [], capabilities, tools, playground }) {
  return [
    hero(site),
    work(projects, additionalWork),
    aboutSection(site, about, experience, education, capabilities, tools),
    playgroundSection(playground),
    contact(site),
  ].join('\n');
}
