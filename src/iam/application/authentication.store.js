/**
 * @summary Manages browser session state for ColdTrack authentication.
 * @author Codex Assistant
 */
import { computed, ref } from 'vue';

const sessionKey = 'coldtrack-session';
const currentUser = ref(JSON.parse(localStorage.getItem(sessionKey) ?? 'null'));

/**
 * Provides authentication state and session operations.
 *
 * @returns {object} Authentication facade.
 */
export function useAuthenticationStore() {
  const isAuthenticated = computed(() => Boolean(currentUser.value));

  /**
   * Stores the authenticated user in local storage.
   *
   * @param {object} user Authenticated user.
   * @returns {void}
   */
  function signIn(user) {
    currentUser.value = user;
    localStorage.setItem(sessionKey, JSON.stringify(user));
  }

  /**
   * Clears the authenticated user session.
   *
   * @returns {void}
   */
  function signOut() {
    currentUser.value = null;
    localStorage.removeItem(sessionKey);
  }

  return { currentUser, isAuthenticated, signIn, signOut };
}
