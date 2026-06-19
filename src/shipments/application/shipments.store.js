/**
 * @summary Loads and mutates shipment state for Composition API views.
 * @author Codex Assistant
 */
import { computed, ref } from 'vue';
import { Shipment } from '../domain/model/shipment.entity.js';
import { ShipmentsApiService } from '../infrastructure/shipments-api.service.js';

const shipments = ref([]);
const api = new ShipmentsApiService();

/**
 * Provides shipment state and operations.
 *
 * @returns {object} Shipment state facade.
 */
export function useShipmentsStore() {
  const activeShipments = computed(() => shipments.value.filter((shipment) => ['registered', 'in-transit'].includes(shipment.status)));
  const completedShipments = computed(() => shipments.value.filter((shipment) => shipment.status === 'completed'));

  /**
   * Loads shipments from the ColdTrack backend.
   *
   * @returns {Promise<void>} Resolves when data has been loaded.
   */
  async function load() {
    const response = await api.getAll();
    shipments.value = response.data.map((shipment) => new Shipment(shipment));
  }

  /**
   * Registers a new shipment.
   *
   * @param {object} payload Shipment form data.
   * @returns {Promise<Shipment>} Created shipment.
   */
  async function create(payload) {
    const response = await api.create(payload);
    shipments.value = [...shipments.value, new Shipment(response.data)];
    return new Shipment(response.data);
  }

  return { shipments, activeShipments, completedShipments, load, create };
}
