// src/hooks/useProductCardInfoActions.ts

import { useState } from 'react';
import { Product } from '@/types/product';

/**
 * 管理 product 表單中的文字欄位
 */
export function useProductCardInfoActions(initial: Product) {
  const [editableProduct, setEditableProduct] = useState<Product>(initial);

  const updateField = (field: keyof Product, value: any) => {
    setEditableProduct((prev) => ({ ...prev, [field]: value }));
  };

  const getCurrent = () => editableProduct;

  const setProduct = (next: Product) => setEditableProduct(next);

  return {
    editableProduct,
    updateField,
    getCurrent,
    setProduct,
  };
}
