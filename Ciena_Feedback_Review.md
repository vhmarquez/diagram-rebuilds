# Ciena Feedback Review

**Source:** `Ciena_Feedback.pdf`
**Review date:** August 12, 2026
**Status:** Review draft — no site changes have been authorized from this document yet

## Purpose

This document preserves the original PDF comments verbatim and adds an implementation assessment for each one. It is intentionally a review inventory rather than the final to-do checklist. After the interpretations, assumptions, and clarification items below are approved, the accepted fixes can be converted into a sequenced implementation and QA checklist.

The PDF contains **29 unique comments** across three experiences:

- Navigator: 6 comments
- RLS C & L Band: 12 comments
- Liquid Spectrum: 11 comments
- Timeline: no comments in this PDF

## Review status key

- **Ready:** The note is specific enough to implement.
- **Ready with shared decision:** The implementation is clear, but a cross-cutting design-system decision should be confirmed.
- **Needs input:** A replacement asset or design-system value is required.

## Supplied color decisions

| Role | Supplied value | Recommended scope |
| --- | --- | --- |
| Action blue | `#1E1EC8` | Links, interactive CTAs, selected blue controls, and focus indicators where permitted by the design system |
| Secondary orange | `#FF7300` | RLS product-view CTAs and orange annotations/callouts |
| Secondary purple | `#963CBE` | RLS optical-spectrum connectors, outlines, and related markers |
| Semantic green | `#14A05A` | Positive/upgrade semantic states in Liquid Spectrum |

### Accessibility observation

The supplied colors should not be applied mechanically without checking foreground colors:

- White on action blue is **10.12:1** and passes WCAG AA for normal text.
- White on orange is **2.73:1** and fails WCAG AA for normal text. A dark foreground such as the current dark purple family would be approximately **7.05:1** and is the safer treatment unless Ciena supplies an approved alternative.
- White on semantic green is **3.38:1**. That can pass for large text and meaningful non-text graphics, but not for normal-size text. Dark text is the safer default for small labels.
- White on secondary purple is **5.70:1** and passes WCAG AA for normal text.

## Clarifications and materials needed

The following questions consolidate the repeated dependencies in the individual comments. Resolving them once will prevent inconsistent fixes across pages.

1. **Bio typography:** Please provide the Bio font files or approved webfont source, licensing confirmation, and the exact headline token (family, weight, size, and line height). If Bio is only a style name rather than a font family, please provide the corresponding design-system specification.
2. **Ciena design-system rules:** Please provide the current tokens or examples for CTA typography, keyboard focus, modal elevation/scrim, diagram panel headers, spacing, bullets/dividers, and transparency/inactive states. If they are not available, I can derive a consistent implementation from the current public Ciena site and document the inferred values.
3. **Accessibility standard:** I recommend using **WCAG 2.2 Level AA** for text, non-text graphics, keyboard operation, focus visibility, and target sizing. Please confirm if Ciena requires a different standard.
4. **Replacement assets:** The feedback asks whether two Navigator product screenshots are current and requests a new Liquid Spectrum illustration. Approved replacement files or a link to Ciena's current asset library are needed; these should not be invented from the old product UI.
5. **Semantic palette:** Green is supplied as `#14A05A`. Please confirm whether Ciena also has updated red, amber/yellow, and neutral semantic tokens that should be applied throughout the gauges.
6. **Scope of color changes:** I recommend applying each confirmed color token consistently to every matching use within its experience, not only the specific object that received the PDF pin. Please confirm this system-wide interpretation.
7. **Liquid Spectrum instruction:** Please confirm whether “Click each phase to learn more” is meant to be an interactive link/button or only instructional copy. Its semantics and focus treatment should match its actual behavior.

## Detailed feedback review

### Navigator

#### N-01 — Unexpected focus state

**PDF page/state:** Page 1, Intelligent Apps view
**Author:** Larry Levine

> Odd focus state appearing.

**Assessment:** The visible red rectangle appears to be the browser focus outline on a large transparent interaction hotspot rather than on the visible control. The focus state is necessary for keyboard users, but its geometry and color make it look accidental.

**Proposed fix:** Keep keyboard focus, attach the indicator to the visible tile/control, and separate keyboard focus from mouse selection. Use `:focus-visible` so a persistent outline is not shown after an ordinary pointer click. Apply the approved focus token consistently to all three Navigator selections.

**Clarification:** Exact focus color, width, and offset from the design system. If none is supplied, use a 2 px action-blue outline with a 2 px offset.
**Status:** Ready with shared decision

#### N-02 — Headline, spacing, and CTA styling

**PDF page/state:** Page 1, Intelligent Apps view
**Author:** Larry Levine

> Font styling, weighting, and spacing looks off.
>
> Wonder if we should try to use Bio as the headline style.
>
> Adjust CTAs to have proper spacing, action blue, and right type.

**Assessment:** The current view uses one-off type and positioning values. That makes the heading, app labels, body copy, and CTAs feel unrelated and causes spacing to vary from item to item.

**Proposed fix:** Create shared Navigator type and spacing tokens, replace the individually positioned CTA treatments with one reusable CTA component, use action blue `#1E1EC8`, and normalize padding, line height, arrow spacing, and casing. Apply the Bio headline treatment after its exact specification and font source are confirmed.

**Clarification:** Bio typography/font files and Ciena's CTA typography and spacing tokens.
**Status:** Needs input

#### N-03 — Diagram label weight

**PDF page/state:** Page 1, Intelligent Apps view
**Author:** Larry Levine

> Should be bold to match the titles to the right?

**Assessment:** The note points to the Emulation Cloud label in the left diagram. Changing only that label would introduce another inconsistency.

**Proposed fix:** Apply the same approved label weight to all peer product labels in the diagram, then compare their hierarchy with the matching titles on the right. A weight of 700 is the recommended starting point unless the design system defines a separate navigation-label token.

**Clarification:** None beyond the shared typography decision.
**Status:** Ready with shared decision

#### N-04 — Action blue value

**PDF page/state:** Page 1, Intelligent Apps view
**Author:** Jenessa Keneavy

> HEX: 1E1EC8

**Assessment:** This resolves the action-blue value referenced in N-02.

**Proposed fix:** Centralize `#1E1EC8` as a token and use it for the Navigator action CTAs and other approved action states. Avoid scattered hard-coded replacements.

**Clarification:** Confirm whether this token should also be the Navigator keyboard-focus color; that is my recommendation.
**Status:** Ready with shared decision

#### N-05 — Emulation Cloud screenshot

**PDF page/state:** Page 2, Emulation Cloud view
**Author:** Larry Levine

> Do these screenshots need to be updated?

**Assessment:** This is a content-accuracy decision, not a rendering defect. The existing product image can be replaced cleanly, but the current product UI should not be guessed.

**Proposed fix:** Once an approved screenshot is provided, preserve the current crop and animation bounds, export an optimized web asset, update the asset reference, and compare the result at the target desktop/iframe size.

**Clarification:** Please confirm whether the existing screenshot remains current or provide the approved replacement. Also confirm whether “these screenshots” applies only to this view or all Navigator product screenshots.
**Status:** Needs input

#### N-06 — Multi-Layer Controller screenshot

**PDF page/state:** Page 3, Multi-Layer Controller view
**Author:** Larry Levine

> Does this screenshot need to be updated.

**Assessment:** As with N-05, this requires a product-content decision and an approved source asset.

**Proposed fix:** Replace the dashboard image without changing its visual bounds or transition behavior, optimize the delivered image for the web, and perform side-by-side visual QA.

**Clarification:** Please confirm whether the screenshot is current or provide its approved replacement.
**Status:** Needs input

### RLS C & L Band

#### RLS-01 — Selected-step action blue

**PDF page/state:** Page 4, Step 1
**Author:** Larry Levine

> Action Blue

**Assessment:** This identifies the selected Step 1 pill as an action-blue component. RLS-02 supplies the requested value.

**Proposed fix:** Change the active-step token and all selected step pills to `#1E1EC8`, retain a clearly distinct inactive treatment, and verify text and focus contrast.

**Clarification:** Confirm that the value should apply to all selected RLS step pills, not only Step 1.
**Status:** Ready with shared decision

#### RLS-02 — Action blue value

**PDF page/state:** Page 4, Step 1
**Author:** Jenessa Keneavy

> HEX: 1E1EC8

**Assessment:** This resolves the color requested in RLS-01.

**Proposed fix:** Use the centralized action-blue token rather than a page-specific hard-coded value. White text has a 10.12:1 contrast ratio on this color.

**Clarification:** None beyond the scope confirmation in RLS-01.
**Status:** Ready

#### RLS-03 — Product-view secondary color

**PDF page/state:** Page 4, Step 1
**Author:** Larry Levine

> Replace with secondary palette color.

**Assessment:** The note targets the orange Product view button. RLS-04 supplies the new orange value.

**Proposed fix:** Use the secondary-orange token for every RLS Product view CTA and define matching hover, pressed, and focus-visible states. Because white text on `#FF7300` is only 2.73:1, use an approved dark text color or another design-system-compliant treatment.

**Clarification:** Confirm whether dark text is acceptable on this orange CTA; it is the accessible recommendation.
**Status:** Ready with shared decision

#### RLS-04 — Secondary orange value

**PDF page/state:** Page 4, Step 1
**Author:** Jenessa Keneavy

> HEX: FF7300

**Assessment:** This resolves the orange requested in RLS-03 and is repeated for modal annotations in RLS-11.

**Proposed fix:** Centralize `#FF7300` and use it for the approved RLS CTA and callout roles. Do not rely on color alone to communicate state.

**Clarification:** None beyond foreground-color and scope decisions.
**Status:** Ready with shared decision

#### RLS-05 — Optical-path secondary color

**PDF page/state:** Page 4, Step 1
**Author:** Larry Levine

> Replace with secondary palette color.

**Assessment:** The note points to the purple optical-spectrum path/markers. RLS-06 supplies the replacement value.

**Proposed fix:** Update the shared vector/scene color token so the connector, spectrum border, and related nodes change together and remain synchronized during animation.

**Clarification:** Confirm that all purple optical-path elements in RLS should receive the new value.
**Status:** Ready with shared decision

#### RLS-06 — Secondary purple value

**PDF page/state:** Page 4, Step 1
**Author:** Jenessa Keneavy

> HEX: 963CBE

**Assessment:** This resolves the value requested in RLS-05. White on this purple has a 5.70:1 contrast ratio.

**Proposed fix:** Centralize `#963CBE` and reference it from the SVG/scene renderer for every approved purple connector and marker.

**Clarification:** None beyond the scope confirmation in RLS-05.
**Status:** Ready

#### RLS-07 — Explanatory copy, divider, and bullets

**PDF page/state:** Page 4, Step 1
**Author:** Larry Levine

> Adjust line / typography / bullets to be more in line with our system.

**Assessment:** The top explanatory block currently combines custom divider, body, and bullet styling that does not appear to use one spacing/type system.

**Proposed fix:** Rebuild the callout as a small reusable component with explicit tokens for divider thickness/height/color, body size/line height, bullet size/indent, and vertical rhythm. Use the same component in every RLS state that shows this content.

**Clarification:** Ciena's current divider, body, bullet, and spacing tokens—or approval to infer a consistent set from the public site.
**Status:** Needs input

#### RLS-08 — Diagram panel title styling

**PDF page/state:** Page 4, Step 1
**Author:** Larry Levine

> Same comment as previous about font weight, spacing, styling, etc.

**Assessment:** The note targets the Bi-directional Amplifier Site heading and refers back to the prior typography/spacing concern. The ROADM Site and amplifier headings should behave as a paired component.

**Proposed fix:** Apply one diagram-panel title token to both headings, including background, font weight, line height, wrapping, alignment, and top/bottom padding.

**Clarification:** The approved panel-header typography and spacing token; otherwise I will normalize both to the closest current Ciena pattern.
**Status:** Ready with shared decision

#### RLS-09 — Modal foreground/background treatment

**PDF page/state:** Page 5, Bi-directional Amplifier Product View modal
**Author:** Larry Levine

> Address modal foreground to background.
>
> Do we use a shadow vs. a stroke?
>
> Adjust hot spots, line, and orange color to be compliant.

**Assessment:** The foreground modal and faded scene need a clearer elevation relationship. A heavy stroke alone tends to flatten the modal; a neutral shadow plus a subtle boundary and controlled scrim is the stronger default. The hotspots and callout lines also need consistent geometry and accessible contrast.

**Proposed fix:** Add a design-system scrim, use the approved modal shadow/elevation treatment with a subtle divider or boundary where needed, enlarge/normalize interactive hit areas, and change orange headings, dots, and callout lines to `#FF7300`. Test close control, hotspots, keyboard order, focus visibility, and meaningful non-text contrast.

**Clarification:** Ciena's modal elevation, scrim opacity, and boundary tokens; confirm that WCAG 2.2 AA is the compliance target.
**Status:** Needs input

#### RLS-10 — Modal header spacing and alignment

**PDF page/state:** Page 5, Bi-directional Amplifier Product View modal
**Author:** Larry Levine

> Top / Bottom margins + alignment on header.

**Assessment:** The title should remain visually centered within a fixed header area independently of the close control.

**Proposed fix:** Set equal top/bottom padding, center the title in the full modal width, reserve safe space for the close control, and align the divider consistently. Check short and long titles at the fixed desktop width.

**Clarification:** Use Ciena's modal-header spacing token if supplied; otherwise this is ready to normalize visually.
**Status:** Ready with shared decision

#### RLS-11 — Modal orange value

**PDF page/state:** Page 5, Bi-directional Amplifier Product View modal
**Author:** Jenessa Keneavy

> Orange: FF7300

**Assessment:** This resolves the orange for the modal callouts mentioned in RLS-09.

**Proposed fix:** Apply `#FF7300` to the DLA/SRA headings, callout lines, and hotspot circles, then verify each usage against its background. Use dark text where the orange becomes a filled background.

**Clarification:** None beyond the global orange scope and accessibility decisions.
**Status:** Ready with shared decision

#### RLS-12 — Product-view focus/click state

**PDF page/state:** Page 6, Step 1 main view
**Author:** Larry Levine

> Weird focus state / non-compliant click state.

**Assessment:** The pointer-click state and keyboard-focus state appear to be conflated. A pointer click should not leave a large persistent focus ring, while keyboard users still need a strong visible focus indicator.

**Proposed fix:** Define separate hover, pressed, selected, and `:focus-visible` states; remove the persistent pointer outline; keep a rounded focus indicator that follows the CTA geometry; and verify it against the orange fill and surrounding artwork.

**Clarification:** Exact focus token. If none is supplied, use a 2 px action-blue focus outline with a 2 px offset and no persistent pointer-only outline.
**Status:** Ready with shared decision

### Liquid Spectrum

#### LS-01 — Lifecycle button spacing

**PDF page/state:** Page 7, Channel Margin Gauge
**Author:** Larry Levine

> Adjust spacing / margins on buttons.

**Assessment:** The lifecycle phase controls need consistent text centering, internal padding, and minimum hit areas. Their current geometry is too dependent on the original artwork.

**Proposed fix:** Normalize every phase control to the same height, padding system, baseline, and hit target while preserving the desktop composition. Verify selected, hover, pressed, and focus-visible states for each phase.

**Clarification:** Confirm that current Ciena design-system spacing should take priority over the exact original button dimensions. That is my recommendation.
**Status:** Ready with shared decision

#### LS-02 — Underline length

**PDF page/state:** Page 7, Channel Margin Gauge
**Author:** Larry Levine

> Adjust line to match line length of the word.

**Assessment:** The underline should be tied to the rendered label width rather than a fixed decorative width.

**Proposed fix:** Make the underline an inline pseudo-element or component child that inherits the width of each phase label. Apply the behavior consistently to Planning, Delivery, Operations, and Optimization.

**Clarification:** None.
**Status:** Ready

#### LS-03 — Lifecycle arrow contrast

**PDF page/state:** Page 7, Channel Margin Gauge
**Author:** Larry Levine

> Contrast issues with light gray, darken arrows?

**Assessment:** The pale lifecycle ring/arrows are meaningful non-text graphics and should reach at least 3:1 contrast against adjacent backgrounds while still reading as secondary to the active phase.

**Proposed fix:** Select an accessible neutral from Ciena's palette, darken the ring and arrowheads, and measure the final rendered contrast at the target iframe size.

**Clarification:** The approved neutral token. If none is supplied, I will choose the closest measured neutral that passes 3:1.
**Status:** Ready with shared decision

#### LS-04 — Semantic color separation

**PDF page/state:** Page 7, Channel Margin Gauge
**Author:** Larry Levine

> Updated semantic colors to not conflate with brand?

**Assessment:** Semantic chart colors should describe status and change, while brand/action colors should describe identity and interaction. Reusing them indiscriminately makes the visual language ambiguous. LS-05 supplies the positive/upgrade green.

**Proposed fix:** Introduce explicit semantic tokens and apply them to legends, bars, markers, and animated states by meaning. Audit all gauges so the same meaning always receives the same color.

**Clarification:** Please provide or confirm the complete semantic palette, especially red, amber/yellow, and neutral values.
**Status:** Needs input

#### LS-05 — Semantic green value

**PDF page/state:** Page 7, Channel Margin Gauge
**Author:** Jenessa Keneavy

> Green: HEX: 14A05A

**Assessment:** This resolves the positive/upgrade green. White on this green is 3.38:1, so white normal-size labels would not pass 4.5:1.

**Proposed fix:** Use `#14A05A` for positive/upgrade marks and states. Use an approved dark foreground for small text placed on the green, and verify non-text chart elements at 3:1 or better.

**Clarification:** Confirm that this green applies to every positive/upgrade use across both Liquid Spectrum gauges.
**Status:** Ready with shared decision

#### LS-06 — Gauge compliance

**PDF page/state:** Page 7, Channel Margin Gauge
**Author:** Larry Levine

> Ensure this passes compliance..

**Assessment:** The note points to the green gauge/slider, but compliance should cover the whole interactive state rather than only that bar.

**Proposed fix:** Audit at the target desktop and iframe dimensions for WCAG 2.2 AA: 4.5:1 normal text, 3:1 large text and meaningful non-text graphics, logical keyboard order, visible focus, non-color state cues, and adequate interactive target size. Specifically test the slider knob, bar, labels, legend, and animation end states.

**Clarification:** Confirm WCAG 2.2 AA as the target and identify any Ciena-specific accessibility checklist that must also be followed.
**Status:** Needs input

#### LS-07 — Missing separator stroke

**PDF page/state:** Page 8, Photonic Performance Gauge
**Author:** Larry Levine

> Missing stroke seperator.

**Assessment:** A visible separator is missing at a performance-bar segment boundary. The original spelling is preserved above; the intended object appears to be a separator stroke.

**Proposed fix:** Restore the boundary stroke using the approved neutral color and a consistent width, apply it at equivalent segment boundaries where needed, and verify that animation masks do not cover it.

**Clarification:** None unless the design system specifies an exact separator token.
**Status:** Ready

#### LS-08 — Transparency rules

**PDF page/state:** Page 8, Photonic Performance Gauge
**Author:** Larry Levine

> Follow DS rules for transparency.

**Assessment:** The inactive Planning phase appears to use ad hoc opacity. Inactive, disabled, and decorative states should not share an arbitrary transparency value because they communicate different meanings.

**Proposed fix:** Replace per-element opacity values with explicit inactive-state colors or design-system opacity tokens. Verify that inactive labels and ring graphics remain legible and are not mistaken for disabled controls.

**Clarification:** Ciena's transparency/inactive/disabled token values and when each state should be used.
**Status:** Needs input

#### LS-09 — Instructional CTA styling

**PDF page/state:** Page 8, Photonic Performance Gauge
**Author:** Larry Levine

> Adjust CTA type / styling.

**Assessment:** “Click each phase to learn more” currently reads more like body copy than an action or instruction. Its styling must match its actual semantics.

**Proposed fix:** If it is interactive, render it as a real text-link/button with action blue `#1E1EC8`, approved CTA typography, deliberate label/arrow spacing, and hover/focus-visible states. If it is not interactive, style it as instructional copy and avoid a misleading link treatment.

**Clarification:** Confirm whether the sentence itself is interactive and provide the CTA type token.
**Status:** Needs input

#### LS-10 — Previous/Next navigation styling

**PDF page/state:** Page 8, Photonic Performance Gauge
**Author:** Larry Levine

> Adjust styling and casing - not an eyebrow.

**Assessment:** The uppercase, letter-spaced “PREVIOUS” treatment reads as an eyebrow label rather than navigation.

**Proposed fix:** Change Previous/Next to sentence- or title-case navigation controls, use the approved navigation-label weight and size, align chevrons consistently, and give each control a clear hit area and focus-visible state.

**Clarification:** Confirm the final copy as “Previous” and “Next” and supply the navigation control token if one exists.
**Status:** Ready with shared decision

#### LS-11 — Updated illustration style

**PDF page/state:** Page 8, Photonic Performance Gauge
**Author:** Larry Levine

> Can we replace this graphic with the new illustration style?

**Assessment:** The current laptop/person artwork can be swapped while preserving layout and animation, but a brand illustration should not be recreated by guessing at an unavailable new style.

**Proposed fix:** Replace the illustration with the approved SVG or high-resolution transparent asset, preserve its visual bounds, optimize it for delivery, and retune any entrance animation to the new artwork's composition.

**Clarification:** Please provide the approved replacement illustration or access to the current Ciena illustration library and usage guidance.
**Status:** Needs input

## Recommended implementation approach after approval

Once the review is approved, the work should be converted into a to-do checklist organized in this order:

1. Record approved design tokens, accessibility standard, and scope rules.
2. Collect and validate replacement assets.
3. Fix shared components first: typography, CTA states, focus handling, modal treatment, and semantic colors.
4. Apply and visually QA Navigator changes against PDF pages 1–3 and the live reference.
5. Apply and visually QA RLS changes against PDF pages 4–6 and the live reference.
6. Apply and visually QA Liquid Spectrum changes against PDF pages 7–8 and the live reference.
7. Run desktop interaction, animation, keyboard, and accessibility QA at the production iframe dimensions.
8. Present each affected page for approval, following the existing one-page-at-a-time approval process.

## Proposed review outcome

The PDF feedback is actionable overall. The supplied hex values and geometry/layout comments can be implemented directly. The work should pause on content replacement and design-system-specific treatments until the grouped clarifications above are answered. Most importantly, the requested orange and green values require deliberate foreground-color choices to remain accessible; simply substituting the hex values would leave some current white text below WCAG AA contrast requirements.
