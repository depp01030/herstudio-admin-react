// src/pages/products/ProductList.tsx
import React, { useEffect } from 'react';
import ProductFilterForm from '@/components/form/ProductFilterForm';
import ProductListBody from '@/components/product/ProductListBody';
import PaginationControls from '@/components/product/PaginationControls';
import useProductStore from '@/stores/productStore';
import '@/styles/products.css';

const ProductList: React.FC = () => {
  const { fetch, items } = useProductStore();

  useEffect(() => {
    if (items.length === 0) {
      fetch(); // 初次載入資料
    }
  }, []); 

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
