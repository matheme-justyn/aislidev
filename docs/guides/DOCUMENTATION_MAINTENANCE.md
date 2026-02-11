# Documentation Maintenance Guide
<!-- 文檔維護指南 -->

## Purpose
<!-- 目的 -->

This guide defines when and how to update project documentation, especially README.md, to ensure documentation stays synchronized with code changes.
<!-- 本指南定義何時以及如何更新專案文檔，特別是 README.md，以確保文檔與程式碼變更保持同步。 -->

---

## README.md Scope
<!-- README.md 範圍 -->

### What README.md SHOULD Include
<!-- README.md 應該包含什麼 -->

README.md is the **entry point** for new users and should contain:
<!-- README.md 是新使用者的入口點，應包含： -->

1. **Project Overview**
   - Project name and description
   - Current status and version
   - Key features and goals
   <!-- 專案名稱和描述 -->
   <!-- 當前狀態和版本 -->
   <!-- 主要功能和目標 -->

2. **Quick Start**
   - Prerequisites
   - Installation steps
   - Basic usage commands
   - First-time setup instructions
   <!-- 前置需求 -->
   <!-- 安裝步驟 -->
   <!-- 基本使用命令 -->
   <!-- 首次設定說明 -->

3. **Core Concepts**
   - Architecture overview (high-level)
   - Technology stack
   - Key decisions (link to ADRs)
   <!-- 架構概述（高階） -->
   <!-- 技術棧 -->
   <!-- 關鍵決策（連結到 ADR） -->

4. **Navigation**
   - Links to detailed documentation
   - Documentation structure
   - How to contribute
   <!-- 詳細文檔的連結 -->
   <!-- 文檔結構 -->
   <!-- 如何貢獻 -->

5. **Project Status**
   - Version badges
   - Roadmap overview
   - Known limitations
   <!-- 版本徽章 -->
   <!-- 路線圖概述 -->
   <!-- 已知限制 -->

### What README.md SHOULD NOT Include
<!-- README.md 不應該包含什麼 -->

Keep README.md focused. These belong in separate documentation:
<!-- 保持 README.md 專注。以下內容應該在獨立文檔中： -->

- ❌ **Detailed API documentation** → Use `/docs/api/` or OpenAPI specs
  <!-- 詳細的 API 文檔 → 使用 /docs/api/ 或 OpenAPI 規格 -->

- ❌ **Architecture details** → Use ADRs in `/docs/architecture/ADR/`
  <!-- 架構細節 → 使用 /docs/architecture/ADR/ 中的 ADR -->

- ❌ **Step-by-step tutorials** → Use `/docs/guides/`
  <!-- 逐步教學 → 使用 /docs/guides/ -->

- ❌ **Troubleshooting guides** → Use dedicated troubleshooting docs
  <!-- 故障排除指南 → 使用專門的故障排除文檔 -->

- ❌ **Changelog details** → Use `CHANGELOG.md`
  <!-- 變更日誌細節 → 使用 CHANGELOG.md -->

- ❌ **Configuration reference** → Use dedicated config guides
  <!-- 配置參考 → 使用專門的配置指南 -->

- ❌ **Claude Code instructions** → Use CLAUDE.md for AI-specific instructions
  <!-- Claude Code 指令 → 使用 CLAUDE.md 給 AI 的指令 -->

- ❌ **Internal development workflows** → Use CLAUDE.md or separate dev docs
  <!-- 內部開發工作流程 → 使用 CLAUDE.md 或獨立開發文檔 -->

- ❌ **Documentation maintenance rules** → Use this guide (DOCUMENTATION_MAINTENANCE.md)
  <!-- 文檔維護規則 → 使用本指南 -->

### README.md Philosophy: Keep It Human-Friendly
<!-- README.md 理念：保持人類友好 -->

**IMPORTANT**: README.md is for **humans** (users and contributors), not for machines (Claude Code).
<!-- 重要：README.md 是給人類（使用者和貢獻者）看的，不是給機器（Claude Code）看的。 -->

**Principles**:
<!-- 原則： -->

1. **Concise over Comprehensive**
   - README.md should be scannable in ~3 minutes
   - Keep it under 250 lines when possible
   - Link to detailed docs rather than including everything
   <!-- 簡潔勝於全面 -->
   <!-- README.md 應該能在約 3 分鐘內快速瀏覽 -->
   <!-- 盡可能保持在 250 行以內 -->
   <!-- 連結到詳細文檔而非包含所有內容 -->

2. **User-Focused over Developer-Focused**
   - Answer "What is this?" and "How do I use it?" first
   - Developer details (setup, conventions) should be minimal
   - Link to CLAUDE.md for Claude Code instructions
   <!-- 使用者優先而非開發者優先 -->
   <!-- 首先回答「這是什麼？」和「如何使用？」 -->
   <!-- 開發者細節（設定、慣例）應該最小化 -->
   <!-- 連結到 CLAUDE.md 給 Claude Code 的指令 -->

3. **Show over Tell**
   - Use code examples instead of lengthy explanations
   - Use simple bullet points instead of paragraphs
   - Use emojis and formatting for visual clarity
   <!-- 展示勝於敘述 -->
   <!-- 使用程式碼範例而非冗長解釋 -->
   <!-- 使用簡單列點而非段落 -->
   <!-- 使用表情符號和格式化提升視覺清晰度 -->

4. **Separate Concerns**
   - User docs (README.md) ≠ Developer docs (CLAUDE.md)
   - User docs (README.md) ≠ AI instructions (CLAUDE.md, agents/*.md)
   - User docs (README.md) ≠ Detailed guides (docs/guides/)
   <!-- 分離關注點 -->
   <!-- 使用者文檔（README.md）≠ 開發者文檔（CLAUDE.md） -->
   <!-- 使用者文檔（README.md）≠ AI 指令（CLAUDE.md、agents/*.md） -->
   <!-- 使用者文檔（README.md）≠ 詳細指南（docs/guides/） -->

**Example of Good vs Bad README.md**:
<!-- 好的 vs 不好的 README.md 範例： -->

```markdown
# ❌ BAD - Too Technical, Too Long
## Development Infrastructure
- ✅ Conventional Commits - 標準化的 commit 訊息格式
  - Standardized commit message format
- ✅ Semantic Versioning - 語義化版本控制
  - Semantic versioning strategy
- ✅ 完整的版本控制策略（ADR-001）
  - Comprehensive version control strategy (ADR-001)
- ✅ 文檔驅動開發流程
  - Documentation-driven development workflow
... (continues for many lines)

# ✅ GOOD - Simple, Scannable
## Tech Stack
- Node.js 20+ + Fastify + TypeScript
- Slidev (presentation engine)
- Podman (containerization)

See [CLAUDE.md](./CLAUDE.md) for development workflow details.
```

---

## When to Update README.md
<!-- 何時更新 README.md -->

### ✅ MUST Update README.md When:
<!-- 必須更新 README.md 的情況： -->

1. **Version Changes**
   - Bumping version number (major, minor, or patch)
   - Changing version strategy
   <!-- 更新版本號（major、minor 或 patch） -->
   <!-- 改變版本策略 -->

2. **Installation Changes**
   - Adding/removing dependencies
   - Changing installation steps
   - Modifying prerequisites (Node.js version, etc.)
   <!-- 新增/移除依賴 -->
   <!-- 改變安裝步驟 -->
   <!-- 修改前置需求（Node.js 版本等） -->

3. **Startup Commands Change**
   - Modifying `npm run dev`, `npm start`, etc.
   - Adding new required environment variables
   - Changing default ports or configuration
   <!-- 修改 npm run dev、npm start 等 -->
   <!-- 新增必需的環境變數 -->
   <!-- 改變預設 port 或配置 -->

4. **Core Features Added/Removed**
   - Adding major new functionality
   - Removing significant features
   - Changing project scope or goals
   <!-- 新增重大新功能 -->
   <!-- 移除重要功能 -->
   <!-- 改變專案範圍或目標 -->

5. **Technology Stack Changes**
   - Switching frameworks (Express → Fastify)
   - Changing databases (PostgreSQL → SQLite)
   - Adopting new major technologies
   <!-- 切換框架（Express → Fastify） -->
   <!-- 改變資料庫（PostgreSQL → SQLite） -->
   <!-- 採用新的主要技術 -->

6. **Architecture Decisions**
   - Major architectural changes (monolith → microservices, etc.)
   - Deployment strategy changes (Docker → Podman)
   - Link to new ADRs when they affect users
   <!-- 重大架構變更（單體 → 微服務等） -->
   <!-- 部署策略變更（Docker → Podman） -->
   <!-- 連結到影響使用者的新 ADR -->

7. **Project Status Changes**
   - Moving between phases (v0.0.x → v0.1.x)
   - Significant roadmap updates
   - Deprecation notices
   <!-- 階段轉換（v0.0.x → v0.1.x） -->
   <!-- 重大路線圖更新 -->
   <!-- 廢棄通知 -->

### ⚠️ CONSIDER Updating README.md When:
<!-- 考慮更新 README.md 的情況： -->

1. **New Documentation Pages**
   - Adding important guides → Update "Documentation Index" section
   - New ADRs → May need to update "Architecture" section
   <!-- 新增重要指南 → 更新「文檔索引」章節 -->
   <!-- 新 ADR → 可能需要更新「架構」章節 -->

2. **Configuration Options**
   - Adding optional environment variables → Mention in Quick Start if commonly used
   - Adding configuration files → Link to configuration guide
   <!-- 新增可選環境變數 → 如果常用則在快速開始中提及 -->
   <!-- 新增配置檔案 → 連結到配置指南 -->

3. **Known Issues/Limitations**
   - Discovering significant limitations → Add to "Known Limitations" section
   - Resolving previous limitations → Remove from README
   <!-- 發現重大限制 → 新增到「已知限制」章節 -->
   <!-- 解決先前限制 → 從 README 中移除 -->

### ❌ DO NOT Update README.md For:
<!-- 不需要更新 README.md 的情況： -->

1. **Internal Code Changes**
   - Refactoring without behavior change
   - Code style improvements
   - Internal file reorganization
   <!-- 不改變行為的重構 -->
   <!-- 程式碼風格改進 -->
   <!-- 內部檔案重組 -->

2. **Documentation-Only Changes**
   - Fixing typos in other docs
   - Adding comments to code
   - Updating inline documentation
   <!-- 修正其他文檔的錯字 -->
   <!-- 為程式碼新增註解 -->
   <!-- 更新內聯文檔 -->

3. **Minor Configuration Tweaks**
   - Adjusting default log levels
   - Fine-tuning performance parameters
   - Adding optional features that don't affect main workflow
   <!-- 調整預設日誌級別 -->
   <!-- 微調效能參數 -->
   <!-- 新增不影響主要工作流程的可選功能 -->

4. **Development-Only Changes**
   - Adding dev dependencies
   - Updating testing frameworks
   - Modifying CI/CD pipelines
   <!-- 新增開發依賴 -->
   <!-- 更新測試框架 -->
   <!-- 修改 CI/CD 管道 -->

---

## README.md Update Checklist
<!-- README.md 更新檢查清單 -->

When updating README.md, ensure:
<!-- 更新 README.md 時，確保： -->

- [ ] **Version number** matches `package.json` and `CHANGELOG.md`
<!-- 版本號與 package.json 和 CHANGELOG.md 一致 -->

- [ ] **Installation steps** are accurate and tested
<!-- 安裝步驟準確且已測試 -->

- [ ] **Commands** work as documented (run them to verify)
<!-- 命令如文檔所述運作（執行它們來驗證） -->

- [ ] **Prerequisites** are up-to-date (Node.js version, tools, etc.)
<!-- 前置需求是最新的（Node.js 版本、工具等） -->

- [ ] **Technology stack** reflects current state
<!-- 技術棧反映當前狀態 -->

- [ ] **Links** to documentation are valid and point to correct sections
<!-- 文檔連結有效且指向正確章節 -->

- [ ] **Project status** is current (phase, roadmap)
<!-- 專案狀態是最新的（階段、路線圖） -->

- [ ] **Known limitations** are accurate
<!-- 已知限制準確 -->

- [ ] **Badges** (if any) are working and show correct information
<!-- 徽章（如有）正常運作且顯示正確資訊 -->

- [ ] **Follow language convention**: User-facing docs like README can be in Chinese or bilingual
<!-- 遵循語言慣例：使用者面向的文檔如 README 可以用中文或雙語 -->

---

## Other Documentation Files
<!-- 其他文檔檔案 -->

### CHANGELOG.md
<!-- CHANGELOG.md -->

**Update when**:
<!-- 何時更新： -->
- Every commit that follows Conventional Commits
- When preparing a release
- When significant features/fixes are merged
<!-- 每次遵循 Conventional Commits 的提交 -->
<!-- 準備發布時 -->
<!-- 合併重大功能/修復時 -->

**Format**: Follow [Keep a Changelog](https://keepachangelog.com/) format
<!-- 格式：遵循 Keep a Changelog 格式 -->

### ADRs (Architecture Decision Records)
<!-- ADR（架構決策記錄） -->

**Create when**:
<!-- 何時建立： -->
- Making significant architectural decisions
- Choosing between technology alternatives
- Establishing project-wide conventions
- Reversing previous decisions
<!-- 做出重大架構決策時 -->
<!-- 在技術替代方案之間選擇時 -->
<!-- 建立專案範圍慣例時 -->
<!-- 推翻先前決策時 -->

**Update ADR README.md** when new ADRs are created
<!-- 建立新 ADR 時更新 ADR README.md -->

### Guides (docs/guides/)
<!-- 指南（docs/guides/） -->

**Create when**:
<!-- 何時建立： -->
- Adding features that need explanation
- Documenting common workflows
- Providing troubleshooting procedures
- Explaining configuration options
<!-- 新增需要說明的功能時 -->
<!-- 記錄常見工作流程時 -->
<!-- 提供故障排除程序時 -->
<!-- 解釋配置選項時 -->

---

## Claude Code Instructions
<!-- Claude Code 指令 -->

**For AI assistants (like Claude Code)**:
<!-- 給 AI 助手（如 Claude Code）： -->

When making changes to the codebase:
<!-- 對程式碼庫進行變更時： -->

1. **After making changes**, consult this guide to determine if README.md update is needed
<!-- 進行變更後，查閱本指南以確定是否需要更新 README.md -->

2. **Use the checklist** above to evaluate what changed
<!-- 使用上述檢查清單評估變更內容 -->

3. **If README.md update is required**:
   - Read current README.md first
   - Make targeted updates to affected sections only
   - Test that instructions still work
   - Update version references if needed
<!-- 如果需要更新 README.md： -->
<!-- 先讀取當前的 README.md -->
<!-- 僅對受影響的章節進行針對性更新 -->
<!-- 測試說明是否仍然有效 -->
<!-- 如需要更新版本參考 -->

4. **After significant changes**, remind the user to review README.md
<!-- 重大變更後，提醒使用者檢閱 README.md -->

5. **When in doubt**, ask the user if README.md should be updated
<!-- 有疑問時，詢問使用者是否應更新 README.md -->

---

## Examples
<!-- 範例 -->

### Example 1: Adding Port Configuration ✅ Update Needed
<!-- 範例 1：新增 Port 配置 ✅ 需要更新 -->

**Change**: Added environment variable support for PORT configuration
<!-- 變更：新增 PORT 配置的環境變數支援 -->

**README.md updates needed**:
<!-- 需要更新 README.md： -->
- Add `.env` setup instructions to Quick Start
- Mention PORT configuration option
- Link to PORT_CONFIGURATION.md guide
- Update "Configuration" section
<!-- 在快速開始中新增 .env 設定說明 -->
<!-- 提及 PORT 配置選項 -->
<!-- 連結到 PORT_CONFIGURATION.md 指南 -->
<!-- 更新「配置」章節 -->

### Example 2: Refactoring Internal Functions ❌ No Update Needed
<!-- 範例 2：重構內部函數 ❌ 不需要更新 -->

**Change**: Refactored server startup logic for better error handling
<!-- 變更：重構伺服器啟動邏輯以改善錯誤處理 -->

**README.md updates needed**: None (internal change, no user-facing impact)
<!-- 需要更新 README.md：無（內部變更，無使用者面向影響） -->

### Example 3: Switching to Podman ✅ Update Needed
<!-- 範例 3：切換到 Podman ✅ 需要更新 -->

**Change**: Decided to use Podman instead of Docker (ADR-002)
<!-- 變更：決定使用 Podman 而非 Docker（ADR-002） -->

**README.md updates needed**:
<!-- 需要更新 README.md： -->
- Update "Technology Stack" to mention Podman
- Update container build/run commands
- Link to ADR-002
- Update "Development Infrastructure" features
<!-- 更新「技術棧」提及 Podman -->
<!-- 更新容器建置/執行命令 -->
<!-- 連結到 ADR-002 -->
<!-- 更新「開發基礎設施」功能 -->

---

## Related Documents
<!-- 相關文檔 -->

- [CLAUDE.md](../../CLAUDE.md) - Project configuration for Claude Code
<!-- CLAUDE.md - Claude Code 的專案配置 -->

- [ADR README](../architecture/ADR/README.md) - Architecture Decision Records index
<!-- ADR README - 架構決策記錄索引 -->

- [CHANGELOG.md](../../CHANGELOG.md) - Version history
<!-- CHANGELOG.md - 版本歷史 -->
