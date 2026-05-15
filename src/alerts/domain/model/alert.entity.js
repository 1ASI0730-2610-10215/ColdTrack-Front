/**
 * @summary Represents an operational alert raised by shipment sensors.
 * @author Codex Assistant
 */
export class Alert {
  /**
   * Creates an alert instance.
   *
   * @param {object} alert Raw alert properties.
   */
  constructor(alert = {}) {
    this.id = alert.id ?? null;
    this.alertCode = alert.alertCode ?? (String(alert.id ?? '').startsWith('ALT-') ? alert.id : '');
    this.shipmentCode = alert.shipmentCode ?? alert.shipmentId ?? '';
    this.type = alert.type ?? 'temperature';
    this.severity = alert.severity ?? 'warning';
    this.status = alert.status ?? 'active';
    this.message = alert.message ?? '';
    this.value = alert.value ?? '-';
    this.limit = alert.limit ?? '-';
    this.createdAt = alert.createdAt ?? '';
  }
}
