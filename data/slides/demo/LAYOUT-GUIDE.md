# AISlidev 教學簡報 - Layout 使用說明

這個簡報展示了如何使用 NICS 主題的各種版面配置。

## 📋 使用的 Layouts

| 頁數 | Layout 名稱      | 用途                  | 特點                  |
| ---- | ---------------- | --------------------- | --------------------- |
| 1    | `封面公開使用-1` | 封面頁                | NICS Logo + 右側圖片  |
| 2    | `章節頁-1`       | 章節：什麼是 AISlidev | 左側重點 + 右側圖片   |
| 3    | `內頁and圖片-1`  | 快速開始              | 程式碼區域 + 右側圖片 |
| 4    | `內頁and圖表-1`  | 核心功能              | 雙欄列表 + 圖表區域   |
| 5    | `章節頁-2`       | 章節：Markdown 語法   | 居中排版 + 背景圖     |
| 6    | `內頁and圖片-2`  | 實用技巧              | 程式碼範例 + 圖片     |
| 7    | `章節頁-3`       | 章節：進階功能        | 網格排版 + 背景       |
| 8    | `前言-1`         | 引言頁                | 大字引言 + 圖片       |
| 9    | `內頁and圖表-2`  | 技術架構              | 雙欄技術棧 + 圖表     |
| 10   | `內頁and圖片-3`  | 開發指南              | 專案結構 + 圖片       |
| 11   | `內頁and圖表-3`  | 常見問題              | FAQ 雙欄 + 圖表       |
| 12   | `章節頁-4`       | 章節：資源連結        | 網格卡片 + 背景       |
| 13   | `封底-1`         | 結束頁                | NICS Logo + 感謝      |

## 🎨 Layout 選擇策略

### 封面相關

- **封面（第一頁）**: `封面公開使用-1` 或 `封面內部使用-2`
- **封底（最後一頁）**: `封底-1`

### 章節分隔

- **章節標題頁**: `章節頁-1` ~ `章節頁-5`
- 選擇原則：根據內容量和視覺需求

### 內容頁

- **圖片為主**: `內頁and圖片-1` ~ `內頁and圖片-4`
- **圖表為主**: `內頁and圖表-1` ~ `內頁and圖表-4`
- **流程圖**: `內頁and流程表-1`

### 特殊頁面

- **引言/名言**: `前言-1` 或 `前言-2`
- **大綱頁**: `大綱-1` 或 `layout-1-大綱-2`
- **空白投影片**: `空白投影片-1`

## 📝 如何修改 Layout

在每一頁的 frontmatter 中指定：

```markdown
---
layout: 封面公開使用-1
class: text-center
---

# 你的標題

內容...
```

## 🔍 查看所有可用 Layouts

完整的 layouts 列表和說明：

```bash
cat data/themes/nics-theme/layouts/README.md
```

或查看主題目錄：

```bash
ls data/themes/nics-theme/layouts/*.vue
```

## 💡 使用技巧

### 1. 保持一致性

同類型內容使用同系列 layout：

- 技術內容 → `內頁and圖表` 系列
- 視覺內容 → `內頁and圖片` 系列
- 章節分隔 → `章節頁` 系列

### 2. 善用背景圖片

每個 layout 都有精心設計的背景圖片位置，不需要額外指定背景。

### 3. 內容區域

所有 layout 都有預留內容區域（`content-area`），你的內容會自動在正確的位置顯示。

### 4. 混搭使用

可以在同一個簡報中混用 NICS layouts 和 Slidev 內建 layouts：

```markdown
---
layout: 封面公開使用-1
---

# NICS 封面

---

## layout: center

# Slidev 內建的 center layout

---

## layout: 內頁and圖片-1

# 回到 NICS layout
```

## 🚀 重新載入簡報

修改 layout 後：

1. 儲存檔案（自動儲存）
2. Slidev 會自動熱重載
3. 查看新的版面效果

## 📚 參考資料

- **NICS 主題文檔**: `data/themes/nics-theme/README.md`
- **完整技術文檔**: `data/themes/nics-theme/COMPLETE-SUMMARY.md`
- **Layouts 說明**: `data/themes/nics-theme/layouts/README.md`
