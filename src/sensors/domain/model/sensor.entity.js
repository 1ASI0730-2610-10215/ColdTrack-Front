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
    this.sensorCode = sensor.sensorCode ?? (String(sensor.id ?? '').startsWith('SENS-') ? sensor.id : '');
    this.status = sensor.status ?? 'available';
    this.shipmentCode = sensor.shipmentCode ?? sensor.shipmentId ?? null;
    this.lastReading = sensor.lastReading ?? null;
    this.temperature = sensor.temperature ?? null;
    this.humidity = sensor.humidity ?? null;
  }
}
