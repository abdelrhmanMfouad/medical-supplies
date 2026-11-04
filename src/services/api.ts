import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Add token to all requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('medical_inventory_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// ✅ Handle response errors (عدل عشان متعملش redirect لو في error)
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // ✅ متعملش redirect لو في error عشان نعرف نشوف الـ error
    return Promise.reject(error);
  }
);

export default api;