import React, { useState, useRef, MouseEvent, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types/product';
import { ROUTES } from '../../config/constants';
import CardHeader from './CardHeader';
import CardLeftSection from './CardLeftSection';
import CardRightSection from './CardRightSection';

interface ProductCardProps {
  product: Product;
  isSelected: boolean;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
  onUpdate?: (updated: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isSelected,
  onSelect,
  onDelete,
  onUpdate
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [editableProduct, setEditableProduct] = useState<Product>(product);
  const [leftSectionWidth, setLeftSectionWidth] = useState(50); // percentage
  const isDraggingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleExpand = () => {
    setIsExpanded(prev => !prev);
  };

  const handleFieldChange = (field: keyof Product, value: any) => {
    setEditableProduct(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(editableProduct);
    }
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingRef.current = true;

    const handleResizeMove = (moveEvent: MouseEvent) => {
      if (isDraggingRef.current && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const newLeftWidth = ((moveEvent.clientX - containerRect.left) / containerRect.width) * 100;
        // Limit resizing between 20% and 80%
        setLeftSectionWidth(Math.min(Math.max(newLeftWidth, 20), 80));
      }
    };

    const handleResizeEnd = () => {
      isDraggingRef.current = false;
      window.removeEventListener('mousemove', handleResizeMove);
      window.removeEventListener('mouseup', handleResizeEnd);
    };

    window.addEventListener('mousemove', handleResizeMove);
    window.addEventListener('mouseup', handleResizeEnd);
  };

  // Clean up event listeners when component unmounts
  useEffect(() => {
    return () => {
      window.removeEventListener('mousemove', () => {});
      window.removeEventListener('mouseup', () => {});
    };
  }, []);

  return (
    <div className={`product-card ${isSelected ? 'selected' : ''} ${isExpanded ? 'expanded' : ''}`}>
      <CardHeader
        product={editableProduct}
        isSelected={isSelected}
        onSelect={onSelect}
        onToggleExpand={toggleExpand}
        isExpanded={isExpanded}
        onChange={handleFieldChange}
        onSave={handleSave}
        onDelete={() => onDelete(product.id)}
      />

      {isExpanded && (
        <div 
          className="product-card-body" 
          ref={containerRef}
          style={{ 
            display: 'flex', 
            flexDirection: 'row',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div className="product-card-left" style={{ 
            width: `${leftSectionWidth}%`, 
            padding: '10px',
            overflow: 'auto',
            flexShrink: 0
          }}>
            <CardLeftSection
              product={editableProduct}
              onChange={handleFieldChange}
            />
          </div>
          
          {/* Resizable divider */}
          <div 
            className="resizable-divider"
            style={{
              width: '8px',
              backgroundColor: '#e0e0e0',
              cursor: 'col-resize',
              zIndex: 10,
              position: 'relative',
              flexShrink: 0,
              transition: 'background-color 0.2s',
              '&:hover': {
                backgroundColor: '#aaa',
              }
            }}
            onMouseDown={handleResizeStart}
          />
          
          <div className="product-card-right" style={{ 
            width: `${100 - leftSectionWidth}%`,
            padding: '10px',
            overflow: 'auto',
            flexShrink: 0
          }}>
            <CardRightSection
              product={editableProduct}
              onDelete={onDelete}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
