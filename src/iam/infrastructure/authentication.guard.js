/**
 * @summary Protects ColdTrack routes according to the active IAM session.
 * @author FreshGuard
 */
import { useAuthenticationStore } from '../application/authentication.store.js';

/**
 * Decides if navigation can continue or must be redirected by authentication state.
 *
 * @param {import('vue-router').RouteLocationNormalized} to Target route.
 * @returns {{name: string, query?: object} | boolean} Navigation result.
 */
export function authenticationGuard(to) {
  const authStore = useAuthenticationStore();
  const isPublicRoute = Boolean(to.meta.public);
  const isAuthenticated = authStore.isAuthenticated.value;

  if (!isPublicRoute && !isAuthenticated) {
    return {
      name: 'sign-in',
      query: to.fullPath && to.fullPath !== '/' ? { redirect: to.fullPath } : undefined
    };
  }

  if (isPublicRoute && isAuthenticated) return { name: 'dashboard' };

  return true;
}
