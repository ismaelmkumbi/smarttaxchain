// src/services/api.js
import axios from 'axios';
import { getToken } from './authService';

const API_BASE_URL = 'http://localhost:3000/'; // Replace with your actual API URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token to every request if available
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('✅ Token attached to request:', config.url);
    } else {
      console.warn('⚠️ No token found for request:', config.url);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      return Promise.reject({
        status: error.response.status,
        success: error.response.data?.success ?? false,
        message: error.response.data?.error || error.response.data?.message || 'An error occurred',
        context: error.response.data?.context || 'Unknown context',
      });
    } else if (error.request) {
      return Promise.reject({
        status: 0,
        message: 'No response from server',
        context: 'NoServerResponse',
      });
    } else {
      return Promise.reject({
        status: 0,
        message: error.message || 'Unexpected error',
        context: 'RequestSetupError',
      });
    }
  },
);

export default api;
