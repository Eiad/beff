import axios from 'axios';
import { API_URL, BEFF_AUTH_TOKEN } from '../constants';

const api = axios.create({ baseURL: API_URL });

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(BEFF_AUTH_TOKEN);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401 → clear token + force redirect to login
api.interceptors.response.use(
  (res) => res,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      localStorage.removeItem(BEFF_AUTH_TOKEN);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default api;
