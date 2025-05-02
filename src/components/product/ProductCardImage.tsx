import React, { useEffect, useState } from 'react';
import { Product } from '@/types/product';
import { useProductCardActions } from '@/hooks/useProductCardActions';
import { ProductImage } from '@/types/productImage';

interface ProductCardImageProps {
  product: Product;
}

const ProductCardImage: React.FC<ProductCardImageProps> = ({ product }) => {
  const {
    image: {
      fetchImages,
      getImages,
      toggleSelected,
      setMainImage,
      markForDelete,
    },
  } = useProductCardActions(product);

  const [images, setImages] = useState<ProductImage[]>([]);

  useEffect(() => {
    fetchImages(product.id).then(() => {
      setImages(getImages(product.id));
    });
  }, [product.id]);

  // 更新本地顯示（不同步 store，只是重設狀態）
  const refresh = () => setImages(getImages(product.id));

  return (
    <div className="product-card-image-section">
      <h4>圖片管理</h4>

      <div className="image-folder-info" style={{ marginBottom: '0.5rem' }}>
        <span>來源資料夾：</span>
        <code>{product.itemFolder}</code>
      </div>

      <div
        className="image-list"
        style={{ display: 'flex', overflowX: 'auto', gap: '0.75rem' }}
      >
        {images.map((img) => (
          <div
            key={img.tempId || img.id}
            className="image-card"
            style={{
              position: 'relative',
              border: img.isMain ? '2px solid #3f51b5' : '1px solid #ccc',
              borderRadius: '4px',
              padding: '4px',
              width: '120px',
            }}
          >
            <img
              src={img.url}
              alt={img.fileName}
              style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '4px' }}
              onClick={() => {
                setMainImage(product.id, img.id || img.tempId!);
                refresh();
              }}
            />

            <div style={{ marginTop: '4px', display: 'flex', gap: '4px', justifyContent: 'space-between' }}>
              <label>
                <input
                  type="checkbox"
                  checked={img.isSelected}
                  onChange={() => {
                    toggleSelected(product.id, img.id || img.tempId!);
                    refresh();
                  }}
                /> 選取
              </label>
              <button
                onClick={() => {
                  markForDelete(product.id, img.id || img.tempId!);
                  refresh();
                }}
                style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}
              >
                🗑
              </button>
            </div>

            {img.isMain && (
              <div
                style={{
                  position: 'absolute',
                  top: 2,
                  left: 2,
                  background: 'rgba(63,81,181,0.8)',
                  color: 'white',
                  fontSize: '0.75rem',
                  padding: '2px 4px',
                  borderRadius: '3px',
                }}
              >主圖</div>
            )}

            {img.action === 'delete' && (
              <div
                style={{
                  position: 'absolute',
                  top: 2,
                  right: 2,
                  background: 'rgba(244,67,54,0.9)',
                  color: 'white',
                  fontSize: '0.75rem',
                  padding: '2px 4px',
                  borderRadius: '3px',
                }}
              >待刪除</div>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '1rem' }}>
        <p>（未來這裡將支援拖曳 / 貼上圖片上傳）</p>
      </div>
    </div>
  );
};

export default ProductCardImage;
