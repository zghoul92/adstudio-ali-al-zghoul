---
title: AdStudio Ali Al-Zghoul AI
emoji: ✨
colorFrom: purple
colorTo: indigo
sdk: gradio
sdk_version: 5.20.0
app_file: app.py
pinned: false
license: mit
---

# AdStudio Ali Al-Zghoul — AI image generator

A Gradio GPU app for product-ad scene generation using Stable Diffusion XL Img2Img + IP-Adapter reference-image conditioning.

## Deploy

1. Create a new **Gradio Space** at https://huggingface.co/new-space.
2. Choose the Space hardware. If **ZeroGPU** is available on your account, select it to try within the included free daily quota. Availability/quotas vary by account and may change.
3. Upload the files from this folder (`app.py`, `requirements.txt`, `README.md`) to the Space root, or push this folder's contents to a new Space repository.
4. Wait for the Space to build and download model weights. First startup may take a while.
5. Copy the Space identifier (for example `your-handle/adstudio-ai`) or its public Space URL. In the GitHub Pages website, paste it into the **AI Space URL** field and save.

## Models

- Base model: `stabilityai/stable-diffusion-xl-base-1.0`
- Reference image adapter: `h94/IP-Adapter` (SDXL adapter)
- Inference library: Hugging Face Diffusers

Review and accept any model-specific terms shown by Hugging Face before deployment. Check each model card/license for the intended commercial use before using generated images in paid campaigns.

## Cost and limits

- GitHub Pages hosts only the static website; it does not run the model.
- Hugging Face ZeroGPU can offer a limited free daily GPU quota on eligible accounts; free access is queued and not suitable for guaranteed, high-volume production. Check the current quota and eligibility in Hugging Face documentation.
- A dedicated GPU Space costs money while it is running. Hugging Face's current published examples list GPU hardware from around $0.40/hour (T4 small) and $0.80/hour (L4), subject to change. Always verify the price in the Space settings before selecting paid hardware.
- Do not put access tokens or private API keys in the website's JavaScript.

## Product fidelity

The app uses the uploaded image both as the img2img starting image and as an IP-Adapter reference. This improves subject similarity but cannot guarantee exact preservation of tiny labels, logos, text, or every product detail. Keep the generated image under review before publication.
