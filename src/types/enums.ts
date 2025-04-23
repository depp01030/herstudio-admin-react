/**
 * 商品狀態枚舉
 */
export enum ItemStatus {
  PRODUCT = "product"
}

/**
 * 物流選項枚舉
 */
export enum LogisticsOption {
  SEVEN_ELEVEN = "seven_eleven", // 7-ELEVEN
  FAMILY_MART = "familymart", // 全家
  HI_LIFE = "hilife", // 萊爾富
  SHOPEE_STORE_PICKUP = "shopee_store_pickup" // 蝦皮店到店
}

/**
 * 商品類型枚舉
 */
export enum CustomType {
  TOP = "top", // 女性上著
  BOTTOM = "bottom", // 女性下著
  DRESS = "dress", // 洋裝
  COAT = "coat", // 外套
  SKIRT = "skirt", // 裙子
  PANTS = "pants", // 褲子
  ACCESSORIES = "accessories", // 配飾
  SCARF = "scarf", // 圍巾
  OTHER = "other" // 其他
}

/**
 * 尺寸測量參數枚舉
 */
export enum SizeMetrics {
  SHOULDER = "shoulder", // 肩寬
  BUST = "bust", // 胸圍
  WAIST = "waist", // 腰圍
  HIP = "hip", // 臀圍
  LENGTH = "length", // 衣長
  SLEEVE = "sleeve", // 袖長
  INSEAM = "inseam" // 內檔長
}

/**
 * 獲取枚舉的顯示標籤（中文名稱）
 */
export const getItemStatusLabel = (status: ItemStatus): string => {
  const labels: Record<ItemStatus, string> = {
    [ItemStatus.PRODUCT]: "商品"
  };
  return labels[status] || status;
};

/**
 * 獲取物流選項的顯示標籤（中文名稱）
 */
export const getLogisticsOptionLabel = (option: LogisticsOption): string => {
  const labels: Record<LogisticsOption, string> = {
    [LogisticsOption.SEVEN_ELEVEN]: "7-ELEVEN",
    [LogisticsOption.FAMILY_MART]: "全家",
    [LogisticsOption.HI_LIFE]: "萊爾富",
    [LogisticsOption.SHOPEE_STORE_PICKUP]: "蝦皮店到店"
  };
  return labels[option] || option;
};

/**
 * 獲取商品類型的顯示標籤（中文名稱）
 */
export const getCustomTypeLabel = (type: CustomType): string => {
  const labels: Record<CustomType, string> = {
    [CustomType.TOP]: "女性上著",
    [CustomType.BOTTOM]: "女性下著",
    [CustomType.DRESS]: "洋裝",
    [CustomType.COAT]: "外套",
    [CustomType.SKIRT]: "裙子",
    [CustomType.PANTS]: "褲子",
    [CustomType.ACCESSORIES]: "配飾",
    [CustomType.SCARF]: "圍巾",
    [CustomType.OTHER]: "其他"
  };
  return labels[type] || type;
};

/**
 * 獲取尺寸測量參數的顯示標籤（中文名稱）
 */
export const getSizeMetricsLabel = (metric: SizeMetrics): string => {
  const labels: Record<SizeMetrics, string> = {
    [SizeMetrics.SHOULDER]: "肩寬",
    [SizeMetrics.BUST]: "胸圍",
    [SizeMetrics.WAIST]: "腰圍",
    [SizeMetrics.HIP]: "臀圍",
    [SizeMetrics.LENGTH]: "衣長",
    [SizeMetrics.SLEEVE]: "袖長",
    [SizeMetrics.INSEAM]: "內檔長"
  };
  return labels[metric] || metric;
};

/**
 * 所有商品類型選項
 */
export const CUSTOM_TYPE_OPTIONS = Object.values(CustomType).map(value => ({
  value,
  label: getCustomTypeLabel(value)
}));

/**
 * 所有物流選項
 */
export const LOGISTICS_OPTIONS = Object.values(LogisticsOption).map(value => ({
  value,
  label: getLogisticsOptionLabel(value)
}));

/**
 * 所有尺寸測量參數選項
 */
export const SIZE_METRICS_OPTIONS = Object.values(SizeMetrics).map(value => ({
  value,
  label: getSizeMetricsLabel(value)
}));