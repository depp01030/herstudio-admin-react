import axiosInstance from '../axiosInstance';
import { Product, ProductQueryParams } from '@/types/product';
import { productTypeLabelMap } from '@/config/productFieldDefaults';
import { ADMIN_PRODUCT_ROUTE, PRODUCT_CATEGORY_ROUTE } from '@/config/constants';

import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';

const adminProductApi = {
  getProducts: async (params: ProductQueryParams = {}) => {
    const snakeParams = snakecaseKeys(params as Record<string, unknown>, { deep: true });
    const res = await axiosInstance.get(ADMIN_PRODUCT_ROUTE, { params: snakeParams });

    const data = camelcaseKeys(res.data, { deep: true }) as {
      items: Product[];
      total: number;
    };

    return data;
  },

  getProductById: async (id: number) => {
    const res = await axiosInstance.get(`${ADMIN_PRODUCT_ROUTE}/${id}`);
    return camelcaseKeys(res.data, { deep: true }) as Product;
  },

  createProduct: async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const payload = snakecaseKeys(product, { deep: true });
    const res = await axiosInstance.post(ADMIN_PRODUCT_ROUTE, payload);
    return camelcaseKeys(res.data, { deep: true }) as Product;
  },

  updateProduct: async (
    id: number,
    product: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>
  ) => {
    const payload = snakecaseKeys(product, { deep: true });
    const res = await axiosInstance.put(`${ADMIN_PRODUCT_ROUTE}/${id}`, payload);
    return camelcaseKeys(res.data, { deep: true }) as Product;
  },

  deleteProduct: (id: number) =>
    axiosInstance.delete<void>(`${ADMIN_PRODUCT_ROUTE}/${id}`),

  batchDelete: (ids: number[]) =>
    axiosInstance.post(`${ADMIN_PRODUCT_ROUTE}/batch-delete`, ids),

  getCategories: async () => {
    try {
      const res = await axiosInstance.get(PRODUCT_CATEGORY_ROUTE);
      return res.data as string[];
    } catch (error) {
      console.warn('無法從 API 獲取產品類別，使用預設類別列表', error);
      return productTypeLabelMap;
    }
  },
};

export default adminProductApi;
