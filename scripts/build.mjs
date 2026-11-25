// Zero-dependency static site build: content/*.mjs + src/templates → dist/
// Run: npm run build   (Vercel runs this on every push)
import { rm, mkdir, cp, writeFile, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { site } from '../content/site.mjs';
import { projects, sectionOrder, additionalWork } from '../content/projects.mjs';
import { about, experience, education, publications, certifications, capabilities, tools } from '../content/profile.mjs';
import { playground } from '../content/playground.mjs';
import { story, services, faq } from '../content/studio.mjs';
import { layout } from '../src/templates/layout.mjs';
import { homePage } from '../src/templates/home.mjs';
import { caseStudyPage, notFoundPage } from '../src/templates/case-study.mjs';
import { cvPage } from '../src/templates/cv.mjs';

const root = new URL('../', import.meta.url);
const dist = new URL('dist/', root);

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await cp(new URL('src/assets/', root), new URL('assets/', dist), { recursive: true });
await cp(new URL('src/public/', root), dist, { recursive: true });

// Cache-busting version from the CSS + JS contents.
const hash = createHash('sha1');
for (const f of ['src/assets/css/main.css', 'src/assets/js/main.js']) hash.update(await readFile(new URL(f, root)));
const assetVersion = hash.digest('hex').slice(0, 10);

const pages = [];
const write = async (path, html) => {
  const file = new URL(`.${path}${path.endsWith('/') ? 'index.html' : ''}`, dist);
  await mkdir(new URL('./', file), { recursive: true });
  await writeFile(file, html);
  pages.push(path);
};

await write('/', layout({
  site, path: '/', assetVersion, bodyClass: 'page-home',
  body: homePage({ site, projects, additionalWork, about, experience, education, publications, certifications, capabilities, tools, playground, story, services, faq }),
}));

for (const [i, project] of projects.entries()) {
  const next = projects[(i + 1) % projects.length];
  await write(`/work/${project.slug}/`, layout({
    site, path: `/work/${project.slug}/`, home: false, assetVersion, bodyClass: 'page-case',
    title: `${project.name} · ${project.category}`,
    description: `${project.summary} Case study by ${site.name}.`,
    body: caseStudyPage({ site, project, next, sectionOrder }),
  }));
}

// Standalone CV page (own print styles; the PDF is printed from it).
await write('/cv/', cvPage({ site, about, experience, education, publications, certifications, capabilities, tools, projects, coreExpertise: additionalWork.coreExpertise }));

await writeFile(new URL('404.html', dist), layout({
  site, path: '/404', home: false, assetVersion, bodyClass: 'page-404', title: 'Not found', body: notFoundPage(),
}));

await writeFile(new URL('sitemap.xml', dist),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages
    .map((p) => `  <url><loc>${site.url}${p}</loc></url>`).join('\n')}\n</urlset>\n`);
await writeFile(new URL('robots.txt', dist), `User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`);

// Cache-bust images: browsers keep /assets/img for a week, so every image URL in
// the generated HTML gets ?v=<content hash>. A replaced screenshot gets a new URL
// and shows straight away; unchanged images stay cached.
const imgHash = new Map();
async function versioned(url) {
  if (!imgHash.has(url)) {
    try { imgHash.set(url, createHash('sha1').update(await readFile(new URL(`.${url}`, dist))).digest('hex').slice(0, 8)); }
    catch { imgHash.set(url, null); }
  }
  const h = imgHash.get(url);
  return h ? `${url}?v=${h}` : url;
}
for (const p of [...pages, '/404.html']) {
  const file = new URL(`.${p}${p.endsWith('/') ? 'index.html' : ''}`, dist);
  let html;
  try { html = await readFile(file, 'utf8'); } catch { continue; }
  const urls = [...new Set(html.match(/\/assets\/(?:img|video)\/[^"'\s,)?]+\.(?:webp|png|jpe?g|svg|avif|mp4)(?![?\w])/g) || [])];
  for (const u of urls) html = html.split(u).join(await versioned(u));
  await writeFile(file, html);
}

console.log(`Built ${pages.length} pages → dist/ (assets v${assetVersion}, ${imgHash.size} images versioned)`);
