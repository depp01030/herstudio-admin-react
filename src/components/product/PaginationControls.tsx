import React from 'react';
import useProductStore from '@/stores/productStore';
import { useProductActions } from '@/hooks/useProductsActions';

const PaginationControls: React.FC = () => {
  const { hasMore } = useProductStore();
  const { appendMoreProducts } = useProductActions(); // ✅ 正確來源

  return (
    <div className="pagination-controls">
      {hasMore && (
        <button onClick={appendMoreProducts} className="load-more-button">
          載入更多
        </button>
      )}
    </div>
  );
};

export default PaginationControls;
