// src/pages/debug/DebugPage.tsx

import React, { useState } from 'react';
import { API_BASE_URL } from '../../config/constants';
import { Product } from '../../types/product';
import ProductCard from '../../components/product/ProductCard';
import '../../styles/products.css';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import adminProductApi from '@/api/admin/productApi';

const mockProductData: Product = {
  id: 3333,
  name: '莫蘭迪系列純棉Tshirt',
  description: '採用高品質純棉材質，柔軟舒適，簡約設計風格，適合日常穿搭。',
  price: 799,
  purchasePrice: 500,
  totalCost: 650,
  stallName: 'Tede小舖',
  source: 'Instagram',
  sourceUrl: 'https://instagram.com/tee-shop/3333',
  customType: 'top',
  material: '100% 純棉',
  sizeNote: 'S、M、L、XL',
  sizeMetrics: {
    shoulder: '42',
    bust: '100',
    length: '65',
    sleeve: '22',
  },
  realStock: 10,
  itemStatus: 'product',
  itemFolder: 'TeeShop/3333_莫蘭迪系列純棉T恤',
  mainImage: 'main.jpg',
  selectedImages: ['main.jpg', 'side.jpg', 'model.jpg'],
  colors: ['米白色', '淺灰色', '粉色', '薄荷綠'],
  sizes: ['S', 'M', 'L', 'XL'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const DebugPage: React.FC = () => {
  const [createdProduct, setCreatedProduct] = useState<Product | null>(null);

  const handleCreate = async () => {
    const { id, createdAt, updatedAt, ...rest } = mockProductData;
    const newProduct = await adminProductApi.createProduct(rest);
    alert('建立成功，ID：' + newProduct.id);
    setCreatedProduct(newProduct);
  };

  const handleUpdate = async () => {
    if (!createdProduct) return alert('請先建立產品');
    await adminProductApi.updateProduct(createdProduct.id, {
      name: '更新名稱 - ' + Date.now(),
      description: '這是更新後的描述',
    });
    alert('更新成功');
  };

  const handleDelete = async () => {
    if (!createdProduct) return alert('請先建立產品');
    await adminProductApi.deleteProduct(createdProduct.id);
    alert('刪除成功');
    setCreatedProduct(null);
  };

  const handleRead = async () => {
    const res = await adminProductApi.getProducts({ page: 1, pageSize: 1 });
    console.log('查詢結果', res);
    alert('查詢完成，請查看 console');
  };

  const cardStyle = {
    border: '1px solid #E5DED8',
    borderRadius: '8px',
    padding: '20px',
    maxWidth: '2000px',
    margin: '20px auto',
    boxShadow: '0 2px 8px rgba(181, 107, 107, 0.1)',
    backgroundColor: '#fff',
  };

  return (
    <div className="debug-page">
      <h1>除錯頁面</h1>

      <div className="debug-info">
        <p>API 基本 URL: {API_BASE_URL}</p>
        <p>目前時間: {new Date().toLocaleString()}</p>
        {createdProduct && <p>已建立產品 ID: {createdProduct.id}</p>}
      </div>

      <div className="debug-section">
        <h2>模擬產品資料</h2>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button variant="contained" onClick={handleCreate}>建立產品</Button>
          <Button variant="outlined" onClick={handleRead}>查詢產品</Button>
          <Button variant="contained" color="primary" onClick={handleUpdate}>更新產品</Button>
          <Button variant="outlined" color="error" onClick={handleDelete}>刪除產品</Button>
        </div>

        <div className="product-card" style={cardStyle}>
          <ProductCard
            product={createdProduct ?? mockProductData}
            isSelected={false}
            onSelect={() => {}}
            onDelete={() => {}}
          />
        </div>
      </div>
    </div>
  );
};

export default DebugPage;
