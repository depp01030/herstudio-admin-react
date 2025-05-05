// src/api/admin/productImageApi.ts

import apiService from '@/api/apiService';
import { ProcessedImageInfo } from '@/types/productImage';

/**
 * 💾 A1 - 儲存圖片編輯變更（新增 / 更新 / 刪除）
 * POST /product-image/process
 * 送出 FormData（包含圖片檔案與 JSON metadata）
 * 回傳：{ images: ProcessedImageInfo[], message: {}, error: {} }
 */
const saveImageChanges = (form: FormData) =>
  apiService.post<{
    images: ProcessedImageInfo[];
    message?: any;
    error?: any;
  }>('/api/admin/product-image/process', form);

/**
 * 📦 A2 - 查詢某個商品的所有圖片資訊
 * GET /product-image/product/{product_id}
 * 回傳：ProcessedImageInfo[]
 */
const getProductImages = (productId: number) =>
  apiService.get<ProcessedImageInfo[]>(`/api/admin/product-image/product/${productId}`);

/**
 * 🖼️ A3 - 上傳單張圖片（預覽用）
 * POST /product-image/upload
 * 傳送：FormData（含 product_id 與 file）
 * 回傳：ProcessedImageInfo
 */
const uploadSingleImage = (form: FormData) =>
  apiService.post<ProcessedImageInfo>('/api/admin/product-image/upload', form);

/**
 * 🔍 A4 - 根據圖片 ID 查詢單張圖片
 * GET /product-image/{image_id}
 * 回傳：ProcessedImageInfo
 */
const getImageById = (imageId: number) =>
  apiService.get<ProcessedImageInfo>(`/api/admin/product-image/${imageId}`);

/**
 * ➕ A5 - 新增圖片 metadata（不含圖片檔案）
 * POST /product-image/
 * 傳送：{ productId, fileName, isMain, isSelected }
 * 回傳：ProcessedImageInfo
 */
const addImageMeta = (payload: Partial<ProcessedImageInfo>) =>
  apiService.post<ProcessedImageInfo>('/api/admin/product-image/', payload);

/**
 * ✏️ A6 - 更新圖片 metadata
 * PATCH /product-image/{image_id}
 * 傳送：Partial<ProcessedImageInfo>
 * 回傳：ProcessedImageInfo
 */
const updateImageMeta = (imageId: number, patch: Partial<ProcessedImageInfo>) =>
  apiService.patch<ProcessedImageInfo>(`/api/admin/product-image/${imageId}`, patch);

const adminImageApi = {
  saveImageChanges,
  getProductImages,
  uploadSingleImage,
  getImageById,
  addImageMeta,
  updateImageMeta,
};

export default adminImageApi;
