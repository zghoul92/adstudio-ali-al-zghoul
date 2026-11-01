# AdStudio — product reconstruction

## Scope
- Product: AdStudio Ali Al-Zghoul, Arabic-first web app.
- Reference: https://adflex.ai/ar
- Platform: responsive web, RTL Arabic first.
- Audience: small shops, solo sellers and social-media marketers who need product ads.
- Rebuild target: the public-facing workflows and capabilities described on the reference marketing page, not its private account screens or proprietary implementation.
- Product constraints: keep the existing GitHub Pages + Cloudflare Worker deployment where practical; no mandatory paid subscriptions; no external redirects for core generation; one unified creation workspace.

## Evidence and confidence
| Source | URL | What it supports | Confidence |
|---|---|---|---|
| Public marketing page | https://adflex.ai/ar | Public feature categories: image, video, ad creatives, product photoshoot, voice, social scheduling, editing and utilities | High for advertised categories; low for exact in-app details |
| Existing AdStudio app | https://zghoul92.github.io/adstudio-ali-al-zghoul/ | Current creator, prompt lab, tools list and generated-image preview | High |
| Existing image Worker | https://github.com/zghoul92/adstudio-ali-al-zghoul/tree/main/cloudflare-worker | Current Cloudflare Workers AI image endpoint | High |

No private APIs, source bundles, account data or gated screens were inspected. Reference screenshots have not yet been supplied, so exact visual measurements remain unverified.

## Screen inventory
| ID | Screen / state | Route | Purpose | Key components | States |
|---|---|---|---|---|---|
| S01 | Studio shell | / | Main navigation and workspace | Header, sidebar, account/usage area, responsive nav | desktop, mobile |
| S02 | Unified creator | /#creator | Main image/video/ad creation flow | mode selector, model selector, prompt, upload, aspect ratio, style, generate | empty, ready, loading, success, error, quota |
| S03 | Product photo studio | /#product | Create product scenes from a reference image | product upload, preserve-product controls, scene presets, preview | empty, uploading, loading, success, error |
| S04 | Ad copy workspace | /#copy | Create hooks, headlines, primary text and CTAs | product details, audience, platform, tone, generated copy | empty, loading, success, error |
| S05 | Prompt lab | /#promptLab | Build and refine reusable prompts | industry, campaign goal, expert mode, negative prompt, copy | ready, edited |
| S06 | Asset library | /#library | Revisit generated and uploaded assets | grid, filters, preview, download, delete | empty, populated |
| S07 | Image editor utilities | /#tools | Basic image operations supported locally | resize, convert, compress, background/format actions only if implemented | ready, processing, error |
| S08 | Video workspace | /#video | Generate short ad video where a supported API exists | text/image input, duration, aspect ratio, model, job status, preview | unavailable, queued, processing, success, error |
| S09 | Voice workspace | /#voice | Voiceover only if a free and supported API is configured | script, language, voice, audio player | unavailable, loading, success, error |
| S10 | Workflow presets | /#workflows | Save repeatable combinations of prompts and settings | preset list, create/edit/delete, apply | empty, populated |
| S11 | Settings and limits | /#settings | Explain active engine, privacy and quota | engine status, quota messaging, privacy, diagnostics | connected, disconnected, limited |

## Core user flows
- F01 Create an image ad: S01 -> S02 -> upload optional product -> describe scene -> choose ratio/style -> generate -> preview/download.
- F02 Product photoshoot: S01 -> S03 -> upload product -> choose scene -> generate -> inspect product fidelity -> download.
- F03 Create ad copy: S01 -> S04 -> enter product/audience/platform -> generate copy -> edit/copy.
- F04 Build a reusable prompt: S01 -> S05 -> choose industry and objective -> generate prompt -> copy to S02.
- F05 Reuse an asset: S01 -> S06 -> filter -> preview -> download or reuse as input.
- F06 Create video: S01 -> S08 -> submit job -> wait/poll -> preview/download. Only activate after a real in-site API is configured and tested; do not route users to another site.
- F07 Create voiceover: S01 -> S09 -> submit script -> render -> play/download. Only activate after a supported no-cost API is verified.
- F08 Save a workflow: S01 -> S10 -> save settings -> reapply in S02.

## Components
- App shell, responsive navigation, unified creator panel, mode/model selector, upload dropzone, prompt textarea, ratio/style controls, preserve-product slider, generation status, job progress, result preview, asset tile, copy/download actions, quota notice, empty/error states.
- All controls need keyboard focus, labels, disabled/loading states, and mobile layouts.

## Inferred data model
- GenerationJob: id, mode (image|video|copy|voice), provider, model, prompt, negative_prompt, aspect_ratio, input_asset_id, status, output_asset_id, error_code, created_at. Confidence: medium; inferred from required workflows.
- Asset: id, kind, mime_type, storage_key or browser-local blob reference, width, height, duration, created_at. Confidence: medium.
- WorkflowPreset: id, name, mode, settings_json, created_at, updated_at. Confidence: medium.
- ProviderCapability: provider, model, supported_modes, free_tier_status, enabled, notes. Confidence: high as a configuration need, not an observed AdFlex entity.
- User/account, billing, team and scheduling entities are out of scope until the user asks for authentication or multi-user features.

## Out of scope / honest limits
- AdFlex branding, logos, exact copy, proprietary assets, private APIs and implementation.
- Guaranteed access to paid models such as premium commercial image/video providers without valid user-owned keys and budget.
- Video or voice generation until a stable, documented API with a genuinely free allowance is verified.
- Social publishing/scheduling until official platform APIs, permissions and account setup are available.
- Do not present an unimplemented or external tool as an in-site feature.

## Size
Large (L): image generation exists; broadening to a multi-tool creative suite requires additional data handling, provider capability checks, job states, asset management and careful quota/error handling.
