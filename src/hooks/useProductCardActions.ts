// src/hooks/useProductCardActions.ts

import { useCallback } from 'react';
import useProductStore from '@/stores/productStore';
import { Product } from '@/types/product';
import adminProductApi from '@/api/admin/productApi';
import { updateProductImages } from '@/api/admin/productImageApi';

import { useProductCardInfoActions } from './useProductCardInfoActions';
import { useProductImageActions } from './useProductImageActions';

export function useProductCardActions(initial: Product) {
  const { setItems, items, removeItemById } = useProductStore();

  // info + image hooks（內部管理）
  const info = useProductCardInfoActions(initial);
  const image = useProductImageActions();

  const submit = useCallback(async () => { 
    let current = info.getCurrent(); 
    console.log('submit', current);
    let savedProduct = current;

    // 新增 or 更新
    if (!current.id) { 
      const created = await adminProductApi.createProduct(current);
      savedProduct = created;
      info.setProduct(created); // 更新 state
    } else { 
      const updated = await adminProductApi.updateProduct(current.id, current);
      savedProduct = updated;
      info.setProduct(updated);
    } 
    // 上傳圖片
    const form = image.buildImageFormData(savedProduct.id);
    //await updateProductImages(savedProduct.id, form);

    // 更新 store
    setItems(items.map((p) => (p.id === savedProduct.id ? savedProduct : p)));

    return savedProduct;
  }, [info, image, items, setItems]);

  const deleteProduct = useCallback(async (id: number): Promise<boolean> => {
    if (!confirm('確認要刪除這個商品嗎？')) return false;

    try {
      await adminProductApi.deleteProduct(id);
      removeItemById(id);
      return true;
    } catch (err) {
      console.error('刪除失敗', err);
      alert('刪除失敗，請稍後再試');
      return false;
    }
  }, [removeItemById]);

  return {
    submit,
    deleteProduct,
    info,
    image,
  };
}
