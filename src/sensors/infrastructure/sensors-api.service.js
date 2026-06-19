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
   * Creates a sensor in the ColdTrack backend.
   *
   * @param {object} sensor Sensor payload.
   * @returns {Promise<import('axios').AxiosResponse>} Axios response.
   */
  create(sensor) {
    return httpClient.post(apiEndpoints.sensors, sensor);
  }

  /**
   * Assigns a sensor to a shipment.
   *
   * @param {number} sensorId Sensor technical identifier.
   * @param {number} shipmentId Shipment technical identifier.
   * @returns {Promise<import('axios').AxiosResponse>} Axios response.
   */
  assign(sensorId, shipmentId) {
    return httpClient.patch(`${apiEndpoints.sensors}/${sensorId}/assignment`, { shipmentId });
  }

  /**
   * Records a telemetry reading.
   *
   * @param {object} reading Telemetry payload.
   * @returns {Promise<import('axios').AxiosResponse>} Axios response.
   */
  recordTelemetry(reading) {
    return httpClient.post(apiEndpoints.telemetry, reading);
  }

  /**
   * Gets telemetry recorded for a shipment.
   *
   * @param {number} shipmentId Shipment technical identifier.
   * @returns {Promise<import('axios').AxiosResponse>} Axios response.
   */
  getTelemetry(shipmentId) {
    return httpClient.get(`${apiEndpoints.shipments}/${shipmentId}/telemetry`);
  }
}
