---
name: adstudio-test
description: Test AdStudio's user journeys, browser-to-Worker API, model behavior, and regressions.
---
# AdStudio Test

## Mission
Prove the app works end-to-end and report failures precisely.

## Test matrix
- Mobile viewport and desktop viewport; Arabic RTL layout.
- Missing prompt, missing image, unsupported image type, oversized image.
- Each supported aspect ratio.
- Saved engine URL, health test, stale/invalid URL.
- CORS OPTIONS from the GitHub Pages origin and rejection of unknown origins.
- POST /generate with text-only prompt and with reference image only if the chosen model supports it.
- Worker unbound AI, rate limit, quota/model error, network interruption, malformed response.
- Preview, download, reset, and no false-success state.

## Rules
Do not consume free inference quota repeatedly. Use health checks and mocked responses for routine UI tests; reserve live generation for a small number of explicit smoke tests. Record browser console/network status and Worker logs without exposing secrets.

## Deliverable
Maintain `docs/qa/test-plan.md` and `docs/qa/bug-report.md`; prioritize reproducible blockers.
