/**
 * @summary Loads and mutates sensor state for Composition API views.
 * @author FreshGuard
 */
import { computed, ref } from 'vue';
import { Sensor } from '../domain/model/sensor.entity.js';
import { SensorsApiService } from '../infrastructure/sensors-api.service.js';

const sensors = ref([]);
const api = new SensorsApiService();

/**
 * Provides sensor state and operations.
 *
 * @returns {object} Sensor state facade.
 */
export function useSensorsStore() {
  const availableSensors = computed(() => sensors.value.filter((sensor) => sensor.status === 'available'));
  const assignedSensors = computed(() => sensors.value.filter((sensor) => sensor.status === 'assigned'));

  /**
   * Loads sensors from the ColdTrack backend.
   *
   * @returns {Promise<void>} Resolves when data has been loaded.
   */
  async function load() {
    const response = await api.getAll();
    sensors.value = response.data.map((sensor) => new Sensor(sensor));
  }

  /**
   * Registers a new sensor.
   *
   * @param {object} payload Sensor form data.
   * @returns {Promise<Sensor>} Created sensor.
   */
  async function create(payload) {
    const response = await api.create(payload);
    sensors.value = [...sensors.value, new Sensor(response.data)];
    return new Sensor(response.data);
  }

  /**
   * Assigns an available sensor to a shipment.
   *
   * @param {number} sensorId Sensor identifier.
   * @param {number} shipmentId Shipment identifier.
   * @returns {Promise<Sensor>} Updated sensor.
   */
  async function assign(sensorId, shipmentId) {
    const response = await api.assign(sensorId, shipmentId);
    const updated = new Sensor(response.data);
    sensors.value = sensors.value.map((sensor) => sensor.id === updated.id ? updated : sensor);
    return updated;
  }

  /**
   * Records a telemetry reading and refreshes sensors.
   *
   * @param {object} payload Telemetry payload.
   * @returns {Promise<object>} Created telemetry resource.
   */
  async function recordTelemetry(payload) {
    const response = await api.recordTelemetry(payload);
    await load();
    return response.data;
  }

  async function getTelemetry(shipmentId) {
    const response = await api.getTelemetry(shipmentId);
    return response.data;
  }

  return { sensors, availableSensors, assignedSensors, load, create, assign, recordTelemetry, getTelemetry };
}
