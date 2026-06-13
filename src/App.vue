<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { marked } from 'marked';
import { parse as parseYaml } from 'yaml';

interface PageData {
  title: string;
  description: string;
  type?: string;
  status?: string;
  version?: string;
  last_updated?: string;
  audience?: string;
  tags?: string[];
  body: string;
  sourcePath: string;
}

const links = [
  { href: '/', label: 'Home' },
  { href: '/cards', label: 'Field Cards' },
  { href: '/chapters', label: 'Chapters' },
  { href: '/examples', label: 'Examples' },
  { href: '/facilitator-notes', label: 'Facilitator Notes' },
  { href: '/governance', label: 'Governance' },
  { href: '/downloads', label: 'Downloads' },
];

const repositoryUrl = import.meta.env.VITE_REPO_URL as string | undefined;
const issuesUrl = repositoryUrl ? `${repositoryUrl.replace(/\/$/, '')}/issues` : '';
const path = ref(window.location.pathname);
const page = ref<PageData | null>(null);
const error = ref('');
const loading = ref(true);

marked.use({
  gfm: true,
  breaks: false,
});

const pageHtml = computed(() => (page.value ? marked.parse(page.value.body) : ''));
const isContentPage = computed(() => Boolean(page.value?.type && page.value.type !== 'index'));

function markdownPath(routePath: string): string {
  const clean = routePath === '/' ? '/index' : routePath.replace(/\/$/, '');
  return `${clean}.md`;
}

function parseFrontmatter(raw: string, sourcePath: string): PageData {
  const normalized = raw.replace(/\r\n/g, '\n');
  if (!normalized.startsWith('---\n')) {
    return {
      title: 'Untitled',
      description: '',
      body: normalized,
      sourcePath,
    };
  }

  const closing = normalized.indexOf('\n---', 4);
  const frontmatter = closing === -1 ? '' : normalized.slice(4, closing);
  const bodyStart = closing === -1 ? -1 : normalized.indexOf('\n', closing + 4);
  const body = bodyStart === -1 ? '' : normalized.slice(bodyStart + 1);
  const data = parseYaml(frontmatter) as Partial<PageData> | null;

  return {
    title: data?.title ?? 'Untitled',
    description: data?.description ?? '',
    type: data?.type,
    status: data?.status,
    version: data?.version,
    last_updated: data?.last_updated,
    audience: data?.audience,
    tags: Array.isArray(data?.tags) ? data.tags : [],
    body,
    sourcePath,
  };
}

async function loadPage(routePath = window.location.pathname) {
  loading.value = true;
  error.value = '';
  const sourcePath = markdownPath(routePath);

  try {
    const response = await fetch(sourcePath, { headers: { Accept: 'text/markdown,text/plain' } });
    if (!response.ok) {
      throw new Error(`Could not load ${sourcePath}`);
    }
    page.value = parseFrontmatter(await response.text(), sourcePath);
    path.value = routePath;
    document.title =
      page.value.title === 'How to Question Power Without Becoming a Mark'
        ? page.value.title
        : `${page.value.title} | How to Question Power`;
  } catch (err) {
    page.value = null;
    error.value = err instanceof Error ? err.message : 'Could not load page.';
  } finally {
    loading.value = false;
  }
}

function navigate(href: string) {
  if (href === path.value) return;
  history.pushState({}, '', href);
  void loadPage(href);
  window.scrollTo({ top: 0 });
}

function onPopState() {
  void loadPage(window.location.pathname);
}

function onDocumentClick(event: MouseEvent) {
  const anchor = (event.target as Element | null)?.closest('a');
  if (!anchor) return;

  const url = new URL(anchor.href);
  const isSameOrigin = url.origin === window.location.origin;
  const isStaticAsset =
    url.pathname.endsWith('.md') ||
    url.pathname.endsWith('.json') ||
    url.pathname.endsWith('.html');

  if (isSameOrigin && !isStaticAsset) {
    event.preventDefault();
    navigate(url.pathname);
  }
}

function printPage() {
  window.print();
}

watch(path, () => {
  document.querySelector('main')?.focus();
});

onMounted(() => {
  window.addEventListener('popstate', onPopState);
  document.addEventListener('click', onDocumentClick);
  void loadPage();
});

onBeforeUnmount(() => {
  window.removeEventListener('popstate', onPopState);
  document.removeEventListener('click', onDocumentClick);
});
</script>

<template>
  <header class="site-header">
    <a class="brand" href="/" @click.prevent="navigate('/')">
      <span class="brand-mark">?</span>
      <span>Question Power</span>
    </a>
    <nav aria-label="Main navigation">
      <a
        v-for="link in links"
        :key="link.href"
        :href="link.href"
        :aria-current="path === link.href ? 'page' : undefined"
        @click.prevent="navigate(link.href)"
      >
        {{ link.label }}
      </a>
    </nav>
  </header>

  <main tabindex="-1">
    <section v-if="loading">
      <p class="eyebrow">Loading</p>
      <h1>Loading page</h1>
    </section>

    <section v-else-if="error">
      <p class="eyebrow">Not found</p>
      <h1>Page Not Found</h1>
      <p>{{ error }}</p>
      <p><a href="/" @click.prevent="navigate('/')">Return home</a></p>
    </section>

    <article v-else-if="page" class="content-page">
      <header class="article-header" :class="{ hero: path === '/' }">
        <p class="eyebrow">{{ page.type === 'index' ? 'Public-interest field guide' : page.type }}</p>
        <h1>{{ page.title }}</h1>
        <p v-if="page.description" class="subtitle">{{ page.description }}</p>

        <dl v-if="isContentPage" class="facts">
          <div v-if="page.status"><dt>Status</dt><dd>{{ page.status }}</dd></div>
          <div v-if="page.version"><dt>Version</dt><dd>{{ page.version }}</dd></div>
          <div v-if="page.last_updated"><dt>Last updated</dt><dd>{{ page.last_updated }}</dd></div>
          <div v-if="page.audience"><dt>Audience</dt><dd>{{ page.audience }}</dd></div>
        </dl>

        <button v-if="isContentPage" type="button" class="print-button" @click="printPage">
          Print this page
        </button>
      </header>

      <aside v-if="isContentPage" class="check-box">
        <h2>Check This</h2>
        <p>
          Treat this page as a method, not a doctrine. Ask what evidence would change
          it, what it leaves out, and whether the boring explanation fits better.
        </p>
        <p>
          Source Markdown:
          <a :href="page.sourcePath">{{ page.sourcePath }}</a>
        </p>
      </aside>

      <div class="prose" v-html="pageHtml"></div>
    </article>
  </main>

  <footer class="site-footer">
    <p>
      Public, inspectable, correctable civic-literacy material. Check it, fork it,
      improve it, or discard what fails.
      <span v-if="issuesUrl">
        Raise corrections or issues on <a :href="issuesUrl">GitHub Issues</a>.
      </span>
    </p>
  </footer>
</template>
