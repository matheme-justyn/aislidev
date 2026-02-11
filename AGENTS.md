# AISliDev - OpenCode Agent Configuration

<!-- AISliDev - OpenCode Agent 配置 -->

> **Primary AI Tool**: This project uses **OpenCode** as the primary AI agentic architecture.
>
> <!-- 主要 AI 工具：本專案使用 **OpenCode** 作為主要的 AI agentic 架構。 -->
>
> **Other tools**: Claude Code and Roo Code users can find configuration guidance in `.claude/README.md` and `.roo/README.md`.
>
> <!-- 其他工具：Claude Code 和 Roo Code 使用者可以在 .claude/README.md 和 .roo/README.md 找到配置指引。 -->

## Project Overview

<!-- 專案概述 -->

AISliDev is an AI-powered Slidev presentation platform that enables intelligent slide creation and editing.

<!-- AISliDev 是一個 AI 驅動的 Slidev 簡報平台，能夠智能化地建立和編輯投影片。 -->

**Status**: Architecture redesign in progress (v2)

<!-- 狀態：架構重新設計中（v2） -->

**Version**: 0.1.0 (Pre-Release)

<!-- 版本：0.1.0（Pre-Release） -->

## Documentation Standards

<!-- 文檔規範 -->

### Language Convention

<!-- 語言慣例 -->

**AI-facing documentation** (files intended for AI agents to read) MUST be written in English as the primary language, with Traditional Chinese (Taiwan) translations provided as HTML comments for each section.

<!-- 給 AI 的文檔（供 AI agent 閱讀的檔案）必須以英文為主要語言撰寫，每段內容都需要在 HTML 註解中提供對應的繁體中文（台灣用語）翻譯。 -->

**AI-facing documentation includes**:

<!-- 給 AI 的文檔包括： -->

- `AGENTS.md` - Main project configuration for OpenCode (this file)
<!-- AGENTS.md - OpenCode 的主要專案配置（本檔案） -->

- `.ai/context/*.md` - Shared context for all AI agents
<!-- .ai/context/*.md - 所有 AI agent 的共享上下文 -->

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

- **English for AI**: AI agents work best with English technical documentation
<!-- 英文給 AI：AI agent 在處理英文技術文檔時效果最好 -->

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

OpenCode MUST consult this guide after making significant changes to determine if documentation updates are needed.

<!-- OpenCode 在進行重大變更後必須查閱此指南，以確定是否需要更新文檔。 -->

## Working with OpenCode

<!-- 使用 OpenCode 工作 -->

This project is optimized for **OpenCode** as the primary AI agentic architecture, with **oh-my-opencode** plugin installed for enhanced capabilities.

<!-- 本專案以 **OpenCode** 作為主要的 AI agentic 架構進行優化，並安裝了 **oh-my-opencode** 插件以增強功能。 -->

### oh-my-opencode Installation

<!-- oh-my-opencode 安裝 -->

**Status**: ✅ Installed and configured

<!-- 狀態：✅ 已安裝並配置 -->

This project has oh-my-opencode installed with the following configuration:

<!-- 本專案已安裝 oh-my-opencode，配置如下： -->

- **Version**: `oh-my-opencode@latest`
- **Auth Plugin**: `opencode-antigravity-auth@1.4.6`
- **Authenticated Providers**:
  - ✅ Amazon Bedrock (Claude)
  - ✅ GitHub Copilot
  - ✅ Google (Gemini via Antigravity)

**Configured Agents**:

<!-- 已配置的 Agent： -->

- **Sisyphus** (Claude Opus 4.6 Max) - Main orchestrator
- **Hephaestus** (GPT 5.3 Codex Medium) - Autonomous deep worker
- **Oracle** (GPT 5.2 High) - Architecture and debugging
- **Prometheus** (Claude Opus 4.6 Max) - Planner
- **Librarian** (Claude Sonnet 4.5) - Documentation and code search
- **Explore** (Claude Haiku 4.5) - Fast codebase exploration
- **Multimodal Looker** (Gemini 3 Flash) - Visual engineering

**Quick Usage**:

<!-- 快速使用： -->

```bash
# Use ultrawork mode (or ulw) in your prompt
ulw <your task description>

# Example: Fix all ESLint warnings
ulw fix all ESLint warnings

# Example: Create a new feature
ulw create a user authentication system
```

**Configuration Locations**:

<!-- 配置位置： -->

- Global: `~/.config/opencode/opencode.json`
- Global oh-my-opencode: `~/.config/opencode/oh-my-opencode.json`
- Project: `AGENTS.md` (this file)

See [oh-my-opencode documentation](https://github.com/code-yeongyu/oh-my-opencode) for more information.

<!-- 更多資訊請參考 oh-my-opencode 文檔。 -->

### Shared Context System

<!-- 共享上下文系統 -->

OpenCode reads from **shared context** in `.ai/context/`:

<!-- OpenCode 從 `.ai/context/` 中的**共享上下文**讀取： -->

- `ARCHITECTURE.md` - Architecture overview and design principles
<!-- ARCHITECTURE.md - 架構概述和設計原則 -->

- `CONVENTIONS.md` - Coding standards and conventions
<!-- CONVENTIONS.md - 編碼標準和規範 -->

- `WORKFLOWS.md` - Development workflows
<!-- WORKFLOWS.md - 開發工作流程 -->

### Other AI Tools

<!-- 其他 AI 工具 -->

If you're using **Claude Code** or **Roo Code**, please refer to:

<!-- 如果您使用 **Claude Code** 或 **Roo Code**，請參考： -->

- `.claude/README.md` - Claude Code configuration guide
<!-- .claude/README.md - Claude Code 配置指引 -->

- `.roo/README.md` - Roo Code configuration guide
<!-- .roo/README.md - Roo Code 配置指引 -->

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

- [ADR-002: Lightweight Containerization](./docs/architecture/ADR/002-lightweight-containerization.md)
<!-- ADR-002：輕量容器化 -->

- [ADR-003: OpenCode-First AI Architecture](./docs/architecture/ADR/003-opencode-first-architecture.md)
<!-- ADR-003：OpenCode 優先的 AI 架構 -->

### Consistency Enforcement

<!-- 一致性強制執行 -->

**CRITICAL: OpenCode MUST follow these rules**:

<!-- 重要：OpenCode 必須遵循這些規則： -->

1. **Read ADRs before making suggestions**: When discussing architecture, technology choices, or development workflows, OpenCode MUST first read relevant ADRs in `docs/architecture/ADR/` to understand existing decisions.
<!-- 在提出建議前閱讀 ADR：討論架構、技術選擇或開發工作流程時，OpenCode 必須先閱讀 docs/architecture/ADR/ 中的相關 ADR 以了解現有決策。 -->

2. **Check for conflicts**: If user's request contradicts an accepted ADR, OpenCode MUST:
   <!-- 檢查衝突：如果使用者的請求與已接受的 ADR 衝突，OpenCode 必須： -->
   - Point out the conflict explicitly
   <!-- 明確指出衝突 -->
   - Reference the specific ADR (e.g., "This conflicts with ADR-001")
   <!-- 引用特定的 ADR（例如「這與 ADR-001 衝突」） -->
   - Explain the rationale from the ADR
   <!-- 解釋 ADR 中的理由 -->
   - Ask if the user wants to proceed anyway or update the ADR
   <!-- 詢問使用者是否仍要繼續或更新 ADR -->

3. **Suggest ADR updates**: If a decision changes, OpenCode should suggest creating a new ADR or updating/superseding an existing one.
<!-- 建議更新 ADR：如果決策改變，OpenCode 應建議建立新的 ADR 或更新/取代現有 ADR。 -->

4. **Reference ADRs in explanations**: When explaining why something is done a certain way, cite the relevant ADR.
<!-- 在解釋時引用 ADR：解釋為什麼以某種方式做某事時，引用相關的 ADR。 -->

**Example workflow**:

<!-- 範例工作流程： -->

```
User: "Let's use CalVer instead of SemVer"

OpenCode:
I notice this conflicts with ADR-001 (Version Control Strategy), which
decided to use Semantic Versioning.

ADR-001 considered CalVer but rejected it because:
- Less semantic meaning about the nature of changes
- Doesn't communicate compatibility information
- Less tooling support for automation

Do you want to:
A) Proceed with CalVer and create ADR-00X to supersede ADR-001?
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

See `.ai/context/ARCHITECTURE.md` for current v2 architecture details.

<!-- 請參考 .ai/context/ARCHITECTURE.md 了解目前的 v2 架構細節。 -->

## Development Principles

<!-- 開發原則 -->

1. **Simplicity First**: Avoid over-engineering
<!-- 簡單優先：避免過度工程化 -->

2. **Documentation-Driven**: Design before implementation
<!-- 文檔驅動：實作前先設計 -->

3. **OpenCode-First Development**: Leverage OpenCode for maximum productivity
<!-- OpenCode 優先開發：充分利用 OpenCode 以最大化生產力 -->

4. **ADR (Architecture Decision Records)**: Document why, not just what
<!-- ADR（架構決策記錄）：記錄為什麼，不只是做什麼 -->

5. **Clean Root Directory**: Keep root organized with only essential files
<!-- 乾淨的根目錄：保持根目錄整潔，只放必要檔案 -->

## Root Directory Policy

<!-- 根目錄政策 -->

**CRITICAL: OpenCode MUST follow this policy for all file creation in project root.**

<!-- 重要：OpenCode 在根目錄建立任何檔案時必須遵循此政策。 -->

### Allowed Files in Root

<!-- 根目錄允許的檔案 -->

**Essential Documentation**:

<!-- 必備文檔： -->

- `README.md` - Project overview (universal standard)
- `LICENSE` - Software license (required for open source)
- `CHANGELOG.md` - Version history (Keep-a-Changelog convention)

**AI Configuration**:

<!-- AI 配置： -->

- `AGENTS.md` - Primary OpenCode configuration (this file)

**Technology Configuration**:

<!-- 技術配置： -->

- `package.json`, `package-lock.json` - Node.js (npm standard)
- `tsconfig.json` - TypeScript configuration
- `.gitignore`, `.dockerignore` - Ignore patterns
- `.env.example` - Environment template
- `.cz.toml` - Commitizen configuration
- `.pre-commit-config.yaml` - Pre-commit hooks

**Containerization** (if used):

<!-- 容器化（如使用）： -->

- `Containerfile` or `Dockerfile` - Container definition

**Archive Documentation** (conditional):

<!-- 封存文檔（條件性）： -->

- `ARCHIVE_*.md` - Only for major architectural shift historical reference

### NOT Allowed in Root

<!-- 根目錄不允許的內容 -->

**Temporary/intermediate documentation files**:

<!-- 臨時/中間文檔檔案： -->

- ❌ `AI_ARCHITECTURE_SUMMARY.md`
- ❌ `AI_TOOLS_COMPATIBILITY.md`
- ❌ `ARCHITECTURE_CORRECTION.md`
- ❌ `DESIGN_NOTES.md`
- ❌ `TODO.md`
- ❌ `NOTES.md`

**Where they should go instead**:

<!-- 應該放在哪裡： -->

- Architecture docs → `docs/architecture/` or merge into ADRs
<!-- 架構文檔 → docs/architecture/ 或合併到 ADR -->

- AI tool compatibility → Tool-specific directories (`.claude/`, `.roo/`, `.opencode/`)
<!-- AI 工具相容性 → 工具特定目錄（.claude/、.roo/、.opencode/） -->

- TODO lists → GitHub Issues or `docs/TODO.md`
<!-- TODO 清單 → GitHub Issues 或 docs/TODO.md -->

- Personal notes → Not committed to version control
<!-- 個人筆記 → 不提交到版本控制 -->

### Enforcement Rules for OpenCode

<!-- OpenCode 的強制執行規則 -->

**Before creating ANY file in root directory**:

<!-- 在根目錄建立任何檔案前： -->

1. ✅ Check if it matches the allowed list above
<!-- 檢查是否符合上述允許清單 -->

2. ✅ If not on the list, propose alternative location
<!-- 如不在清單中，建議替代位置 -->

3. ✅ Ask user for approval before creating
<!-- 在建立前詢問使用者是否批准 -->

**When encountering non-compliant files**:

<!-- 遇到不符合規範的檔案時： -->

- Suggest moving to appropriate location
<!-- 建議移動到適當位置 -->

- Offer to merge content into existing docs
<!-- 提議合併內容到現有文檔 -->

- Recommend deletion if obsolete
<!-- 如已過時則建議刪除 -->

**Rationale**: A clean root directory improves discoverability, reduces cognitive load, aligns with community conventions, and signals project maturity.

<!-- 理由：乾淨的根目錄改善可發現性、降低認知負擔、符合社群慣例，並顯示專案成熟度。 -->

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

3. **Ask before 1.0.0**: OpenCode MUST ask the user before any 1.0.0 transition: "Are we ready to transition to 1.0.0 release stage?"
   <!-- 在 1.0.0 前詢問：OpenCode 在任何 1.0.0 過渡前必須詢問使用者：「我們準備好過渡到 1.0.0 release 階段了嗎？」 -->

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

All commits MUST follow **Conventional Commits** specification with **Angular convention** types:

<!-- 所有提交都必須遵循 Conventional Commits 規範，使用 Angular 慣例類型： -->

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

**Commit types (Angular convention)**:

<!-- Commit 類型（Angular 慣例）： -->

**Types that trigger version bumps** (when user creates a release):

<!-- 觸發版本更新的類型（當使用者建立發布時）： -->

- `feat`: New feature → triggers **MINOR** bump (0.x.0)
  <!-- feat：新功能 → 觸發 MINOR 版本更新 -->

- `fix`: Bug fix → triggers **PATCH** bump (0.0.x)
  <!-- fix：錯誤修復 → 觸發 PATCH 版本更新 -->

- `feat!` or `fix!` or `BREAKING CHANGE:` → triggers **MAJOR** bump (in 1.0.0+) or **MINOR** bump (in 0.x.x Pre-Release)
  <!-- feat! 或 fix! 或 BREAKING CHANGE: → 觸發 MAJOR 版本更新（1.0.0+ 後）或 MINOR 版本更新（0.x.x Pre-Release） -->

**Types that do NOT trigger version bumps**:

<!-- 不觸發版本更新的類型： -->

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

- `chore`: Other changes (tooling, config, etc.)
  <!-- chore：其他變更（工具、配置等） -->

**Important**: Even `perf` does NOT trigger version bumps automatically. Performance improvements without new features or bug fixes are considered internal changes.

<!-- 重要：即使 perf 也不自動觸發版本更新。效能改善若無新功能或錯誤修復，視為內部變更。 -->

**Breaking changes**:

<!-- 破壞性變更： -->

Add `!` after type/scope OR include `BREAKING CHANGE:` in footer:

<!-- 在 type/scope 後加 ! 或在 footer 中包含 BREAKING CHANGE:： -->

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

### Version Update Policy

<!-- 版本更新政策 -->

**CRITICAL**: Version numbers are updated ONLY when the user explicitly approves, not automatically on every commit.

<!-- 重要：版本號只在使用者明確批准時更新，不是每次提交都自動更新。 -->

**Philosophy**:

<!-- 理念： -->

- Commits document changes; versions mark milestones
  <!-- Commits 記錄變更；版本標記里程碑 -->

- Multiple commits can belong to the same version
  <!-- 多個提交可以屬於同一個版本 -->

- Version bump happens when user decides to create a release
  <!-- 版本更新發生在使用者決定建立發布時 -->

**When to update version**:

<!-- 何時更新版本： -->

1. User explicitly requests: "create a release", "bump version", "tag this version"
   <!-- 使用者明確要求：「建立發布」、「更新版本」、「標記此版本」 -->

2. Accumulation of changes warrants a release (user decides)
   <!-- 累積的變更需要發布（使用者決定） -->

3. Before deploying to production or publishing
   <!-- 部署到生產環境或發布前 -->

**When NOT to update version**:

<!-- 何時不更新版本： -->

- Regular development commits (even `feat:` or `fix:`)
  <!-- 常規開發提交（即使是 feat: 或 fix:） -->

- Work-in-progress features
  <!-- 進行中的功能 -->

- Documentation-only changes
  <!-- 僅文檔變更 -->

### Before Every Commit: Commit Analysis (Not Version Analysis)

<!-- 每次提交前：提交分析（不是版本分析） -->

**IMPORTANT**: OpenCode analyzes commits before creation, but does NOT propose version bumps unless user requests.

<!-- 重要：OpenCode 在建立提交前分析提交，但不會建議版本更新除非使用者要求。 -->

**Step 0: Check Personal Notes System (Optional)**

<!-- 步驟 0：檢查個人筆記系統（可選） -->

Before analyzing commit, check if `.notes/docs-list.md` exists:

<!-- 在分析 commit 前，檢查 `.notes/docs-list.md` 是否存在： -->

1. **If `.notes/docs-list.md` exists**:
   <!-- 如果 .notes/docs-list.md 存在： -->
   - Read `.notes/AI_INSTRUCTIONS.md` for note-taking instructions
   <!-- 讀取 .notes/AI_INSTRUCTIONS.md 了解筆記指令 -->
   - Read `.notes/docs-list.md` to understand which notes to maintain
   <!-- 讀取 .notes/docs-list.md 了解需要維護哪些筆記 -->
   - **After Step 5 (git operations)**, update relevant notes based on commit content
   <!-- 在步驟 5（git 操作）之後，根據 commit 內容更新相關筆記 -->

2. **If `.notes/docs-list.md` does NOT exist**:
   <!-- 如果 .notes/docs-list.md 不存在： -->
   - Skip note-taking workflow, proceed with normal commit process
   <!-- 跳過筆記工作流程，繼續正常的 commit 流程 -->

**Note**: Personal notes in `.notes/` are git-ignored and used for personal reference and report generation.

<!-- 註記：.notes/ 中的個人筆記被 git 忽略，用於個人參考和報告生成。 -->

See [.notes/AI_INSTRUCTIONS.md](./.notes/AI_INSTRUCTIONS.md) for detailed note-taking instructions.

<!-- 詳細的筆記指令請參考 .notes/AI_INSTRUCTIONS.md。 -->

**Step 1: Analyze Changes**

<!-- 步驟 1：分析變更 -->

Review all changes and categorize them by commit type:

<!-- 檢視所有變更並按提交類型分類： -->

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation only
- `refactor:`, `style:`, `test:`, `chore:` - Other changes
- `feat!:` or `BREAKING CHANGE:` - Breaking changes

**Step 2: Group Logically Related Changes**

<!-- 步驟 2：分組邏輯相關的變更 -->

If the discussion covers multiple independent changes:

<!-- 如果討論涵蓋多個獨立變更： -->

1. Identify logical groups (e.g., "Feature A", "Feature B", "Documentation")
   <!-- 識別邏輯群組（例如「功能 A」、「功能 B」、「文檔」） -->
2. Each group should be a separate commit for better traceability
   <!-- 每個群組應該是獨立的 commit 以便更好追溯 -->
3. Use appropriate commit type for each group
   <!-- 為每個群組使用適當的提交類型 -->

**Step 3: Present Commit Plan to User**

<!-- 步驟 3：向使用者呈現提交計畫 -->

OpenCode MUST present a structured plan WITHOUT version bump proposals:

<!-- OpenCode 必須呈現結構化的計畫，但不建議版本更新： -->

```markdown
## 📋 提交計畫 | Commit Plan

### 變更分析 | Change Analysis

[Summary of all changes discussed]

### 提交選項 | Commit Options

**選項 A: 單一提交 (推薦)**

<!-- Option A: Single Commit (Recommended) -->

- Commit 1: [type]([scope]): [description]
  - Files: [list]

**選項 B: 多個提交**

<!-- Option B: Multiple Commits -->

- Commit 1: [type]([scope]): [description]
  - Files: [list]

- Commit 2: [type]([scope]): [description]
  - Files: [list]

[Add more commits as needed]

### 建議 | Recommendation

[OpenCode's recommendation with rationale]
```

**Step 4: Wait for User Decision**

<!-- 步驟 4：等待使用者決定 -->

Do NOT proceed with git operations until user approves which commit option to use.

<!-- 在使用者批准使用哪個提交選項前不要執行 git 操作。 -->

**Step 5: Execute Git Operations**

<!-- 步驟 5：執行 Git 操作 -->

After user approval, create the commits with proper conventional commit messages.

<!-- 使用者批准後，使用適當的 conventional commit 訊息建立提交。 -->

**Note**: Version numbers in `package.json` or other files are NOT updated during regular commits. Version updates only happen when user explicitly requests a release.

<!-- 註記：package.json 或其他檔案中的版本號在常規提交時不更新。版本更新只在使用者明確要求發布時發生。 -->

### Release Process

<!-- 發布流程 -->

**When to create a release**:

<!-- 何時建立發布： -->

1. User explicitly requests: "create a release", "bump version", "publish version"
   <!-- 使用者明確要求：「建立發布」、「更新版本」、「發布版本」 -->

2. Sufficient changes have accumulated (user decides)
   <!-- 累積了足夠的變更（使用者決定） -->

3. Before production deployment
   <!-- 生產環境部署前 -->

**Release process steps**:

<!-- 發布流程步驟： -->

**Step 1: Analyze commits since last release**

<!-- 步驟 1：分析上次發布以來的提交 -->

```bash
# Check commits since last release
git log $(git describe --tags --abbrev=0)..HEAD --oneline
```

Categorize commits by type:

<!-- 按類型分類提交： -->

- `feat:` commits → triggers MINOR bump
- `fix:` commits → triggers PATCH bump
- `feat!:`, `fix!:`, or `BREAKING CHANGE:` → triggers MAJOR bump (or MINOR in 0.x.x)
- All other types (`docs:`, `chore:`, `refactor:`, etc.) → included in release notes but don't affect version

**Step 2: Determine version bump**

<!-- 步驟 2：決定版本更新 -->

Based on commit analysis:

<!-- 基於提交分析： -->

- If any `BREAKING CHANGE` → MAJOR bump (1.0.0+) or MINOR bump (0.x.x)
- Else if any `feat:` → MINOR bump
- Else if any `fix:` → PATCH bump
- Else (only `docs:`, `chore:`, etc.) → **NO version bump, but still create release notes**

**Step 3: Update CHANGELOG.md**

<!-- 步驟 3：更新 CHANGELOG.md -->

**IMPORTANT**: Release notes MUST include ALL commits since last release, not just `feat:` and `fix:`.

<!-- 重要：Release notes 必須包含上次發布以來的所有提交，不只是 feat: 和 fix:。 -->

Group changes by category:

<!-- 按類別分組變更： -->

```markdown
## [0.x.y] - YYYY-MM-DD

### Added

- [feat: commits]

### Changed

- [refactor: commits that change behavior]

### Fixed

- [fix: commits]

### Documentation

- [docs: commits]

### Performance

- [perf: commits]

### Code Quality

- [refactor: commits without behavior change]
- [style: commits]
- [test: commits]

### Build System

- [build: commits]
- [ci: commits]

### Chores

- [chore: commits]
```

**Step 4: Update version files**

<!-- 步驟 4：更新版本檔案 -->

Update version number in:

<!-- 更新版本號於： -->

- `package.json`
- `.cz.toml`
- Any other version-tracking files

**Step 5: Create git tag and GitHub Release**

<!-- 步驟 5：建立 git tag 和 GitHub Release -->

```bash
# Create annotated tag
git tag -a v0.x.y -m "Release v0.x.y"

# Push tag to origin
git push origin v0.x.y

# Create GitHub Release using gh CLI
gh release create v0.x.y \
  --title "v0.x.y" \
  --notes-file RELEASE_NOTES.md
```

**Or manually create GitHub Release**:

<!-- 或手動建立 GitHub Release： -->

1. Go to GitHub repository → Releases → Draft a new release
   <!-- 前往 GitHub 儲存庫 → Releases → Draft a new release -->

2. Select tag: `v0.x.y`
   <!-- 選擇 tag：v0.x.y -->

3. Copy content from CHANGELOG.md for this version
   <!-- 從 CHANGELOG.md 複製此版本的內容 -->

4. Publish release
   <!-- 發布 release -->

**Step 6: Verify**

<!-- 步驟 6：驗證 -->

- [ ] Version updated in all version files
      <!-- 所有版本檔案中的版本已更新 -->

- [ ] CHANGELOG.md includes ALL commits (not just feat/fix)
      <!-- CHANGELOG.md 包含所有提交（不只是 feat/fix） -->

- [ ] Git tag created and pushed
      <!-- Git tag 已建立並推送 -->

- [ ] GitHub Release published with complete release notes
      <!-- GitHub Release 已發布，包含完整 release notes -->

**Future** (after technology stack is finalized):

<!-- 未來（技術棧確定後）： -->

Consider automation tools:

<!-- 考慮自動化工具： -->

- JavaScript/TypeScript: `semantic-release`, `changesets`
- Python: `python-semantic-release`
- Language-agnostic: `commitizen` + scripts

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
