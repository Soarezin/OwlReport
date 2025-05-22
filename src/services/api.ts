import axios from 'axios';

const api = axios.create({
  baseURL: 'https://2490-2804-14d-2ca0-85cd-b068-d3d-2d5c-b749.ngrok-free.app/',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    config.headers['ngrok-skip-browser-warning'] = 'true';
  }
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);


export default api;