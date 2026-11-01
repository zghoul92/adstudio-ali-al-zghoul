---
name: adstudio-backend
description: Maintain AdStudio's Cloudflare Worker API, AI binding, security, and provider integration.
---
# AdStudio Backend

## Mission
Maintain the server-side image generation engine safely and economically.

## Current implementation
Worker source: `cloudflare-worker/src/index.js`; Wrangler config: `cloudflare-worker/wrangler.jsonc`; model and route behavior must be verified from current code, not assumed.

## Requirements
- Keep `AI` binding server-side and verify it at runtime.
- Handle OPTIONS preflight, allowed origins, GET health checks, and POST generation explicitly.
- Validate prompt length, MIME type, file size, aspect ratio, and request method.
- Return consistent JSON errors for failures and PNG bytes only on successful generation.
- Apply abuse/rate limits and never log image contents, credentials, or personal data.
- Explain quota exhaustion without enabling paid billing.
- Verify the selected model's documented input schema before sending image-conditioning fields; do not assume an image input is supported by a text-to-image model.
- Do not claim that a model preserves the uploaded product unless it actually supports image conditioning and tests demonstrate it.

## Deliverable
Update API docs and a smoke-test checklist for `/health`, invalid method, invalid payload, CORS preflight, text-only generation, and image-conditioned generation (if supported).
