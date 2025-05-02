// utils/normalize.ts
import { Product } from '@/types/product';

// snake_case → camelCase
export function fromApiProduct(data: any): Product {
  return {
    id: data.id,
    name: data.name,
    purchasePrice: data.purchase_price,
    totalCost: data.total_cost,
    price: data.price,
    description: data.description,
    stallName: data.stall_name,
    source: data.source,
    sourceUrl: data.source_url,
    itemFolder: data.item_folder,
    mainImage: data.main_image,
    selectedImages: data.selected_images ?? [],
    sizeMetrics: data.size_metrics ?? {},
    sizeNote: data.size_note,
    colors: data.colors ?? [],
    sizes: data.sizes ?? [],
    itemStatus: data.item_status,
    customType: data.custom_type,
    material: data.material,
    realStock: data.real_stock,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    shopeeCategoryId: data.shopee_category_id,
  };
}

// camelCase → snake_case
export function toApiProduct(data: Partial<Product>): any {
  return {
    id: data.id,
    name: data.name,
    purchase_price: data.purchasePrice,
    total_cost: data.totalCost,
    price: data.price,
    description: data.description,
    stall_name: data.stallName,
    source: data.source,
    source_url: data.sourceUrl,
    item_folder: data.itemFolder,
    main_image: data.mainImage,
    selected_images: data.selectedImages,
    size_metrics: data.sizeMetrics,
    size_note: data.sizeNote,
    colors: data.colors,
    sizes: data.sizes,
    item_status: data.itemStatus,
    custom_type: data.customType,
    material: data.material,
    real_stock: data.realStock,
    created_at: data.createdAt,
    updated_at: data.updatedAt,
    shopee_category_id: data.shopeeCategoryId,
  };
}
