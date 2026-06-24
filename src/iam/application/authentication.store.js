/**
 * @summary Manages browser session state for ColdTrack authentication.
 * @author FreshGuard
 */
import { computed, ref } from 'vue';
import { clearSession, readSession, writeSession } from '../../shared/infrastructure/http/session-storage.js';

const session = ref(readSession());

/**
 * Normalizes backend authentication responses before persisting them.
 *
 * @param {{token?: string, user?: object}|null} authenticated Authenticated backend response.
 * @returns {{token: string, user: object}|null} Normalized session.
 */
function normalizeSession(authenticated) {
  if (!authenticated?.token || !authenticated?.user) return null;
  return { token: authenticated.token, user: authenticated.user };
}

/**
 * Provides authentication state and session operations.
 *
 * @returns {object} Authentication facade.
 */
export function useAuthenticationStore() {
  const currentUser = computed(() => session.value?.user ?? null);
  const token = computed(() => session.value?.token ?? null);
  const isAuthenticated = computed(() => Boolean(token.value && currentUser.value));

  /**
   * Stores the authenticated user in local storage.
   *
   * @param {{token: string, user: object}} authenticated Authenticated backend response.
   * @returns {void}
   */
  function signIn(authenticated) {
    const normalizedSession = normalizeSession(authenticated);
    if (!normalizedSession) throw new Error('Invalid authentication response');
    session.value = normalizedSession;
    writeSession(normalizedSession);
  }

  /**
   * Clears the authenticated user session.
   *
   * @returns {void}
   */
  function signOut() {
    session.value = null;
    clearSession();
  }

  /**
   * Reloads session state from local storage.
   *
   * @returns {void}
   */
  function restoreSession() {
    session.value = readSession();
  }

  return { currentUser, token, isAuthenticated, signIn, signOut, restoreSession };
}
