/**
 * @summary Configures the axios client used by infrastructure services.
 * @author FreshGuard
 */
import axios from 'axios';
import { iamRequestInterceptor, iamUnauthorizedInterceptor } from '../../../iam/infrastructure/iam.interceptor.js';

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

httpClient.interceptors.request.use(iamRequestInterceptor);
httpClient.interceptors.response.use((response) => response, iamUnauthorizedInterceptor);
