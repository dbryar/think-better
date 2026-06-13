<script setup lang="ts">
const links = [
  { to: '/', label: 'Home' },
  { to: '/cards', label: 'Field Cards' },
  { to: '/chapters', label: 'Chapters' },
  { to: '/examples', label: 'Examples' },
  { to: '/facilitator-notes', label: 'Facilitator Notes' },
  { to: '/governance', label: 'Governance' },
  { to: '/downloads', label: 'Downloads' },
];
</script>

<template>
  <header class="site-header">
    <RouterLink class="brand" to="/">
      <span class="brand-mark">?</span>
      <span>Question Power</span>
    </RouterLink>
    <nav aria-label="Main navigation">
      <RouterLink v-for="link in links" :key="link.to" :to="link.to">
        {{ link.label }}
      </RouterLink>
    </nav>
  </header>

  <main>
    <RouterView />
  </main>

  <footer class="site-footer">
    <p>
      Public, inspectable, correctable civic-literacy material. Check it, fork it,
      improve it, or discard what fails.
    </p>
  </footer>
</template>
