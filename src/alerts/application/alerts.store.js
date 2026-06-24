/**
 * @summary Loads alert state for Composition API views.
 * @author FreshGuard
 */
import { computed, ref } from 'vue';
import { Alert } from '../domain/model/alert.entity.js';
import { AlertsApiService } from '../infrastructure/alerts-api.service.js';

const alerts = ref([]);
const api = new AlertsApiService();

/**
 * Provides alert state and operations.
 *
 * @returns {object} Alert state facade.
 */
export function useAlertsStore() {
  const activeAlerts = computed(() => alerts.value.filter((alert) => alert.status === 'active'));
  const criticalAlerts = computed(() => alerts.value.filter((alert) => alert.severity === 'critical'));

  /**
   * Loads alerts from the fake API.
   *
   * @returns {Promise<void>} Resolves when data has been loaded.
   */
  async function load() {
    const response = await api.getAll();
    alerts.value = response.data.map((alert) => new Alert(alert));
  }

  async function acknowledge(alertId) {
    const response = await api.acknowledge(alertId);
    const updated = new Alert(response.data);
    alerts.value = alerts.value.map((alert) => alert.id === updated.id ? updated : alert);
    return updated;
  }

  async function resolve(alertId, notes) {
    const response = await api.resolve(alertId, notes);
    const updated = new Alert(response.data);
    alerts.value = alerts.value.map((alert) => alert.id === updated.id ? updated : alert);
    return updated;
  }

  return { alerts, activeAlerts, criticalAlerts, load, acknowledge, resolve };
}
