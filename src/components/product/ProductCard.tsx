import React, { useState, useRef, MouseEvent, useEffect } from 'react';
import { Product } from '@/types/product';
import ProductCardHeader from './ProductCardHeader';
import ProductCardInfo from './ProductCardInfo';
import ProductCardImage from './ProductCardImage';
import { useProductCardActions } from '@/hooks/useProductCardActions';

interface ProductCardProps {
  product: Product;
  isSelected: boolean;
  onSelect: (id: number) => void;
  onUpdate?: (updated: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isSelected,
  onSelect,
  onUpdate,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [leftSectionWidth, setLeftSectionWidth] = useState(50);
  const isDraggingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null); 
  const actions = useProductCardActions(product);
  const { info, submit, deleteProduct } = actions;

  const toggleExpand = () => setIsExpanded((prev) => !prev);

  const handleSave = async () => {
    try {
      const saved = await submit();
      if (onUpdate) onUpdate(saved);
    } catch (err) {
      console.error('儲存失敗', err);
    }
  };

  const handleDelete = async () => {
    await deleteProduct(product.id);
  };

  const handleResizeStart = (e: MouseEvent) => {
    e.preventDefault();
    isDraggingRef.current = true;

    const handleMove = (moveEvent: MouseEvent) => {
      if (isDraggingRef.current && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const newWidth = ((moveEvent.clientX - rect.left) / rect.width) * 100;
        setLeftSectionWidth(Math.min(Math.max(newWidth, 20), 80));
      }
    };

    const handleEnd = () => {
      isDraggingRef.current = false;
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
  };

  useEffect(() => {
    return () => {
      window.removeEventListener('mousemove', () => {});
      window.removeEventListener('mouseup', () => {});
    };
  }, []);

  return (
    <div className={`product-card ${isSelected ? 'selected' : ''} ${isExpanded ? 'expanded' : ''}`}>
      <ProductCardHeader
        product={info.editableProduct}
        isSelected={isSelected}
        onSelect={onSelect}
        onToggleExpand={toggleExpand}
        isExpanded={isExpanded}
        onChange={info.updateField}
        onSave={handleSave}
        onDelete={handleDelete}
      />

      {isExpanded && (
        <div
          className="product-card-body"
          ref={containerRef}
          style={{ display: 'flex', flexDirection: 'row', position: 'relative', overflow: 'hidden' }}
        >
          <div
            className="product-card-left"
            style={{ width: `${leftSectionWidth}%`, padding: '10px', overflow: 'auto', flexShrink: 0 }}
          >
            <ProductCardInfo product={info.editableProduct} onChange={info.updateField} />
          </div>

          <div
            className="resizable-divider"
            style={{
              width: '8px',
              backgroundColor: '#e0e0e0',
              cursor: 'col-resize',
              zIndex: 10,
              position: 'relative',
              flexShrink: 0,
            }}
            onMouseDown={handleResizeStart}
          />

          <div
            className="product-card-right"
            style={{ width: `${100 - leftSectionWidth}%`, padding: '10px', overflow: 'auto', flexShrink: 0 }}
          >
            <ProductCardImage product={info.editableProduct} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
