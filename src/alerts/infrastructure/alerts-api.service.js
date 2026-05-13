/**
 * @summary Provides axios operations for alert resources.
 * @author Codex Assistant
 */
import { httpClient } from '../../shared/infrastructure/http/http-client.js';
import { apiEndpoints } from '../../shared/infrastructure/http/api-endpoints.js';

export class AlertsApiService {
  /**
   * Gets all alerts.
   *
   * @returns {Promise<import('axios').AxiosResponse>} Axios response.
   */
  getAll() {
    return httpClient.get(apiEndpoints.alerts);
  }
}
