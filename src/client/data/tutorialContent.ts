/**
 * Tutorial content for AISliDev
 * 教學內容 - 簡報和模板使用指南
 */

export interface TutorialSection {
  id: string;
  icon: string;
  title: string;
  description: string;
  content: {
    subtitle: string;
    items: string[];
  }[];
  example?: {
    title: string;
    code: string;
    language: string;
  };
}

export const tutorialSections: TutorialSection[] = [
  {
    id: "presentations",
    icon: "📝",
    title: "簡報檔案 (Presentations)",
    description: "如何組織和配置您的 Slidev 簡報檔案",
    content: [
      {
        subtitle: "📁 檔案位置與目錄結構",
        items: [
          "所有簡報檔案必須放在 <code>data/</code> 目錄下",
          "每個簡報是一個獨立的目錄，包含 <code>slides.md</code> 檔案",
          "可以在簡報目錄中放置圖片、資源檔案等",
          "",
          "<strong>目錄結構範例：</strong>",
          "<code>data/</code>",
          "├── <code>my-tech-talk/</code>",
          "│   ├── <code>slides.md</code> ← 主要簡報檔案",
          "│   ├── <code>images/</code> ← 圖片資源",
          "│   └── <code>assets/</code> ← 其他資源",
          "├── <code>product-demo/</code>",
          "│   └── <code>slides.md</code>",
          "└── <code>aislidev-demo/</code> ← 內建範例",
        ],
      },
      {
        subtitle: "📝 slides.md 基本結構",
        items: [
          "<strong>檔案組成：</strong>",
          "1. <strong>Frontmatter 配置區塊</strong> - 使用 <code>---</code> 包圍的 YAML 設定",
          "2. <strong>投影片內容</strong> - 使用 Markdown 語法編寫",
          "3. <strong>分隔符號</strong> - 使用 <code>---</code> 分隔每一頁投影片",
          "",
          "<strong>Frontmatter 必須放在檔案最開頭</strong>，包含簡報的全域設定：",
          "• <code>theme:</code> - 指定使用的模板（模板名稱或相對路徑）",
          "• <code>background:</code> - 首頁背景圖片 URL",
          "• <code>layout:</code> - 投影片版面配置（cover、intro、image 等）",
          "• <code>colorSchema:</code> - 色彩模式（dark、light、auto）",
          "• <code>highlighter:</code> - 代碼高亮工具（shiki 或 prism）",
          "• <code>lineNumbers:</code> - 是否顯示代碼行號",
          "",
          "<strong>💡 提示：背景圖片必須搭配 layout</strong>",
          "要使用背景圖片，必須設定 <code>layout: cover</code>（或其他支援背景的版面）",
          "否則背景圖片不會顯示，會使用預設模板背景",
        ],
      },
      {
        subtitle: "✅ 注意事項",
        items: [
          "簡報目錄名稱使用英文和連字號（例如：<code>my-presentation</code>）",
          "必須包含 <code>slides.md</code> 檔案（檔名固定）",
          "使用 UTF-8 編碼儲存 Markdown 檔案",
          "圖片路徑使用相對路徑（例如：<code>./images/photo.jpg</code>）",
          "Frontmatter 使用空格縮排，不要使用 Tab",
          "分隔符號 <code>---</code> 前後必須是空行",
        ],
      },
    ],
    example: {
      title: "slides.md 完整範例",
      language: "markdown",
      code: `---
# Frontmatter 配置區塊
theme: professional-dark
layout: cover
background: https://images.unsplash.com/photo-xxx
colorSchema: dark
highlighter: shiki
lineNumbers: true
---

# 我的簡報標題

副標題或說明文字

---

# 第二頁投影片

- 項目 1
- 項目 2
- 項目 3

---

# 結尾

謝謝觀看！`,
    },
  },
  {
    id: "templates",
    icon: "🎨",
    title: "主題系統 (Theme System v2)",
    description: "使用 Slidev 原生主題機制 - 支援 NPM 主題和本地自訂主題",
    content: [
      {
        subtitle: "🎨 兩種主題類型",
        items: [
          "<strong>類型 A: NPM 主題（推薦）</strong> - 使用 Slidev 官方或社群主題",
          "• 直接在 <code>slides.md</code> 的 frontmatter 指定主題名稱",
          "• 例如：<code>theme: '@slidev/theme-seriph'</code>",
          "• 官方主題已預安裝在容器中，可直接使用",
          '• 更多主題：<a href="https://sli.dev/themes/gallery" target="_blank">Slidev 主題庫</a>',
          "",
          "<strong>類型 B: 本地自訂主題</strong> - 完全客製化的主題",
          "• 使用 Slidev 原生結構：<code>package.json</code> + <code>styles/index.css</code>",
          "• 使用相對路徑指向主題目錄：<code>theme: '../themes/my-theme'</code>",
          "• 使用 CSS 變數控制顏色、字體、間距等",
          "• 完全相容 Slidev，可發布為 NPM 套件",
        ],
      },
      {
        subtitle: "📦 使用 NPM 主題（最簡單）",
        items: [
          "<strong>✅ 已預安裝的官方主題：</strong>",
          "• <code>@slidev/theme-default</code> - 預設主題",
          "• <code>@slidev/theme-seriph</code> - 優雅襯線字體",
          "• <code>@slidev/theme-apple-basic</code> - 簡潔蘋果風格",
          "",
          "<strong>如何使用：</strong>",
          "直接在 <code>slides.md</code> 的 frontmatter 指定：",
          "<code>---</code>",
          "<code>theme: '@slidev/theme-seriph'</code>",
          "<code>---</code>",
          "",
          "<strong>💡 提示：</strong>",
          "• 主題名稱包含 <code>@</code> 符號時必須用單引號包裹",
          "• 在主題切換器中選擇主題會自動更新 frontmatter",
          "• 其他 Slidev 主題需手動安裝到 <code>package.json</code>",
        ],
      },
      {
        subtitle: "🎨 創建本地自訂主題",
        items: [
          "<strong>1. 使用模板快速創建：</strong>",
          "<code>cp -r data/themes/.templates/minimal-theme data/themes/my-theme</code>",
          "",
          "<strong>2. 必需的檔案結構：</strong>",
          "<code>data/themes/my-theme/</code>",
          "├── <code>package.json</code> ← 主題元數據（必須）",
          "└── <code>styles/</code>",
          "    └── <code>index.css</code> ← 主題樣式（必須）",
          "",
          "<strong>3. 編輯 package.json：</strong>",
          "<code>{</code>",
          '<code>  "name": "slidev-theme-my-theme",</code>',
          '<code>  "slidev": { "colorSchema": "dark" }</code>',
          "<code>}</code>",
          "",
          "<strong>4. 編輯 styles/index.css（使用 CSS 變數）：</strong>",
          "<code>:root {</code>",
          "<code>  --slidev-theme-primary: #5d8aa8;</code>",
          "<code>  --slidev-theme-accent: #4db8a8;</code>",
          "<code>}</code>",
          "",
          "<strong>5. 在 slides.md 使用：</strong>",
          "<code>theme: '../themes/my-theme'</code>",
        ],
      },
      {
        subtitle: "🎨 可用的 CSS 變數",
        items: [
          "<strong>顏色：</strong>",
          "• <code>--slidev-theme-primary</code> - 主要顏色",
          "• <code>--slidev-theme-accent</code> - 強調顏色",
          "• <code>--slidev-theme-background</code> - 背景顏色",
          "• <code>--slidev-theme-text</code> - 文字顏色",
          "",
          "<strong>字體大小：</strong>",
          "• <code>--slidev-font-size-h1</code> - 標題 1",
          "• <code>--slidev-font-size-h2</code> - 標題 2",
          "• <code>--slidev-font-size-body</code> - 正文",
          "",
          "<strong>間距：</strong>",
          "• <code>--slidev-slides-padding</code> - 投影片內邊距",
          "• <code>--slidev-element-gap</code> - 元素間距",
        ],
      },
      {
        subtitle: "✅ 注意事項",
        items: [
          "主題目錄名稱使用英文和連字號（例如：<code>my-theme</code>）",
          "必須包含 <code>package.json</code> 和 <code>styles/index.css</code>",
          "主題名稱必須以 <code>slidev-theme-</code> 開頭",
          "NPM 主題名稱包含 <code>@</code> 時必須用單引號包裹",
          "本地主題使用相對路徑（<code>../themes/my-theme</code>）",
          "完整文檔：<code>docs/guides/THEME_SYSTEM_V2.md</code>",
        ],
      },
    ],
    example: {
      title: "主題使用範例",
      language: "markdown",
      code: `# 方式 1: 使用 NPM 主題（最簡單）
---
theme: '@slidev/theme-seriph'
---

# 我的簡報
內容...

---

# 方式 2: 使用本地主題
---
theme: '../themes/professional-dark-v2'
---

# 我的簡報
內容...`,
    },
  },
  {
    id: "troubleshooting",
    icon: "🔧",
    title: "常見問題",
    description: "使用過程中可能遇到的問題和解決方法",
    content: [
      {
        subtitle: "❌ 簡報打不開",
        items: [
          "<strong>問題：</strong>點擊「Open」後沒有看到我的簡報",
          "<strong>解決：</strong>",
          "1. 確認簡報目錄在 <code>data/</code> 下",
          "2. 確認包含 <code>slides.md</code> 檔案",
          "3. 檢查檔名拼寫（必須是 <code>slides.md</code>）",
          "4. 重新整理頁面",
        ],
      },
      {
        subtitle: "❌ 主題沒有出現在列表中",
        items: [
          "<strong>問題：</strong>創建的本地主題沒有出現在主題列表中",
          "<strong>解決：</strong>",
          "1. 確認主題目錄在 <code>data/themes/</code> 下",
          "2. 確認包含 <code>package.json</code> 和 <code>styles/index.css</code>",
          "3. 檢查 <code>package.json</code> 的 JSON 格式是否正確",
          "4. 主題名稱必須以 <code>slidev-theme-</code> 開頭",
          "5. 重新整理頁面",
        ],
      },
      {
        subtitle: "❌ NPM 主題找不到",
        items: [
          "<strong>問題：</strong>使用 NPM 主題時出現「主題未找到」錯誤",
          "<strong>解決：</strong>",
          "1. 確認主題名稱正確（例如：<code>@slidev/theme-seriph</code>）",
          "2. 確認主題名稱用單引號包裹（如果包含 <code>@</code> 符號）",
          "3. 官方主題已預安裝，其他主題需手動安裝到 <code>package.json</code>",
          "4. 手動安裝：<code>npm install @slidev/theme-xxx</code>",
        ],
      },
      {
        subtitle: "❌ 主題樣式沒有生效",
        items: [
          "<strong>問題：</strong>切換主題後樣式沒有改變",
          "<strong>解決：</strong>",
          "1. 檢查 <code>package.json</code> 中的 <code>slidev.colorSchema</code> 設定",
          "2. 確認 <code>styles/index.css</code> 中的 CSS 變數正確",
          "3. 清除瀏覽器快取並重新載入",
          "4. 檢查主題路徑是否正確（本地主題需使用相對路徑）",
        ],
      },
      {
        subtitle: "❌ Frontmatter 配置無效",
        items: [
          "<strong>問題：</strong>修改 Frontmatter 後沒有效果",
          "<strong>解決：</strong>",
          "1. 確認 Frontmatter 在 <code>slides.md</code> 的最開頭",
          "2. 檢查三個連字號 <code>---</code> 是否正確",
          "3. 檢查 YAML 語法（縮排、冒號、引號）",
          "4. 儲存檔案後重新整理預覽",
        ],
      },
      {
        subtitle: "💡 更多幫助",
        items: [
          "查看完整文檔：<code>docs/guides/THEME_SYSTEM_V2.md</code>",
          'Slidev 官方文檔：<a href="https://sli.dev/" target="_blank">https://sli.dev/</a>',
          'Slidev 主題庫：<a href="https://sli.dev/themes/gallery" target="_blank">主題庫</a>',
          "GitHub Issues：報告 Bug 或提出功能建議",
        ],
      },
    ],
  },
];
