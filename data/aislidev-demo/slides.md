---
theme: default
background: https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=2070
title: AISlidev 教學
info: |
  ## AISlidev - AI 驅動的簡報平台
  AI-Powered Presentation Platform
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
---

# AISlidev 教學

AI 驅動的簡報平台 <span class="text-sm opacity-60">AI-Powered Presentation Platform</span>

<div class="pt-12">
  <span @click="$slidev.nav.next" class="px-2 py-1 rounded cursor-pointer" hover="bg-white bg-opacity-10">
    開始探索 <carbon:arrow-right class="inline"/>
  </span>
</div>

<div class="abs-br m-6 flex gap-2">
  <a href="https://github.com/yourusername/aislidev" target="_blank" alt="GitHub" title="開源專案"
    class="text-xl slidev-icon-btn opacity-50 !border-none !hover:text-white">
    <carbon-logo-github />
  </a>
</div>

---

## transition: fade-out

# 什麼是 AISlidev？

<span class="text-sm opacity-60">What is AISlidev?</span>

**AISlidev** 是一個結合 AI 與 Slidev 的智慧簡報平台

<v-clicks>

- 📝 **AI 輔助內容** <span class="text-sm opacity-60">AI-Assisted Content Generation</span>
  - 智慧建議投影片內容與結構
- 🎨 **智慧排版** <span class="text-sm opacity-60">Intelligent Layout</span>
  - AI 自動推薦設計與樣式
- ⚡️ **基於 Slidev** <span class="text-sm opacity-60">Built on Slidev</span>
  - 開發者友善的 Markdown 格式
- 🐳 **容器化部署** <span class="text-sm opacity-60">Containerized Deployment</span>
  - 單一容器，輕量級架構

</v-clicks>

<br>
<br>

<span v-click class="text-sm opacity-60">
為開發者打造的下一代簡報工具 <br/>
Next-generation presentation tool for developers
</span>

---

## layout: default

# 快速開始

<span class="text-sm opacity-60">Quick Start</span>

### 方式一：容器部署 <span class="text-sm opacity-60">(Recommended)</span>

```bash
# 使用 Podman 建置映像
podman build -t aislidev .

# 啟動容器
podman run -d \
  --name aislidev \
  -p 13000:13000 \
  -v ./data:/app/data:Z \
  aislidev

# 開啟瀏覽器
open http://localhost:13000
```

### 方式二：本地開發 <span class="text-sm opacity-60">(Development)</span>

```bash
npm install
npm run dev
```

---
layout: two-cols
layoutClass: gap-16
---

# 核心功能

<span class="text-sm opacity-60">Core Features</span>

<v-clicks>

### 🖊️ 即時編輯

<span class="text-sm opacity-60">Real-time Editing</span>

即時預覽 Markdown 變更

### 🔄 自動儲存

<span class="text-sm opacity-60">Auto-save</span>

1 秒後自動儲存內容

### 📁 檔案管理

<span class="text-sm opacity-60">File Management</span>

多個簡報專案管理

</v-clicks>

::right::

<v-clicks>

### 🎯 雙欄佈局

<span class="text-sm opacity-60">Split View</span>

編輯器與預覽並排顯示

### 🎨 主題支援

<span class="text-sm opacity-60">Theme Support</span>

支援 Slidev 所有主題

### 🚀 快速部署

<span class="text-sm opacity-60">Quick Deploy</span>

一鍵容器化部署

</v-clicks>

---

layout: center
class: text-center

---

# Markdown 語法

<span class="text-sm opacity-60">Markdown Syntax</span>

<div class="grid grid-cols-2 gap-4 mt-10">

<div v-click class="p-4 bg-gray-800 rounded">

### 基本語法

<span class="text-sm opacity-60">Basic Syntax</span>

```md
# 標題 1

## 標題 2

**粗體** _斜體_

- 列表項目
```

</div>

<div v-click class="p-4 bg-gray-800 rounded">

### 分頁語法

<span class="text-sm opacity-60">Slide Separator</span>

```md
---
layout: center
---

# 新的一頁
```

</div>

<div v-click class="p-4 bg-gray-800 rounded">

### 程式碼區塊

<span class="text-sm opacity-60">Code Block</span>

````md
```typescript
const hello = "world";
```
````

</div>

<div v-click class="p-4 bg-gray-800 rounded">

### 點擊動畫

<span class="text-sm opacity-60">Click Animation</span>

```md
<v-click>

逐步顯示內容

</v-click>
```

</div>

</div>

---

## layout: default

# 實用技巧

<span class="text-sm opacity-60">Useful Tips</span>

<v-clicks>

### 1. 使用 Layout 排版

<span class="text-sm opacity-60">Use Layouts for Better Design</span>

```md
---
layout: two-cols
---

# 左側內容

::right::

# 右側內容
```

### 2. 加入互動元素

<span class="text-sm opacity-60">Add Interactive Elements</span>

```md
<div @click="$slidev.nav.next">點擊前往下一頁</div>
```

### 3. 自訂 CSS 樣式

<span class="text-sm opacity-60">Custom CSS Styling</span>

```md
<style>
h1 { color: #42b883; }
</style>
```

</v-clicks>

---

layout: center
class: text-center

---

# 進階功能

<span class="text-sm opacity-60">Advanced Features</span>

<div class="grid grid-cols-3 gap-6 mt-10 text-left">

<div v-click>
<h3>🎬 動畫效果</h3>
<span class="text-sm opacity-60">Animations</span>
<p class="text-sm mt-2">使用 v-click 與 transition</p>
</div>

<div v-click>
<h3>📊 圖表整合</h3>
<span class="text-sm opacity-60">Charts Integration</span>
<p class="text-sm mt-2">支援 Mermaid、Chart.js</p>
</div>

<div v-click>
<h3>🎨 客製主題</h3>
<span class="text-sm opacity-60">Custom Themes</span>
<p class="text-sm mt-2">完整的主題客製化</p>
</div>

<div v-click>
<h3>📝 筆記模式</h3>
<span class="text-sm opacity-60">Presenter Notes</span>
<p class="text-sm mt-2">演講者專用筆記</p>
</div>

<div v-click>
<h3>📹 錄影功能</h3>
<span class="text-sm opacity-60">Recording</span>
<p class="text-sm mt-2">投影片錄製與匯出</p>
</div>

<div v-click>
<h3>🌐 線上分享</h3>
<span class="text-sm opacity-60">Online Sharing</span>
<p class="text-sm mt-2">一鍵部署到網路</p>
</div>

</div>

---

## layout: quote

# "為開發者設計，由 AI 賦能"

<span class="text-sm opacity-60">"Designed for Developers, Empowered by AI"</span>

<div class="text-right mt-10 text-gray-400">
  — AISlidev Team
</div>

---

layout: center
class: text-center

---

# 技術架構

<span class="text-sm opacity-60">Technical Architecture</span>

<div class="grid grid-cols-2 gap-8 mt-10">

<div v-click class="text-left">

### 前端 <span class="text-sm opacity-60">Frontend</span>

- Vue 3 + TypeScript
- Naive UI <span class="text-sm opacity-60">組件庫</span>
- CodeMirror 6 <span class="text-sm opacity-60">編輯器</span>
- Splitpanes <span class="text-sm opacity-60">分割面板</span>

</div>

<div v-click class="text-left">

### 後端 <span class="text-sm opacity-60">Backend</span>

- Fastify + TypeScript
- Slidev <span class="text-sm opacity-60">核心引擎</span>
- Vite <span class="text-sm opacity-60">建置工具</span>
- Podman/Docker <span class="text-sm opacity-60">容器化</span>

</div>

</div>

<div v-click class="mt-10 p-4 bg-blue-500 bg-opacity-10 rounded">
  <p class="text-sm">
    完全開源 • MIT License • 歡迎貢獻
  </p>
  <p class="text-xs opacity-60 mt-1">
    Open Source • MIT License • Contributions Welcome
  </p>
</div>

---

## layout: default

# 開發指南

<span class="text-sm opacity-60">Development Guide</span>

<v-clicks>

### 專案結構 <span class="text-sm opacity-60">Project Structure</span>

```
aislidev/
├── src/
│   ├── components/     # Vue 組件
│   ├── server/         # Fastify 後端
│   └── main.ts         # 前端入口
├── data/               # 簡報資料
├── Containerfile       # 容器定義
└── package.json
```

### 開發工作流程 <span class="text-sm opacity-60">Development Workflow</span>

1. 修改程式碼 → 自動熱重載 <span class="text-sm opacity-60">Hot Reload</span>
2. 執行測試 → 確保品質 <span class="text-sm opacity-60">Run Tests</span>
3. 建置專案 → 產生產品 <span class="text-sm opacity-60">Build Project</span>
4. 容器部署 → 上線運行 <span class="text-sm opacity-60">Deploy Container</span>

</v-clicks>

---
layout: two-cols
layoutClass: gap-16
---

# 常見問題

<span class="text-sm opacity-60">FAQ</span>

<v-clicks>

### Q: 如何新增簡報？

<span class="text-sm opacity-60">How to create presentation?</span>

點擊左側 `+ New` 按鈕

### Q: 支援哪些主題？

<span class="text-sm opacity-60">Supported themes?</span>

所有 Slidev 官方主題

### Q: 如何匯出 PDF？

<span class="text-sm opacity-60">Export to PDF?</span>

使用 `slidev export` 指令

</v-clicks>

::right::

<v-clicks>

### Q: 能離線使用嗎？

<span class="text-sm opacity-60">Offline usage?</span>

可以，容器內完整運行

### Q: 如何客製化？

<span class="text-sm opacity-60">How to customize?</span>

修改 Vue 組件與樣式

### Q: 支援協作嗎？

<span class="text-sm opacity-60">Collaboration support?</span>

規劃中的功能

</v-clicks>

---

layout: center
class: text-center

---

# 資源連結

<span class="text-sm opacity-60">Resources</span>

<div class="grid grid-cols-2 gap-4 mt-10">

<div v-click class="p-6 bg-gradient-to-br from-green-500 to-green-600 rounded-lg cursor-pointer hover:scale-105 transition">
<h3 class="text-white">📖 文件</h3>
<p class="text-sm text-white opacity-80 mt-2">Documentation</p>
</div>

<div v-click class="p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg cursor-pointer hover:scale-105 transition">
<h3 class="text-white">💻 GitHub</h3>
<p class="text-sm text-white opacity-80 mt-2">Source Code</p>
</div>

<div v-click class="p-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg cursor-pointer hover:scale-105 transition">
<h3 class="text-white">🎓 教學</h3>
<p class="text-sm text-white opacity-80 mt-2">Tutorials</p>
</div>

<div v-click class="p-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg cursor-pointer hover:scale-105 transition">
<h3 class="text-white">💬 社群</h3>
<p class="text-sm text-white opacity-80 mt-2">Community</p>
</div>

</div>

---

layout: end
class: text-center

---

# 感謝觀看！

<span class="text-sm opacity-60">Thank You!</span>

<div class="mt-10">
  <p class="text-xl mb-4">開始打造你的第一個簡報吧 🚀</p>
  <p class="text-sm opacity-60">Start creating your first presentation</p>
</div>

<div class="mt-10 flex justify-center gap-4">
  <a href="https://github.com/yourusername/aislidev" target="_blank" 
     class="px-6 py-3 bg-green-500 rounded-lg hover:bg-green-600 transition">
    前往 GitHub
  </a>
  <a href="http://localhost:13000" 
     class="px-6 py-3 bg-blue-500 rounded-lg hover:bg-blue-600 transition">
    開始使用
  </a>
</div>

<div class="abs-br m-6 text-sm opacity-50">
  Made with ❤️ by AISlidev Team
</div>
