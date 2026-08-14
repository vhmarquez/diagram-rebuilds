# Timeline QA Report

Date: July 15, 2026
Status: **PASS — awaiting user approval**

## Scope

- Ciena host: <https://www.ciena.com/about/timeline>
- source platform reference: archived original reference
- Rebuild route: `/timeline`
- Required platform: fixed desktop iframe only

## Reference inventory

- source platform artboard width: 1280px.
- Manifest content height: 4411px.
- Published source platform scaling height: 4500px.
- Live Ciena iframe: 1265 × 3162.5px at the inspected desktop viewport.
- Visible experience states: one.
- Visible controls: none.
- Manifest hotspots: 11, all hidden in the published desktop state.
- Media: 18 unique source assets, used by 19 image components.
- Fonts: Aktiv Grotesk Light, Bold, and Regular WOFF files.
- Visible entrance animation: 0.8s ease `fadeDown` on timeline card groups.

The source manifest, source media, font files, dimensions, source URLs, and SHA-256 checksums are retained under `src/experiences/timeline/` and `assets/source/timeline/`. The runtime does not hotlink those sources.

## Implementation

- React 19 + TypeScript + Vite/vinext route at `/timeline`.
- Data-driven renderer uses a normalized 52,085-byte runtime manifest instead of the full source platform document payload.
- Fixed 1280px artboard scales uniformly against the 4500px published height, matching the current source platform `heightOverride` behavior.
- All 18 media assets and three fonts are served locally.
- Photographs are pre-sized to two times their largest rendered width and encoded as WebP at quality 84.
- The small timeline marker PNG is retained losslessly.
- Original media remains outside `public/` so it is preserved for audit purposes without entering the production build.

## Visual verification

### Equal-viewport comparison

At 1280 × 720, both the live source platform reference and rebuild render a 204.8 × 720 scaled stage at the same centered coordinates.

- Full-canvas mean absolute channel difference: **0.672**.
- Full-canvas channels differing by more than 12/255: **1.298%**.
- Stage-only mean absolute channel difference: **4.176**.
- Stage-only channels differing by more than 12/255: **8.062%**.

The residual stage difference is explained by WebP encoding, the rebuild's higher-resolution image variants, and browser text rasterization. No unexplained layout, copy, image, color, or ordering mismatch remains.

### Live iframe geometry comparison

The live Ciena embed and local 1265 × 3163 iframe harness were compared using leaf elements at the top, middle, and bottom of the timeline. Sampled image, text, shape, center-line, marker, and background rectangles matched in y-position, width, and height; x-position differed by only **0.01px** due to fractional centering.

source platform uses zero-size wrapper elements for groups while the rebuild uses sized group wrappers for the entrance transform. Those wrappers do not change any child geometry or visible output.

### Evidence

- `reference/original-1280x720.png`
- `rebuild/local-1280x720-final.png`
- `comparison-reference-left-rebuild-right-final.png`
- `difference-amplified.png`
- `reference-embed/original-host-1265x3163.png`
- `embed/local-1265x3163.png`
- Section-level source screenshots in `reference-embed/` and `embed/`

## Functional and accessibility verification

- Both `/` and `/timeline` server-render successfully.
- All 19 image elements load successfully.
- All image elements include an `alt` attribute using the published source platform descriptions where available.
- The experience has a descriptive `main` landmark label.
- There are no focusable elements because the published Timeline exposes no visible controls or links.
- Aktiv Grotesk reports `loaded` and is used by the rendered text.
- The 0.8s entrance animation is present; reduced-motion users receive the settled state.
- The page does not scroll or clip inside the iframe.

## Runtime and network verification

- Fresh browser tab: no console errors or warnings.
- Broken image count: 0.
- Production `dist/` references to `source-host domain` or `source-view host`: 0.
- Production runtime assets: 1,426,000 bytes, including images and fonts.
- Complete `dist/client`: 1,916,196 bytes (1.83 MiB).
- Original images: 22,756,842 bytes.
- Optimized runtime images: 790,380 bytes.
- Image payload reduction: **96.53%**.

## Automated checks

| Check | Result |
| --- | --- |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm test` | PASS — production build plus 2/2 rendered-route tests |
| Production build routes | PASS — `/` and `/timeline` |
| source platform runtime string scan | PASS — 0 hits in `dist/` |

## Defects found and fixed during QA

1. The first scaling pass used the 4411px content height. The live publication scales against the 4500px override, so the scaler was corrected.
2. Original source files initially lived under `public/`, which caused them to enter the production output. They were moved to `assets/source/`; only optimized runtime variants remain public.
3. The initial runtime imported the complete source platform and asset manifests. A normalized render manifest and runtime asset map now remove source URLs and reduce client JavaScript.
4. The Sites starter lacked ambient Cloudflare types for a standalone typecheck. Minimal declarations were added and the strict TypeScript check now passes.

## Intentional implementation differences

- source platform positions every glyph as an individual element. The rebuild uses semantic text spans with the same font, dimensions, leading, alignment, and wrap points. This materially reduces DOM size and improves text semantics without a visible mismatch.
- Runtime photographs use optimized local WebP variants rather than source platform's on-demand image service.
- Hidden legacy hotspots and hidden mask layers are not rendered because they expose no visible or keyboard-accessible behavior in the published desktop state.
- Responsive behavior is intentionally out of scope per the project requirement.

## Remaining deployment dependency

The client should confirm that its license permits self-hosting the recovered Aktiv Grotesk font files in the final deployment. This is a licensing confirmation, not a functional QA defect.

## Conclusion

The Timeline rebuild passes internal QA with no known high- or medium-severity defect. Work must remain paused on Navigator until the user explicitly approves this page.
