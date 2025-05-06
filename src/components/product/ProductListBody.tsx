// src/components/product/ProductListBody.tsx
import React from 'react';
import { Button } from '@mui/material';
import { useProductCardActions } from '@/hooks/useProductCardActions';
import useProductStore from '@/stores/productStore';
import { useAuthStore } from '@/stores/authStore';
import ProductCard from './ProductCard';


const ProductListBody: React.FC = () => {
  const { getAllProducts } = useProductStore();
  const products = getAllProducts();
  const { addEmptyProduct } = useProductCardActions(); // ✅ 已提供的 hook
  const { hasPermission } = useAuthStore(); 

  return (
    <div className="product-list-body">
      {hasPermission('canEdit') && <Button
        variant="contained"
        onClick={addEmptyProduct}
        sx={{ mb: 2 }}
      >
        新增商品
      </Button>
      }

      {products.map((product) => (
        <ProductCard
          key={product.id ?? `temp-${product.itemFolder}`}
          product={product}
          isSelected={false}
          onSelect={() => {}}
        />
      ))}
    </div>
  );
};

export default ProductListBody;
