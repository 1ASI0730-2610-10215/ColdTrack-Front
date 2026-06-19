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
   * Loads a shipment by identifier.
   *
   * @param {number} shipmentId Shipment identifier.
   * @returns {Promise<Shipment>} Shipment detail.
   */
  async function getById(shipmentId) {
    const response = await api.getById(shipmentId);
    return new Shipment(response.data);
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

  /**
   * Changes a shipment lifecycle status and refreshes local state.
   *
   * @param {number} shipmentId Shipment identifier.
   * @param {string} status Backend status value.
   * @param {string|null} remarks Optional change remarks.
   * @returns {Promise<Shipment>} Updated shipment.
   */
  async function updateStatus(shipmentId, status, remarks = null) {
    const response = await api.updateStatus(shipmentId, status, remarks);
    const updated = new Shipment(response.data);
    shipments.value = shipments.value.map((shipment) => shipment.id === updated.id ? updated : shipment);
    return updated;
  }

  return { shipments, activeShipments, completedShipments, load, getById, create, updateStatus };
}
