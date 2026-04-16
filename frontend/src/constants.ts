// Single source of truth for the localStorage token key
export const BEFF_AUTH_TOKEN = 'beff_auth_token';

export const API_URL = import.meta.env.VITE_API_URL
  ?? (import.meta.env.PROD ? '/_/backend' : 'http://localhost:3001');
