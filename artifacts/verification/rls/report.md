# RLS C&L Band QA Report

Date: July 15, 2026
Status: **QA passed after native-SVG remediation — awaiting user approval**

## Scope and references

- Live experience: archived original reference
- Ciena host page: <https://www.ciena.com/products/6500-reconfigurable-line-system>
- Rebuild route: `/rls`
- Native artboard: 1280 × 720
- Host-style QA iframe: 1265 × 712
- Tested states: initial build, four growth steps, four step-specific ROADM Product views, the shared amplifier Product view, exits, rapid switching, keyboard dismissal, and focus restoration

## Native SVG remediation

The previous screenshot-backed diagram implementation was removed from the runtime. The rebuilt experience now renders the recovered source platform component hierarchy as native SVG.

- The source manifest was reduced to a 325 KB scene dataset containing 697 selected source platform components and local mappings for all 30 referenced assets.
- The live page contains 185 separate inline SVG component surfaces. The rebuild batches the same component tree into two SVG surfaces per active step while preserving individual `<g>`, shape, path, polyline, SVG-image, and text nodes.
- At the most complex settled step, the local DOM contains 280 rendered source platform component groups, 38 vector text blocks, two SVG scene surfaces, no canvas, and no screenshot crop layers.
- Line-system boxes, connections, spectrum bars, icons, callouts, labels, and active-step additions remain vector at runtime.
- Raster assets are limited to the product hardware photography that is also raster in the original experience.
- The renderer uses the original manifest coordinates, dimensions, rotations, opacity, visibility, stacking order, local SVG assets, animation types, durations, and delays.
- Monochrome source platform SVGs that depend on manifest color tinting are recolored from their component metadata; this fixed the original orange callout circles that initially appeared black locally.
- Hidden source platform hover/navigation layers are excluded unless their interaction explicitly reveals them.

## Animation parity

The page was compared live/local at representative intermediate frames, not only after each state settled.

- The base diagram builds from 179 selected components over the original sequence, with motion continuing through the 10-second source window.
- The original on-view triggers are reproduced: Step 1 appears after 5 seconds and the Step 2–4 interactions become available after 7 seconds.
- Step-specific manifest windows are preserved: Step 1 2.5 s, Step 2 2.6 s, Step 3 3.2 s, and Step 4 3.8 s.
- At 350–500 ms after step selection, the live and rebuilt pages showed the same partial bars, lines, labels, bullets, ROADM panels, and transponders.
- At approximately 1.05–1.25 s, the same progressively completed element sets were visible in both versions.
- No step or spectrum section is revealed as a rectangular bitmap. Every changing item animates as its own SVG/component group.
- ROADM Product views retain their 3.0–3.8 s staged component sequences. The shared amplifier view retains its 2.4 s sequence.
- Step changes retain the 200 ms exit window and Product views retain the 220 ms close window.

## Visual and interaction QA

- Settled Steps 1–4 matched the live diagram geometry, copy, spectrum states, device placement, and manifest stacking order.
- The ROADM and amplifier site title strips now expose the original `#E8EBEC` fill; transparent bordered shells no longer mask them.
- source platform content-box border geometry is reproduced for bordered SVG shapes. The two Product view controls now match the source paint bounds exactly: 144 × 34 at `(78, 592)` and `(569, 380)`.
- Product view corners reproduce source platform's proportional CSS radius behavior: the source `44px` declaration resolves to a circular 17px outer radius at 144 × 34; the stroked SVG interior uses matching 16px `rx`/`ry` values.
- Product view hover styling now matches the source 200 ms swap to a white interior, orange border, and orange label instead of the previous glow/scale treatment.
- Both Product view types matched the live shell geometry, hardware imagery, orange vector annotations, headings, and copy.
- Repeated navigation and rapid 2 → 4 → 3 selection settled on the final requested state with no stale layer.
- Escape closes Product views and returns focus to the originating trigger.
- Dialogs expose `role="dialog"`, `aria-modal="true"`, and accessible labels.
- Native buttons preserve Enter/Space activation.
- The local focus-visible ring is an intentional accessibility addition; automated pointer control can leave it visible in some QA captures, while ordinary mouse interaction does not.
- Reduced-motion mode disables entrance/exit motion while leaving the final content visible.
- The 1265 × 712 iframe measured exactly 1265 × 712 with a 1280 × 720 host viewport and no document overflow.
- Browser runtime audit: `data-renderer="native-svg"`, zero canvas elements, zero broken HTML images, and no remote source platform runtime.

## Automated checks

- `npm run typecheck`: PASS
- `npm run lint`: PASS
- `npm test`: PASS
- Production build: PASS
- Rendered route suite: PASS — 6 of 6
- Production route scan for source platform runtime references: PASS — zero matches

The settled native-SVG rebuild captures are in `rebuild/`; the live captures remain in `reference/`. Earlier difference images under `comparisons/` predate this remediation and are retained only as historical evidence of the superseded implementation.

## Remaining deployment dependency

The client must confirm redistribution rights for the recovered fonts and brand media before public launch.

## Conclusion

RLS C&L Band passes native-SVG animation, visual, interaction, iframe, and automated QA. It is ready for user review. Liquid Spectrum remains blocked until explicit RLS approval.
