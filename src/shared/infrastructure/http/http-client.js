/**
 * @summary Configures the axios client used by infrastructure services.
 * @author Codex Assistant
 */
import axios from 'axios';

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});
