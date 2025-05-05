// src/hooks/useProductImageActions.ts

/**
 * 📦 useProductImageActions.ts
 * 提供圖片模組的所有操作與狀態管理。
 * 
 * ✅ 支援的圖片請求操作（按下儲存時會觸發）：
 *
 * A1. saveImageChanges(productId)
 *    - 傳入：FormData { product_id, images (json[]), file_tempId }
 *    - 回傳：{ images: ProcessedImageInfo[], message: {}, error: {} }
 *    - 目的：批次處理圖片的新增 / 更新 / 刪除行為
 * 
 * A2. fetchImages(productId)
 *    - 傳入：商品 ID
 *    - 回傳：目前使用 mock image
 *    - 目的：模擬從後端載入指定商品的圖片
 * 
 * A3. addNewImage(productId, file)
 *    - 傳入：商品 ID + 使用者上傳的 File
 *    - 回傳：加入到 imageStore（含 URL.createObjectURL 預覽）
 * 
 * A4. setMainImage(productId, imageId)
 *    - 傳入：商品 ID + 圖片 ID 或 tempId
 *    - 回傳：更新 store 中對應圖片的 isMain 為 true
 * 
 * A5. toggleSelected(productId, imageId)
 *    - 傳入：商品 ID + 圖片 ID 或 tempId
 *    - 回傳：更新 store 中對應圖片的 isSelected 狀態
 * 
 * A6. markForDelete(productId, imageId)
 *    - 傳入：商品 ID + 圖片 ID 或 tempId
 *    - 回傳：將該圖片標記為刪除（action = 'delete'）
 */

import { useCallback } from 'react';
import useProductImageStore from '@/stores/productImageStore';
import { ProductImage, ProductImageSubmission } from '@/types/productImage';
import caseConverter from '@/utils/caseConverter';
import { ImageAction } from '@/types/productImage';
import { v4 as uuidv4 } from 'uuid';
import adminImageApi from '@/api/admin/productImageApi';

const upgradeAction = (action: ImageAction): ImageAction =>
  action === 'original' ? 'update' : action;

export function useProductImageActions() {
  const { getImages, setImages, updateImage, getMockImages } = useProductImageStore();

  // A2. 載入圖片（mock）
  // 替換原本只吃 mock 的 fetchImages
  const fetchImages = useCallback(async (productId: number) => {
    const images = await adminImageApi.getProductImages(productId); // A2
    setImages(productId, images.map((img) => ({
      ...img,
      productId,
      action: 'original', // 從後端來的都當作原圖
    })));
  }, [setImages]);

  // A3. 新增圖片（user 上傳）
  const addNewImage = (productId: number, file: File) => {
    const tempId = uuidv4();
    const newImage: ProductImage = {
      productId,
      tempId,
      file,
      fileName: file.name,
      url: URL.createObjectURL(file),
      isMain: false,
      isSelected: true,
      action: 'new',
    };

    const current = getImages(productId);
    setImages(productId, [...current, newImage]);
  };

  // A4. 設定主圖
  const setMainImage = (productId: number, imageId: string | number) => {
    const images = getImages(productId);
  
    const updated = images.map((img) => {
      const isTarget = img.id === imageId || img.tempId === imageId;
      return {
        ...img,
        isMain: isTarget,
        action: isTarget ? upgradeAction(img.action) : img.isMain ? upgradeAction(img.action) : img.action,
      };
    });
  
    setImages(productId, updated);
  };
  
  
  

  // A5. 切換是否選取
  const toggleSelected = (productId: number, imageId: string | number) => {
    const current = getImages(productId);
    const target = current.find(img => img.id === imageId || img.tempId === imageId);
    if (!target) return;

    updateImage(productId, imageId, {
      isSelected: !target.isSelected,
      action: upgradeAction(target.action),
    });
  };

  // A6. 標記刪除
  const markForDelete = (productId: number, imageId: string | number) => {
    updateImage(productId, imageId, {
      action: 'delete',
    });
  };

  // 組出 JSON metadata 陣列
  const buildImageSubmission = (productId: number): ProductImageSubmission[] => {
    const images = getImages(productId);
    return images
      .filter(img => img.action !== 'original')
      .map(img => ({
        id: img.id,
        tempId: img.tempId,
        action: img.action,
        isMain: img.isMain,
        isSelected: img.isSelected,
      }));
  };

  // 封裝要送出的 FormData（含 metadata 與圖片檔案）
  const buildImageFormData = (productId: number): FormData => {
    const images = getImages(productId);
    const formData = new FormData();
    const submission: ProductImageSubmission[] = [];

    for (const img of images) {
      if (img.action === 'original') continue;

      submission.push({
        id: img.id,
        tempId: img.tempId,
        action: img.action,
        isMain: img.isMain,
        isSelected: img.isSelected,
      });

      if (img.action === 'new' && img.file && img.tempId) {
        formData.append(`file_${img.tempId}`, img.file);
      }
    } 
    
    formData.append('product_id', String(productId));
    formData.append('images', JSON.stringify(caseConverter.toSnakeCase(submission))); // ✅ 修正點
    return formData;
  };

  const saveImageChanges = async (productId: number) => {
    const formData = buildImageFormData(productId);
    const response = await adminImageApi.saveImageChanges(formData);
    const updates = response.images;
  
    // 所有當前圖片
    const current = getImages(productId);
  
    // 先依照 tempId 或 id 更新原本的圖片，避免留下重複的 temp 圖片
    updates.forEach((update) => {
      const key = update.tempId ?? update.id;
      if (!key) return;
  
      updateImage(productId, key, {
        id: update.id,
        productId,
        fileName: update.fileName,
        url: update.url,
        isMain: update.isMain,
        isSelected: update.isSelected,
        action: 'original',
      });
    });
  
    // 🔸 移除已刪除的圖片
    const final = getImages(productId).filter((img) => img.action !== 'delete');
  
    // ✅ 更新 store
    setImages(productId, final);
  };
  
  
  // 新增：取得主圖或第一張圖片的 URL（給 header 顯示預覽圖）
  const getPreviewImageUrl = (productId: number): string | undefined => {
    const images = getImages(productId);
    const main = images.find((img) => img.isMain && img.action !== 'delete');
    const first = images.find((img) => img.action !== 'delete');
    return main?.url || first?.url;
  };

  return {
    getImages,
    fetchImages,
    addNewImage,
    setMainImage,
    toggleSelected,
    markForDelete,
    buildImageSubmission,
    buildImageFormData,
    saveImageChanges, // ✅ A1 改名並加入導出
    getPreviewImageUrl, // ✅ 導出這個
  };
}
