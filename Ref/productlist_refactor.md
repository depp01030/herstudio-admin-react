# 📦 Refactor: ProductList Page（模組拆分設計）

## 🎯 重構目標

- 模組化頁面結構：拆分為「篩選器 FilterForm」、「商品清單 ProductListBody」、「頁數控制 PaginationControls」
- 使用 Zustand 集中管理：商品列表、篩選條件、頁數資訊等狀態
- 提升可讀性與可測性，利於日後功能擴充（如匯出、批次刪除、快取等）

---

## 📁 目標檔案結構（建議基於你目前結構）

```
src/
├── pages/products/
│   └── ProductList.tsx              ← 頁面總控組合
├── components/form/
│   └── ProductFilterForm.tsx        ← 篩選器元件
├── components/product/
│   ├── ProductListBody.tsx          ← 商品清單渲染（loop 卡片）
│   └── PaginationControls.tsx       ← 載入更多／分頁按鈕
├── stores/
│   └── productStore.ts              ← Zustand 管理商品列表與篩選條件
```

---

## 🧩 各模組說明與責任劃分

### ✅ `ProductList.tsx`

```tsx
export default function ProductList() {
  return (
    <>
      <ProductFilterForm />
      <ProductListBody />
      <PaginationControls />
    </>
  );
}
```

---

### ✅ `ProductFilterForm.tsx`

- 顯示欄位：stall、name、status、fromDate、id
- 每次修改欄位即呼叫 `store.setFilters()` → 觸發 `fetch()`
- 可額外加上重設按鈕

```tsx
export default function ProductFilterForm() {
  const { filters, setFilters } = useProductStore();
  return (
    <form>
      <input name="stall" value={filters.stall} onChange={e => setFilters({ stall: e.target.value })} />
      {/* 其他欄位... */}
    </form>
  );
}
```

---

### ✅ `ProductListBody.tsx`

- 使用 `store.items` 渲染 `ProductCard` 清單
- 未來可改為虛擬捲動列表 / skeleton loading

```tsx
export default function ProductListBody() {
  const { items } = useProductStore();
  return (
    <div>
      {items.map(product => <ProductCard key={product.id} product={product} />)}
    </div>
  );
}
```

---

### ✅ `PaginationControls.tsx`

- 顯示「載入更多」按鈕
- 由 `hasMore` 判斷是否繼續載入
- 呼叫 `append()` 增加下一頁

```tsx
export default function PaginationControls() {
  const { hasMore, append } = useProductStore();
  return (
    <div>
      {hasMore && <button onClick={append}>載入更多</button>}
    </div>
  );
}
```

---

## 🧠 Zustand Store 欄位設計

```ts
interface ProductStore {
  items: Product[];
  filters: ProductQueryParams;
  page: number;
  pageSize: number;
  hasMore: boolean;
  fetch: () => Promise<void>;
  append: () => Promise<void>;
  setFilters: (filters: Partial<ProductQueryParams>) => void;
  update: (id: number, data: Partial<Product>) => Promise<void>;
  remove: (id: number) => Promise<void>;
}
```

---

## ✅ 實作順序建議

1. ✅ 建立 `productStore.ts`，搬移原先 state/logic
2. ✅ 拆出 `ProductFilterForm.tsx`
3. ✅ 拆出 `ProductListBody.tsx`
4. ✅ 拆出 `PaginationControls.tsx`
5. ✅ 最終整理 `ProductList.tsx` 成為組裝頁

---

這份文件作為 ProductList 頁面拆分與 Zustand 重構的開發指引文件，適用於模組化團隊開發，亦能支援日後 UI 擴充與狀態共用。

