# PPTX 主題提取工具使用指南

## 📋 功能概述

這個工具可以從 PowerPoint (PPTX) 檔案中提取設計元素，並自動生成 Slidev 主題檔案。

**可提取的元素**:

- ✅ 主題顏色方案（10 種顏色）
- ✅ 字型設定（標題字型、內文字型）
- ✅ 母片背景（顏色/圖片）
- ✅ 版面配置圖片和圖形
- ✅ 圖形元素座標和樣式

---

## 🚀 使用方法

### 基本用法

```bash
npx tsx scripts/pptx-to-slidev-theme.ts <pptx-檔案> [輸出目錄]
```

### 範例

```bash
# 使用預設輸出目錄 (data/extracted-theme)
npx tsx scripts/pptx-to-slidev-theme.ts data/template.pptx

# 指定輸出目錄
npx tsx scripts/pptx-to-slidev-theme.ts data/template.pptx data/my-theme
```

---

## 📦 輸出檔案

執行腳本後，會在輸出目錄生成以下檔案：

```
輸出目錄/
├── package.json              # Slidev 主題套件定義
├── index.ts                  # 主題入口檔案
├── index.css                 # 主題樣式（CSS 變數）
├── README.md                 # 主題使用說明
├── theme-analysis.json       # 完整分析結果（JSON）
├── background.png            # 母片背景圖片（如果有）
└── layout-*.png              # 版面配置圖片
```

---

## 📝 生成的主題結構

### package.json

```json
{
  "name": "slidev-theme-your-theme",
  "version": "0.1.0",
  "keywords": ["slidev-theme", "slidev", "theme"],
  "engines": {
    "slidev": ">=0.48.0"
  }
}
```

### index.css

```css
:root {
  /* 主題顏色 */
  --slidev-theme-primary: #c2c823;
  --slidev-theme-accent: #93cfbf;
  /* ... 更多顏色 */

  /* 字型 */
  --slidev-theme-font-heading: "微軟正黑體", "Arial", sans-serif;
  --slidev-theme-font-body: "微軟正黑體", "Arial", sans-serif;
}

/* 基礎樣式 */
body {
  /* ... */
}
h1,
h2,
h3 {
  /* ... */
}
```

### index.ts

```typescript
import "./index.css";
```

---

## 🔧 整合到 Slidev

### 方法 1: 本地主題（推薦）

1. 將生成的主題複製到 Slidev 專案的主題目錄：

```bash
cp -r data/my-theme slides/themes/my-theme
```

2. 在 `slides.md` 中使用：

```yaml
---
theme: ./themes/my-theme
---
# 我的簡報
```

### 方法 2: NPM 套件（進階）

1. 將主題發布為 NPM 套件：

```bash
cd data/my-theme
npm publish
```

2. 安裝並使用：

```bash
npm install slidev-theme-my-theme
```

```yaml
---
theme: my-theme
---
```

---

## 📊 theme-analysis.json 說明

`theme-analysis.json` 包含完整的提取結果，用於進階自訂：

```json
{
  "name": "主題名稱",
  "colors": {
    "accent1": "#C2C823",
    "accent2": "#93CFBF"
    // ... 更多顏色
  },
  "fonts": {
    "heading": { "latin": "Arial", "ea": "微軟正黑體" },
    "body": { "latin": "Arial", "ea": "微軟正黑體" }
  },
  "background": {
    "type": "color",
    "value": "#FFFFFF"
  },
  "layouts": [
    {
      "name": "封面",
      "type": "custom",
      "images": [
        {
          "id": "12",
          "path": "media/image1.png",
          "x": 71,
          "y": 20,
          "width": 313,
          "height": 92
        }
      ],
      "shapes": [
        {
          "id": "16",
          "type": "shape",
          "x": 238,
          "y": 379,
          "width": 303,
          "height": 4,
          "fillColor": "#FFFFFF"
        }
      ]
    }
  ]
}
```

### 座標系統

- **單位**: 像素 (px)
- **原點**: 左上角 (0, 0)
- **尺寸**: 預設 Slidev 畫布為 1280x720

---

## 🎨 自訂主題

### 修改顏色

編輯 `index.css` 中的 CSS 變數：

```css
:root {
  --slidev-theme-primary: #YOUR_COLOR;
  --slidev-theme-accent: #YOUR_COLOR;
}
```

### 修改字型

```css
:root {
  --slidev-theme-font-heading: "Noto Sans TC", sans-serif;
  --slidev-theme-font-body: "Noto Sans TC", sans-serif;
}
```

### 添加背景圖片

```css
.slidev-layout {
  background-image: url("./background.png");
  background-size: cover;
  background-position: center;
}
```

### 自訂版面配置

根據 `theme-analysis.json` 中的座標資訊，可以建立自訂版面配置：

```css
.slidev-layout.cover {
  background-image: url("./layout-1-image-1.png");
}
```

---

## ⚠️ 已知限制

### 1. 複雜圖形元素

- ✅ 可提取：矩形、圖片、純色填充
- ⚠️ 部分支援：漸層背景
- ❌ 不支援：複雜路徑、陰影、3D 效果

### 2. 文字樣式

- ✅ 可提取：字型家族
- ❌ 不支援：字體大小、粗細、行距（需手動調整）

### 3. 動畫和互動

- ❌ PPTX 動畫不會被提取
- 建議：使用 Slidev 的 `v-click` 等指令重新實作

### 4. 字型可用性

- ⚠️ 提取的字型必須在使用者系統中安裝
- 建議：使用 Web 字型 (Google Fonts) 或包含 fallback 字型

---

## 🐛 疑難排解

### 錯誤：找不到主題檔案

```
Error: 找不到 ppt/theme/theme1.xml
```

**原因**: PPTX 檔案損壞或格式不正確

**解決**:

1. 確認檔案是有效的 PPTX（用 PowerPoint 打開測試）
2. 嘗試「另存新檔」重新儲存 PPTX

### 錯誤：圖片提取失敗

**原因**: `_rels` 關係檔案缺失

**解決**:

1. 檢查 PPTX 中是否真的有圖片
2. 嘗試重新插入圖片後儲存

### 主題顏色顯示不正確

**原因**: `scheme:` 顏色引用未正確解析

**解決**:

1. 檢查 `theme-analysis.json` 中的顏色值
2. 手動編輯 `index.css` 修正顏色

---

## 📚 技術細節

### 依賴套件

- `jszip`: PPTX 解壓縮
- `fast-xml-parser`: XML 解析

### 座標轉換

PPTX 使用 EMU (English Metric Units)，腳本會自動轉換為像素：

```
像素 = EMU ÷ 9525
```

### 顏色格式支援

- `a:srgbClr`: RGB 顏色 → `#RRGGBB`
- `a:sysClr`: 系統顏色 → `#RRGGBB`
- `a:schemeClr`: 主題引用 → 解析為具體顏色

---

## 📞 需要協助？

如遇到問題或有改進建議：

1. 查看 `data/nics-theme/TEST-REPORT.md` 瞭解已知問題
2. 檢查 `theme-analysis.json` 確認提取結果
3. 提交 Issue 到專案 GitHub

---

**版本**: v1.0.0  
**最後更新**: 2026-03-24
