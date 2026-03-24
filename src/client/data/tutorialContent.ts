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
    id: 'presentations',
    icon: '📝',
    title: '簡報檔案 (Presentations)',
    description: '如何組織和配置您的 Slidev 簡報檔案',
    content: [
      {
        subtitle: '📁 檔案位置與目錄結構',
        items: [
          '所有簡報檔案必須放在 <code>data/</code> 目錄下',
          '每個簡報是一個獨立的目錄，包含 <code>slides.md</code> 檔案',
          '可以在簡報目錄中放置圖片、資源檔案等',
          '',
          '<strong>目錄結構範例：</strong>',
          '<code>data/</code>',
          '├── <code>my-tech-talk/</code>',
          '│   ├── <code>slides.md</code> ← 主要簡報檔案',
          '│   ├── <code>images/</code> ← 圖片資源',
          '│   └── <code>assets/</code> ← 其他資源',
          '├── <code>product-demo/</code>',
          '│   └── <code>slides.md</code>',
          '└── <code>aislidev-demo/</code> ← 內建範例',
        ],
      },
      {
        subtitle: '📝 slides.md 基本結構',
        items: [
          '<strong>檔案組成：</strong>',
          '1. <strong>Frontmatter 配置區塊</strong> - 使用 <code>---</code> 包圍的 YAML 設定',
          '2. <strong>投影片內容</strong> - 使用 Markdown 語法編寫',
          '3. <strong>分隔符號</strong> - 使用 <code>---</code> 分隔每一頁投影片',
          '',
          '<strong>Frontmatter 必須放在檔案最開頭</strong>，包含簡報的全域設定：',
          '• <code>theme:</code> - 指定使用的模板（模板名稱或相對路徑）',
          '• <code>background:</code> - 首頁背景圖片 URL',
          '• <code>layout:</code> - 投影片版面配置（cover、intro、image 等）',
          '• <code>colorSchema:</code> - 色彩模式（dark、light、auto）',
          '• <code>highlighter:</code> - 代碼高亮工具（shiki 或 prism）',
          '• <code>lineNumbers:</code> - 是否顯示代碼行號',
          '',
          '<strong>💡 提示：背景圖片必須搭配 layout</strong>',
          '要使用背景圖片，必須設定 <code>layout: cover</code>（或其他支援背景的版面）',
          '否則背景圖片不會顯示，會使用預設模板背景',
        ],
      },
      {
        subtitle: '✅ 注意事項',
        items: [
          '簡報目錄名稱使用英文和連字號（例如：<code>my-presentation</code>）',
          '必須包含 <code>slides.md</code> 檔案（檔名固定）',
          '使用 UTF-8 編碼儲存 Markdown 檔案',
          '圖片路徑使用相對路徑（例如：<code>./images/photo.jpg</code>）',
          'Frontmatter 使用空格縮排，不要使用 Tab',
          '分隔符號 <code>---</code> 前後必須是空行',
        ],
      },
    ],
    example: {
      title: 'slides.md 完整範例',
      language: 'markdown',
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
    id: 'templates',
    icon: '🎨',
    title: '模板檔案 (Templates)',
    description: '如何使用 NPM 模板或創建自訂模板',
    content: [
      {
        subtitle: '🎨 兩種模板類型',
        items: [
          '<strong>類型 A: NPM 模板代理</strong> - 使用 Slidev 官方或社群模板',
          '• 只需一個 <code>theme.yaml</code>，內容為 <code>npm: "@slidev/theme-name"</code>',
          '• AISliDev 會自動安裝 NPM 套件',
          '• 快速套用專業設計的模板',
          '',
          '<strong>類型 B: 完整自訂模板</strong> - 完全客製化的模板',
          '• 包含完整的 <code>theme.yaml</code> 配置（顏色、字型、間距等）',
          '• 可以添加 <code>custom.css</code> 進行進階樣式設定',
          '• 完全控制視覺設計',
        ],
      },
      {
        subtitle: '📦 使用 NPM 模板（推薦）',
        items: [
          '<strong>可用的 NPM 模板：</strong>',
          '• <code>@slidev/theme-default</code> - 預設模板',
          '• <code>@slidev/theme-seriph</code> - 優雅襯線字體',
          '• <code>@slidev/theme-apple-basic</code> - 簡潔蘋果風格',
          '• <code>slidev-theme-academic</code> - 學術演示',
          '• <code>slidev-theme-geist</code> - Geist 設計風格',
          '',
          '<strong>如何使用：</strong>',
          '1. 在 <code>data/themes/</code> 創建新目錄（例如：<code>my-seriph</code>）',
          '2. 創建 <code>theme.yaml</code>，只需一行：<code>npm: "@slidev/theme-seriph"</code>',
          '3. 重新載入編輯器，AISliDev 會自動安裝',
          '4. 在模板切換器中選擇新模板',
          '',
          '<strong>💡 進階：覆蓋 NPM 模板樣式</strong>',
          '可以在同一個 <code>theme.yaml</code> 中覆蓋顏色設定：',
          '<code>npm: "@slidev/theme-seriph"</code>',
          '<code>colors:</code>',
          '<code>  primary: "#ff0000"</code> ← 自訂主色',
        ],
      },
      {
        subtitle: '🎨 創建自訂模板',
        items: [
          '<strong>檔案位置：</strong>',
          '所有模板檔案必須放在 <code>data/themes/</code> 目錄下',
          '每個模板是一個獨立的目錄，包含 <code>theme.yaml</code> 配置檔案',
          '',
          '<strong>目錄結構：</strong>',
          '<code>data/themes/</code>',
          '├── <code>professional-dark/</code> ← 完整自訂模板',
          '│   ├── <code>theme.yaml</code> ← 模板配置',
          '│   └── <code>custom.css</code> ← 自訂樣式（可選）',
          '├── <code>my-custom-template/</code>',
          '│   ├── <code>theme.yaml</code>',
          '│   ├── <code>custom.css</code>',
          '│   └── <code>assets/</code> ← 背景圖片、字型等',
          '└── <code>seriph/</code> ← NPM 模板代理',
          '    └── <code>theme.yaml</code>',
          '',
          '<strong>theme.yaml 配置項目：</strong>',
          '• <code>name</code> - 模板名稱',
          '• <code>colors</code> - 顏色設定（primary、accent、background、text）',
          '• <code>fonts</code> - 字型設定（sans、serif、mono）',
          '• <code>fontSizes</code> - 字體大小（h1、h2、body）',
          '• <code>customCSS</code> - 自訂 CSS 檔案路徑',
        ],
      },
      {
        subtitle: '✅ 注意事項',
        items: [
          '模板目錄名稱使用英文和連字號（例如：<code>my-template</code>）',
          '必須包含 <code>theme.yaml</code> 檔案（檔名固定）',
          'YAML 格式使用空格縮排，不要使用 Tab',
          '顏色值使用 CSS 格式（例如：<code>#ff0000</code> 或 <code>rgb(255, 0, 0)</code>）',
          'NPM 模板需要網路連線（首次安裝）',
          '更多 NPM 模板：<a href="https://www.npmjs.com/search?q=keywords:slidev-theme" target="_blank">npm 模板列表</a>',
        ],
      },
    ],
    example: {
      title: 'theme.yaml 範例',
      language: 'yaml',
      code: `# NPM 模板代理（最簡單）
npm: "@slidev/theme-seriph"

---

# NPM 模板 + 覆蓋樣式
npm: "@slidev/theme-seriph"

colors:
  primary: "#ff0000"    # 改變主色
  accent: "#00ff00"     # 改變強調色

---

# 完整自訂模板
name: "My Custom Template"
description: "我的自訂模板"
colorSchema: dark

colors:
  primary: "#5d8aa8"
  accent: "#4db8a8"
  background: "#1a1a1a"
  text: "#e8e8e8"

fonts:
  sans: "system-ui, sans-serif"
  mono: "Fira Code, monospace"

fontSizes:
  h1: 3.5
  h2: 2.5
  body: 1.25

customCSS: "custom.css"`,
    },
  },
  {
    id: 'troubleshooting',
    icon: '🔧',
    title: '常見問題',
    description: '使用過程中可能遇到的問題和解決方法',
    content: [
      {
        subtitle: '❌ 簡報打不開',
        items: [
          '<strong>問題：</strong>點擊「Open」後沒有看到我的簡報',
          '<strong>解決：</strong>',
          '1. 確認簡報目錄在 <code>data/</code> 下',
          '2. 確認包含 <code>slides.md</code> 檔案',
          '3. 檢查檔名拼寫（必須是 <code>slides.md</code>）',
          '4. 重新整理頁面',
        ],
      },
      {
        subtitle: '❌ 模板沒有出現',
        items: [
          '<strong>問題：</strong>創建的模板沒有出現在模板列表中',
          '<strong>解決：</strong>',
          '1. 確認模板目錄在 <code>data/themes/</code> 下',
          '2. 確認包含 <code>theme.yaml</code> 檔案',
          '3. 檢查 YAML 語法是否正確（使用空格縮排，不是 Tab）',
          '4. 重新整理頁面',
        ],
      },
      {
        subtitle: '❌ NPM 模板安裝失敗',
        items: [
          '<strong>問題：</strong>NPM 模板無法自動安裝',
          '<strong>解決：</strong>',
          '1. 檢查網路連線',
          '2. 確認套件名稱正確（例如：<code>@slidev/theme-seriph</code>）',
          '3. 查看瀏覽器 Console 的錯誤訊息',
          '4. 手動安裝：在專案根目錄執行 <code>npm install @slidev/theme-seriph</code>',
        ],
      },
      {
        subtitle: '❌ 模板樣式沒有生效',
        items: [
          '<strong>問題：</strong>切換模板後樣式沒有改變',
          '<strong>解決：</strong>',
          '1. 檢查 <code>theme.yaml</code> 中的 <code>colorSchema</code> 設定',
          '2. 清除瀏覽器快取並重新載入',
          '3. 確認 <code>customCSS</code> 檔案路徑正確',
          '4. 檢查 CSS 變數命名是否正確',
        ],
      },
      {
        subtitle: '❌ Frontmatter 配置無效',
        items: [
          '<strong>問題：</strong>修改 Frontmatter 後沒有效果',
          '<strong>解決：</strong>',
          '1. 確認 Frontmatter 在 <code>slides.md</code> 的最開頭',
          '2. 檢查三個連字號 <code>---</code> 是否正確',
          '3. 檢查 YAML 語法（縮排、冒號、引號）',
          '4. 儲存檔案後重新整理預覽',
        ],
      },
      {
        subtitle: '💡 更多幫助',
        items: [
          '查看完整文檔：<code>docs/guides/THEME_CONFIGURATION.md</code>',
          'Slidev 官方文檔：<a href="https://sli.dev/" target="_blank">https://sli.dev/</a>',
          'NPM 模板搜尋：<a href="https://www.npmjs.com/search?q=keywords:slidev-theme" target="_blank">npm 模板列表</a>',
          'GitHub Issues：報告 Bug 或提出功能建議',
        ],
      },
    ],
  },
];
