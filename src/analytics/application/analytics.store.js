/**
 * @summary Loads analytical indicators used across ColdTrack views.
 * @author Codex Assistant
 */
import { ref } from 'vue';
import { DashboardMetrics } from '../domain/model/dashboard-metrics.entity.js';
import { HistoricalShipment } from '../domain/model/historical-shipment.entity.js';
import { AnalyticsApiService } from '../infrastructure/analytics-api.service.js';

const metrics = ref(new DashboardMetrics());
const history = ref([]);
const reports = ref([]);
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

  async function loadHistory(start, end) {
    const response = await api.getShipmentHistory(start, end);
    history.value = response.data.map((shipment) => new HistoricalShipment(shipment));
  }

  async function loadReports() {
    const response = await api.getReports();
    reports.value = response.data;
  }

  async function generateReport(start, end) {
    const response = await api.generateReport(start, end);
    const report = response.data;
    const fileResponse = await api.downloadReport(report.id);
    reports.value = [report, ...reports.value.filter((item) => item.id !== report.id)];
    return { report, file: fileResponse.data };
  }

  return { metrics, history, reports, loadDashboard, loadHistory, loadReports, generateReport };
}
