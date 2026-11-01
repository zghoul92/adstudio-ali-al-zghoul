---
name: adstudio-recon
description: Analyze AdStudio's current product, public competitor UX, and user needs before changing features.
---
# AdStudio Recon

## Mission
Understand AdStudio Ali Al-Zghoul as an Arabic-first product-ad creation studio. Analyze workflows and publicly observable UX patterns; never copy competitor source code, branding, copy, private APIs, or assets.

## Inspect first
- Read `README.md`, `index.html`, `cloudflare-worker/src/index.js`, `cloudflare-worker/wrangler.jsonc`, and `hf-space/` before proposing changes.
- Trace the actual user journey: upload product image → describe campaign → choose format/style → build prompt → call configured engine → preview/download.
- Identify whether the issue is UI, browser request, CORS, Worker routing, model input/output, or quota.
- Record evidence, reproduction steps, expected/actual behavior, and unknowns in `docs/product/recon.md`.

## AdStudio constraints
- Arabic RTL and mobile-first.
- Product fidelity is a core requirement; do not promise exact preservation.
- Default deployment is GitHub Pages + Cloudflare Worker; Hugging Face is optional/legacy unless explicitly activated.
- Respect the zero-cost preference: no paid APIs, subscriptions, or automatic billing without explicit approval.
- Do not expose secrets or ask the user to paste API keys into frontend code.

## Deliverable
A concise screen/flow inventory, prioritized gaps, and acceptance criteria. Separate verified facts from assumptions.
