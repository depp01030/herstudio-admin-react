// src/pages/products/ProductList.tsx

import React, { useEffect } from 'react';
import ProductFilterForm from '@/components/form/ProductFilterForm';
import ProductListBody from '@/components/product/ProductListBody';
import PaginationControls from '@/components/product/PaginationControls';
import '@/styles/products.css';
import { useProductActions } from '@/hooks/useProductsActions';

const ProductList: React.FC = () => {
  const { fetchProducts } = useProductActions();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

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
