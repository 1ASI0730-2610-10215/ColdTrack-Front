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
    this.status = shipment.status ?? 'pending';
    this.driver = shipment.driver ?? '';
    this.cargoDescription = shipment.cargoDescription ?? '';
    this.temperature = shipment.temperature ?? null;
    this.humidity = shipment.humidity ?? null;
    this.departureDate = shipment.departureDate ?? '';
    this.estimatedArrival = shipment.estimatedArrival ?? '';
    this.actualArrival = shipment.actualArrival ?? null;
    this.alertsCount = shipment.alertsCount ?? 0;
  }
}
