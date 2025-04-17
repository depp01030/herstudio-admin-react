
# 📚 React 專案命名規則指南

> 遵循社群慣例，保持一致性與可預期性。

| 類型 | 命名風格 | 範例 |
|------|----------|------|
| **Component (元件)** | `PascalCase` 檔名與函式名一致 | `ProductCard.jsx`, `ImageModule.jsx` |
| **Hook (自訂邏輯)** | `camelCase` 且以 `use` 開頭 | `useProductForm.js`, `useResizableLayout.js` |
| **Page 元件** | `PascalCase` | `ProductListPage.jsx` |
| **變數 / 函式** | `camelCase` | `productList`, `handleSave()` |
| **常數** | `SCREAMING_SNAKE_CASE` | `API_BASE_URL`, `PRODUCTS_ROOT` |
| **環境變數 (.env)** | `VITE_` 前綴 + `SCREAMING_SNAKE_CASE` | `VITE_API_BASE_URL` |
| **CSS Module** | `PascalCase.module.css` | `ProductCard.module.css` |
| **全域 CSS / 資源資料夾** | `kebab-case` | `image-controls.css`, `resizable-layout.css` |
| **資料夾** | 小寫 + `-` 分隔 | `components/`, `api/`, `styles/` |
| **Handler Prop 名稱** | `on` + 事件 + 動作 (PascalCase) | `onSave`, `onImageSelect` |

### 🎯 實用守則

1. **元件 = 檔名 = className / functionName**  
   ```jsx
   // ProductCard.jsx
   export default function ProductCard() { ... }
   ```

2. **Hook 必須以 `use` 開頭**（React 規範）

3. **常數 vs 變數**  
   - 不會改變 → `SCREAMING_SNAKE_CASE`  
   - 會改變 → `camelCase`

4. **事件 Handler Prop**  
   - 在父層宣告：`function handleSave() {}`  
   - 傳給子元件：`<ProductCard onSave={handleSave} />`

5. **環境變數**  
   - 使用 `import.meta.env.VITE_XXX` 取得  
   - 所有後端路徑、靜態路徑放在 `.env`

保持以上風格，團隊閱讀成本最低，未來大型維護也能快速定位檔案與職責。
