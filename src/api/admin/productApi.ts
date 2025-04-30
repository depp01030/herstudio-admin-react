// src/api/admin/productApi.ts

import apiService from '../apiService';
import { DEFAULT_PRODUCT_CATEGORIES } from '@/config/defaults';

import { Product, ProductQueryParams } from '@/types/product';

const ADMIN_PRODUCT_ROUTE = '/api/admin/products';

const adminProductApi = {
  /**
   * 查詢產品清單（GET /api/admin/products）
   */
  getProducts: (params: ProductQueryParams = {}) =>
    apiService.get<{ items: Product[]; total: number }>(ADMIN_PRODUCT_ROUTE, { params }),

  /**
   * 查詢單一產品詳情（GET /api/admin/products/{id}）
   */
  getProductById: (id: number) =>
    apiService.get<Product>(`${ADMIN_PRODUCT_ROUTE}/${id}`),

  /**
   * 建立新產品（POST /api/admin/products）
   */
  createProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) =>
    apiService.post<Product>(ADMIN_PRODUCT_ROUTE, product),

  /**
   * 更新產品（PUT /api/admin/products/{id}）
   */
  updateProduct: (id: number, product: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>) =>
    apiService.put<Product>(`${ADMIN_PRODUCT_ROUTE}/${id}`, product),

  /**
   * 刪除產品（DELETE /api/admin/products/{id}）
   */
  deleteProduct: (id: number) =>
    apiService.delete<void>(`${ADMIN_PRODUCT_ROUTE}/${id}`),

  /**
   * 批次刪除產品（POST /api/admin/products/batch-delete）
   */
  batchDelete: (ids: number[]) =>
    apiService.post<{
      total: number;
      success_count: number;
      failed_count: number;
      failed_ids: number[];
    }>(`${ADMIN_PRODUCT_ROUTE}/batch-delete`, ids),

  /**
   * 取得產品分類列表（GET /product-categories）
   */
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
