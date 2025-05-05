import React, { useEffect, useRef } from 'react';
import { Product } from '@/types/product';
import { useProductCardActions } from '@/hooks/useProductCardActions';

interface ProductCardImageProps {
  product: Product;
}

const ProductCardImage: React.FC<ProductCardImageProps> = ({ product }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    image: {
      fetchImages,
      getImages,
      toggleSelected,
      setMainImage,
      markForDelete,
      addNewImage,
    },
  } = useProductCardActions(product);

  const images = getImages(product.id);

  useEffect(() => {
    const existing = getImages(product.id);
    if (!existing || existing.length === 0) {
      fetchImages(product.id);
    }
  }, [product.id, fetchImages, getImages]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      addNewImage(product.id, files[i]);
    }

    e.target.value = '';
  };

  return (
    <div className="product-card-image-section">
      <h4>圖片管理</h4>

      <div className="image-folder-info" style={{ marginBottom: '0.5rem' }}>
        <span>來源資料夾：</span>
        <code>{product.itemFolder}</code>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <button onClick={() => fileInputRef.current?.click()}>匯入圖片</button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>

      <div
        className="image-list"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem',
          maxHeight: '300px',
          overflowY: 'auto',
        }}
      >
        {images.map((img) => {
          const key = img.tempId || img.id!;
          return (
            <div
              key={key}
              className="image-card"
              style={{
                position: 'relative',
                border: img.isSelected ? '2px solid #3f51b5' : '1px solid #ccc',
                borderRadius: '4px',
                padding: '4px',
                width: '120px',
              }}
            >
              <img
                src={img.url}
                alt={img.fileName}
                style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '4px' }}
                onClick={() => toggleSelected(product.id, key)}
              />

              <div style={{ marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px' }}>
                  <input
                    type="radio"
                    name={`main-image-${product.id}`}
                    checked={img.isMain}
                    onChange={() => setMainImage(product.id, key)}
                  />{' '}
                  主圖
                </label>

                <button
                  onClick={() => markForDelete(product.id, key)}
                  style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer', fontSize: '12px' }}
                >
                  🗑 刪除
                </button>
              </div>

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
                >
                  待刪除
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: '1rem' }}>
        <p>（未來這裡將支援拖曳 / 貼上圖片上傳）</p>
      </div>
    </div>
  );
};

export default ProductCardImage;
