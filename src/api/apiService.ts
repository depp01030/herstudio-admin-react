import { API_BASE_URL } from '@/config/constants';
import caseConverter from '@/utils/caseConverter';

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
  if (!text) return {}; // 處理空白回應

  try {
    const json = JSON.parse(text);
    return caseConverter.toCamelCase(json);
  } catch (e) {
    console.error('❌ JSON parse 錯誤：', e);
    throw new Error('API 回傳格式錯誤');
  }
};

// ✅ 預設所有 fetch 都帶上 cookie
const DEFAULT_FETCH_OPTIONS: RequestInit = {
  credentials: 'include',
};

const apiService = {
  get: async <T>(
    endpoint: string,
    config: { params?: Record<string, any> } = {}
  ): Promise<T> => {
    const queryString = config.params
      ? '?' + new URLSearchParams(config.params as any).toString()
      : '';
    const response = await fetch(`${API_BASE_URL}${endpoint}${queryString}`, {
      ...DEFAULT_FETCH_OPTIONS,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse(response);
  },

  post: async <T>(
    endpoint: string,
    data: any,
    config: { headers?: HeadersInit } = {}
  ): Promise<T> => {
    const isFormData = data instanceof FormData;
    const body = isFormData ? data : JSON.stringify(caseConverter.toSnakeCase(data));

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...DEFAULT_FETCH_OPTIONS,
      method: 'POST',
      headers: isFormData
        ? undefined
        : {
            'Content-Type': 'application/json',
            ...(config.headers || {}),
          },
      body,
    });

    return handleResponse(response);
  },

  put: async <T>(endpoint: string, data = {}): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...DEFAULT_FETCH_OPTIONS,
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(caseConverter.toSnakeCase(data)),
    });
    return handleResponse(response);
  },

  patch: async <T>(endpoint: string, data = {}): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...DEFAULT_FETCH_OPTIONS,
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(caseConverter.toSnakeCase(data)),
    });
    return handleResponse(response);
  },

  delete: async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...DEFAULT_FETCH_OPTIONS,
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse(response);
  },
};

export default apiService;
