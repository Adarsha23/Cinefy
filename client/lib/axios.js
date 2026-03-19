// client/src/lib/axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api', // port of the express server   
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

export default api;
