# Ciena interactive experience rebuilds

Four fixed-desktop interactive experiences rebuilt as a static website using only HTML, CSS, vanilla JavaScript, SVG scene data, fonts, and image assets.

## Pages

- `/timeline.html` — Ciena company timeline
- `/navigator.html` — Navigator Network Control Suite
- `/rls.html` — RLS C & L Band
- `/liquid-spectrum.html` — Liquid Spectrum

The experiences are designed for a 1280 × 720 desktop viewport, except the timeline, which preserves its 1280 × 4500 source artboard and scales it into the available iframe.

## Local preview

No packages, framework, or build step are required. From the repository root, run any static file server against the `site` folder. For example:

```powershell
python -m http.server 3000 --directory site
```

Then open [http://localhost:3000](http://localhost:3000).

## Project structure

```text
site/
├── index.html
├── timeline.html
├── navigator.html
├── rls.html
├── liquid-spectrum.html
├── css/
├── js/
├── data/
└── assets/
```

- Each experience has a direct HTML entry point.
- Page layout and animations live in ordinary CSS.
- Interaction state and SVG scene rendering use browser-native JavaScript modules.
- Recovered and optimized Ciena assets are served directly from `site/assets`.

## QA

Run the dependency-free static checks with:

```powershell
node --test tests/static-site.test.mjs
```

The checks verify that all four pages exist, local file references resolve, scene assets are present, and no framework entry points remain in the published site.

## GitHub Pages

Pushing to `main` runs the Pages workflow. GitHub publishes the `site` directory directly; there is no compilation or generated deployment folder.
