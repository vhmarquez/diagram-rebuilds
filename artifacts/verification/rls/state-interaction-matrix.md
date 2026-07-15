# RLS State and Interaction Matrix

| Area | Action | Expected result | Result |
| --- | --- | --- | --- |
| Initial load | Open `/rls` | Step 1 is selected and its staged entrance settles to the reference state | PASS |
| Step navigation | Select Step 1 | Initial Installation diagram, spectrum, copy, and active treatment appear | PASS |
| Step navigation | Select Step 2 | Grow C-band diagram, spectrum, copy, and active treatment appear | PASS |
| Step navigation | Select Step 3 | Expand to L-band diagram, spectrum, copy, and active treatment appear | PASS |
| Step navigation | Select Step 4 | Grow L-band diagram, spectrum, copy, and active treatment appear | PASS |
| Rapid switching | Select 2 → 4 → 1 → 3 without waiting | Only Step 3 remains active; no stale layer or dialog remains | PASS |
| ROADM Product view | Open from each of the four steps | The step-specific product image and annotations appear | PASS |
| Amplifier Product view | Open from any step | The shared bidirectional amplifier view appears | PASS |
| Dialog close | Activate the close control | Dialog closes and focus returns to its trigger | PASS |
| Dialog keyboard | Press Escape | Dialog closes and focus returns to its trigger | PASS |
| Focus | Tab through controls | Native controls receive a visible Ciena-red focus indicator | PASS |
| Iframe | Load `/qa/rls-iframe` at 1265 × 712 | Uniformly scaled 1280 × 720 stage is fully visible without scrollbars | PASS |
| Production | Load packaged `/rls` | Page loads, controls operate, and no image is broken | PASS |

Native button semantics provide Space/Enter activation. The automation driver did not synthesize Enter activation reliably, so that behavior is guaranteed by the native HTML control rather than a custom keyboard handler.
