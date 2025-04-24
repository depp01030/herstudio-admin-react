import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config/constants';
import { Product } from '../../types/product';
import ProductCard from '../../components/product/ProductCard';
import '../../styles/products.css';
import Grid from '@mui/material/Grid';

// 創建一個假的產品資料
const mockProductData: Product = {
  id: '3333',
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
    sleeve: '22'
  },
  realStock: 10,
  itemStatus: 'product',
  itemFolder: 'TeeShop/3333_莫蘭迪系列純棉T恤',
  mainImage: 'main.jpg',
  selectedImages: ['main.jpg', 'side.jpg', 'model.jpg'],
  colors: ['米白色', '淺灰色', '粉色', '薄荷綠'],
  sizes: ['S', 'M', 'L', 'XL'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const DebugPage: React.FC = () => {
  // 使用已定義的外部mockProductData，不再需要useState

  // 產品卡片樣式
  const cardStyle = {
    border: '1px solid #E5DED8',
    borderRadius: '8px',
    padding: '20px',
    maxWidth: '2000px',
    margin: '20px auto',
    boxShadow: '0 2px 8px rgba(181, 107, 107, 0.1)',
    backgroundColor: '#fff'
  };

  return (
    <div className="debug-page">
      <h1>除錯頁面</h1> 

      <div className="debug-info">
        <p>API 基本 URL: {API_BASE_URL}</p>
        <p>目前時間: {new Date().toLocaleString()}</p>
      </div>
      
      <div className="debug-section">
        <h2>模擬產品資料</h2>
        <div className="product-card" style={cardStyle}>
 
          <ProductCard
            product={mockProductData}
            isSelected={false}
            onSelect={() => {}}
            onDelete={() => {}}
          />
          <ProductCard
            product={mockProductData}
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