/**
 * Builds a display code from legacy API identifiers.
 *
 * @param {string|number|null} value Legacy identifier.
 * @returns {string} Sensor display code.
 */
function resolveSensorCode(value) {
  if (String(value ?? '').startsWith('SENS-')) return value;
  return value === null || value === undefined ? '' : `SENS-${String(value).padStart(3, '0')}`;
}

function normalizeStatus(value) {
  return String(value ?? 'Available').toLowerCase();
}

/**
 * @summary Represents an IoT sensor that can be assigned to a shipment.
 * @author Codex Assistant
 */
export class Sensor {
  /**
   * Creates a sensor instance.
   *
   * @param {object} sensor Raw sensor properties.
   */
  constructor(sensor = {}) {
    this.id = sensor.id ?? null;
    this.sensorCode = sensor.sensorCode ?? resolveSensorCode(sensor.id);
    this.modelName = sensor.modelName ?? '';
    this.status = normalizeStatus(sensor.status);
    this.shipmentId = sensor.shipmentId ?? null;
    this.assignedAt = sensor.assignedAt ?? null;
    this.lastReading = sensor.lastReadingAt ?? sensor.lastReading ?? null;
    this.temperature = sensor.temperature ?? null;
    this.humidity = sensor.humidity ?? null;
  }
}
