# Navigator Test Results

Date: July 15, 2026
Conclusion: **PASS**

## Automated checks

| Check | Result |
| --- | --- |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm test` | PASS — production build and 4/4 rendered-route tests |
| Build routes | PASS — `/`, `/navigator`, `/timeline`, `/qa/navigator-iframe` |
| Packaged Cloudflare runtime | PASS — page and hashed JavaScript assets return 200 |
| Production runtime browser pass | PASS — default and controller state, local assets, iframe harness |
| Production console | PASS — no warning or error messages |
| Production source platform string scan | PASS — 0 hits in `dist/` |

## Browser interaction checks

- State sequence exercised: Suite → Controller → Apps → Emulation → Suite → Apps.
- Every requested state produced the expected heading, exactly one `aria-pressed` selector, and the expected CTAs.
- Repeated switching did not retain stale links or detail content.
- All visible images reported `complete` with non-zero natural dimensions.
- The 1280 × 720 route had no horizontal or vertical scroll.
- Aktiv Grotesk Regular and Bold both reported loaded.
- The focus-visible state measured as a 3px solid `rgb(178, 0, 34)` outline with a 3px offset.
- CTA links use `target="_blank"` and `rel="noreferrer"`.
- The fixed iframe harness rendered the experience at 1265 × 712 with no broken images.

## Visual metrics

Images were compared channel-by-channel at the common 1280 × 720 artboard. A difference threshold of 12/255 was used for the outlier percentage.

| State/frame | Mean absolute channel difference | Channels over threshold |
| --- | ---: | ---: |
| Default | 1.432 | 2.365% |
| Multi-Layer Controller | 0.857 | 1.953% |
| Intelligent Apps, settled | 0.800 | 1.534% |
| Emulation Cloud | 1.075 | 1.957% |
| Emulation → Apps, 0ms | 0.391 | 0.992% |
| Emulation → Apps, 500ms | 1.633 | 3.195% |
| Emulation → Apps, 1200ms | 0.535 | 1.203% |

Residual pixels are confined to optimized raster encoding and browser glyph anti-aliasing. No unexplained geometry, copy, asset, color, link, or state mismatch remains.
