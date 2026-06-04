import apiClient from '../api/axiosClient';

/**
 * Auth API calls. The backend returns { accessToken, tokenType, user }.
 */
export const authService = {
  login: (email, password) =>
    apiClient.post('/auth/login', { email, password }).then((res) => res.data),

  register: (payload) =>
    apiClient.post('/auth/register', payload).then((res) => res.data),
};
