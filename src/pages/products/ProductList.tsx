import React, { useEffect } from 'react';
import ProductFilterForm from '@/components/form/ProductFilterForm';
import ProductListBody from '@/components/product/ProductListBody';
import PaginationControls from '@/components/product/PaginationControls';
import '@/styles/products.css';
import { useProductActions } from '@/hooks/useProductsActions';
import useProductStore from '@/stores/productStore';

import { useAuthStore } from '@/stores/authStore';
const AuthDebug: React.FC = () => {
  const { login, logout, role } = useAuthStore();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === 'admin' || val === 'viewer') login(val);
    else logout();
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ marginRight: 8 }}>角色切換：</label>
      <select value={role ?? ''} onChange={handleChange}>
        <option value="">未登入</option>
        <option value="admin">Admin</option>
        <option value="viewer">Viewer</option>
      </select>
    </div>
  );
};
 
const ProductList: React.FC = () => {
  const { fetchProducts } = useProductActions();
  const { page } = useProductStore();
  const { login, logout, role } = useAuthStore();

  useEffect(() => {
    if (page === 1) {
      fetchProducts(); // ✅ 僅首次或篩選時觸發
    }
  }, [page]);

  return (
    
    <div className="page-container product-list-page">

      
      <AuthDebug /> {/* ⬅ 插入這裡 */}
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
