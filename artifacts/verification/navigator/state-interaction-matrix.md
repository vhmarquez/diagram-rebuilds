# Navigator State and Interaction Matrix

Date: July 15, 2026

| State | Selector | Detail content | Visible CTAs | Entrance sequence | Result |
| --- | --- | --- | --- | --- | --- |
| Navigator Network Control Suite | Top triangle icon | Red title, overview copy, network-map screenshot | None | Title/copy `fadeLeft` at 0.4s; screenshot `fadeIn` at 0.6s; 0.8s duration | PASS |
| Navigator Multi-Layer Controller | Lower-left icon | Red title, overview copy, controller dashboard | Navigator MC | Title/copy `fadeLeft` at 0.4s; image at 0.6s; CTA at 0.8s; 0.8s duration | PASS |
| Navigator Intelligent Apps | Lower-center icon | Intro plus Liquid Spectrum, Enhanced IP Control, Multi-Layer Operations, and PlannerPlus rows | Liquid Spectrum, Multi-Layer Operations, PlannerPlus | Intro is immediate; rows `fadeLeft` at 0.6s, 1.8s, 2.4s, and 3.0s; 0.8s duration | PASS |
| Emulation Cloud | Lower-right icon | Red title, overview copy, Emulation Cloud screenshot | Emulation Cloud | Title/copy `fadeLeft` at 0.4s; image at 0.6s; CTA at 0.8s; 0.8s duration | PASS |

## State controls

- All four published source platform hotspot rectangles are preserved exactly.
- Controls use native `button` elements with descriptive accessible names and `aria-pressed` state.
- Mouse activation, repeated switching, and return to the default state were exercised in the browser.
- Controls remain in a stable four-button tab order and expose a 3px Ciena-red `:focus-visible` ring.
- The reference does not display a selected-state graphic; the rebuild therefore exposes selection semantically without adding a visual highlight.

## CTA matrix

| CTA | Destination | Target | Hit area | Result |
| --- | --- | --- | --- | --- |
| Navigator Multi-Layer Controller | `https://www.ciena.com/products/navigator-mc?utm_source=interactive_diagram&utm_term=navigator_multilayer_controller&utm_medium=navigatortool` | New tab | 175 × 64 | PASS |
| Liquid Spectrum | `https://www.ciena.com/products/liquid-spectrum/?utm_source=interactive_diagram&utm_term=liquid_spectrum&utm_medium=navigatortool` | New tab | 154 × 53 | PASS |
| Multi-Layer Operations | `https://www.ciena.com/products/multi-layer-operations?utm_source=interactive_diagram&utm_term=multilayer_operations&utm_medium=navigatortool` | New tab | 154 × 53 | PASS |
| PlannerPlus | `https://www.ciena.com/products/navigator-ncs/plannerplus?utm_source=interactive_diagram&utm_term=plannerplus&utm_medium=navigatortool` | New tab | 154 × 53 | PASS |
| Emulation Cloud | `https://www.ciena.com/products/emulation-cloud/?utm_term=emulation_cloud&utm_source=interactive_diagram&utm_medium=navigatortool` | New tab | 186 × 64 | PASS |

The CTA visual shapes, text placement, invisible hit areas, 0.3s hover fade, destinations, and `_blank` behavior match the current live experience.
