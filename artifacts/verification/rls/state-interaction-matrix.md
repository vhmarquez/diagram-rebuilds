# RLS State and Interaction Matrix

| Area | Action | Expected result | Result |
| --- | --- | --- | --- |
| Initial base | Open `/rls` | 179 selected base components build individually; no screenshot crop or canvas appears | PASS |
| Startup trigger | Wait 5 seconds | Step 1 active treatment, copy, and spectrum scene begin their individual entrances | PASS |
| Startup controls | Wait 7 seconds | Step 2–4 interactions become available, matching the source platform on-view trigger | PASS |
| Step 1 | Select Initial Installation | 25 step components build within the 2.5 s manifest window | PASS |
| Step 2 | Select Grow C-band traffic | 41 step components build within 2.6 s; bars, labels, and edge hardware remain separately timed | PASS |
| Step 3 | Select Expand to L-band | 105 step components build within 3.2 s, including both ROADM additions and L-band spectrum | PASS |
| Step 4 | Select Grow L-band traffic | 106 step components build within 3.8 s with independent final wavelengths and transponders | PASS |
| Timed parity | Sample transitions at 350–500 ms and 1.05–1.25 s | Live and local show the same partial element sets | PASS |
| Repeated switching | Select 1 → 2 → 3 → 4 → 1 | Every state settles with no stale step or dialog layer | PASS |
| Rapid switching | Select 2 → 4 → 3 quickly | The latest request wins and Step 3 settles cleanly | PASS |
| Amplifier Product view | Open from the diagram | 36 selected components animate over the 2.4 s source window | PASS |
| ROADM Product views | Open from each step | Correct 39–62-component step-specific detail scene opens with original vector callouts | PASS |
| Dialog close | Activate close control | Dialog exits for 220 ms and focus returns to its trigger | PASS |
| Dialog keyboard | Press Escape | Dialog closes and focus returns to its trigger | PASS |
| Focus | Tab through controls | Native controls receive the intentional Ciena-red focus-visible treatment | PASS |
| Reduced motion | Enable `prefers-reduced-motion` | Final content remains visible with motion removed | PASS |
| Iframe | Load `/qa/rls-iframe` | Iframe is exactly 1265 × 712 with no host-page overflow | PASS |
| Asset health | Inspect settled states and overlays | Zero broken HTML images; every selected image component has a local mapping | PASS |
| Production | Build and server-render `/rls` | Route renders with native SVG markup and no source platform runtime reference | PASS |

Native buttons provide Space/Enter activation. Product dialogs use native focus targets, Escape handling, and focus restoration.
