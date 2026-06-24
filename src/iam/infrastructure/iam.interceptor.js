/**
 * @summary Adds IAM session behavior to the shared Axios client.
 * @author FreshGuard
 */
import { useAuthenticationStore } from '../application/authentication.store.js';

/**
 * Adds the bearer token to authenticated outbound HTTP requests.
 *
 * @param {import('axios').InternalAxiosRequestConfig} config Axios request configuration.
 * @returns {import('axios').InternalAxiosRequestConfig} Updated request configuration.
 */
export function iamRequestInterceptor(config) {
  const authStore = useAuthenticationStore();
  const token = authStore.token.value;

  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}

/**
 * Handles expired or invalid JWT sessions returned by protected endpoints.
 *
 * @param {unknown} error Axios response error.
 * @returns {Promise<never>} Rejected error for caller-level handling.
 */
export function iamUnauthorizedInterceptor(error) {
  const status = error?.response?.status;
  const requestUrl = error?.config?.url ?? '';
  const isSignInRequest = requestUrl.includes('/authentication/sign-in');

  if (status === 401 && !isSignInRequest) {
    const authStore = useAuthenticationStore();
    authStore.signOut();

    if (!window.location.pathname.endsWith('/sign-in')) {
      window.location.assign(`${import.meta.env.BASE_URL}sign-in`);
    }
  }

  return Promise.reject(error);
}
