// src/api/axiosInstance.ts
import axios from 'axios';
import { API_BASE_URL } from '@/config/constants';
import { useAuthStore } from '@/stores/authStore';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'ngrok-skip-browser-warning': 'true',
    // ✅ 不要預設 Content-Type，讓各請求動態設定
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

export default axiosInstance;
