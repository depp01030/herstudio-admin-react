import { useCallback } from 'react';
import useProductStore from '@/stores/productStore';
import { Product } from '@/types/product';
import adminProductApi from '@/api/admin/productApi';

import { useProductCardInfoActions } from './useProductCardInfoActions';
import { useProductImageActions } from './useProductImageActions';
import { getEmptyProduct } from '@/utils/productUtils'; // 新增

export function useProductCardActions(initial?: Product) {
  const { setItems, items, addProduct, removeItemById } = useProductStore();

  const info = useProductCardInfoActions(initial ?? getEmptyProduct());
  const {
    getImages,
    fetchImages,
    addNewImage,
    setMainImage,
    toggleSelected,
    markForDelete,
    buildImageFormData,
    buildImageSubmission,
    saveImageChanges,
    getPreviewImageUrl,
  } = useProductImageActions();

  const submit = useCallback(async () => {
    try { 
      let current = info.getCurrent();
      let savedProduct = current;
      console.log('🔍 送出時 sizeMetrics:', current.sizeMetrics);
  
      if (!current.id) {
        const created = await adminProductApi.createProduct(current);
        savedProduct = created;
        info.setProduct(created);
      } else {
        const updated = await adminProductApi.updateProduct(current.id, current);
        savedProduct = updated; 
        info.setProduct(updated);
      }

      await saveImageChanges(savedProduct.id);
      setItems(items.map((p) => (p.id === savedProduct.id ? savedProduct : p)));

      return savedProduct;
    } catch (err) {
      console.error('❌ submit 錯誤：', err);
      throw err;
    }
  }, [info, items, setItems, saveImageChanges]);

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

  const addEmptyProduct = useCallback(() => {
    const empty = getEmptyProduct();
    addProduct(empty);
  }, [addProduct]);

  return {
    submit,
    deleteProduct,
    addEmptyProduct, // ✅ 新增的功能
    info, 
    getPreviewImageUrl,
  };
}
