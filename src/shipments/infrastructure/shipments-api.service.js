/**
 * @summary Provides axios operations for shipment resources.
 * @author Codex Assistant
 */
import { httpClient } from '../../shared/infrastructure/http/http-client.js';
import { apiEndpoints } from '../../shared/infrastructure/http/api-endpoints.js';

export class ShipmentsApiService {
  /**
   * Gets all shipments.
   *
   * @returns {Promise<import('axios').AxiosResponse>} Axios response.
   */
  getAll() {
    return httpClient.get(apiEndpoints.shipments);
  }

  /**
   * Creates a shipment in the ColdTrack backend.
   *
   * @param {object} shipment Shipment payload.
   * @returns {Promise<import('axios').AxiosResponse>} Axios response.
   */
  create(shipment) {
    return httpClient.post(apiEndpoints.shipments, shipment);
  }
}
