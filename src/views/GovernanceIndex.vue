<script setup lang="ts">
import { byType } from '../content';

const items = byType('governance');
</script>

<template>
  <section>
    <p class="eyebrow">Editorial safeguards</p>
    <h1>Governance</h1>
    <p class="subtitle">
      How the project stays public, correctable, non-party-political, and resistant
      to guru dynamics, conspiracy pipelines, and recruitment patterns.
    </p>
    <div class="grid">
      <RouterLink v-for="item in items" :key="item.route" class="tile" :to="item.route">
        <h2>{{ item.title }}</h2>
        <p>{{ item.description }}</p>
      </RouterLink>
    </div>
  </section>
</template>
