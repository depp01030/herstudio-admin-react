import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import productApi, { Product, ProductQueryParams } from '../../api/productApi';
import { PAGINATION, ROUTES, PRODUCT_CATEGORIES } from '../../config/constants';
import { CustomType, getCustomTypeLabel, CUSTOM_TYPE_OPTIONS } from '../../types/enums';
import InlineProductForm from '../../components/product/InlineProductForm';
import ProductCard from '../../components/product/ProductCard';
import '../../styles/products.css';


const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [queryParams, setQueryParams] = useState<ProductQueryParams>({
    page: 1,
    pageSize: PAGINATION.DEFAULT_PAGE_SIZE,
  });
  const [showInlineForm, setShowInlineForm] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    // 獲取產品類別
    productApi.getCategories()
      .then(response => {
        setCategories(response);
      })
      .catch(error => {
        console.error('獲取產品類別失敗:', error);
      });
  }, []);

  // 獲取產品列表
  const fetchProducts = () => {
    setLoading(true);
    productApi.getProducts(queryParams)
      .then(response => {
        setProducts(response.items);
        setTotal(response.total);
      })
      .catch(error => {
        console.error('獲取產品列表失敗:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, [queryParams]);

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('確定要刪除此產品嗎？')) {
      productApi.deleteProduct(id)
        .then(response => {
          if (response.success) {
            // 刪除成功後刷新列表
            setProducts(products.filter(product => product.id !== id));
            setTotal(prev => prev - 1);
          }
        })
        .catch(error => {
          console.error('刪除產品失敗:', error);
          alert('刪除產品失敗，請稍後再試。');
        });
    }
  };
  
  const handleSelectProduct = (id: string) => {
    setSelectedProducts(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  
  const handleSelectAllProducts = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      const allIds = products.map(product => product.id);
      setSelectedProducts(allIds);
    }
  };
  
  const handleBatchDelete = () => {
    if (selectedProducts.length === 0) {
      alert('請先選擇要刪除的產品');
      return;
    }
    
    if (window.confirm(`確定要刪除選中的 ${selectedProducts.length} 個產品嗎？`)) {
      // 在實際場景中可以實現批量刪除的 API
      // 這裡使用循環單獨刪除來示範
      let deleteCount = 0;
      let errors = 0;
      
      const deletePromises = selectedProducts.map(id => 
        productApi.deleteProduct(id)
          .then(response => {
            if (response.success) {
              deleteCount++;
            }
          })
          .catch(() => {
            errors++;
          })
      );
      
      Promise.all(deletePromises)
        .then(() => {
          if (errors > 0) {
            alert(`成功刪除 ${deleteCount} 個產品，${errors} 個產品刪除失敗`);
          } else {
            alert(`成功刪除 ${deleteCount} 個產品`);
          }
          
          // 刷新產品列表
          fetchProducts();
          setSelectedProducts([]);
        });
    }
  };
  
  const handleShowInlineForm = () => {
    setShowInlineForm(true);
  };
  
  const handleCancelInlineForm = () => {
    setShowInlineForm(false);
  };
  
  const handleSuccessInlineForm = () => {
    // 關閉表單並刷新產品列表
    setShowInlineForm(false);
    fetchProducts();
  };

  return (
    <div className="page-container product-list-page">
      <div className="page-header">
        <h1>產品列表</h1>
        <div className="header-actions">
          <button 
            className="primary-button"
            onClick={handleShowInlineForm}
          >
            新增產品
          </button>
        </div>
      </div>
      
      {showInlineForm && (
        <InlineProductForm 
          onCancel={handleCancelInlineForm}
          onSuccess={handleSuccessInlineForm}
        />
      )}
      
      <div className="product-filters">
        <input 
          type="text" 
          placeholder="搜索產品名稱..."
          onChange={(e) => {
            setQueryParams({
              ...queryParams,
              search: e.target.value,
              page: 1, // 重置頁碼
            });
          }}
        />
        
        <select 
          onChange={(e) => {
            setQueryParams({
              ...queryParams,
              category: e.target.value,
              page: 1,
            });
          }}
        >
          <option value="">所有類別</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        
        <select
          onChange={(e) => {
            const [sortBy, order] = e.target.value.split('-');
            setQueryParams({
              ...queryParams,
              sortBy,
              order: order as 'asc' | 'desc',
              page: 1,
            });
          }}
        >
          <option value="createdAt-desc">最新創建</option>
          <option value="createdAt-asc">最早創建</option>
          <option value="name-asc">名稱 A-Z</option>
          <option value="name-desc">名稱 Z-A</option>
          <option value="price-asc">價格低到高</option>
          <option value="price-desc">價格高到低</option>
        </select>
      </div>
      
      {selectedProducts.length > 0 && (
        <div className="batch-actions">
          <span>{selectedProducts.length} 個產品已選中</span>
          <button 
            className="delete-button"
            onClick={handleBatchDelete}
          >
            批量刪除
          </button>
        </div>
      )}
      
      {loading ? (
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>載入產品中...</p>
        </div>
      ) : products.length > 0 ? (
        <div className="product-cards-container">
          <div className="product-cards-header">
            <div className="header-checkbox">
              <input 
                type="checkbox" 
                onChange={handleSelectAllProducts}
                checked={selectedProducts.length === products.length && products.length > 0}
              />
              <span>全選</span>
            </div>
            <div className="header-right">
              <span>共 {total} 件商品</span>
            </div>
          </div>
          
          <div className="product-cards-list">
            {products.map(product => (
              <ProductCard 
                key={product.id}
                product={product}
                isSelected={selectedProducts.includes(product.id)}
                onSelect={handleSelectProduct}
                onDelete={handleDeleteProduct}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="no-products">
          <p>尚無產品數據。點擊"新增產品"按鈕來添加產品。</p>
          <button 
            className="primary-button"
            onClick={handleShowInlineForm}
          >
            新增產品
          </button>
        </div>
      )}
      
      {/* 分頁控制 */}
      {total > 0 && (
        <div className="pagination">
          <button 
            disabled={queryParams.page === 1}
            onClick={() => 
              setQueryParams({
                ...queryParams, 
                page: (queryParams.page || 1) - 1,
              })
            }
          >
            上一頁
          </button>
          
          <span>
            第 {queryParams.page} 頁 / 共 {Math.ceil(total / (queryParams.pageSize || PAGINATION.DEFAULT_PAGE_SIZE))} 頁
          </span>
          
          <button 
            disabled={(queryParams.page || 1) >= Math.ceil(total / (queryParams.pageSize || PAGINATION.DEFAULT_PAGE_SIZE))}
            onClick={() => 
              setQueryParams({
                ...queryParams, 
                page: (queryParams.page || 1) + 1,
              })
            }
          >
            下一頁
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;