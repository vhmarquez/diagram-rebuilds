# RLS C&L Band QA Report

Date: July 15, 2026
Status: **PASS — awaiting user approval**

## Scope and references

- Live experience: <https://view.ceros.com/ciena/rls-c-and-l-band/p/1>
- Ciena host page: <https://www.ciena.com/products/6500-reconfigurable-line-system>
- Rebuild route: `/rls`
- Native artboard: 1280 × 720
- Inspected Ciena iframe viewport: 1265 × 711.5625, represented by the 1265 × 712 QA harness
- Reference inventory: four step states, four step-specific ROADM Product views, one shared amplifier Product view, two hover treatments, and the step/overlay animation sequences

## Implementation summary

- Recovered 30 media assets and three fonts from the public Ceros manifest. Originals, checksums, and metadata are retained under `assets/source/rls` and `src/experiences/rls`.
- All production media is served locally. The production output contains no Ceros script or media dependency.
- The experience uses a fixed 1280 × 720 React/TypeScript stage that scales uniformly to the desktop iframe.
- Step controls and Product view controls use native buttons. Product views use focus-managed dialogs with Escape-to-close and focus restoration.
- The 818-component Ceros sequence was replaced with optimized, locally stored render frames sampled at 0, 500, 1200, and 2000 ms plus the settled state. This preserves the reference's staged visual progression without shipping the Ceros runtime.
- The 11,352,569-byte raster source set was reduced to 673,936 bytes before the exact state/transition evidence frames were added, a 94.06% reduction. The complete RLS runtime asset set is 4,156,528 bytes versus 11,988,189 bytes for the source archive, a 65.33% reduction.

## Visual comparison results

All comparisons use equal 1280 × 720 captures. `Mean difference` is the mean absolute RGB channel difference on a 0–255 scale. `Channels over 12` is the percentage of channels with a difference greater than 12.

### Settled step states

| State | Mean difference | Channels over 12 |
| --- | ---: | ---: |
| Step 1 — Initial Installation | 0.690 | 0.294% |
| Step 2 — Grow C-band traffic | 0.666 | 0.309% |
| Step 3 — Expand to L-band | 0.794 | 0.379% |
| Step 4 — Grow L-band traffic | 0.767 | 0.382% |

### Product views

| View | Mean difference | Channels over 12 |
| --- | ---: | ---: |
| Step 1 ROADM | 0.262 | 0.315% |
| Step 2 ROADM | 0.439 | 0.435% |
| Step 3 ROADM | 0.610 | 0.663% |
| Step 4 ROADM | 0.585 | 0.635% |
| Shared amplifier site | 0.801 | 1.037% |

### Representative Step 4 transition frames

| Frame | Mean difference | Channels over 12 |
| --- | ---: | ---: |
| 0 ms | 0.671 | 0.346% |
| 500 ms | 0.747 | 0.368% |
| 1200 ms | 0.772 | 0.379% |

The amplified difference images were manually reviewed. No unexplained shift in layout, copy, color, diagrams, or imagery remains. Small residuals are limited to browser text/focus rasterization.

## Functional and accessibility QA

- All four step controls select the correct state and expose `aria-pressed` correctly.
- Repeated rapid changes (2 → 4 → 1 → 3) settle on only the final selected state with no stale overlay or inherited diagram.
- All five Product views open the correct content.
- Close controls and Escape close the dialog and restore focus to the originating Product view button.
- Dialogs expose `role="dialog"`, `aria-modal="true"`, and an accessible label.
- Focus-visible controls use a 3 px Ciena-red outline with a 3 px offset.
- The fixed iframe harness has no horizontal or vertical clipping or scrollbar.
- Broken-image count is zero; browser console is clean; every runtime asset URL is local.
- The packaged production route returns successfully and operates at 1280 × 720 without overflow.

Detailed coverage is recorded in `state-interaction-matrix.md` and `test-results.md`.

## Defects and deviations

- No known high- or medium-severity defect remains.
- Intentional deviation: transition choreography is represented by exact sampled frames instead of replaying every per-layer transform from the original 818-component Ceros document. The sampled frames and settled states match the reference at pixel-level tolerance, reduce runtime weight, and remove the third-party runtime dependency.
- Deployment dependency: the client must confirm it has redistribution rights for the recovered fonts and brand media before public launch.

## Conclusion

RLS C&L Band passes internal desktop QA and is ready for user review. Liquid Spectrum remains blocked until explicit RLS approval.
