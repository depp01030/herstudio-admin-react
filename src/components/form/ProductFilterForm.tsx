import React, { useState } from 'react';
import useProductStore from '../../stores/productStore';

const ProductFilterForm: React.FC = () => {
  const { filters, setFilters } = useProductStore();

  const [localFilters, setLocalFilters] = useState({ ...filters });

  const updateField = (key: keyof typeof localFilters, value: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters(localFilters);
  };

  const resetFilters = () => {
    const cleared = {
      id: undefined,
      name: undefined,
      stall: undefined,
      fromDate: undefined,
      source: undefined,
    };
    setLocalFilters(cleared);
    setFilters(cleared);
  };

  return (
    <form
      className="product-filter-form"
      onSubmit={handleSubmit}
      style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}
    >
      <input
        type="number"
        placeholder="商品 ID"
        value={localFilters.id ?? ''}
        onChange={(e) => updateField('id', e.target.value)}
      />
      <input
        type="text"
        placeholder="商品名稱"
        value={localFilters.name ?? ''}
        onChange={(e) => updateField('name', e.target.value)}
      />
      <input
        type="text"
        placeholder="檔口名稱"
        value={localFilters.stall ?? ''}
        onChange={(e) => updateField('stall', e.target.value)}
      />
      <input
        type="date"
        placeholder="建立起始日"
        value={localFilters.fromDate ?? ''}
        onChange={(e) => updateField('fromDate', e.target.value)}
      />
      <input
        type="text"
        placeholder="來源"
        value={localFilters.source ?? ''}
        onChange={(e) => updateField('source', e.target.value)}
      />

      <button type="submit">搜尋</button>
      <button type="button" onClick={resetFilters}>重設</button>
    </form>
  );
};

export default ProductFilterForm;
