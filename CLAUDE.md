# AISliDev - Claude Code Project Configuration
<!-- AISliDev - Claude Code 專案配置 -->

## Project Overview
<!-- 專案概述 -->

AISliDev is an AI-powered Slidev presentation platform that enables intelligent slide creation and editing.
<!-- AISliDev 是一個 AI 驅動的 Slidev 簡報平台，能夠智能化地建立和編輯投影片。 -->

**Status**: Architecture redesign in progress
<!-- 狀態：架構重新設計中 -->

## Documentation Standards
<!-- 文檔規範 -->

### Language Convention
<!-- 語言慣例 -->

**AI-facing documentation** (files intended for Claude Code to read) MUST be written in English as the primary language, with Traditional Chinese (Taiwan) translations provided as HTML comments for each section.
<!-- 給 AI 的文檔（供 Claude Code 閱讀的檔案）必須以英文為主要語言撰寫，每段內容都需要在 HTML 註解中提供對應的繁體中文（台灣用語）翻譯。 -->

**AI-facing documentation includes**:
<!-- 給 AI 的文檔包括： -->

- `CLAUDE.md` - Project configuration for Claude Code
<!-- CLAUDE.md - Claude Code 的專案配置 -->

- `.claude/agents/*.md` - Custom agent definitions
<!-- .claude/agents/*.md - 自訂 agent 定義 -->

- `.claude/skills/**/*.md` - Skill documentation
<!-- .claude/skills/**/*.md - Skill 文檔 -->

- `docs/architecture/ADR/*.md` - Architecture Decision Records
<!-- docs/architecture/ADR/*.md - 架構決策記錄 -->

**Other documentation** (README, CHANGELOG, user-facing guides, etc.) can be written in any language as appropriate for the audience.
<!-- 其他文檔（README、CHANGELOG、使用者指南等）可以根據受眾使用任何適當的語言撰寫。 -->

**Format for AI-facing documentation**:
<!-- 給 AI 的文檔格式： -->

```markdown
## Section Title
<!-- 章節標題 -->

English content here.
<!-- 這裡是英文內容。 -->
```

### Why This Format?
<!-- 為什麼使用這種格式？ -->

- **English for AI**: Claude Code works best with English technical documentation
<!-- 英文給 AI：Claude Code 在處理英文技術文檔時效果最好 -->

- **Chinese comments for humans**: Team members can quickly understand content in their native language
<!-- 中文註解給人類：團隊成員可以快速用母語理解內容 -->

- **Single source of truth**: No need to maintain separate language versions
<!-- 單一真相來源：不需要維護多個語言版本 -->

### Documentation Maintenance
<!-- 文檔維護 -->

**IMPORTANT**: Documentation must be kept in sync with code changes.
<!-- 重要：文檔必須與程式碼變更保持同步。 -->

See [docs/guides/DOCUMENTATION_MAINTENANCE.md](./docs/guides/DOCUMENTATION_MAINTENANCE.md) for:
<!-- 請參考 docs/guides/DOCUMENTATION_MAINTENANCE.md 了解： -->

- When to update README.md
<!-- 何時更新 README.md -->

- What README.md should include
<!-- README.md 應該包含什麼 -->

- Update checklist for documentation
<!-- 文檔更新檢查清單 -->

Claude Code MUST consult this guide after making significant changes to determine if documentation updates are needed.
<!-- Claude Code 在進行重大變更後必須查閱此指南，以確定是否需要更新文檔。 -->

## Working with Claude Code
<!-- 使用 Claude Code 工作 -->

This project is optimized for Claude Code workflow.
<!-- 本專案針對 Claude Code 工作流程優化。 -->

### Memory System
<!-- 記憶系統 -->

Claude Code uses a **local memory system** (stored outside this repository) to maintain project-specific preferences and learnings across sessions.
<!-- Claude Code 使用**本地記憶系統**（儲存在此儲存庫外）來維護專案特定的偏好和跨會話學習。 -->

**Important**: If you notice Claude behaving differently than expected (e.g., using specific language, following certain patterns), it may be using memory settings. See `.claude/MEMORY_GUIDE.md` for details.
<!-- 重要：如果你注意到 Claude 的行為與預期不同（例如使用特定語言、遵循某些模式），可能是因為使用了記憶設定。詳見 `.claude/MEMORY_GUIDE.md`。 -->

### Custom Agents
<!-- 自訂 Agents -->

See `.claude/agents/` for specialized AI agents designed for specific tasks.
<!-- 請參考 `.claude/agents/` 了解針對特定任務設計的專門 AI agents。 -->

### Skills
<!-- Skills -->

See `.claude/skills/` for reusable workflows and automation scripts.
<!-- 請參考 `.claude/skills/` 了解可重複使用的工作流程和自動化腳本。 -->

## Architecture Decisions
<!-- 架構決策 -->

All significant architectural decisions are documented in `docs/architecture/ADR/` using the Architecture Decision Records (ADR) pattern.
<!-- 所有重要的架構決策都記錄在 `docs/architecture/ADR/` 中，使用架構決策記錄（ADR）模式。 -->

### ADR Index
<!-- ADR 索引 -->

See [docs/architecture/ADR/README.md](./docs/architecture/ADR/README.md) for the complete list of ADRs.
<!-- 請參考 docs/architecture/ADR/README.md 了解完整的 ADR 列表。 -->

**Current ADRs**:
<!-- 目前的 ADR： -->

- [ADR-001: Version Control and Release Strategy](./docs/architecture/ADR/001-version-control-strategy.md)
<!-- ADR-001：版本控制和發布策略 -->

### Consistency Enforcement
<!-- 一致性強制執行 -->

**CRITICAL: Claude Code MUST follow these rules**:
<!-- 重要：Claude Code 必須遵循這些規則： -->

1. **Read ADRs before making suggestions**: When discussing architecture, technology choices, or development workflows, Claude MUST first read relevant ADRs in `docs/architecture/ADR/` to understand existing decisions.
<!-- 在提出建議前閱讀 ADR：討論架構、技術選擇或開發工作流程時，Claude 必須先閱讀 docs/architecture/ADR/ 中的相關 ADR 以了解現有決策。 -->

2. **Check for conflicts**: If user's request contradicts an accepted ADR, Claude MUST:
<!-- 檢查衝突：如果使用者的請求與已接受的 ADR 衝突，Claude 必須： -->
   - Point out the conflict explicitly
   <!-- 明確指出衝突 -->
   - Reference the specific ADR (e.g., "This conflicts with ADR-001")
   <!-- 引用特定的 ADR（例如「這與 ADR-001 衝突」） -->
   - Explain the rationale from the ADR
   <!-- 解釋 ADR 中的理由 -->
   - Ask if the user wants to proceed anyway or update the ADR
   <!-- 詢問使用者是否仍要繼續或更新 ADR -->

3. **Suggest ADR updates**: If a decision changes, Claude should suggest creating a new ADR or updating/superseding an existing one.
<!-- 建議更新 ADR：如果決策改變，Claude 應建議建立新的 ADR 或更新/取代現有 ADR。 -->

4. **Reference ADRs in explanations**: When explaining why something is done a certain way, cite the relevant ADR.
<!-- 在解釋時引用 ADR：解釋為什麼以某種方式做某事時，引用相關的 ADR。 -->

**Example workflow**:
<!-- 範例工作流程： -->

```
User: "Let's use CalVer instead of SemVer"

Claude:
I notice this conflicts with ADR-001 (Version Control Strategy), which
decided to use Semantic Versioning.

ADR-001 considered CalVer but rejected it because:
- Less semantic meaning about the nature of changes
- Doesn't communicate compatibility information
- Less tooling support for automation

Do you want to:
A) Proceed with CalVer and create ADR-002 to supersede ADR-001?
B) Stick with SemVer as per ADR-001?
C) Discuss the trade-offs further?
```

### v1 Architecture (Archived)
<!-- v1 架構（已封存） -->

See `ARCHIVE_v1_design.md` for the first version design and lessons learned.
<!-- 請參考 `ARCHIVE_v1_design.md` 了解第一版設計和學到的經驗教訓。 -->

**Key lessons from v1**:
<!-- v1 的關鍵教訓 -->

- Over-engineering leads to complexity
<!-- 過度工程化導致複雜性 -->

- Container orchestration may be overkill for single-user tools
<!-- 容器編排對於單用戶工具來說可能是過度設計 -->

- Iframe-based Slidev integration has fundamental issues
<!-- 基於 iframe 的 Slidev 整合有根本性問題 -->

### v2 Architecture (In Design)
<!-- v2 架構（設計中） -->

Coming soon: Simplified, maintainable architecture.
<!-- 即將推出：簡化、可維護的架構。 -->

## Development Principles
<!-- 開發原則 -->

1. **Simplicity First**: Avoid over-engineering
<!-- 簡單優先：避免過度工程化 -->

2. **Documentation-Driven**: Design before implementation
<!-- 文檔驅動：實作前先設計 -->

3. **AI-First Development**: Leverage Claude Code for maximum productivity
<!-- AI 優先開發：充分利用 Claude Code 以提高生產力 -->

4. **ADR (Architecture Decision Records)**: Document why, not just what
<!-- ADR（架構決策記錄）：記錄為什麼，不只是做什麼 -->

## Version Control and Releases
<!-- 版本控制和發布 -->

See [ADR-001](./docs/architecture/ADR/001-version-control-strategy.md) for the full decision context.
<!-- 請參考 ADR-001 了解完整的決策背景。 -->

### Versioning
<!-- 版本控制 -->

We follow **Semantic Versioning 2.0.0**: `MAJOR.MINOR.PATCH`
<!-- 我們遵循 Semantic Versioning 2.0.0：MAJOR.MINOR.PATCH -->

- **MAJOR**: Breaking changes / incompatible API changes
<!-- MAJOR：破壞性變更 / 不相容的 API 變更 -->

- **MINOR**: New features (backward-compatible)
<!-- MINOR：新功能（向後相容） -->

- **PATCH**: Bug fixes (backward-compatible)
<!-- PATCH：錯誤修復（向後相容） -->

### Pre-Release Stage (0.x.x)
<!-- Pre-Release 階段（0.x.x） -->

**IMPORTANT**: This project is currently in **Pre-Release (0.x.x)** stage.
<!-- 重要：此專案目前處於 Pre-Release（0.x.x）階段。 -->

**Pre-Release Rules**:
<!-- Pre-Release 規則： -->

1. **Stay in 0.x.x until POC/MVP ready**: Do not bump to 1.0.0 until the project reaches POC/MVP quality
   <!-- 保持 0.x.x 直到 POC/MVP 準備好：在專案達到 POC/MVP 品質之前不要升級到 1.0.0 -->

2. **Breaking changes are MINOR bumps**: In 0.x.x stage, even breaking changes only trigger MINOR version bumps (0.1.0 → 0.2.0), not MAJOR
   <!-- 破壞性變更是 MINOR 更新：在 0.x.x 階段，即使是破壞性變更也只觸發 MINOR 版本更新，不是 MAJOR -->

3. **Ask before 1.0.0**: Claude MUST ask the user before any 1.0.0 transition: "Are we ready to transition to 1.0.0 release stage?"
   <!-- 在 1.0.0 前詢問：Claude 在任何 1.0.0 過渡前必須詢問使用者：「我們準備好過渡到 1.0.0 release 階段了嗎？」 -->

**When to transition to 1.0.0**:
<!-- 何時過渡到 1.0.0： -->

- [ ] POC/MVP complete
      <!-- POC/MVP 完成 -->
- [ ] Core features stable
      <!-- 核心功能穩定 -->
- [ ] API surface finalized
      <!-- API 介面確定 -->
- [ ] Documentation complete
      <!-- 文檔完整 -->
- [ ] User explicitly approves transition
      <!-- 使用者明確批准過渡 -->

### Commit Message Format
<!-- 提交訊息格式 -->

All commits MUST follow **Conventional Commits** specification:
<!-- 所有提交都必須遵循 Conventional Commits 規範： -->

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

**Required types**:
<!-- 必需的類型： -->

- `feat`: New feature → triggers MINOR bump
<!-- feat：新功能 → 觸發 MINOR 版本更新 -->

- `fix`: Bug fix → triggers PATCH bump
<!-- fix：錯誤修復 → 觸發 PATCH 版本更新 -->

- `docs`: Documentation changes only
<!-- docs：僅文檔變更 -->

- `style`: Code style (formatting, whitespace, etc.)
<!-- style：程式碼風格（格式化、空白等） -->

- `refactor`: Code refactoring without feature changes
<!-- refactor：程式碼重構，不改變功能 -->

- `perf`: Performance improvements
<!-- perf：效能改善 -->

- `test`: Adding or updating tests
<!-- test：新增或更新測試 -->

- `build`: Build system or dependency changes
<!-- build：建置系統或相依性變更 -->

- `ci`: CI/CD configuration
<!-- ci：CI/CD 配置 -->

- `chore`: Other changes (tooling, etc.)
<!-- chore：其他變更（工具等） -->

**Breaking changes**:
<!-- 破壞性變更： -->

Add `!` after type/scope OR include `BREAKING CHANGE:` in footer → triggers MAJOR bump
<!-- 在 type/scope 後加 ! 或在 footer 中包含 BREAKING CHANGE: → 觸發 MAJOR 版本更新 -->

**Examples**:
<!-- 範例： -->

```bash
# Feature (MINOR bump)
feat(editor): add real-time collaboration support

# Bug fix (PATCH bump)
fix(preview): resolve Slidev rendering issue in Safari

# Breaking change (MAJOR bump) - Method 1
feat!: redesign presentation API

BREAKING CHANGE: The `createPresentation` function signature has changed.
Old: createPresentation(title, content)
New: createPresentation({ title, content, theme })

# Breaking change (MAJOR bump) - Method 2
refactor!: remove iframe-based preview

# Documentation (no version bump)
docs: update architecture decision records

# Multiple scopes
feat(editor,preview): synchronize scroll position
```

### Commit Message Enforcement
<!-- Commit Message 強制執行 -->

**Philosophy**: Use tooling to enforce commit message format when available, but don't block development waiting for tools.
<!-- 理念：有工具時使用工具來強制執行 commit message 格式，但不要因為等待工具而阻礙開發。 -->

**Current approach** (v2 design phase):
<!-- 目前方式（v2 設計階段）： -->

- Manual enforcement: Follow conventional commits format carefully
<!-- 手動強制執行：仔細遵循 conventional commits 格式 -->

- Code review: Check commit messages during PR review
<!-- 程式碼審查：在 PR 審查時檢查 commit messages -->

- Tools are optional: See `docs/guides/COMMIT_SETUP.md` for available tools (commitizen, pre-commit hooks)
<!-- 工具是可選的：參考 docs/guides/COMMIT_SETUP.md 了解可用工具（commitizen、pre-commit hooks） -->

**After technology stack selection**:
<!-- 技術棧選擇後： -->

- Evaluate and select appropriate tooling based on chosen stack
<!-- 根據所選技術棧評估並選擇適當的工具 -->

- Implement automated commit message validation
<!-- 實作自動化 commit message 驗證 -->

- Consider automated version bumping and changelog generation
<!-- 考慮自動化版本更新和 changelog 生成 -->

### Before Every Commit: Version Analysis
<!-- 每次提交前：版本分析 -->

**CRITICAL**: Claude MUST perform this analysis before EVERY git commit.
<!-- 重要：Claude 必須在每次 git commit 前執行此分析。 -->

**Step 1: Analyze Changes**
<!-- 步驟 1：分析變更 -->

Review all changes and categorize them:
<!-- 檢視所有變更並分類： -->

- `feat:` commits → MINOR bump (0.x.0)
- `fix:` commits → PATCH bump (0.0.x)
- `feat!:` or `BREAKING CHANGE:` → MINOR bump in Pre-Release (0.x.0), MAJOR bump after 1.0.0
- `docs:`, `chore:`, `refactor:` (without breaking changes) → No version bump

**Step 2: Group Logically Related Changes**
<!-- 步驟 2：分組邏輯相關的變更 -->

If the discussion covers multiple independent features or fixes:
<!-- 如果討論涵蓋多個獨立功能或修復： -->

1. Identify logical groups (e.g., "Feature A", "Feature B", "Documentation")
   <!-- 識別邏輯群組（例如「功能 A」、「功能 B」、「文檔」） -->
2. Each group should be a separate commit for better traceability
   <!-- 每個群組應該是獨立的 commit 以便更好追溯 -->
3. Determine version bump for each group
   <!-- 確定每個群組的版本更新 -->

**Step 3: Present Commit Plan to User**
<!-- 步驟 3：向使用者呈現提交計畫 -->

Claude MUST present a structured plan:
<!-- Claude 必須呈現結構化的計畫： -->

```markdown
## 📋 提交計畫 | Commit Plan

### 變更分析 | Change Analysis

[Summary of all changes discussed]

### 版本號判定 | Version Determination

**當前版本 | Current**: v0.x.x
**建議版本 | Proposed**: v0.y.z

**原因 | Rationale**:
- [List commit types and their version impact]
- Pre-Release 調整: [Explain any Pre-Release specific adjustments]

### 提交選項 | Commit Options

**選項 A: 單一提交 (推薦)**
<!-- Option A: Single Commit (Recommended) -->

- Commit 1: [type]([scope]): [description]
  - Files: [list]
  - Version: v0.x.x → v0.y.z

**選項 B: 多個提交**
<!-- Option B: Multiple Commits -->

- Commit 1: [type]([scope]): [description]
  - Files: [list]
  - Version: v0.x.x → v0.y.z

- Commit 2: [type]([scope]): [description]
  - Files: [list]
  - Version: v0.y.z → v0.y.z+1

[Add more commits as needed]

### Pre-Release 檢查 | Pre-Release Check

**Question**: Are we ready to transition to 1.0.0 release stage?
<!-- 問題：我們準備好過渡到 1.0.0 release 階段了嗎？ -->

- [ ] Yes - Proceed to 1.0.0
- [ ] No - Stay in 0.x.x (Current: Stay in Pre-Release)

### 建議 | Recommendation

[Claude's recommendation with rationale]
```

**Step 4: Wait for User Decision**
<!-- 步驟 4：等待使用者決定 -->

Do NOT proceed with git operations until user approves:
<!-- 在使用者批准前不要執行 git 操作： -->

- Which commit option (A, B, or custom)
  <!-- 哪個提交選項（A、B 或自訂） -->
- Version numbers
  <!-- 版本號 -->
- Whether to stay in Pre-Release or transition to 1.0.0
  <!-- 是否保持 Pre-Release 或過渡到 1.0.0 -->

**Step 5: Create Release Notes (for MINOR/MAJOR only)**
<!-- 步驟 5：建立 Release Notes（僅用於 MINOR/MAJOR） -->

For MINOR or MAJOR version bumps:
<!-- 對於 MINOR 或 MAJOR 版本更新： -->

1. Use the template from `docs/guides/RELEASE_NOTE_TEMPLATE.md`
   <!-- 使用 docs/guides/RELEASE_NOTE_TEMPLATE.md 的範本 -->
2. Update CHANGELOG.md with release details
   <!-- 更新 CHANGELOG.md 的發布詳情 -->
3. Create release notes if this is a significant release
   <!-- 如果這是重要發布則建立 release notes -->

### Release Process
<!-- 發布流程 -->

**Current** (manual process during v2 design phase):
<!-- 目前（v2 設計階段的手動流程）： -->

1. Ensure all commits follow conventional format
<!-- 確保所有提交都遵循慣例格式 -->

2. Determine version bump based on commit types since last release
<!-- 根據上次發布以來的提交類型決定版本更新 -->

3. Update version in `.cz.toml` and other version files (when technology is chosen)
<!-- 更新 .cz.toml 和其他版本檔案中的版本（當技術確定後） -->

4. Update `CHANGELOG.md` manually
<!-- 手動更新 CHANGELOG.md -->

5. Create git tag: `git tag -a v0.0.2 -m "Release v0.0.2"`
<!-- 建立 git tag：git tag -a v0.0.2 -m "Release v0.0.2" -->

6. Push tag: `git push origin v0.0.2`
<!-- 推送 tag：git push origin v0.0.2 -->

**Future** (after technology stack is finalized):
<!-- 未來（技術棧確定後）： -->

Select and implement appropriate automation tools based on chosen technology stack.
<!-- 根據所選技術棧選擇並實作適當的自動化工具。 -->

Possible tools (decision deferred until tech stack is chosen):
<!-- 可能的工具（延後到技術棧選定後再決定）： -->

- JavaScript/TypeScript: `semantic-release`, `changesets`
- Python: `python-semantic-release`
- Language-agnostic: `commitizen`

See ADR-001 for rationale.
<!-- 請參考 ADR-001 了解理由。 -->

## Git Workflow
<!-- Git 工作流程 -->

### Branch Naming
<!-- 分支命名 -->

Use descriptive branch names with type prefixes:
<!-- 使用帶有類型前綴的描述性分支名稱： -->

- `feature/description` - New features
<!-- feature/描述 - 新功能 -->

- `fix/description` - Bug fixes
<!-- fix/描述 - 錯誤修復 -->

- `docs/description` - Documentation updates
<!-- docs/描述 - 文檔更新 -->

- `refactor/description` - Code refactoring
<!-- refactor/描述 - 程式碼重構 -->

- `test/description` - Test additions/updates
<!-- test/描述 - 測試新增/更新 -->

**Examples**:
<!-- 範例： -->

```bash
feature/ai-content-generation
fix/preview-rendering-safari
docs/update-adr-001
refactor/simplify-editor-state
```

### Protected Branches
<!-- 受保護的分支 -->

- **No force push** to `main` branch
<!-- 不要 force push 到 main 分支 -->

- **No direct commits** to `main` - use pull requests
<!-- 不要直接提交到 main - 使用 pull requests -->

- All PRs must pass CI checks (when implemented)
<!-- 所有 PR 必須通過 CI 檢查（實作後） -->

## License
<!-- 授權 -->

MIT License - See `LICENSE` file
<!-- MIT 授權 - 請參考 `LICENSE` 檔案 -->
