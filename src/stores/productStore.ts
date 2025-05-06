// src/stores/productStore.ts
import { create } from 'zustand';
import { Product, ProductQueryParams } from '@/types/product';

interface ProductStore {
  productMap: Record<string | number, Product>;
  productIds: (string | number)[];

  filters: ProductQueryParams;
  page: number;
  pageSize: number;
  hasMore: boolean;
  loading: boolean;
  error: string | null;

  // getters
  getAllProducts: () => Product[];

  // setters
  setProducts: (products: Product[]) => void;
  appendProducts: (products: Product[]) => void;
  addProduct: (product: Product) => void;
  removeProduct: (id: string | number) => void;
  updateProductField: (id: string | number, key: keyof Product, value: any) => void;
  updateProductById: (id: string | number, product: Partial<Product>) => void;
  rebindProductId: (oldId: string | number, newId: number) => void;

  // misc
  setFilters: (filters: ProductQueryParams) => void;
  setPage: (page: number) => void;
  setHasMore: (hasMore: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (msg: string | null) => void;
}

const useProductStore = create<ProductStore>((set, get) => ({
  productMap: {},
  productIds: [],

  filters: {},
  page: 1,
  pageSize: 10,
  hasMore: true,
  loading: false,
  error: null,

  getAllProducts: () => {
    const { productMap, productIds } = get();
    return productIds.map((id) => productMap[id]).filter(Boolean);
  },

  setProducts: (products) => {
    const map = Object.fromEntries(products.map((p) => [p.id, p]));
    const ids = products.map((p) => p.id);
    set({ productMap: map, productIds: ids });
  },

  appendProducts: (products) => {
    set((state) => {
      const newMap = { ...state.productMap };
      const newIds: (string | number)[] = [];

      for (const p of products) {
        newMap[p.id] = p;
        if (!state.productIds.includes(p.id)) {
          newIds.push(p.id);
        }
      }

      return {
        productMap: newMap,
        productIds: [...state.productIds, ...newIds],
      };
    });
  },

  addProduct: (product) => {
    set((state) => ({
      productMap: {
        ...state.productMap,
        [product.id]: product,
      },
      productIds: [product.id, ...state.productIds],
    }));
  },

  removeProduct: (id) => {
    set((state) => {
      const newMap = { ...state.productMap };
      delete newMap[id];

      return {
        productMap: newMap,
        productIds: state.productIds.filter((pid) => pid !== id),
      };
    });
  },

  updateProductField: (id, key, value) => {
    set((state) => {
      const product = state.productMap[id];
      if (!product) return {};
      return {
        productMap: {
          ...state.productMap,
          [id]: {
            ...product,
            [key]: value,
          },
        },
      };
    });
  },

  updateProductById: (id, product) => {
    set((state) => {
      const current = state.productMap[id];
      if (!current) return {};
      return {
        productMap: {
          ...state.productMap,
          [id]: {
            ...current,
            ...product,
          },
        },
      };
    });
  },

  rebindProductId: (oldId, newId) => {
    set((state) => {
      const product = state.productMap[oldId];
      if (!product) return {};

      const newProduct = { ...product, id: newId };
      const newMap = { ...state.productMap };
      delete newMap[oldId];
      newMap[newId] = newProduct;

      const newIds = state.productIds.map((pid) =>
        pid === oldId ? newId : pid
      );

      return {
        productMap: newMap,
        productIds: newIds,
      };
    });
  },

  setFilters: (filters) => set({ filters }),
  setPage: (page) => set({ page }),
  setHasMore: (hasMore) => set({ hasMore }),
  setLoading: (loading) => set({ loading }),
  setError: (msg) => set({ error: msg }),
}));

export default useProductStore;
