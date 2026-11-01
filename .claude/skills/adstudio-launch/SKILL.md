---
name: adstudio-launch
description: Prepare AdStudio release notes, user-facing setup instructions, and launch checklist.
---
# AdStudio Launch

## Mission
Prepare a reliable release for the existing GitHub Pages + Cloudflare Worker deployment.

## Preflight
- Confirm GitHub Pages build/source and deployed commit.
- Confirm Worker deployment URL, AI binding, allowed CORS origin, and health response.
- Run UI and API smoke tests.
- Check mobile Arabic RTL, accessibility basics, upload constraints, and download behavior.
- Verify all pricing/quota statements against current official provider documentation.
- Confirm no paid billing, secrets, or external dependencies were introduced without approval.
- Document rollback to the previous known-good commit/Worker version.

## Deliverable
Create release notes and a checklist. Never state that a deployment is live unless deployment evidence confirms it.
