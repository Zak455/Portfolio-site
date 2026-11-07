// Copies the latin WOFF2 subsets + GSAP into src/assets so the site self-hosts everything.
import { copyFileSync, mkdirSync } from 'node:fs';
const out = new URL('../src/assets/', import.meta.url);
const files = [
  ['@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-wght-normal.woff2', 'fonts/bricolage-grotesque-var.woff2'],
  ['@fontsource-variable/inter/files/inter-latin-wght-normal.woff2', 'fonts/inter-var.woff2'],
  ['@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2', 'fonts/instrument-serif-italic.woff2'],
  ['@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2', 'fonts/jetbrains-mono-400.woff2'],
  ['gsap/dist/gsap.min.js', 'js/vendor/gsap.min.js'],
  ['gsap/dist/ScrollTrigger.min.js', 'js/vendor/ScrollTrigger.min.js'],
];
mkdirSync(new URL('fonts/', out), { recursive: true });
mkdirSync(new URL('js/vendor/', out), { recursive: true });
for (const [from, to] of files) {
  copyFileSync(new URL(`./node_modules/${from}`, import.meta.url), new URL(to, out));
  console.log('copied', to);
}
