# RLS Test Results

Date: July 15, 2026

## Automated checks

| Check | Result |
| --- | --- |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm test` | PASS |
| Rendered route suite | PASS — 6 of 6 routes |
| Production build | PASS |
| Production scan for source platform runtime references | PASS — zero matches |

## Native SVG checks

| Check | Result |
| --- | --- |
| Selected manifest scene data | PASS — 697 components, 30 local assets, no missing image mappings |
| Runtime renderer | PASS — `data-renderer="native-svg"` |
| Step 4 runtime DOM | PASS — 280 source platform component groups, 38 vector text blocks, two SVG surfaces |
| Canvas/screenshot layers | PASS — zero canvas and no runtime screenshot crops |
| Vector color metadata | PASS — orange callout assets render with the source tint |
| Hidden source layers | PASS — inactive hover/navigation layers do not leak into settled scenes |
| Site title header fills | PASS — live/local `#E8EBEC` header geometry matches |
| Product view button geometry | PASS — source 144 × 34 paint bounds at both manifest positions |
| Product view button radius | PASS — source 44px CSS radius resolves to 17px outer corners; SVG interior uses 16px circular `rx`/`ry` |
| Product view hover treatment | PASS — 200 ms white/orange source treatment, no glow or scale |
| Broken HTML images | PASS — zero |

## Browser and animation checks

| Check | Result |
| --- | --- |
| Fresh live/local comparison at 1280 × 720 | PASS |
| Original 5 s Step 1 trigger | PASS |
| Original 7 s Step 2–4 interaction trigger | PASS |
| Four settled step states | PASS |
| Step transition samples at 350–500 ms | PASS — matching partial SVG/component sets |
| Step transition samples at 1.05–1.25 s | PASS — matching progressive completion |
| Step 1/2/3/4 manifest windows | PASS — 2.5/2.6/3.2/3.8 s |
| Four ROADM Product views | PASS — original photography and vector annotations |
| Shared amplifier Product view | PASS — original photography and vector annotations |
| Rapid state changes | PASS — final requested state wins |
| Escape and focus restoration | PASS |
| Reduced-motion fallback | PASS |
| 1265 × 712 iframe geometry | PASS — exact dimensions, no host overflow |

Settled native-SVG captures are stored under `rebuild/`; live reference captures are under `reference/`.
