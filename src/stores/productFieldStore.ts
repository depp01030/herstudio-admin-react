import { create } from 'zustand';
import {
  ProductTypeKey,
  SizeMetricKey,
  productTypeLabelMap as defaultProductTypeLabelMap,
  sizeMetricLabelMap as defaultSizeMetricLabelMap,
  defaultSizeMetricsMap as defaultMetricMap,
  defaultSizeOptions,
  defaultColorOptions,
} from '@/config/productFieldDefaults';

interface ProductFieldStore {
  productTypeLabelMap: Record<ProductTypeKey, string>;
  sizeMetricLabelMap: Record<SizeMetricKey, string>;
  defaultSizeMetricsMap: Record<ProductTypeKey, SizeMetricKey[]>;
  defaultSizeOptions: string[];
  defaultColorOptions: string[];

  // setter
  setProductTypeLabelMap: (map: Record<ProductTypeKey, string>) => void;
  setSizeMetricLabelMap: (map: Record<SizeMetricKey, string>) => void;
  setDefaultSizeMetricsMap: (map: Record<ProductTypeKey, SizeMetricKey[]>) => void;
  setDefaultSizeOptions: (options: string[]) => void;
  setDefaultColorOptions: (options: string[]) => void;

  // helper
  getMetricLabel: (key: string) => string;
  getMetricKey: (label: string) => SizeMetricKey | string;
  getDefaultMetricsFor: (type: string) => SizeMetricKey[];
}

const useProductFieldStore = create<ProductFieldStore>((set, get) => ({
  // 預設值
  productTypeLabelMap: defaultProductTypeLabelMap,
  sizeMetricLabelMap: defaultSizeMetricLabelMap,
  defaultSizeMetricsMap: defaultMetricMap,
  defaultSizeOptions,
  defaultColorOptions,

  // setter
  setProductTypeLabelMap: (map) => set({ productTypeLabelMap: map }),
  setSizeMetricLabelMap: (map) => set({ sizeMetricLabelMap: map }),
  setDefaultSizeMetricsMap: (map) => set({ defaultSizeMetricsMap: map }),
  setDefaultSizeOptions: (options) => set({ defaultSizeOptions: options }),
  setDefaultColorOptions: (options) => set({ defaultColorOptions: options }),

  // 透過英文 key 取得中文 label，找不到就回傳原始 key
  getMetricLabel: (key) => {
    const map = get().sizeMetricLabelMap;
    return map[key as SizeMetricKey] ?? key;
  },

  // 透過中文 label 取得英文 key，找不到就回傳 label 本身
  getMetricKey: (label) => {
    const map = get().sizeMetricLabelMap;
    const found = Object.entries(map).find(([, v]) => v === label);
    return found?.[0] as SizeMetricKey || label;
  },

  // 根據商品類別取得預設欄位（英文 key 陣列）
  getDefaultMetricsFor: (type) => {
    const map = get().defaultSizeMetricsMap;
    return map[type as ProductTypeKey] ?? [];
  },
}));

export default useProductFieldStore;
