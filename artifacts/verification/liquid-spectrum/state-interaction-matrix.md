# Liquid Spectrum state and interaction matrix

Reference: archived original reference

Artboard: 1280 × 720. Live Ciena embed: 1265 × 711.5625 (16:9).

## Startup sequence

| Time from source platform load | Observed state |
| --- | --- |
| 0 s | source platform loading spinner on white |
| ~0.8 s | Channel Margin Gauge shell and copy begin fading in; lifecycle ring is faint |
| ~2.2 s | Ring construction and phase-label sequence is underway |
| ~4.0 s | Selected Operations label and feature panel are visible while ring animation continues |
| ~6.0 s | Ring and center icon are nearly complete |
| ~7.8 s | Panel shell remains while delayed inner elements begin their entrance sequence |
| ~10.3 s | Channel Margin Gauge default state is fully settled |

The manifest uses per-element choreography rather than a single section reveal: `fadeIn`, `fadeDown`, `fadeLeft`, `fadeRight`, `fadeUp`, `enlarge`, `slideLeft`, horizontal/vertical scaling, and a 7.7 s clockwise ring spin. Individual delays run from 0 to 9.5 s.

## Lifecycle states

All five lifecycle controls use click-triggered `show-only` interactions. A selected state changes the active label to a dark-red pill, shows explanatory copy in the center circle, and dims the nonmatching feature groups on the right.

| State | Control bounds | Center copy summary | Close behavior |
| --- | --- | --- | --- |
| Planning | 313,203,114,50 | Engineering the optical network with fiber-plant and planning-tool data | Center × returns to overview |
| Delivery | 501,360,111,55 | Deploying hardware and adding channels to deliver services | Center × returns to overview |
| Operations | 318,548,115,56 | Simplifying day-to-day optical-network operations and troubleshooting | Center × returns to overview |
| Optimization | 108,360,138,57 | Maximizing network efficiency with analytics and intelligence | Center × returns to overview |
| Liquid Spectrum | 247,267,254,253 | Describes the Liquid Spectrum application suite and Navigator Intelligent Apps | Center × returns to overview |

## Feature states

| Order | Feature | Group | Direct control bounds | Previous | Next |
| --- | --- | --- | --- | --- | --- |
| 1 | Planning Tool Calibrator | Planning and delivery | 783,90,393,55 | Liquid Restoration | Bandwidth Optimizer |
| 2 | Bandwidth Optimizer | Planning and delivery | 783,149,393,49 | Planning Tool Calibrator | PinPoint OTDR |
| 3 | PinPoint OTDR | Operations | 783,261,393,50 | Bandwidth Optimizer | Channel Margin Gauge |
| 4 | Channel Margin Gauge | Operations | 783,329,393,50 | PinPoint OTDR | Photonic Performance Gauge |
| 5 | Photonic Performance Gauge | Operations | 783,394,393,50 | Channel Margin Gauge | Liquid Restoration |
| 6 | Liquid Restoration | Optimization | 783,501,393,49 | Photonic Performance Gauge | Planning Tool Calibrator |
| Branch | Spectrum Defragmentation | Optimization | 783,558,393,49 | Photonic Performance Gauge | Planning Tool Calibrator |
| Branch | SNR Optimizer | Optimization | 783,614,393,49 | Photonic Performance Gauge | Planning Tool Calibrator |

Spectrum Defragmentation and SNR Optimizer are direct-selection branches in the source. They are not inserted into the six-state Previous/Next cycle; their navigation returns to the same Photonic Performance Gauge / Planning Tool Calibrator boundaries used by the source manifest.

## Shared feature-panel behavior

- Direct feature selection immediately replaces lifecycle copy with the selected feature panel.
- Panel entrance is component-level and lasts approximately 0.8–1.0 s: the gray shell expands/slides first, followed by illustration, headings, supporting copy, selected lifecycle pill, and navigation.
- Close returns to the unselected lifecycle overview and restores the full right-side feature list.
- Previous and Next replace the current feature using the manifest mapping above.
- Escape is added in the rebuild as an accessible equivalent of close.
- Rapid input must never leave multiple lifecycle or feature scenes active at once.

## Evidence index

- `reference/intro-*.png`: representative startup frames.
- `reference/feature-*.png`: all eight settled feature states.
- `reference/phase-*.png`: all five lifecycle states.
- `reference/panel-transition-*.png`: representative feature-panel transition frames.
- `reference/phase-transition-*.png`: representative lifecycle transition frames.
- `reference/ciena-host-embed.png`: live Ciena host integration capture.
