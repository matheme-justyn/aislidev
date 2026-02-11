# OpenCode Setup Guide

<!-- OpenCode 設定指南 -->

## Purpose

<!-- 目的 -->

This guide helps you set up OpenCode for working on AISliDev project.

<!-- 本指南幫助你設定 OpenCode 以在 AISliDev 專案上工作。 -->

---

## Overview of OpenCode

<!-- OpenCode 概述 -->

OpenCode is a **standalone AI assistant** with CLI interface that:

<!-- OpenCode 是一個**獨立的 AI 助手**，具有 CLI 介面，特點： -->

- ✅ **No API tokens required** - Uses its own model
  <!-- ✅ 不需要 API tokens - 使用自己的模型 -->
- ✅ **Local file access** - Reads project files directly
  <!-- ✅ 本地檔案存取 - 直接讀取專案檔案 -->
- ✅ **Git-aware** - Understands version control context
  <!-- ✅ Git 感知 - 理解版本控制上下文 -->
- ✅ **Follows project conventions** - Reads AI.md and ADRs
  <!-- ✅ 遵循專案規範 - 讀取 AI.md 和 ADR -->

---

## How OpenCode Works

<!-- OpenCode 如何運作 -->

### File Discovery Priority

<!-- 檔案發現優先級 -->

OpenCode looks for configuration files in this order:

<!-- OpenCode 按此順序尋找配置檔案： -->

1. **Project Root Configuration** (Highest priority)
   <!-- 專案根配置（最高優先級） -->

   ```
   AI.md                    # Main project configuration
   .opencode/CONFIG.md       # OpenCode-specific settings
   ```

2. **Shared AI Context** (High priority)
   <!-- 共享 AI 上下文（高優先級） -->

   ```
   .ai/context/ARCHITECTURE.md
   .ai/context/CONVENTIONS.md
   .ai/context/WORKFLOWS.md
   ```

3. **Architecture Decisions** (High priority)
   <!-- 架構決策（高優先級） -->

   ```
   docs/architecture/ADR/*.md
   ```

4. **Code Analysis** (Medium priority)
   <!-- 程式碼分析（中優先級） -->

   ```
   package.json            # Project metadata
   src/**/*.ts             # Source code
   Containerfile            # Container configuration
   ```

5. **Documentation** (Lower priority)
   <!-- 文檔（較低優先級） -->
   ```
   README.md
   CHANGELOG.md
   docs/guides/*.md
   ```

### Memory System

<!-- 記憶系統 -->

Unlike Claude Code's external memory, OpenCode uses:

<!-- 不像 Claude Code 的外部記憶，OpenCode 使用： -->

- **Git-tracked configuration** - Stored in repository
  <!-- Git 追蹤的配置 - 儲存在儲存庫中 -->
- **Session-based context** - Remembers during current session
  <!-- 基於會話的上下文 - 當前會話中記住 -->
- **File-based preferences** - Edit `.opencode/CONFIG.md`
  <!-- 基於檔案的偏好 - 編輯 .opencode/CONFIG.md -->

---

## Setup Steps

<!-- 設定步驟 -->

### 1. Configure OpenCode Preferences

<!-- 1. 設定 OpenCode 偏好 -->

Edit [`.opencode/CONFIG.md`](./CONFIG.md) to customize:

<!-- 編輯 .opencode/CONFIG.md 來自訂： -->

```markdown
# OpenCode Configuration

# OpenCode 配置

## Communication Preferences

# 溝通偏好

- Language: Traditional Chinese (Taiwan) for conversations
  # 語言：對話用繁體中文（台灣）
- Documentation: English with Chinese comments
  # 文檔：英文加中文註解

## Development Style

# 開發風格

- Architecture-first approach
  # 架構優先方法
- Conventional commits enforcement
  # Conventional commits 強制執行
- ADR compliance checking
  # ADR 合規性檢查
```

### 2. Add to .gitignore

<!-- 2. 新增到 .gitignore -->

Ensure `.opencode/` is tracked (unlike `.claude/` which is ignored):

<!-- 確保 .opencode/ 被追蹤（不像 .claude/ 被忽略）：：

```gitignore
# Claude Code local settings (ignore)
.claude/settings.local.json

# OpenCode settings (track in git)
# .opencode/  <- DO NOT ignore this
```

### 3. Understanding Differences from Other Tools
<!-- 3. 理解與其他工具的差異 -->

| Aspect            | Claude Code                | Roo Code            | OpenCode             |
| ----------------- | -------------------------- | ------------------- | -------------------- |
| **Setup**         | VSCode extension           | VSCode extension    | CLI tool             |
| **API**           | Requires token             | Requires token      | No token needed      |
| **Storage**       | External memory            | Custom instructions | Git-tracked files    |
| **Context**       | Persistent across sessions | Per-workspace       | Per-session + files  |
| **Collaboration** | Personal memory            | Personal settings   | Shared configuration |

---

## Best Practices for OpenCode

<!-- OpenCode 最佳實踐 -->

### 1. Before Starting Work

<!-- 1. 開始工作前 -->

OpenCode automatically reads:

<!-- OpenCode 自動讀取： -->

- ✅ [`AI.md`](../AI.md) - Main project configuration
- ✅ `.ai/context/*` - Shared conventions and workflows
- ✅ `docs/architecture/ADR/*` - Architecture decisions
- ✅ `.opencode/CONFIG.md` - OpenCode preferences

### 2. During Development

<!-- 2. 開發期間 -->

OpenCode will:

<!-- OpenCode 將會： -->

- Follow Conventional Commits format
  <!-- 遵循 Conventional Commits 格式 -->
- Check for ADR conflicts before suggesting changes
  <!-- 在建議變更前檢查 ADR 衝突 -->
- Present version analysis before commits
  <!-- 在提交前呈現版本分析 -->
- Maintain English+Chinese documentation format
  <!-- 維護英文+中文文檔格式 -->

### 3. Configuration Management

<!-- 3. 配置管理 -->

Since OpenCode settings are git-tracked:

<!-- 由於 OpenCode 設定是 git 追蹤的： -->

- All team members share same OpenCode configuration
  <!-- 所有團隊成員共享相同的 OpenCode 配置 -->
- Changes to settings are versioned
  <!-- 設定變更會被版本控制 -->
- No personal memory conflicts
  <!-- 沒有個人記憶衝突 -->

---

## Collaboration with Other Tools

<!-- 與其他工具的協作 -->

OpenCode is designed to work alongside Claude Code and Roo Code:

<!-- OpenCode 設計為與 Claude Code 和 Roo Code 並行工作： -->

### Shared Context

<!-- 共享上下文 -->

All three tools read the same:

<!-- 所有三個工具都讀取相同的： -->

- `AI.md` - Project configuration
  <!-- 專案配置 -->
- `.ai/context/` - Shared conventions
  <!-- 共享規範 -->
- `docs/architecture/ADR/` - Architecture decisions
  <!-- 架構決策 -->

### Complementary Strengths

<!-- 互補優勢 -->

- **OpenCode**: Quick CLI access, no token setup, git-tracked settings
  <!-- OpenCode：快速 CLI 存取、無 token 設定、git 追蹤設定 -->
- **Claude Code**: Extended thinking, personal memory, VSCode integration
  <!-- Claude Code：延伸思考、個人記憶、VSCode 整合 -->
- **Roo Code**: Built-in thinking, custom instructions, VSCode integration
  <!-- Roo Code：內建思考、自訂指令、VSCode 整合 -->

---

## Troubleshooting

<!-- 疑難排解 -->

### OpenCode doesn't read my configuration

<!-- OpenCode 不讀取我的配置 -->

1. Check that `.opencode/CONFIG.md` exists
   <!-- 檢查 .opencode/CONFIG.md 是否存在 -->
2. Verify file is valid markdown
   <!-- 驗證檔案是有效的 markdown -->
3. Ensure you're in the project directory
   <!-- 確保你在專案目錄中 -->

### OpenCode asks for the same information repeatedly

<!-- OpenCode 重複詢問相同資訊 -->

This is normal behavior - OpenCode uses session-based memory, not persistent memory like Claude Code.

<!-- 這是正常行為 - OpenCode 使用基於會話的記憶，不像 Claude Code 的持久記憶。 -->

---

## Questions?

<!-- 有問題？ -->

- **Setup issues**: Check this guide and [`AI_TOOLS_COMPATIBILITY.md`](../AI_TOOLS_COMPATIBILITY.md)
  <!-- 設定問題：檢查本指南和 AI_TOOLS_COMPATIBILITY.md -->
- **Configuration**: Edit [`.opencode/CONFIG.md`](./CONFIG.md)
  <!-- 配置：編輯 .opencode/CONFIG.md -->
- **Collaboration**: See shared context in [`.ai/context/`](../.ai/context/)
  <!-- 協作：參考 .ai/context/ 中的共享上下文 -->

---

**Last Updated**: 2026-02-11

<!-- 最後更新：2026-02-11 -->
