# Architecture

This repository is a static publishing system for civic-literacy material.

## Stack

- TypeScript.
- Vue 3 Composition API.
- Vite for static builds.
- `marked` for browser-side Markdown rendering.
- Route-matching Markdown files generated at build time.
- Bun for local scripts and GitHub Actions.
- Cloudflare Pages for hosting.

The site avoids runtime server dependencies. Each readable route is materialized as a physical `index.html` shell plus a route-matching Markdown file. For example, `/cards/who-benefits` serves `dist/cards/who-benefits/index.html`, and the frontend fetches `/cards/who-benefits.md`.

## Repository Layout

- `content/cards/`: short printable field cards.
- `content/chapters/`: longer explanatory chapters.
- `content/examples/`: fictional or generalised manipulation-pattern examples.
- `content/facilitator-notes/`: guidance for adults using the material with young people.
- `governance/`: editorial principles, epistemic hygiene, moderation, contribution process, and review checklist.
- `scripts/validate-content.ts`: validates Markdown frontmatter and body content.
- `scripts/export-pdf.ts`: generates the v1 field-card print-pack placeholder.
- `scripts/generate-manifest.ts`: writes `dist/release-manifest.json` with SHA-256 hashes.
- `src/`: a thin Vue site shell that fetches route Markdown and renders it with `marked`.
- `public/_redirects`: intentionally contains no SPA fallback so `.md` route assets remain directly fetchable.
- `public/_headers`: static response headers for Pages.
- `.github/workflows/`: CI, Pages deploy, and release artefact workflows.

## Markdown Routing

The Vite build plugin in `vite.config.ts` writes:

- `/index.md` for the homepage;
- section index files such as `/cards.md`, `/chapters.md`, and `/governance.md`;
- content route files such as `/cards/who-benefits.md`;
- physical shell files such as `/cards/who-benefits/index.html`.

The frontend computes the Markdown URL from the current route:

```text
/cards/who-benefits -> /cards/who-benefits.md
```

It then parses frontmatter with `yaml`, renders the body with `marked`, and inserts the resulting HTML into the page.

## Build Pipeline

`bun run ci` performs the complete local and CI check:

1. Validate content frontmatter.
2. Typecheck Vue and TypeScript.
3. Build the static site.
4. Generate route-matching Markdown files and physical route shells.
5. Generate the field-card print pack.
6. Generate the release manifest.

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

The Vite build copies `content/` and `governance/` into `dist/source/`. Rendered pages link to their route Markdown files, and the copied source tree remains available for provenance and comparison even without browsing the GitHub repository.
