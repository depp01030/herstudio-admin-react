import React, { useEffect } from 'react';
import ProductFilterForm from '@/components/form/ProductFilterForm';
import ProductListBody from '@/components/product/ProductListBody';
import PaginationControls from '@/components/product/PaginationControls';
import '@/styles/products.css';

import { useProductActions } from '@/hooks/useProductsActions';
import useProductStore from '@/stores/productStore';
import { useAuthStore } from '@/stores/authStore';

const ProductList: React.FC = () => {
  const { fetchProducts } = useProductActions();
  const { page } = useProductStore();
  const { isInitialized } = useAuthStore();

  useEffect(() => {
    if (isInitialized) {
      fetchProducts(); // ✅ 初始化完成後再觸發
    }
  }, [page, isInitialized]);

  return (
    <div className="page-container product-list-page">
      <div className="page-header">
        <h1>產品列表</h1>
      </div>
      <ProductFilterForm />
      <ProductListBody />
      <PaginationControls />
    </div>
  );
};

export default ProductList;
