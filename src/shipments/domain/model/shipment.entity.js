/**
 * Builds a display code from legacy API identifiers.
 *
 * @param {string|number|null} value Legacy identifier.
 * @returns {string} Shipment display code.
 */
function resolveShipmentCode(value) {
  if (String(value ?? '').startsWith('ENV-')) return value;
  return value === null || value === undefined ? '' : `ENV-${String(value).padStart(3, '0')}`;
}

/**
 * Normalizes backend shipment status values for interface translation keys.
 *
 * @param {string} value Backend status.
 * @returns {string} Normalized status.
 */
function normalizeStatus(value) {
  const statuses = { Registered: 'registered', InTransit: 'in-transit', Completed: 'completed', Cancelled: 'cancelled' };
  return statuses[value] ?? String(value ?? 'registered').toLowerCase();
}

/**
 * @summary Represents a monitored cold-chain shipment.
 * @author Codex Assistant
 */
export class Shipment {
  /**
   * Creates a shipment instance.
   *
   * @param {object} shipment Raw shipment properties.
   */
  constructor(shipment = {}) {
    this.id = shipment.id ?? null;
    this.shipmentCode = shipment.shipmentCode ?? resolveShipmentCode(shipment.id);
    this.destination = shipment.destination ?? '';
    this.status = normalizeStatus(shipment.status);
    this.driverId = shipment.driverId ?? null;
    this.driver = shipment.driver ?? (this.driverId ? `Driver #${this.driverId}` : '');
    this.cargoDescription = shipment.cargoDescription ?? '';
    this.temperature = shipment.temperature ?? null;
    this.humidity = shipment.humidity ?? null;
    this.departureDate = shipment.departureDate ?? '';
    this.estimatedArrival = shipment.estimatedArrival ?? '';
    this.actualArrival = shipment.actualArrival ?? null;
    this.alertsCount = shipment.alertsCount ?? 0;
  }
}
