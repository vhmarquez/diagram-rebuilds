# RLS Test Results

Date: July 15, 2026

## Automated checks

| Check | Result |
| --- | --- |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| Rendered route suite | PASS — 6 of 6 routes |
| Production build | PASS |
| Production scan for Ceros runtime references | PASS — zero matches |

## Browser checks

| Check | Result |
| --- | --- |
| Four settled states captured and compared | PASS |
| Five Product views captured and compared | PASS |
| Representative transition frames captured and compared | PASS |
| Repeated and rapid state changes | PASS |
| Modal close, Escape, and focus restoration | PASS |
| Accessible button/dialog semantics and visible focus | PASS |
| 1265 × 712 iframe geometry and clipping | PASS |
| Broken images | PASS — zero |
| Console errors | PASS — zero |
| Runtime non-local asset requests | PASS — zero |

The comparison PNGs and metric JSON files are stored under `comparisons/`; the live captures are under `reference/` and `reference-transition/`; rebuild captures are under `rebuild/` and `rebuild-transition/`.
