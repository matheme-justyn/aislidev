# Development Workflows

<!-- 開發工作流程 -->

## Purpose

<!-- 目的 -->

This file documents standard development workflows for AISliDev. All AI assistants and developers should follow these workflows to maintain consistency and quality.

<!-- 此檔案記錄 AISliDev 的標準開發工作流程。所有 AI 助手和開發者應遵循這些工作流程以保持一致性和品質。 -->

---

## Pre-Work Checklist

<!-- 工作前檢查清單 -->

Before starting any work, AI assistants MUST:

<!-- 在開始任何工作前，AI 助手必須： -->

### 1. Read Core Documentation

<!-- 1. 閱讀核心文檔 -->

- [ ] Read [`AGENTS.md`](../../AGENTS.md) - Main project configuration
      <!-- 閱讀 AGENTS.md - 主要專案配置 -->

- [ ] Check relevant ADRs in [`docs/architecture/ADR/`](../../docs/architecture/ADR/)
      <!-- 檢查 docs/architecture/ADR/ 中的相關 ADR -->

- [ ] Review [`.ai/context/ARCHITECTURE.md`](./ARCHITECTURE.md) for current state
      <!-- 檢閱 .ai/context/ARCHITECTURE.md 了解當前狀態 -->

### 2. Understand Current Context

<!-- 2. 理解當前上下文 -->

- [ ] Check [`CHANGELOG.md`](../../CHANGELOG.md) for recent changes
      <!-- 檢查 CHANGELOG.md 的最近變更 -->

- [ ] Review current version (0.x.x = Pre-Release stage)
      <!-- 檢閱當前版本（0.x.x = Pre-Release 階段） -->

- [ ] Identify which phase we're in (currently: v2 architecture implementation)
      <!-- 確認目前處於哪個階段（目前：v2 架構實作） -->

### 3. Check for Conflicts

<!-- 3. 檢查衝突 -->

If user's request involves architectural decisions:

<!-- 如果使用者的請求涉及架構決策： -->

- [ ] Search for related ADRs
      <!-- 搜尋相關 ADR -->

- [ ] If conflict found, point it out explicitly
      <!-- 如果發現衝突，明確指出 -->

- [ ] Reference the specific ADR (e.g., "This conflicts with ADR-002")
      <!-- 引用特定 ADR（例如「這與 ADR-002 衝突」） -->

- [ ] Explain the rationale from the ADR
      <!-- 解釋 ADR 中的理由 -->

- [ ] Ask user: proceed anyway or update ADR?
      <!-- 詢問使用者：仍要繼續還是更新 ADR？ -->

---

## Feature Development Workflow

<!-- 功能開發工作流程 -->

### Step 1: Planning

<!-- 步驟 1：規劃 -->

1. **Understand requirements**
   - Clarify what the user wants
   - Ask questions if anything is unclear
   - Identify edge cases
     <!-- 理解需求 -->
     <!-- 釐清使用者想要什麼 -->
     <!-- 如有任何不清楚的地方就提問 -->
     <!-- 識別邊緣情況 -->

2. **Check architecture**
   - Does this fit current architecture? (see ADR-002)
   - Will it require new dependencies?
   - Are there any breaking changes?
     <!-- 檢查架構 -->
     <!-- 這符合當前架構嗎？（見 ADR-002） -->
     <!-- 需要新的依賴嗎？ -->
     <!-- 有破壞性變更嗎？ -->

3. **Plan implementation**
   - Which files need to be modified?
   - What new files are needed?
   - What's the order of implementation?
     <!-- 規劃實作 -->
     <!-- 需要修改哪些檔案？ -->
     <!-- 需要哪些新檔案？ -->
     <!-- 實作的順序是什麼？ -->

### Step 2: Implementation

<!-- 步驟 2: 實作 -->

1. **Create branch** (if not working on main directly)

   ```bash
   git checkout -b feature/your-feature-name
   ```

   <!-- 創建分支（如果不直接在 main 上工作） -->

2. **Implement incrementally**
   - Start with core functionality
   - Test as you go
   - Add error handling
   - Write comments (English + Chinese)
     <!-- 漸進式實作 -->
     <!-- 從核心功能開始 -->
     <!-- 邊做邊測試 -->
     <!-- 新增錯誤處理 -->
     <!-- 編寫註解（英文 + 中文） -->

3. **Follow conventions** (see [CONVENTIONS.md](./CONVENTIONS.md))
   - Use proper file naming
   - Follow code style
   - Add JSDoc comments for public APIs
   - Validate inputs
     <!-- 遵循規範（見 CONVENTIONS.md） -->
     <!-- 使用正確的檔案命名 -->
     <!-- 遵循程式碼風格 -->
     <!-- 為公開 API 新增 JSDoc 註解 -->
     <!-- 驗證輸入 -->

### Step 3: Testing

<!-- 步驟 3：測試 -->

1. **Manual testing**

   ```bash
   # Test locally
   npm run dev

   # Test specific feature
   curl http://localhost:3000/your-endpoint
   ```

   <!-- 手動測試 -->

2. **Test edge cases**
   - Invalid inputs
   - Missing data
   - Port conflicts (for server changes)
   - Container deployment (if infrastructure changes)
     <!-- 測試邊緣情況 -->
     <!-- 無效輸入 -->
     <!-- 缺失資料 -->
     <!-- Port 衝突（對伺服器變更） -->
     <!-- 容器部署（如果基礎設施變更） -->

3. **Verify no regressions**
   - Existing features still work
   - No new errors in logs
   - Health check passes
     <!-- 驗證無迴歸 -->
     <!-- 現有功能仍能運作 -->
     <!-- 日誌中沒有新錯誤 -->
     <!-- 健康檢查通過 -->

### Step 4: Documentation

<!-- 步驟 4：文檔 -->

1. **Check documentation maintenance guide**
   - Review [`DOCUMENTATION_MAINTENANCE.md`](../../docs/guides/DOCUMENTATION_MAINTENANCE.md)
   - Determine if README.md needs update
   - Update relevant guides in `docs/guides/`
     <!-- 檢查文檔維護指南 -->
     <!-- 檢閱 DOCUMENTATION_MAINTENANCE.md -->
     <!-- 確定 README.md 是否需要更新 -->
     <!-- 更新 docs/guides/ 中的相關指南 -->

2. **Update documentation**
   - **README.md**: Only if user-facing changes (installation, commands, features)
   - **CHANGELOG.md**: Add entry for the change
   - **ADRs**: Create new ADR if architectural decision was made
   - **Guides**: Update or create guides for new features
     <!-- 更新文檔 -->
     <!-- README.md：僅當使用者面向變更（安裝、命令、功能） -->
     <!-- CHANGELOG.md：為變更新增條目 -->
     <!-- ADR：如果做了架構決策則建立新 ADR -->
     <!-- 指南：為新功能更新或建立指南 -->

3. **Update version references**
   - Check if version numbers need updating (after commit decision)
     <!-- 更新版本參考 -->
     <!-- 檢查版本號是否需要更新（提交決策後） -->

### Step 5: Commit Preparation

<!-- 步驟 5：提交準備 -->

**CRITICAL**: Before committing, perform version analysis (see AGENTS.md)

<!-- 重要：提交前，執行版本分析（見 AGENTS.md） -->

1. **Analyze all changes**

   ```bash
   git status
   git diff
   ```

   <!-- 分析所有變更 -->

2. **Categorize changes**
   - `feat:` → MINOR bump (0.x.0)
   - `fix:` → PATCH bump (0.0.x)
   - `feat!:` or `BREAKING CHANGE:` → MINOR in Pre-Release, MAJOR after 1.0.0
   - `docs:`, `refactor:`, etc. → No version bump
   <!-- 分類變更 -->

3. **Group logically**
   - Separate unrelated changes into different commits
   - Each commit should be atomic and focused
     <!-- 邏輯分組 -->
     <!-- 將不相關的變更分成不同的 commits -->
     <!-- 每個 commit 應該是原子性和聚焦的 -->

4. **Present commit plan to user**

   ```markdown
   ## 📋 提交計畫 | Commit Plan

   ### 變更分析 | Change Analysis

   [Summary of changes]

   ### 版本號判定 | Version Determination

   當前版本 | Current: v0.1.0
   建議版本 | Proposed: v0.2.0

   原因 | Rationale:

   - feat(slidev): add native integration → MINOR bump
   - In Pre-Release (0.x.x), so 0.1.0 → 0.2.0

   ### 提交選項 | Commit Options

   選項 A: 單一提交 (推薦)

   - feat(slidev): add native Slidev integration
   - Files: src/slidev/, src/server/routes/slidev.ts
   - Version: v0.1.0 → v0.2.0

   選項 B: 多個提交

   - feat(slidev): add Slidev service layer
   - feat(api): add Slidev API endpoints
   - docs: update Slidev integration guide

   ### Pre-Release 檢查

   Are we ready for 1.0.0? [ ] Yes [ ] No (Stay in 0.x.x)

   ### 建議 | Recommendation

   [Your recommendation with rationale]
   ```

   <!-- 向使用者呈現提交計畫 -->

5. **Wait for user decision**
   - Do NOT proceed until user approves
   - User chooses commit option
   - User confirms version numbers
   - User decides on Pre-Release vs 1.0.0
     <!-- 等待使用者決定 -->
     <!-- 在使用者批准前不要繼續 -->
     <!-- 使用者選擇提交選項 -->
     <!-- 使用者確認版本號 -->
     <!-- 使用者決定 Pre-Release vs 1.0.0 -->

### Step 6: Commit and Push

<!-- 步驟 6：提交和推送 -->

1. **Stage changes**

   ```bash
   git add <files>
   ```

   <!-- 暫存變更 -->

2. **Commit with conventional format**

   ```bash
   git commit -m "feat(slidev): add native Slidev integration"
   ```

   <!-- 使用 conventional 格式提交 -->

3. **Update version files** (if version bump)
   - Update `package.json` version
   - Update `.cz.toml` version
   - Update CHANGELOG.md
   <!-- 更新版本檔案（如果版本更新） -->

4. **Create git tag** (for MINOR/MAJOR bumps)

   ```bash
   git tag -a v0.2.0 -m "Release v0.2.0"
   ```

   <!-- 建立 git tag（對 MINOR/MAJOR 更新） -->

5. **Push**
   ```bash
   git push origin your-branch
   git push origin v0.2.0  # If tagged
   ```
   <!-- 推送 -->

---

## Bug Fix Workflow

<!-- Bug 修復工作流程 -->

### Step 1: Reproduce

<!-- 步驟 1：重現 -->

1. **Understand the bug**
   - What's the expected behavior?
   - What's the actual behavior?
   - How to reproduce?
     <!-- 理解 bug -->
     <!-- 預期行為是什麼？ -->
     <!-- 實際行為是什麼？ -->
     <!-- 如何重現？ -->

2. **Reproduce locally**

   ```bash
   npm run dev
   # Follow reproduction steps
   ```

   <!-- 本地重現 -->

3. **Identify root cause**
   - Check logs
   - Add debug logging if needed
   - Trace through code
     <!-- 識別根本原因 -->
     <!-- 檢查日誌 -->
     <!-- 如需要新增除錯日誌 -->
     <!-- 追蹤程式碼 -->

### Step 2: Fix

<!-- 步驟 2：修復 -->

1. **Create branch**

   ```bash
   git checkout -b fix/bug-description
   ```

   <!-- 建立分支 -->

2. **Implement fix**
   - Minimal changes to fix the issue
   - Don't add unrelated improvements
   - Add comments explaining the fix
     <!-- 實作修復 -->
     <!-- 最少的變更來修復問題 -->
     <!-- 不要新增不相關的改進 -->
     <!-- 新增註解解釋修復 -->

3. **Test thoroughly**
   - Verify bug is fixed
   - Test related functionality
   - Ensure no new bugs introduced
     <!-- 徹底測試 -->
     <!-- 驗證 bug 已修復 -->
     <!-- 測試相關功能 -->
     <!-- 確保沒有引入新 bug -->

### Step 3: Commit

<!-- 步驟 3：提交 -->

1. **Follow commit workflow** (see above)
   - Analyze changes
   - Determine version bump (usually PATCH)
   - Present plan to user
     <!-- 遵循提交工作流程（見上文） -->
     <!-- 分析變更 -->
     <!-- 確定版本更新（通常是 PATCH） -->
     <!-- 向使用者呈現計畫 -->

2. **Commit with fix type**
   ```bash
   git commit -m "fix(server): resolve port conflict in auto-selection mode"
   ```
   <!-- 使用 fix 類型提交 -->

---

## Refactoring Workflow

<!-- 重構工作流程 -->

### When to Refactor

<!-- 何時重構 -->

- Code is difficult to understand
- Duplication exists
- Function/file is too large
- Performance can be improved
  <!-- 程式碼難以理解 -->
  <!-- 存在重複 -->
  <!-- 函數/檔案太大 -->
  <!-- 可以改進效能 -->

### How to Refactor

<!-- 如何重構 -->

1. **Ensure tests exist** (or create them first)
   <!-- 確保測試存在（或先建立它們） -->

2. **Refactor incrementally**
   - Small, focused changes
   - Test after each change
   - Don't change behavior (unless fixing bugs)
     <!-- 漸進式重構 -->
     <!-- 小而專注的變更 -->
     <!-- 每次變更後測試 -->
     <!-- 不要改變行為（除非修復 bug） -->

3. **Use `refactor:` commit type**

   ```bash
   git commit -m "refactor(server): extract port selection logic into utility"
   ```

   <!-- 使用 refactor: commit 類型 -->

4. **Document if needed**
   - Update comments
   - Don't usually need README updates (unless API changed)
     <!-- 如需要記錄 -->
     <!-- 更新註解 -->
     <!-- 通常不需要更新 README（除非 API 變更） -->

---

## Architecture Decision Workflow

<!-- 架構決策工作流程 -->

### When to Create ADR

<!-- 何時建立 ADR -->

Create an ADR when:

<!-- 在以下情況建立 ADR： -->

- Making significant architectural choices
- Choosing between technology alternatives
- Establishing project-wide conventions
- Reversing previous decisions
  <!-- 做出重大架構選擇 -->
  <!-- 在技術替代方案之間選擇 -->
  <!-- 建立專案範圍的慣例 -->
  <!-- 推翻先前決策 -->

### ADR Creation Process

<!-- ADR 建立流程 -->

1. **Check existing ADRs**
   - Read [`docs/architecture/ADR/README.md`](../../docs/architecture/ADR/README.md)
   - Ensure decision isn't already documented
     <!-- 檢查現有 ADR -->
     <!-- 閱讀 docs/architecture/ADR/README.md -->
     <!-- 確保決策尚未記錄 -->

2. **Create new ADR**
   - Use sequential numbering (003, 004, etc.)
   - Follow template from existing ADRs
   - Use English + Chinese comment format
     <!-- 建立新 ADR -->
     <!-- 使用順序編號（003、004 等） -->
     <!-- 遵循現有 ADR 的範本 -->
     <!-- 使用英文 + 中文註解格式 -->

3. **ADR Structure**

   ```markdown
   # ADR-NNN: Title

   ## Status

   Proposed / Accepted / Deprecated / Superseded

   ## Context

   Background and problem statement

   ## Decision

   What we decided to do

   ## Consequences

   Positive and negative impacts

   ## Alternatives Considered

   Other options we evaluated

   ## References

   Links to related resources
   ```

   <!-- ADR 結構 -->

4. **Update ADR index**
   - Add entry to [`docs/architecture/ADR/README.md`](../../docs/architecture/ADR/README.md)
     <!-- 更新 ADR 索引 -->
     <!-- 新增條目到 docs/architecture/ADR/README.md -->

5. **Commit ADR**
   ```bash
   git commit -m "docs(adr): add ADR-003 for technology stack selection"
   ```
   <!-- 提交 ADR -->

---

## Documentation Update Workflow

<!-- 文檔更新工作流程 -->

### Check Documentation Maintenance Guide

<!-- 檢查文檔維護指南 -->

Always consult [`DOCUMENTATION_MAINTENANCE.md`](../../docs/guides/DOCUMENTATION_MAINTENANCE.md) to determine:

<!-- 總是查閱 DOCUMENTATION_MAINTENANCE.md 以確定： -->

- [ ] Does README.md need update?
- [ ] Should CHANGELOG.md be updated?
- [ ] Are new guides needed?
- [ ] Do ADRs need updates?
  <!-- README.md 需要更新嗎？ -->
  <!-- CHANGELOG.md 應該更新嗎？ -->
  <!-- 需要新指南嗎？ -->
  <!-- ADR 需要更新嗎？ -->

### Documentation Update Checklist

<!-- 文檔更新檢查清單 -->

When updating documentation:

<!-- 更新文檔時： -->

- [ ] Follow language conventions (English + Chinese for AI docs)
- [ ] Test all commands and examples
- [ ] Update version references if needed
- [ ] Check all links work
- [ ] Keep README.md concise (under 250 lines)
- [ ] Move detailed content to guides
  <!-- 遵循語言規範（AI 文檔用英文 + 中文） -->
  <!-- 測試所有命令和範例 -->
  <!-- 如需要更新版本參考 -->
  <!-- 檢查所有連結有效 -->
  <!-- 保持 README.md 簡潔（少於 250 行） -->
  <!-- 將詳細內容移到指南 -->

---

## Emergency Fix Workflow

<!-- 緊急修復工作流程 -->

For critical bugs in production:

<!-- 對生產環境的重大 bug： -->

1. **Create hotfix branch**

   ```bash
   git checkout -b hotfix/critical-bug
   ```

   <!-- 建立 hotfix 分支 -->

2. **Fix quickly but carefully**
   - Focus only on the critical issue
   - Test minimally but sufficiently
   - Don't add features
     <!-- 快速但謹慎地修復 -->
     <!-- 只關注重大問題 -->
     <!-- 測試最少但足夠 -->
     <!-- 不要新增功能 -->

3. **Commit and deploy**

   ```bash
   git commit -m "fix(server): critical port binding failure"
   git push origin hotfix/critical-bug
   ```

   <!-- 提交和部署 -->

4. **Backport if needed**
   - Merge to main
   - Tag immediately
   - Update CHANGELOG
     <!-- 如需要向後移植 -->
     <!-- 合併到 main -->
     <!-- 立即標記 -->
     <!-- 更新 CHANGELOG -->

---

## Collaboration Workflow

<!-- 協作工作流程 -->

### When Multiple AI Tools Work Together

<!-- 當多個 AI 工具一起工作時 -->

1. **Read shared context**
   - Both Claude Code and Roo Code users read same documentation
   - Use `.ai/context/` for shared understanding
   - Follow same conventions
     <!-- 閱讀共享上下文 -->
     <!-- Claude Code 和 Roo Code 使用者閱讀相同文檔 -->
     <!-- 使用 .ai/context/ 以獲得共享理解 -->
     <!-- 遵循相同規範 -->

2. **Communicate through commits**
   - Clear, descriptive commit messages
   - Reference issues/PRs when relevant
   - Update CHANGELOG for significant changes
     <!-- 透過 commits 溝通 -->
     <!-- 清晰、描述性的 commit 訊息 -->
     <!-- 相關時引用 issues/PRs -->
     <!-- 對重大變更更新 CHANGELOG -->

3. **Maintain consistency**
   - Follow conventions in CONVENTIONS.md
   - Don't create tool-specific patterns
   - Keep documentation up-to-date
     <!-- 保持一致性 -->
     <!-- 遵循 CONVENTIONS.md 中的規範 -->
     <!-- 不要建立工具特定的模式 -->
     <!-- 保持文檔最新 -->

---

## Related Documentation

<!-- 相關文檔 -->

- [AGENTS.md](../../AGENTS.md) - Main AI configuration
  <!-- AGENTS.md - 主要 AI 配置 -->

- [CONVENTIONS.md](./CONVENTIONS.md) - Coding standards
  <!-- CONVENTIONS.md - 編碼標準 -->

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Architecture overview
  <!-- ARCHITECTURE.md - 架構概述 -->

- [DOCUMENTATION_MAINTENANCE.md](../../docs/guides/DOCUMENTATION_MAINTENANCE.md) - Doc maintenance rules
  <!-- DOCUMENTATION_MAINTENANCE.md - 文檔維護規則 -->

---

**Last Updated**: 2026-02-11

<!-- 最後更新：2026-02-11 -->
