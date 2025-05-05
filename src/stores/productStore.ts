import { create } from 'zustand';
import { Product, ProductQueryParams } from '@/types/product';

interface ProductStore {
  items: Product[];
  filters: ProductQueryParams;
  page: number;
  pageSize: number;
  hasMore: boolean;
  loading: boolean;
  error: string | null;

  // setter only
  setItems: (items: Product[] | ((prev: Product[]) => Product[])) => void;
  setFilters: (filters: ProductQueryParams) => void;
  setPage: (page: number) => void;
  setHasMore: (hasMore: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (msg: string | null) => void;
  removeItemById: (id: number) => void;
  addProduct: (product: Product) => void;
}

const useProductStore = create<ProductStore>((set) => ({
  items: [],
  filters: {},
  page: 1,
  pageSize: 10,
  hasMore: true,
  loading: false,
  error: null,

  setItems: (items) =>
    set((state) => ({
      items: typeof items === 'function' ? items(state.items) : items,
    })),

  setFilters: (filters) => set({ filters }),
  setPage: (page) => set({ page }),
  setHasMore: (hasMore) => set({ hasMore }),
  setLoading: (loading) => set({ loading }),
  setError: (msg) => set({ error: msg }),

  removeItemById: (id) =>
    set((state) => ({
      items: state.items.filter((p) => p.id !== id),
    })),

  addProduct: (product) =>
    set((state) => ({
      items: [product, ...state.items],
    })),
}));

export default useProductStore;
