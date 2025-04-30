import React from 'react';
import useProductStore from '../../stores/productStore';
import ProductCard from './ProductCard';

const ProductListBody: React.FC = () => {
  const { items } = useProductStore();

  return (
    <div className="product-list-body">
      {items.map((product) => (
        <ProductCard key={product.id} product={product} isSelected={false} onSelect={function (id: number): void {
          throw new Error('Function not implemented.');
        } } onDelete={function (id: number): void {
          throw new Error('Function not implemented.');
        } } />
      ))}
    </div>
  );
};

export default ProductListBody;