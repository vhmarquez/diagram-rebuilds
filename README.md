# Ciena Interactive Experience Rebuilds

Desktop-only React/TypeScript rebuilds of four Ciena Ceros experiences. Work proceeds one page at a time with an explicit user-approval gate after internal QA.

## Current status

- Timeline: approved July 15, 2026.
- Navigator: QA passed, awaiting user approval.
- RLS C&L Band: blocked until Navigator approval.
- Liquid Spectrum: blocked until RLS approval.

See `BUILD_PLAN.md` for the living checklist and `artifacts/verification/` for QA evidence.

## Routes

- `/` — current review page (Navigator).
- `/timeline` — Timeline iframe entry point.
- `/navigator` — Navigator iframe entry point.
- `/qa/navigator-iframe` — fixed 1265 × 712 desktop embed harness.

Later routes are intentionally not created until the preceding page is approved.

## Commands

```bash
npm ci
npm run dev
npm run typecheck
npm run lint
npm test
npm run build
```

Recreate the Timeline source archive, optimized assets, and runtime manifests:

```bash
npm run assets:timeline
```

Recreate the Navigator source archive and optimized assets:

```bash
npm run assets:navigator
```

## Asset model

- `assets/source/<page>/` preserves downloaded originals for audit and future reprocessing.
- `public/assets/optimized/<page>/` contains only deployment-ready runtime assets.
- `src/experiences/<page>/ceros-manifest.json` preserves the source Ceros document.
- `src/experiences/<page>/render-data.json` is the compact client runtime representation.
- `src/experiences/<page>/asset-manifest.json` records URLs, dimensions, byte sizes, and SHA-256 checksums.
- `src/experiences/<page>/runtime-assets.json` contains only local runtime paths.

Production output must not contain Ceros URLs or depend on Ceros at runtime.
