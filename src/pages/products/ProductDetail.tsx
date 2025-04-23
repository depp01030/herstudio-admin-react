import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import productApi, { Product } from '../../api/productApi';
import { ROUTES } from '../../config/constants';
import '../../styles/products.css';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    setError(null);
    
    // 實際 API 調用
    productApi.getProductById(id)
      .then(data => {
        setProduct(data);
      })
      .catch(error => {
        console.error('獲取產品詳情失敗:', error);
        setError('找不到產品或發生錯誤');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleGoBack = () => {
    navigate(ROUTES.PRODUCTS);
  };

  const handleDeleteProduct = () => {
    if (!product) return;
    
    if (window.confirm(`確定要刪除產品 "${product.name}" 嗎？`)) {
      productApi.deleteProduct(product.id)
        .then(response => {
          if (response.success) {
            alert('產品已成功刪除！');
            navigate(ROUTES.PRODUCTS);
          }
        })
        .catch(error => {
          console.error('刪除產品失敗:', error);
          alert('刪除產品失敗，請稍後再試。');
        });
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>載入產品詳情...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-container">
          <div className="error-message">{error}</div>
          <button onClick={handleGoBack} className="primary-button">返回產品列表</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container product-detail-page">
      <div className="page-header">
        <div className="header-left">
          <button onClick={handleGoBack} className="back-button">
            &larr; 返回列表
          </button>
          <h1>產品詳情</h1>
        </div>
        <div className="header-actions">
          <Link 
            to={`${ROUTES.PRODUCTS}/${product?.id}/edit`} 
            className="edit-button"
          >
            編輯產品
          </Link>
          <button 
            className="delete-button"
            onClick={handleDeleteProduct}
          >
            刪除產品
          </button>
        </div>
      </div>

      {product ? (
        <div className="product-detail-container">
          {/* 左側產品資訊區塊 */}
          <div className="product-info-container">
            <h2 className="product-title">{product.name}</h2>
            
            <div className="product-meta">
              <div className="meta-item">
                <span className="meta-label">ID:</span>
                <span className="meta-value">{product.id}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">類別:</span>
                <span className="meta-value">{product.category}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">狀態:</span>
                <span className="meta-value status-active">銷售中</span>
              </div>
            </div>
            
            <div className="info-section">
              <h3 className="section-title">基本資訊</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>價格</label>
                  <div className="value price">${product.price.toFixed(2)}</div>
                </div>
                <div className="info-item">
                  <label>庫存</label>
                  <div className={`value ${product.stock <= 5 ? 'low-stock' : ''}`}>
                    {product.stock}
                  </div>
                </div>
                <div className="info-item wide">
                  <label>材質</label>
                  <div className="value">{product.material || '未指定'}</div>
                </div>
              </div>
            </div>
            
            <div className="info-section">
              <h3 className="section-title">產品描述</h3>
              <div className="product-description">
                <p>{product.description || '此產品尚無描述。'}</p>
              </div>
            </div>
            
            <div className="info-section">
              <h3 className="section-title">規格選項</h3>
              <div className="info-grid">
                <div className="info-item wide">
                  <label>尺寸描述</label>
                  <div className="value">{product.sizeDescription || '未指定'}</div>
                </div>
                
                {product.availableColors && product.availableColors.length > 0 && (
                  <div className="info-item wide">
                    <label>可選顏色</label>
                    <div className="value colors-list">
                      {product.availableColors.map((color, index) => (
                        <span key={index} className="color-chip">{color}</span>
                      ))}
                    </div>
                  </div>
                )}
                
                {product.availableSizes && product.availableSizes.length > 0 && (
                  <div className="info-item wide">
                    <label>可選尺寸</label>
                    <div className="value sizes-list">
                      {product.availableSizes.map((size, index) => (
                        <span key={index} className="size-chip">{size}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="info-section">
              <h3 className="section-title">系統資訊</h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>建立日期</label>
                  <div className="value">{new Date(product.createdAt).toLocaleDateString()}</div>
                </div>
                <div className="info-item">
                  <label>更新日期</label>
                  <div className="value">{new Date(product.updatedAt).toLocaleDateString()}</div>
                </div>
                <div className="info-item wide">
                  <label>相對資料夾路徑</label>
                  <div className="value path">{product.relativeFolderPath || '/'}</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 右側產品圖片區塊 */}
          <div className="product-image-container">
            {product.imageUrl ? (
              <div className="main-image">
                <img src={product.imageUrl} alt={product.name} />
              </div>
            ) : (
              <div className="no-image-placeholder">
                <div className="no-image-text">暫無圖片</div>
              </div>
            )}
            
            {/* 如果有多張圖片，可以在此處添加縮略圖列表 */}
            {product.additionalImages && product.additionalImages.length > 0 && (
              <div className="thumbnail-list">
                {product.additionalImages.map((image, index) => (
                  <div key={index} className="thumbnail">
                    <img src={image} alt={`${product.name} - 圖片 ${index + 2}`} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="no-product">
          <p>找不到產品信息。請返回產品列表。</p>
          <button onClick={handleGoBack} className="primary-button">返回產品列表</button>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;