import React from 'react';
import useProductStore from '@/stores/productStore';
import { useProductCardActions } from '@/hooks/useProductCardActions';
import ProductCard from './ProductCard';
import { Button } from '@mui/material';

const ProductListBody: React.FC = () => {
  const { items } = useProductStore();   
  const { addEmptyProduct } = useProductCardActions(); // 🆕 假設你這裡有提供

  return (
    <div className="product-list-body">
      {/* 新增按鈕 */}
      <Button
        variant="contained"
        onClick={addEmptyProduct}
        sx={{ mb: 2 }}
      >
        新增商品
      </Button>

      {/* 渲染所有商品卡片 */}
      {items.map((product) => ( 
        <ProductCard
          key={product.id ?? `temp-${product.itemFolder}`} // 支援未建立的卡片
          product={product}
          isSelected={false}
          onSelect={() => {}} 
        />
      ))}
    </div>
  );
};

export default ProductListBody;
