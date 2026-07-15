# Ciena Interactive Experience Rebuild Plan

Last updated: July 15, 2026

This is the living implementation and QA checklist for replacing the four Ceros experiences. It must be updated as work progresses so the current status, evidence, open risks, and approved deviations are not left only in chat.

## Locked decisions

- [x] Build desktop experiences only; no responsive layout variants are required.
- [x] Preserve the current iframe integration model.
- [x] Use fixed desktop artboards and scale them uniformly with their iframe containers.
- [x] Use React, TypeScript, and Vite/vinext to produce independently addressable iframe routes and deployable Cloudflare output.
- [x] Keep each experience isolated at its own route; shared code must not couple page state or approval gates.
- [x] Recover graphics, fonts, content, positions, and interaction metadata from the live Ceros experiences and public Ceros manifests.
- [x] Store and serve recovered assets locally; the finished experiences must not hotlink Ceros.
- [x] Implement and internally QA one experience at a time.
- [x] Compare every rebuilt state to the live reference before considering a page complete.
- [x] Do not ask the client to review unfinished or internally unverified work.
- [x] After a page passes internal QA, notify the user and pause for final approval.
- [x] Do not begin the next page until the user's explicit approval is recorded in this plan.

## Source references

| Order | Experience | Ciena host page | Ceros reference |
| --- | --- | --- | --- |
| 1 | Timeline | <https://www.ciena.com/about/timeline> | <https://view.ceros.com/ciena/about-us-timeline/p/1?heightOverride=4500> |
| 2 | Navigator | <https://www.ciena.com/products/navigator-ncs> | <https://view.ceros.com/ciena/ciena-mcp-5-1-1/p/1> |
| 3 | RLS C&L Band | <https://www.ciena.com/products/6500-reconfigurable-line-system> | <https://view.ceros.com/ciena/rls-c-and-l-band/p/1> |
| 4 | Liquid Spectrum | <https://www.ciena.com/products/liquid-spectrum> | <https://view.ceros.com/ciena/liquid-spectrum-10/p/1> |

## Build order

Work proceeds from the least complex experience to the most complex:

1. **Timeline** — mostly static, long-form fixed layout.
2. **Navigator** — four selectable product states and detail-panel transitions.
3. **RLS C&L Band** — four diagram states plus product-view overlays.
4. **Liquid Spectrum** — the largest interaction/state matrix and most involved animation choreography.

Shared foundation work may be completed before Page 1. After that, a page may not enter implementation until the previous page has passed internal QA and received the user's explicit final approval.

## Status summary

| Workstream | Status | Completion gate |
| --- | --- | --- |
| Shared foundation | Complete for Timeline and Navigator | Clean build, extractor, optimizer, reference-capture workflow, and test harness verified |
| 1. Timeline | Approved July 15, 2026 | Internal QA passed and user approval recorded |
| 2. Navigator | QA passed — awaiting user approval | Timeline approved by user |
| 3. RLS C&L Band | Blocked by Page 2 | Navigator approved by user |
| 4. Liquid Spectrum | Blocked by Page 3 | RLS approved by user |
| Final release QA | Blocked by Page 4 | All four pages approved by user |

## Standard page gates

Each page must pass all four gates, including explicit user approval, before the next page begins.

### Gate A — Reference locked

- [ ] Capture the default desktop reference at its native artboard size.
- [ ] Capture the experience inside the live Ciena iframe at the current desktop dimensions.
- [ ] Inventory every visible state, control, hover behavior, link, overlay, and modal.
- [ ] Record animation start states, end states, sequencing, easing, and approximate duration.
- [ ] Extract all referenced graphics, fonts, and content.
- [ ] Record original asset URLs, dimensions, MIME types, and checksums.
- [ ] Confirm the state/interaction inventory is complete before implementation begins.

### Gate B — Implementation complete

- [ ] Match the fixed artboard dimensions and iframe aspect ratio.
- [ ] Match layout, typography, colors, borders, imagery, and layering.
- [ ] Implement every recorded interactive state.
- [ ] Match the animation choreography and timing closely enough that no visible behavior is missing.
- [ ] Use locally stored assets only.
- [ ] Add accessible names, keyboard operation, focus handling, and valid interactive semantics without changing the visual design.
- [ ] Provide a static production entry point that can run independently inside an iframe.

### Gate C — Internal QA passed

- [ ] TypeScript check passes.
- [ ] Linting passes.
- [ ] Unit/component tests pass where applicable.
- [ ] Production build passes from a clean checkout.
- [ ] Automated interaction tests cover every recorded state.
- [ ] Reference and rebuild screenshots exist for every state.
- [ ] Overlay/difference review shows no unexplained layout, copy, color, or asset mismatch.
- [ ] Animation review covers representative transition frames as well as final states.
- [ ] Mouse, keyboard, focus, close, previous, next, and return-to-default behavior all work where applicable.
- [ ] Browser console has no application errors.
- [ ] Network inspection shows no failed requests and no runtime dependencies on Ceros.
- [ ] The experience works inside a local iframe using the same sizing model as the Ciena host page.
- [ ] A page-specific QA report records tests, evidence, defects found, fixes, and any intentional deviations.

### Gate D — User approval

- [ ] All Gate A, B, and C items are complete.
- [ ] No known high- or medium-severity defect remains.
- [ ] Verification evidence is organized and readable.
- [ ] The page is marked `QA passed — awaiting user approval` in the status summary.
- [ ] Notify the user that internal QA passed and provide the verified preview and evidence.
- [ ] Pause all implementation work on later pages while approval is pending.
- [ ] Record the user's explicit final approval in this plan.
- [ ] Mark the page `Approved` and unlock the next page only after approval is received.

## Shared foundation

### Project and build system

- [x] Initialize the Vite + React + TypeScript/vinext project.
- [ ] Configure independent iframe routes as each page is approved:
  - [x] `/timeline/`
  - [x] `/navigator/`
  - [ ] `/rls/`
  - [ ] `/liquid-spectrum/`
- [x] Configure production asset paths for nested static hosting.
- [x] Add the shared fixed-stage scaling pattern and Timeline typography/color treatment.
- [x] Add reusable fixed-stage scaling, hotspot/state-control, CTA, and iframe QA patterns needed through Navigator; add overlays/dialogs when RLS unlocks them.
- [x] Confirm GSAP is not needed for Timeline; reassess only when a later page's choreography requires it.
- [x] Establish lint, typecheck, rendered-route tests, and production-build commands.
- [x] Add browser-driven desktop interaction and screenshot testing.

### Asset extraction pipeline

- [x] Build a repeatable Ceros manifest extractor.
- [x] Parse JSONP document-version manifests into normal JSON.
- [x] Extract asset ID, URL, MIME type, and original dimensions; preserve component titles in the source manifest.
- [x] Use HTTPS for all extracted Timeline media.
- [x] Download all original media and record checksums.
- [x] Download and inventory required font files.
- [x] Preserve unmodified source copies separately from optimized production assets.
- [x] Preserve Navigator SVG production assets losslessly; continue raster optimization only for raster media.
- [x] Generate two-times-rendered-width WebP variants for raster photographs.
- [x] Produce machine-readable source and runtime asset manifests.
- [x] Verify that every live Ceros asset has a local mapped equivalent.
- [x] Document font-license confirmation as a deployment dependency.

### Reference and QA tooling

- [x] Capture the Timeline reference and rebuild at an equal 1280×720 viewport.
- [x] Capture the live and rebuilt Timeline at the 1265×3163 host-embed dimensions.
- [x] Determine and lock the Timeline's 1280px artboard, 4411px content height, and 4500px published scaling height.
- [x] Settle the 0.8s entrance animation before final-state screenshots.
- [x] Add side-by-side comparison and amplified visual-difference generation.
- [x] Store page evidence under `artifacts/verification/<page>/`.
- [x] Create the first reusable page QA report structure.

### Proposed repository layout

```text
src/
  shared/
  experiences/
    timeline/
    navigator/
    rls/
    liquid-spectrum/
tools/
  ceros-extract/
public/
  assets/
    source/
    optimized/
tests/
  visual/
  interactions/
artifacts/
  verification/
dist/
```

## Page 1 — Timeline

Status: **Approved July 15, 2026**

### Reference inventory

- [x] Extract all 18 manifest media assets and required fonts.
- [x] Lock the chronological order, year labels, copy, images, connector lines, and background regions.
- [x] Determine the exact artboard/content height used in the Ciena host integration.
- [x] Confirm the 0.8s load animation and absence of visible scroll, hover, or click states in the desktop reference.
- [x] Capture full-reference and section-level screenshots so text and imagery remain readable during comparison.

### Implementation

- [x] Build the fixed desktop timeline artboard.
- [x] Match the alternating left/right card placement.
- [x] Match the center line, connectors, year markers, typography, spacing, and card dimensions.
- [x] Place all images at the correct crop, scale, and position.
- [x] Reproduce confirmed animations without adding new behavior.
- [x] Produce the iframe entry point with the required fixed height/aspect behavior.

### QA

- [x] Compare the full timeline against the live reference.
- [x] Compare each timeline card individually at readable scale.
- [x] Verify every year, paragraph, image, and line connection.
- [x] Verify there is no clipping at the top, bottom, or sides of the iframe.
- [x] Run the standard Gate C checklist.
- [x] Write `artifacts/verification/timeline/report.md`.
- [x] Mark Timeline `QA passed — awaiting user approval` and notify the user.
- [x] Record the user's final approval for Timeline: approved in this task on July 15, 2026.
- [x] Only after approval, mark Timeline `Approved` and start Navigator.

## Page 2 — Navigator

Status: **QA passed — awaiting user approval**

### Reference inventory

- [x] Extract all 68 manifest media assets and required fonts.
- [x] Capture the default Navigator Network Control Suite state.
- [x] Capture the Navigator Multi-Layer Controller state.
- [x] Capture the Navigator Intelligent Apps state.
- [x] Capture the Emulation Cloud state.
- [x] Record each state's heading, body copy, screenshot, icon, triangle treatment, CTA, and destination URL.
- [x] Record the crossfade/slide animation sequence and timing between every state.

### Implementation

- [x] Build the fixed 1280×720 artboard.
- [x] Recreate the triangle, product icons, labels, reference state treatment, and hotspots.
- [x] Implement all four product states from a single data-driven detail panel.
- [x] Match image crops, text wrapping, CTA placement, and published visual state treatment.
- [x] Match transition opacity and movement timing.
- [x] Preserve all external CTA destinations.

### QA

- [x] Compare the default state to the reference.
- [x] Compare all three alternate states to the reference.
- [x] Test every triangle hotspot and state transition.
- [x] Test repeated switching and return to the default state.
- [x] Verify CTA labels and destinations without submitting or changing external data.
- [x] Run the standard Gate C checklist.
- [x] Write `artifacts/verification/navigator/report.md`.
- [x] Mark Navigator `QA passed — awaiting user approval` and notify the user.
- [ ] Record the user's final approval for Navigator.
- [ ] Only after approval, mark Navigator `Approved` and start RLS.

## Page 3 — RLS C&L Band

Status: **Blocked by Navigator**

### Reference inventory

- [ ] Extract all 30 manifest media assets and required fonts.
- [ ] Capture Step 1: Initial Installation.
- [ ] Capture Step 2: Grow C-band traffic.
- [ ] Capture Step 3: Expand to L-band.
- [ ] Capture Step 4: Grow L-band traffic.
- [ ] Record all diagram differences between the four steps.
- [ ] Record bullet-copy changes, active/inactive step styling, and optical-spectrum changes.
- [ ] Inventory every Product view hotspot, overlay, image, and close action.
- [ ] Record the transition sequence and timing for step changes and overlays.

### Implementation

- [ ] Build the fixed 1280×720 stage.
- [ ] Recreate shared network, ROADM, amplifier, Raman, spectrum, transponder, and wavelength graphics.
- [ ] Drive all four steps from explicit application state.
- [ ] Match diagram visibility, opacity, labels, active controls, and explanatory copy per step.
- [ ] Implement all Product view overlays and their close behavior.
- [ ] Match state-change and overlay animations.

### QA

- [ ] Compare all four step states to the corresponding live references.
- [ ] Compare every Product view overlay.
- [ ] Test every step control, hotspot, modal close control, and repeated state change.
- [ ] Confirm line work and SVG symbols remain sharp at the Ciena iframe size.
- [ ] Verify no step inherits stale elements from the previous state.
- [ ] Run the standard Gate C checklist.
- [ ] Write `artifacts/verification/rls/report.md`.
- [ ] Mark RLS `QA passed — awaiting user approval` and notify the user.
- [ ] Record the user's final approval for RLS.
- [ ] Only after approval, mark RLS `Approved` and start Liquid Spectrum.

## Page 4 — Liquid Spectrum

Status: **Blocked by RLS**

### Reference inventory

- [ ] Extract all 37 manifest media assets and required fonts.
- [ ] Inventory the Planning, Delivery, Operations, and Optimization lifecycle states.
- [ ] Inventory every feature/question/detail panel reachable within each lifecycle state.
- [ ] Record all Previous, Next, close, phase-selection, and feature-selection behavior.
- [ ] Record every icon, chart, gauge, diagram, image, heading, description, and selected-state treatment.
- [ ] Record panel entrance/exit sequencing, crossfades, vertical scaling, icon movement, and lifecycle rotation/highlight changes.
- [ ] Build a complete state-transition matrix before implementation.

### Implementation

- [ ] Build the fixed 1280×720 stage.
- [ ] Recreate the lifecycle ring, phase controls, center graphics, arrows, panel shell, and navigation controls.
- [ ] Implement the full state matrix from data rather than duplicated markup.
- [ ] Render the correct detail panel, chart, icon, copy, and lifecycle highlight for every state.
- [ ] Implement Previous, Next, close, and direct phase-selection behavior.
- [ ] Match the multi-stage animation choreography and timing.
- [ ] Prevent rapid or repeated input from leaving the experience in an invalid mixed state.

### QA

- [ ] Compare every lifecycle phase and every nested detail state to the live reference.
- [ ] Exercise every valid state transition.
- [ ] Test Previous/Next boundaries, close/reset behavior, direct phase changes, and rapid repeated clicks.
- [ ] Verify no hidden panel remains visually or interactively active.
- [ ] Compare representative transition frames as well as settled states.
- [ ] Run the standard Gate C checklist.
- [ ] Write `artifacts/verification/liquid-spectrum/report.md`.
- [ ] Mark Liquid Spectrum `QA passed — awaiting user approval` and notify the user.
- [ ] Record the user's final approval for Liquid Spectrum.
- [ ] Only after approval, mark Liquid Spectrum `Approved` and start final release QA.

## Final release QA

- [ ] Re-run the complete test suite from a clean checkout.
- [ ] Produce a clean production build containing all four entry points.
- [ ] Verify every entry point directly and inside an iframe.
- [ ] Verify the three 16:9 embeds at the inspected Ciena desktop dimensions.
- [ ] Verify the timeline embed at its locked desktop dimensions.
- [ ] Confirm there are no Ceros scripts, URLs, hotlinks, or runtime dependencies in the production build.
- [ ] Confirm every required asset is local, checksummed, and referenced successfully.
- [ ] Confirm no console errors, failed requests, missing fonts, or broken external links.
- [ ] Review all four final pages against fresh captures of the live references in case the live pages changed during development.
- [ ] Resolve or explicitly document every remaining visual difference.
- [ ] Assemble the deployment files and Squiz/static-host integration instructions.
- [ ] Assemble the final verification index linking all page reports and comparison evidence.
- [ ] Only after this checklist passes, provide the final product for user review.

## QA evidence requirements

Each page's verification folder must contain:

- [ ] Reference screenshots.
- [ ] Rebuild screenshots.
- [ ] Overlay or visual-difference images.
- [ ] A state/interaction matrix.
- [ ] Automated test results.
- [ ] Console and network findings.
- [ ] Defects found during QA and the fixes applied.
- [ ] Any intentional deviation, its reason, and approval status.
- [ ] A final `PASS` or `FAIL` conclusion.

## Change-control rules

- [ ] Update this file whenever a checklist item is completed or a scope decision changes.
- [ ] Do not silently accept a visible mismatch; fix it or record it as an intentional deviation.
- [ ] If the live Ceros experience changes during the project, capture the change and decide whether the original or updated version is authoritative.
- [ ] Do not begin the next page while the current page has unresolved QA defects or is awaiting user approval.
- [ ] Preserve all reference and verification evidence until final acceptance.
