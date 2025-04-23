import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types/product';
import { ROUTES } from '../../config/constants';
import CardHeader from './CardHeader';
import CardLeftSection from './CardLeftSection';
import CardRightSection from './CardRightSection';
interface ProductCardProps {
  product: Product;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}


const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isSelected,
  onSelect,
  onDelete
}) => {
  // 展開/收合狀態
  const [isExpanded, setIsExpanded] = useState(false);

  // 切換展開/收合狀態
  const toggleExpand = () => {
    setIsExpanded(prev => !prev);
  };

  return (
    <div className={`product-card ${isSelected ? 'selected' : ''} ${isExpanded ? 'expanded' : ''}`}>
      <CardHeader
        product={product}
        isSelected={isSelected}
        onSelect={onSelect}
        onToggleExpand={toggleExpand}
        isExpanded={isExpanded}
      />
      
      {isExpanded && (
        <div className="product-card-body">
          <div className="product-card-left">
            <CardLeftSection product={product} />
          </div>
          <div className="product-card-right">
            <CardRightSection product={product} onDelete={onDelete} />
          </div>
        </div>
      )}
    </div>
  );
}  

export default ProductCard;