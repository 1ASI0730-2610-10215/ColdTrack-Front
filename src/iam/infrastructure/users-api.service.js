/**
 * @summary Provides axios operations for account resources.
 * @author Codex Assistant
 */
import { httpClient } from '../../shared/infrastructure/http/http-client.js';
import { apiEndpoints } from '../../shared/infrastructure/http/api-endpoints.js';

export class UsersApiService {
  /**
   * Gets users that match an email and password combination.
   *
   * @param {string} email Account email.
   * @param {string} password Account password.
   * @returns {Promise<import('axios').AxiosResponse>} Axios response.
   */
  signIn(email, password) {
    return httpClient.post(`${apiEndpoints.authentication}/sign-in`, { email, password });
  }

  /**
   * Creates a user account in the fake API.
   *
   * @param {object} user User payload.
   * @returns {Promise<import('axios').AxiosResponse>} Axios response.
   */
  signUp(user) {
    return httpClient.post(`${apiEndpoints.authentication}/sign-up`, user);
  }

  /**
   * Gets the current authenticated user.
   *
   * @returns {Promise<import('axios').AxiosResponse>} Axios response.
   */
  getCurrent() {
    return httpClient.get(`${apiEndpoints.users}/me`);
  }
}
