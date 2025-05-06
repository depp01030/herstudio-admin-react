import { useCallback } from 'react';
import useProductStore from '@/stores/productStore';
import { Product } from '@/types/product';
import adminProductApi from '@/api/admin/productApi';

import { useProductCardInfoActions } from './useProductCardInfoActions';
import { useProductImageActions } from './useProductImageActions';
import { getEmptyProduct } from '@/utils/productUtils';

export function useProductCardActions(initial?: Product) {
  const {
    getAllProducts,
    addProduct,
    removeProduct,
    appendProducts,
  } = useProductStore();

  const info = useProductCardInfoActions(initial ?? getEmptyProduct());
  const {
    getImagesByProductId,
    fetchImages,
    addNewImage,
    setMainImage,
    toggleSelected,
    markForDelete,
    rebindImageProductId,
    buildImageFormData,
    buildImageSubmission,
    saveImageChanges,
    getPreviewImageUrl,
  } = useProductImageActions();

  const submit = useCallback(async () => {
    try {
      const current = info.getCurrent();
      if (!current) throw new Error('找不到目前編輯中的商品');
  
      let savedProduct: Product;
  
      if (current.id === -1) {
        const created = await adminProductApi.createProduct(current);
        savedProduct = created;
        info.setProduct(created);
        rebindImageProductId(-1, created.id);
        useProductStore.getState().rebindProductId(-1, created.id); // ✅ 核心修正
      } else {
        const updated = await adminProductApi.updateProduct(current.id, current);
        savedProduct = updated;
        info.setProduct(updated);
      }
  
      await saveImageChanges(savedProduct.id);
      return savedProduct;
    } catch (err) {
      console.error('❌ submit 錯誤：', err);
      throw err;
    }
  }, [info, saveImageChanges]);
  
  

  const deleteProduct = useCallback(async (id: number): Promise<boolean> => {
    if (!confirm('確認要刪除這個商品嗎？')) return false;

    try {
      await adminProductApi.deleteProduct(id);
      removeProduct(id); // ✅ 使用新版方法
      return true;
    } catch (err) {
      console.error('刪除失敗', err);
      alert('刪除失敗，請稍後再試');
      return false;
    }
  }, [removeProduct]);

  const addEmptyProduct = useCallback(() => {
    const products = getAllProducts();
    const hasTemp = products.some((p) => p.id === -1);
    if (hasTemp) {
      alert('請先儲存當前新增的商品');
      return;
    }
  
    const empty = getEmptyProduct();
    addProduct(empty);
  }, [addProduct, getAllProducts]);
  

  return {
    submit,
    deleteProduct,
    addEmptyProduct,
    info,
    image: {
      getImagesByProductId,
      fetchImages,
      addNewImage,
      setMainImage,
      toggleSelected,
      markForDelete,
      buildImageFormData,
      buildImageSubmission,
      saveImageChanges,
    },
    getPreviewImageUrl,
  };
}
