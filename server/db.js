/**
 * @summary JSON Server fake API data source for ColdTrack.
 * @author Codex Assistant
 */
module.exports = {
  "users": [
    {
      "id": 1,
      "fullName": "Demo Operator",
      "email": "test@test.com",
      "password": "password",
      "role": "operator"
    },
    {
      "email": "newuser484008622@test.com",
      "role": "operator",
      "fullName": "New Test User",
      "password": "password",
      "id": 2
    },
    {
      "fullName": "Aaron Avila",
      "email": "aa.3a.0a.p@gmail.com",
      "role": "manager",
      "password": "password",
      "id": 3
    }
  ],
  "drivers": [
    {
      "id": 1,
      "fullName": "Carlos Ruiz"
    },
    {
      "id": 2,
      "fullName": "Ana Garcia"
    },
    {
      "id": 3,
      "fullName": "Luis Mendoza"
    },
    {
      "id": 4,
      "fullName": "Maria Torres"
    }
  ],
  "shipments": [
    {
      "id": "ENV-001",
      "destination": "Lima",
      "status": "in-transit",
      "driver": "Carlos Ruiz",
      "cargoDescription": "Fresh dairy products",
      "temperature": 22.5,
      "humidity": 45,
      "departureDate": "2026-04-21T08:00",
      "estimatedArrival": "2026-04-22T14:30",
      "actualArrival": null,
      "alertsCount": 2
    },
    {
      "id": "ENV-002",
      "destination": "Arequipa",
      "status": "in-transit",
      "driver": "Ana Garcia",
      "cargoDescription": "Frozen vegetables",
      "temperature": 21.8,
      "humidity": 50,
      "departureDate": "2026-04-21T09:00",
      "estimatedArrival": "2026-04-23T09:15",
      "actualArrival": null,
      "alertsCount": 1
    },
    {
      "id": "ENV-003",
      "destination": "Trujillo",
      "status": "completed",
      "driver": "Luis Mendoza",
      "cargoDescription": "Pharmaceutical products",
      "temperature": 23.1,
      "humidity": 48,
      "departureDate": "2026-04-18T08:00",
      "estimatedArrival": "2026-04-20T16:00",
      "actualArrival": "2026-04-20T16:00",
      "alertsCount": 0
    },
    {
      "id": "ENV-004",
      "destination": "Cusco",
      "status": "pending",
      "driver": "Maria Torres",
      "cargoDescription": "Vaccines",
      "temperature": null,
      "humidity": null,
      "departureDate": "2026-04-23T07:30",
      "estimatedArrival": "2026-04-24T11:00",
      "actualArrival": null,
      "alertsCount": 0
    },
    {
      "id": "ENV-005",
      "destination": "Chiclayo",
      "status": "completed",
      "driver": "Maria Torres",
      "cargoDescription": "Sensitive vaccines",
      "temperature": 22.5,
      "humidity": 45,
      "departureDate": "2026-04-15T10:00",
      "estimatedArrival": "2026-04-17T14:30",
      "actualArrival": "2026-04-17T14:30",
      "alertsCount": 2
    },
    {
      "id": "ENV-006",
      "destination": "Piura",
      "status": "pending",
      "driver": "Luis Mendoza",
      "cargoDescription": "Carga de Pescado. ",
      "temperature": null,
      "humidity": null,
      "departureDate": "2026-05-10T15:00",
      "estimatedArrival": "2026-05-12T15:00",
      "actualArrival": null,
      "alertsCount": 0
    }
  ],
  "sensors": [
    {
      "id": "SENS-A123",
      "status": "assigned",
      "shipmentId": "ENV-001",
      "lastReading": "2026-04-21T16:30",
      "temperature": 22.5,
      "humidity": 45
    },
    {
      "id": "SENS-B456",
      "status": "available",
      "shipmentId": null,
      "lastReading": null,
      "temperature": null,
      "humidity": null
    },
    {
      "id": "SENS-C789",
      "status": "available",
      "shipmentId": null,
      "lastReading": null,
      "temperature": null,
      "humidity": null
    },
    {
      "id": "SENS-D012",
      "status": "assigned",
      "shipmentId": "ENV-002",
      "lastReading": "2026-04-21T16:28",
      "temperature": 21.8,
      "humidity": 50
    }
  ],
  "alerts": [
    {
      "id": "ALT-001",
      "shipmentId": "ENV-001",
      "type": "temperature",
      "severity": "critical",
      "status": "active",
      "message": "Temperature outside the allowed range: 28.5 C (maximum: 25 C)",
      "value": "28.5 C",
      "limit": "25 C",
      "createdAt": "2026-04-21T15:45"
    },
    {
      "id": "ALT-002",
      "shipmentId": "ENV-002",
      "type": "humidity",
      "severity": "warning",
      "status": "active",
      "message": "High humidity detected: 75% (recommended maximum: 60%)",
      "value": "75%",
      "limit": "60%",
      "createdAt": "2026-04-21T14:30"
    },
    {
      "id": "ALT-003",
      "shipmentId": "ENV-001",
      "type": "temperature",
      "severity": "warning",
      "status": "resolved",
      "message": "Temperature close to limit: 24.8 C",
      "value": "24.8 C",
      "limit": "25 C",
      "createdAt": "2026-04-21T12:15"
    },
    {
      "id": "ALT-004",
      "shipmentId": "ENV-002",
      "type": "sensor",
      "severity": "critical",
      "status": "resolved",
      "message": "Connection loss with sensor SENS-B456",
      "value": "-",
      "limit": "-",
      "createdAt": "2026-04-21T10:20"
    },
    {
      "id": "ALT-005",
      "shipmentId": "ENV-001",
      "type": "temperature",
      "severity": "critical",
      "status": "resolved",
      "message": "Critical temperature detected: 30.2 C",
      "value": "30.2 C",
      "limit": "25 C",
      "createdAt": "2026-04-20T18:00"
    }
  ]
};
