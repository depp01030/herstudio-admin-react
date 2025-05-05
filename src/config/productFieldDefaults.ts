// src/config/productFieldDefaults.ts

// ⛳ 1. 型別定義
export type ProductTypeKey = 'top' | 'pants' | 'dress' | 'coat' | 'skirt';
export type SizeMetricKey = 'shoulder' | 'chest' | 'length' | 'sleeve' | 'waist' | 'skirtLength';

// 🏷 2. 商品類別的中文標籤對照表
export const productTypeLabelMap: Record<ProductTypeKey, string> = {
  top: '女性上著',
  pants: '女性下著',
  dress: '洋裝',
  coat: '外套',
  skirt: '裙子',
};

// 📏 3. 尺寸欄位的中文標籤對照表
export const sizeMetricLabelMap: Record<SizeMetricKey, string> = {
  shoulder: '肩寬',
  chest: '胸圍',
  length: '衣長',
  sleeve: '袖長',
  waist: '腰圍',
  skirtLength: '裙長',
};

// 📚 4. 每種商品類別對應的預設尺寸欄位
export const defaultSizeMetricsMap: Record<ProductTypeKey, SizeMetricKey[]> = {
  top: ['shoulder', 'chest', 'length'],
  pants: ['waist', 'length'],
  dress: ['shoulder', 'chest', 'waist', 'skirtLength'],
  coat: ['shoulder', 'chest', 'sleeve', 'length'],
  skirt: ['waist', 'skirtLength'],
};

export const defaultSizeOptions = ['S', 'M', 'L', 'XL', 'Free'];
export const defaultColorOptions = ['紅', '黃', '藍', '黑', '白'];