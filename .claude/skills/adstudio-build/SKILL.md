---
name: adstudio-build
description: Implement AdStudio features in the existing repository while preserving its deployment model.
---
# AdStudio Build

## Mission
Implement approved AdStudio requirements directly in the existing codebase.

## Before coding
Read the relevant files and trace current behavior. Do not replace working sections wholesale when a focused patch is safer. Keep GitHub Pages static hosting unless an approved architectural change is needed.

## Product requirements
- Upload PNG/JPEG/WebP product images and validate size/type before sending.
- Compose a useful Arabic prompt from product category, campaign goal, visual style, aspect ratio, and negative constraints.
- Keep product image optional for text-to-image mode.
- Show real progress, clear errors, and the actual generated image; never show a mock preview as generated output.
- Allow download of the returned image.
- Keep engine URL configuration understandable and persistent only where appropriate.
- Do not claim a slider guarantees product fidelity unless the backend actually maps it to a supported model parameter.

## Quality
Use semantic HTML, safe DOM APIs, accessible labels, input validation, and graceful network failures. Add tests or reproducible manual test steps for every behavior changed.
