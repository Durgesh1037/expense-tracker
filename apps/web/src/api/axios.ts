import axios from 'axios';
import { getCookieToken } from '../utils/cookiesToken';

// Create an Axios instance
const token=getCookieToken("accessToken");
console.log("token",token);
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
    'Authorization':`Bearer ${token}`
  },
  withCredentials: true, // if you use cookies for auth
});

// Request interceptor: add auth token if available
api.interceptors.request.use(
  (config) => {
    // Example: attach token from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle errors globally
let isRefreshing = false;
let failedQueue: any[] = [];

function processQueue(error: any, token: string | null = null) {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data &&
      error.response.data.error === 'jwt expired' &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const res = await api.post('/auth/refresh');
        const { accessToken } = res.data;
        localStorage.setItem('token', accessToken);
        api.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;
        processQueue(null, accessToken);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // Optionally redirect to login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
