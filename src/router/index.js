import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import SongListPage from '../views/SongListPage.vue';
import SongDetailsPage from '../views/SongDetailsPage.vue';

const routes = [
  { path: '/', component: HomePage }, // Default route
  { path: '/songs', component: SongListPage },
  { path: '/song/:id', component: SongDetailsPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;