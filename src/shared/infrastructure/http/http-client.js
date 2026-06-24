/**
 * @summary Configures the axios client used by infrastructure services.
 * @author FreshGuard
 */
import axios from 'axios';
import { clearSession, readSession } from './session-storage.js';

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

httpClient.interceptors.request.use((config) => {
  const token = readSession()?.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.url?.includes('/authentication/sign-in')) {
      clearSession();
      if (!window.location.pathname.endsWith('/sign-in')) window.location.assign(`${import.meta.env.BASE_URL}sign-in`);
    }
    return Promise.reject(error);
  }
);
