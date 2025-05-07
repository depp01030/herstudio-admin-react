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
  const {
    getImagesByProductId,
    setImagesByProductId,
    addImageByProductId,
    updateImageByProductId,
    updateImageById,
  } = useProductImageStore();

  // ✅ A2: 載入圖片
  const fetchImages = useCallback(async (productId: number) => {
    console.log('fetchImages', productId);
    if (productId === -1) return;
    const images = await adminImageApi.getProductImages(productId);
    setImagesByProductId(productId, images.map((img: any) => ({
      ...img,
      productId,
      action: 'original',
    })));
  }, [setImagesByProductId]);

  // ✅ A3: 新增圖片（上傳）
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
    addImageByProductId(productId, newImage);
  };

  // ✅ A4: 設定主圖
  const setMainImage = (productId: number, imageId: string | number) => {
    const images = getImagesByProductId(productId);
    const updated = images.map((img) => {
      const isTarget = img.id === imageId || img.tempId === imageId;
      return {
        ...img,
        isMain: isTarget,
        action: isTarget || img.isMain ? upgradeAction(img.action) : img.action,
      };
    });
    setImagesByProductId(productId, updated);
  };

  // ✅ A5: 切換選取狀態
  const toggleSelected = (productId: number, imageId: string | number) => {
    const current = getImagesByProductId(productId);
    const target = current.find(img => img.id === imageId || img.tempId === imageId);
    if (!target) return;
    updateImageByProductId(productId, imageId, {
      isSelected: !target.isSelected,
      action: upgradeAction(target.action),
    });
  };

  // ✅ A6: 標記刪除
  const markForDelete = (productId: number, imageId: string | number) => {
    updateImageByProductId(productId, imageId, {
      action: 'delete',
    });
  };

  // ✅ 將圖片重綁到新的商品 ID（for 新增商品）
  const rebindImageProductId = (oldProductId: number, newProductId: number) => {
    const oldImages = getImagesByProductId(oldProductId);
    const moved = oldImages.map((img) => ({ ...img, productId: newProductId }));
    setImagesByProductId(newProductId, moved);
    setImagesByProductId(oldProductId, []);
  };

  // ✅ 生成圖片 metadata（for JSON 傳送）
  const buildImageSubmission = (productId: number): ProductImageSubmission[] => {
    const images = getImagesByProductId(productId);
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

  // ✅ 建立 FormData（包含檔案）
  const buildImageFormData = (productId: number): FormData => {
    const images = getImagesByProductId(productId);
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
    formData.append('images', JSON.stringify(caseConverter.toSnakeCase(submission)));
    return formData;
  };

  // ✅ A1: 儲存圖片變動
  const saveImageChanges = async (productId: number) => {
    const formData = buildImageFormData(productId);
    const response = await adminImageApi.saveImageChanges(formData);
    const updates = response.images;
  
    // 取得舊的圖片陣列
    const currentImages = getImagesByProductId(productId);
  
    // 合併後端回傳的圖片
    const updatedImages = currentImages
      .filter((img) => img.action !== 'delete') // 移除標記刪除的圖片
      .map((img) => {
        const updated = updates.find((update: { tempId: string | undefined; id: number | undefined; }) => update.tempId === img.tempId || update.id === img.id);
        return updated
          ? { ...img, ...updated, action: 'original' } // 更新圖片資料
          : img;
      });
  
    // 新增後端回傳中不存在於舊陣列的圖片
    updates.forEach((update: { tempId: string | undefined; id: number | undefined; }) => {
      if (!currentImages.some((img) => img.tempId === update.tempId || img.id === update.id)) {
        updatedImages.push({ ...update, action: 'original' });
      }
    });
  
    // 更新到 imageStore
    setImagesByProductId(productId, updatedImages);
  };

  // ✅ 提供預覽圖（主圖優先）
  const getPreviewImageUrl = (productId: number): string | undefined => {
    const images = getImagesByProductId(productId);
    const main = images.find((img) => img.isMain && img.action !== 'delete');
    const first = images.find((img) => img.action !== 'delete');
    return main?.url || first?.url;
  };

  return {
    getImagesByProductId,
    fetchImages,
    addNewImage,
    setMainImage,
    toggleSelected,
    markForDelete,
    rebindImageProductId,
    buildImageSubmission,
    buildImageFormData,
    saveImageChanges,
    getPreviewImageUrl,
  };
}
