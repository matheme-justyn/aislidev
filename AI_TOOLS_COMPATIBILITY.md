# AI Tools Compatibility Guide

<!-- AI 工具相容性指南 -->

## Overview

<!-- 概述 -->

This project uses **OpenCode** as the **primary AI agentic architecture**. While optimized for OpenCode, the project configuration is designed to be accessible to other AI tools through standardized documentation patterns.

<!-- 本專案使用 **OpenCode** 作為**主要的 AI agentic 架構**。雖然針對 OpenCode 優化，專案配置設計為透過標準化文檔模式讓其他 AI 工具也能存取。 -->

---

## Supported AI Tools

<!-- 支援的 AI 工具 -->

### ✅ Primary Tool

<!-- 主要工具 -->

- **OpenCode** - Primary AI agentic architecture (fully supported)
  <!-- OpenCode - 主要的 AI agentic 架構（完全支援） -->

### 🔧 Compatible Tools

<!-- 相容工具 -->

Other AI tools can work with this project by reading the standardized documentation:

<!-- 其他 AI 工具可透過閱讀標準化文檔來使用本專案： -->

- **Claude Code** - See `.claude/README.md` for setup guidance
  <!-- Claude Code - 參考 .claude/README.md 了解設定指引 -->

- **Roo Code** - See `.roo/README.md` for setup guidance
  <!-- Roo Code - 參考 .roo/README.md 了解設定指引 -->

### 🎯 Strategy

<!-- 策略 -->

**OpenCode-First Approach**:

<!-- OpenCode 優先方式： -->

1. **Primary documentation** is optimized for OpenCode (`AGENTS.md`)
   <!-- 主要文檔針對 OpenCode 優化（AGENTS.md） -->

2. **Shared context** uses standard formats readable by any AI tool (`.ai/context/`)
   <!-- 共享上下文使用任何 AI 工具都能讀取的標準格式（.ai/context/） -->

3. **Tool-specific redirects** help other tools find the right configuration (`.claude/`, `.roo/`)
   <!-- 工具特定重定向幫助其他工具找到正確的配置（.claude/、.roo/） -->

4. **ADRs and standards** (Conventional Commits, Semantic Versioning) are tool-agnostic
   <!-- ADR 和標準（Conventional Commits、Semantic Versioning）是工具無關的 -->

---

## Directory Structure

<!-- 目錄結構 -->

```
aislidev/
├── AGENTS.md                       # Main OpenCode configuration
│                                   # 主要 OpenCode 配置
├── AI_TOOLS_COMPATIBILITY.md       # This file
│                                   # 本檔案
├── .ai/                            # Shared AI configuration
│   │                               # 共享 AI 配置
│   ├── context/                    # Shared context for all AI tools
│   │   │                           # 所有 AI 工具的共享上下文
│   │   ├── ARCHITECTURE.md         # Architecture overview
│   │   │                           # 架構概述
│   │   ├── CONVENTIONS.md          # Coding conventions
│   │   │                           # 編碼規範
│   │   └── WORKFLOWS.md            # Development workflows
│   │                               # 開發工作流程
│   └── memory/                     # Shared memory templates
│       │                           # 共享 memory 範本
│       └── MEMORY_TEMPLATE.md      # Template for AI memory setup
│                                   # AI memory 設定範本
├── .claude/                        # Claude Code compatibility
│   │                               # Claude Code 相容性
│   └── README.md                   # Redirect to AGENTS.md
│                                   # 重定向到 AGENTS.md
├── .roo/                           # Roo Code compatibility
│   │                               # Roo Code 相容性
│   └── README.md                   # Redirect to AGENTS.md
│                                   # 重定向到 AGENTS.md
└── docs/                           # Shared documentation
    │                               # 共享文檔
    ├── architecture/ADR/           # Architecture Decision Records
    └── guides/                     # User guides
```

---

## Configuration Philosophy

<!-- 配置理念 -->

### 1. Core Principle: OpenCode-First with Compatibility

<!-- 核心原則：OpenCode 優先兼具相容性 -->

```

┌─────────────────────────────────────────────────────┐
│ Primary Configuration │
│ OpenCode-optimized (AGENTS.md) │
│ OpenCode 優化（AGENTS.md） │
├─────────────────────────────────────────────────────┤
│ Shared Context (.ai/context/, ADRs) │
│ 共享上下文（.ai/context/、ADRs） │
└─────────────────────────────────────────────────────┘
↓ ↓ ↓
┌───────────────────────────────────┐
↓ ↓
┌───────────────┐ ┌───────────────┐
│ Claude Code │ │ Roo Code │
│ Compatibility│ │ Compatibility│
│ (.claude/) │ │ (.roo/) │
└───────────────┘ └───────────────┘
README.md → README.md →
redirects to redirects to
AGENTS.md AGENTS.md

```

### 2. Configuration Priority

<!-- 配置優先級 -->

When AI tools read configurations, they follow this priority:

<!-- 當 AI 工具讀取配置時，遵循此優先級： -->

```

Higher Priority ↑
├─ AGENTS.md (Primary configuration)
│ AGENTS.md（主要配置）
├─ Shared AI context (.ai/context/)
│ 共享 AI 上下文
├─ Architecture Decision Records (docs/architecture/ADR/)
│ 架構決策記錄
└─ Tool-specific redirects (.claude/README.md, .roo/README.md)
工具特定重定向
Lower Priority ↓

```

---

## Quick Start Guide

<!-- 快速開始指南 -->

### For OpenCode Users (Primary)

<!-- OpenCode 使用者（主要） -->

#### 1. Initialize OpenCode

<!-- 1. 初始化 OpenCode -->

```bash
cd /path/to/aislidev
opencode
/init
```

OpenCode will automatically read `AGENTS.md` and understand the project configuration.

<!-- OpenCode 會自動讀取 AGENTS.md 並理解專案配置。 -->

#### 2. Start Working

<!-- 2. 開始工作 -->

OpenCode automatically reads:

<!-- OpenCode 自動讀取： -->

- `AGENTS.md` (main configuration)
- `.ai/context/*` (shared context: ARCHITECTURE.md, CONVENTIONS.md, WORKFLOWS.md)
- `docs/architecture/ADR/*` (architecture decisions)

---

### For Claude Code Users

<!-- Claude Code 使用者 -->

#### 1. Read Configuration Guide

<!-- 1. 閱讀配置指南 -->

Start by reading [`.claude/README.md`](./.claude/README.md) - this will guide you to the main configuration.

<!-- 首先閱讀 .claude/README.md - 這會引導你到主要配置。 -->

#### 2. Follow the Instructions

<!-- 2. 遵循指示 -->

The README will direct you to:

<!-- README 會引導你到： -->

- Read `AGENTS.md` (main configuration)
- Read `.ai/context/*` (shared context)
- Read `docs/architecture/ADR/*` (architecture decisions)

---

### For Roo Code Users

<!-- Roo Code 使用者 -->

#### 1. Read Configuration Guide

<!-- 1. 閱讀配置指南 -->

Start by reading [`.roo/README.md`](./.roo/README.md) - this will guide you to the main configuration.

<!-- 首先閱讀 .roo/README.md - 這會引導你到主要配置。 -->

#### 2. Follow the Instructions

<!-- 2. 遵循指示 -->

The README will direct you to:

<!-- README 會引導你到： -->

- Read `AGENTS.md` (main configuration)
- Read `.ai/context/*` (shared context)
- Read `docs/architecture/ADR/*` (architecture decisions)

---

## Key Differences Between Tools

<!-- 工具間的主要差異 -->

| Feature           | OpenCode                | Claude Code                       | Roo Code                           |
| ----------------- | ----------------------- | --------------------------------- | ---------------------------------- |
| **Entry Point**   | `AGENTS.md` (auto-read) | `.claude/README.md` → `AGENTS.md` | `.roo/README.md` → `AGENTS.md`     |
| **Memory/Config** | Git-tracked `AGENTS.md` | External file (`~/.claude/`)      | Custom Instructions (settings)     |
| **Persistence**   | Git repository          | Per-project directory             | Per-workspace or global            |
| **Setup Method**  | Run `/init` in project  | Manual setup + memory             | Manual setup + custom instructions |
| **Agent System**  | Built-in subagents      | Custom agents (`.claude/agents/`) | Custom modes (`.roo/modes/`)       |
| **Skills**        | Native skills system    | `.claude/skills/`                 | `.roo/skills/`                     |

<!-- 功能 | OpenCode | Claude Code | Roo Code -->
<!-- 入口點 | AGENTS.md（自動讀取） | .claude/README.md → AGENTS.md | .roo/README.md → AGENTS.md -->
<!-- Memory/配置 | Git 追蹤的 AGENTS.md | 外部檔案 | 自訂指令 -->
<!-- 持久性 | Git 儲存庫 | 每個專案目錄 | 每個工作區或全域 -->
<!-- 設定方法 | 在專案中執行 /init | 手動設定 + memory | 手動設定 + 自訂指令 -->
<!-- Agent 系統 | 內建 subagent | 自訂 agent | 自訂 mode -->
<!-- Skills | 原生 skills 系統 | .claude/skills/ | .roo/skills/ -->

---

## Why OpenCode-First?

<!-- 為什麼 OpenCode 優先？ -->

This decision is documented in [ADR-003: OpenCode-First AI Architecture](./docs/architecture/ADR/003-opencode-first-architecture.md).

<!-- 此決策記錄在 ADR-003：OpenCode 優先的 AI 架構。 -->

**Key reasons**:

<!-- 主要原因： -->

1. **Simplicity**: Single, git-tracked configuration file
   <!-- 簡單性：單一、git 追蹤的配置檔案 -->

2. **Consistency**: All team members use the same configuration
   <!-- 一致性：所有團隊成員使用相同的配置 -->

3. **Version control**: Configuration changes are tracked in git
   <!-- 版本控制：配置變更在 git 中追蹤 -->

4. **Native agent system**: Built-in subagents and skills
   <!-- 原生 agent 系統：內建 subagent 和 skills -->

5. **Terminal-first workflow**: Aligns with development practices
   <!-- 終端優先工作流程：符合開發實踐 -->

Other AI tools remain accessible through shared documentation standards.

<!-- 其他 AI 工具仍可透過共享的文檔標準存取。 -->

---

## Summary

<!-- 總結 -->

**For OpenCode users**: Just run `/init` and start working. Everything is configured automatically.

<!-- OpenCode 使用者：只需執行 /init 並開始工作。一切都會自動配置。 -->

**For Claude Code/Roo Code users**: Read the redirect files in `.claude/README.md` or `.roo/README.md` to understand how to work with this project.

<!-- Claude Code/Roo Code 使用者：閱讀 .claude/README.md 或 .roo/README.md 中的重定向檔案以了解如何使用本專案。 -->

**All guidelines in `AGENTS.md` apply to all AI tools**. The project follows standard practices (Semantic Versioning, Conventional Commits, ADRs) that work across any AI assistant.

<!-- AGENTS.md 中的所有指引適用於所有 AI 工具。專案遵循標準實踐（Semantic Versioning、Conventional Commits、ADRs），適用於任何 AI 助手。 -->

---

**Last Updated**: 2026-02-11

<!-- 最後更新：2026-02-11 -->

```

```
