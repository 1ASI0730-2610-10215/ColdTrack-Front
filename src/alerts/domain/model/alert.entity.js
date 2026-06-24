/**
 * Builds a display code from legacy API identifiers.
 *
 * @param {string|number|null} value Legacy identifier.
 * @returns {string} Alert display code.
 */
function resolveAlertCode(value) {
  if (String(value ?? '').startsWith('ALT-')) return value;
  return value === null || value === undefined ? '' : `ALT-${String(value).padStart(3, '0')}`;
}

/**
 * @summary Represents an operational alert raised by shipment sensors.
 * @author FreshGuard
 */
export class Alert {
  /**
   * Creates an alert instance.
   *
   * @param {object} alert Raw alert properties.
   */
  constructor(alert = {}) {
    this.id = alert.id ?? null;
    this.alertCode = alert.alertCode ?? resolveAlertCode(alert.id);
    this.shipmentId = alert.shipmentId ?? null;
    this.sensorId = alert.sensorId ?? null;
    this.type = String(alert.type ?? '').toLowerCase().includes('humidity') ? 'humidity' : 'temperature';
    this.severity = String(alert.severity ?? 'Warning').toLowerCase();
    const statuses = { Triggered: 'active', Acknowledged: 'acknowledged', Resolved: 'resolved' };
    this.status = statuses[alert.status] ?? String(alert.status ?? 'active').toLowerCase();
    this.message = alert.message ?? '';
    this.value = alert.value ?? '-';
    this.limit = alert.limit ?? '-';
    this.createdAt = alert.triggeredAt ?? alert.createdAt ?? '';
    this.resolutionNotes = alert.resolutionNotes ?? null;
  }
}
