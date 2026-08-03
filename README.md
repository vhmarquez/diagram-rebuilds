# Ciena Interactive Experience Rebuilds

Desktop-only React/TypeScript rebuilds of four Ciena Ceros experiences. Work proceeds one page at a time with an explicit user-approval gate after internal QA.

## Current status

- Timeline: approved July 15, 2026.
- Navigator: approved July 15, 2026.
- RLS C&L Band: approved July 16, 2026.
- Liquid Spectrum: QA passed; awaiting user approval.

See `BUILD_PLAN.md` for the living checklist and `artifacts/verification/` for QA evidence.

## Routes

- `/` — current review page (RLS C&L Band).
- `/timeline` — Timeline iframe entry point.
- `/navigator` — Navigator iframe entry point.
- `/rls` — RLS C&L Band iframe entry point.
- `/liquid-spectrum` — Liquid Spectrum iframe entry point.
- `/qa/navigator-iframe` — fixed 1265 × 712 desktop embed harness.
- `/qa/rls-iframe` — fixed 1265 × 712 desktop embed harness.
- `/qa/liquid-spectrum-iframe` — fixed 1265 × 712 desktop embed harness.

## GitHub Pages

The repository includes a separate static build for GitHub Pages. It reuses the
same experience components without requiring the vinext/Cloudflare server
runtime.

- Team index: <https://vhmarquez.github.io/diagram-rebuilds/>
- Timeline: <https://vhmarquez.github.io/diagram-rebuilds/timeline/>
- Navigator: <https://vhmarquez.github.io/diagram-rebuilds/navigator/>
- RLS C&L Band: <https://vhmarquez.github.io/diagram-rebuilds/rls/>
- Liquid Spectrum: <https://vhmarquez.github.io/diagram-rebuilds/liquid-spectrum/>

Merges to `main` automatically rebuild and deploy the Pages site through
`.github/workflows/pages.yml`.

## Commands

```bash
npm ci
npm run dev
npm run typecheck
npm run lint
npm test
npm run build
npm run test:pages
npm run build:pages
```

Recreate the Timeline source archive, optimized assets, and runtime manifests:

```bash
npm run assets:timeline
```

Recreate the Navigator source archive and optimized assets:

```bash
npm run assets:navigator
```

Recreate the RLS source archive and optimized assets:

```bash
npm run assets:rls
```

Recreate the Liquid Spectrum source archive, optimized assets, and vector scene data:

```bash
npm run assets:liquid-spectrum
```

## Asset model

- `assets/source/<page>/` preserves downloaded originals for audit and future reprocessing.
- `public/assets/optimized/<page>/` contains only deployment-ready runtime assets.
- `src/experiences/<page>/ceros-manifest.json` preserves the source Ceros document.
- `src/experiences/<page>/render-data.json` is the compact client runtime representation.
- `src/experiences/<page>/asset-manifest.json` records URLs, dimensions, byte sizes, and SHA-256 checksums.
- `src/experiences/<page>/runtime-assets.json` contains only local runtime paths.

Production output must not contain Ceros URLs or depend on Ceros at runtime.
