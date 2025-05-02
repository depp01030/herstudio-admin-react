import React from 'react';
import useProductStore from '@/stores/productStore';
import { useProductCardActions } from '@/hooks/useProductCardActions';
import ProductCard from './ProductCard';

const ProductListBody: React.FC = () => {
  const { items } = useProductStore();   
  return (
    <div className="product-list-body">
      {items.map((product) => ( 
        <ProductCard
          key={product.id}
          product={product}
          isSelected={false}
          onSelect={() => {}} 
        />
      ))}
    </div>
  );
};

export default ProductListBody;
