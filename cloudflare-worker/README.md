# AdStudio Ali Al-Zghoul — Cloudflare Workers AI (free tier)

This folder contains a Cloudflare Worker API for text-to-image and reference-image editing using FLUX.2 Klein 4B.

## Cost and license notes

- Cloudflare Workers AI documents a free allocation of 10,000 Neurons per day; requests beyond this require a paid Workers plan. On the free plan, operations should fail when the free allocation is exhausted.
- This project does not set up billing, add a payment method, or switch plans.
- FLUX.2 Klein 4B is listed under Apache 2.0 in the official FLUX.2 model overview.
- Free quotas, eligibility, limits, and model availability can change. Check Cloudflare's current pricing and your dashboard before using it.
- A simple in-memory throttle is included as a best-effort safeguard, not a global abuse-prevention guarantee. Public anonymous endpoints can be abused; monitor usage.

Official docs:
- Pricing: https://developers.cloudflare.com/workers-ai/platform/pricing/
- Model: https://developers.cloudflare.com/workers-ai/models/flux-2-klein-4b/
- Binding setup: https://developers.cloudflare.com/workers-ai/get-started/workers-wrangler/

## Deploy from Cloudflare Dashboard (no local computer required)

1. Sign in to https://dash.cloudflare.com/ and select the Free plan if prompted.
2. Open **Workers & Pages** → **Create** → **Worker**. Name it `adstudio-ai-engine`.
3. Open the Worker editor and replace its source with the contents of `src/index.js` from this folder.
4. In the Worker settings, open **Bindings** → **Add** → **Workers AI**. Set the variable name to exactly `AI`, then save and deploy.
5. The Worker code only allows the GitHub Pages origin `https://zghoul92.github.io`. If your website uses another origin, update `ALLOWED_ORIGINS` in `src/index.js` before deploying.
6. Test the Worker URL by opening its root URL. It should return JSON showing `AdStudio AI Worker`.
7. Copy the Worker URL ending in `.workers.dev`; enter it in the website's **Cloudflare Worker URL** field and save it.
8. Test one image. The first image upload is resized in the browser to under 512×512 for the model's reference-image input.

## Using Wrangler (optional, requires Node.js)

From this folder:
```bash
npm install -D wrangler
npx wrangler deploy
```

## Endpoint

- `GET /`: health check.
- `POST /generate`: multipart form fields `prompt`, optional `image`, and `format`.
- Image output is returned as `image/png`.
- The browser must send the image as a small PNG/JPEG/WebP. The website resizes it before sending.

## Limitations

- This is a starter integration, not a production security review.
- In-memory throttling can reset or vary across isolates.
- Model edits may change product details; inspect outputs before publishing.
- Free quotas do not mean unlimited or guaranteed availability.
