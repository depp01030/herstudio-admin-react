import { IMAGE_ACTIONS } from '@/config/constants';

export type ImageAction = (typeof IMAGE_ACTIONS)[number];

/**
 * 前端內部使用的完整圖片資料
 */
export interface ProductImage {
  id?: number;              // 舊圖會有後端 id
  tempId?: string;          // 新圖有前端用的 uuid
  productId: number;        // 所屬商品 ID

  file?: File;              // 僅新圖會有，送出時會轉成 FormData
  url: string;              // 圖片預覽網址（含舊圖URL或 createObjectURL）
  fileName: string;         // 檔名，顯示用

  isMain: boolean;          // 是否主圖
  isSelected: boolean;      // 是否選擇上傳
  action: ImageAction;      // 狀態：new / original / update / delete
}

/**
 * 送出後端的精簡格式（JSON）
 */
export interface ProductImageSubmission {
  id?: number;
  tempId?: string;
  action: ImageAction;
  isMain: boolean;
  isSelected: boolean;
}

/**
 * 後端回傳處理後的資訊
 */
export interface ProcessedImageInfo {
  id: number;
  tempId: string;
  fileName: string;
  url: string;
  isMain: boolean;
  isSelected: boolean;
}
