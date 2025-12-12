import { createRouter, createWebHistory, RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import SongListPage from '../views/SongListPage.vue';
import SongDetailsPage from '../views/SongDetailsPage.vue';

const isDev = import.meta.env.DEV;

const baseRoutes = [
  { path: '/', component: HomePage }, // Default route
  { path: '/songs', component: SongListPage },
  { path: '/songs/:language/:id', component: SongDetailsPage },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutPage.vue')
  }
];

const devRoutes = [
  {
    path: '/devtool',
    name: 'devtool',
    component: () => import('../views/DevTool.vue'),
    beforeEnter: (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
      if (!isDev) {
        next({ name: 'home' }); // Redirect to home in production
      } else {
        next();
      }
    }
  }
];

const routes = isDev ? [...baseRoutes, ...devRoutes] : baseRoutes;

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
