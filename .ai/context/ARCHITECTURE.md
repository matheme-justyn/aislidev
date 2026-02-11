# Architecture Context

<!-- 架構上下文 -->

## Purpose

<!-- 目的 -->

This file provides high-level architecture context for all AI assistants working on AISliDev. It serves as a quick reference for architectural decisions and patterns.

<!-- 此檔案為所有在 AISliDev 工作的 AI 助手提供高層架構上下文。它作為架構決策和模式的快速參考。 -->

---

## Current Architecture (v2)

<!-- 當前架構（v2） -->

### Overview

<!-- 概述 -->

AISliDev v2 follows a **lightweight, single-container architecture** designed for personal productivity and ease of development.

<!-- AISliDev v2 遵循**輕量、單一容器架構**，專為個人生產力和易於開發而設計。 -->

```
┌─────────────────────────────────────────┐
│         Single Container (Podman)        │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │     Node.js Application            │ │
│  │                                    │ │
│  │  ┌─────────────┐  ┌─────────────┐ │ │
│  │  │   Fastify   │  │   Slidev    │ │ │
│  │  │  (Server)   │  │  (Native)   │ │ │
│  │  └─────────────┘  └─────────────┘ │ │
│  │                                    │ │
│  │  ┌─────────────────────────────── │ │
│  │  │  File Storage (SQLite/JSON)   │ │
│  │  └───────────────────────────────┘ │ │
│  └────────────────────────────────────┘ │
│                                          │
│  Volume: ./data → /app/data              │
│  Port: 3000 (auto-selectable)            │
└─────────────────────────────────────────┘
```

### Key Components

<!-- 關鍵組件 -->

1. **Web Server**: Fastify (lightweight, fast, TypeScript support)
   <!-- Web 伺服器：Fastify（輕量、快速、TypeScript 支援） -->

2. **Presentation Engine**: Slidev (native integration, not iframe-based)
   <!-- 簡報引擎：Slidev（原生整合，非基於 iframe） -->

3. **Storage**: File-based (SQLite for structured data, JSON for simple storage)
   <!-- 儲存：基於檔案（SQLite 用於結構化資料，JSON 用於簡單儲存） -->

4. **Container**: Podman/Docker (single OCI-compatible container)
   <!-- 容器：Podman/Docker（單一 OCI 相容容器） -->

---

## Design Principles

<!-- 設計原則 -->

### 1. Simplicity First

<!-- 1. 簡單優先 -->

- **Avoid over-engineering**: Don't add complexity without clear benefits
  <!-- 避免過度工程化：沒有明確好處不要增加複雜性 -->

- **Monolithic over microservices**: For single-user tools, monolith is appropriate
  <!-- 單體勝於微服務：對單用戶工具，單體是適當的 -->

- **Single container over orchestration**: No need for Kubernetes or Compose
  <!-- 單一容器勝於編排：不需要 Kubernetes 或 Compose -->

### 2. Documentation-Driven

<!-- 2. 文檔驅動 -->

- **Design before implementation**: Document decisions in ADRs first
  <!-- 實作前先設計：首先在 ADR 中記錄決策 -->

- **Keep documentation synchronized**: Update docs when code changes
  <!-- 保持文檔同步：程式碼變更時更新文檔 -->

- **Clear decision trail**: Every architectural choice has a documented reason
  <!-- 清晰的決策軌跡：每個架構選擇都有記錄的原因 -->

### 3. AI-First Development

<!-- 3. AI 優先開發 -->

- **Leverage AI assistants**: Use AI for maximum productivity
  <!-- 充分利用 AI 助手：使用 AI 以最大化生產力 -->

- **Conventional commits**: Enable automation and AI understanding
  <!-- Conventional commits：啟用自動化和 AI 理解 -->

- **Clear context**: Provide comprehensive context for AI assistants
  <!-- 清晰的上下文：為 AI 助手提供全面的上下文 -->

---

## Architectural Decisions

<!-- 架構決策 -->

### Key ADRs

<!-- 關鍵 ADR -->

All architectural decisions are documented in `docs/architecture/ADR/`. Key decisions:

<!-- 所有架構決策都記錄在 docs/architecture/ADR/ 中。關鍵決策： -->

1. **[ADR-001](../../docs/architecture/ADR/001-version-control-strategy.md)**: Version Control Strategy
   - Semantic Versioning + Conventional Commits
   - Pre-release stage (0.x.x) until MVP ready
     <!-- ADR-001：版本控制策略 -->
     <!-- Semantic Versioning + Conventional Commits -->
     <!-- Pre-release 階段（0.x.x）直到 MVP 準備好 -->

2. **[ADR-002](../../docs/architecture/ADR/002-lightweight-containerization.md)**: Lightweight Containerization
   - Single container over multi-container orchestration
   - Native Slidev integration over iframe
   - File-based storage over dedicated database service
     <!-- ADR-002：輕量容器化 -->
     <!-- 單一容器勝於多容器編排 -->
     <!-- Slidev 原生整合勝於 iframe -->
     <!-- 基於檔案的儲存勝於專用資料庫服務 -->

### Decision Pattern

<!-- 決策模式 -->

When faced with architectural choices:

<!-- 面對架構選擇時： -->

1. **Check existing ADRs** first - don't reinvent decisions
   <!-- 首先檢查現有 ADR - 不要重新發明決策 -->

2. **Consider simplicity** - prefer simple solutions
   <!-- 考慮簡單性 - 偏好簡單的解決方案 -->

3. **Document new decisions** - create ADR if significant
   <!-- 記錄新決策 - 如果重要則建立 ADR -->

4. **Update or supersede** - if decision changes, document why
   <!-- 更新或取代 - 如果決策改變，記錄原因 -->

---

## Technology Stack

<!-- 技術棧 -->

### Core Technologies

<!-- 核心技術 -->

| Component        | Technology  | Rationale                               |
| ---------------- | ----------- | --------------------------------------- |
| **Runtime**      | Node.js 20+ | Modern, LTS, TypeScript support         |
| **Framework**    | Fastify     | Fast, lightweight, TypeScript-first     |
| **Presentation** | Slidev      | Markdown-based, developer-friendly      |
| **Container**    | Podman      | Rootless, daemonless, OCI-compatible    |
| **Storage**      | SQLite/JSON | Simple, file-based, no service overhead |
| **Language**     | TypeScript  | Type safety, better tooling             |

<!-- 組件 | 技術 | 理由 -->
<!-- 執行環境 | Node.js 20+ | 現代、LTS、TypeScript 支援 -->
<!-- 框架 | Fastify | 快速、輕量、TypeScript 優先 -->
<!-- 簡報 | Slidev | 基於 Markdown、開發者友好 -->
<!-- 容器 | Podman | Rootless、daemonless、OCI 相容 -->
<!-- 儲存 | SQLite/JSON | 簡單、基於檔案、無服務開銷 -->
<!-- 語言 | TypeScript | 型別安全、更好的工具 -->

### Development Tools

<!-- 開發工具 -->

- **Package Manager**: npm (default) or pnpm (alternative)
  <!-- 套件管理器：npm（預設）或 pnpm（替代） -->

- **Version Control**: git with Conventional Commits
  <!-- 版本控制：git 搭配 Conventional Commits -->

- **Code Quality**: (To be decided - linting, formatting tools)
  <!-- 程式碼品質：（待決定 - linting、formatting 工具） -->

---

## Lessons from v1 (CRITICAL)

<!-- 從 v1 學到的經驗（關鍵） -->

### What Went Wrong

<!-- 哪裡出錯了 -->

1. **Over-engineered architecture**
   - Multi-container setup (frontend, backend, database, nginx)
   - Too complex for single-user tool
   - Difficult to debug and maintain
     <!-- 過度工程化的架構 -->
     <!-- 多容器設置（前端、後端、資料庫、nginx） -->
     <!-- 對單用戶工具太複雜 -->
     <!-- 難以除錯和維護 -->

2. **Iframe-based Slidev integration**
   - Failed to load in iframe
   - HMR (Hot Module Replacement) connection issues
   - Resource-intensive (separate server per presentation)
     <!-- 基於 iframe 的 Slidev 整合 -->
     <!-- 無法在 iframe 中載入 -->
     <!-- HMR（熱模組替換）連線問題 -->
     <!-- 資源密集（每個簡報需要獨立伺服器） -->

3. **Poor development experience**
   - Slow startup times
   - Complex port management
   - Cross-container debugging challenges
     <!-- 糟糕的開發體驗 -->
     <!-- 啟動時間慢 -->
     <!-- 複雜的 port 管理 -->
     <!-- 跨容器除錯挑戰 -->

### v2 Improvements

<!-- v2 改進 -->

✅ **Single container** - Simple, fast, easy to debug

<!-- 單一容器 - 簡單、快速、易於除錯 -->

✅ **Native Slidev** - Integrated as library, not separate service

<!-- 原生 Slidev - 作為 library 整合，非獨立服務 -->

✅ **File-based storage** - No database service overhead

<!-- 基於檔案的儲存 - 無資料庫服務開銷 -->

✅ **Auto port selection** - Developer-friendly port management

<!-- 自動 port 選擇 - 開發者友好的 port 管理 -->

---

## Current Project Status

<!-- 當前專案狀態 -->

### Version: 0.1.0 (Pre-Release)

<!-- 版本：0.1.0（Pre-Release） -->

**Completed**:

<!-- 已完成 -->

- ✅ Lightweight containerization architecture
- ✅ Fastify web server with TypeScript
- ✅ Environment configuration system (.env support)
- ✅ Auto port selection feature
- ✅ Health check endpoint
- ✅ Comprehensive documentation

**In Progress**:

<!-- 進行中 -->

- 🚧 Slidev native integration
- 🚧 Presentation CRUD API
- 🚧 File storage system

**Planned**:

<!-- 規劃中 -->

- 📋 AI content generation
- 📋 Presentation templates
- 📋 Real-time preview

---

## API Design

<!-- API 設計 -->

### Principles

<!-- 原則 -->

- **RESTful**: Follow REST conventions
  <!-- RESTful：遵循 REST 慣例 -->

- **JSON-based**: All requests/responses use JSON
  <!-- 基於 JSON：所有請求/回應使用 JSON -->

- **Versioned**: API version in URL (`/api/v1/...`)
  <!-- 版本化：URL 中的 API 版本 -->

### Current Endpoints

<!-- 當前端點 -->

```
GET  /health              # Health check
GET  /api/v1/...          # API routes (TBD)
```

### Planned Endpoints

<!-- 規劃的端點 -->

```
# Presentations
GET    /api/v1/presentations          # List all
POST   /api/v1/presentations          # Create new
GET    /api/v1/presentations/:id      # Get one
PUT    /api/v1/presentations/:id      # Update
DELETE /api/v1/presentations/:id      # Delete

# AI Generation
POST   /api/v1/ai/generate            # Generate content
```

---

## Deployment Strategy

<!-- 部署策略 -->

### Local Development

<!-- 本地開發 -->

```bash
npm install
npm run dev       # Development server with hot reload
npm run build     # Build TypeScript
npm start         # Production server
```

### Container Deployment

<!-- 容器部署 -->

```bash
podman build -t aislidev -f Containerfile .
podman run -d -p 3000:3000 -v ./data:/app/data:Z aislidev
```

### Future Considerations

<!-- 未來考慮 -->

- CI/CD pipeline (GitHub Actions)
  <!-- CI/CD 管道（GitHub Actions） -->
- Automated testing
  <!-- 自動化測試 -->
- Container registry (GitHub Container Registry)
  <!-- 容器註冊表（GitHub Container Registry） -->

---

## Related Documentation

<!-- 相關文檔 -->

- [AGENTS.md](../../AGENTS.md) - Main project configuration
  <!-- AGENTS.md - 主要專案配置 -->

- [ADR Index](../../docs/architecture/ADR/README.md) - All architectural decisions
  <!-- ADR 索引 - 所有架構決策 -->

- [ARCHIVE_v1_design.md](../../ARCHIVE_v1_design.md) - v1 lessons learned
  <!-- ARCHIVE_v1_design.md - v1 經驗教訓 -->

---

**Last Updated**: 2026-02-11

<!-- 最後更新：2026-02-11 -->
