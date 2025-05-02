import { useCallback } from 'react';
import useProductImageStore from '@/stores/productImageStore';
import { ProductImage, ProductImageSubmission } from '@/types/productImage';
import { ImageAction } from '@/types/productImage';
import { v4 as uuidv4 } from 'uuid';

// ✅ 封裝轉換邏輯：如果是 original 圖片，一旦被操作就轉成 update
const upgradeAction = (action: ImageAction): ImageAction =>
  action === 'original' ? 'update' : action;

/**
 * 提供圖片相關的狀態管理與提交處理函式
 * 包含：取得、設定主圖、切換選取、標記刪除、新增圖片、打包 FormData 等
 */
export function useProductImageActions() {
  const { getImages, setImages, getMockImages } = useProductImageStore();

  /**
   * 取得 mock 圖片資料，模擬從後端取得的圖片（開發用）
   */
  const fetchImages = useCallback(async (productId: number) => {
    const mockImages = getMockImages(productId);
    setImages(productId, mockImages);
  }, [getMockImages, setImages]);

  /**
   * 使用者上傳新圖片時，建立圖片對象並加到 store 中
   * - 會產生唯一 tempId
   * - 產生預覽用的 URL
   */
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

  /**
   * 設定某張圖為主圖（只能有一張 isMain = true）
   * - 如果被設為主圖，且原本是 original，則改為 update
   */
  const setMainImage = (productId: number, imageId: string | number) => {
    const current = getImages(productId);
    const updated = current.map(img => {
      const isTarget = img.id === imageId || img.tempId === imageId;
      return {
        ...img,
        isMain: isTarget,
        action: isTarget ? upgradeAction(img.action) : img.action,
      };
    });
    setImages(productId, updated);
  };

  /**
   * 切換是否選取上傳（checkbox 控制）
   * - original 圖片若變動也會升級為 update
   */
  const toggleSelected = (productId: number, imageId: string | number) => {
    const current = getImages(productId);
    const updated = current.map(img => {
      const isTarget = img.id === imageId || img.tempId === imageId;
      return isTarget
        ? {
            ...img,
            isSelected: !img.isSelected,
            action: upgradeAction(img.action),
          }
        : img;
    });
    setImages(productId, updated);
  };

  /**
   * 標記刪除圖片（將 action 設為 delete）
   * - 原圖或新圖皆可標記刪除
   */
  const markForDelete = (productId: number, imageId: string | number) => {
    const current = getImages(productId);
    const updated = current.map(img =>
      img.id === imageId || img.tempId === imageId
        ? { ...img, action: 'delete' as ImageAction }
        : img
    );
    setImages(productId, updated);
  };

  /**
   * 產生送出用的圖片資料 JSON（不包含檔案）
   * - 只保留 new / update / delete 圖片（略過 original）
   */
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

  /**
   * 建立 FormData，包含：
   * - images（JSON.stringify(ProductImageSubmission[])）
   * - file_tempId（每張圖片的 File）
   */
  const buildImageFormData = (productId: number): FormData => {
    const images = getImages(productId);
    const formData = new FormData();

    const submission: ProductImageSubmission[] = [];

    for (const img of images) {
      if (img.action === 'original') continue;

      // 加入 metadata
      submission.push({
        id: img.id,
        tempId: img.tempId,
        action: img.action,
        isMain: img.isMain,
        isSelected: img.isSelected,
      });

      // 加入圖片檔案
      if (img.action === 'new' && img.file && img.tempId) {
        formData.append(`file_${img.tempId}`, img.file);
      }
    }

    formData.append('images', JSON.stringify(submission));
    return formData;
  };

  return {

    getImages, // ✅ 新增這行
    fetchImages,
    addNewImage,
    setMainImage,
    toggleSelected,
    markForDelete,
    buildImageSubmission,
    buildImageFormData,
  };
}
