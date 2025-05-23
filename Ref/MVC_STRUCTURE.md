# 🗂️ Shopee React 專案 MVC 結構說明

```

shopee-admin-react/
├── public/                        # 靜態資源（HTML模板、favicon 等）
├── .env                           # ✅ M: Model 設定（環境變數）
├── .gitignore
├── package.json
├── vite.config.js
├── README.md
└── src/
    ├── api/                       # ✅ M: Model → 負責與後端資料交換 (API 封裝)
    │   └── productApi.js
    │
    ├── config/                    # ✅ M: Model → 統一定義 config 常數
    │   └── constants.js
    │
    ├── components/               # ✅ V: View → 元件，純呈現用
    │   ├── ProductCard.jsx
    │   └── ImageModule.jsx
    │
    ├── hooks/                    # ✅ C: Controller → 行為邏輯封裝 (送出、拖曳等)
    │   └── useProductForm.js
    │
    ├── pages/                    # ✅ C: Controller → 頁面邏輯，調度資料與事件
    │   └── ProductListPage.jsx
    │
    ├── styles/                   # ✅ V: View → CSS/SCSS 模組
    │   ├── image-controls.css
    │   └── resizable-layout.css
    │
    ├── App.jsx                   # 路由與主框架（C）
    └── main.jsx                  # ReactDOM 入口

```

## 🧭 MVC 層級圖
```

            🧠 Model (資料層)
            ┌────────────────────────────────┐
            │ .env                           │
            │ api/productApi.js              │
            │ config/constants.js            │
            └────────────────────────────────┘
                      ▲
                      │ 呼叫/引用
                      ▼
            🧩 Controller (邏輯層)
            ┌────────────────────────────────┐
            │ pages/ProductListPage.jsx      │
            │ hooks/useProductForm.js        │
            │ App.jsx                        │
            └────────────────────────────────┘
                      ▲
                      │ 傳資料/props
                      ▼
            🎨 View (呈現層)
            ┌────────────────────────────────┐
            │ components/ProductCard.jsx     │
            │ components/ImageModule.jsx     │
            │ styles/*.css                   │
            └────────────────────────────────┘

```
