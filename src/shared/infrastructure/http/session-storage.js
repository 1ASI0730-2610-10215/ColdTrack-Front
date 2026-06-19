/**
 * @summary Persists the authenticated ColdTrack session used by HTTP infrastructure.
 * @author Codex Assistant
 */
const sessionKey = 'coldtrack-session';

/**
 * Reads the current session without throwing when local storage is malformed.
 *
 * @returns {{token: string, user: object}|null} Stored session.
 */
export function readSession() {
  try {
    return JSON.parse(localStorage.getItem(sessionKey) ?? 'null');
  } catch {
    localStorage.removeItem(sessionKey);
    return null;
  }
}

/**
 * Persists an authenticated session.
 *
 * @param {{token: string, user: object}} session Authenticated session.
 * @returns {void}
 */
export function writeSession(session) {
  localStorage.setItem(sessionKey, JSON.stringify(session));
}

/**
 * Removes the current session.
 *
 * @returns {void}
 */
export function clearSession() {
  localStorage.removeItem(sessionKey);
}
