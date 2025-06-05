# ✅ Shopee 管理系統：加入權限驗證機制（前後端分工）

本文件說明如何為 Shopee 管理後台系統加入「登入與權限驗證」功能，讓 `admin` 可以新增/編輯資料，`viewer` 僅能檢視。

---

## 🎯 權限設計原則

- 僅登入後可進入 `/admin/*` 頁面
- `admin` 可執行所有操作（CRUD、圖片上傳）
- `viewer` 僅能瀏覽，無法編輯或刪除
- 前端控制 UI 顯示；後端強制限制操作權限

---

## 🧱 系統分工架構

| 層級 | 說明 |
|------|------|
| 🔐 身份驗證（Authentication） | 登入取得 JWT token，前端儲存並附加至 API 請求 |
| 🛡 授權驗證（Authorization） | 後端依據 token 中的角色欄位驗證權限 |
| 🧩 前端角色管理 | 使用 `authStore` 管理目前使用者與權限資訊 |
| 🚫 API 防護 | 所有 `/admin/*` API 皆需登入並具備 admin 權限 |

---

## 🛠️ 實作步驟流程

### ✅ 第一階段：建立權限上下文（前端）

1. 建立 `authStore.ts`
   - 儲存 `token`, `role`, `isAuthenticated`
   - 提供 `login()`, `logout()`, `hasPermission()`

2. 設定 `rolePermissions` 對照表
   - 根據角色給予 `canEdit`, `canDelete`, `canUpload` 權限

3. 修改 `axiosInstance.ts`
   - 自動附上 `Authorization: Bearer <token>` header

4. 在 UI 組件中加上權限條件
   - 像是 `ProductCardHeader`, `ProductCardImage`, `ProductListBody`
   - 透過 `hasPermission()` 控制按鈕是否顯示或啟用

---

### ✅ 第二階段：建立登入流程

5. 建立 `LoginPage.tsx`
   - 輸入帳密（初期可用選單切換 admin/viewer 模擬）
   - 登入成功後設定 `authStore`，並導向 `/admin/products`

6. 建立 Route 守門元件 `RequireAdmin.tsx`
   - 檢查 `authStore.role === 'admin'`
   - 未登入或非 admin 轉導到登入頁或錯誤頁

---

### ✅ 第三階段：後端加入 API 權限驗證

7. 在 FastAPI 設定 JWT 驗證函式 `get_current_user()`
   - 解出 token 中的使用者與角色

8. 實作 `admin_required` 裝飾器
   - 若使用者非 admin 則回傳 `403 Forbidden`

9. 設定所有 `/admin/*` API route：
   - `@router.post("/admin/product", dependencies=[Depends(admin_required)])`

---

### ✅ 第四階段：整合真實登入與權限邏輯

10. 後端 `/login` API 回傳：
    - `access_token`（JWT）
    - `user.role`（admin/viewer）

11. 前端登入後儲存 token 與 role 到 `authStore`

12. 所有 API 請求透過 `axiosInstance` 自動加上 `Authorization`

13. 前端 UI 與後端 API 雙層權限驗證完成！

---

## 🔄 建議開發順序

| 優先順序 | 項目 |
|-----------|------|
| 🟢 Step 1–2 | authStore 與權限查表（模擬登入） |
| 🟢 Step 3–4 | 修改 Product UI 顯示邏輯 |
| 🟡 Step 5–6 | 建立 Login 頁與 route 保護（假登入） |
| 🟡 Step 7–9 | 後端 API 權限驗證（JWT + role） |
| 🔵 Step 10–13 | 整合真實登入與 API 安全請求 |

---

## 📌 小提醒

- 前端所有操作皆應傳送 token，後端不可只依賴 UI 控制
- 即使 viewer 前端無按鈕，仍需後端拒絕 viewer 嘗試寫入資料
- 可以預設 admin token 放在 `.env.development.local` 做開發測試

