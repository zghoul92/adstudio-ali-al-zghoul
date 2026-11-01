# AdStudio AI Development Workflow

This repository adapts the workflow concepts of [Replica Skill](https://github.com/Jakeschincariol/replica-skill) to **AdStudio Ali Al-Zghoul**. It does not copy the original skill files or attempt to clone another company's protected implementation.

## Installed project skills

The project-specific Claude Code skills live under `.claude/skills/`:

1. `adstudio-recon` — inspect the existing app, user journeys, and evidence.
2. `adstudio-architect` — plan the frontend, Worker, model contract, and quotas.
3. `adstudio-design` — maintain an original Arabic RTL ad-studio design system.
4. `adstudio-build` — implement features in the existing codebase.
5. `adstudio-backend` — maintain the Cloudflare AI integration and API.
6. `adstudio-test` — verify UI, API, model, and regression behavior.
7. `adstudio-diff` — score requirements coverage against the product backlog.
8. `adstudio-entrepreneur` — use real user feedback to prioritize improvements.
9. `adstudio-brand` — protect the AdStudio identity and avoid confusing imitation.
10. `adstudio-launch` — prepare release notes and preflight checks.
11. `adstudio-deploy` — deploy safely and verify the actual public service.

## Recommended sequence

`recon → architect → design → build → backend → test → diff → entrepreneur → brand → launch → deploy`

For a bug fix, use only the relevant skills (usually recon → backend/build → test). Do not run a full product rebuild for a small defect.

## Current product architecture

- `index.html`: Arabic RTL frontend on GitHub Pages.
- `cloudflare-worker/`: production-oriented image-generation API on Cloudflare Workers AI.
- `hf-space/`: optional Gradio prototype; not the production engine unless explicitly configured.

## Product guardrails

- Arabic-first and mobile-first.
- Preserve uploaded product appearance as far as the selected model genuinely supports; never promise exact fidelity.
- Never pretend a preview is a generated result.
- No paid API, subscription, GPU, billing activation, or automatic upgrade without explicit owner approval.
- Keep secrets out of frontend files and Git history.
- Use only public, permitted reference information. Rebuild general functionality and UX patterns with original code, assets, copy, and branding.
- Verify provider model input schemas and free quotas from official documentation before making claims.

## Working artifacts

Create these only when useful:
- `docs/product/recon.md`
- `docs/product/architecture.md`
- `docs/product/design-system.md`
- `docs/product/features.csv`
- `docs/product/opportunity-backlog.md`
- `docs/qa/test-plan.md`
- `docs/qa/bug-report.md`
- `docs/ops/deployments.md`

## Usage

In Claude Code, open this repository and invoke a skill such as `/adstudio-recon` or `/adstudio-test`. These are project-local instructions; they do not themselves run an AI image model or deploy services. In another coding assistant, provide the relevant `SKILL.md` as project instructions.
