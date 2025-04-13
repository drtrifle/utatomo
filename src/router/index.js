import { createRouter, createWebHashHistory } from 'vue-router';
import DevTool from '../views/DevTool.vue';
import HomePage from '../views/HomePage.vue';
import SongListPage from '../views/SongListPage.vue';
import SongDetailsPage from '../views/SongDetailsPage.vue';

const routes = [
  { path: '/', component: HomePage }, // Default route
  { path: '/dev', component: DevTool },
  { path: '/songs', component: SongListPage },
  { path: '/song/:id', component: SongDetailsPage },
];

const router = createRouter({
  history: createWebHashHistory('/utatomo/'),
  routes,
});

export default router;
