# 如何創建和管理簡報

本指南說明如何在 AISliDev 中創建和管理您的 Slidev 簡報。

## 目錄結構

```
data/slides/
├── .templates/
│   └── basic-presentation/  # 基礎範本
│       ├── slides.md
│       └── README.md
├── demo/                     # 範例簡報
│   └── slides.md
└── your-presentation/        # 您的簡報
    ├── slides.md            # 必須
    ├── images/              # 可選
    └── assets/              # 可選
```

## 快速開始

### 1. 使用範本創建新簡報

```bash
# 複製範本
cp -r data/slides/.templates/basic-presentation data/slides/my-presentation

# 編輯內容
vim data/slides/my-presentation/slides.md
```

### 2. 必要檔案

每個簡報目錄**必須**包含：

- `slides.md` - 主要簡報檔案

### 3. 在 AISliDev 中打開

1. 啟動 AISliDev
2. 點擊「Open Presentation」
3. 從列表中選擇您的簡報

## slides.md 結構

### Frontmatter（頂部配置）

```markdown
---
theme: "@slidev/theme-default" # 主題（必須用單引號包裹 @ 符號）
layout: cover # 首頁佈局
background: https://images.unsplash.com/photo-xxx # 背景圖
highlighter: shiki # 代碼高亮
lineNumbers: true # 顯示代碼行號
---
```

**重要**：

- 主題名稱包含 `@` 時必須用單引號：`'@slidev/theme-seriph'`
- Frontmatter 必須在檔案最開頭
- 使用 `---` 包圍

### 投影片內容

````markdown
# 投影片標題

內容使用 Markdown 語法

---

# 第二頁

- 列表項目 1
- 列表項目 2

```ts
// 程式碼範例
console.log("Hello!");
```
````

````

**重要**：
- 使用 `---` 分隔每一頁
- 支援完整的 Markdown 語法
- 可以使用 Vue 組件

## 主題選擇

### NPM 主題（推薦）

AISliDev 已預安裝三個官方主題：

```markdown
---
theme: '@slidev/theme-default'
---

或

---
theme: '@slidev/theme-seriph'
---

或

---
theme: '@slidev/theme-apple-basic'
---
````

### 本地自訂主題

```markdown
---
theme: "../themes/professional-dark-v2"
---
```

可用的本地主題：

- `professional-dark-v2` - 專業深色風格
- `creative-gradient-v2` - 紫色漸層創意風格
- `minimal-clean-v2` - 淺色極簡學術風格

更多主題：[Slidev 主題庫](https://sli.dev/themes/gallery)

## 添加圖片和資源

### 在簡報目錄中創建資源目錄

```bash
mkdir data/slides/my-presentation/images
mkdir data/slides/my-presentation/assets
```

### 在 slides.md 中使用相對路徑

```markdown
# 使用圖片

![圖片說明](./images/screenshot.png)

---

# 背景圖片

---

## background: ./images/background.jpg

# 投影片內容
```

## 常見錯誤和診斷

當您打開「Open Presentation」時，AISliDev 會自動驗證每個簡報：

### ✅ 有效簡報

- 顯示 📁 圖示
- 可以點擊打開

### ❌ 無效簡報

- 顯示 ❌ 圖示
- 紅色邊框
- 顯示錯誤訊息
- 無法打開

### 常見錯誤

**錯誤: "slides.md not found or not accessible"**

- 原因：簡報目錄中沒有 `slides.md` 檔案
- 解決：創建 `slides.md` 檔案

**錯誤: "slides.md is empty"**

- 原因：`slides.md` 檔案是空的
- 解決：添加至少 frontmatter 和一頁內容

## 進階功能

### 動畫效果

```markdown
# 逐步顯示

<v-clicks>

- 第一項
- 第二項
- 第三項

</v-clicks>
```

### 雙欄佈局

```markdown
---
layout: two-cols
---

# 左欄內容

::right::

# 右欄內容
```

### 自訂樣式

在 slides.md 底部添加：

```markdown
<style>
.slidev-layout {
  background: linear-gradient(to right, #667eea, #764ba2);
}

h1 {
  color: white;
}
</style>
```

## 更多資源

- [Slidev 官方文檔](https://sli.dev/)
- [Markdown 語法](https://www.markdownguide.org/)
- [AISliDev 主題系統](./THEME_SYSTEM_V2.md)
- [基礎範本說明](../../data/slides/.templates/basic-presentation/README.md)

## 故障排除

### 簡報無法打開

1. 檢查 `slides.md` 是否存在
2. 檢查檔案是否為空
3. 檢查 frontmatter 語法
4. 查看「Open Presentation」中的錯誤訊息

### 主題沒有生效

1. 確認主題名稱正確
2. NPM 主題名稱需要單引號：`'@slidev/theme-xxx'`
3. 本地主題使用相對路徑：`'../themes/my-theme'`
4. 檢查主題是否存在

### 圖片無法顯示

1. 確認圖片檔案路徑正確
2. 使用相對路徑：`./images/photo.png`
3. 確認檔案在簡報目錄中

## 範例工作流程

```bash
# 1. 創建新簡報
cp -r data/slides/.templates/basic-presentation data/slides/my-talk

# 2. 編輯內容
vim data/slides/my-talk/slides.md

# 3. 添加圖片
mkdir data/slides/my-talk/images
cp ~/my-screenshot.png data/slides/my-talk/images/

# 4. 在 AISliDev 中打開
# - 啟動 AISliDev
# - 點擊「Open Presentation」
# - 選擇「my-talk」

# 5. 預覽和編輯
# - 左側編輯器修改內容
# - 右側預覽即時更新
```

就這麼簡單！
