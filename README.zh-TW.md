# AISlidev

> 已封存的 AI 驅動 Slidev 簡報平台

[![Status](https://img.shields.io/badge/status-archived-lightgrey.svg)](./ARCHIVE.md)
[![Version](https://img.shields.io/badge/version-0.9.0-blue.svg)](./CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)
[![AI-First](https://img.shields.io/badge/development-AI--First-purple.svg)](./AGENTS.md)

[English](./README.md)

---

## 專案狀態

AISlidev 已停止主動開發，現以唯讀歷史專案方式保留。

- 原本想解決的產品方向，現階段已大致可由 Claude Design 這類新一代 AI 設計工作流取代
- 此 repo 主要保留作為過往實驗、主題資產與技術探索參考
- 不再接受新的功能開發、issue 維護或持續營運承諾

收尾原因與後續預期請見 [ARCHIVE.md](./ARCHIVE.md)。

## 功能特色

- 📝 **AI 輔助內容** - 智能建議投影片內容和結構
- 🎨 **智能排版** - AI 驅動的版面設計和樣式建議
- ⚡️ **Slidev 整合** - 基於 [Slidev](https://sli.dev/) - 為開發者設計的 Markdown 簡報工具
- 🐳 **單一容器** - 使用 Docker (在 macOS 上透過 Colima)輕量部署
- 🔐 **Rootless 安全** - 以非 root 使用者執行，正確處理訊號
- 🎯 **簡單架構** - 不過度設計，易於維護

---

## 快速開始

### 前置需求

- [Node.js 20+](https://nodejs.org/)（本地開發用）
- [Docker](https://docker.com) + [Colima](https://github.com/abiosoft/colima)（macOS 容器化部署用）

### 容器化部署（推薦）

```bash
# macOS 使用者：安裝 Colima + Docker
brew install colima docker
colima start

# 建置映像檔
docker build -t aislidev .

# 執行容器
docker run -d \
  --name aislidev \
  -p 13000:13000 \
  -v ./data:/app/data \
  aislidev

# 或使用部署腳本（自動偵測 Docker/Podman）
./deploy.sh
```


**訪問應用程式**：http://localhost:13000

### 本地開發

```bash
npm install
npm run dev
```

伺服器在 `http://localhost:3000` 啟動

### 環境變數

透過環境變數自訂：

```bash
podman run -d \
  -e PORT=3000 \
  -e HOST=0.0.0.0 \
  -e LOG_LEVEL=info \
  -v ./data:/app/data:Z \
  -p 3000:3000 \
  aislidev
```

查看 [.env.example](./.env.example) 了解所有可用選項。

---

## 容器架構

- **多階段建置** - 優化映像檔大小（~50MB）
- **Alpine Linux** - 極小安全佔用空間
- **非 root 使用者** - 遵循安全最佳實踐
- **健康檢查** - 內建監控（`/health` 端點）
- **訊號處理** - 使用 dumb-init 優雅關閉

詳見 [ADR-002: 輕量容器化架構](./docs/adr/002-lightweight-containerization.md) 了解設計理念。

---

## 技術棧

- [Fastify](https://fastify.dev) + TypeScript - 快速的 Web 框架
- [Slidev](https://sli.dev) - 為開發者設計的簡報工具
- [Vite](https://vitejs.dev) - 極速的前端建置工具
- [Podman](https://podman.io) / Docker - OCI 相容容器化

---

## 文檔

- [架構決策記錄](./docs/adr/) - 設計決策和理念
- [Port 配置指南](./docs/guides/PORT_CONFIGURATION.md) - Port 設定細節
- [CHANGELOG](./CHANGELOG.md) - 版本歷史

AI 開發設定和貢獻指南請參考 [AGENTS.md](./AGENTS.md)

---

## 貢獻

本專案使用 [Conventional Commits](https://www.conventionalcommits.org/) 格式提交訊息。

詳見 [CONTRIBUTING.md](./CONTRIBUTING.md)。

---

## 授權

MIT License - 詳見 [LICENSE](./LICENSE)

---

**Built with ❤️ using AI-First Development**
