<script setup lang="ts">
import { byType } from '../content';

const cards = byType('card').slice(0, 4);
const sections = [
  ['Field Cards', 'Short, printable tools for real-life use.', '/cards'],
  ['Chapters', 'Deeper explanations for people who want the machinery.', '/chapters'],
  ['Examples', 'Breakdowns of common manipulation patterns.', '/examples'],
  ['Facilitator Notes', 'Safer ways for adults and youth workers to use the material.', '/facilitator-notes'],
  ['Governance', 'How the project avoids becoming a cult, party vehicle, or conspiracy pipeline.', '/governance'],
  ['Downloads', 'Print packs, release manifests, and versioned artefacts.', '/downloads'],
];

const questions = [
  'Who benefits if I believe this?',
  'What evidence would change my mind?',
  'Is there a simpler, more boring explanation?',
  'Am I being aimed at someone with less power than me?',
  'Is this trying to make me angry before I think?',
  'Who is missing from the story?',
  'What would the claim look like if it were false?',
];
</script>

<template>
  <section class="hero">
    <p class="eyebrow">A public-interest field guide</p>
    <h1>How to Question Power Without Becoming a Mark</h1>
    <p class="subtitle">
      A civic self-defence field guide for spotting manipulation, following
      incentives, checking claims, and staying sceptical without falling into paranoia.
    </p>
    <p>
      Most manipulation is boring. It works because people are tired, scared,
      flattered, angry, lonely, or looking for certainty.
    </p>
    <p>
      This project is a public, open, inspectable field guide for asking better
      questions. It does not tell you who to vote for, who to trust, or what tribe
      to join. It teaches practical habits for checking claims, understanding
      incentives, spotting scapegoats, and avoiding grifters.
    </p>
  </section>

  <section class="band">
    <div class="layout-two">
      <div>
        <h2>Start Here</h2>
        <ul class="question-list">
          <li v-for="question in questions" :key="question">{{ question }}</li>
        </ul>
      </div>
      <aside class="callout">
        <h2>Check This Project Too</h2>
        <p>
          This project does not tell you what to believe. It teaches you how to
          check claims, incentives, evidence, and manipulation, including our own.
        </p>
      </aside>
    </div>
  </section>

  <section>
    <h2>Main Sections</h2>
    <div class="grid">
      <RouterLink v-for="[title, description, to] in sections" :key="to" class="tile" :to="to">
        <h3>{{ title }}</h3>
        <p>{{ description }}</p>
      </RouterLink>
    </div>
  </section>

  <section>
    <h2>Starter Field Cards</h2>
    <div class="grid">
      <RouterLink v-for="card in cards" :key="card.route" class="tile compact" :to="card.route">
        <h3>{{ card.title }}</h3>
        <p>{{ card.description }}</p>
      </RouterLink>
    </div>
  </section>

  <section class="statement">
    <h2>Trust And Provenance</h2>
    <p>
      This project is designed to be copied, printed, forked, mirrored, and
      criticised. Each release should include a manifest that records the commit,
      timestamp, generated artefacts, and SHA-256 hashes. Where available, releases
      should include build provenance via GitHub artifact attestations.
    </p>
    <blockquote>
      Do not trust this project because it sounds confident. Check it. Fork it.
      Improve it. Argue with it. Discard what fails.
    </blockquote>
  </section>
</template>
