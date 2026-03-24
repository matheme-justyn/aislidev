# Theme Configuration Guide

AISliDev v0.6.0 統一主題系統 - 完整配置指南

## 目錄

- [快速開始](#快速開始)
- [主題類型](#主題類型)
- [配置參考](#配置參考)
- [創建自訂主題](#創建自訂主題)
- [使用 NPM 主題](#使用-npm-主題)
- [範例集](#範例集)
- [故障排除](#故障排除)

---

## 快速開始

### 使用現有主題

AISliDev 預設提供 5 個主題：

**自訂主題**:
- `professional-dark` - 專業深色風格
- `creative-gradient` - 創意漸層風格
- `minimal-clean` - 極簡清爽風格

**NPM 主題代理**:
- `seriph` - Slidev 官方 Seriph 主題
- `apple-basic` - Slidev 官方 Apple Basic 主題

使用主題：在編輯器中打開「主題切換器」，選擇您想要的主題即可。

### 創建新主題

1. 在 `data/themes/` 創建新目錄（例如 `my-theme/`）
2. 創建 `theme.yaml` 配置檔案
3. （可選）創建 `custom.css` 自訂樣式
4. 重新載入編輯器，新主題會自動出現在主題列表中

---

## 主題類型

AISliDev 支援兩種主題類型：

### 類型 A: NPM 主題代理

使用 Slidev 官方或社群的 NPM 主題包，AISliDev 會自動安裝。

**最簡單的 `theme.yaml`**:
```yaml
npm: "@slidev/theme-seriph"
```

**帶有覆蓋配置的 `theme.yaml`**:
```yaml
npm: "@slidev/theme-seriph"

# 覆蓋主題的顏色
colors:
  primary: "#ff0000"
  accent: "#00ff00"
```

**優點**:
- ✅ 使用經過驗證的官方主題
- ✅ 自動安裝和更新
- ✅ 支援所有 Slidev 主題生態
- ✅ 可以覆蓋部分樣式

**缺點**:
- ❌ 需要網路連線（首次安裝）
- ❌ 客製化程度有限

### 類型 B: 完整自訂主題

從零開始創建您自己的主題，完全控制所有樣式。

**`theme.yaml`**:
```yaml
name: "My Awesome Theme"
description: "A custom theme for my presentations"
author: "Your Name"
version: "1.0.0"

colorSchema: dark

colors:
  primary: "#5d8aa8"
  accent: "#4db8a8"
  background: "#1a1a1a"
  text: "#e8e8e8"

fonts:
  sans: "Inter, system-ui, sans-serif"
  mono: "Fira Code, monospace"

fontSizes:
  h1: 3.5
  h2: 2.5
  body: 1.25

customCSS: "custom.css"
```

**`custom.css`** (可選):
```css
/* 額外的自訂樣式 */
.slidev-layout {
  /* ... */
}
```

**優點**:
- ✅ 完全客製化
- ✅ 不需要網路連線
- ✅ 易於分享（ZIP 打包）
- ✅ 快速迭代開發

**缺點**:
- ❌ 需要手動維護
- ❌ 需要 CSS 知識

---

## 配置參考

### 完整 `theme.yaml` 格式

```yaml
# ============================================
# 主題元數據 (必填)
# ============================================
name: "My Theme"
description: "Theme description"
author: "Your Name"
version: "1.0.0"

# ============================================
# 色彩模式 (可選，預設: light)
# ============================================
colorSchema: dark  # 可選: light, dark, auto

# ============================================
# 顏色配置 (可選)
# ============================================
colors:
  # 主要顏色
  primary: "#5d8aa8"           # 主要強調色
  accent: "#4db8a8"            # 次要強調色
  
  # 背景顏色
  background: "#1a1a1a"        # 主背景
  backgroundAlt: "#2d2d2d"     # 次背景（表格、代碼塊等）
  
  # 文字顏色
  text: "#e8e8e8"              # 主文字
  textSecondary: "#b8b8b8"     # 次要文字
  textMuted: "#888888"         # 淡化文字
  
  # 代碼顏色
  codeBackground: "#2d2d2d"    # 代碼塊背景
  codeForeground: "#e8e8e8"    # 代碼文字
  
  # 邊框顏色
  border: "#404040"            # 邊框、分隔線

# ============================================
# 字型配置 (可選)
# ============================================
fonts:
  # 系統字型
  sans: "Inter, system-ui, sans-serif"
  serif: "Georgia, serif"
  mono: "Fira Code, Menlo, monospace"
  
  # 自訂字型
  custom:
    - name: "My Custom Font"
      family: "MyFont"
      files:
        - path: "assets/font-regular.woff2"
          weight: 400
        - path: "assets/font-bold.woff2"
          weight: 700

# ============================================
# 字型大小 (rem 單位，可選)
# ============================================
fontSizes:
  h1: 3.5      # 標題 1
  h2: 2.5      # 標題 2
  h3: 2.0      # 標題 3
  h4: 1.5      # 標題 4
  body: 1.0    # 正文
  code: 0.9    # 代碼

# ============================================
# 間距配置 (rem 單位，可選)
# ============================================
spacing:
  slidesPadding: 2.0    # 投影片內邊距
  elementGap: 1.0       # 元素間距

# ============================================
# 背景配置 (可選)
# ============================================
backgrounds:
  default: "assets/bg.jpg"         # 預設背景
  cover: "assets/cover-bg.jpg"     # 封面背景

# ============================================
# 自訂 CSS (可選)
# ============================================
customCSS: "custom.css"
```

### NPM 主題配置

```yaml
# 最簡配置
npm: "@slidev/theme-seriph"

# 帶覆蓋配置
npm: "@slidev/theme-seriph"

colors:
  primary: "#ff0000"

fonts:
  sans: "Arial, sans-serif"

fontSizes:
  h1: 4.0

spacing:
  slidesPadding: 3.0
```

---

## 創建自訂主題

### 步驟 1: 創建主題目錄

```bash
mkdir data/themes/my-awesome-theme
cd data/themes/my-awesome-theme
```

### 步驟 2: 創建 `theme.yaml`

```yaml
name: "My Awesome Theme"
description: "A custom theme for my presentations"
author: "Your Name"
version: "1.0.0"

colorSchema: dark

colors:
  primary: "#667eea"
  accent: "#764ba2"
  background: "#1a1a1a"
  backgroundAlt: "#2d2d2d"
  text: "#e8e8e8"
  textSecondary: "#b8b8b8"
  textMuted: "#888888"
  codeBackground: "#2d2d2d"
  codeForeground: "#e8e8e8"
  border: "#404040"

fonts:
  sans: "system-ui, -apple-system, sans-serif"
  mono: "Fira Code, Consolas, monospace"

fontSizes:
  h1: 3.5
  h2: 2.5
  h3: 2.0
  body: 1.25
  code: 0.9

spacing:
  slidesPadding: 2.0
  elementGap: 1.0

customCSS: "custom.css"
```

### 步驟 3: 創建 `custom.css` (可選)

```css
/* My Awesome Theme - Custom Styles */

.slidev-layout {
  background-color: var(--slidev-theme-background);
  color: var(--slidev-theme-text);
}

h1 {
  font-size: var(--slidev-font-size-h1);
  color: var(--slidev-theme-primary);
}

/* 添加更多自訂樣式... */
```

### 步驟 4: 測試主題

1. 重新載入 AISliDev 編輯器
2. 打開「主題切換器」
3. 選擇「My Awesome Theme」
4. 檢查預覽效果

---

## 使用 NPM 主題

### 官方 Slidev 主題

Slidev 提供以下官方主題：

- `@slidev/theme-default` - 預設主題
- `@slidev/theme-seriph` - 優雅的襯線字體
- `@slidev/theme-apple-basic` - 簡潔的蘋果風格
- `@slidev/theme-bricks` - 磚塊風格
- `@slidev/theme-shibainu` - 柴犬風格

### 社群主題

社群貢獻了許多優秀的主題（[NPM 搜尋](https://www.npmjs.com/search?q=keywords:slidev-theme)）：

- `slidev-theme-academic` - 學術演示風格
- `slidev-theme-geist` - Geist 設計風格
- `slidev-theme-penguin` - 企鵝風格
- 更多...

### 創建 NPM 主題代理

**範例**: 使用 Slidev Academic 主題

1. 創建主題目錄：
```bash
mkdir data/themes/academic
```

2. 創建 `theme.yaml`：
```yaml
npm: "slidev-theme-academic"
```

3. 重新載入編輯器，AISliDev 會自動安裝該主題

### 覆蓋 NPM 主題樣式

```yaml
npm: "@slidev/theme-seriph"

# 覆蓋顏色
colors:
  primary: "#ff6b6b"      # 改變主要顏色
  accent: "#4ecdc4"       # 改變強調色

# 覆蓋字型
fonts:
  sans: "Arial, sans-serif"

# 覆蓋字型大小
fontSizes:
  h1: 4.5
  body: 1.5
```

---

## 範例集

### 範例 1: 深色專業主題

```yaml
name: "Professional Dark"
description: "深色專業風格"
colorSchema: dark

colors:
  primary: "#5d8aa8"
  accent: "#4db8a8"
  background: "#1a1a1a"
  backgroundAlt: "#2d2d2d"
  text: "#e8e8e8"
  textSecondary: "#b8b8b8"
  codeBackground: "#2d2d2d"

fonts:
  sans: "system-ui, sans-serif"
  mono: "Fira Code, monospace"

fontSizes:
  h1: 3.5
  h2: 2.5
  body: 1.25
```

### 範例 2: 淺色極簡主題

```yaml
name: "Minimal Clean"
description: "淺色極簡風格"
colorSchema: light

colors:
  primary: "#2c3e50"
  accent: "#34495e"
  background: "#f8f9fa"
  backgroundAlt: "#ffffff"
  text: "#2c3e50"
  textSecondary: "#555555"
  codeBackground: "#f5f5f5"

fonts:
  sans: "system-ui, sans-serif"
  mono: "Fira Code, monospace"

fontSizes:
  h1: 4.0
  h2: 2.5
  body: 1.5

spacing:
  slidesPadding: 4.0
```

### 範例 3: 創意漸層主題

```yaml
name: "Creative Gradient"
description: "紫色漸層創意風格"
colorSchema: dark

colors:
  primary: "#667eea"
  accent: "#764ba2"
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  text: "#ffffff"
  textSecondary: "#f0f0f0"
  codeBackground: "rgba(0, 0, 0, 0.3)"

fonts:
  sans: "system-ui, sans-serif"
  mono: "Fira Code, monospace"

fontSizes:
  h1: 4.0
  h2: 2.75
  body: 1.5

customCSS: "custom.css"
```

### 範例 4: NPM 主題 + 覆蓋

```yaml
npm: "@slidev/theme-seriph"

# 覆蓋部分樣式
colors:
  primary: "#e74c3c"    # 紅色主調
  accent: "#3498db"     # 藍色強調

fontSizes:
  h1: 5.0             # 更大的標題
  body: 1.3           # 更大的正文
```

---

## 故障排除

### 主題沒有出現在列表中

**問題**: 創建的主題沒有顯示在主題切換器中

**解決方案**:
1. 確認 `data/themes/your-theme/` 目錄存在
2. 確認 `theme.yaml` 檔案格式正確（使用 YAML 驗證器）
3. 檢查主題名稱是否與現有主題重複
4. 重新啟動 AISliDev 服務

### NPM 主題安裝失敗

**問題**: NPM 主題無法自動安裝

**解決方案**:
1. 檢查網路連線
2. 確認套件名稱正確（例如 `@slidev/theme-seriph`）
3. 手動安裝：`npm install @slidev/theme-seriph`
4. 檢查伺服器日誌中的錯誤訊息

### 樣式沒有正確應用

**問題**: 主題配置後，樣式沒有變化

**解決方案**:
1. 檢查 `colorSchema` 是否正確（`light`, `dark`, 或 `auto`）
2. 確認顏色值格式正確（`#rrggbb` 或 CSS 顏色名稱）
3. 檢查 `customCSS` 檔案路徑是否正確
4. 清除瀏覽器快取並重新載入

### YAML 語法錯誤

**問題**: `Invalid theme configuration` 錯誤

**解決方案**:
1. 檢查縮排（YAML 使用空格，不是 Tab）
2. 檢查引號和特殊字符
3. 使用線上 YAML 驗證器檢查語法
4. 查看範例主題的格式

**常見 YAML 錯誤**:

```yaml
# ❌ 錯誤：使用 Tab 縮排
colors:
	primary: "#ff0000"

# ✅ 正確：使用空格縮排
colors:
  primary: "#ff0000"

# ❌ 錯誤：缺少引號
description: This is a theme

# ✅ 正確：使用引號
description: "This is a theme"
```

### 自訂字型無法載入

**問題**: 自訂字型檔案無法載入

**解決方案**:
1. 確認字型檔案路徑正確（相對於主題目錄）
2. 支援的字型格式：`.woff2`, `.woff`, `.ttf`
3. 確認字型檔案大小不超過 2MB
4. 檢查字型 `family` 名稱與 CSS 中的使用一致

### 背景圖片無法顯示

**問題**: 配置的背景圖片沒有顯示

**解決方案**:
1. 確認圖片檔案存在於 `assets/` 目錄
2. 支援的圖片格式：`.jpg`, `.png`, `.webp`
3. 確認圖片路徑正確（相對於主題目錄）
4. 檢查圖片檔案大小（建議小於 1MB）

---

## 進階用法

### 響應式設計

使用 CSS 媒體查詢在 `custom.css` 中實現響應式設計：

```css
/* custom.css */
@media (max-width: 1024px) {
  h1 {
    font-size: 2.5rem;
  }
}
```

### 動畫效果

在 `custom.css` 中添加動畫：

```css
/* custom.css */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

h1 {
  animation: fadeInUp 1s ease-out;
}
```

### 主題變數

所有主題配置會轉換為 CSS 變數，可在 `custom.css` 中使用：

```css
/* custom.css */
.custom-element {
  background: var(--slidev-theme-primary);
  color: var(--slidev-theme-text);
  font-size: var(--slidev-font-size-body);
  padding: var(--slidev-spacing-element-gap);
}
```

**可用的 CSS 變數**:

**顏色**:
- `--slidev-theme-primary`
- `--slidev-theme-accent`
- `--slidev-theme-background`
- `--slidev-theme-background-alt`
- `--slidev-theme-text`
- `--slidev-theme-text-secondary`
- `--slidev-theme-text-muted`
- `--slidev-code-background`
- `--slidev-code-foreground`
- `--slidev-theme-border`

**字型**:
- `--slidev-font-sans`
- `--slidev-font-serif`
- `--slidev-font-mono`

**字型大小**:
- `--slidev-font-size-h1`
- `--slidev-font-size-h2`
- `--slidev-font-size-h3`
- `--slidev-font-size-h4`
- `--slidev-font-size-body`
- `--slidev-font-size-code`

**間距**:
- `--slidev-spacing-slides-padding`
- `--slidev-spacing-element-gap`

---

## 分享主題

### 打包主題為 ZIP

```bash
cd data/themes
zip -r my-awesome-theme.zip my-awesome-theme/
```

### 上傳主題

（未來功能 - v0.8.0）

在 AISliDev 編輯器中：
1. 點擊「主題切換器」
2. 點擊「上傳主題」
3. 選擇 ZIP 檔案
4. 主題會自動解壓並可使用

---

## 版本歷史

### v0.6.0 (Current)
- ✅ 統一 YAML 主題系統
- ✅ NPM 主題代理支援
- ✅ 自訂主題完整支援
- ✅ ThemeLoader 和 CSSGenerator 服務

### v0.5.1
- ✅ 動態主題載入

### v0.5.0
- ✅ 主題切換器

---

## 參考資源

- [Slidev 官方文檔](https://sli.dev/)
- [Slidev 主題開發](https://sli.dev/themes/write-a-theme.html)
- [YAML 語法指南](https://yaml.org/spec/1.2.2/)
- [CSS 變數參考](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

---

## 支援

如有問題或建議，請：
- 查看 [GitHub Issues](https://github.com/yourusername/aislidev/issues)
- 參考 [AGENTS.md](../AGENTS.md) 了解開發指南
- 查看 [CHANGELOG.md](../CHANGELOG.md) 了解最新更新
