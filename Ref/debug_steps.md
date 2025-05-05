# ✅ Shopee 自動上架系統開發順序（調整後 v2 版）

---

## 🔧 階段一：修復與驗證現有功能

🎯 **目標：讓目前的基本流程可以正常運作**

1. 修復圖片上傳 bug V
   - metadata 傳不到後端（FormData 組裝問題）

2. 驗證 A1 行為是否正常 V
   - `action: new / update / delete` 正確儲存
   - 回傳 `ProcessedImageInfo` 正確更新前端

3. 修復 `sizeMetrics` 資料格式錯誤 V
   - 前端傳入格式應為 `Record<string, string>`
   - 後端 schema 對應修改

4. 確認 `CardHeader` 能載入主圖（mainImage）V

---

## 🖼 階段二：圖片匯入功能擴充（提前）

🎯 **目標：讓找款師可操作匯入圖片，並預覽與標註**

5. 實作圖片匯入（基本版）V
   - 使用 `<input type="file" multiple>` 選擇圖片
   - 匯入後加入 `imageStore`，可預覽

6. 支援主圖勾選、是否上傳選取 V
   - `is_main`, `is_selected` 編輯功能
   - 匯入後可直接操作並儲存

7. 暫時不處理 API 權限驗證
   - 不加 token、也不驗證登入
   - 所有圖片功能視為「已登入狀態」

---

## 🔐 階段三：登入與權限系統（後移）

🎯 **目標：建立安全機制，之後再整合到現有流程**

8. 建立 `authStore` 狀態管理
   - 儲存登入狀態、token、user

9. 新增登入頁面 `/login`
   - 輸入帳密 → 呼叫 `/admin/login` → 儲存 token

10. 改寫 `api()`：自動帶 token
    - 從 `authStore` 取得 token 加入 header

11. 前端操作限制
    - 若未登入則隱藏儲存/刪除等操作
    - 可加 Router 跳轉 `/login`

---

## 🖱 階段四：進階匯入與 UX 強化

12. 支援拖曳匯入圖片
13. 支援 Ctrl+V / 右鍵貼上圖片
14. 圖片排序與標籤分類（主圖 / 詳情圖）

---

## 🚀 階段五：部署與環境切換

15. 圖片路徑切換（local vs R2）
16. 圖片壓縮與快取優化
17. `.env` 控制圖片 URL base、token secret
