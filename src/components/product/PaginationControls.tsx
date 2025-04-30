import React from 'react';
import useProductStore from '@/stores/productStore';

const PaginationControls: React.FC = () => {
  const { hasMore, append } = useProductStore();

  return (
    <div className="pagination-controls">
      {hasMore && (
        <button onClick={append} className="load-more-button">
          載入更多
        </button>
      )}
    </div>
  );
};

export default PaginationControls;