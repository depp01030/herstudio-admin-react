import { API_BASE_URL } from '@/config/constants';
import caseConverter from '@/utils/caseConverter';
import { useAuthStore } from '@/stores/authStore';

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

// ✅ 自動加 Authorization header
const getAuthHeaders = (): HeadersInit => {
  const token = useAuthStore.getState().accessToken;
  return {
    'ngrok-skip-browser-warning': 'true',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
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
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
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
      method: 'POST',
      headers: isFormData
        ? {
            ...getAuthHeaders(),
          }
        : {
            'Content-Type': 'application/json',
            ...getAuthHeaders(),
            ...(config.headers || {}),
          },
      body,
    });

    return handleResponse(response);
  },

  put: async <T>(endpoint: string, data = {}): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(caseConverter.toSnakeCase(data)),
    });
    return handleResponse(response);
  },

  patch: async <T>(endpoint: string, data = {}): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(caseConverter.toSnakeCase(data)),
    });
    return handleResponse(response);
  },

  delete: async <T>(endpoint: string): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    });
    return handleResponse(response);
  },
};

export default apiService;
