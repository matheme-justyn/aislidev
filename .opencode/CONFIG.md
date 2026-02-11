# OpenCode Configuration for AISliDev

# AISliDev 的 OpenCode 配置

## Communication Preferences

# 溝通偏好

- **Conversation Language**: Traditional Chinese (Taiwan)
  # **對話語言**: 繁體中文（台灣）
- **Documentation Language**: English with Traditional Chinese comments
  # **文檔語言**: 英文加繁體中文註解
- **Response Style**: Technical, direct, with version analysis
  # **回應風格**: 技術性、直接、帶版本分析

## Project Context

# 專案上下文

- **Project**: AISliDev v0.1.0 (Pre-Release stage)
  # **專案**: AISliDev v0.1.0（Pre-Release 階段）
- **Architecture**: Single-container, lightweight design (v2)
  # **架構**: 單容器、輕量設計（v2）
- **Core Principle**: Simplicity over complexity (learned from v1 failures)
  # **核心原則**: 簡單勝於複雜（從 v1 失敗學到）

## Critical Rules (NEVER VIOLATE)

# 關鍵規則（絕不違反）

### 1. Conventional Commits Enforcement

# 1. Conventional Commits 強制執行

All commits MUST follow: `<type>(<scope>): <subject>`

# 所有提交必須遵循：<type>(<scope>): <subject>

Valid types:

# 有效類型：

- `feat`: New feature → MINOR bump (0.x.0 in Pre-Release)
- `fix`: Bug fix → PATCH bump (0.0.x)
- `docs`: Documentation only → No version bump
- `refactor`: Code refactoring → No version bump
- `BREAKING CHANGE:` → MINOR bump in Pre-Release, MAJOR after 1.0.0

### 2. Pre-Version Analysis Workflow

# 2. 版本前分析工作流程

Before ANY git commit, MUST:

# 在任何 git 提交前，必須：

1. **Analyze changes** with `git status` and `git diff`
   # **分析變更** 使用 git status 和 git diff
2. **Categorize changes** (feat/fix/docs/refactor)
   # **分類變更**（feat/fix/docs/refactor）
3. **Present version plan** to user with clear options
   # **向使用者呈現版本計畫** 包含清晰選項
4. **Wait for user approval** before proceeding
   # **等待使用者批准** 才繼續
5. **Check Pre-Release status**: "Are we ready for 1.0.0?"
   # **檢查 Pre-Release 狀態**：「我們準備好 1.0.0 了嗎？」

### 3. ADR Compliance Checking

# 3. ADR 合規性檢查

Before architectural suggestions:

# 在架構建議前：

- Check existing ADRs in `docs/architecture/ADR/`
  # 檢查 docs/architecture/ADR/ 中的現有 ADR
- If conflict found, explicitly state: "This conflicts with ADR-XXX"
  # 如果發現衝突，明確陳述：「這與 ADR-XXX 衝突」
- Explain rationale from the ADR
  # 解釋 ADR 中的理由
- Ask: "Proceed anyway or update ADR?"
  # 詢問：「仍要繼續或更新 ADR？」

### 4. Documentation Format Compliance

# 4. 文檔格式合規性

AI-facing documentation MUST use:

# 給 AI 的文檔必須使用：

```markdown
## Section Title

<!-- 章節標題 -->

English content here.

<!-- 這裡是英文內容。 -->
```

## Technology Stack Context

# 技術棧上下文

### Current Stack

# 當前技術棧

- **Runtime**: Node.js 20+
- **Framework**: Fastify (lightweight, TypeScript-first)
- **Presentation**: Slidev (native integration, NOT iframe)
- **Container**: Podman (single container, no orchestration)
- **Storage**: File-based (SQLite/JSON, no database service)
- **Language**: TypeScript

### v1 Architecture Failures (NEVER REPEAT)

# v1 架構失敗（絕不重複）

❌ **Multi-container over-engineering**

# 多容器過度工程化

❌ **Iframe-based Slidev integration** (failed to load, HMR issues)

# 基於 iframe 的 Slidev 整合（載入失敗、HMR 問題）

❌ **Complex orchestration** (unnecessary for single-user tool)

# 複雜編排（對單用戶工具不必要）

✅ **v2 Improvements** (ALWAYS FOLLOW)

# v2 改進（始終遵循）

- Single container architecture
- Native Slidev integration
- File-based storage
- Auto port selection

## Development Workflow Preferences

# 開發工作流程偏好

### Before Any Work

# 任何工作前

1. Read `AI.md` (main configuration)
   # 閱讀 AI.md（主要配置）
2. Check relevant ADRs
   # 檢查相關 ADR
3. Review `.ai/context/` for conventions and workflows
   # 檢閱 .ai/context/ 了解規範和工作流程
4. Analyze current project status (version, architecture phase)
   # 分析當前專案狀態（版本、架構階段）

### Code Implementation

# 程式碼實作

- Use TypeScript for all new code
  # 所有新程式碼使用 TypeScript
- Follow kebab-case file naming (e.g., `presentation-service.ts`)
  # 遵循 kebab-case 檔案命名
- Add JSDoc comments with English+Chinese
  # 新增英文+中文的 JSDoc 註解
- Validate inputs and handle errors properly
  # 適當驗證輸入並處理錯誤

### Testing Strategy

# 測試策略

- Manual testing before commits
  # 提交前手動測試
- Test edge cases (port conflicts, missing data)
  # 測試邊緣情況（port 衝突、缺失資料）
- Verify no regressions in existing functionality
  # 驗證現有功能無迴歸

## Version Control Specifics

# 版本控制細節

### Current Status: Pre-Release (0.x.x)

# 當前狀態：Pre-Release（0.x.x）

**IMPORTANT**: In Pre-Release stage:

# 重要：在 Pre-Release 階段：

- Even breaking changes = MINOR bump (0.1.0 → 0.2.0)
  # 即使破壞性變更 = MINOR 更新（0.1.0 → 0.2.0）
- Do NOT transition to 1.0.0 without explicit user approval
  # 沒有使用者明確批准不要過渡到 1.0.0
- Always ask: "Are we ready to transition to 1.0.0 release stage?"
  # 總是詢問：「我們準備好過渡到 1.0.0 release 階段了嗎？」

### Commit Message Template

# 提交訊息範本

```bash
# Feature (triggers MINOR in Pre-Release)
feat(slidev): add native Slidev integration

# Bug fix (triggers PATCH)
fix(server): resolve port conflict in auto-selection mode

# Documentation (no version bump)
docs: update ADR-002 with containerization details

# Breaking change (triggers MINOR in Pre-Release, MAJOR after 1.0.0)
feat!(api): redesign presentation management

BREAKING CHANGE: The presentation API endpoints have changed structure.
```

## API Design Preferences

# API 設計偏好

### RESTful Conventions

# RESTful 慣例

- Use versioned URLs: `/api/v1/presentations`
  # 使用版本化 URL：/api/v1/presentations
- Consistent response format with `data` and `meta` fields
  # 一致的回應格式包含 data 和 meta 欄位
- Proper HTTP status codes
  # 適當的 HTTP 狀態碼

### Error Handling

# 錯誤處理

```typescript
// Good: Descriptive, actionable error messages
throw new Error("Port 3000 is already in use. Try PORT=3001 npm run dev");

// Bad: Vague, unhelpful errors
throw new Error("Server error");
```

## Container and Deployment

# 容器和部署

### Development

# 開發

```bash
npm run dev        # Development with hot reload
npm run build     # Build TypeScript
npm start         # Production mode
```

### Container Strategy

# 容器策略

- Single Podman container (not multi-container)
  # 單一 Podman 容器（非多容器）
- Volume mount for data persistence: `./data:/app/data:Z`
  # 資料持久化的 volume 掛載：./data:/app/data:Z
- Auto port selection in development
  # 開發中自動 port 選擇

## Communication Patterns

# 溝通模式

### When Presenting Options

# 呈現選項時

```markdown
## 📋 選項 | Options

**選項 A (推薦)**: [description]
**Option A (Recommended)**: [description]

**選項 B**: [description]  
**Option B**: [description]
```

### When Asking Questions

# 提問時

- Be specific about what information is needed
  # 具體說明需要什麼資訊
- Provide context when explaining decisions
  # 解釋決策時提供上下文
- Reference specific ADRs or documentation
  # 引用特定 ADR 或文檔

## Personal Customization (Optional)

# 個人自訂（可選）

[Add any personal preferences here - these will be git-tracked]
[在這裡新增任何個人偏好 - 這些會被 git 追蹤]

- Focus areas: frontend/backend/full-stack
- Learning goals: TypeScript mastery, containerization
- Communication style: more detailed/quick summaries
  [專注領域：前端/後端/全端]
  [學習目標：TypeScript 精通、容器化]
  [溝通風格：更詳細/快速摘要]

---

**Note**: This configuration is git-tracked and shared across all OpenCode users working on this project.

# 註記：此配置是 git 追蹤的，與所有在此專案工作的 OpenCode 使用者共享。

**Last Updated**: 2026-02-11

# 最後更新：2026-02-11
