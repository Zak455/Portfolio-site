# FUZAIL. — Portfolio of Fuzail Khan

Senior UI/UX Designer · Goa, India. Live at **https://fuzailgfx.vercel.app**.

**Design system:** light and product-first: white canvas, soft grey panels, one blue (`#2563eb` on white, `#4f8cff` on black), black for the Services and Contact sections, Inter throughout. Project cards show real screenshots of the live products (`src/assets/img/work/`, captured Nov 2026); a project without one shows a labelled “Visuals coming soon” panel. Motion (no dependencies): masked hero headline, pointer spotlight, product-area marquee, stacking project cards, scroll-lit About statement, bento grid with live Goa time, cursor label on project images, magnetic buttons, cross-page transitions. Everything respects reduced-motion, and visitors can switch motion off from the footer. Tokens are at the top of `src/assets/css/main.css`.

Second site: **Konkan Creative** (`konkan-creative/`), the graphic design and print studio for local businesses, deployed as its own Vercel project at https://konkancreative.vercel.app.

A static site: content lives in plain data files, a zero-dependency Node script renders it to HTML, and Vercel deploys it on every push to `main`.

```
content/            ← EDIT THESE to update the site
  site.mjs          name, availability badge, hero copy, email/LinkedIn/CV, SEO
  projects.mjs      selected work + full case study content
  profile.mjs       about, experience, capabilities, tools
  playground.mjs    experiments / personal work
  studio.mjs        story chapters, services and FAQ
src/
  templates/        HTML components (layout, home, case study)
  assets/css/       design system (tokens at the top of main.css)
  assets/js/        navigation, filters, fade-ins (no dependencies)
  assets/img/       optimised WebP images & chrome renders
  assets/fonts/     self-hosted WOFF2 (Archivo variable width/weight, Inter, JetBrains Mono)
  public/           favicons (copied to the site root)
scripts/build.mjs   content + templates → dist/
tools/              one-off asset tooling (3D renders, image optimisation, OG image)
assets/source/      original artwork (not deployed)
```

## Run it

```bash
npm run dev        # build + preview at http://localhost:4173
npm run build      # build to dist/ (what Vercel runs)
```

Requires Node 18+. The site itself has **no npm dependencies**.

## Common edits

| I want to… | Do this |
| --- | --- |
| Hide / change the "Open to opportunities" badge | `content/site.mjs` → `availability` |
| Change location / coordinates shown in corners | `content/site.mjs` → `place` |
| Edit the story chapters, services or FAQ | `content/studio.mjs` |
| Add certifications or a publication | `content/profile.mjs` → `certifications`, `publications` |
| Add my email | `content/site.mjs` → `contact.email` (CTAs switch from LinkedIn to email automatically) |
| Add a CV download | Put the PDF in `src/assets/cv/` and set `contact.cv` in `content/site.mjs` |
| Write a case study section | `content/projects.mjs` → the project's `sections`. A section with `body: null` and no media stays hidden. |
| Replace a project card screenshot | Save `<slug>-800.webp` and `<slug>-1440.webp` (16:10) to `src/assets/img/work/` and set `shot` on the project in `content/projects.mjs` |
| Add real project images | Save WebP files to `src/assets/img/work/<slug>/` and set `src` on the matching `media` entry (it replaces the placeholder) |
| Add a before/after slider | Use a media entry `{ compare: { before: '…', after: '…' }, caption: '…' }` |
| Add a Playground piece | Add the image (see `tools/optimize-images.mjs`) and an entry in `content/playground.mjs` |
| Add employment dates | `content/profile.mjs` → `experience[].period` |

**Honesty rule kept throughout:** no invented metrics, testimonials or dates, and team work is described as team work. Placeholders are clearly marked on the page until real material replaces them.

## Asset tooling (optional)

```bash
cd tools && npm install
npm run render     # re-render the chrome 3D objects (Three.js in headless Chromium)
npm run images     # re-optimise source artwork into responsive WebP
node render-icons.mjs
node duotone.mjs   # blue duotone portrait from assets/source/portrait.webp
node render-og.mjs # needs `npm run dev` running in the repo root
```

## Accessibility & performance notes

- Content is fully rendered in HTML; motion is progressive enhancement with a failsafe and respects `prefers-reduced-motion`.
- No WebGL at runtime — the 3D objects are pre-rendered transparent WebP (~20–100 KB each).
- Fonts are subset WOFF2 with `font-display: swap`; key fonts are preloaded.
- Skip link, visible focus states, keyboard-accessible mobile menu with focus trap and Escape to close.
