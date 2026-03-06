# NICS 資安院 Slidev 主題

三個 NICS 資安院官方 PPTX 範本轉換為 Slidev 主題格式。

## 📦 包含主題

### 1. NICS Lightweight（輕量版）

**位置**：`slidev-themes/nics-lightweight/`

**特點**：

- ✅ 4 個基礎佈局
- 🎨 NICS 官方配色
- 🔤 Poppins + Noto Sans TC 字型
- 🖼️ 7 張圖片資源

**佈局清單**：

- `cover` - 封面頁
- `default` - 標準內容頁
- `vertical-text` - 直排文字
- `vertical-title` - 直排標題

**適用場景**：快速簡報、基本需求

---

### 2. NICS Standard（標準版）⭐ 推薦

**位置**：`slidev-themes/nics-standard/`

**特點**：

- ✅ 23 個專業佈局
- 🎨 NICS 官方配色
- 🔤 Poppins + Noto Sans TC 字型
- 🖼️ 19 張圖片資源

**佈局清單**：

**封面類（3個）**：

- `cover-public` - 公開使用封面
- `cover-internal` - 內部使用封面
- `end` - 結束頁

**大綱/前言（4個）**：

- `outline-1`, `outline-2` - 大綱頁
- `intro-1`, `intro-2` - 前言頁

**章節頁（5個）**：

- `section-1` 到 `section-5` - 不同顏色變化的章節頁

**內容頁（13個）**：

- `default` - 標準內容頁
- `content-image-1` 到 `content-image-4` - 內容+圖片佈局
- `content-chart-1` 到 `content-chart-4` - 內容+圖表佈局
- `content-flow` - 內容+流程圖佈局
- `blank` - 空白頁

**適用場景**：正式簡報、完整需求、專業場合

---

### 3. NICS Classic（經典設計版）

**位置**：`slidev-themes/nics-classic/`

**特點**：

- ✅ 23 個專業佈局（同標準版）
- 🎨 NICS 官方配色
- 🔤 Arial 通用字型
- 🖼️ 16 張圖片資源

**佈局清單**：與標準版相同

**適用場景**：需要通用字型、跨平台兼容性

---

## 🚀 使用方法

### 方式 1：本地主題

在您的 Slidev Markdown 文件開頭使用相對路徑：

```markdown
---
theme: ./slidev-themes/nics-lightweight
layout: cover
---

# 您的簡報標題
```

### 方式 2：範例檔案

每個主題都包含 `example.md` 範例檔案，可以直接運行：

```bash
cd slidev-themes/nics-standard
npm install
npm run dev
```

---

## 📐 佈局使用範例

### 封面頁（標準版/經典版）

```markdown
---
layout: cover-public
---

# 簡報標題

::meta::
簡報人員：張三 資深研究員  
簡報單位：資安技術中心  
簡報日期：2026 年 3 月 6 日
```

### 章節頁

```markdown
---
layout: section-1
---

# 第一章

::subtitle::
簡介與背景
```

### 內容+圖片頁

```markdown
---
layout: content-image-1
---

::title::

# 技術架構

左側放置文字說明...

::image::
![架構圖](/path/to/image.png)
```

---

## 🎨 配色方案

所有主題共用 NICS 官方配色：

| 顏色名稱 | 十六進制  | 用途           |
| -------- | --------- | -------------- |
| Primary  | `#009594` | 主色（青綠）   |
| Accent 1 | `#C2C823` | 強調色（黃綠） |
| Accent 2 | `#93CFBF` | 輔助色（淺青） |
| Accent 3 | `#FFDF71` | 輔助色（淺黃） |
| Accent 4 | `#8BC560` | 輔助色（草綠） |
| Accent 5 | `#4FB9A0` | 輔助色（海綠） |
| Accent 6 | `#368EA5` | 輔助色（深青） |
| Dark     | `#242424` | 深色文字       |
| Light    | `#FFFFFF` | 淺色背景       |

---

## 📝 注意事項

1. **字型需求**：
   - 輕量版/標準版需要 Google Fonts 的 Poppins 和 Noto Sans TC
   - 經典版使用 Arial 系統字型，無需額外安裝

2. **圖片資源**：
   - 所有圖片已包含在各主題的 `public/` 目錄
   - 可在佈局中使用 `/imageX.png` 路徑引用

3. **Slidev 版本**：
   - 建議使用 Slidev 0.48.0 或更高版本

---

## 📚 進一步學習

- [Slidev 官方文檔](https://sli.dev/)
- [Slidev 主題開發指南](https://sli.dev/guide/write-theme)
- [UnoCSS 文檔](https://unocss.dev/)

---

## 📄 授權

MIT License

---

**Built with ❤️ for NICS Cybersecurity Institute**
