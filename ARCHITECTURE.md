# Architecture

This repository is a static publishing system for civic-literacy material.

## Stack

- TypeScript.
- Vue 3 Composition API.
- Vite for static builds.
- Markdown content loaded at build time.
- Bun for local scripts and GitHub Actions.
- Cloudflare Pages for hosting.

The site avoids runtime server dependencies. Pages are rendered as a static single-page app with route fallbacks for content routes.

## Repository Layout

- `content/cards/`: short printable field cards.
- `content/chapters/`: longer explanatory chapters.
- `content/examples/`: fictional or generalised manipulation-pattern examples.
- `content/facilitator-notes/`: guidance for adults using the material with young people.
- `governance/`: editorial principles, epistemic hygiene, moderation, contribution process, and review checklist.
- `scripts/validate-content.ts`: validates Markdown frontmatter and body content.
- `scripts/export-pdf.ts`: generates the v1 field-card print-pack placeholder.
- `scripts/generate-manifest.ts`: writes `dist/release-manifest.json` with SHA-256 hashes.
- `src/`: Vue site source.
- `public/_redirects`: Cloudflare Pages SPA route fallbacks for Vue routes.
- `public/_headers`: static response headers for Pages.
- `.github/workflows/`: CI, Pages deploy, and release artefact workflows.

## Build Pipeline

`bun run ci` performs the complete local and CI check:

1. Validate content frontmatter.
2. Typecheck Vue and TypeScript.
3. Build the static site.
4. Generate the field-card print pack.
5. Generate the release manifest.

## Provenance

The release manifest records:

- project identifier;
- version;
- git commit when available;
- build timestamp;
- generated artefact paths;
- SHA-256 hashes.

GitHub Actions also creates build provenance attestations where the GitHub permissions and action support it.

## Deployment

Pushes to `main` run the Cloudflare Pages deployment workflow. The workflow builds `dist`, generates release artefacts, creates attestations, and runs:

```bash
wrangler pages deploy dist --project-name how-to-question-power --branch main
```

Deployment requires repository secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

## Source Inspection

The Vite build copies `content/` and `governance/` into `dist/source/`. Rendered pages link to those copied Markdown files so readers can inspect page source even without browsing the GitHub repository.
