// src/components/product/CardRightSection.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types/product';
import { ROUTES } from '../../config/constants';

interface CardRightSectionProps {
  product: Product;
  onDelete: (id: string) => void;
}

const CardRightSection: React.FC<CardRightSectionProps> = ({ product, onDelete }) => {
  return (
    <div className="product-card-right-section">
      {/* 價格資訊 */}
      <div className="product-pricing">
        <h4>價格資訊:</h4>
        <div className="price-details">
          {product.price !== undefined && (
            <div className="price-item">
              <span className="price-label">售價:</span>
              <span className="price-value">${product.price.toFixed(2)}</span>
            </div>
          )}
          
          {product.purchase_price !== undefined && (
            <div className="price-item">
              <span className="price-label">進貨價:</span>
              <span className="price-value">${product.purchase_price.toFixed(2)}</span>
            </div>
          )}
          
          {product.total_cost !== undefined && (
            <div className="price-item">
              <span className="price-label">總成本:</span>
              <span className="price-value">${product.total_cost.toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* 庫存資訊 */}
      <div className="product-stock">
        <h4>庫存:</h4>
        <span className={`stock-value ${(product.real_stock || 0) <= 5 ? 'low-stock' : ''}`}>
          {product.real_stock !== undefined ? product.real_stock : '無資料'}
        </span>
      </div>
      
      {/* 規格選項 */}
      <div className="product-specs">
        {product.colors && product.colors.length > 0 && (
          <div className="product-colors">
            <h4>可選顏色:</h4>
            <div className="color-chips">
              {product.colors.map((color, index) => (
                <span key={index} className="color-chip">{color}</span>
              ))}
            </div>
          </div>
        )}
        
        {product.sizes && product.sizes.length > 0 && (
          <div className="product-sizes">
            <h4>可選尺寸:</h4>
            <div className="size-chips">
              {product.sizes.map((size, index) => (
                <span key={index} className="size-chip">{size}</span>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Shopee 資訊 */}
      {product.shopee_item_id && (
        <div className="shopee-info">
          <h4>Shopee 資訊:</h4>
          <div className="shopee-item">
            <span className="shopee-label">商品 ID:</span>
            <span className="shopee-value">{product.shopee_item_id}</span>
          </div>
          {product.shopee_category_id && (
            <div className="shopee-item">
              <span className="shopee-label">類別 ID:</span>
              <span className="shopee-value">{product.shopee_category_id}</span>
            </div>
          )}
        </div>
      )}

      <div className="product-card-actions">
        <Link
          to={`${ROUTES.PRODUCTS}/${product.id}`}
          className="view-button"
        >
          查看
        </Link>
        <Link
          to={`${ROUTES.PRODUCTS}/${product.id}/edit`}
          className="edit-button"
        >
          編輯
        </Link>
        <button
          className="delete-button"
          onClick={() => onDelete(product.id)}
        >
          刪除
        </button>
      </div>
    </div>
  );
};

export default CardRightSection;
