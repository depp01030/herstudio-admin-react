import React, { useState } from 'react';
import useProductStore from '@/stores/productStore';
import { useProductActions } from '@/hooks/useProductsActions'; // ✅ 引入正確的 hook

const ProductFilterForm: React.FC = () => {
  const { filters } = useProductStore();
  const { setFilters, resetFilters } = useProductActions(); // ✅ 使用這個，不是直接改 store
  const [localFilters, setLocalFilters] = useState({ ...filters });

  const updateField = (key: keyof typeof localFilters, raw: string) => {
    let value: string | number | undefined = raw.trim();

    if (key === 'id') {
      value = value === '' ? undefined : Number(value);
      if (Number.isNaN(value)) value = undefined;
    } else {
      value = value === '' ? undefined : value;
    }

    setLocalFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sanitized = Object.fromEntries(
      Object.entries(localFilters).filter(([_, v]) => v !== undefined)
    );
    setFilters(sanitized); // ✅ 正確版本，會觸發 fetch
  };

  const handleReset = () => {
    const cleared = {
      id: undefined,
      name: undefined,
      stall: undefined,
      fromDate: undefined,
      source: undefined,
    };
    setLocalFilters(cleared);
    resetFilters(); // ✅ 正確版本
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
      <button type="button" onClick={handleReset}>重設</button>
    </form>
  );
};

export default ProductFilterForm;
