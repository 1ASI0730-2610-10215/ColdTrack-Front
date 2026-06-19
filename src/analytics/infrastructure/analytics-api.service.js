/**
 * @summary Provides axios operations for analytics resources.
 * @author Codex Assistant
 */
import { httpClient } from '../../shared/infrastructure/http/http-client.js';
import { apiEndpoints } from '../../shared/infrastructure/http/api-endpoints.js';

export class AnalyticsApiService {
  /**
   * Gets consolidated dashboard indicators.
   *
   * @returns {Promise<import('axios').AxiosResponse>} Axios response.
   */
  getDashboard() {
    return httpClient.get(`${apiEndpoints.analytics}/dashboard`);
  }

  getShipmentHistory(start, end) {
    return httpClient.get(`${apiEndpoints.analytics}/shipment-history`, { params: { start, end } });
  }

  getReports() {
    return httpClient.get(apiEndpoints.reports);
  }

  generateReport(start, end) {
    return httpClient.post(apiEndpoints.reports, { start, end });
  }

  downloadReport(reportId) {
    return httpClient.get(`${apiEndpoints.reports}/${reportId}/file`, { responseType: 'blob' });
  }
}
