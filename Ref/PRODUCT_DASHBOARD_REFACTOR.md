# 🚀 Herstudio-Admin-React 重構步驟

> 本文件記錄將傳統 Flask 後台 (static/js) 重構為 React 前端的完整步驟

## 📋 目錄

1. [專案目標](#專案目標)
2. [系統分析](#系統分析)
3. [重構計劃](#重構計劃)
4. [開發環境設置](#開發環境設置)
5. [核心功能實作](#核心功能實作)
6. [API 整合](#api-整合)
7. [進階功能](#進階功能)
8. [測試與部署](#測試與部署)
9. [接下來的步驟](#接下來的步驟)

---

## 專案目標

### 需求背景
原 Shopee 自動化上架系統使用 Flask + 傳統 JavaScript，需重構為更現代、可維護且可擴展的 React 前端，主要目標：

- 提升用戶體驗與介面反應速度
- 改善代碼可維護性與重用性
- 優化開發團隊工作流程
- 為未來功能擴展做好準備

### 預期效益
- 更流暢的用戶體驗（SPA 架構）
- 更好的代碼組織與團隊協作
- 更快的功能迭代速度
- 更容易測試與維護

---

## 系統分析

### 原系統功能梳理

1. **商品管理模組**
   - 商品列表與搜尋
   - 商品詳情與編輯
   - 商品批量操作

2. **Excel 導入模組**
   - Excel 檔案上傳
   - 資料驗證與轉換
   - 導入進度與錯誤處理

3. **圖片管理模組**
   - 圖片上傳與預覽
   - 圖片排序與編輯
   - 圖片批次處理

4. **上架管理模組**
   - 上架狀態追蹤
   - 上架錯誤處理
   - 批量上架操作

### 技術差異對比

| 方面 | 原系統（Flask） | 新系統（React） |
|------|----------------|----------------|
| **渲染方式** | 服務端渲染 | 客戶端渲染 (CSR) |
| **頁面切換** | 整頁重載 | 單頁應用 (SPA) |
| **狀態管理** | 全局變數/jQuery | React 状態管理 |
| **代碼組織** | 腳本化 | 元件化 |
| **數據請求** | 同步表單提交 | 非同步 API (Axios/Fetch) |

---

## 重構計劃

### 階段規劃

1. **核心架構搭建** (2週)
   - 開發環境設置
   - 基礎架構與路由
   - API 通信層

2. **基礎功能實作** (4週)
   - 商品列表與詳情
   - 表單元件系統
   - 文件上傳元件

3. **進階功能增強** (3週)
   - 拖拽排序功能
   - 批量操作介面
   - 狀態追蹤系統

4. **效能優化與測試** (1週)
   - 代碼分割與懶載入
   - 單元測試覆蓋
   - 效能優化

### 前端技術選型

| 技術 | 用途 | 優勢理由 |
|------|------|---------|
| **React 18** | 核心框架 | 組件復用、虛擬DOM、大型社群 |
| **TypeScript** | 類型系統 | 型別安全、開發體驗、錯誤預防 |
| **Vite** | 構建工具 | 快速啟動、HMR、優秀DX |
| **React Query** | 數據獲取 | 緩存、重試機制、狀態管理 |
| **Zustand** | 狀態管理 | 簡單API、低代碼量、性能優秀 |
| **React Hook Form** | 表單處理 | 性能優秀、驗證整合、DX優良 |
| **Ant Design** | UI庫 | 企業級元件豐富、後台適用 |

---

## 開發環境設置

### 項目創建

```bash
# 創建 Vite + React + TS 項目
npm create vite@latest herstudio-admin-react -- --template react-ts

# 切換到項目目錄
cd herstudio-admin-react

# 安裝依賴
npm install
```

### 安裝核心依賴
```bash
# UI 庫
npm install antd @ant-design/icons

# 路由
npm install react-router-dom

# API 請求
npm install axios react-query

# 狀態管理
npm install zustand

# 表單處理
npm install react-hook-form zod @hookform/resolvers

# 工具庫
npm install date-fns lodash

# 開發工具
npm install -D eslint prettier eslint-config-prettier
```

### 資料夾結構

```
src/
├── api/                # API 請求封裝
│   ├── client.ts       # Axios 封裝
│   ├── product.ts      # 商品相關 API
│   └── upload.ts       # 上傳相關 API
├── components/         # 共用元件
│   ├── layout/         # 佈局元件
│   ├── form/           # 表單相關元件
│   ├── table/          # 表格相關元件
│   └── upload/         # 上傳相關元件
├── hooks/              # 自定義 Hooks
│   ├── useForm.ts      # 表單相關邏輯
│   ├── useTable.ts     # 表格相關邏輯
│   └── useUpload.ts    # 上傳相關邏輯
├── pages/              # 頁面元件
│   ├── dashboard/      # 儀表板頁面
│   ├── products/       # 商品相關頁面
│   └── settings/       # 設置相關頁面
├── stores/             # 狀態管理
│   ├── authStore.ts    # 認證狀態
│   └── productStore.ts # 商品相關狀態
├── types/              # TypeScript 類型定義
│   ├── product.ts      # 商品相關類型
│   └── common.ts       # 通用類型定義
├── utils/              # 工具函數
│   ├── format.ts       # 格式化函數
│   └── validation.ts   # 驗證函數
├── styles/             # 樣式文件
│   ├── global.css      # 全局樣式
│   └── variables.css   # CSS 變量
├── App.tsx             # 應用入口
├── main.tsx            # 主渲染入口
└── vite-env.d.ts       # Vite 類型定義
```

### 環境變數設置

`.env.development`
```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_PRODUCTS_ROOT=/static/images/products
```

---

## 核心功能實作

### 1. API 客戶端封裝
- 建立 Axios 實例
- 配置請求與響應攔截器
- 處理認證和錯誤統一管理

### 2. 商品列表頁實作
- 實現數據獲取與表格顯示
- 實現搜尋、排序、分頁功能
- 實現操作按鈕與連結

### 3. 商品表單元件
- 實現表單驗證 (React Hook Form + Zod)
- 實現文件上傳與預覽
- 實現表單提交與數據處理

---

## API 整合

### 產品 API 模組
- 獲取商品列表 API
- 獲取單個商品 API
- 創建商品 API
- 更新商品 API
- 刪除商品 API

### 上傳 API 模組
- 圖片上傳功能
- Excel 文件導入功能

---

## 進階功能

### 1. Excel 導入功能
- 文件上傳與驗證
- 導入進度顯示
- 結果報告與錯誤處理

---

## 測試與部署

### 單元測試設置
- 元件測試範例
- API 測試範例
- Mock 數據與測試環境配置

### 部署配置
- Docker 容器化配置
- Nginx 反向代理設置
- CI/CD 流程建議

---

## 下一步計劃

1. **自動化測試擴展**
   - 為核心功能增加覆蓋率
   - 添加端到端測試

2. **效能優化**
   - 實作虛擬列表
   - 優化圖片載入策略
   - 細化代碼分割

3. **功能強化**
   - 多語言支持
   - 暗黑模式
   - 離線操作能力

4. **整合 Shopee API**
   - 直接對接 Shopee 開放 API
   - 同步線上商品狀態
   - 跨平台整合能力

---

## 接下來的步驟

### 1. 核心架構搭建
- 使用 React 18、TypeScript 和 Vite 建立穩定的基礎架構。
- 採用莫蘭迪色系，將 `#F1E2DB` 設為主色調，並自訂 Ant Design 主題。
- 設置 Axios 客戶端，統一處理 API 請求與錯誤。
- 確保資料夾結構清晰，按照模組化方式組織代碼。

### 2. 核心功能實作
- **商品管理模組**：
  - 實現商品列表頁，支持搜尋、排序與分頁。
  - 添加操作按鈕（如編輯、刪除）與詳情連結。
- **文件上傳模組**：
  - 支持圖片與 Excel 文件上傳，並顯示上傳進度。
  - 驗證文件格式並提供即時反饋。
- **表單處理模組**：
  - 使用 React Hook Form 與 Zod 實現表單驗證。
  - 支持文件預覽與表單提交。

### 3. 進階功能增強
- 實現拖拽排序功能，支持商品與圖片的排序。
- 添加批量操作功能，支持多選刪除與更新。
- 實現狀態追蹤系統，顯示商品的上架狀態與錯誤。

### 4. 權限管理（延後實作）
- 設計角色與權限模型，支持多用戶管理。
- 在前端添加權限檢查，控制按鈕與頁面顯示。

### 5. 測試與部署
- 編寫單元測試與端到端測試，覆蓋核心功能。
- 使用 Docker 容器化應用，簡化部署流程。
- 配置 CI/CD 流程，自動化測試與部署。