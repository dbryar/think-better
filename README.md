# How to Question Power Without Becoming a Mark

A civic self-defence field guide for spotting manipulation, following incentives, checking claims, and staying sceptical without falling into paranoia.

This project does not tell people what to believe or who to vote for. It teaches better questions, better reasoning habits, and practical anti-manipulation checks.

## What This Is

- A public field guide for civic reasoning.
- A toolkit for spotting manipulation.
- A set of shareable, printable artefacts.
- A contribution-friendly Markdown project.
- A versioned and inspectable publishing pipeline.
- A way to help people ask better questions before they are recruited by bad ones.

## What This Is Not

- A political party.
- A campaign vehicle.
- A conspiracy archive.
- A forbidden handbook.
- A guru project.
- A replacement for journalism, education, law, science, or expertise.
- A place to tell people what to believe.

## Local Setup

```bash
bun install
bun run dev
```

The local Vite site runs at the URL printed by the command, usually `http://localhost:5173`.

Run the full local check:

```bash
bun run ci
```

That validates Markdown frontmatter, typechecks Vue, builds the site, exports the field-card print pack, and writes `dist/release-manifest.json`.

## Content Structure

- `content/cards/`: short printable field cards.
- `content/chapters/`: longer explanations.
- `content/examples/`: fictional or generalised breakdowns.
- `content/facilitator-notes/`: guidance for parents, teachers, and youth workers.
- `governance/`: editorial process, moderation, review, and epistemic hygiene.
- `scripts/`: validation, export, and provenance manifest scripts.
- `src/`: Vue 3 Composition API site.

Built pages link to copied source Markdown under `/source/content/...` and `/source/governance/...` so readers can inspect the text behind each rendered page even before a GitHub remote exists.

Markdown pages use this frontmatter:

```yaml
title:
description:
type: card | chapter | example | facilitator-note
status: draft | reviewed | stable
version: 0.1.0
last_updated: YYYY-MM-DD
audience:
tags:
```

Governance pages omit `type`; the site treats files in `governance/` as governance content.

## Editorial Principles

- Evidence beats loyalty.
- Claims must be checkable.
- Criticism is not betrayal.
- No gurus.
- No secret knowledge.
- No purity tests.
- No violence or dehumanisation.
- No party endorsements in core material.
- Include counterarguments and boring explanations where relevant.

## Cloudflare Pages Deployment

This repo is configured for Cloudflare Pages with Vite output in `dist`.

When the GitHub remote exists:

1. Create a Cloudflare Pages project named `how-to-question-power`, or change the project name in `.github/workflows/deploy-pages.yml` and `wrangler.jsonc`.
2. Add GitHub repository secrets:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
3. Push or merge to `main`.

The deploy workflow builds the site, generates downloadable artefacts and `release-manifest.json`, attests build provenance with GitHub artifact attestations, then deploys `dist` with Wrangler:

```bash
wrangler pages deploy dist --project-name how-to-question-power --branch main
```

For a manual deploy after login:

```bash
bun run ci
bunx wrangler pages deploy dist --project-name how-to-question-power --branch main
```

## Provenance And Releases

`scripts/generate-manifest.ts` records the current git commit, build timestamp, artefact paths, and SHA-256 hashes in `dist/release-manifest.json`.

Tagged releases matching `v*` build the same artefacts and upload the manifest and field-card pack to GitHub Releases. Blockchain anchoring is out of scope for v1, but the manifest format leaves room for later anchoring.

## Printing, Sharing, Forking

Every content page includes print support. The release pipeline also creates `dist/downloads/field-cards.md`, a combined field-card print pack that can be converted to PDF later.

This project is designed to be copied, printed, forked, mirrored, and criticised. Do not trust it because it sounds confident. Check it, improve it, argue with it, or discard what fails.
