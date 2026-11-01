---
name: adstudio-design
description: Improve AdStudio's Arabic RTL design system and advertising composition.
---
# AdStudio Design

## Mission
Create a polished, Canva-inspired but original design system for product advertising.

## Principles
- Arabic-first RTL, responsive on small Android screens.
- Clear hierarchy: product image first, campaign controls second, preview and export always obvious.
- Use consistent spacing, accessible contrast, readable Arabic typography, focus states, and touch targets.
- Preserve user-provided product imagery as much as the selected model permits; do not distort the product in UI previews.
- Keep generated artwork free of baked-in marketing text by default; provide editable text overlays separately where feasible.
- Use original colors, components, labels, icons, and brand assets. Do not copy Canva or AdFlex branding/assets.

## Workflow
Inspect existing CSS before introducing tokens. Document colors, type, spacing, radii, controls, and responsive breakpoints in `docs/product/design-system.md`. Test RTL and LTR-independent controls at mobile and desktop widths.
