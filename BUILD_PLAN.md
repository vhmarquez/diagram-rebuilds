# Ciena rebuild plan

## Architecture

- [x] Use four direct static HTML entry points.
- [x] Use shared and page-specific CSS without CSS-in-JS or CSS modules.
- [x] Use vanilla JavaScript modules for interactions.
- [x] Render recovered scene data as native SVG elements in the browser.
- [x] Serve optimized fonts, SVGs, and images directly from the static site.
- [x] Remove the application framework, database, and bundler from the runtime architecture.
- [x] Publish the `site` folder directly to GitHub Pages.

## Experience migration

- [x] Timeline — static renderer and recovered timeline assets.
- [x] Navigator — four product states, CTAs, transitions, and hotspots.
- [x] RLS — four animated steps and ROADM/amplifier product dialogs.
- [x] Liquid Spectrum — feature dialogs, lifecycle phases, dimmers, and previous/next navigation.

## Migration QA

- [x] Verify all five routes return successfully.
- [x] Verify all local HTML, CSS, JavaScript, data, font, image, and SVG references.
- [x] Verify Timeline rendering at the desktop artboard size.
- [x] Verify all Navigator state changes.
- [x] Verify RLS startup, step transition, SVG animation, and product-dialog behavior.
- [x] Verify Liquid Spectrum feature, phase, close, and previous/next behavior.
- [x] Verify browser console is free of warnings and errors.

## Client-feedback phase

The separate feedback review remains in `Ciena_Feedback_Review.md`. After its assumptions and required materials are approved, it will be converted into the implementation checklist requested for the next round of design-system and accessibility changes.
