# AISlidev

> AI-powered Slidev presentation platform
> AI 驅動的 Slidev 簡報平台

[![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)](./CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)
[![AI-First](https://img.shields.io/badge/development-AI--First-purple.svg)](./AGENTS.md)

---

## 📋 專案狀態 | Project Status

**當前版本**: `0.1.0` - 輕量容器化架構建立完成
**Current Version**: Lightweight containerization setup completed

✅ **已完成 | Completed**:

- 輕量容器化架構（單一容器 + Podman）
- 基礎 Web 伺服器和 API（Fastify + TypeScript）
- 環境配置系統（.env 支援、自動 port 選擇）

🚧 **進行中 | In Progress**:

- Slidev 原生整合

📅 **規劃中 | Planned**:

- AI 輔助內容生成
- 簡報管理功能

---

## 🎯 專案目標 | What is AISlidev?

AISlidev 是一個智能化的 Slidev 簡報平台，目標是讓使用者能夠：

- 📝 使用 AI 輔助建立和編輯簡報內容
- 🎨 智能化的版面設計和樣式建議
- 🔄 即時預覽簡報
- 🚀 簡化的部署和分享流程

### 為什麼重新設計？

v1 版本採用複雜的多容器架構（前後端分離 + PostgreSQL + Nginx），但因為以下問題被廢棄：

- ❌ Slidev iframe 整合問題
- ❌ 過度工程化（對單用戶工具來說太複雜）
- ❌ 除錯困難

**v2 採用輕量容器化設計**：單一容器、原生 Slidev 整合、更簡單的架構。

詳見 [v1 設計記錄](./ARCHIVE_v1_design.md) 和 [ADR-002: 輕量容器化架構](./docs/architecture/ADR/002-lightweight-containerization.md)

---

## 🚀 快速開始 | Quick Start

### 前置需求 | Prerequisites

- Node.js 20+
- npm 或 pnpm
- (可選) Podman 或 Docker（容器化部署）

### 本地開發 | Local Development

```bash
# 1. 安裝依賴
npm install

# 2. (可選) 配置環境變數
cp .env.example .env
# 編輯 .env 自訂 PORT 等設定

# 3. 啟動開發伺服器
npm run dev

# 伺服器將在 http://localhost:3000 啟動
# (如果 3000 被佔用，會自動選擇其他可用 port)
```

### 容器化部署 | Container Deployment

```bash
# 使用 Podman 建置並運行
podman build -t aislidev -f Containerfile .
podman run -d -p 3000:3000 -v ./data:/app/data:Z aislidev
```

> 💡 未來將提供 `deploy.sh` 腳本簡化部署流程。詳細部署說明請參考 [Quick Start Guide](./docs/guides/QUICKSTART.md)

---

## ✨ 技術棧 | Tech Stack

- **執行環境**: Node.js 20+
- **Web 框架**: Fastify + TypeScript
- **簡報引擎**: Slidev
- **容器化**: Podman（OCI 相容，也可用 Docker）
- **版本控制**: Semantic Versioning + Conventional Commits

---

## 💡 關於 Slidev | About Slidev

[Slidev](https://sli.dev/) 是一個基於 Markdown 的簡報工具，專為開發者設計。AISlidev 將 Slidev 與 AI 功能整合，提供更智能的簡報編輯體驗。

**Slidev 主要功能**：

- 📄 **Markdown 語法** - 用純文字撰寫投影片
- 🎨 **主題系統** - 豐富的主題和客製化選項
- 🖥️ **簡報模式** - 含演講者備註的簡報檢視
- 📊 **總覽模式** - 一次瀏覽所有投影片
- 📤 **匯出功能** - 輸出為 PDF、PNG 或 SPA

**多種檢視模式**：

- `/` - 一般投影片檢視
- `/presenter` - 演講者模式（含備註和計時器）
- `/overview` - 總覽模式（顯示所有投影片）
- `/export` - 匯出設定

---

## 📚 主要功能 | Key Features

### 已實作 | Implemented

- ✅ 輕量容器化部署（單一容器）
- ✅ 環境變數配置（.env 支援）
- ✅ 自動 port 選擇（開發友好）
- ✅ RESTful API 基礎架構
- ✅ 健康檢查端點

### 開發中 | In Development

- 🚧 Slidev 原生整合
- 🚧 簡報 CRUD API
- 🚧 檔案儲存系統

### 規劃中 | Planned

- 📋 AI 內容生成
- 📋 簡報模板系統
- 📋 即時預覽功能

---

## 🤝 如何貢獻 | Contributing

### 開發流程

1. **Fork 並 clone 專案**

   ```bash
   git clone https://github.com/your-username/aislidev.git
   cd aislidev
   ```

2. **建立 feature 分支**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **開發並測試**

   ```bash
   npm install
   npm run dev
   npm run build
   ```

4. **提交變更（使用 Conventional Commits）**

   ```bash
   git commit -m "feat: add new feature"
   git commit -m "fix: resolve bug"
   ```

5. **Push 並建立 Pull Request**

### Commit 規範

本專案使用 [Conventional Commits](https://www.conventionalcommits.org/) 格式：

- `feat:` - 新功能
- `fix:` - 錯誤修復
- `docs:` - 文檔更新
- `refactor:` - 程式碼重構
- `test:` - 測試相關

詳見 [AGENTS.md](./AGENTS.md#version-control-and-releases)

---

## 📖 文檔 | Documentation

- [Quick Start Guide](./docs/guides/QUICKSTART.md) - 詳細的安裝和部署指南
- [Port Configuration](./docs/guides/PORT_CONFIGURATION.md) - Port 配置說明
- [Architecture Decision Records](./docs/architecture/ADR/) - 架構決策記錄
- [CHANGELOG](./CHANGELOG.md) - 版本變更記錄

---

## 🔧 配置 | Configuration

常用環境變數（`.env` 檔案）：

```bash
# 伺服器配置
PORT=3000                      # 伺服器 port（預設 3000）
HOST=0.0.0.0                   # 伺服器 host
AUTO_PORT_SELECTION=true       # 自動選擇可用 port（預設 true）

# 日誌
LOG_LEVEL=info                 # 日誌級別（info/debug/warn/error）
```

完整配置說明請參考 [.env.example](./.env.example)

---

## 📄 授權 | License

MIT License - 詳見 [LICENSE](./LICENSE)

---

## 🔗 相關連結 | Links

- [Slidev 官方文檔](https://sli.dev/)
- [Fastify 官方文檔](https://fastify.dev/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)

---

**Built with ❤️ using AI-First Development**
