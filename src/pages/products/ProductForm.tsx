import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import productApi, { Product } from '../../api/productApi';
import { ROUTES } from '../../config/constants';
import '../../styles/products.css';

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string;
}

interface ValidationErrors {
  name?: string;
  description?: string;
  price?: string;
  stock?: string;
  category?: string;
  imageUrl?: string;
}

interface ProductFormProps {
  isEditing?: boolean;
}

const initialFormState: ProductFormData = {
  name: '',
  description: '',
  price: 0,
  stock: 0,
  category: '',
  imageUrl: ''
};

const ProductForm: React.FC<ProductFormProps> = ({ isEditing = false }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<ProductFormData>({...initialFormState});
  
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  
  // 獲取產品類別
  useEffect(() => {
    productApi.getCategories()
      .then(response => {
        setCategories(response);
      })
      .catch(error => {
        console.error('獲取產品類別失敗:', error);
      });
  }, []);
  
  // 如果是編輯模式，獲取產品數據
  useEffect(() => {
    if (isEditing && id) {
      setLoading(true);
      productApi.getProductById(id)
        .then(data => {
          setFormData({
            name: data.name,
            description: data.description,
            price: data.price,
            stock: data.stock,
            category: data.category,
            imageUrl: data.imageUrl
          });
        })
        .catch(error => {
          console.error('獲取產品詳情失敗:', error);
          setError('找不到產品或發生錯誤');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isEditing, id]);
  
  // 清除成功訊息計時器
  useEffect(() => {
    let timer: number;
    if (successMessage) {
      timer = window.setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [successMessage]);
  
  // 驗證表單
  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};
    
    if (!formData.name.trim()) {
      errors.name = '請輸入產品名稱';
    } else if (formData.name.length > 100) {
      errors.name = '產品名稱不能超過100個字符';
    }
    
    if (!formData.category) {
      errors.category = '請選擇產品類別';
    }
    
    if (formData.description.length > 1000) {
      errors.description = '產品描述不能超過1000個字符';
    }
    
    if (formData.price < 0) {
      errors.price = '價格不能為負數';
    } else if (formData.price > 999999) {
      errors.price = '價格不能超過999,999';
    }
    
    if (formData.stock < 0) {
      errors.stock = '庫存不能為負數';
    } else if (formData.stock > 99999) {
      errors.stock = '庫存不能超過99,999';
    }
    
    if (formData.imageUrl && !isValidUrl(formData.imageUrl)) {
      errors.imageUrl = '請輸入有效的圖片URL';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // 驗證URL格式
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseFloat(value) : value
    });
    
    // 標記字段為已觸碰
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };
  
  const handleBlur = (fieldName: string) => {
    setTouched(prev => ({
      ...prev,
      [fieldName]: true
    }));
    
    validateForm();
  };
  
  const resetForm = () => {
    setFormData({...initialFormState});
    setTouched({});
    setValidationErrors({});
    setImgError(false);
    setImgLoading(false);
    // 自動滾動到頁面頂部
    window.scrollTo(0, 0);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 標記所有字段為已觸碰，以顯示所有驗證錯誤
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as Record<string, boolean>);
    
    setTouched(allTouched);
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      if (isEditing && id) {
        // 更新產品
        await productApi.updateProduct(id, formData);
        setSuccessMessage('產品已成功更新！');
        // 編輯模式下導航回產品列表
        setTimeout(() => {
          navigate(ROUTES.PRODUCTS);
        }, 1500);
      } else {
        // 創建新產品
        await productApi.createProduct(formData);
        setSuccessMessage('產品已成功創建！');
        // 新增模式下重置表單以便繼續添加
        resetForm();
      }
    } catch (error) {
      console.error('保存產品失敗:', error);
      setError('保存產品失敗，請稍後再試');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    if (window.confirm('確定要取消嗎？所有未保存的更改將會丟失。')) {
      navigate(ROUTES.PRODUCTS);
    }
  };
  
  // 當圖片URL改變時自動檢查圖片是否可訪問
  const [imgLoading, setImgLoading] = useState<boolean>(false);
  const [imgError, setImgError] = useState<boolean>(false);
  
  useEffect(() => {
    if (formData.imageUrl && isValidUrl(formData.imageUrl)) {
      setImgLoading(true);
      setImgError(false);
      
      const img = new Image();
      img.onload = () => {
        setImgLoading(false);
        setImgError(false);
      };
      img.onerror = () => {
        setImgLoading(false);
        setImgError(true);
      };
      img.src = formData.imageUrl;
    }
  }, [formData.imageUrl]);
  
  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>載入產品數據...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="page-container product-form-page">
      <div className="page-header">
        <h1>{isEditing ? '編輯產品' : '新增產品'}</h1>
        <div className="header-actions">
          <Link to={ROUTES.PRODUCTS} className="cancel-button">
            返回列表
          </Link>
        </div>
      </div>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-group">
          <label htmlFor="name">產品名稱 *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            onBlur={() => handleBlur('name')}
            className={touched.name && validationErrors.name ? 'input-error' : ''}
            required
          />
          {touched.name && validationErrors.name && (
            <div className="field-error">{validationErrors.name}</div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="category">類別 *</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            onBlur={() => handleBlur('category')}
            className={touched.category && validationErrors.category ? 'input-error' : ''}
            required
          >
            <option value="">選擇類別</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {touched.category && validationErrors.category && (
            <div className="field-error">{validationErrors.category}</div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="description">產品描述</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            onBlur={() => handleBlur('description')}
            className={touched.description && validationErrors.description ? 'input-error' : ''}
            rows={5}
          />
          {touched.description && validationErrors.description && (
            <div className="field-error">{validationErrors.description}</div>
          )}
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
              onBlur={() => handleBlur('price')}
              className={touched.price && validationErrors.price ? 'input-error' : ''}
              min="0"
              step="0.01"
              required
            />
            {touched.price && validationErrors.price && (
              <div className="field-error">{validationErrors.price}</div>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="stock">庫存 *</label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              onBlur={() => handleBlur('stock')}
              className={touched.stock && validationErrors.stock ? 'input-error' : ''}
              min="0"
              required
            />
            {touched.stock && validationErrors.stock && (
              <div className="field-error">{validationErrors.stock}</div>
            )}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="imageUrl">圖片 URL</label>
          <div className="image-input-container">
            <input
              type="text"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl || ''}
              onChange={handleInputChange}
              onBlur={() => handleBlur('imageUrl')}
              className={touched.imageUrl && validationErrors.imageUrl ? 'input-error' : ''}
            />
            {imgLoading && <span className="img-status loading">檢查圖片中...</span>}
            {imgError && <span className="img-status error">圖片無法訪問</span>}
          </div>
          {touched.imageUrl && validationErrors.imageUrl && (
            <div className="field-error">{validationErrors.imageUrl}</div>
          )}
          
          {formData.imageUrl && !imgError && !imgLoading && (
            <div className="image-preview">
              <img src={formData.imageUrl} alt={formData.name} />
              <button 
                type="button" 
                className="remove-image"
                onClick={() => setFormData({...formData, imageUrl: ''})}
              >
                移除圖片
              </button>
            </div>
          )}
        </div>
        
        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={handleCancel}
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

export default ProductForm;