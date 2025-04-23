import apiService from './apiService';
import { PRODUCT_CATEGORIES } from '../config/constants';

// 產品數據類型定義
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  // 擴展字段
  material?: string;
  sizeDescription?: string;
  availableColors?: string[];
  availableSizes?: string[];
  relativeFolderPath?: string;
}

// 產品列表查詢參數
export interface ProductQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  category?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

// 產品 API 服務
const productApi = {
  /**
   * 獲取產品列表
   */
  getProducts: (params: ProductQueryParams = {}) => {
    return apiService.get<{ items: Product[], total: number }>('/products', params);
  },

  /**
   * 獲取單個產品詳情
   */
  getProductById: (id: string) => {
    return apiService.get<Product>(`/products/${id}`);
  },

  /**
   * 創建新產品
   */
  createProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    return apiService.post<Product>('/products/create', product);
  },

  /**
   * 更新產品
   */
  updateProduct: (id: string, product: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>) => {
    return apiService.put<Product>(`/products/${id}`, product);
  },

  /**
   * 刪除產品
   */
  deleteProduct: (id: string) => {
    return apiService.delete<{ success: boolean }>(`/products/${id}`);
  },

  /**
   * 獲取產品類別列表
   * 如果 API 調用失敗，則返回預設類別列表
   */
  getCategories: async () => {
    try {
      const categories = await apiService.get<string[]>('/product-categories');
      return categories;
    } catch (error) {
      console.warn('無法從 API 獲取產品類別，使用預設類別列表', error);
      return PRODUCT_CATEGORIES;
    }
  }
};

export default productApi;