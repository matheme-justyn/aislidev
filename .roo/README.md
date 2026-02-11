# Roo Code Configuration

<!-- Roo Code 配置 -->

> **Note**: This project uses **OpenCode** as the primary AI agentic architecture.
>
> <!-- 註記：本專案使用 **OpenCode** 作為主要的 AI agentic 架構。 -->

## For Roo Code Users

<!-- 給 Roo Code 使用者 -->

While this project is optimized for OpenCode, Roo Code users can still work effectively by following these steps:

<!-- 雖然本專案針對 OpenCode 優化，Roo Code 使用者仍可透過以下步驟有效地工作： -->

### 1. Read the Main Configuration

<!-- 1. 閱讀主要配置 -->

Start by reading **`AGENTS.md`** in the project root - this is the main project configuration file.

<!-- 首先閱讀專案根目錄的 **`AGENTS.md`** - 這是主要的專案配置檔案。 -->

```
/path/to/project/AGENTS.md
```

### 2. Read Shared Context

<!-- 2. 閱讀共享上下文 -->

All AI agents (including Roo Code) should read the shared context files:

<!-- 所有 AI agent（包括 Roo Code）都應該閱讀共享的上下文檔案： -->

- **`.ai/context/ARCHITECTURE.md`** - Architecture overview and design principles
  <!-- 架構概述和設計原則 -->

- **`.ai/context/CONVENTIONS.md`** - Coding standards and conventions
  <!-- 編碼標準和規範 -->

- **`.ai/context/WORKFLOWS.md`** - Development workflows
  <!-- 開發工作流程 -->

### 3. Read Architecture Decision Records

<!-- 3. 閱讀架構決策記錄 -->

Before making architectural suggestions, check existing decisions in:

<!-- 在提出架構建議前，檢查現有決策： -->

```
docs/architecture/ADR/
```

See `docs/architecture/ADR/README.md` for the complete list of ADRs.

<!-- 參考 docs/architecture/ADR/README.md 了解完整的 ADR 列表。 -->

### 4. Follow the Same Guidelines

<!-- 4. 遵循相同的指引 -->

All guidelines in `AGENTS.md` apply to Roo Code as well:

<!-- AGENTS.md 中的所有指引同樣適用於 Roo Code： -->

- **Version Control**: Use Semantic Versioning and Conventional Commits
  <!-- 版本控制：使用 Semantic Versioning 和 Conventional Commits -->

- **Pre-Release Rules**: Stay in 0.x.x until MVP is ready
  <!-- Pre-Release 規則：在 MVP 準備好前保持 0.x.x -->

- **Commit Process**: Follow the commit plan workflow before every commit
  <!-- 提交流程：每次提交前遵循提交計畫工作流程 -->

- **Documentation**: Keep docs in sync with code changes
  <!-- 文檔：保持文檔與程式碼變更同步 -->

- **ADR Consistency**: Always check ADRs before making architectural decisions
  <!-- ADR 一致性：在做架構決策前始終檢查 ADR -->

## Custom Instructions (Optional)

<!-- 自訂指令（可選） -->

If you want to set up Roo Code's custom instructions for this project:

<!-- 如果您想為本專案設定 Roo Code 的自訂指令： -->

1. Use the template at `.ai/memory/MEMORY_TEMPLATE.md` as a starting point
   <!-- 使用 .ai/memory/MEMORY_TEMPLATE.md 作為起點 -->

2. Adapt the content for Roo Code's custom instructions format
   <!-- 將內容調整為 Roo Code 的自訂指令格式 -->

3. Paste into Roo Code's custom instructions settings
   <!-- 貼到 Roo Code 的自訂指令設定中 -->

## Key Differences from OpenCode

<!-- 與 OpenCode 的主要差異 -->

| Feature          | OpenCode                | Roo Code                          |
| ---------------- | ----------------------- | --------------------------------- |
| **Entry Point**  | `AGENTS.md` (auto-read) | `AGENTS.md` (manual reference)    |
| **Memory**       | Git-tracked config      | Custom Instructions (in settings) |
| **Agent System** | Built-in subagents      | Custom modes in `.roo/modes/`     |
| **Skills**       | Native skills           | `.roo/skills/` (optional)         |

<!-- 功能 | OpenCode | Roo Code -->
<!-- 入口點 | AGENTS.md（自動讀取） | AGENTS.md（手動參考） -->
<!-- Memory | Git 追蹤的配置 | 自訂指令（在設定中） -->
<!-- Agent 系統 | 內建 subagent | .roo/modes/ 中的自訂模式 -->
<!-- Skills | 原生 skills | .roo/skills/（可選） -->

## Questions?

<!-- 問題？ -->

For questions about this project, refer to:

<!-- 關於本專案的問題，請參考： -->

- **Main Config**: `AGENTS.md` (project root)
- **Architecture**: `.ai/context/ARCHITECTURE.md`
- **ADRs**: `docs/architecture/ADR/`
- **OpenCode Docs**: [opencode.ai/docs](https://opencode.ai/docs)

---

**Last Updated**: 2026-02-11

<!-- 最後更新：2026-02-11 -->
