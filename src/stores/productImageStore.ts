import { create } from 'zustand';
import { ProductImage } from '@/types/productImage';
import { v4 as uuidv4 } from 'uuid';

interface ProductImageStore {
  imagesByProductId: Record<number, ProductImage[]>;

  setImages: (productId: number, images: ProductImage[]) => void;
  getImages: (productId: number) => ProductImage[];
  updateImage: (productId: number, imageId: string | number, patch: Partial<ProductImage>) => void;
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

  updateImage(productId, imageId, patch) {
    set((state) => {
      const images = state.imagesByProductId[productId] || [];
      const updated = images.map((img) => {
        const isMatch = img.id === imageId || img.tempId === imageId;
        if (!isMatch) return img;
        return {
          ...img,
          ...patch,
          tempId: undefined,
          file: undefined,
        };
      });

      return {
        imagesByProductId: {
          ...state.imagesByProductId,
          [productId]: updated,
        },
      };
    });
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
