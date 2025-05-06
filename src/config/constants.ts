// config/constants.ts

// === API base URL ===
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// === API 路徑 ===
export const AUTH_LOGIN_ROUTE = '/auth/login';
export const AUTH_ME_ROUTE = '/auth/me';
export const ADMIN_PRODUCT_ROUTE = '/api/admin/products';
export const PRODUCT_CATEGORY_ROUTE = '/product-categories';
export const ADMIN_IMAGE_ROUTE = '/api/admin/product-image';

// === 前端路由常數 ===
export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/',
  _DEBUG: '/admin/debug',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  PRODUCT_EDIT: '/products/:id/edit',
  SETTINGS: '/settings',
};

// === 分頁設定 ===
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
};

// === 圖片動作 ===
export const IMAGE_ACTIONS = ['new', 'original', 'update', 'delete'] as const;
