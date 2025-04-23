# 從簡單到複雜：為什麼現代前端開發要用這麼多工具？

> 這是一份給剛開始學 React、TypeScript、Node.js 的新手看的導覽文件。它不會直接把你丟進 npm、JSX 和一堆 terminal 指令，而是一步一步告訴你「你為什麼會需要這些東西」。

你可能也有這個感覺：

>「我只是想讓一個畫面跑起來，為什麼一堆教學一開始就要我 `npm install`，還要用什麼 Vite、React、TypeScript、Node.js、甚至什麼 JSX... 到底這些東西是誰決定我要學的？」

放心，你不是唯一這樣想的人。

這篇文章不是給你硬塞工具的，而是幫你釐清：

> ✅ 你想做什麼 → 遇到什麼卡關 → 所以這個工具出現 → 所以你還得做哪些準備

同時，我們會簡單介紹每一個工具的「角色定位」——就像在打遊戲前先知道誰是坦誰是補、誰是拿大劍的。

還會穿插一些「這東西其實不是一開始就長這樣」的故事，讓你知道：
- 不是你太笨，是前端這東西**真的越來越複雜**
- 但你可以站在**千萬個踩雷前人的屍體上**，走得輕鬆一點

你不需要一次記住所有名詞，但你需要一張地圖。這篇文章，就是這張地圖。

> ✅ 你唯一需要知道的是：**瀏覽器最後只吃三樣東西：HTML、CSS、JavaScript。**  
> 你做的所有事，都是在想辦法**把其他你寫的東西，變成這三種讓瀏覽器能理解的樣子。**

---
## 第 0 章：誰是誰？角色總表（打副本前先認識隊友）

> 「React 是 UI？Node.js 是後端？JSX 是語法糖？為什麼我寫的不是 JS，最後還是得變成 JS？」

這章不是要你背名詞，而是像打 RPG 前先看一眼隊伍組成，知道誰是坦、誰是補、誰是主力輸出。
這樣你在開打之後，才不會每看到一個工具就一臉問號：「欸這不是剛剛才出現過嗎？」

 

### 🗂 技術角色清單

| 名稱                 | 是什麼                              | 它負責什麼                                                                                  |
|----------------------|--------------------------------------|---------------------------------------------------------------------------------------------|
| **HTML**             | 標記語言（不是程式語言）             | 告訴瀏覽器「這是標題」、「這是段落」、「這是圖片」等結構語意                                  |
| **CSS**              | 樣式語言                             | 負責外觀：「這段字要多大、什麼顏色、要不要動畫」                                            |
| **JavaScript**       | 程式語言                             | 讓網頁動起來，控制按鈕點擊、資料流動、DOM 操作等                                            |
| **TypeScript**       | JavaScript 的超集                    | 加上靜態型別、錯誤檢查與補完功能，讓大型專案更穩定，但瀏覽器看不懂，需先轉譯成 JS             |
| **JSX**              | React 的語法糖                       | 讓你可以在 JS 中寫出 HTML 樣式的語法，瀏覽器看不懂，要靠工具轉成純 JS                        |
| **React**            | UI 函式庫 (library)                          | 幫你把畫面拆成元件，每個元件根據自己的狀態自動更新畫面，避免手動操作 DOM。提供 UI 元件邏輯與生命周期、狀態管理等功能。不是語法，是你 import 回來用的工具。                  |
| **npm / npx**        | 套件管理工具與指令執行器             | `npm` 負責安裝與管理套件，`npx` 幫你執行本地或遠端工具指令，兩者都是 Node.js 環境的一部分       |
| **Node.js**          | JS 執行平台                         | 讓 JS 可以在本機跑，用來啟動工具、打包、模擬伺服器、轉譯 TS 等，開發階段的萬能執行員           |
| **Vite / Webpack**   | 打包工具                             | 幫你把 TS、JSX、模組等轉成 JS，並提供 Dev Server、熱更新、模組整合等功能                     |
| **CDN**              | 內容傳遞網路                         | 從雲端載入別人寫好的套件（如 Bootstrap、Lodash），不想下載就先用它                              |
| **Bootstrap**        | UI 樣式框架                         | 提供現成的按鈕、排版、元件樣式，幫助快速開發、少踩 CSS 的坑                                     |

---

### 🔍 他們是怎麼一起工作的？

- **你在編輯器裡寫的東西：** React、JSX、TypeScript → 這些是「人寫人懂」的高級語法，瀏覽器看不懂
- **寫完要先經過處理：** Node.js + Vite 會幫你把這些程式碼打包、轉譯、壓縮成純 JS（瀏覽器能吃的版本）
- **最後真正上場的主角：** 瀏覽器。它才不管你寫得多花俏，只認得 HTML、CSS 和 JavaScript
 
> ✅ 瀏覽器從頭到尾什麼都不懂，只會吃 JS。React 不是它內建的，是你先準備好整包 JS 再餵給它。

### 🧠 如果要一句話記住整個關係：

> JS 是你寫邏輯的語言，JSX 是你寫畫面的方法，React 是你畫畫面的工具，Node.js 是你後台執行的人力資源部，Vite 是幫你整合一切的自動廚房機器人，瀏覽器只是吃飯的客人。

你不是為了跟風才寫 React，而是因為你不想每天從切菜、炒菜、洗碗全部自己來。你只是想活下來而已。


---

## 1. 我只想寫一個能打開的網頁

你一開始只是想這樣：

>「我寫個 HTML，丟一些 JS，雙擊打開可以看到畫面，這樣就好啦？」

是的，沒錯，這是最原始的網頁寫法。你寫的檔案可能像這樣：

```html
<!DOCTYPE html>
<html>
  <head>
    <title>我第一個網頁</title>
  </head>
  <body>
    <h1>Hello world</h1>
    <script>
      console.log("我在 console.log 打字");
    </script>
  </body>
</html>
```

這種做法：
- ✅ 不用安裝任何工具
- ✅ 不用裝 Node.js
- ✅ 不用 npm、不用框架

但是只要你想往下一步（例如拆檔案、使用 React、用函式庫），馬上就會撞牆。

---

## 2. 我想把程式拆成很多檔案（模組化）

### 你遇到的情況：

>「我的 JS 寫太多了，好想把它拆成幾個檔案然後 import。」

你很自然地會想用這種寫法：

```js
// main.js
import { sayHi } from './utils.js';
sayHi();
```

```js
// utils.js
export function sayHi() {
  console.log('嗨');
}
```

然後你在 HTML 裡這樣引用：

```html
<script type="module" src="main.js"></script>
```

結果你會遇到一些超怪錯誤：

```
Uncaught TypeError: Failed to resolve module specifier 'lodash'
```

### ❗為什麼會這樣？

#### 1. `import` 雖然是標準語法，但瀏覽器支援條件很嚴格：
- 必須有 `<script type="module">`
- 檔案路徑一定要加 `.js`
- 不能用相對到跨網域的路徑（會 CORS 報錯）
- 不支援 npm 安裝的函式庫（瀏覽器不知道 `lodash` 是誰）
- 如果你用的是 `file://` 開網頁，基本全部爆炸（瀏覽器會擋）

#### 2. `import` 不認得 npm 套件

這段寫法：
```js
import _ from 'lodash';
```
瀏覽器根本不會去幫你從 `node_modules/` 抓 lodash。它會說：

>「你說的 'lodash' 是誰？我又不是 Node.js，我又看不到你資料夾裡的東西。」

除非你用打包工具（像 Vite、Webpack），它才會去 node_modules 把 lodash 打包進你要給瀏覽器吃的 JS 檔裡。

### ✅ 那我該怎麼辦？

你需要：
- 一個開發工具來幫你打包檔案
- 自動整理 import/export
- 幫你把 npm 套件（像 React、Lodash）一起整進來

**這時候 Vite / Webpack 就出場了。**

### ✅ 那我還要做什麼？

- 你要安裝 Node.js（這些工具就是跑在它上面）
- 用 `npm` 安裝 Vite
- 寫程式時就可以像這樣：

```js
import _ from 'lodash';
_.shuffle([1,2,3]);
```

**你寫的還是 JS，但打包工具會幫你「預先處理成瀏覽器能吃的版本」。**

### ✅ 那沒有打包工具能用 npm 套件嗎？

理論上你可以用 CDN，但這種寫法很不推薦：

```html
<script src="https://cdn.jsdelivr.net/npm/lodash/lodash.min.js"></script>
<script>
  console.log(_.shuffle([1,2,3]));
</script>
```

這種寫法：
- 不支援模組化
- 無法 import/export
- 變數全部掛在全域 window 上
- 不能 tree-shaking（會把整包載入，浪費效能）

> ✅ 所以總結一句：**模組這件事，原生能跑，但不好用；打包工具讓你活下來。**

---
## 3. 畫面越來越複雜，自己控 DOM 快發瘋（React 出場）

> 「我有一堆按鈕，點一下要換文字、換顏色，有的還會消失。JS 越寫越亂，改一行壞三行，怎麼回事？」

---

### 🎯 你遇到的狀況

你開始覺得：自己寫 JS 控 DOM，就像在跟 HTML 摔角。

你寫了 `document.getElementById()`、加監聽器、還要判斷誰要 `remove()`、誰要 `append()`——這畫面一複雜你整個人就炸了。

寫一個簡單的按鈕都要這樣：

```html
<!DOCTYPE html>
<html lang="zh-Hant">
<head><title>Counter 純 JS</title></head>
<body>
  <button id="counter-btn">你點了 0 次</button>

  <script>
    let count = 0;
    const btn = document.getElementById('counter-btn');
    btn.addEventListener('click', () => {
      count += 1;
      btn.textContent = `你點了 ${count} 次`;
    });
  </script>
</body>
</html>
```

寫是寫得出來啦，但你開始懷疑人生。

---

## 🧠 React 是什麼？

React 是由 Facebook（Meta）開發的「前端 UI 函式庫」。不是語言、不是語法、也不是框架。

| 常見誤解   | 真相                              |
| ---------- | --------------------------------- |
| ❌ 是語法？ | JSX 是語法，React 不是                |
| ❌ 是框架？ | 它只專注在 UI，不幫你管 API / 路由          |
| ❌ 是語言？ | 你還是在寫 JavaScript / TypeScript   |
| ✅ 是函式庫 | 幫你用函式寫 UI，管理狀態與畫面更新         |

> 🎯 一句話：**React 就是一包 JS 函式，幫你建構與管理 UI 的邏輯。**

---

## 🧠 JSX 是什麼？

JSX 是 JavaScript 的語法擴充（syntax extension），讓你可以在 JS 裡寫出類似 HTML 的語法：

```jsx
<h1>Hello</h1>
```

但是：

- ❌ JSX 不是瀏覽器能直接執行的語法
- ✅ 必須透過工具轉成 JS（像 `React.createElement`）

這個轉換過程通常由 **Babel** 或 **Vite/Webpack** 幫你處理。

> 🧠 重點觀念：**JSX 最終會被轉成 JS 函式呼叫，也就是 `React.createElement(...)`。**
> JSX 只是寫起來比較像 HTML 的糖衣，本質還是 JS。React 也只是 JS 函式，沒什麼神秘的。

---

## 🔁 JS / JSX / React 三者關係總表

| 名稱         | 類型       | 負責什麼                                  |
| ------------ | ---------- | ----------------------------------------- |
| JavaScript   | 語言       | 控制邏輯、流程、事件處理                        |
| JSX          | 語法擴充   | 讓你在 JS 裡寫出類似 HTML 的結構，需轉譯成 JS   |
| React        | 函式庫     | 管理 UI 元件、狀態、畫面渲染與更新邏輯              |

---

## 🛠️ 同一個功能的演進過程：從 JS 到 React

### 🧱 1. 最原始的純 JS 寫法

前面你已經看過了：用 `addEventListener` 綁事件、手動改內容。

### 💡 2. React + JSX 寫法（現代做法）

```jsx
function App() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>你點了 {count} 次</button>
  );
}
```

你會覺得這段寫起來又像 HTML 又像 JS，這正是 JSX 的魔力。
React 幫你負責狀態更新、DOM 比對與重新渲染。

### 🔄 3. JSX 會被轉成 React.createElement（純 JS）

這段 JSX：
```jsx
<button onClick={() => setCount(count + 1)}>你點了 {count} 次</button>
```

會被 Babel 轉譯成：

```js
React.createElement(
  "button",
  { onClick: () => setCount(count + 1) },
  `你點了 ${count} 次`
);
```

這就是純正的 JS，瀏覽器能跑，但你得先讓 React 出現在這個檔案裡。

---

## 📦 打包後的樣子長怎樣？

React 程式經過 Vite/Webpack 打包後，會生成類似這樣的檔案：

```
/dist
  └── assets/
        └── index.abc123.js   👈 包含 React、本地元件、邏輯等所有東西
```

這份 JS 檔案裡有：
- 你寫的 JSX → JS 轉譯結果（`React.createElement`）
- React 函式庫的程式碼（如果你有 `import React`）
- 所有元件邏輯、狀態控制、渲染函式

---

## 🌐 最後怎麼讓瀏覽器執行？

你只要在 HTML 裡加上這段：

```html
<script src="/assets/index.abc123.js"></script>
```

瀏覽器就會去讀這個 JS 檔，而因為裡面什麼都包好了，它會順利執行並畫出你要的畫面。

> ✅ 所以你現在明白了吧？**React 和 JSX 都不是瀏覽器原生能懂的東西，打包處理好才行。**

---

## 🔍 這是不是 JSX？

```js
React.createElement("div", null, "Hello")
```

- ❌ 這不是 JSX，這是 JSX 的轉譯結果（純 JS）
- ✅ JSX 長得像 `<div>Hello</div>`

所以我們常說：**JSX 是語法糖，最後一定會變成 JS。**

---

## 🧠 React 幫你做了什麼？

傳統做法：
- `.createElement()` 手動創 DOM
- `.appendChild()` 插進去
- `.innerText` 改文字內容
- `.remove()` 拿掉元素
- 還要手動加事件、維護狀態

畫面越複雜，你改一次就壞三行。

現在用 React，你可以：
- ✅ 用 `useState()` 管資料狀態
- ✅ JSX 描述畫面樣子
- ✅ React 自動比對 DOM，更新你該更新的那一塊

> 🎯 比喻一下：你只需要告訴 Excel 哪格要改，React 幫你更新整張表格。

---

## 🧂 小歷史補充：為什麼當年大家覺得 React 很噁？

當 JSX 剛出現時，整個前端界罵聲連連：
> 「這什麼鬼？把 HTML 寫進 JS？不就違反分離原則了嗎？」

但 React 團隊的回應是：
> 「你搞錯了，我們不是把 HTML 放進 JS，而是把 UI 的結構 + 行為放進同一個元件，這樣比較好管理與重用。」

結果幾年後，大家打臉自己：真香。

---

## 🧠 一句話總結

> 你寫 React，不是因為它潮，而是因為它讓你不再手動跟 DOM 打仗。
> JSX 是語法糖，React 是一堆 JS 函式。最終你寫的所有東西，都會被打包成 JS，丟給瀏覽器開開心心地跑起來。

---

## 4. 我想程式不要太自由，寫錯就幫我報錯（TypeScript 登場）

JS 太自由了，像這樣：

```js
function getUser(id) {
  return id.toUpperCase(); // 你以為是字串，其實可能是數字
}
```

TS 寫起來：

```ts
function getUser(id: string): string {
  return id.toUpperCase();
}
```

### ✅ 差在哪：
- 程式會在編譯階段就報錯，不等你打開瀏覽器發現錯
- 編輯器會提示你傳錯東西，甚至補參數給你

但問題來了：TS 不能直接跑在瀏覽器裡，**還是要先轉成 JS 才行**。

這件事誰來做？還是打包工具，還是 Node.js 工具鏈。

---

## 5. 一存檔畫面就自己刷新（Dev Server + HMR）

>「欸我剛剛加了一個 `console.log`，結果畫面根本沒變？」

你第一次寫 JS 的時候，每次改完都會很自然地按下 F5。後來你發現有 Live Server 可以幫你自動刷新。但這還不夠爽——因為每次刷新都會讓狀態重置、畫面閃爍，甚至 DOM 被重新建立。

所以你開始問：「能不能只更新我改的那一段？不要整頁重來？」

這就是 Hot Module Replacement（HMR）出場的地方了。

### 👨‍🍳 那 `npm run dev` 到底做了什麼？

當你執行 `npm run dev`，其實背後請出了 Node.js 幫你啟動一整套「本地開發伺服器（Local Dev Server）」，它負責：

1. 啟動一個本地 HTTP 伺服器（通常是 http://localhost:5173）
2. 把你寫的 TS、JSX、SCSS 等等即時轉譯成 JS 和 CSS
3. 偵測你儲存檔案的動作（File Watcher）
4. 用 WebSocket 通知瀏覽器「喂！有東西變了」
5. 用 React 的 HMR 技術，只更新變動的元件，畫面即時變化、狀態還在

### 🔁 全部串起來會像這樣：

```
[你儲存檔案]
      ↓
[Vite Dev Server 偵測到檔案變更]
      ↓
[透過 WebSocket 通知瀏覽器]
      ↓
[React Hot Module 只替換變動元件，不整頁刷新]
```

看起來像魔法？其實這一整套流程都是 Node.js 跑在你本地幫你打理的。你只要寫程式、存檔，其它都交給工具鏈搞定。這就是現代前端開發的默契合作：你專心寫 UI，Node.js 幫你搞定出菜。

> ✅ 一句話：**你不是在寫網頁，你是在跟自己的 Node.js 工具鏈合作演出。**

---

## 6. 後端還沒寫好，我想先假裝有資料（Mock API）

你可能會遇到這種情況：

>「設計圖叫我顯示『購物車內有幾項商品』，但後端 API 還沒給我啊！」

別怕，這時候我們來開個假 API：「欸欸欸，這邊有個 json-server，可以暫時騙騙前端」。

### 工具選擇：

- `json-server`：快速開一個可增刪查改的假 API
- `vite-plugin-mock`：內建在 Vite 裡的 mock 工具，可更細緻控制路由、回傳內容

```bash
npm install -D json-server
json-server --watch db.json --port 3001
```

這樣你就能發 `GET /products`、`POST /cart`，讓畫面跑起來，等真的 API 開好再接上去。

👀 小提醒：你又在用 Node.js 了。這時候的你，雖然不是在寫後端，但已經像個小後端一樣在跑假資料了。

> ✅ 這就是為什麼前端常常要會一點 Node.js，不然你根本沒辦法好好自測畫面。

---

## 📚 插入章節：CDN、Bootstrap、Icons 是什麼？

### CDN：內容傳遞網路

你看到的這些：
```html
<link href="https://cdn.jsdelivr.net/...">
```
這是在「線上請別人幫我提供資源」，不用下載、安裝。可以快速引用像 Bootstrap、Lodash、Icons 套件。

### Bootstrap：UI 樣式庫

提供現成的 class 給你快速套樣式：
```html
<button class="btn btn-primary">送出</button>
```
同時還有互動元件（像 modal、dropdown）可以用 `data-bs-toggle` 啟動，或用 JS 控制。

```js
const modal = new bootstrap.Modal('#myModal');
modal.show();
```

不是必要技術，但是很常見的 UI 加速器。

---

## 7. 你不知不覺已經組起一整條工具鏈了

| 你想做的事               | 為了解決什麼問題              | 所以用什麼工具               | 工具需要什麼條件                |
|--------------------------|-------------------------------|------------------------------|-------------------------------|
| 把畫面寫出來              | 用 JS 控制畫面行為             | JavaScript + HTML            | 不需要安裝                     |
| 想模組化拆檔案            | import/export 不能直接用       | Vite / Webpack               | 要 Node.js + 打包工具         |
| 畫面越來越複雜            | 想元件化、管理狀態             | React                        | 要打包工具、JSX 處理器         |
| 想型別檢查、補錯提示       | JS 太自由了                   | TypeScript                  | 要轉譯成 JS，靠工具完成       |
| 一存檔就刷新畫面          | 手動刷新太麻煩                | Dev Server + HMR             | 打包工具內建功能，Node.js 跑  |
| 假資料先跑畫面            | 後端還沒開好                 | json-server / mock 工具      | 也是靠 Node.js 開伺服器       |

---

## 8. 那一個前端專案到底長什麼樣？

以下是 Vite + React + TypeScript 的常見資料夾結構：

```
my-app/
├── public/               # 放靜態資源（圖片、字型等）
├── src/                  # 主程式碼都寫這裡
│   ├── App.tsx           # React 主元件
│   ├── main.tsx          # 程式入口，掛到 HTML 上
│   ├── components/       # 可重複使用的元件
│   └── utils/            # 小工具、邏輯封裝
├── index.html            # 頁面骨架
├── package.json          # 專案描述與套件依賴
├── tsconfig.json         # TypeScript 設定
└── vite.config.ts        # Vite 設定檔
```

---

# 結語

你可能本來只是想寫個 HTML 頁面，沒想到現在你已經了解：

- 打包工具為什麼出現（因為瀏覽器太笨，JS以外的都看不懂）
- 為什麼要安裝 Node.js（它是開發工具的引擎）
- React、TS 不是為了炫技，而是為了**讓你活下來**
- 所有高級語法最後都要變成 JavaScript，才能餵給瀏覽器吃

恭喜你，現在你終於知道：
> 「不是你不會，是這世界真的有點複雜。」

但別怕，因為你現在，已經有了全地圖。



