import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config/constants';
import { Product } from '../../types/product';
import ProductCard from '../../components/product/ProductCard';
import '../../styles/products.css';
import Grid from '@mui/material/Grid';


const DebugPage: React.FC = () => {
  // 創建一個假的產品資料
  const [mockProduct, setMockProduct] = useState<Product>({
    id: 333,
    name: '莫蘭迪系列純棉T恤',
    description: '採用高品質純棉材質，柔軟舒適，簡約設計風格，適合日常穿搭。',
    price: 799,  
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    material: '100% 純棉',
    sizeDescription: 'S、M、L、XL',
    availableColors: ['米白色', '淺灰色', '粉色', '薄荷綠'],
    availableSizes: ['S', 'M', 'L', 'XL']
  });

  // 產品卡片樣式
  const cardStyle = {
    border: '1px solid #E5DED8',
    borderRadius: '8px',
    padding: '20px',
    maxWidth: '1200px',
    margin: '20px auto',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
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
            product={mockProduct}
            isSelected={false}
            onSelect={() => {}}
            onDelete={() => {}}
          />
          <ProductCard
            product={mockProduct}
            isSelected={false}
            onSelect={() => {}}
            onDelete={() => {}}
          />
          <ProductCard
            product={mockProduct}
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