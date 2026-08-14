# Navigator QA Report

Date: July 15, 2026
Status: **PASS — awaiting user approval**

## Scope

- Ciena host: <https://www.ciena.com/products/navigator-ncs>
- source platform reference: archived original reference
- Rebuild route: `/navigator`
- Current review route: `/`
- Required platform: fixed desktop iframe only

## Reference inventory

- source platform artboard: 1280 × 720px with `scale_to_fold` behavior.
- Live Ciena iframe: 1265 × 712px at the inspected desktop viewport.
- Published states: Navigator Network Control Suite, Navigator Multi-Layer Controller, Navigator Intelligent Apps, and Emulation Cloud.
- Published controls: four state hotspots and five visible outbound CTAs across the four states.
- Media: 68 manifest assets—54 SVG, 13 PNG, and one JPEG—plus three Aktiv Grotesk WOFF fonts.
- Manifest components: 413 total, including 99 images, 65 text components, 151 shapes, and 13 hotspots.
- Current publication uses a composite triangle graphic for the complete left-side architecture while the right detail panel changes by state.

The complete source manifest, source media, source URLs, dimensions, MIME types, byte sizes, and SHA-256 checksums are retained under `src/experiences/navigator/` and `assets/source/navigator/`. Runtime pages do not hotlink those sources.

## Implementation

- React 19 + TypeScript + Vite/vinext route at `/navigator`.
- A single explicit state machine drives the data-focused detail panel; no source platform runtime or hidden legacy layer tree ships to the browser.
- Fixed 1280 × 720 artboard scales uniformly to the iframe container.
- The four original hotspot rectangles, five CTA hit rectangles, all current destination URLs, and `_blank` behavior are preserved.
- Native buttons, headings, regions, links, `aria-pressed`, accessible names, alternative text, and visible keyboard focus improve semantics without changing the settled design.
- source platform's 0.8s `fadeLeft`/`fadeIn` transitions and Intelligent Apps stagger delays are reproduced with CSS and disabled under reduced-motion preferences.

## Visual verification

Reference and rebuild screenshots were compared at 1280 × 720 for all four settled states. The rebuild uses source platform's measured text-box inner width—98% of the authored component width—so wrapping and glyph positions match rather than merely approximating the outer layer rectangles.

| State | Mean absolute channel difference | Channels differing by more than 12/255 |
| --- | ---: | ---: |
| Navigator Network Control Suite | 1.432 | 2.365% |
| Navigator Multi-Layer Controller | 0.857 | 1.953% |
| Navigator Intelligent Apps | 0.800 | 1.534% |
| Emulation Cloud | 1.075 | 1.957% |

Representative transition comparisons at 0ms, 500ms, and 1200ms also pass. The local row sequencing uses the source-manifest delays of 0.6s, 1.8s, 2.4s, and 3.0s. Residual difference pixels are explained by WebP encoding and browser text anti-aliasing; no unexplained layout, copy, color, asset, or timing mismatch remains.

### Evidence

- Settled references in `reference/`
- Settled rebuilds in `rebuild/`
- Side-by-side, amplified-difference, and metric files in `comparisons/`
- Reference and rebuild transition frames in `reference/` and `rebuild-transition/`
- Live Ciena and local iframe captures in `reference-embed/` and `embed/`
- Interaction details in `state-interaction-matrix.md`
- Automated and browser results in `test-results.md`

## Functional and accessibility verification

- All state controls transition to the expected content, selection semantics, and links.
- Repeated switching and return to the default state leave no stale content.
- CTA destinations, visual placement, hit areas, new-window behavior, and hover fades match the live publication.
- Native button and anchor semantics provide keyboard activation; the stable focus order and focus-visible treatment were inspected in-browser.
- Every rendered image has alternative text, loads successfully, and remains local.
- The route has one descriptive `main` landmark and no scrollbars at the fixed desktop size.
- The 1265 × 712 local iframe harness matches the live Ciena embed dimensions and renders without clipping.

## Runtime and network verification

- Fresh development and packaged-runtime tabs: no application warnings or errors.
- Broken image count: 0 in every state and inside the packaged iframe harness.
- Production `dist/` references to `source-host domain`, `source-view host`, or `source-media host`: 0.
- Extracted Navigator media: 5,259,648 bytes.
- Optimized Navigator runtime media: 363,524 bytes.
- Media reduction: **93.09%**.
- Navigator fonts: 635,620 bytes.
- Complete packaged client with Timeline and Navigator: 2,931,857 bytes (2.80 MiB).

The packaged Cloudflare Worker plus static-asset binding was exercised through the generated `dist/server/wrangler.json`; HTML, hashed JavaScript, images, routes, and the nested iframe all returned successfully.

## Automated checks

| Check | Result |
| --- | --- |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm test` | PASS — production build plus 4/4 rendered-route tests |
| Packaged-runtime browser QA | PASS |
| source platform runtime string scan | PASS — 0 hits in `dist/` |

## Defects found and fixed during QA

1. The generic optimizer would have rasterized source SVGs. It now preserves SVG and unknown media losslessly while continuing to resize raster screenshots.
2. A first semantic-text pass used authored outer widths directly, which changed several wrap points. The implementation now uses the measured source platform inner text widths and exact line-box offsets.
3. The first Intelligent Apps animation pass compressed the row sequence. The source delays were recovered and restored at 0.6s, 1.8s, 2.4s, and 3.0s.
4. The starter's Node-oriented `vinext start` command did not serve the Cloudflare static-asset binding. `npm start` now runs the packaged Worker through its generated Wrangler configuration, and both route and hashed assets return 200.
5. CTA visual rectangles initially doubled as their clickable rectangles. The invisible live-source platform hit areas are now preserved separately from the pill visuals.

## Intentional implementation differences

- The rebuild renders the current composite triangle asset once rather than carrying source platform's older hidden construction layers and masks.
- Semantic text and controls replace source platform's absolute-positioned paragraph/hotspot wrappers.
- Runtime screenshots use local two-times-rendered-width WebP variants; small icons and SVGs remain lossless.
- The reference shows no selected-state outline, so the rebuild does not add one. Selection remains available to assistive technology through `aria-pressed`.
- Responsive variants are intentionally out of scope per the project requirement.

## Remaining deployment dependency

The client should confirm that its license permits self-hosting the recovered Aktiv Grotesk font files in the final deployment. This is a licensing confirmation, not a functional QA defect.

## Conclusion

The Navigator rebuild passes internal QA with no known high- or medium-severity defect. Work must remain paused on RLS C&L Band until the user explicitly approves Navigator.
