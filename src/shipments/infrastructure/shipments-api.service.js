/**
 * @summary Provides axios operations for shipment resources.
 * @author Codex Assistant
 */
import { httpClient } from '../../shared/infrastructure/http/http-client.js';

export class ShipmentsApiService {
  /**
   * Gets all shipments.
   *
   * @returns {Promise<import('axios').AxiosResponse>} Axios response.
   */
  getAll() {
    return httpClient.get('/shipments');
  }

  /**
   * Creates a shipment in the fake API.
   *
   * @param {object} shipment Shipment payload.
   * @returns {Promise<import('axios').AxiosResponse>} Axios response.
   */
  create(shipment) {
    return httpClient.post('/shipments', shipment);
  }

  /**
   * Gets drivers for shipment assignment.
   *
   * @returns {Promise<import('axios').AxiosResponse>} Axios response.
   */
  getDrivers() {
    return httpClient.get('/drivers');
  }
}
