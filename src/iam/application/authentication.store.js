/**
 * @summary Manages browser session state for ColdTrack authentication.
 * @author FreshGuard
 */
import { computed, ref } from 'vue';
import { clearSession, readSession, writeSession } from '../../shared/infrastructure/http/session-storage.js';

const session = ref(readSession());

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
    session.value = authenticated;
    writeSession(authenticated);
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

  return { currentUser, token, isAuthenticated, signIn, signOut };
}
