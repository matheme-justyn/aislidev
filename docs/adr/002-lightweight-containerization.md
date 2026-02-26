# ADR-002: Lightweight Containerization Architecture
<!-- ADR-002：輕量容器化架構 -->

**Status**: Accepted
<!-- 狀態：已接受 -->

**Date**: 2026-02-11
<!-- 日期：2026-02-11 -->

**Deciders**: Development Team
<!-- 決策者：開發團隊 -->

**Related**: Supersedes lessons from [v1 Archive](../../../ARCHIVE_v1_design.md)
<!-- 相關：取代 v1 檔案中的經驗教訓 -->

---

## Context and Problem Statement
<!-- 背景與問題陳述 -->

After experiencing the complexity and issues with v1's multi-container architecture (Podman Compose with separate frontend, backend, database, and nginx services), we need to decide on a deployment strategy for v2 that:
<!-- 在經歷了 v1 的多容器架構（Podman Compose 包含獨立的前端、後端、資料庫和 nginx 服務）的複雜性和問題後，我們需要為 v2 決定一個部署策略，該策略需要： -->

1. Provides containerization benefits (portability, consistency, isolation)
<!-- 提供容器化的優點（可移植性、一致性、隔離性） -->

2. Avoids the over-engineering issues that plagued v1
<!-- 避免困擾 v1 的過度工程化問題 -->

3. Enables native Slidev integration (not iframe-based)
<!-- 啟用 Slidev 的原生整合（不基於 iframe） -->

4. Maintains development simplicity and debuggability
<!-- 保持開發的簡單性和可除錯性 -->

### v1 Issues Summary
<!-- v1 問題總結 -->

The v1 architecture was abandoned due to:
<!-- v1 架構因以下原因被廢棄： -->

- **Over-complexity**: Multiple containers, complex port management, container orchestration overhead
<!-- 過度複雜：多個容器、複雜的 port 管理、容器編排開銷 -->

- **Slidev iframe problems**: Failed to load in iframe, HMR connection issues, resource-intensive
<!-- Slidev iframe 問題：無法在 iframe 中載入、HMR 連線問題、資源密集 -->

- **Poor development experience**: Difficult debugging across containers, slow startup times
<!-- 糟糕的開發體驗：跨容器除錯困難、啟動時間慢 -->

- **Resource waste**: Each presentation required separate Slidev server instance
<!-- 資源浪費：每個簡報需要獨立的 Slidev 伺服器實例 -->

---

## Decision Drivers
<!-- 決策驅動因素 -->

1. **Simplicity First**: Follow the project principle of avoiding over-engineering
<!-- 簡單優先：遵循專案避免過度工程化的原則 -->

2. **Containerization Benefits**: Still want deployment portability and environment consistency
<!-- 容器化優點：仍然希望部署可移植性和環境一致性 -->

3. **Native Slidev Integration**: Avoid iframe-based approach that failed in v1
<!-- Slidev 原生整合：避免在 v1 中失敗的 iframe 方式 -->

4. **Single User Focus**: This is primarily a personal productivity tool, not a multi-tenant service
<!-- 單用戶焦點：這主要是個人生產力工具，而非多租戶服務 -->

5. **Development Velocity**: Fast iteration and easy debugging are critical
<!-- 開發速度：快速迭代和輕鬆除錯至關重要 -->

---

## Considered Options
<!-- 考慮的方案 -->

### Option A: Lightweight Containerization (Single Container)
<!-- 方案 A：輕量容器化（單一容器） -->

**Architecture**:
<!-- 架構： -->

- Single Docker/Podman container running a unified Node.js application
<!-- 單一 Docker/Podman 容器運行統一的 Node.js 應用程式 -->

- Slidev integrated as a library/dependency (not as a separate service)
<!-- Slidev 作為 library/dependency 整合（不作為獨立服務） -->

- File-based storage (SQLite or JSON files) for presentation data
<!-- 基於檔案的儲存（SQLite 或 JSON 檔案）用於簡報資料 -->

- Single port exposure (e.g., 3000)
<!-- 單一 port 暴露（例如 3000） -->

**Pros**:
<!-- 優點： -->

- ✅ Simple architecture, easy to understand and maintain
<!-- 簡單架構，易於理解和維護 -->

- ✅ Single process to debug, fast startup
<!-- 單一進程除錯，快速啟動 -->

- ✅ Native Slidev integration avoids iframe issues
<!-- Slidev 原生整合避免 iframe 問題 -->

- ✅ Containerization benefits (portability, consistency)
<!-- 容器化優點（可移植性、一致性） -->

- ✅ Minimal resource overhead
<!-- 最小資源開銷 -->

**Cons**:
<!-- 缺點： -->

- ⚠️ Less separation of concerns (but acceptable for single-user tool)
<!-- 關注點分離較少（但對單用戶工具可接受） -->

- ⚠️ File-based storage may limit scalability (but not a concern for personal use)
<!-- 基於檔案的儲存可能限制可擴展性（但對個人使用不是問題） -->

### Option B: Non-Containerized (Pure Node.js)
<!-- 方案 B：非容器化（純 Node.js） -->

**Architecture**:
<!-- 架構： -->

- Single Node.js application running directly on host
<!-- 單一 Node.js 應用程式直接在主機上運行 -->

- No Docker/Podman involved
<!-- 不涉及 Docker/Podman -->

**Pros**:
<!-- 優點： -->

- ✅ Simplest possible architecture
<!-- 最簡單的架構 -->

- ✅ Fastest development iteration
<!-- 最快的開發迭代 -->

- ✅ Direct access to file system
<!-- 直接訪問檔案系統 -->

**Cons**:
<!-- 缺點： -->

- ❌ No deployment portability
<!-- 沒有部署可移植性 -->

- ❌ Environment inconsistency ("works on my machine")
<!-- 環境不一致（「在我的機器上可以運作」） -->

- ❌ Harder to distribute or deploy to different environments
<!-- 更難分發或部署到不同環境 -->

### Option C: Multi-Container Orchestration (v1 Approach)
<!-- 方案 C：多容器編排（v1 方式） -->

**Architecture**:
<!-- 架構： -->

- Separate containers for frontend, backend, database, proxy
<!-- 前端、後端、資料庫、代理的獨立容器 -->

- Container orchestration (Docker Compose / Podman Compose)
<!-- 容器編排（Docker Compose / Podman Compose） -->

**Pros**:
<!-- 優點： -->

- ✅ Maximum separation of concerns
<!-- 最大化關注點分離 -->

- ✅ Microservices architecture
<!-- 微服務架構 -->

**Cons**:
<!-- 缺點： -->

- ❌ Over-engineered for single-user tool (proven by v1 failure)
<!-- 對單用戶工具過度工程化（已被 v1 失敗證明） -->

- ❌ Complex debugging and development workflow
<!-- 複雜的除錯和開發工作流程 -->

- ❌ High resource consumption
<!-- 高資源消耗 -->

- ❌ Slidev iframe integration issues (v1 problem)
<!-- Slidev iframe 整合問題（v1 問題） -->

---

## Decision Outcome
<!-- 決策結果 -->

**Chosen option**: Option A - Lightweight Containerization (Single Container)
<!-- 選擇方案：方案 A - 輕量容器化（單一容器） -->

### Rationale
<!-- 理由 -->

This option provides the best balance between:
<!-- 此方案在以下方面提供最佳平衡： -->

1. **Simplicity**: Single container is easy to build, debug, and maintain
<!-- 簡單性：單一容器易於建置、除錯和維護 -->

2. **Containerization benefits**: Still get portability and environment consistency
<!-- 容器化優點：仍然獲得可移植性和環境一致性 -->

3. **Native Slidev integration**: Can use Slidev programmatically, avoiding v1's iframe issues
<!-- Slidev 原生整合：可以程式化使用 Slidev，避免 v1 的 iframe 問題 -->

4. **Resource efficiency**: Minimal overhead suitable for personal productivity tool
<!-- 資源效率：適合個人生產力工具的最小開銷 -->

5. **Development velocity**: Fast iteration, easy debugging
<!-- 開發速度：快速迭代，輕鬆除錯 -->

### Implementation Details
<!-- 實作細節 -->

**Technology Stack**:
<!-- 技術棧： -->

- **Runtime**: Node.js (latest LTS)
<!-- 執行環境：Node.js（最新 LTS） -->

- **Framework**: To be decided (Express, Fastify, or Hono)
<!-- 框架：待決定（Express、Fastify 或 Hono） -->

- **Slidev Integration**: Import Slidev as a library, use its build/preview APIs
<!-- Slidev 整合：將 Slidev 作為 library 匯入，使用其 build/preview API -->

- **Storage**: SQLite or JSON files (simple, file-based)
<!-- 儲存：SQLite 或 JSON 檔案（簡單、基於檔案） -->

- **Container**: Podman (OCI-compatible, also works with Docker)
<!-- 容器：Podman（OCI 相容，也可用 Docker） -->

**Container Structure**:
<!-- 容器結構： -->

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

**Volume Mounts**:
<!-- Volume 掛載： -->

- `/app/data` - Presentation files and database
<!-- /app/data - 簡報檔案和資料庫 -->

- `/app/config` - Configuration files (optional)
<!-- /app/config - 配置檔案（可選） -->

**Port Mapping**:
<!-- Port 對應： -->

- Single port (default 3000) for web UI and API
<!-- 單一 port（預設 3000）用於 web UI 和 API -->

---

## Consequences
<!-- 後果 -->

### Positive
<!-- 正面 -->

- ✅ **Simplified deployment**: Single container to build and run
<!-- 簡化部署：單一容器建置和運行 -->

- ✅ **Faster development**: No container orchestration complexity
<!-- 更快開發：沒有容器編排複雜性 -->

- ✅ **Better debugging**: Single process, easy to attach debugger
<!-- 更好除錯：單一進程，易於連接除錯器 -->

- ✅ **Native Slidev integration**: Avoids v1's iframe problems
<!-- Slidev 原生整合：避免 v1 的 iframe 問題 -->

- ✅ **Lower resource usage**: Suitable for personal productivity tool
<!-- 更低資源使用：適合個人生產力工具 -->

- ✅ **Portable**: Can run anywhere Docker/Podman is available
<!-- 可移植：可在任何有 Docker/Podman 的地方運行 -->

### Negative
<!-- 負面 -->

- ⚠️ **Monolithic architecture**: Less modularity (acceptable trade-off for simplicity)
<!-- 單體架構：模組化較少（為簡單性可接受的權衡） -->

- ⚠️ **Limited scalability**: Not designed for multi-tenant or high-load scenarios (not a concern for personal use)
<!-- 有限可擴展性：不是為多租戶或高負載場景設計（對個人使用不是問題） -->

### Risks and Mitigations
<!-- 風險與緩解措施 -->

| Risk | Mitigation |
|------|------------|
| Slidev integration complexity | Research Slidev's programmatic API, create proof-of-concept early |
| 整合複雜性 | 研究 Slidev 的程式化 API，盡早建立概念驗證 |
| File-based storage limitations | Document migration path to database if needed in future |
| 基於檔案的儲存限制 | 如未來需要，記錄遷移到資料庫的路徑 |
| Container image size | Use Alpine base, multi-stage builds |
| 容器映像大小 | 使用 Alpine base，多階段建置 |

---

## References
<!-- 參考資料 -->

- [v1 Architecture Archive](../../../ARCHIVE_v1_design.md) - Lessons learned from v1
<!-- v1 架構檔案 - 從 v1 學到的經驗教訓 -->

- [CLAUDE.md](../../../CLAUDE.md) - Project principles (Simplicity First)
<!-- CLAUDE.md - 專案原則（簡單優先） -->

- [Slidev Documentation](https://sli.dev/) - For understanding native integration options
<!-- Slidev 文檔 - 了解原生整合選項 -->

---

## Follow-up Decisions Required
<!-- 需要的後續決策 -->

1. **Technology Stack**: Choose specific framework (Express, Fastify, Hono)
<!-- 技術棧：選擇具體框架（Express、Fastify、Hono） -->

2. **Slidev Integration Method**: Determine exact approach for native Slidev usage
<!-- Slidev 整合方法：確定使用 Slidev 原生方式的確切方法 -->

3. **Storage Solution**: Choose between SQLite, JSON files, or other lightweight options
<!-- 儲存方案：在 SQLite、JSON 檔案或其他輕量選項之間選擇 -->

4. **Frontend Framework**: Vue.js (for Slidev compatibility), React, or vanilla JS
<!-- 前端框架：Vue.js（相容 Slidev）、React 或 vanilla JS -->

These decisions will be documented in separate ADRs as they are made.
<!-- 這些決策將在做出時記錄在獨立的 ADR 中。 -->
