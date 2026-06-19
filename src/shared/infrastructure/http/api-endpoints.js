/**
 * @summary Centralizes API endpoint paths configured through Vite environment variables.
 * @author Codex Assistant
 */
export const apiEndpoints = {
  authentication: import.meta.env.VITE_AUTHENTICATION_ENDPOINT_PATH ?? '/api/v1/authentication',
  users: import.meta.env.VITE_USERS_ENDPOINT_PATH ?? '/api/v1/users',
  shipments: import.meta.env.VITE_SHIPMENTS_ENDPOINT_PATH ?? '/api/v1/shipments',
  sensors: import.meta.env.VITE_SENSORS_ENDPOINT_PATH ?? '/api/v1/sensors',
  telemetry: import.meta.env.VITE_TELEMETRY_ENDPOINT_PATH ?? '/api/v1/telemetry',
  alerts: import.meta.env.VITE_ALERTS_ENDPOINT_PATH ?? '/api/v1/alerts',
  analytics: import.meta.env.VITE_ANALYTICS_ENDPOINT_PATH ?? '/api/v1/analytics',
  reports: import.meta.env.VITE_REPORTS_ENDPOINT_PATH ?? '/api/v1/reports'
};
