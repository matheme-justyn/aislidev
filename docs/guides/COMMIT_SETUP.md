# Commit Message Tools Setup Guide
<!-- Commit Message 工具設定指南 -->

> **Status**: Reference Material - Optional Tooling
> <!-- 狀態：參考資料 - 可選工具 -->
>
> **When to use**: After technology stack is finalized (Phase 2)
> <!-- 何時使用：技術棧確定後（Phase 2） -->
>
> **Current approach**: Manual enforcement of Conventional Commits format
> <!-- 目前方式：手動強制執行 Conventional Commits 格式 -->

## Overview
<!-- 概述 -->

This guide provides **optional** tooling options to enforce conventional commit messages and automate version management. These tools should be evaluated and selected **after the technology stack is finalized** in Phase 2.
<!-- 本指南提供**可選的**工具選項來強制執行慣例式提交訊息和自動化版本管理。這些工具應該在 Phase 2 **技術棧確定後**再評估和選擇。 -->

**Do not install these tools yet** unless you're experimenting or have specific needs.
<!-- **暫時不要安裝這些工具**，除非你正在實驗或有特定需求。 -->

---

## Option 1: Commitizen (Python-based, Recommended)
<!-- 選項 1：Commitizen（基於 Python，推薦） -->

Commitizen provides an interactive CLI to create compliant commit messages and automate version bumping.
<!-- Commitizen 提供互動式 CLI 來建立符合規範的提交訊息並自動化版本更新。 -->

### Installation
<!-- 安裝 -->

```bash
# Install globally using pipx (recommended)
pipx install commitizen

# Or using pip
pip install commitizen

# Or using homebrew (macOS)
brew install commitizen
```

### Configuration
<!-- 配置 -->

The project already includes `.cz.toml` configuration file.
<!-- 專案已包含 `.cz.toml` 配置檔案。 -->

### Usage
<!-- 使用方式 -->

Instead of `git commit`, use:
<!-- 不要使用 `git commit`，改用： -->

```bash
# Stage your changes
git add .

# Use commitizen to create commit
cz commit
# or shorter version
cz c
```

**Interactive prompts will guide you**:
<!-- 互動式提示會引導你： -->

1. Select type (feat, fix, docs, etc.)
<!-- 選擇類型（feat、fix、docs 等） -->

2. Enter scope (optional)
<!-- 輸入 scope（選填） -->

3. Write short description
<!-- 寫簡短描述 -->

4. Write longer description (optional)
<!-- 寫更長的描述（選填） -->

5. Indicate breaking changes (if any)
<!-- 指出破壞性變更（如果有） -->

**Example session**:
<!-- 範例會話： -->

```
? Select the type of change you are committing feat
? What is the scope of this change? (press [enter] to skip) editor
? Write a short and imperative summary of the code changes: add Monaco editor integration
? Provide additional contextual information about the code changes: (press [enter] to skip)

Integrated Monaco editor for markdown editing with syntax highlighting.

? Is this a BREAKING CHANGE? Commits with BREAKING CHANGE will trigger a major version bump. (y/N) N
```

### Version Bumping
<!-- 版本更新 -->

```bash
# Automatically bump version based on commits
cz bump

# This will:
# 1. Analyze commits since last tag
# 2. Determine version bump (MAJOR/MINOR/PATCH)
# 3. Update version in configured files
# 4. Update CHANGELOG.md
# 5. Create git tag
```

---

## Option 2: Node.js Commitizen (If using Node.js stack)
<!-- 選項 2：Node.js Commitizen（如果使用 Node.js 技術棧） -->

If you decide to use JavaScript/TypeScript for v2:
<!-- 如果你決定在 v2 中使用 JavaScript/TypeScript： -->

### Installation
<!-- 安裝 -->

```bash
npm install -g commitizen cz-conventional-changelog

# Or use npx (no global install needed)
npx cz
```

### Configuration
<!-- 配置 -->

Add to `package.json`:
<!-- 添加到 package.json： -->

```json
{
  "config": {
    "commitizen": {
      "path": "cz-conventional-changelog"
    }
  }
}
```

### Usage
<!-- 使用方式 -->

```bash
git add .
npx cz
# or if installed globally
git cz
```

---

## Pre-commit Hooks Setup
<!-- Pre-commit Hooks 設定 -->

Pre-commit hooks validate your commit messages BEFORE the commit is created.
<!-- Pre-commit hooks 在提交建立**之前**驗證你的提交訊息。 -->

### Using pre-commit framework (Recommended)
<!-- 使用 pre-commit framework（推薦） -->

The `pre-commit` framework is language-agnostic and works with any project.
<!-- pre-commit framework 語言無關，適用於任何專案。 -->

#### Installation
<!-- 安裝 -->

```bash
# Using pipx (recommended)
pipx install pre-commit

# Using pip
pip install pre-commit

# Using homebrew
brew install pre-commit
```

#### Configuration
<!-- 配置 -->

The project includes `.pre-commit-config.yaml`. To activate:
<!-- 專案包含 `.pre-commit-config.yaml`。要啟用它： -->

```bash
# Install git hooks
pre-commit install --hook-type commit-msg

# Test it
pre-commit run --hook-stage commit-msg --commit-msg-filename .git/COMMIT_EDITMSG
```

#### How it works
<!-- 運作方式 -->

When you run `git commit`:
<!-- 當你執行 `git commit` 時： -->

1. Git pauses before creating the commit
<!-- Git 在建立提交前暫停 -->

2. Pre-commit hook runs commitizen validation
<!-- Pre-commit hook 執行 commitizen 驗證 -->

3. If message is invalid, commit is rejected with error message
<!-- 如果訊息無效，提交被拒絕並顯示錯誤訊息 -->

4. You fix the message and try again
<!-- 你修正訊息後再試一次 -->

**Example of failed commit**:
<!-- 失敗提交的範例： -->

```bash
$ git commit -m "added new feature"

commitizen check.........................................................Failed
- hook id: commitizen
- duration: 0.11s
- exit code: 1

commit validation: failed!
please enter a commit message in the commitizen format.
```

---

## Recommended Workflow
<!-- 建議的工作流程 -->

### For manual control
<!-- 手動控制 -->

1. Install commitizen (Python version)
<!-- 安裝 commitizen（Python 版本） -->

2. Install pre-commit framework
<!-- 安裝 pre-commit framework -->

3. Use `cz commit` for all commits
<!-- 所有提交都使用 `cz commit` -->

4. Pre-commit hooks provide safety net if you forget
<!-- Pre-commit hooks 提供安全網，以防忘記 -->

### For automation
<!-- 自動化 -->

1. Use `cz bump` to automatically version and update CHANGELOG
<!-- 使用 `cz bump` 自動更新版本和 CHANGELOG -->

2. Push tags to trigger CI/CD (when implemented)
<!-- 推送 tags 來觸發 CI/CD（實作後） -->

---

## Troubleshooting
<!-- 疑難排解 -->

### commitizen command not found
<!-- 找不到 commitizen 指令 -->

Make sure commitizen is in your PATH:
<!-- 確保 commitizen 在你的 PATH 中： -->

```bash
# Check installation
which cz

# If using pipx, ensure pipx bin is in PATH
pipx ensurepath
```

### Pre-commit hook not running
<!-- Pre-commit hook 沒有執行 -->

```bash
# Reinstall hooks
pre-commit uninstall
pre-commit install --hook-type commit-msg

# Check .git/hooks/commit-msg exists
ls -la .git/hooks/
```

### Skip hooks temporarily (not recommended)
<!-- 暫時跳過 hooks（不推薦） -->

```bash
# Only use in emergencies
git commit --no-verify -m "emergency fix"
```

---

## Quick Reference
<!-- 快速參考 -->

```bash
# Create commit with commitizen
cz commit

# Bump version automatically
cz bump

# Install pre-commit hooks
pre-commit install --hook-type commit-msg

# Run pre-commit manually
pre-commit run --hook-stage commit-msg

# Check current version
cz version
```

---

## See Also
<!-- 另見 -->

- [Commitizen Documentation](https://commitizen-tools.github.io/commitizen/)
- [Pre-commit Documentation](https://pre-commit.com/)
- [Conventional Commits Specification](https://www.conventionalcommits.org/)
- [ADR-001: Version Control Strategy](../../architecture/ADR/001-version-control-strategy.md)
- [CLAUDE.md: Version Control Section](../../CLAUDE.md#version-control-and-releases)
