/**
 * @summary Loads alert state for Composition API views.
 * @author Codex Assistant
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

  return { alerts, activeAlerts, criticalAlerts, load };
}
