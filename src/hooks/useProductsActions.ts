// src/hooks/useProductActions.ts

import { useCallback } from 'react';
import { ProductQueryParams, Product } from '@/types/product';
import adminProductApi from '@/api/admin/productApi';
import useProductStore from '@/stores/productStore';

export function useProductActions() {
  const {
    setItems,
    setLoading,
    setError,
    setHasMore,
    filters,
    page,
    pageSize,
    setPage,
    setFilters: updateFilters,
  } = useProductStore();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminProductApi.getProducts({ ...filters, page, pageSize });
      setItems(res.items);
      setHasMore(res.items.length === pageSize);
    } catch (err: any) {
      setError(err.message || '資料載入失敗');
    } finally {
      setLoading(false);
    }
  }, [filters, page, pageSize, setItems, setHasMore, setLoading, setError]);

  const appendProducts = useCallback(async () => {
    const nextPage = page + 1;
    setLoading(true);
    setError(null);
    try {
      const res = await adminProductApi.getProducts({ ...filters, page: nextPage, pageSize });
      setItems((prev) => [...prev, ...res.items]);
      setPage(nextPage);
      setHasMore(res.items.length === pageSize);
    } catch (err: any) {
      setError(err.message || '載入更多資料失敗');
    } finally {
      setLoading(false);
    }
  }, [filters, page, pageSize, setItems, setPage, setHasMore, setLoading, setError]);

  const setFilters = (newFilters: Partial<ProductQueryParams>) => {
    updateFilters({ ...filters, ...newFilters });
    setPage(1);
  };

  const resetFilters = () => {
    updateFilters({});
    setPage(1);
  };

  return {
    fetchProducts,
    appendProducts,
    setFilters,
    resetFilters,
  };
}
