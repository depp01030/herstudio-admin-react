// src/stores/productStore.ts

import { create } from 'zustand';
import { Product, ProductQueryParams } from '@/types/product';
import adminProductApi from '@/api/admin/productApi';

interface ProductStore {
  items: Product[];
  filters: ProductQueryParams;
  page: number;
  pageSize: number;
  hasMore: boolean;
  loading: boolean;
  error: string | null;

  fetch: () => Promise<void>;
  append: () => Promise<void>;
  setFilters: (filters: Partial<ProductQueryParams>) => void;
  resetFilters: () => void;
  update: (id: number, data: Partial<Product>) => Promise<void>;
  remove: (id: number) => Promise<void>;
}

const useProductStore = create<ProductStore>((set, get) => ({
  items: [],
  filters: {},
  page: 1,
  pageSize: 10,
  hasMore: true,
  loading: false,
  error: null,

  async fetch() {
    const { filters, page, pageSize } = get();
    set({ loading: true, error: null });
    try {
      const res = await adminProductApi.getProducts({ ...filters, page, pageSize });
      set({ items: res.items, hasMore: res.items.length === pageSize });
    } catch (err: any) {
      set({ error: err.message || '資料載入失敗' });
    } finally {
      set({ loading: false });
    }
  },

  async append() {
    const { filters, page, pageSize, items } = get();
    const nextPage = page + 1;
    set({ loading: true, error: null });
    try {
      const res = await adminProductApi.getProducts({ ...filters, page: nextPage, pageSize });
      set({
        items: [...items, ...res.items],
        page: nextPage,
        hasMore: res.items.length === pageSize,
      });
    } catch (err: any) {
      set({ error: err.message || '載入更多資料失敗' });
    } finally {
      set({ loading: false });
    }
  },

  setFilters(newFilters) {
    set({ filters: { ...get().filters, ...newFilters }, page: 1 });
    get().fetch();
  },

  resetFilters() {
    set({ filters: {}, page: 1 });
    get().fetch();
  },

  async update(id, data) {
    try {
      const updated = await adminProductApi.updateProduct(id, data);
      set((state) => ({
        items: state.items.map((item) => (item.id === id ? updated : item)),
      }));
    } catch (err) {
      console.error('更新失敗', err);
    }
  },

  async remove(id) {
    try {
      await adminProductApi.deleteProduct(id);
      set((state) => ({ items: state.items.filter((item) => item.id !== id) }));
    } catch (err) {
      console.error('刪除失敗', err);
    }
  },
}));

export default useProductStore;
