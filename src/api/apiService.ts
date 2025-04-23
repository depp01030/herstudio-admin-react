import { API_BASE_URL } from '../config/constants';

// 調試模式：設置為 false 時使用真實 API，設置為 true 時使用模擬數據
const DEBUG_MODE = false;

// API 路徑前綴
const API_PREFIX = '/admin';

// 模擬數據儲存 - 初始為空列表
let MOCK_PRODUCTS = [];

// 模擬類別列表
const MOCK_CATEGORIES = ['女性上著', '女性下著', '洋裝', '外套', '裙子', '褲子', '配飾', '圍巾', '其他'];

/**
 * 模擬 API 響應
 */
const mockResponse = <T>(data: T, delay = 500): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data);
    }, delay);
  });
};

/**
 * 處理 API 響應
 */
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    // 處理錯誤
    try {
      const error = await response.json();
      throw new Error(error.message || `API 請求失敗: ${response.status}`);
    } catch (e) {
      throw new Error(`API 請求失敗: ${response.status} ${response.statusText}`);
    }
  }
  return response.json();
};

/**
 * API 服務基本類
 */
const apiService = {
  get: async <T>(endpoint: string, params = {}): Promise<T> => {
    try {
      const queryString = new URLSearchParams(params as Record<string, string>).toString();
      const url = `${API_BASE_URL}${API_PREFIX}${endpoint}${queryString ? `?${queryString}` : ''}`;
      
      console.log(`GET 請求: ${url}`);
      
      // 嘗試從真實 API 獲取數據
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 如需添加授權令牌
          // 'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error(`API 請求失敗 (${endpoint}):`, error);
      
      // 如果在調試模式下且 API 不可用，則返回模擬數據
      if (DEBUG_MODE) {
        console.warn('使用模擬數據...');
        
        if (endpoint === '/products') {
          // 模擬產品列表分頁和搜索功能
          let filteredProducts = [...MOCK_PRODUCTS];
          const { search, category, sortBy, order, page = 1, pageSize = 10 } = params as any;
          
          if (search) {
            const searchLower = search.toLowerCase();
            filteredProducts = filteredProducts.filter(p => 
              p.name.toLowerCase().includes(searchLower) || 
              p.description.toLowerCase().includes(searchLower)
            );
          }
          
          if (category) {
            filteredProducts = filteredProducts.filter(p => p.category === category);
          }
          
          if (sortBy) {
            filteredProducts.sort((a, b) => {
              const aValue = a[sortBy];
              const bValue = b[sortBy];
              
              if (typeof aValue === 'string') {
                return order === 'desc' 
                  ? bValue.localeCompare(aValue) 
                  : aValue.localeCompare(bValue);
              }
              
              return order === 'desc' ? bValue - aValue : aValue - bValue;
            });
          }
          
          // 計算分頁
          const startIndex = (page - 1) * pageSize;
          const paginatedProducts = filteredProducts.slice(startIndex, startIndex + pageSize);
          
          return mockResponse({ 
            items: paginatedProducts, 
            total: filteredProducts.length 
          } as unknown as T);
        }
        
        if (endpoint === '/product-categories') {
          return mockResponse(MOCK_CATEGORIES as unknown as T);
        }
        
        if (endpoint.startsWith('/products/')) {
          const id = endpoint.split('/')[2];
          const product = MOCK_PRODUCTS.find(p => p.id === id);
          
          if (product) {
            return mockResponse(product as unknown as T);
          }
        }
      }
      
      throw error;
    }
  },
  
  post: async <T>(endpoint: string, data = {}): Promise<T> => {
    try {
      console.log(`POST 請求: ${API_BASE_URL}${API_PREFIX}${endpoint}`, data);
      
      const response = await fetch(`${API_BASE_URL}${API_PREFIX}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify(data),
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error(`API 請求失敗 (${endpoint}):`, error);
      
      // 如果在調試模式下且 API 不可用，則返回模擬數據
      if (DEBUG_MODE) {
        console.warn('使用模擬數據...');
        
        if (endpoint === '/products') {
          // 模擬產品創建
          const newProduct = {
            id: String(Date.now()),
            ...(data as object),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          MOCK_PRODUCTS.push(newProduct as any);
          return mockResponse(newProduct as unknown as T);
        }
      }
      
      throw error;
    }
  },
  
  put: async <T>(endpoint: string, data = {}): Promise<T> => {
    try {
      console.log(`PUT 請求: ${API_BASE_URL}${API_PREFIX}${endpoint}`, data);
      
      const response = await fetch(`${API_BASE_URL}${API_PREFIX}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify(data),
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error(`API 請求失敗 (${endpoint}):`, error);
      
      // 如果在調試模式下且 API 不可用，則返回模擬數據
      if (DEBUG_MODE) {
        console.warn('使用模擬數據...');
        
        if (endpoint.startsWith('/products/')) {
          const id = endpoint.split('/')[2];
          const index = MOCK_PRODUCTS.findIndex(p => p.id === id);
          
          if (index !== -1) {
            MOCK_PRODUCTS[index] = {
              ...MOCK_PRODUCTS[index],
              ...(data as object),
              updatedAt: new Date().toISOString()
            };
            return mockResponse(MOCK_PRODUCTS[index] as unknown as T);
          }
        }
      }
      
      throw error;
    }
  },
  
  delete: async <T>(endpoint: string): Promise<T> => {
    try {
      console.log(`DELETE 請求: ${API_BASE_URL}${API_PREFIX}${endpoint}`);
      
      const response = await fetch(`${API_BASE_URL}${API_PREFIX}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error(`API 請求失敗 (${endpoint}):`, error);
      
      // 如果在調試模式下且 API 不可用，則返回模擬數據
      if (DEBUG_MODE) {
        console.warn('使用模擬數據...');
        
        if (endpoint.startsWith('/products/')) {
          const id = endpoint.split('/')[2];
          MOCK_PRODUCTS = MOCK_PRODUCTS.filter(p => p.id !== id);
          return mockResponse({ success: true } as unknown as T);
        }
      }
      
      throw error;
    }
  },
};

export default apiService;