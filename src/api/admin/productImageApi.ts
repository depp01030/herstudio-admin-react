// src/api/admin/productImageApi.ts
import axios from '../axiosInstance';
import { ProcessedImageInfo } from '@/types/productImage';
import { ADMIN_IMAGE_ROUTE } from '@/config/constants';

const adminImageApi = {
  // 💾 A1 - 儲存圖片編輯變更（送 FormData）
  saveImageChanges: (form: FormData) =>
    axios.post(`${ADMIN_IMAGE_ROUTE}/process`, form, {
      headers: {}, // ✅ 不設 Content-Type，讓瀏覽器自動加 boundary
    }).then(res => res.data),

  // 📦 A2 - 查詢商品所有圖片
  getProductImages: (productId: number) =>
    axios.get(`${ADMIN_IMAGE_ROUTE}/product/${productId}`).then(res => res.data),

  // 🖼️ A3 - 上傳單張圖片（送 FormData）
  uploadSingleImage: (form: FormData) =>
    axios.post(`${ADMIN_IMAGE_ROUTE}/upload`, form, {
      headers: {}, // ✅ 同樣不加 Content-Type
    }).then(res => res.data),

  // 🔍 A4 - 查詢單張圖片
  getImageById: (imageId: number) =>
    axios.get(`${ADMIN_IMAGE_ROUTE}/${imageId}`).then(res => res.data),

  // ➕ A5 - 新增圖片 metadata（非 FormData）
  addImageMeta: (payload: Partial<ProcessedImageInfo>) =>
    axios.post(`${ADMIN_IMAGE_ROUTE}`, payload).then(res => res.data),

  // ✏️ A6 - 更新圖片 metadata
  updateImageMeta: (imageId: number, patch: Partial<ProcessedImageInfo>) =>
    axios.patch(`${ADMIN_IMAGE_ROUTE}/${imageId}`, patch).then(res => res.data),
};

export default adminImageApi;
