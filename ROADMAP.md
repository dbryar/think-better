# Roadmap

This roadmap preserves the project direction beyond the first working vertical slice. The priority is to keep the system static, low-cost, public, inspectable, and contribution-friendly.

## Version 0.1: Working Publishing Slice

- Vue 3 Composition API static site.
- Markdown-first content repository.
- Homepage, cards, chapters, examples, facilitator notes, governance, and downloads pages.
- Starter cards, chapters, examples, facilitator notes, and governance docs.
- Plain, readable, mobile-friendly and print-friendly styling.
- Content validation, typechecking, site build, print-pack export, and release manifest generation.
- GitHub Actions CI for lint/check/build/export/manifest.
- Cloudflare Pages deployment workflow for pushes to `main`.
- GitHub artifact attestations where available.

## Version 0.2: Better Artefacts

- Add generated PDFs alongside the current browser-printable field-card HTML pack.
- Generate one combined field-card PDF.
- Generate printable zine-style packs for workshops and classrooms.
- Add release downloads to the site in a way that distinguishes generated artefacts from source content.
- Add stronger validation for frontmatter, tags, duplicate titles, and missing descriptions.

## Version 0.3: Editorial Workflow

- Add issue and pull request templates.
- Add a correction log.
- Add reviewer guidance for factual claims and source quality.
- Add content status transitions from `draft` to `reviewed` to `stable`.
- Add documented versioning rules for content changes and generated releases.

## Version 0.4: Discoverability And Reuse

- Improve client-side search across titles, descriptions, tags, and body text.
- Add tag index pages.
- Add download metadata and release notes.
- Improve source Markdown links once the public repository URL is stable.
- Add optional localisation structure without changing the v1 content model.

## Later, Deliberately Not V1

- Comments or public annotation.
- ActivityPub or other federation.
- Localisation workflows.
- Browser-based offline packs.
- Stronger provenance formats.
- Optional anchoring of release manifests.

Blockchain anchoring is explicitly out of scope for v1. The current manifest format records enough stable metadata that anchoring could be added later without making it part of the first release.
