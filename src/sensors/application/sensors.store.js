/**
 * @summary Loads and mutates sensor state for Composition API views.
 * @author Codex Assistant
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
   * Loads sensors from the fake API.
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
    const sensor = new Sensor({ status: 'available', ...payload });
    const response = await api.create(sensor);
    sensors.value = [...sensors.value, new Sensor(response.data)];
    return new Sensor(response.data);
  }

  return { sensors, availableSensors, assignedSensors, load, create };
}
