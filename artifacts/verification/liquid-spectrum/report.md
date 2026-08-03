# Liquid Spectrum QA Report

Date: July 16, 2026
Status: **QA passed — awaiting user approval**

## Scope and references

- Live experience: <https://view.ceros.com/ciena/liquid-spectrum-10/p/1>
- Ciena host page: <https://www.ciena.com/products/liquid-spectrum>
- Rebuild route: `/liquid-spectrum`
- Native artboard: 1280 × 720
- Host-style QA iframe: 1265 × 712
- Tested states: five lifecycle states, eight feature panels, the six-state Previous/Next cycle, both direct-selection branches, close/reset, Escape, focus restoration, and rapid-input locking

## Recovered implementation

The live experience was reconstructed from its Ceros document-version manifest and locally downloaded media instead of using Ceros at runtime.

- All 37 referenced media assets and three required fonts were recovered and inventoried.
- Source files are preserved under `assets/source/liquid-spectrum/`; optimized runtime files are under `public/assets/optimized/liquid-spectrum/`.
- Runtime media is 80.03% smaller than the recovered source set.
- The extracted scene dataset retains 434 selected Ceros components, their artboard coordinates, stacking order, styling, and animation metadata.
- The page renders as a native SVG/component hierarchy. It does not use canvas, panel screenshots, or remote Ceros embeds.
- Legacy Ceros plus, arrow, chevron, and caution symbols that were referenced as shared asset IDs but omitted from the page media list were reconstructed as inline vector geometry using the source component metadata.
- Source text spacing is converted from Ceros thousandths-of-an-em values, preserving the live navigation and panel typography.

## Animation parity

The startup and state transitions were compared at intermediate frames as well as at rest.

- The initial Channel Margin Gauge scene reproduces the approximately 10.3-second component-level build, including ring construction, directional fades, scaling, panel shell, center graphic, lifecycle labels, delayed inner content, and the 7.7-second ring spin.
- Individual source animation families are retained: fade in/down/left/right/up, enlarge, slide left, horizontal and vertical scale, and clockwise spin.
- Feature-panel changes retain the source shell-first sequence followed by illustration, heading, supporting copy, selected lifecycle treatment, and Previous/Next controls over approximately 0.8–1.0 seconds.
- Lifecycle changes retain separate ring, label, center-copy, feature-dimmer, and close-control entrances rather than revealing a whole section at once.
- A 900 ms state lock prevents overlapping requests from producing a mixed scene. Controls expose their disabled state during the transition and unlock afterward.
- Reduced-motion mode removes motion while preserving every final state.

## Visual QA

All eight settled feature states and all five lifecycle states were captured locally and compared to same-size live-reference screenshots.

- Thirteen-state average mean absolute RGB difference: 4.926 levels out of 255.
- Average pixels with any channel differing by more than 12 levels: 6.543%.
- Highest mean difference: Bandwidth Optimizer at 6.771.
- Highest thresholded difference: SNR Optimizer at 8.399%.
- Residual differences were visually reviewed and are concentrated around browser/font antialiasing, shadows, and small reconstructed legacy vector symbols. No unexplained copy, geometry, state, or missing-asset discrepancy remains.
- The source manifest contains the string “Liquid Spectrum applications,” while the published live artboard visibly displays only “Liquid Spectrum.” The rebuild follows the visible published result.

Reference evidence is in `reference/`; rebuilt evidence is in `rebuild/`; the production-size iframe capture is in `embed/`.

## Interaction and accessibility QA

- Every direct lifecycle and feature control selects the expected scene.
- Main feature cycle passed: Planning Tool Calibrator → Bandwidth Optimizer → PinPoint OTDR → Channel Margin Gauge → Photonic Performance Gauge → Liquid Restoration → Planning Tool Calibrator.
- Spectrum Defragmentation and SNR Optimizer preserve the source branch boundaries: Previous returns to Photonic Performance Gauge and Next returns to Planning Tool Calibrator.
- Close returns to the overview and clears the active dialog.
- Escape closes feature panels and restores focus to the originating feature control.
- Native buttons provide Enter/Space operation, accessible names, pressed/disabled states, and focus-visible styling.
- Transition controls remain disabled during the state lock and work normally after it clears.
- No inactive panel remained visually or interactively active after repeated state changes.

## Iframe, browser, and asset QA

- The local host harness measured the iframe at exactly 1265 × 712 inside a 1280 × 720 viewport, with no clipping or horizontal overflow.
- Browser console warnings/errors: zero.
- Broken HTML images: zero.
- Canvas elements: zero.
- Page asset inventory: 82 observed assets plus one inline SVG; zero remote URLs and zero Ceros/Ciena runtime hosts.
- Production output scan: zero `view.ceros.com` or `media.ceros.com` runtime references.

## Automated checks

- `npm run typecheck`: PASS
- `npm run lint`: PASS
- `npm test`: PASS
- Production build: PASS
- Rendered route suite: PASS — 8 of 8
- `git diff --check`: PASS

## Defects found and fixed during QA

- Reconstructed missing shared Ceros legacy icons as native vector elements.
- Corrected Ceros letter-spacing conversion that initially spread navigation labels too widely.
- Matched the source Previous/Next uppercase styling and chevron geometry.
- Added the source lifecycle gradient dimmers to direct feature selections.
- Prevented programmatic focus from showing a non-source border while preserving keyboard focus-visible behavior.
- Matched the published center label instead of rendering source text that is clipped from the live artboard.

## Remaining deployment dependency

The client must confirm redistribution rights for the recovered fonts and brand media before public launch.

## Conclusion

Liquid Spectrum passes visual, animation, interaction, accessibility, iframe, local-asset, console, and automated QA. It is ready for user review. Final release QA remains blocked until explicit Liquid Spectrum approval.
