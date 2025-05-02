import apiService from '../apiService';
import { DEFAULT_PRODUCT_CATEGORIES } from '@/config/defaults';
import { Product, ProductQueryParams } from '@/types/product';
import { fromApiProduct, toApiProduct } from '@/utils/normalize';

const ADMIN_PRODUCT_ROUTE = '/api/admin/products';

const adminProductApi = {
  getProducts: async (params: ProductQueryParams = {}) => {
    const res = await apiService.get<{ items: any[]; total: number }>(ADMIN_PRODUCT_ROUTE, { params });
    return {
      items: res.items.map(fromApiProduct),
      total: res.total,
    };
  },

  getProductById: async (id: number) => {
    const res = await apiService.get<any>(`${ADMIN_PRODUCT_ROUTE}/${id}`);
    return fromApiProduct(res);
  },

  createProduct: async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const res = await apiService.post<any>(ADMIN_PRODUCT_ROUTE, toApiProduct(product));
    return fromApiProduct(res);
  },

  updateProduct: async (id: number, product: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>) => {
    const res = await apiService.put<any>(`${ADMIN_PRODUCT_ROUTE}/${id}`, toApiProduct(product));
    return fromApiProduct(res);
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
