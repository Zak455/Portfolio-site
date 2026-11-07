// Zero-dependency static site build: content/*.mjs + src/templates → dist/
// Run: npm run build   (Vercel runs this on every push)
import { rm, mkdir, cp, writeFile, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { site } from '../content/site.mjs';
import { projects, sectionOrder, additionalWork } from '../content/projects.mjs';
import { about, experience, capabilities, tools } from '../content/profile.mjs';
import { playground } from '../content/playground.mjs';
import { layout } from '../src/templates/layout.mjs';
import { homePage } from '../src/templates/home.mjs';
import { caseStudyPage, notFoundPage } from '../src/templates/case-study.mjs';

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
  body: homePage({ site, projects, additionalWork, about, experience, capabilities, tools, playground }),
}));

for (const [i, project] of projects.entries()) {
  const next = projects[(i + 1) % projects.length];
  await write(`/work/${project.slug}/`, layout({
    site, path: `/work/${project.slug}/`, home: false, assetVersion, bodyClass: 'page-case',
    title: `${project.name} — ${project.category}`,
    description: `${project.summary} Case study by ${site.name}.`,
    body: caseStudyPage({ site, project, next, sectionOrder }),
  }));
}

await writeFile(new URL('404.html', dist), layout({
  site, path: '/404', home: false, assetVersion, bodyClass: 'page-404', title: 'Not found', body: notFoundPage(),
}));

await writeFile(new URL('sitemap.xml', dist),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages
    .map((p) => `  <url><loc>${site.url}${p}</loc></url>`).join('\n')}\n</urlset>\n`);
await writeFile(new URL('robots.txt', dist), `User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`);

console.log(`Built ${pages.length} pages → dist/ (assets v${assetVersion})`);
