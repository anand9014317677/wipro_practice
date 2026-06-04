import axios from 'axios';
import { getToken, clearSession } from '../utils/auth';

/**
 * Shared Axios instance pointed at the Spring Boot backend, with JWT interceptors:
 *  - request: attaches the Bearer token (if present)
 *  - response: on a 401 for an authenticated request, ends the session and
 *    redirects to /login (token expired/invalid). A 401 with no token in
 *    storage (e.g. a failed login attempt) is left for the caller to handle.
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401 && getToken()) {
      clearSession();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
