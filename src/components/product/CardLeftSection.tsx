// src/components/product/CardLeftSection.tsx

import React from 'react';
import { Product } from '../../types/product';

interface CardLeftSectionProps {
  product: Product;
}

const CardLeftSection: React.FC<CardLeftSectionProps> = ({ product }) => {
  return (
    <div className="product-card-left-section">
      <div className="product-description">
        <h4>產品描述:</h4>
        <p>{product.description || '無描述'}</p>
      </div>

      {product.material && (
        <div className="product-material">
          <h4>材質:</h4>
          <p>{product.material}</p>
        </div>
      )}

      {product.size_note && (
        <div className="product-size-description">
          <h4>尺寸描述:</h4>
          <p>{product.size_note}</p>
        </div>
      )}

      {Object.keys(product.size_metrics || {}).length > 0 && (
        <div className="product-size-metrics">
          <h4>尺寸詳情:</h4>
          <div className="size-metrics-list">
            {Object.entries(product.size_metrics).map(([key, value]) => (
              <div key={key} className="size-metric-item">
                <span className="metric-name">{key}:</span>
                <span className="metric-value">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="product-source-info">
        <h4>來源資訊:</h4>
        <p>{product.stall_name ? `檔口: ${product.stall_name}` : '無檔口資訊'}</p>
        {product.source && <p>來源: {product.source}</p>}
      </div>

      <div className="product-creation-date">
        <h4>建立時間:</h4>
        <p>{product.created_at ? new Date(product.created_at).toLocaleDateString() : '無資料'}</p>
      </div>
    </div>
  );
};

export default CardLeftSection;
