# DesignedByVidhi · portfolio of Vidhi Halarnkar

A static, single-page portfolio with a printable CV, built without a framework or a build step.

```
index.html               the portfolio (hero, work, about, skills pit, journey, contact)
cv/index.html            the CV as a web page, laid out for one A4 sheet
assets/css/style.css     design tokens at the top, then each section
assets/js/main.js        all motion (bouncing letters, stickers, cursor, physics, confetti)
assets/img/              photo (480 / 900 px WebP), social image, favicon
assets/cv/               Vidhi-Halarnkar-CV.pdf (generated from cv/index.html)
serve.mjs                local preview server
```

## Preview

```bash
node serve.mjs   # http://localhost:4180
```

## Common edits

| I want to… | Do this |
| --- | --- |
| Add real work images | Replace the illustrated `.project-cover` blocks in `index.html` with `<img>` tags (keep the `project-cover` class for the frame and shadow) |
| Change skills in the throwable pit | Edit the `<li class="chip-x …">` list in the `#pit` section |
| Update the CV | Edit `cv/index.html`, then regenerate the PDF (below) |
| Turn motion off by default | Visitors can switch it off in the footer; it is already off for anyone with reduced motion set |

## Regenerate the CV PDF

With the preview server running:

```bash
"/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" --headless=new --no-pdf-header-footer --virtual-time-budget=6000 --print-to-pdf="assets/cv/Vidhi-Halarnkar-CV.pdf" http://localhost:4180/cv/
```

Motion uses Matter.js 0.19.0 (cdnjs) for the skills pit; everything else is plain CSS and JS.
