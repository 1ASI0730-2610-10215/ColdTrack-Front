/**
 * @summary Loads analytical indicators used across ColdTrack views.
 * @author Codex Assistant
 */
import { ref } from 'vue';
import { DashboardMetrics } from '../domain/model/dashboard-metrics.entity.js';
import { AnalyticsApiService } from '../infrastructure/analytics-api.service.js';

const metrics = ref(new DashboardMetrics());
const api = new AnalyticsApiService();

/**
 * Provides analytics state and operations.
 *
 * @returns {object} Analytics state facade.
 */
export function useAnalyticsStore() {
  /**
   * Loads dashboard indicators from the backend.
   *
   * @returns {Promise<void>} Resolves when indicators are loaded.
   */
  async function loadDashboard() {
    const response = await api.getDashboard();
    metrics.value = new DashboardMetrics(response.data);
  }

  return { metrics, loadDashboard };
}
