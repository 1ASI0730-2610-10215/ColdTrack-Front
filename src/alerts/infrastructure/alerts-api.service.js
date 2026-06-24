/**
 * @summary Provides axios operations for alert resources.
 * @author FreshGuard
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

  acknowledge(alertId) {
    return httpClient.patch(`${apiEndpoints.alerts}/${alertId}/acknowledgment`);
  }

  resolve(alertId, notes) {
    return httpClient.patch(`${apiEndpoints.alerts}/${alertId}/resolution`, { notes });
  }
}
