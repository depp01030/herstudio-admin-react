import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import productApi, { Product, ProductQueryParams } from '../../api/productApi';
import { PAGINATION, ROUTES, PRODUCT_CATEGORIES } from '../../config/constants';
import { CustomType, getCustomTypeLabel, CUSTOM_TYPE_OPTIONS } from '../../types/enums';
import '../../styles/products.css';

// 定義內嵌表單的屬性類型
interface InlineProductFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

// 內嵌的新增產品表單組件
const InlineProductForm: React.FC<InlineProductFormProps> = ({ onCancel, onSuccess }) => {
  const initialFormState = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
    imageUrl: '',
    material: '',
    sizeDescription: '',
    customType: CustomType.OTHER // 預設為「其他」類型
  };

  const [formData, setFormData] = useState(initialFormState);
  const [categories, setCategories] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 獲取產品類別
  useEffect(() => {
    productApi.getCategories()
      .then(response => {
        setCategories(response);
      })
      .catch(error => {
        console.error('獲取產品類別失敗:', error);
        // 使用預設類別列表
        setCategories(PRODUCT_CATEGORIES);
      });
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // 根據輸入類型處理值
    let processedValue: string | number = value;
    
    if ((type === 'number' || name === 'price' || name === 'stock') && value !== '') {
      processedValue = parseFloat(value);
      
      // 如果解析後不是數字，使用 0
      if (isNaN(processedValue)) {
        processedValue = 0;
      }
    }
    
    setFormData({
      ...formData,
      [name]: processedValue
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('請輸入產品名稱');
      return;
    }
    
    if (!formData.category) {
      alert('請選擇產品類別');
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    // 準備提交的產品數據
    const productToCreate = {
      ...formData,
      // 確保數字字段是數字類型
      price: typeof formData.price === 'string' ? parseFloat(formData.price) || 0 : formData.price,
      stock: typeof formData.stock === 'string' ? parseInt(formData.stock, 10) || 0 : formData.stock
    };
    
    try {
      console.log('正在創建產品:', productToCreate);
      
      // 創建新產品
      await productApi.createProduct(productToCreate);
      
      // 清空表單並通知父組件成功
      setFormData(initialFormState);
      onSuccess();
    } catch (error) {
      console.error('保存產品失敗:', error);
      setError('保存產品失敗，請稍後再試');
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className="inline-product-form">
      <div className="inline-form-header">
        <h3>新增產品</h3>
        <button type="button" className="close-button" onClick={onCancel}>×</button>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">產品名稱 *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="category">類別 *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
            >
              <option value="">選擇類別</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="customType">商品類型 *</label>
            <select
              id="customType"
              name="customType"
              value={formData.customType}
              onChange={handleInputChange}
              required
            >
              {CUSTOM_TYPE_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="material">材質</label>
            <input
              type="text"
              id="material"
              name="material"
              value={formData.material || ''}
              onChange={handleInputChange}
            />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="price">價格 *</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="stock">庫存 *</label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              min="0"
              required
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="description">產品描述</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="sizeDescription">尺寸描述</label>
          <textarea
            id="sizeDescription"
            name="sizeDescription"
            value={formData.sizeDescription || ''}
            onChange={handleInputChange}
            rows={2}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="imageUrl">圖片 URL</label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl || ''}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={onCancel}
            disabled={submitting}
          >
            取消
          </button>
          <button
            type="submit"
            className="primary-button"
            disabled={submitting}
          >
            {submitting ? '保存中...' : '保存產品'}
          </button>
        </div>
      </form>
    </div>
  );
};

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
  
  const handleSelectAllProducts = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = products.map(product => product.id);
      setSelectedProducts(allIds);
    } else {
      setSelectedProducts([]);
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
        <div className="product-table-container">
          <table className="product-table">
            <thead>
              <tr>
                <th>
                  <input 
                    type="checkbox" 
                    onChange={handleSelectAllProducts}
                    checked={selectedProducts.length === products.length && products.length > 0}
                  />
                </th>
                <th>圖片</th>
                <th>名稱</th>
                <th>類別</th>
                <th>價格</th>
                <th>庫存</th>
                <th>建立時間</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} className={selectedProducts.includes(product.id) ? 'selected-row' : ''}>
                  <td>
                    <input 
                      type="checkbox" 
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => handleSelectProduct(product.id)}
                    />
                  </td>
                  <td>
                    {product.imageUrl ? (
                      <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className="product-thumbnail" 
                      />
                    ) : (
                      <div className="no-image">無圖片</div>
                    )}
                  </td>
                  <td>
                    <Link to={`${ROUTES.PRODUCTS}/${product.id}`}>
                      {product.name}
                    </Link>
                  </td>
                  <td>{product.category}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>
                    <span className={product.stock <= 5 ? 'low-stock' : ''}>
                      {product.stock}
                    </span>
                  </td>
                  <td>{new Date(product.createdAt).toLocaleDateString()}</td>
                  <td className="action-buttons">
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
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      刪除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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