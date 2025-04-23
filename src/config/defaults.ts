/**
 * 默認商品種類
 * 這僅用於開發環境或作為後端API無法連接時的備用選項
 */
export const DEFAULT_PRODUCT_CATEGORIES = [
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
 * Session Storage 鍵值定義
 */
export const SESSION_STORAGE_KEYS = {
  PRODUCT_CATEGORIES: 'product_categories',
  CATEGORIES_TIMESTAMP: 'categories_timestamp',
};

/**
 * 緩存有效期設置（毫秒）
 */
export const CACHE_DURATION = {
  PRODUCT_CATEGORIES: 24 * 60 * 60 * 1000, // 24小時
};