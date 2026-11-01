# AdStudio architecture

## Current stack to preserve
- Frontend: static HTML/CSS/JavaScript served by GitHub Pages.
- Image backend: Cloudflare Worker in cloudflare-worker/src/index.js.
- Image model: @cf/black-forest-labs/flux-2-klein-4b via Workers AI binding named AI.
- Current API: GET /health and POST /generate (multipart form with prompt, format and optional image).
- Deployment: GitHub Pages + Cloudflare Worker.
- Constraint: no paid service, subscription or automatic billing; external redirects are not part of core generation.

## Architecture decisions
1. Keep the static frontend for now; do not migrate frameworks without a concrete need.
2. Keep one unified creator UI. A mode selector changes the input fields and output preview; a provider/model selector only lists enabled, tested providers.
3. Use a capability registry in frontend configuration: provider, supported modes, model label, endpoint, status, free-tier caveat. Never show a provider as ready unless its endpoint passes a health check.
4. Keep secrets out of GitHub Pages and browser source. Any provider requiring a secret must be proxied by a Worker secret; do not commit keys.
5. The existing Cloudflare Worker remains the only enabled generation provider until another provider has a verified API, free allowance and test path.
6. Video, voice and social scheduling remain disabled/coming later unless their in-site APIs are verified as free for the intended use.

## API plan
| Method / path | Purpose | Input | Output | State |
|---|---|---|---|---|
| GET /health | Worker readiness | none | service, model, binding, endpoints | implemented |
| POST /generate | Image generation/editing | multipart prompt, format, optional image | image/png or structured JSON error | implemented |
| GET /capabilities | Report enabled models/modes | none | capability list and quota notes | planned |
| POST /jobs | Submit async video/voice job | mode, prompt, input asset, options | job id and status | disabled until provider exists |
| GET /jobs/:id | Poll async job | job id | queued/processing/succeeded/failed | disabled until provider exists |

## Data and persistence
- No database is required for the current single-user static site.
- Start asset history and workflow presets in browser local storage only if the user accepts browser-local persistence.
- Do not store uploaded product images on a server unless a storage provider and retention policy are deliberately selected.
- If multi-user accounts become necessary later, revisit Supabase/Postgres; do not add it pre-emptively.

## Security and reliability
- Keep provider secrets in Cloudflare Worker secrets, never in the frontend or repository.
- Validate request origin, HTTP method, content type, prompt length, image MIME type and size.
- Apply per-IP rate limiting and clear error responses.
- Avoid logging prompts or uploaded image contents.
- Add timeout handling and a visible quota/temporary failure message.
- Never silently switch a request to a paid provider.
- Verify Cloudflare free allowance at implementation time; do not hardcode a promise of unlimited free use.

## Build order
1. Reorganize existing app into a single unified creator with image/video modes and an honest provider selector.
2. Harden and test the current image flow, including upload, CORS, file limits, result preview and download.
3. Add prompt/copy assistance only through a verified no-cost text capability; otherwise retain local prompt templates.
4. Add local asset history and reusable presets.
5. Evaluate video and voice APIs separately; enable only after an in-site free API is confirmed.
6. Add test plan and feature parity report.

## Risks
- Image model may not preserve product identity perfectly, especially after downscaling.
- Free model quotas and model availability can change.
- Static frontend cannot safely hold private API keys.
- AdFlex's marketing page does not establish all authenticated workflows or API details; deeper parity requires user-provided screenshots or access to their own account.
