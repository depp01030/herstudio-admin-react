import { create } from 'zustand';
import { ProductImage } from '@/types/productImage';
import { v4 as uuidv4 } from 'uuid';

interface ProductImageStore {
  imagesByProductId: Record<number, ProductImage[]>;

  // ✅ 批次處理指定商品的圖片
  setImagesByProductId: (productId: number, images: ProductImage[]) => void;
  addImageByProductId: (productId: number, image: ProductImage) => void;
  getImagesByProductId: (productId: number) => ProductImage[];
  updateImageByProductId: (productId: number, imageId: string | number, patch: Partial<ProductImage>) => void;

  // ✅ 單張圖片操作
  getImageById: (imageId: string | number) => ProductImage | undefined;
  updateImageById: (imageId: string | number, patch: Partial<ProductImage>) => void;

  // ✅ 測試 mock 圖片
  getMockImages: (productId: number) => ProductImage[];
}

const useProductImageStore = create<ProductImageStore>((set, get) => ({
  imagesByProductId: {},

  setImagesByProductId(productId, images) {
    set((state) => ({
      imagesByProductId: {
        ...state.imagesByProductId,
        [productId]: images,
      },
    }));
  },

  addImageByProductId(productId, image) {
    const current = get().imagesByProductId[productId] || [];
    set((state) => ({
      imagesByProductId: {
        ...state.imagesByProductId,
        [productId]: [...current, image],
      },
    }));
  },

  getImagesByProductId(productId) {
    return get().imagesByProductId[productId] || [];
  },

  updateImageByProductId(productId, imageId, patch) {
    set((state) => {
      const images = state.imagesByProductId[productId] || [];
      const updated = images.map((img) =>
        img.id === imageId || img.tempId === imageId
          ? { ...img, ...patch }
          : img
      );

      return {
        imagesByProductId: {
          ...state.imagesByProductId,
          [productId]: updated,
        },
      };
    });
  },

  getImageById(imageId) {
    const all = get().imagesByProductId;
    for (const images of Object.values(all)) {
      const found = images.find((img) => img.id === imageId || img.tempId === imageId);
      if (found) return found;
    }
    return undefined;
  },

  updateImageById(imageId, patch) {
    const state = get();
    const newMap: typeof state.imagesByProductId = {};

    for (const [pidStr, images] of Object.entries(state.imagesByProductId)) {
      const productId = Number(pidStr);
      newMap[productId] = images.map((img) =>
        img.id === imageId || img.tempId === imageId ? { ...img, ...patch } : img
      );
    }

    set({ imagesByProductId: newMap });
  },

  getMockImages(productId) {
    productId = 0;
    const base = `/images/sample/${productId}`;
    const mockImages: ProductImage[] = [
      {
        id: 101,
        tempId: uuidv4(),
        productId,
        fileName: 'main.jpg',
        url: `http://localhost:8000/images/stall3/product1/QrCode.jpg`,
        file: undefined,
        isMain: true,
        isSelected: true,
        action: 'original',
      },
      {
        id: 102,
        tempId: uuidv4(),
        productId,
        fileName: 'side.jpg',
        url: `${base}/main.jpg`,
        file: undefined,
        isMain: false,
        isSelected: true,
        action: 'original',
      },
      {
        id: 103,
        tempId: uuidv4(),
        productId,
        fileName: 'detail.jpg',
        url: `${base}/main.jpg`,
        file: undefined,
        isMain: false,
        isSelected: false,
        action: 'original',
      },
    ];
    return mockImages;
  },
}));

export default useProductImageStore;
