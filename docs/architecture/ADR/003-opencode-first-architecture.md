# ADR-003: OpenCode-First AI Architecture

<!-- ADR-003：OpenCode 優先的 AI 架構 -->

**Status**: Accepted

<!-- 狀態：已接受 -->

**Date**: 2026-02-11

<!-- 日期：2026-02-11 -->

**Deciders**: Development Team

<!-- 決策者：開發團隊 -->

**Related**: Aligns with [ADR-002](./002-lightweight-containerization.md) simplicity principles

<!-- 相關：與 ADR-002 的簡化原則一致 -->

---

## Context and Problem Statement

<!-- 背景與問題陳述 -->

Initially, this project was designed to support multiple AI coding assistants (Claude Code, Roo Code, OpenCode) working together on the same codebase. This required maintaining separate configuration directories (`.claude/`, `.roo/`, `.opencode/`) and ensuring cross-tool compatibility.

<!-- 最初，本專案設計為支援多個 AI 程式碼助手（Claude Code、Roo Code、OpenCode）在同一程式碼庫上協同工作。這需要維護獨立的配置目錄（.claude/、.roo/、.opencode/）並確保跨工具相容性。 -->

**Decision needed**: Should we maintain multi-tool support or focus on a single primary AI agent architecture?

<!-- 需要決策：我們應該維護多工具支援還是專注於單一主要的 AI agent 架構？ -->

---

## Decision Drivers

<!-- 決策驅動因素 -->

1. **Simplicity** - Reduce maintenance burden and cognitive load
<!-- 簡單性 - 減少維護負擔和認知負荷 -->

2. **Consistency** - Ensure all team members use the same configuration
<!-- 一致性 - 確保所有團隊成員使用相同的配置 -->

3. **Version control** - Keep AI configuration in git for traceability
<!-- 版本控制 - 將 AI 配置保留在 git 中以便追溯 -->

4. **Practicality** - Team actually uses OpenCode as the primary tool
<!-- 實用性 - 團隊實際上使用 OpenCode 作為主要工具 -->

5. **Compatibility** - Don't block other AI tools from working with the project
<!-- 相容性 - 不阻止其他 AI 工具使用本專案 -->

---

## Considered Options

<!-- 考慮的選項 -->

### Option 1: Multi-Tool Equal Support (Current v1 Approach)

<!-- 選項 1：多工具平等支援（目前的 v1 方式） -->

**Pros**:

- Maximum flexibility for team members to choose their preferred tool
- Equal first-class support for Claude Code, Roo Code, and OpenCode
- No tool lock-in

**Cons**:

- Complex directory structure (`.claude/`, `.roo/`, `.opencode/`)
- Need to maintain separate setup guides for each tool
- Configuration duplication and synchronization challenges
- Cognitive overhead: "Which file do I update?"
- Not all configurations are git-tracked (e.g., Claude Code memory)

### Option 2: OpenCode-First with Compatibility (Selected)

<!-- 選項 2：OpenCode 優先兼具相容性（已選） -->

**Pros**:

- Single source of truth: `AGENTS.md` (git-tracked)
- Reduced maintenance burden
- Consistent configuration for all team members
- Native OpenCode features (subagents, skills, CLI workflow)
- Other tools remain usable through standardized docs
- Aligns with "Simplicity First" principle from ADR-002

**Cons**:

- Claude Code and Roo Code users need to manually reference `AGENTS.md`
- Slightly less optimized for non-OpenCode tools

### Option 3: Claude Code Primary

<!-- 選項 3：Claude Code 主要 -->

**Pros**:

- VSCode integration
- Memory system
- Extended thinking features

**Cons**:

- Memory not git-tracked (stored in `~/.claude/`)
- Less consistent across team members
- Not a terminal-first workflow
- Requires VSCode editor

---

## Decision Outcome

<!-- 決策結果 -->

**Chosen option**: **Option 2 - OpenCode-First with Compatibility**

<!-- 選擇的選項：選項 2 - OpenCode 優先兼具相容性 -->

### Rationale

<!-- 理由 -->

1. **Simplicity wins**: A single, git-tracked `AGENTS.md` is easier to maintain than multiple tool-specific directories
<!-- 簡單性勝出：單一、git 追蹤的 AGENTS.md 比多個工具特定目錄更容易維護 -->

2. **Consistency**: All team members see the same configuration
<!-- 一致性：所有團隊成員看到相同的配置 -->

3. **Practical reality**: The team primarily uses OpenCode
<!-- 實際情況：團隊主要使用 OpenCode -->

4. **Terminal-first workflow**: Aligns with development practices
<!-- 終端優先工作流程：符合開發實踐 -->

5. **Git-tracked config**: Changes are versioned and reviewed
<!-- Git 追蹤的配置：變更被版本化和審查 -->

6. **Compatibility maintained**: Other AI tools can still work through standardized documentation
<!-- 保持相容性：其他 AI 工具仍可透過標準化文檔工作 -->

---

## Implementation

<!-- 實作 -->

### Primary Configuration

<!-- 主要配置 -->

- **Main file**: `AGENTS.md` (project root)
  <!-- 主要檔案：AGENTS.md（專案根目錄） -->

- **Shared context**: `.ai/context/` (ARCHITECTURE.md, CONVENTIONS.md, WORKFLOWS.md)
  <!-- 共享上下文：.ai/context/（ARCHITECTURE.md、CONVENTIONS.md、WORKFLOWS.md） -->

- **Architecture decisions**: `docs/architecture/ADR/`
  <!-- 架構決策：docs/architecture/ADR/ -->

### Compatibility for Other Tools

<!-- 其他工具的相容性 -->

- **`.claude/README.md`**: Minimal redirect guide for Claude Code users
  <!-- .claude/README.md：給 Claude Code 使用者的最小重定向指南 -->

- **`.roo/README.md`**: Minimal redirect guide for Roo Code users
  <!-- .roo/README.md：給 Roo Code 使用者的最小重定向指南 -->

- **Standard formats**: ADRs, Conventional Commits, Semantic Versioning work across all tools
  <!-- 標準格式：ADR、Conventional Commits、Semantic Versioning 適用於所有工具 -->

### Migration from Multi-Tool Approach

<!-- 從多工具方式遷移 -->

1. ✅ Rename `AI.md` → `AGENTS.md` (OpenCode standard naming)
   <!-- 重命名 AI.md → AGENTS.md（OpenCode 標準命名） -->

2. ✅ Remove detailed tool-specific setup files
   <!-- 移除詳細的工具特定設定檔案 -->

3. ✅ Create minimal redirect READMEs in `.claude/` and `.roo/`
   <!-- 在 .claude/ 和 .roo/ 中建立最小重定向 README -->

4. ✅ Update `AI_TOOLS_COMPATIBILITY.md` to reflect OpenCode-first approach
   <!-- 更新 AI_TOOLS_COMPATIBILITY.md 以反映 OpenCode 優先方式 -->

5. ✅ Document decision in ADR-003 (this file)
   <!-- 在 ADR-003 記錄決策（本檔案） -->

---

## Consequences

<!-- 後果 -->

### Positive

<!-- 正面 -->

- **Simpler project structure**: One main config file instead of three
  <!-- 更簡單的專案結構：一個主要配置檔案而不是三個 -->

- **Better version control**: All AI configuration is git-tracked
  <!-- 更好的版本控制：所有 AI 配置都被 git 追蹤 -->

- **Reduced maintenance**: Single source of truth for updates
  <!-- 減少維護：更新的單一真相來源 -->

- **Clear ownership**: OpenCode is the primary tool, no ambiguity
  <!-- 明確的所有權：OpenCode 是主要工具，沒有歧義 -->

- **Team consistency**: Everyone uses the same configuration
  <!-- 團隊一致性：每個人使用相同的配置 -->

### Negative

<!-- 負面 -->

- **Claude Code/Roo Code users need extra step**: Must manually read `AGENTS.md` (not automatically loaded)
  <!-- Claude Code/Roo Code 使用者需要額外步驟：必須手動閱讀 AGENTS.md（不會自動載入） -->

- **Less optimized for non-OpenCode tools**: Primary optimization is for OpenCode
  <!-- 對非 OpenCode 工具優化較少：主要優化針對 OpenCode -->

### Mitigation

<!-- 緩解 -->

- Redirect files (`.claude/README.md`, `.roo/README.md`) guide other tool users
  <!-- 重定向檔案（.claude/README.md、.roo/README.md）指引其他工具使用者 -->

- Shared context and ADRs remain tool-agnostic
  <!-- 共享上下文和 ADR 保持工具無關 -->

- Standard practices (Conventional Commits, SemVer) work across all tools
  <!-- 標準實踐（Conventional Commits、SemVer）適用於所有工具 -->

---

## Alternatives Considered

<!-- 考慮的替代方案 -->

### Why not Claude Code as primary?

<!-- 為什麼不選 Claude Code 作為主要工具？ -->

- Memory not git-tracked (stored externally in `~/.claude/`)
  <!-- Memory 不被 git 追蹤（儲存在 ~/.claude/ 外部） -->

- Requires VSCode (not terminal-first)
  <!-- 需要 VSCode（不是終端優先） -->

- Less consistent across team members (personal memory files)
  <!-- 團隊成員間一致性較低（個人 memory 檔案） -->

### Why not keep equal multi-tool support?

<!-- 為什麼不保持平等的多工具支援？ -->

- Maintenance overhead of keeping 3 tool directories in sync
  <!-- 保持 3 個工具目錄同步的維護開銷 -->

- Cognitive load: "Which file is the source of truth?"
  <!-- 認知負荷：「哪個檔案是真相來源？」 -->

- Conflicts with "Simplicity First" principle (ADR-002)
  <!-- 與「簡單優先」原則衝突（ADR-002） -->

- Team doesn't use all tools equally in practice
  <!-- 團隊在實際中並不平等使用所有工具 -->

---

## Related Decisions

<!-- 相關決策 -->

- [ADR-002: Lightweight Containerization](./002-lightweight-containerization.md) - "Simplicity First" principle
  <!-- ADR-002：輕量容器化 - 「簡單優先」原則 -->

- [ADR-001: Version Control Strategy](./001-version-control-strategy.md) - Git-tracked conventions
  <!-- ADR-001：版本控制策略 - Git 追蹤的慣例 -->

---

## References

<!-- 參考資料 -->

- [OpenCode Documentation](https://opencode.ai/docs) - AGENTS.md standard
  <!-- OpenCode 文檔 - AGENTS.md 標準 -->

- [Claude Code Documentation](https://docs.anthropic.com/en/docs/claude-code) - CLAUDE.md pattern
  <!-- Claude Code 文檔 - CLAUDE.md 模式 -->

- [AI Tools Compatibility Guide](../../../AI_TOOLS_COMPATIBILITY.md) - Cross-tool patterns
  <!-- AI 工具相容性指南 - 跨工具模式 -->

---

**Last Updated**: 2026-02-11

<!-- 最後更新：2026-02-11 -->
