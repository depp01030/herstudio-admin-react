// === 基礎欄位（前端用 camelCase 命名） ===
export interface ProductBase {
  // 基本資訊
  name?: string;
  description?: string;

  // 價格欄位
  purchasePrice?: number;
  totalCost?: number;
  price?: number;

  // 來源欄位
  stallName?: string;
  source?: string;
  sourceUrl?: string;

  // 額外資訊
  customType?: string;
  material?: string;
  sizeMetrics: Record<string, string>;
  sizeNote?: string;
  realStock?: number;
  itemStatus?: string;

  // 圖片與資料夾
  itemFolder?: string;
  mainImage?: string;
  selectedImages: string[];

  // 規格欄位
  colors: string[];
  sizes: string[];

  // Shopee 專用
  shopeeCategoryId?: number;
}

// === 表單上的產品 ===
export interface Product extends ProductBase {
  id: number;
  createdAt?: string;
  updatedAt?: string;
}

// === 建立產品 ===
export interface ProductCreate extends ProductBase {}

// === 更新產品（可用 Partial<ProductBase> 替代） ===
export interface ProductUpdate extends ProductBase {}

// === 資料庫中的產品（加上 ID 與系統欄位） ===
export interface ProductInDB extends ProductBase {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  shopeeItemId?: string;
  imageList?: { filename: string }[]; // 後端是 dict，前端用簡單結構
}

// === 查詢用的參數（對應 ProductQuery）===
export interface ProductQueryParams {
  // 基本篩選條件
  id?: number;              // 商品 ID 精準比對
  name?: string;            // 商品名稱模糊比對
  stall?: string;           // 檔口名稱模糊比對
  fromDate?: string;        // ISO 格式日期字串 (e.g., '2024-04-01')
  source?: string;          // 來源模糊比對

  // 分頁與排序
  page?: number;            // 第幾頁（從1開始）
  pageSize?: number;        // 每頁幾筆
  sortBy?: string;          // 排序欄位（created_at / price / name）
  sortOrder?: 'asc' | 'desc'; // 排序方式
}

