<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { findContent, sectionLabel, type ContentType } from '../content';

const props = defineProps<{ type: ContentType }>();
const route = useRoute();
const slug = computed(() => String(route.params.slug));
const item = computed(() => findContent(props.type, slug.value));

function printPage() {
  window.print();
}
</script>

<template>
  <article v-if="item" class="content-page">
    <RouterLink class="back-link" :to="`/${type === 'facilitator-note' ? 'facilitator-notes' : type === 'governance' ? 'governance' : `${type}s`}`">
      Back to {{ sectionLabel(type) }}
    </RouterLink>
    <header class="article-header">
      <p class="eyebrow">{{ sectionLabel(type) }}</p>
      <h1>{{ item.title }}</h1>
      <p class="subtitle">{{ item.description }}</p>
      <dl class="facts">
        <div><dt>Status</dt><dd>{{ item.status }}</dd></div>
        <div><dt>Version</dt><dd>{{ item.version }}</dd></div>
        <div><dt>Last updated</dt><dd>{{ item.last_updated }}</dd></div>
        <div><dt>Audience</dt><dd>{{ item.audience }}</dd></div>
      </dl>
      <button type="button" class="print-button" @click="printPage">Print this page</button>
    </header>

    <aside class="check-box">
      <h2>Check This</h2>
      <p>
        Treat this page as a method, not a doctrine. Ask what evidence would change
        it, what it leaves out, and whether the boring explanation fits better.
      </p>
      <p>
        Source Markdown:
        <a :href="`/source/${item.sourcePath}`">{{ item.sourcePath }}</a>
      </p>
    </aside>

    <div class="prose" v-html="item.html"></div>
  </article>
  <section v-else>
    <h1>Page Not Found</h1>
    <p>This content item does not exist.</p>
  </section>
</template>
