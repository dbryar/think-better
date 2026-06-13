<template>
  <section>
    <p class="eyebrow">Printable and verifiable</p>
    <h1>Downloads</h1>
    <p class="subtitle">
      Release artefacts are generated during CI and local builds. The first pass
      includes a text-based field card print pack and a manifest with SHA-256 hashes.
    </p>
    <div class="grid">
      <a class="tile" href="/downloads/field-cards.md">
        <h2>Field Cards Print Pack</h2>
        <p>A combined Markdown pack for printing or converting to PDF.</p>
      </a>
      <a class="tile" href="/release-manifest.json">
        <h2>Release Manifest</h2>
        <p>Commit, timestamp, artefact paths, and SHA-256 hashes generated at build time.</p>
      </a>
    </div>
  </section>
</template>
