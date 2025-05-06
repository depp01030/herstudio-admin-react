import { useCallback } from 'react';
import { ProductQueryParams } from '@/types/product';
import adminProductApi from '@/api/admin/productApi';
import useProductStore from '@/stores/productStore';

export function useProductActions() {
  const {
    setProducts,
    appendProducts,
    setLoading,
    setError,
    setHasMore,
    filters,
    page,
    pageSize,
    setPage,
    setFilters: updateFilters,
  } = useProductStore();

  // ✅ 清除 undefined 欄位，避免送出不必要參數
  const sanitizeParams = (params: Record<string, any>) =>
    Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined));

  // ✅ 取得商品資料（覆蓋 productMap）
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const cleanParams = sanitizeParams({ ...filters, page, pageSize });
      const res = await adminProductApi.getProducts(cleanParams);
      setProducts(res.items);
      setHasMore(res.items.length === pageSize);
    } catch (err: any) {
      setError(err.message || '資料載入失敗');
    } finally {
      setLoading(false);
    }
  }, [filters, page, pageSize, setProducts, setHasMore, setLoading, setError]);

  // ✅ 載入更多資料（追加 productMap）
  const appendMoreProducts = useCallback(async () => {
    const nextPage = page + 1;
    setLoading(true);
    setError(null);
    try {
      const cleanParams = sanitizeParams({ ...filters, page: nextPage, pageSize });
      const res = await adminProductApi.getProducts(cleanParams);
      appendProducts(res.items);
      setPage(nextPage);
      setHasMore(res.items.length === pageSize);
    } catch (err: any) {
      setError(err.message || '載入更多資料失敗');
    } finally {
      setLoading(false);
    }
  }, [filters, page, pageSize, appendProducts, setPage, setHasMore, setLoading, setError]);

  // ✅ 設定搜尋條件並 fetch
  const setFilters = (newFilters: Partial<ProductQueryParams>) => {
    updateFilters({ ...filters, ...newFilters });
    setPage(1);
    setTimeout(fetchProducts, 0);
  };

  // ✅ 清空搜尋條件，並根據快取資料量決定是否 fetch
  const resetFilters = () => {
    updateFilters({});
    setPage(1);
    setTimeout(() => {
      const current = Object.values(useProductStore.getState().productMap);
      if (current.length < pageSize) {
        fetchProducts();
      }
    }, 0);
  };

  return {
    fetchProducts,
    appendMoreProducts,
    setFilters,
    resetFilters,
  };
}
