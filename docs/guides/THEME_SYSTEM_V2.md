# AISliDev 主題系統 v2

> **重要變更**: v2 主題系統完全遵循 Slidev 原生主題機制，提供無痛的 NPM 主題支援和簡單的本地自訂。

## 快速開始

### 使用 NPM 主題

直接在 `slides.md` 的 frontmatter 中指定：

```markdown
---
theme: '@slidev/theme-seriph'
---
```

**可用的官方主題**:
- `@slidev/theme-default` - 預設主題
- `@slidev/theme-seriph` - 優雅襯線字體
- `@slidev/theme-apple-basic` - 簡潔蘋果風格

> **✅ 已預安裝**: 容器中已預先安裝上述三個官方主題，可以直接使用。其他官方主題需要手動安裝到 `package.json` 的 `dependencies` 中。

更多主題: https://sli.dev/themes/gallery

### 使用本地主題

使用相對路徑指向主題目錄：

```markdown
---
theme: '../themes/professional-dark-v2'
---
```

**內建本地主題**:
- `professional-dark-v2` - 專業深色風格

## 創建本地主題

### 最小主題結構

```
data/themes/my-theme/
├── package.json         # 必須：主題元數據
└── styles/
    └── index.css       # 必須：主題樣式
```

### package.json

```json
{
  "name": "slidev-theme-my-theme",
  "version": "1.0.0",
  "description": "My custom Slidev theme",
  "keywords": ["slidev-theme", "slidev"],
  "slidev": {
    "colorSchema": "dark",
    "highlighter": "shiki"
  }
}
```

### styles/index.css

```css
:root {
  --slidev-theme-primary: #5d8aa8;
  --slidev-theme-accent: #4db8a8;
  --slidev-theme-background: #1a1a1a;
  --slidev-theme-text: #e8e8e8;
}

.slidev-layout {
  background: var(--slidev-theme-background);
  color: var(--slidev-theme-text);
}
```

### 使用模板快速創建

```bash
# 複製模板
cp -r data/themes/.templates/minimal-theme data/themes/my-new-theme

# 編輯 package.json 和 styles/index.css
# 替換 {{PLACEHOLDERS}} 為實際值

# 在 slides.md 使用
theme: '../themes/my-new-theme'
```

## 主題開發

### CSS 變數參考

**顏色**:
- `--slidev-theme-primary` - 主要顏色
- `--slidev-theme-accent` - 強調顏色
- `--slidev-theme-background` - 背景顏色
- `--slidev-theme-text` - 文字顏色

**字體大小**:
- `--slidev-font-size-h1` - 標題 1
- `--slidev-font-size-h2` - 標題 2
- `--slidev-font-size-body` - 正文

**間距**:
- `--slidev-slides-padding` - 投影片內邊距
- `--slidev-element-gap` - 元素間距

### 自訂佈局（進階）

在主題目錄中創建 `layouts/` 目錄：

```
data/themes/my-theme/
├── package.json
├── styles/
│   └── index.css
└── layouts/
    ├── cover.vue      # 自訂封面佈局
    ├── intro.vue      # 自訂介紹佈局
    └── default.vue    # 自訂預設佈局
```

參考: https://sli.dev/custom/directory-structure

## 與 v1 的差異

### v1 (YAML 主題系統) - 已廢棄

```yaml
# data/themes/my-theme/theme.yaml
name: "My Theme"
colors:
  primary: "#5d8aa8"
```

**問題**: 與 Slidev 原生機制不相容，導致主題無法正常載入。

### v2 (Slidev 原生結構)

```json
// data/themes/my-theme/package.json
{
  "name": "slidev-theme-my-theme",
  "slidev": { "colorSchema": "dark" }
}
```

**優點**:
- ✅ 完全相容 Slidev
- ✅ 支援所有 Slidev 功能
- ✅ 可發布為 NPM 套件

## 遷移指南

### 從 v1 遷移到 v2

1. **識別主題類型**:
   - NPM 代理 → 直接使用 NPM 主題名稱
   - 自訂主題 → 轉換為 Slidev 結構

2. **轉換自訂主題**:
   ```bash
   # 備份舊主題
   mv data/themes/my-theme data/themes/my-theme-v1-backup
   
   # 創建新主題
   cp -r data/themes/.templates/minimal-theme data/themes/my-theme
   
   # 將 v1 的 colors 和 fonts 轉換為 CSS 變數
   # 在 styles/index.css 中設定
   ```

3. **更新 slides.md**:
   ```markdown
   # 舊的
   theme: my-theme
   
   # 新的
   theme: '../themes/my-theme'
   ```

## 故障排除

### 主題找不到

**錯誤**: `The theme "slidev-theme-xxx" was not found`

**解決**:
- NPM 主題: 確認主題名稱正確，執行 `npm install @slidev/theme-xxx`
- 本地主題: 使用相對路徑 `../themes/my-theme`，確認目錄結構正確

### 樣式沒有生效

**檢查**:
1. `package.json` 是否存在且格式正確
2. `styles/index.css` 是否存在
3. CSS 變數名稱是否正確
4. 瀏覽器開發者工具檢查 CSS 是否載入

### 本地主題路徑

**正確**: `theme: '../themes/my-theme'`
**錯誤**: `theme: 'my-theme'` （會被視為 NPM 套件）

## 參考資源

- [Slidev 官方文檔 - 主題](https://sli.dev/themes/use)
- [Slidev 官方文檔 - 創建主題](https://sli.dev/themes/write-a-theme)
- [Slidev 主題畫廊](https://sli.dev/themes/gallery)
- [UnoCSS 文檔](https://unocss.dev/)

## 範例主題

查看 `data/themes/professional-dark-v2/` 獲取完整的本地主題範例。
