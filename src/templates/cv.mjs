// ─────────────────────────────────────────────────────────────────────────────
//  CV page (/cv/): one A4 sheet, built from the same content as the portfolio.
//  The PDF in src/assets/cv/ is printed from this page (see README → "CV").
// ─────────────────────────────────────────────────────────────────────────────
import { esc } from './components.mjs';

const PDF = '/assets/cv/Fuzail-Khan-CV.pdf';

// Facts recruiters scan for first. Every figure is real: years from the
// experience data, product count from the case studies, downloads from Google Play.
function impact({ site, projects }) {
  const since = site.designingSince;
  const years = new Date().getFullYear() - since;
  return [
    { n: `${years}+`, l: `years designing, since ${since}` },
    { n: `${site.experienceYears}+`, l: 'years in enterprise SaaS at Spintly' },
    { n: String(projects.filter((p) => !p.personal).length), l: 'product case studies, web & mobile' },
    { n: '100K+', l: 'Play Store downloads, OptiSpaces.ai app' },
  ];
}

export function cvPage({ site, about, experience, education, publications, certifications, capabilities, tools, projects, coreExpertise }) {
  const c = site.contact;
  const host = site.url.replace(/^https?:\/\//, '');
  const [main, ...earlier] = experience;
  const ai = capabilities.find((g) => /AI/.test(g.title));

  const highlights = [
    ['optispaces', 'Shaped OptiSpaces.ai', 'from legacy UX audit and branding to a company-wide design system and web/mobile UI unifying 7 enterprise modules.'],
    ['spintly-v3', 'Co-designed Spintly V3 & its mobile design system', ' (100K+ Play Store downloads): iterated components directly with QA, taking months off delivery.'],
    ['apple-wallet-integration', 'Designed the Apple Wallet employee badge experience', ' with development and R&D—launched in India across iPhone & Apple Watch (Express Mode, Power Reserve).'],
    ['spintly-global-website', 'Led the 2026 Spintly global website redesign', ' (live at spintly.com), backed by competitor benchmarking (Verkada, Brivo, Kisi, HID, Apple) and reusable components.'],
    ['scypher', 'Rebranded and redesigned Scypher', ', aligning enterprise UI/UX, product positioning and animated 6-step credential architecture storytelling.'],
    [null, 'Elevated product polish with motion & code', ': micro-interactions, onboarding animations and working browser prototypes in HTML/CSS/JS, React and Three.js.'],
  ];

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(site.name)} · CV · ${esc(site.title)}</title>
  <meta name="description" content="CV of ${esc(site.name)}, ${esc(site.title)} in ${esc(site.location)}: product design, UX research, motion and interactive code prototyping for enterprise SaaS.">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <style>
    @font-face { font-family: 'Inter'; src: url('/assets/fonts/inter-var.woff2') format('woff2'); font-weight: 100 900; font-display: swap; }
    @font-face { font-family: 'JetBrains Mono'; src: url('/assets/fonts/jetbrains-mono-400.woff2') format('woff2'); font-weight: 400; font-display: swap; }
    :root { --ink: #0b0d12; --ink-2: #3f4655; --ink-3: #6b7280; --line: #e4e7ec; --soft: #f4f6f9; --blue: #2563eb; --blue-2: #4f8cff; --tint: #eaf1ff; }
    * { box-sizing: border-box; }
    body { margin: 0; background: #e9edf3; color: var(--ink); font: 400 10.5px/1.46 Inter, system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
    a { color: inherit; text-decoration: none; }
    .bar { position: sticky; top: 0; z-index: 2; display: flex; justify-content: center; flex-wrap: wrap; gap: 10px; padding: 14px 16px; background: rgba(233,237,243,.88); backdrop-filter: blur(10px); }
    .bar a, .bar button { font: 600 14px Inter, sans-serif; padding: 10px 18px; border-radius: 999px; border: 1px solid #cfd5df; background: #fff; color: var(--ink); cursor: pointer; }
    .bar .primary { background: var(--ink); border-color: var(--ink); color: #fff; }
    .page { width: 210mm; height: 297mm; margin: 8px auto 40px; background: #fff; box-shadow: 0 24px 60px rgba(16,24,40,.18); display: flex; flex-direction: column; overflow: hidden; }

    header { position: relative; padding: 10.5mm 13mm 7.5mm; background: var(--ink); color: #fff; overflow: hidden; }
    header::before { content: ''; position: absolute; right: -30mm; top: -46mm; width: 110mm; height: 110mm; border-radius: 50%; background: radial-gradient(circle at 40% 60%, rgba(79,140,255,.55), rgba(37,99,235,0) 65%); }
    .head-grid { position: relative; display: grid; grid-template-columns: 1fr auto; gap: 8mm; align-items: end; }
    .avail { display: inline-flex; align-items: center; gap: 6px; font-size: 9.2px; font-weight: 600; letter-spacing: .02em; padding: 3px 9px; border-radius: 999px; background: rgba(79,140,255,.18); color: #cfe0ff; margin-bottom: 8px; }
    .avail i { width: 6px; height: 6px; border-radius: 50%; background: #34d399; box-shadow: 0 0 0 3px rgba(52,211,153,.25); }
    h1 { margin: 0; font-size: 33px; font-weight: 800; letter-spacing: -.045em; line-height: .95; }
    .role { margin: 6px 0 0; font-size: 13.5px; font-weight: 600; color: #fff; }
    .role span { color: var(--blue-2); }
    .tagline { margin: 3px 0 0; font-size: 10.2px; color: #aab3c2; }
    .contact { list-style: none; margin: 0; padding: 0; display: grid; gap: 3px; text-align: right; font-size: 10px; color: #d6dbe4; }
    .contact b { color: #fff; font-weight: 600; }
    .contact .web { color: var(--blue-2); font-weight: 700; font-size: 11px; }

    .impact { display: grid; grid-template-columns: repeat(4, 1fr); border-bottom: 1px solid var(--line); }
    .impact div { padding: 4mm 5mm 3.8mm 13mm; border-right: 1px solid var(--line); }
    .impact div + div { padding-left: 5mm; }
    .impact div:last-child { border-right: 0; }
    .impact b { display: block; font-size: 19.5px; font-weight: 800; letter-spacing: -.04em; color: var(--blue); line-height: 1.05; }
    .impact span { display: block; font-size: 8.8px; color: var(--ink-3); line-height: 1.3; margin-top: 2px; }

    .body { flex: 1; display: grid; grid-template-columns: 1fr 64mm; min-height: 0; }
    main { padding: 5.5mm 7mm 5.5mm 13mm; }
    aside { padding: 5.5mm 11mm 5.5mm 6.5mm; background: var(--soft); }
    h2 { margin: 0 0 6.5px; font-size: 9.4px; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; color: var(--blue); display: flex; align-items: center; gap: 8px; }
    h2::after { content: ''; flex: 1; height: 1px; background: var(--line); }
    aside h2::after { background: #d9dee7; }
    section { margin-bottom: 4.5mm; }
    section:last-child { margin-bottom: 0; }
    .summary { margin: 0; font-size: 10.8px; color: var(--ink-2); line-height: 1.52; }
    .summary b { color: var(--ink); }

    .job-head { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; }
    .job h3 { margin: 0; font-size: 12.2px; font-weight: 700; letter-spacing: -.01em; }
    .job h3 small { font-weight: 500; color: var(--ink-3); font-size: 10.8px; }
    .when { flex: none; font: 400 9.3px 'JetBrains Mono', ui-monospace, monospace; color: var(--ink-3); }
    .ladder { list-style: none; margin: 5.5px 0 6.5px; padding: 0; display: grid; grid-template-columns: repeat(4, 1fr); gap: 4px; }
    .ladder li { position: relative; padding: 4.5px 6px 4.5px 7px; border-radius: 6px; background: var(--soft); font-size: 8.8px; line-height: 1.25; color: var(--ink-3); }
    .ladder li b { display: block; color: var(--ink-2); font-size: 9.4px; font-weight: 600; }
    .ladder li.now { background: var(--tint); }
    .ladder li.now b { color: var(--blue); }
    .ladder li + li::before { content: '→'; position: absolute; left: -6px; top: 50%; transform: translateY(-50%); color: #b6c2d6; font-size: 9px; }
    .hl { margin: 0; padding: 0; list-style: none; display: grid; gap: 3px; }
    .hl li { position: relative; padding-left: 13px; color: var(--ink-2); }
    .hl li::before { content: ''; position: absolute; left: 0; top: .55em; width: 6px; height: 6px; border-radius: 2px; background: var(--blue); transform: rotate(45deg); }
    .hl b { color: var(--ink); font-weight: 600; }
    .hl a b { text-decoration: underline; text-decoration-color: #b7cbf6; text-underline-offset: 2px; }
    .early { display: grid; gap: 3.5px; }
    .early .job-head h3 { font-size: 11px; }
    .early p { margin: 0 0 2px; color: var(--ink-3); font-size: 9.8px; }

    .how { list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; }
    .how li { padding: 6.5px 8px 7px; border-radius: 8px; border: 1px solid var(--line); font-size: 9.2px; line-height: 1.36; color: var(--ink-3); }
    .how span { display: block; font: 400 8.5px 'JetBrains Mono', monospace; color: var(--blue); margin-bottom: 2px; }
    .how b { display: block; font-size: 10.4px; color: var(--ink); margin-bottom: 2px; }
    @media screen and (max-width: 820px) { .how { grid-template-columns: 1fr; } .how li { font-size: 12px; } }
    .tags { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 3.5px; }
    .tags li { padding: 2.3px 6.5px; border-radius: 999px; background: #fff; border: 1px solid #dde2ea; font-size: 9.1px; font-weight: 500; color: var(--ink-2); }
    .tags.strong li { background: var(--ink); border-color: var(--ink); color: #fff; }
    .tags.ai li { background: var(--tint); border-color: var(--tint); color: var(--blue); }
    aside p { margin: 0 0 3px; color: var(--ink-2); font-size: 9.8px; }
    .label { display: block; font-weight: 600; color: var(--ink); font-size: 10.2px; }
    .muted { color: var(--ink-3); }
    .plain { margin: 0; padding-left: 12px; color: var(--ink-2); font-size: 9.5px; }
    .plain li { margin: 1.5px 0; }
    .cta { margin-top: 3.5mm; padding: 8.5px 10px; border-radius: 10px; background: var(--ink); color: #fff; font-size: 9.4px; line-height: 1.4; }
    .cta b { display: block; font-size: 10.4px; }
    .cta a { color: var(--blue-2); font-weight: 600; }

    @media screen and (max-width: 820px) {
      .page { width: auto; height: auto; margin: 0 0 24px; }
      header { padding: 28px 18px 22px; } .head-grid { grid-template-columns: 1fr; gap: 14px; } .contact { text-align: left; }
      h1 { font-size: 34px; }
      .impact { grid-template-columns: 1fr 1fr; } .impact div, .impact div + div { padding: 14px 18px; border-bottom: 1px solid var(--line); }
      .body { grid-template-columns: 1fr; } main, aside { padding: 22px 18px; }
      body { font-size: 13px; } .summary { font-size: 14px; } .ladder { grid-template-columns: 1fr 1fr; } .ladder li + li::before { display: none; }
      .tags li { font-size: 12px; } aside p, .plain, .early p { font-size: 12.5px; } .when { font-size: 11.5px; }
    }
    @page { size: A4; margin: 0; }
    @media print {
      body { background: none; }
      .bar { display: none; }
      .page { margin: 0; box-shadow: none; }
      * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <nav class="bar" aria-label="CV actions">
    <a href="/">← Portfolio</a>
    <a class="primary" href="${PDF}" download>Download Visual PDF</a>
    ${c.cvAts ? `<a href="${esc(c.cvAts)}">ATS-Safe CV →</a>` : ''}
    ${c.cvAtsPdf ? `<a href="${esc(c.cvAtsPdf)}" download>Download ATS PDF</a>` : ''}
    <button type="button" onclick="window.print()">Print</button>
  </nav>

  <article class="page">
    <header>
      <div class="head-grid">
        <div>
          ${site.availability?.enabled ? `<p class="avail"><i></i>Open to Product &amp; Design Engineering roles · 1-month notice</p>` : ''}
          <h1>${esc(site.name)}</h1>
          <p class="role">${esc(site.title)} <span>· Enterprise SaaS &amp; Prototyping</span></p>
          <p class="tagline">Goa, India (Remote preferred · Open across India) · Product Design · Systems · Motion · Code</p>
        </div>
        <ul class="contact">
          <li><a class="web" href="${esc(site.url)}">${esc(host)}</a></li>
          ${c.email ? `<li><a href="mailto:${esc(c.email)}"><b>${esc(c.email)}</b></a></li>` : ''}
          ${c.phone ? `<li><a href="tel:${esc(c.phone.replace(/[^+\d]/g, ''))}">${esc(c.phone)}</a></li>` : ''}
          ${c.linkedin ? `<li><a href="${esc(c.linkedin)}">${esc(c.linkedin.replace(/^https?:\/\/(www\.)?/, ''))}</a></li>` : ''}
          ${c.github ? `<li><a href="${esc(c.github)}">${esc(c.github.replace(/^https?:\/\/(www\.)?/, ''))}</a></li>` : ''}
        </ul>
      </div>
    </header>

    <div class="impact">
      ${impact({ site, projects }).map((m) => `<div><b>${esc(m.n)}</b><span>${esc(m.l)}</span></div>`).join('')}
    </div>

    <div class="body">
      <main>
        <section>
          <h2>Profile</h2>
          <p class="summary">Senior Product &amp; UI/UX Designer with an engineering background who turns complex enterprise systems into clear, responsive products. I own the path from <b>UX research and information architecture</b> to <b>scalable UI systems, motion and interactive browser prototypes</b>, working side by side with product, development and R&amp;D teams from concept to production.</p>
        </section>

        <section>
          <h2>Experience</h2>
          <div class="job">
            <div class="job-head"><h3>${esc(main.roles[0].title)} <small>· ${esc(site.company)}</small></h3><span class="when">${esc(main.period)}</span></div>
            <ol class="ladder" aria-label="Role progression">
              ${main.roles.slice().reverse().map((r, i, a) => `<li${i === a.length - 1 ? ' class="now"' : ''}><b>${esc(r.title)}</b>${esc(r.period)}</li>`).join('')}
            </ol>
            <ul class="hl">
              ${highlights.map(([slug, lead, rest]) => `<li>${slug ? `<a href="${esc(site.url)}/work/${slug}/"><b>${esc(lead)}</b></a>` : `<b>${esc(lead)}</b>`}${esc(rest.startsWith(',') || rest.startsWith(':') || rest.startsWith(' ') ? rest : ' ' + rest)}</li>`).join('')}
            </ul>
          </div>
        </section>

        <section>
          <h2>Earlier</h2>
          <div class="early">
            ${earlier.map((e) => `<div class="job"><div class="job-head"><h3>${esc(e.role)} <small>· ${esc(e.company)}</small></h3><span class="when">${esc(e.period)}</span></div>${e.summary ? `<p>${esc(e.summary)}</p>` : ''}</div>`).join('')}
          </div>
        </section>

        ${about?.principles?.length ? `<section>
          <h2>How I work</h2>
          <ol class="how">${about.principles.map((p, i) => `<li><span>0${i + 1}</span><b>${esc(p.title)}</b>${esc(p.text)}</li>`).join('')}</ol>
        </section>` : ''}

        <section>
          <h2>Education</h2>
          ${education.map((e) => `<div class="job"><div class="job-head"><h3>${esc(e.degree)}</h3><span class="when">${esc(e.period)}</span></div><p class="summary" style="font-size:10.2px">${esc(e.school)}</p></div>`).join('')}
        </section>
      </main>

      <aside>
        <section>
          <h2>Core expertise</h2>
          <ul class="tags strong">${coreExpertise.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
        </section>
        <section>
          <h2>Tools &amp; Tech</h2>
          <ul class="tags">${tools.map((t) => `<li>${esc(t.name)}</li>`).join('')}</ul>
        </section>
        ${ai ? `<section>
          <h2>AI in my workflow</h2>
          <ul class="tags ai">${['Prompt Design', 'Rapid AI Prototyping', 'AI-assisted Research', 'Conversational UI'].map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
        </section>` : ''}
        ${certifications.length ? `<section>
          <h2>Certifications</h2>
          <ul class="plain">${certifications.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
        </section>` : ''}
        ${publications.length ? `<section>
          <h2>Publication</h2>
          <p class="muted" style="font-size:9.4px">${esc(publications[0])}</p>
        </section>` : ''}
        <div class="cta"><b>See the work behind this CV</b>Case studies, motion &amp; live code prototypes at <a href="${esc(site.url)}">${esc(host)}</a></div>
      </aside>
    </div>
  </article>
</body>
</html>`;
}
