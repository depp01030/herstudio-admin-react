import React, { useState, useEffect } from 'react';
import { Product } from '../../types/product';
import productApi from '../../api/admin/productApi';
import { PAGINATION, ROUTES, PRODUCT_CATEGORIES } from '../../config/constants';
import { CustomType, getCustomTypeLabel, CUSTOM_TYPE_OPTIONS } from '../../types/enums';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import IconButton from '@mui/material/IconButton';

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
    purchase_price: 0,
    total_cost: 0,
    real_stock: 0,
    custom_type: CustomType.OTHER,
    material: '',
    size_note: '',
    stall_name: '',
    source: '',
    source_url: '',
    item_status: 'draft',
    // 初始化空的陣列和物件
    size_metrics: {},
    colors: [],
    sizes: [],
    selected_images: [],
  };

  const [formData, setFormData] = useState<Partial<Product>>(initialFormState);
  const [categories, setCategories] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);

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
    
    if ((type === 'number' || name === 'price' || name === 'purchase_price' || 
        name === 'total_cost' || name === 'real_stock') && value !== '') {
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

  const handleArrayInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const arrayValue = value.split(',').map(item => item.trim()).filter(item => item !== '');
    
    setFormData({
      ...formData,
      [name]: arrayValue
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name?.trim()) {
      alert('請輸入產品名稱');
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      console.log('正在創建產品:', formData);
      
      // 創建新產品
      await productApi.createProduct(formData as Product);
      
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

  const toggleExpand = () => {
    setIsExpanded(prev => !prev);
  };

  return (
    <div className="inline-product-form">
      <div className="inline-form-header">
        <h3>新增產品</h3>
        <div className="form-header-actions">
          <IconButton onClick={toggleExpand} size="small">
            {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
          <button type="button" className="close-button" onClick={onCancel}>×</button>
        </div>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      {isExpanded && (
        <form onSubmit={handleSubmit}>
          {/* 基本資訊區域 */}
          <h4 className="form-section-title">基本資訊</h4>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">產品名稱 *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name || ''}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="custom_type">商品類型 *</label>
              <select
                id="custom_type"
                name="custom_type"
                value={formData.custom_type || ''}
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
          </div>
          
          <div className="form-group">
            <label htmlFor="description">產品描述</label>
            <textarea
              id="description"
              name="description"
              value={formData.description || ''}
              onChange={handleInputChange}
              rows={3}
            />
          </div>
          
          {/* 價格與庫存區域 */}
          <h4 className="form-section-title">價格與庫存</h4>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">售價 *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price || 0}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="purchase_price">進貨價</label>
              <input
                type="number"
                id="purchase_price"
                name="purchase_price"
                value={formData.purchase_price || 0}
                onChange={handleInputChange}
                min="0"
                step="0.01"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="real_stock">庫存數量 *</label>
              <input
                type="number"
                id="real_stock"
                name="real_stock"
                value={formData.real_stock || 0}
                onChange={handleInputChange}
                min="0"
                required
              />
            </div>
          </div>
          
          {/* 來源資訊區域 */}
          <h4 className="form-section-title">來源資訊</h4>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="stall_name">檔口名稱</label>
              <input
                type="text"
                id="stall_name"
                name="stall_name"
                value={formData.stall_name || ''}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="source">來源</label>
              <input
                type="text"
                id="source"
                name="source"
                value={formData.source || ''}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="source_url">來源網址</label>
            <input
              type="text"
              id="source_url"
              name="source_url"
              value={formData.source_url || ''}
              onChange={handleInputChange}
            />
          </div>
          
          {/* 產品詳情區域 */}
          <h4 className="form-section-title">產品詳情</h4>
          <div className="form-row">
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
            
            <div className="form-group">
              <label htmlFor="size_note">尺寸描述</label>
              <textarea
                id="size_note"
                name="size_note"
                value={formData.size_note || ''}
                onChange={handleInputChange}
                rows={2}
              />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="colors">顏色選項 (逗號分隔)</label>
              <input
                type="text"
                id="colors"
                name="colors"
                value={(formData.colors || []).join(', ')}
                onChange={handleArrayInputChange}
                placeholder="例如: 白色, 黑色, 藍色"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="sizes">尺寸選項 (逗號分隔)</label>
              <input
                type="text"
                id="sizes"
                name="sizes"
                value={(formData.sizes || []).join(', ')}
                onChange={handleArrayInputChange}
                placeholder="例如: S, M, L, XL"
              />
            </div>
          </div>
          
          {/* 主圖設定 */}
          <div className="form-group">
            <label htmlFor="main_image">主圖 URL</label>
            <input
              type="text"
              id="main_image"
              name="main_image"
              value={formData.main_image || ''}
              onChange={handleInputChange}
            />
          </div>
          
          {/* 表單操作按鈕 */}
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
      )}
    </div>
  );
};

export default InlineProductForm;
