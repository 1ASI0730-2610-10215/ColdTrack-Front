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
   * Gets one shipment by its technical identifier.
   *
   * @param {number} shipmentId Shipment identifier.
   * @returns {Promise<import('axios').AxiosResponse>} Axios response.
   */
  getById(shipmentId) {
    return httpClient.get(`${apiEndpoints.shipments}/${shipmentId}`);
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

  /**
   * Updates the lifecycle status of a shipment.
   *
   * @param {number} shipmentId Shipment identifier.
   * @param {string} status Backend status value.
   * @param {string|null} remarks Optional status change remarks.
   * @returns {Promise<import('axios').AxiosResponse>} Axios response.
   */
  updateStatus(shipmentId, status, remarks = null) {
    return httpClient.patch(`${apiEndpoints.shipments}/${shipmentId}/status`, { status, remarks });
  }
}
