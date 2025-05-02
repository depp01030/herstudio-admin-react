// src/stores/productImageStore.ts

import { create } from 'zustand';
import { ProductImage } from '@/types/productImage';
import { v4 as uuidv4 } from 'uuid';

interface ProductImageStore {
  imagesByProductId: Record<number, ProductImage[]>;
  setImages: (productId: number, images: ProductImage[]) => void;
  getImages: (productId: number) => ProductImage[];
  getMockImages: (productId: number) => ProductImage[];
}

const useProductImageStore = create<ProductImageStore>((set, get) => ({
  imagesByProductId: {},

  setImages(productId, images) {
    set((state) => ({
      imagesByProductId: {
        ...state.imagesByProductId,
        [productId]: images,
      },
    }));
  },

  getImages(productId) {
    return get().imagesByProductId[productId] || [];
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
        url: `${base}/main.jpg`,
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
