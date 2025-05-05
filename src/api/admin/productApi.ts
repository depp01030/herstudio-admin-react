import apiService from '../apiService';
import { Product, ProductQueryParams } from '@/types/product';
import { productTypeLabelMap } from '@/config/productFieldDefaults';

import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';

const ADMIN_PRODUCT_ROUTE = '/api/admin/products';

const adminProductApi = {
  getProducts: async (params: ProductQueryParams = {}) => {
    const snakeParams = snakecaseKeys(params as Record<string, unknown>, { deep: true });

    const res = await apiService.get<{ items: any[]; total: number }>(
      ADMIN_PRODUCT_ROUTE,
      { params: snakeParams }
    );

    return {
      ...res,
      items: res.items.map((item) => camelcaseKeys(item, { deep: true })) as Product[],
    };
  },

  getProductById: async (id: number) => {
    const res = await apiService.get<any>(`${ADMIN_PRODUCT_ROUTE}/${id}`);
    return camelcaseKeys(res, { deep: true }) as Product;
  },

  createProduct: async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const payload = snakecaseKeys(product, { deep: true });
    const res = await apiService.post<any>(ADMIN_PRODUCT_ROUTE, payload);
    return camelcaseKeys(res, { deep: true }) as Product;
  },

  updateProduct: async (
    id: number,
    product: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>
  ) => {
    const payload = snakecaseKeys(product, { deep: true });
    const res = await apiService.put<any>(`${ADMIN_PRODUCT_ROUTE}/${id}`, payload);
    return camelcaseKeys(res, { deep: true }) as Product;
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
      return productTypeLabelMap;
    }
  },
};

export default adminProductApi;
