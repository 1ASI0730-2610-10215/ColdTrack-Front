/**
 * @summary Provides axios operations for account resources.
 * @author Codex Assistant
 */
import { httpClient } from '../../shared/infrastructure/http/http-client.js';

export class UsersApiService {
  /**
   * Gets users that match an email and password combination.
   *
   * @param {string} email Account email.
   * @param {string} password Account password.
   * @returns {Promise<import('axios').AxiosResponse>} Axios response.
   */
  getByCredentials(email, password) {
    return httpClient.get('/users', { params: { email, password } });
  }

  /**
   * Creates a user account in the fake API.
   *
   * @param {object} user User payload.
   * @returns {Promise<import('axios').AxiosResponse>} Axios response.
   */
  create(user) {
    return httpClient.post('/users', user);
  }
}
