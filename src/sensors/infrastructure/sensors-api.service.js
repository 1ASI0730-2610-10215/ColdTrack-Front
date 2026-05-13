/**
 * @summary Provides axios operations for sensor resources.
 * @author Codex Assistant
 */
import { httpClient } from '../../shared/infrastructure/http/http-client.js';
import { apiEndpoints } from '../../shared/infrastructure/http/api-endpoints.js';

export class SensorsApiService {
  /**
   * Gets all sensors.
   *
   * @returns {Promise<import('axios').AxiosResponse>} Axios response.
   */
  getAll() {
    return httpClient.get(apiEndpoints.sensors);
  }

  /**
   * Creates a sensor in the fake API.
   *
   * @param {object} sensor Sensor payload.
   * @returns {Promise<import('axios').AxiosResponse>} Axios response.
   */
  create(sensor) {
    return httpClient.post(apiEndpoints.sensors, sensor);
  }
}
