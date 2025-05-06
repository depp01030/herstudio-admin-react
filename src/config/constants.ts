/**
 * API 配置常數
 * 根據您的實際後台 API 地址進行配置
 * 優先級：環境變數 > 開發環境默認值 > 生產環境備用值
 */
// config.ts
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

/**
 * 路由路徑常數
 */ 
export const ROUTES = {
  LOGIN: '/login',  
  DASHBOARD: '/',
  _DEBUG: '/admin/debug',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id', 
  PRODUCT_EDIT: '/products/:id/edit',
  SETTINGS: '/settings',
};

/**
 * 分頁配置
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
};

/**
 * 商品類別列表
 * 參考自 product-dashboard 的標準類別
 */

/**
 * 本地存儲鍵
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_INFO: 'user_info',
  THEME: 'app_theme',
};


export const IMAGE_ACTIONS = ['new', 'original', 'update', 'delete'] as const; 