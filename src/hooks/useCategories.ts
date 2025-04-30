import { useState, useEffect } from 'react';
import productApi from '../api/admin/productApi';
import { DEFAULT_PRODUCT_CATEGORIES, SESSION_STORAGE_KEYS, CACHE_DURATION } from '../config/defaults';

/**
 * 用於獲取和管理商品類別的自定義 Hook
 * - 優先從 sessionStorage 中讀取緩存的類別列表
 * - 如果緩存不存在或已過期，則從 API 獲取最新數據
 * - 數據獲取後會存入 sessionStorage 以供下次使用
 * - 如果 API 調用失敗，則使用默認類別列表
 */
export function useCategories() {
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // 嘗試從 sessionStorage 獲取緩存數據
        const cachedCategories = sessionStorage.getItem(SESSION_STORAGE_KEYS.PRODUCT_CATEGORIES);
        const cachedTimestamp = sessionStorage.getItem(SESSION_STORAGE_KEYS.CATEGORIES_TIMESTAMP);
        
        // 檢查緩存是否存在且未過期
        const isValidCache = cachedCategories && cachedTimestamp && 
          (Date.now() - parseInt(cachedTimestamp, 10) < CACHE_DURATION.PRODUCT_CATEGORIES);
        
        if (isValidCache) {
          // 使用緩存數據
          setCategories(JSON.parse(cachedCategories));
        } else {
          // 從 API 獲取最新數據
          const freshCategories = await productApi.getCategories();
          setCategories(freshCategories);
          
          // 更新緩存
          sessionStorage.setItem(
            SESSION_STORAGE_KEYS.PRODUCT_CATEGORIES, 
            JSON.stringify(freshCategories)
          );
          sessionStorage.setItem(
            SESSION_STORAGE_KEYS.CATEGORIES_TIMESTAMP, 
            Date.now().toString()
          );
        }
      } catch (err) {
        console.error('無法獲取商品類別:', err);
        setError('無法獲取商品類別列表');
        // 使用默認類別作為備用
        setCategories(DEFAULT_PRODUCT_CATEGORIES);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  /**
   * 強制從 API 重新加載類別數據
   */
  const refreshCategories = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const freshCategories = await productApi.getCategories();
      setCategories(freshCategories);
      
      // 更新緩存
      sessionStorage.setItem(
        SESSION_STORAGE_KEYS.PRODUCT_CATEGORIES, 
        JSON.stringify(freshCategories)
      );
      sessionStorage.setItem(
        SESSION_STORAGE_KEYS.CATEGORIES_TIMESTAMP, 
        Date.now().toString()
      );
    } catch (err) {
      console.error('無法刷新商品類別:', err);
      setError('無法刷新商品類別列表');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    categories,
    isLoading,
    error,
    refreshCategories
  };
}

export default useCategories;