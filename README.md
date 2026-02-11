# AISliDev

> AI-powered Slidev presentation platform
> AI 驅動的 Slidev 簡報平台

[![Version](https://img.shields.io/badge/version-0.0.1-blue.svg)](./CHANGELOG.md)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)
[![AI-First](https://img.shields.io/badge/development-AI--First-purple.svg)](./CLAUDE.md)

---

## 📋 專案狀態 | Project Status

**當前版本 | Current Version**: `0.0.1` - 框架建立階段 | Framework Setup Phase

🚧 **正在進行 | In Progress**: v2 架構重新設計 | v2 Architecture Redesign

本專案採用**文檔驅動、AI 優先**的開發方式，目前處於架構設計階段。
This project follows a **documentation-driven, AI-first** development approach and is currently in the architecture design phase.

### 版本說明 | Version Notes

- **v0.0.x**: 開發基礎設施建立（文檔、工具、規範）
  - Development infrastructure setup (documentation, tooling, standards)
- **v0.1.x**: Alpha - 核心功能開發
  - Alpha - Core feature development
- **v0.2.x**: Beta - 功能完善與測試
  - Beta - Feature refinement and testing
- **v1.0.0**: 第一個穩定版本
  - First stable release

---

## 🎯 專案目標 | Project Goals

AISliDev 旨在打造一個智能化的 Slidev 簡報平台，讓使用者能夠：
AISliDev aims to create an intelligent Slidev presentation platform that enables users to:

- 📝 使用 AI 輔助建立和編輯簡報內容
  - Create and edit presentation content with AI assistance
- 🎨 智能化的版面設計和樣式建議
  - Intelligent layout design and style suggestions
- 🔄 即時預覽和協作編輯
  - Real-time preview and collaborative editing
- 🚀 簡化的部署和分享流程
  - Simplified deployment and sharing workflow

### v1 經驗教訓 | Lessons from v1

第一版採用前後端分離 + 容器化架構，因以下問題已廢棄：
The first version used frontend/backend separation with containerization, archived due to:

- ❌ Slidev iframe 整合問題 | Slidev iframe integration issues
- ❌ 過度工程化的架構 | Over-engineered architecture
- ❌ 複雜的部署流程 | Complex deployment process
- ❌ 除錯困難 | Difficult debugging

詳見 [`ARCHIVE_v1_design.md`](./ARCHIVE_v1_design.md)
See [`ARCHIVE_v1_design.md`](./ARCHIVE_v1_design.md) for details

---

## ✨ 特色 | Features

### AI-First Development

本專案針對 **Claude Code** 優化，採用現代化的 AI 協作開發方式：
This project is optimized for **Claude Code** with modern AI-collaborative development:

- 🤖 完整的 Claude Code 整合（agents、skills、memory）
  - Full Claude Code integration (agents, skills, memory)
- 📚 Architecture Decision Records (ADR) 記錄所有重要決策
  - ADR documenting all significant decisions
- 🔄 Conventional Commits + Semantic Versioning
  - Automated version management
- 📝 雙語文檔（英文 + 繁中註解）
  - Bilingual documentation (English + Traditional Chinese)

### Development Infrastructure

- ✅ Conventional Commits - 標準化的 commit 訊息格式
  - Standardized commit message format
- ✅ Semantic Versioning - 語義化版本控制
  - Semantic versioning strategy
- ✅ 完整的版本控制策略（ADR-001）
  - Comprehensive version control strategy (ADR-001)
- ✅ 文檔驅動開發流程
  - Documentation-driven development workflow
- 📋 Tooling - 延後到技術棧選定後決定
  - Deferred until tech stack is finalized

---

## 🚀 快速開始 | Quick Start

### 給協作者 | For Collaborators

1. **閱讀專案配置 | Read Project Configuration**
   ```bash
   # 必讀：Claude Code 專案設定
   # Must read: Claude Code project configuration
   cat CLAUDE.md
   ```

2. **設定開發環境 | Setup Development Environment**

   詳見 [`.claude/MEMORY_GUIDE.md`](./.claude/MEMORY_GUIDE.md) 了解必要的環境設定
   See [`.claude/MEMORY_GUIDE.md`](./.claude/MEMORY_GUIDE.md) for required environment setup

   必須啟用 | Must enable:
   - ✅ Extended Thinking（延伸思考模式）
   - ✅ Inline Diff View（逐一檢視變更）
   - ✅ Preferred Location: Sidebar
   - ✅ Terminal Multi-line Input (`/terminal-setup`)

   絕對不要啟用 | Must NOT enable:
   - ❌ Auto-accept edits

3. **理解 Commit 規範 | Understand Commit Conventions**

   本專案使用 **Conventional Commits** 格式
   This project uses **Conventional Commits** format

   詳見 [CLAUDE.md - Commit Message Format](./CLAUDE.md#commit-message-format)
   See [CLAUDE.md - Commit Message Format](./CLAUDE.md#commit-message-format) for details

   **可選工具 | Optional Tools** (技術棧確定後再安裝 | Install after tech stack is finalized):

   參考 [`docs/guides/COMMIT_SETUP.md`](./docs/guides/COMMIT_SETUP.md) 了解可用的輔助工具
   See [`docs/guides/COMMIT_SETUP.md`](./docs/guides/COMMIT_SETUP.md) for available tooling options

4. **了解架構決策 | Understand Architecture Decisions**

   所有重要決策都記錄在 ADR 中：
   All significant decisions are documented in ADRs:

   - 📖 [ADR 索引 | ADR Index](./docs/architecture/ADR/README.md)
   - 📄 [ADR-001: 版本控制策略](./docs/architecture/ADR/001-version-control-strategy.md)

---

## 📚 文檔索引 | Documentation Index

### 核心文檔 | Core Documentation

| 文檔 | 說明 | Description |
|------|------|-------------|
| [`CLAUDE.md`](./CLAUDE.md) | Claude Code 專案配置 | Claude Code project configuration |
| [`CHANGELOG.md`](./CHANGELOG.md) | 版本變更記錄 | Version changelog |
| [`ARCHIVE_v1_design.md`](./ARCHIVE_v1_design.md) | v1 設計文檔（已廢棄） | v1 design docs (archived) |

### Claude Code 整合 | Claude Code Integration

| 文檔 | 說明 | Description |
|------|------|-------------|
| [`.claude/MEMORY_GUIDE.md`](./.claude/MEMORY_GUIDE.md) | Memory 系統使用指南 | Memory system guide |
| [`.claude/agents/`](./.claude/agents/) | 自訂 AI agents | Custom AI agents |
| [`.claude/skills/`](./.claude/skills/) | 可重複使用的工作流程 | Reusable workflows |

### 架構文檔 | Architecture Documentation

| 文檔 | 說明 | Description |
|------|------|-------------|
| [`docs/architecture/ADR/`](./docs/architecture/ADR/) | 架構決策記錄 | Architecture Decision Records |
| [`docs/guides/COMMIT_SETUP.md`](./docs/guides/COMMIT_SETUP.md) | Commit 工具設定指南 | Commit tools setup guide |

---

## 🔧 開發工作流程 | Development Workflow

### 提交變更 | Making Commits

**必須遵循 Conventional Commits 格式**：
**Must follow Conventional Commits format**:

```bash
git commit -m "feat(scope): add new feature"
git commit -m "fix(scope): resolve bug"
git commit -m "docs: update documentation"
```

詳見 [CLAUDE.md - Version Control](./CLAUDE.md#version-control-and-releases)
See [CLAUDE.md - Version Control](./CLAUDE.md#version-control-and-releases) for details

### 分支命名 | Branch Naming

```bash
feature/description   # 新功能 | New features
fix/description       # 錯誤修復 | Bug fixes
docs/description      # 文檔更新 | Documentation
refactor/description  # 程式碼重構 | Code refactoring
```

### 版本發布 | Version Releases

目前採用手動發布流程：
Currently using manual release process:

```bash
# 1. 更新 CHANGELOG.md
# 2. 更新版本號（.cz.toml 等）
# 3. 建立 git tag
git tag -a v0.0.2 -m "Release v0.0.2"
# 4. 推送 tag
git push origin v0.0.2
```

**未來自動化**：v2 技術棧確定後將選擇適當的自動化工具
**Future automation**: Will select appropriate tools after v2 tech stack is finalized

---

## 🗺️ 專案路線圖 | Project Roadmap

### Phase 1: 基礎建設 ✅ (v0.0.1)
- [x] 專案架構設定
- [x] Claude Code 整合
- [x] ADR 系統建立
- [x] 版本控制策略
- [x] 開發工具設定

### Phase 2: 架構設計 🚧 (v0.0.x)
- [ ] v2 技術棧選擇
- [ ] 核心架構設計
- [ ] Slidev 整合方案
- [ ] API 設計

### Phase 3: 核心開發 📅 (v0.1.x - Alpha)
- [ ] 編輯器實作
- [ ] Slidev 預覽整合
- [ ] 基礎 AI 功能
- [ ] 資料儲存

### Phase 4: 功能完善 📅 (v0.2.x - Beta)
- [ ] 進階 AI 功能
- [ ] 使用者介面優化
- [ ] 測試與除錯
- [ ] 效能優化

### Phase 5: 正式發布 📅 (v1.0.0)
- [ ] 文檔完善
- [ ] 部署方案
- [ ] 安全性審查
- [ ] 第一個穩定版本

---

## 🤝 貢獻指南 | Contributing

### 開始之前 | Before You Start

1. 閱讀 [`CLAUDE.md`](./CLAUDE.md) 了解專案配置
   - Read [`CLAUDE.md`](./CLAUDE.md) for project configuration
2. 閱讀 [`.claude/MEMORY_GUIDE.md`](./.claude/MEMORY_GUIDE.md) 設定開發環境
   - Read [`.claude/MEMORY_GUIDE.md`](./.claude/MEMORY_GUIDE.md) for environment setup
3. 查看 [`docs/architecture/ADR/`](./docs/architecture/ADR/) 了解現有決策
   - Review [`docs/architecture/ADR/`](./docs/architecture/ADR/) for existing decisions

### 提交 PR | Submitting PRs

1. 使用 Conventional Commits 格式
   - Use Conventional Commits format
2. 確保通過 pre-commit hooks 檢查
   - Ensure pre-commit hooks pass
3. 重大變更需先建立 ADR
   - Create ADR for significant changes
4. 更新 CHANGELOG.md
   - Update CHANGELOG.md

---

## 📄 授權 | License

MIT License - 詳見 [`LICENSE`](./LICENSE) 檔案
MIT License - See [`LICENSE`](./LICENSE) file

---

## 🔗 相關連結 | Links

- 📖 [Slidev Documentation](https://sli.dev/)
- 🤖 [Claude Code](https://www.anthropic.com/claude)
- 📝 [Conventional Commits](https://www.conventionalcommits.org/)
- 🏗️ [Architecture Decision Records](https://adr.github.io/)
- 🔖 [Semantic Versioning](https://semver.org/)

---

**Built with ❤️ using AI-First Development**
