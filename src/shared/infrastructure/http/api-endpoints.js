/**
 * @summary Centralizes API endpoint paths configured through Vite environment variables.
 * @author Codex Assistant
 */
export const apiEndpoints = {
  users: import.meta.env.VITE_USERS_ENDPOINT_PATH ?? '/users',
  shipments: import.meta.env.VITE_SHIPMENTS_ENDPOINT_PATH ?? '/shipments',
  drivers: import.meta.env.VITE_DRIVERS_ENDPOINT_PATH ?? '/drivers',
  sensors: import.meta.env.VITE_SENSORS_ENDPOINT_PATH ?? '/sensors',
  alerts: import.meta.env.VITE_ALERTS_ENDPOINT_PATH ?? '/alerts'
};
