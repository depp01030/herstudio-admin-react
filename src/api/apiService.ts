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
  const json = await response.json();
  return caseConverter.toCamelCase(json);
};

// --------- 核心 Service ---------
const apiService = {
  get: async <T>(endpoint: string, config: { params?: Record<string, any> } = {}): Promise<T> => {
    const queryString = config.params
      ? '?' + new URLSearchParams(config.params as any).toString()
      : '';
    const response = await fetch(`${API_BASE_URL}${endpoint}${queryString}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return handleResponse(response);
  },

  post: async <T>(endpoint: string, data: any, config?: { headers?: HeadersInit }): Promise<T> => {
    const isFormData = data instanceof FormData;
    const body = isFormData ? data : JSON.stringify(caseConverter.toSnakeCase(data));

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: isFormData ? undefined : {
        'Content-Type': 'application/json',
        ...(config?.headers || {}),
      },
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
