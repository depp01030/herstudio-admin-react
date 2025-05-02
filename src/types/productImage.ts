// src/types/productImage.ts

import {IMAGE_ACTIONS} from '@/config/constants';

export type ImageAction = (typeof IMAGE_ACTIONS)[number];

export interface ProductImage {
    id?: number;                 // 後端 id，舊圖才有
    tempId?: string;             // 前端 uuid，僅新圖使用
    productId: number;        // 關聯商品 ID
     
    file?: File;              // 僅新圖有，送出時會用來建立 FormData
    url: string;              // 圖片預覽網址（可來自後端，或是 URL.createObjectURL）
    fileName: string;         // 前端用：檔名或 
    //localPath: string;        // 本地儲存相對路徑（如 itemFolder/main.jpg）
    
    isMain: boolean;          // 是否為主圖
    isSelected: boolean;      // 是否要上傳
    action: ImageAction;      // 圖片狀態：'new' | 'original' | 'update' | 'delete'
     
  }

// -- 最終送出後端的精簡格式 --
export interface ProductImageSubmission {
  id?: number;
  tempId?: string;
  action: ImageAction;
  isMain: boolean;
  isSelected: boolean;
}
