import apiService from '../apiService';
import { DEFAULT_PRODUCT_CATEGORIES } from '@/config/defaults';
import { Product, ProductQueryParams } from '@/types/product';

const ADMIN_PRODUCT_ROUTE = '/api/admin/products';

const adminProductApi = {
  getProducts: async (params: ProductQueryParams = {}) => {
    const res = await apiService.get<{ items: Product[]; total: number }>(ADMIN_PRODUCT_ROUTE, { params });
    return res;
  },

  getProductById: async (id: number) => {
    return await apiService.get<Product>(`${ADMIN_PRODUCT_ROUTE}/${id}`);
  },

  createProduct: async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    return await apiService.post<Product>(ADMIN_PRODUCT_ROUTE, product);
  },

  updateProduct: async (id: number, product: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>) => {
    return await apiService.put<Product>(`${ADMIN_PRODUCT_ROUTE}/${id}`, product);
  },

  deleteProduct: (id: number) =>
    apiService.delete<void>(`${ADMIN_PRODUCT_ROUTE}/${id}`),

  batchDelete: (ids: number[]) =>
    apiService.post(`${ADMIN_PRODUCT_ROUTE}/batch-delete`, ids),

  getCategories: async () => {
    try {
      const categories = await apiService.get<string[]>('/product-categories');
      return categories;
    } catch (error) {
      console.warn('無法從 API 獲取產品類別，使用預設類別列表', error);
      return DEFAULT_PRODUCT_CATEGORIES;
    }
  },
};

export default adminProductApi;
