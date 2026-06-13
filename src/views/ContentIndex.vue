<script setup lang="ts">
import { computed, ref } from 'vue';
import { byType, sectionLabel, type ContentType } from '../content';

const props = defineProps<{ type: ContentType }>();
const query = ref('');

const items = computed(() => byType(props.type));
const filteredItems = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return items.value;
  return items.value.filter((item) =>
    [item.title, item.description, item.tags.join(' ')].join(' ').toLowerCase().includes(q),
  );
});
</script>

<template>
  <section>
    <p class="eyebrow">{{ filteredItems.length }} items</p>
    <h1>{{ sectionLabel(type) }}</h1>
    <label class="search">
      <span>Search this section</span>
      <input v-model="query" type="search" placeholder="Try incentives, certainty, scapegoat" />
    </label>
    <div class="grid">
      <RouterLink v-for="item in filteredItems" :key="item.route" class="tile" :to="item.route">
        <p class="meta">{{ item.status }} · v{{ item.version }} · {{ item.last_updated }}</p>
        <h2>{{ item.title }}</h2>
        <p>{{ item.description }}</p>
        <p class="tagline">{{ item.tags.join(', ') }}</p>
      </RouterLink>
    </div>
  </section>
</template>
