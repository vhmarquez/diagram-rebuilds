# Liquid Spectrum Test Results

Date: July 16, 2026

## Automated checks

| Check | Result |
| --- | --- |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm test` | PASS |
| Rendered route suite | PASS — 8 of 8 routes |
| Production build | PASS |
| `git diff --check` | PASS |
| Production scan for source platform runtime URLs | PASS — zero matches |

## State and interaction checks

| Check | Result |
| --- | --- |
| Five direct lifecycle states | PASS |
| Eight direct feature states | PASS |
| Six-state Previous/Next cycle | PASS |
| Spectrum Defragmentation branch boundaries | PASS |
| SNR Optimizer branch boundaries | PASS |
| Close/reset behavior | PASS |
| Escape dismissal | PASS |
| Focus restoration | PASS |
| 900 ms rapid-input lock | PASS — controls disabled during transition, unlocked afterward |
| Hidden/inactive panel leakage | PASS — none observed |

## Visual and animation checks

| Check | Result |
| --- | --- |
| Eight feature reference/rebuild pairs | PASS |
| Five lifecycle reference/rebuild pairs | PASS |
| Startup samples at 0.0/0.8/2.2/4.0/6.0/7.8/10.3 s | PASS |
| Feature transition samples at 0/150/400/700/1000 ms | PASS |
| Lifecycle transition samples at 0/200/500/900 ms | PASS |
| Thirteen-state mean absolute RGB difference | 4.926 / 255 |
| Thirteen-state thresholded difference | 6.543% average above 12 levels |
| Maximum mean difference | 6.771 — Bandwidth Optimizer |
| Maximum thresholded difference | 8.399% — SNR Optimizer |

## Browser, SVG, and iframe checks

| Check | Result |
| --- | --- |
| Native runtime drawing | PASS — one SVG surface, zero canvas |
| Broken HTML images | PASS — zero |
| Browser console warnings/errors | PASS — zero |
| Page asset inventory | PASS — 82 observed assets plus one inline SVG |
| Remote runtime assets | PASS — zero |
| source platform/Ciena runtime hosts | PASS — zero |
| Host-style iframe | PASS — exact 1265 × 712 geometry in 1280 × 720 viewport |
| Iframe clipping/overflow | PASS — none |

Reference captures are stored under `reference/`, rebuilt captures under `rebuild/`, and the host-size capture under `embed/`.
