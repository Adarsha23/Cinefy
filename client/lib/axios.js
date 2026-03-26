// client/src/lib/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api',
  withCredentials: true,
});


// Automatically attach token to every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor for global error handling and auto-refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const { status } = error.response || {};
    
    // Catch 401 for token expiry and auto-refresh
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await api.post('/auth/refresh', {}, { withCredentials: true });
        const { token } = res.data;
        
        // Save new token
        localStorage.setItem('token', token);
        
        // Update original request with new token
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Refresh failed, redirecting to login.");
        localStorage.removeItem('token');
        if (typeof window !== 'undefined') window.location.href = '/login';
      }
    }
    
    // Catch 500 server errors
    if (status >= 500) {
      alert(`Server Error: ${error.response?.data?.message || "Something went wrong"}`);
    }
    
    return Promise.reject(error);
  }
);

export default api;
