import axios from 'axios';
import { CONFIG } from '../global-config';

/**
 * Axios instance with default config
 * Automatically adds auth token to requests
 */
const axiosInstance = axios.create({
  baseURL: CONFIG.api.baseURL,
  timeout: CONFIG.api.timeout,
});

/**
 * Request interceptor - Add auth token
 */
axiosInstance.interceptors.request.use(
  (config) => {
    // In a real app, get token from auth context
    // For this challenge, we'll use a mock token
    const token = 'mock-access-token';

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor - Handle errors
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log errors for debugging
    console.error('[Axios Error]:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;













