// src/api/apiService.ts
import { API_BASE_URL } from '@/config/constants';
import caseConverter from '@/utils/caseConverter';

// --------- 處理回應 ---------
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    try {
      const error = await response.json();
      throw new Error(error.message || `API 請求失敗: ${response.status}`);
    } catch (e) {
      throw new Error(`API 請求失敗: ${response.status} ${response.statusText}`);
    }
  }

  const text = await response.text();
  if (!text) return {}; // ✅ 處理 204 空 body

  try {
    const json = JSON.parse(text);
    return caseConverter.toCamelCase(json);
  } catch (e) {
    console.error('❌ JSON parse 錯誤：', e);
    throw new Error('API 回傳格式錯誤');
  }
};

// --------- 核心 Service ---------
const apiService = {
  get: async <T>(endpoint: string, config: { params?: Record<string, any>; withCredentials?: boolean } = {}): Promise<T> => {
    const queryString = config.params
      ? '?' + new URLSearchParams(config.params as any).toString()
      : '';
    const response = await fetch(`${API_BASE_URL}${endpoint}${queryString}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: config.withCredentials ? 'include' : 'same-origin',
    });
    return handleResponse(response);
  },

  post: async <T>(
    endpoint: string,
    data: any,
    config: { headers?: HeadersInit; withCredentials?: boolean } = {}
  ): Promise<T> => {
    const isFormData = data instanceof FormData;
    const body = isFormData ? data : JSON.stringify(caseConverter.toSnakeCase(data));

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: isFormData
        ? undefined
        : {
            'Content-Type': 'application/json',
            ...(config.headers || {}),
          },
      credentials: config.withCredentials ? 'include' : 'same-origin',
      body,
    });

    return handleResponse(response);
  },

  put: async <T>(endpoint: string, data = {}): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(caseConverter.toSnakeCase(data)),
    });
    return handleResponse(response);
  },

  patch: async <T>(endpoint: string, data = {}): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(caseConverter.toSnakeCase(data)),
    });
    return handleResponse(response);
  },

  delete: async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse(response);
  },
};

export default apiService;
