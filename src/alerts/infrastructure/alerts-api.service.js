/**
 * @summary Provides axios operations for alert resources.
 * @author Codex Assistant
 */
import { httpClient } from '../../shared/infrastructure/http/http-client.js';

export class AlertsApiService {
  /**
   * Gets all alerts.
   *
   * @returns {Promise<import('axios').AxiosResponse>} Axios response.
   */
  getAll() {
    return httpClient.get('/alerts');
  }
}
