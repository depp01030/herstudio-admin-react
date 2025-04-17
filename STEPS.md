
# 🚀 Shopee 後台 React 重構 Roadmap (Phase 1)

> **目標**：完成基本 React 架構、載入商品列表、顯示並可儲存一張 `ProductCard`。  
> **開發哲學**：遵循 React 社群慣例（Functional Component + Hook 分層），注重職責分離、可維護性及清楚命名。

---

## 🗂️ 1. 建立開發環境

- [ ] **安裝 Node.js (v18↑)**  
- [ ] **初始化 Git 倉庫**  
  ```bash
  git init
  ```
- [ ] **使用 Vite 建立 React 專案**  
  ```bash
  npm create vite@latest
  # 選擇: React + JavaScript
  cd shopee-admin-react
  npm install
  ```

---

## 📦 2. 安裝開發依賴

- [ ] UI 套件 Bootstrap  
  ```bash
  npm install bootstrap
  ```
- [ ] Icon 套件 Bootstrap Icons  
  ```bash
  npm install bootstrap-icons
  ```
- [ ] (選) ESLint + Prettier 以維持程式碼品質

---

## 🏗️ 3. 建立專案骨架

```
src/
├── api/            # 對後端 REST API 的所有呼叫
├── components/     # 純 View 元件
├── hooks/          # 共用邏輯 (useXxx)
├── pages/          # Page‑level 元件 (資料調度)
├── config/         # 常數與環境設定
├── styles/         # 全域或 CSS Module
└── App.jsx         # 路由與全域佈局
```

> **原則**：  
> - **Page 元件** = Controller (調度資料)  
> - **Component** = View (純呈現)  
> - **Hook / API** = Model & Business Logic

---

## ⚙️ 4. 建立環境變數與常數

`.env` ⤵  
```env
VITE_API_BASE_URL=/admin/api
VITE_PRODUCTS_ROOT=/static/images/products
```

`src/config/constants.js` ⤵  
```js
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const PRODUCTS_ROOT = import.meta.env.VITE_PRODUCTS_ROOT;
```

---

## 🎨 5. 匯入 Bootstrap 與全域樣式

在 `src/main.jsx`：  
```js
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
```

將原有 `resizable-layout.css`, `image-controls.css` 搬到 `src/styles/` 再 `import`。

---

## 🧩 6. 實作第一個 View 元件

- [ ] `components/ProductCard.jsx`
  - 僅負責呈現 props（properties）資料
  - 不含任何 fetch 或流程

---

## 🔗 7. 實作 API 與 Page

- [ ] `api/productApi.js`
  - `fetchProductsWithFilters()`
  - `updateProduct()`
- [ ] `pages/ProductListPage.jsx`
  - 使用 `useEffect()` 於初始化呼叫 `fetchProductsWithFilters`
  - 透過 `useState()` 管理 `products`
  - `map()` 生成多張 `<ProductCard />`

---

## 🛠️ 8. 新增自訂 Hook（Controller 邏輯）

- [ ] `hooks/useProductForm.js`
  - 收集表單
  - 呼叫 `updateProduct`
  - 回傳 `handleSubmit`, `status`

---

## 🖱️ 9. 加入事件處理

- 在 `ProductCard` 透過 props 傳入 `onSave`  
- `ProductListPage` 將 `onSave` 連到 `useProductForm().handleSubmit`

---

## 🌱 10. 漸進增量功能

- [ ] `ImageModule` 元件
- [ ] 拖曳寬度 `useResizableLayout` Hook
- [ ] 篩選表單 `FilterForm` 元件
- [ ] Load‑More 分頁機制

---

完成以上即可跑出完整卡片流程，再進入 Phase 2（效能優化、測試、部署等）。
