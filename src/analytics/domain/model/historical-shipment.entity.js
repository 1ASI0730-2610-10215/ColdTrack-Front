/**
 * @summary Represents a shipment row optimized for analytics history.
 * @author FreshGuard
 */
export class HistoricalShipment {
  constructor(shipment = {}) {
    this.id = shipment.shipmentId ?? null;
    this.shipmentCode = shipment.shipmentCode ?? '';
    this.destination = shipment.destination ?? '';
    this.driver = shipment.driverName ?? '';
    this.cargoDescription = shipment.cargoDescription ?? '';
    this.status = String(shipment.status ?? '').toLowerCase();
    this.departureDate = shipment.departureDate ?? '';
    this.estimatedArrival = shipment.estimatedArrival ?? '';
    this.actualArrival = shipment.actualArrival ?? null;
    this.temperature = shipment.averageTemperature ?? null;
    this.humidity = shipment.averageHumidity ?? null;
    this.alertsCount = shipment.alertCount ?? 0;
  }
}
