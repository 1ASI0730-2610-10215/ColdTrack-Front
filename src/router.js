/**
 * @summary Declares application routes and delegates IAM navigation protection.
 * @author FreshGuard
 */
import { createRouter, createWebHistory } from 'vue-router';
import { authenticationGuard } from './iam/infrastructure/authentication.guard.js';

const routes = [
  { path: '/', redirect: '/sign-in' },
  { path: '/dashboard', name: 'dashboard', component: () => import('./shipments/presentation/views/dashboard-view.vue'), meta: { title: 'Dashboard' } },
  { path: '/shipments/new', name: 'new-shipment', component: () => import('./shipments/presentation/views/new-shipment-view.vue'), meta: { title: 'New Shipment' } },
  { path: '/sensors', name: 'sensors', component: () => import('./sensors/presentation/views/sensors-view.vue'), meta: { title: 'Sensors' } },
  { path: '/alerts', name: 'alerts', component: () => import('./alerts/presentation/views/alerts-view.vue'), meta: { title: 'Alerts' } },
  { path: '/history', name: 'history', component: () => import('./shipments/presentation/views/history-view.vue'), meta: { title: 'History' } },
  { path: '/sign-in', name: 'sign-in', component: () => import('./iam/presentation/views/sign-in-view.vue'), meta: { title: 'Sign In', public: true } },
  { path: '/sign-up', name: 'sign-up', component: () => import('./iam/presentation/views/sign-up-view.vue'), meta: { title: 'Sign Up', public: true } },
  { path: '/:pathMatch(.*)*', redirect: '/dashboard' }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

/**
 * Updates the document title and delegates authentication checks before navigation.
 *
 * @param {import('vue-router').RouteLocationNormalized} to Target route.
 * @returns {{name: string, query?: object} | boolean} Navigation result.
 */
router.beforeEach((to) => {
  document.title = `ColdTrack - ${to.meta.title ?? 'Dashboard'}`;
  return authenticationGuard(to);
});

export default router;
