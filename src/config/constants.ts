/**
 * API 配置常數
 * 根據您的實際後台 API 地址進行配置
 * 優先級：環境變數 > 開發環境默認值 > 生產環境備用值
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.DEV 
    ? 'http://127.0.0.1:8000'  // 開發環境默認值 - 請根據您的實際後台 API 地址修改
    : '/api');  // 生產環境通常使用相對路徑

/**
 * 路由路徑常數
 */
export const ROUTES = {
  DASHBOARD: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  PRODUCT_NEW: '/products/new',
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
export const PRODUCT_CATEGORIES = [
  '女性上著',
  '女性下著',
  '洋裝',
  '外套',
  '裙子',
  '褲子',
  '配飾',
  '圍巾',
  '其他'
];

/**
 * 本地存儲鍵
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_INFO: 'user_info',
  THEME: 'app_theme',
};