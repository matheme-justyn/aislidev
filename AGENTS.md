# AISliDev - OpenCode Agent Configuration


> **Primary AI Tool**: This project uses **OpenCode** as the primary AI agentic architecture.
>
>
> **Other tools**: Claude Code and Roo Code users can find configuration guidance in `.claude/README.md` and `.roo/README.md`.
>

## Project Overview


AISliDev is an AI-powered Slidev presentation platform that enables intelligent slide creation and editing.


**Status**: Architecture redesign in progress (v2)


**Version**: 0.1.0 (Pre-Release)


## Documentation Standards


### Language Convention

**AI-facing documentation** (files intended for AI agents to read) MUST be written in English.

**AI-facing documentation includes**:

- `AGENTS.md` - Main project configuration for OpenCode (this file)
- `.ai/context/*.md` - Shared context for all AI agents
- `docs/adr/*.md` - Architecture Decision Records

**Other documentation** (README, CHANGELOG, user-facing guides, etc.) can be written in any language as appropriate for the audience.

**Why English for AI?**

- AI agents work best with English technical documentation
- Universal comprehension across all AI tools
- Easier to maintain single-language technical specs
- **Single source of truth**: No need to maintain separate language versions

### Documentation Maintenance


**IMPORTANT**: Documentation must be kept in sync with code changes.


See [docs/guides/DOCUMENTATION_MAINTENANCE.md](./docs/guides/DOCUMENTATION_MAINTENANCE.md) for:


- When to update README.md

- What README.md should include

- Update checklist for documentation

OpenCode MUST consult this guide after making significant changes to determine if documentation updates are needed.


## Working with OpenCode


This project is optimized for **OpenCode** as the primary AI agentic architecture, with **oh-my-opencode** plugin installed for enhanced capabilities.


### oh-my-opencode Installation


**Status**: ✅ Installed and configured


This project has oh-my-opencode installed with the following configuration:


- **Version**: `oh-my-opencode@latest`
- **Auth Plugin**: `opencode-antigravity-auth@1.4.6`
- **Authenticated Providers**:
  - ✅ Amazon Bedrock (Claude)
  - ✅ GitHub Copilot
  - ✅ Google (Gemini via Antigravity)

**Configured Agents**:


- **Sisyphus** (Claude Opus 4.6 Max) - Main orchestrator
- **Hephaestus** (GPT 5.3 Codex Medium) - Autonomous deep worker
- **Oracle** (GPT 5.2 High) - Architecture and debugging
- **Prometheus** (Claude Opus 4.6 Max) - Planner
- **Librarian** (Claude Sonnet 4.5) - Documentation and code search
- **Explore** (Claude Haiku 4.5) - Fast codebase exploration
- **Multimodal Looker** (Gemini 3 Flash) - Visual engineering

**Quick Usage**:


```bash
# Use ultrawork mode (or ulw) in your prompt
ulw <your task description>

# Example: Fix all ESLint warnings
ulw fix all ESLint warnings

# Example: Create a new feature
ulw create a user authentication system
```

**Configuration Locations**:


- Global: `~/.config/opencode/opencode.json`
- Global oh-my-opencode: `~/.config/opencode/oh-my-opencode.json`
- Project: `AGENTS.md` (this file)

See [oh-my-opencode documentation](https://github.com/code-yeongyu/oh-my-opencode) for more information.



---

## Development Environment Strategy

### Container-First Policy

**CRITICAL**: All development, testing, and deployment MUST use containerized environment.

**Rationale**:
- Consistency: Same environment for development and production
- Isolation: No conflicts with host system dependencies
- Playwright: Browser automation requires consistent environment
- Deployment: Direct container deployment without env differences

**Rules for OpenCode**:

1. **Never use `npm run dev` for feature testing**
   - Local dev server is ONLY for quick code verification
   - All feature validation MUST be done in container

2. **Always rebuild container after code changes**
   ```bash
   ./deploy.sh deploy  # Rebuild and restart container
   ```

3. **Test PPTX export in container only**
   - PPTX export behavior differs between local and container
   - Background image loading requires container environment

4. **Container commands**:
   ```bash
   # Deploy (build + start)
   ./deploy.sh deploy
   
   # Restart without rebuild
   ./deploy.sh restart
   
   # View logs
   ./deploy.sh logs
   
   # Stop
   ./deploy.sh stop
   ```

### Known Issues

#### Podman Stability (2026-03-16)

**Status**: ⚠️ Podman machine frequently becomes unresponsive

**Symptoms**:
- `podman build` hangs indefinitely
- `podman ps` times out
- SSH connection to VM fails

**Workaround**:
```bash
# Force restart Podman machine
pkill -9 vfkit
podman machine start
```

**Long-term solution**: Consider migrating to Lima or OrbStack for better macOS stability.

#### PPTX Background Images Not Loading (2026-03-16)

**Status**: 🔴 UNRESOLVED

**Symptom**: PPTX exports show white backgrounds instead of Unsplash images (97KB screenshots instead of 844KB)

**What we tried**:
1. ✅ Added `channel: 'chromium'` to Playwright launch options
2. ✅ Replaced `playwright-chromium` with full `playwright` package
3. ✅ Increased wait times (10s initial, 5+5s per slide)
4. ✅ Verified `networkidle` wait state
5. ✅ Confirmed independent test script works (844KB screenshots)

**Current mystery**:
- Independent test script `test-screenshot.mjs` successfully captures backgrounds (844KB)
- BrowserExporter service with **identical code** fails (97KB white backgrounds)
- Same Playwright version, same launch options, same wait times
- Tested on local dev server (not container yet)

**Test evidence**:
```bash
# This works ✅
node test-screenshot.mjs  # → 844KB screenshot with background

# This fails ❌  
curl -X POST .../export  # → 97KB screenshot, white background
```

**Next steps**:
1. Test in container environment (current tests were local only)
2. Add detailed logging to BrowserExporter screenshot method
3. Compare browser contexts between test script and service
4. Consider using Puppeteer as alternative

**Files**:
- Service: `src/server/services/BrowserExporter.ts`
- Test script: `test-screenshot.mjs` (working example)
- Slides config: `data/aislidev-demo/slides.md` (has Unsplash URLs)


### Shared Context System


OpenCode reads from **shared context** in `.ai/context/`:


- `ARCHITECTURE.md` - Architecture overview and design principles

- `CONVENTIONS.md` - Coding standards and conventions

- `WORKFLOWS.md` - Development workflows

### Other AI Tools


If you're using **Claude Code** or **Roo Code**, please refer to:


- `.claude/README.md` - Claude Code configuration guide

- `.roo/README.md` - Roo Code configuration guide

## Architecture Decisions


All significant architectural decisions are documented in `docs/adr/` using the Architecture Decision Records (ADR) pattern.


### ADR Index


See [docs/adr/README.md](./docs/adr/README.md) for the complete list of ADRs.


**Current ADRs**:


- [ADR-001: Version Control and Release Strategy](./docs/adr/001-version-control-strategy.md)

- [ADR-002: Lightweight Containerization](./docs/adr/002-lightweight-containerization.md)

- [ADR-003: OpenCode-First AI Architecture](./docs/adr/003-opencode-first-architecture.md)

- [ADR-004: Slidev Vite Dev Mode Fix](./docs/adr/004-slidev-vite-dev-mode-fix.md)

### Consistency Enforcement


**CRITICAL: OpenCode MUST follow these rules**:


1. **Read ADRs before making suggestions**: When discussing architecture, technology choices, or development workflows, OpenCode MUST first read relevant ADRs in `docs/adr/` to understand existing decisions.

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

4. **Reference ADRs in explanations**: When explaining why something is done a certain way, cite the relevant ADR.

**Example workflow**:


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


See `ARCHIVE_v1_design.md` for the first version design and lessons learned.


**Key lessons from v1**:


- Over-engineering leads to complexity

- Container orchestration may be overkill for single-user tools

- Iframe-based Slidev integration has fundamental issues

### v2 Architecture (In Design)


See `.ai/context/ARCHITECTURE.md` for current v2 architecture details.


## Development Principles


1. **Simplicity First**: Avoid over-engineering

2. **Documentation-Driven**: Design before implementation

3. **OpenCode-First Development**: Leverage OpenCode for maximum productivity

4. **ADR (Architecture Decision Records)**: Document why, not just what

5. **Clean Root Directory**: Keep root organized with only essential files

## Root Directory Policy


**CRITICAL: OpenCode MUST follow this policy for all file creation in project root.**


### Allowed Files in Root


**Essential Documentation**:


- `README.md` - Project overview (universal standard)
- `LICENSE` - Software license (required for open source)
- `CHANGELOG.md` - Version history (Keep-a-Changelog convention)

**AI Configuration**:


- `AGENTS.md` - Primary OpenCode configuration (this file)

**Technology Configuration**:


- `package.json`, `package-lock.json` - Node.js (npm standard)
- `tsconfig.json` - TypeScript configuration
- `.gitignore`, `.dockerignore` - Ignore patterns
- `.env.example` - Environment template
- `.cz.toml` - Commitizen configuration
- `.pre-commit-config.yaml` - Pre-commit hooks

**Containerization** (if used):


- `Containerfile` or `Dockerfile` - Container definition

**Archive Documentation** (conditional):


- `ARCHIVE_*.md` - Only for major architectural shift historical reference

### NOT Allowed in Root


**Temporary/intermediate documentation files**:


- ❌ `AI_ARCHITECTURE_SUMMARY.md`
- ❌ `AI_TOOLS_COMPATIBILITY.md`
- ❌ `ARCHITECTURE_CORRECTION.md`
- ❌ `DESIGN_NOTES.md`
- ❌ `TODO.md`
- ❌ `NOTES.md`

**Where they should go instead**:


- Architecture docs → `docs/architecture/` or merge into ADRs

- AI tool compatibility → Tool-specific directories (`.claude/`, `.roo/`, `.opencode/`)

- TODO lists → GitHub Issues or `docs/TODO.md`

- Personal notes → Not committed to version control

### Enforcement Rules for OpenCode


**Before creating ANY file in root directory**:


1. ✅ Check if it matches the allowed list above

2. ✅ If not on the list, propose alternative location

3. ✅ Ask user for approval before creating

**When encountering non-compliant files**:


- Suggest moving to appropriate location

- Offer to merge content into existing docs

- Recommend deletion if obsolete

**Rationale**: A clean root directory improves discoverability, reduces cognitive load, aligns with community conventions, and signals project maturity.


## Version Control and Releases


See [ADR-001](./docs/adr/001-version-control-strategy.md) for the full decision context.


### Versioning


We follow **Semantic Versioning 2.0.0**: `MAJOR.MINOR.PATCH`


- **MAJOR**: Breaking changes / incompatible API changes

- **MINOR**: New features (backward-compatible)

- **PATCH**: Bug fixes (backward-compatible)

### Pre-Release Stage (0.x.x)


**IMPORTANT**: This project is currently in **Pre-Release (0.x.x)** stage.


**Pre-Release Rules**:


1. **Stay in 0.x.x until POC/MVP ready**: Do not bump to 1.0.0 until the project reaches POC/MVP quality
   <!-- 保持 0.x.x 直到 POC/MVP 準備好：在專案達到 POC/MVP 品質之前不要升級到 1.0.0 -->

2. **Breaking changes are MINOR bumps**: In 0.x.x stage, even breaking changes only trigger MINOR version bumps (0.1.0 → 0.2.0), not MAJOR
   <!-- 破壞性變更是 MINOR 更新：在 0.x.x 階段，即使是破壞性變更也只觸發 MINOR 版本更新，不是 MAJOR -->

3. **Ask before 1.0.0**: OpenCode MUST ask the user before any 1.0.0 transition: "Are we ready to transition to 1.0.0 release stage?"
   <!-- 在 1.0.0 前詢問：OpenCode 在任何 1.0.0 過渡前必須詢問使用者：「我們準備好過渡到 1.0.0 release 階段了嗎？」 -->

**When to transition to 1.0.0**:


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


All commits MUST follow **Conventional Commits** specification with **Angular convention** types:


```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

**Commit types (Angular convention)**:


**Types that trigger version bumps** (when user creates a release):


- `feat`: New feature → triggers **MINOR** bump (0.x.0)
  <!-- feat：新功能 → 觸發 MINOR 版本更新 -->

- `fix`: Bug fix → triggers **PATCH** bump (0.0.x)
  <!-- fix：錯誤修復 → 觸發 PATCH 版本更新 -->

- `feat!` or `fix!` or `BREAKING CHANGE:` → triggers **MAJOR** bump (in 1.0.0+) or **MINOR** bump (in 0.x.x Pre-Release)
  <!-- feat! 或 fix! 或 BREAKING CHANGE: → 觸發 MAJOR 版本更新（1.0.0+ 後）或 MINOR 版本更新（0.x.x Pre-Release） -->

**Types that do NOT trigger version bumps**:


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


**Breaking changes**:


Add `!` after type/scope OR include `BREAKING CHANGE:` in footer:


**Examples**:


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


**Philosophy**: Use tooling to enforce commit message format when available, but don't block development waiting for tools.


**Current approach** (v2 design phase):


- Manual enforcement: Follow conventional commits format carefully

- Code review: Check commit messages during PR review

- Tools are optional: See `docs/guides/COMMIT_SETUP.md` for available tools (commitizen, pre-commit hooks)

**After technology stack selection**:


- Evaluate and select appropriate tooling based on chosen stack

- Implement automated commit message validation

- Consider automated version bumping and changelog generation

### Version Update Policy


**CRITICAL**: Version numbers are updated ONLY when the user explicitly approves, not automatically on every commit.


**Philosophy**:


- Commits document changes; versions mark milestones
  <!-- Commits 記錄變更；版本標記里程碑 -->

- Multiple commits can belong to the same version
  <!-- 多個提交可以屬於同一個版本 -->

- Version bump happens when user decides to create a release
  <!-- 版本更新發生在使用者決定建立發布時 -->

**When to update version**:


1. User explicitly requests: "create a release", "bump version", "tag this version"
   <!-- 使用者明確要求：「建立發布」、「更新版本」、「標記此版本」 -->

2. Accumulation of changes warrants a release (user decides)
   <!-- 累積的變更需要發布（使用者決定） -->

3. Before deploying to production or publishing
   <!-- 部署到生產環境或發布前 -->

**When NOT to update version**:


- Regular development commits (even `feat:` or `fix:`)
  <!-- 常規開發提交（即使是 feat: 或 fix:） -->

- Work-in-progress features
  <!-- 進行中的功能 -->

- Documentation-only changes
  <!-- 僅文檔變更 -->

### Before Every Commit: Commit Analysis (Not Version Analysis)


**IMPORTANT**: OpenCode analyzes commits before creation, but does NOT propose version bumps unless user requests.


**Step 0: Check Personal Notes System (Optional)**


Before analyzing commit, check if `.notes/docs-list.md` exists:


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


See [.notes/AI_INSTRUCTIONS.md](./.notes/AI_INSTRUCTIONS.md) for detailed note-taking instructions.


**Step 1: Analyze Changes**


Review all changes and categorize them by commit type:


- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation only
- `refactor:`, `style:`, `test:`, `chore:` - Other changes
- `feat!:` or `BREAKING CHANGE:` - Breaking changes

**Step 2: Group Logically Related Changes**


If the discussion covers multiple independent changes:


1. Identify logical groups (e.g., "Feature A", "Feature B", "Documentation")
   <!-- 識別邏輯群組（例如「功能 A」、「功能 B」、「文檔」） -->
2. Each group should be a separate commit for better traceability
   <!-- 每個群組應該是獨立的 commit 以便更好追溯 -->
3. Use appropriate commit type for each group
   <!-- 為每個群組使用適當的提交類型 -->

**Step 3: Present Commit Plan to User**


OpenCode MUST present a structured plan WITHOUT version bump proposals:


```markdown
## 📋 提交計畫 | Commit Plan

### 變更分析 | Change Analysis

[Summary of all changes discussed]

### 提交選項 | Commit Options

**選項 A: 單一提交 (推薦)**


- Commit 1: [type]([scope]): [description]
  - Files: [list]

**選項 B: 多個提交**


- Commit 1: [type]([scope]): [description]
  - Files: [list]

- Commit 2: [type]([scope]): [description]
  - Files: [list]

[Add more commits as needed]

### 建議 | Recommendation

[OpenCode's recommendation with rationale]
```

**Step 4: Wait for User Decision**


Do NOT proceed with git operations until user approves which commit option to use.


**Step 5: Execute Git Operations**


After user approval, create the commits with proper conventional commit messages.


**Note**: Version numbers in `package.json` or other files are NOT updated during regular commits. Version updates only happen when user explicitly requests a release.


### Release Process


**When to create a release**:


1. User explicitly requests: "create a release", "bump version", "publish version"
   <!-- 使用者明確要求：「建立發布」、「更新版本」、「發布版本」 -->

2. Sufficient changes have accumulated (user decides)
   <!-- 累積了足夠的變更（使用者決定） -->

3. Before production deployment
   <!-- 生產環境部署前 -->

**Release process steps**:


**Step 1: Analyze commits since last release**


```bash
# Check commits since last release
git log $(git describe --tags --abbrev=0)..HEAD --oneline
```

Categorize commits by type:


- `feat:` commits → triggers MINOR bump
- `fix:` commits → triggers PATCH bump
- `feat!:`, `fix!:`, or `BREAKING CHANGE:` → triggers MAJOR bump (or MINOR in 0.x.x)
- All other types (`docs:`, `chore:`, `refactor:`, etc.) → included in release notes but don't affect version

**Step 2: Determine version bump**


Based on commit analysis:


- If any `BREAKING CHANGE` → MAJOR bump (1.0.0+) or MINOR bump (0.x.x)
- Else if any `feat:` → MINOR bump
- Else if any `fix:` → PATCH bump
- Else (only `docs:`, `chore:`, etc.) → **NO version bump, but still create release notes**

**Step 3: Update CHANGELOG.md**


**IMPORTANT**: Release notes MUST include ALL commits since last release, not just `feat:` and `fix:`.


Group changes by category:


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


Update version number in:


- `package.json`
- `.cz.toml`
- Any other version-tracking files

**Step 5: Create git tag and GitHub Release**


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


1. Go to GitHub repository → Releases → Draft a new release
   <!-- 前往 GitHub 儲存庫 → Releases → Draft a new release -->

2. Select tag: `v0.x.y`
   <!-- 選擇 tag：v0.x.y -->

3. Copy content from CHANGELOG.md for this version
   <!-- 從 CHANGELOG.md 複製此版本的內容 -->

4. Publish release
   <!-- 發布 release -->

**Step 6: Verify**


- [ ] Version updated in all version files
      <!-- 所有版本檔案中的版本已更新 -->

- [ ] CHANGELOG.md includes ALL commits (not just feat/fix)
      <!-- CHANGELOG.md 包含所有提交（不只是 feat/fix） -->

- [ ] Git tag created and pushed
      <!-- Git tag 已建立並推送 -->

- [ ] GitHub Release published with complete release notes
      <!-- GitHub Release 已發布，包含完整 release notes -->

**Future** (after technology stack is finalized):


Consider automation tools:


- JavaScript/TypeScript: `semantic-release`, `changesets`
- Python: `python-semantic-release`
- Language-agnostic: `commitizen` + scripts

See ADR-001 for rationale.


## Git Workflow


### Branch Naming


Use descriptive branch names with type prefixes:


- `feature/description` - New features

- `fix/description` - Bug fixes

- `docs/description` - Documentation updates

- `refactor/description` - Code refactoring

- `test/description` - Test additions/updates

**Examples**:


```bash
feature/ai-content-generation
fix/preview-rendering-safari
docs/update-adr-001
refactor/simplify-editor-state
```

### Protected Branches


- **No force push** to `main` branch

- **No direct commits** to `main` - use pull requests

- All PRs must pass CI checks (when implemented)

## License


MIT License - See `LICENSE` file

