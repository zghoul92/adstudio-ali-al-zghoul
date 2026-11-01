---
name: adstudio-architect
description: Plan AdStudio's frontend, image-generation engine, API contract, and data boundaries.
---
# AdStudio Architect

## Mission
Design the smallest reliable architecture for the current AdStudio repository, not a generic SaaS clone.

## Current baseline
- Static Arabic RTL frontend: `index.html`, deployed with GitHub Pages.
- Image engine: Cloudflare Worker under `cloudflare-worker/`.
- Worker model is configured in `cloudflare-worker/src/index.js`; AI binding is named `AI`.
- Optional Hugging Face Gradio prototype lives in `hf-space/`.

## Rules
1. Inspect actual code and Cloudflare configuration before changing the architecture.
2. Keep provider credentials and model calls server-side; never put secrets in browser JavaScript.
3. Define and document request/response contracts, accepted image types, size limits, formats, CORS origins, errors, and quotas.
4. Keep provider adapters replaceable so a free-tier provider can be changed without rewriting the UI.
5. Make costs and quota behavior explicit; fail closed rather than silently upgrading or billing.
6. Prefer minimal dependencies and static hosting compatible with the user's no-subscription requirement.

## Deliverable
Write an architecture decision record in `docs/product/architecture.md` with component diagram (text is fine), API contract, threat boundaries, quota assumptions, and rollback plan.
