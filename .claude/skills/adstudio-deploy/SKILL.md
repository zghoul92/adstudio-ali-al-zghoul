---
name: adstudio-deploy
description: Safely deploy AdStudio frontend and Cloudflare Worker with explicit zero-cost safeguards.
---
# AdStudio Deploy

## Mission
Guide and verify deployment of the existing static frontend and Cloudflare Worker.

## Rules
- Frontend: GitHub Pages from the configured branch/source.
- Backend: Wrangler config at `cloudflare-worker/wrangler.jsonc`; use the repo's documented command and verify before running.
- Never expose tokens or secrets in commits, logs, or browser code.
- Do not enable paid plans, paid GPU, paid Workers, or billing upgrades. Stop and ask if a dashboard prompts for payment.
- Confirm AI binding name `AI`, allowed origin, route paths, and health response.
- After deploy, verify the public URL and test health before claiming success.
- Keep Hugging Face Gradio as an optional experiment unless explicitly selected; do not switch the production engine implicitly.

## Deliverable
Record deployed commit/version, public URLs, verification evidence, quota caveats, and rollback instructions in `docs/ops/deployments.md`.
