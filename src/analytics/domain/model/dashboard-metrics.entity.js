/**
 * @summary Represents consolidated ColdTrack dashboard indicators.
 * @author FreshGuard
 */
export class DashboardMetrics {
  /**
   * Creates dashboard metrics from a backend resource.
   *
   * @param {object} metrics Raw metrics.
   */
  constructor(metrics = {}) {
    this.totalShipments = metrics.totalShipments ?? 0;
    this.activeShipments = metrics.activeShipments ?? 0;
    this.completedShipments = metrics.completedShipments ?? 0;
    this.cancelledShipments = metrics.cancelledShipments ?? 0;
    this.totalSensors = metrics.totalSensors ?? 0;
    this.assignedSensors = metrics.assignedSensors ?? 0;
    this.activeAlerts = metrics.activeAlerts ?? 0;
    this.criticalAlerts = metrics.criticalAlerts ?? 0;
  }
}
