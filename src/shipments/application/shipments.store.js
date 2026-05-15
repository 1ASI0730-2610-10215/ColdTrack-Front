/**
 * @summary Loads and mutates shipment state for Composition API views.
 * @author Codex Assistant
 */
import { computed, ref } from 'vue';
import { Shipment } from '../domain/model/shipment.entity.js';
import { ShipmentsApiService } from '../infrastructure/shipments-api.service.js';

const shipments = ref([]);
const drivers = ref([]);
const api = new ShipmentsApiService();

/**
 * Builds the next visible shipment code without using the API technical id.
 *
 * @returns {string} Next shipment code.
 */
function getNextShipmentCode() {
  const lastNumber = shipments.value.reduce((max, shipment) => {
    const value = Number(String(shipment.shipmentCode).replace('ENV-', ''));
    return Number.isNaN(value) ? max : Math.max(max, value);
  }, 0);
  return `ENV-${String(lastNumber + 1).padStart(3, '0')}`;
}

/**
 * Provides shipment state and operations.
 *
 * @returns {object} Shipment state facade.
 */
export function useShipmentsStore() {
  const activeShipments = computed(() => shipments.value.filter((shipment) => shipment.status !== 'completed'));
  const completedShipments = computed(() => shipments.value.filter((shipment) => shipment.status === 'completed'));

  /**
   * Loads shipments and drivers from the fake API.
   *
   * @returns {Promise<void>} Resolves when data has been loaded.
   */
  async function load() {
    const [shipmentsResponse, driversResponse] = await Promise.all([api.getAll(), api.getDrivers()]);
    shipments.value = shipmentsResponse.data.map((shipment) => new Shipment(shipment));
    drivers.value = driversResponse.data;
  }

  /**
   * Registers a new shipment.
   *
   * @param {object} payload Shipment form data.
   * @returns {Promise<Shipment>} Created shipment.
   */
  async function create(payload) {
    const created = new Shipment({
      shipmentCode: getNextShipmentCode(),
      status: 'pending',
      temperature: null,
      humidity: null,
      actualArrival: null,
      alertsCount: 0,
      ...payload
    });
    const response = await api.create(created);
    shipments.value = [...shipments.value, new Shipment(response.data)];
    return new Shipment(response.data);
  }

  return { shipments, drivers, activeShipments, completedShipments, load, create };
}
