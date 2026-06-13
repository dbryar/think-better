import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import ContentIndex from './views/ContentIndex.vue';
import ContentPage from './views/ContentPage.vue';
import DownloadsPage from './views/DownloadsPage.vue';
import GovernanceIndex from './views/GovernanceIndex.vue';
import HomePage from './views/HomePage.vue';
import './styles.css';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomePage },
    { path: '/cards', component: ContentIndex, props: { type: 'card' } },
    { path: '/cards/:slug', component: ContentPage, props: { type: 'card' } },
    { path: '/chapters', component: ContentIndex, props: { type: 'chapter' } },
    { path: '/chapters/:slug', component: ContentPage, props: { type: 'chapter' } },
    { path: '/examples', component: ContentIndex, props: { type: 'example' } },
    { path: '/examples/:slug', component: ContentPage, props: { type: 'example' } },
    { path: '/facilitator-notes', component: ContentIndex, props: { type: 'facilitator-note' } },
    { path: '/facilitator-notes/:slug', component: ContentPage, props: { type: 'facilitator-note' } },
    { path: '/governance', component: GovernanceIndex },
    { path: '/governance/:slug', component: ContentPage, props: { type: 'governance' } },
    { path: '/downloads', component: DownloadsPage },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

createApp(App).use(router).mount('#app');
