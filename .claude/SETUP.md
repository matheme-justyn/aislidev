# Claude Code Setup Guide
<!-- Claude Code 設定指南 -->

## Purpose
<!-- 目的 -->

This guide helps you set up Claude Code for working on the AISliDev project.
<!-- 本指南幫助你設定 Claude Code 以在 AISliDev 專案上工作。 -->

---

## Prerequisites
<!-- 前置需求 -->

- VSCode installed
  <!-- 已安裝 VSCode -->
  
- Claude Code extension installed from VSCode marketplace
  <!-- 已從 VSCode marketplace 安裝 Claude Code 擴充功能 -->

---

## Setup Steps
<!-- 設定步驟 -->

### 1. Read Main Configuration
<!-- 1. 閱讀主要配置 -->

Start by reading [`AI.md`](../AI.md) in the project root. This is the tool-agnostic AI configuration that both Claude Code and Roo Code users follow.
<!-- 首先閱讀專案根目錄的 AI.md。這是 Claude Code 和 Roo Code 使用者都遵循的工具無關 AI 配置。 -->

Claude Code will automatically read this file when working on the project.
<!-- Claude Code 在專案工作時會自動讀取此檔案。 -->

### 2. Configure VSCode Settings
<!-- 2. 配置 VSCode 設定 -->

#### A. Set Preferred Location to Sidebar
<!-- A. 將偏好位置設為側邊欄 -->

1. Open VSCode Settings (`Cmd+,` on macOS, `Ctrl+,` on Windows/Linux)
   <!-- 開啟 VSCode 設定 -->

2. Search for `claudeCode.preferredLocation`
   <!-- 搜尋 claudeCode.preferredLocation -->

3. Set to `sidebar`
   <!-- 設為 sidebar -->

**Why**: This shows Claude Code in the same panel as other chat tools, making it easier to switch.
<!-- 為什麼：這將 Claude Code 顯示在與其他聊天工具相同的面板中，更容易切換。 -->

#### B. DO NOT Enable Auto-Accept
<!-- B. 不要啟用自動接受 -->

⚠️ **IMPORTANT**: Do NOT enable `claudeCode.autoAcceptEdits`
<!-- 重要：不要啟用 claudeCode.autoAcceptEdits -->

**Why**: You must review every change to ensure quality and correctness.
<!-- 為什麼：你必須檢閱每個變更以確保品質和正確性。 -->

### 3. Enable Extended Thinking (Recommended)
<!-- 3. 啟用 Extended Thinking（推薦） -->

Extended Thinking shows Claude's reasoning process before handling complex logic.
<!-- Extended Thinking 在處理複雜邏輯前展示 Claude 的推理過程。 -->

**How to enable**:
<!-- 如何啟用： -->

- Click the thinking icon (🧠) in the input box
  <!-- 點擊輸入框中的思考圖示 -->
  
- Or type `/` and select "Extended Thinking"
  <!-- 或輸入 `/` 並選擇「Extended Thinking」 -->

**When to use**:
<!-- 何時使用： -->

- Debugging complex issues
  <!-- 除錯複雜問題 -->
  
- Architecting new features
  <!-- 架構新功能 -->
  
- Analyzing architectural decisions
  <!-- 分析架構決策 -->

### 4. Setup Terminal Multi-line Input (One-time)
<!-- 4. 設定終端機多行輸入（一次性） -->

Run `/terminal-setup` once in any Claude Code session.
<!-- 在任何 Claude Code 會話中執行一次 `/terminal-setup`。 -->

**What it does**: Automatically configures `Shift+Enter` for multi-line input.
<!-- 功能：自動配置 Shift+Enter 進行多行輸入。 -->

**You only need to do this once** - it persists across sessions.
<!-- 你只需要做一次 - 它會跨會話保持。 -->

### 5. Setup Memory (Optional but Recommended)
<!-- 5. 設定 Memory（可選但推薦） -->

Claude Code uses a **local memory directory** to store project-specific preferences.
<!-- Claude Code 使用**本地記憶目錄**來儲存專案特定偏好。 -->

#### Find Your Memory Directory
<!-- 找到你的 Memory 目錄 -->

Memory is stored outside the git repository in:
<!-- Memory 儲存在 git 儲存庫外的位置： -->

```
~/.claude/projects/<project-path-hash>/memory/
```

**To find your exact path**:
<!-- 找到你的確切路徑： -->

1. Ask Claude Code: "Where is my memory directory for this project?"
   <!-- 詢問 Claude Code：「這個專案的 memory 目錄在哪裡？」 -->

2. Or check `~/.claude/projects/` and look for your project path
   <!-- 或檢查 ~/.claude/projects/ 並尋找你的專案路徑 -->

#### Create Memory File
<!-- 建立 Memory 檔案 -->

```bash
# Copy the template
cp .ai/memory/MEMORY_TEMPLATE.md ~/.claude/projects/<project-hash>/memory/MEMORY.md

# Edit to add your personal preferences
# Open in your editor and customize
```

**What to customize**:
<!-- 要自訂什麼： -->

- Your preferred communication style
  <!-- 你偏好的溝通風格 -->
  
- Language preference (Traditional Chinese for conversations)
  <!-- 語言偏好（對話用繁體中文） -->
  
- Your focus areas (frontend/backend/full-stack)
  <!-- 你的關注領域（前端/後端/全端） -->
  
- Personal reminders
  <!-- 個人提醒 -->

#### Memory vs Project Documentation
<!-- Memory vs 專案文檔 -->

| Aspect | Memory | Project Docs (AI.md, ADRs) |
|--------|--------|----------------------------|
| **Location** | `~/.claude/projects/` | Repository |
| **Scope** | Personal preferences | Team standards |
| **Git tracking** | Not tracked | Tracked in git |
| **Purpose** | Individual workflow | Project guidelines |

<!-- 方面 | Memory | 專案文檔（AI.md、ADRs） -->
<!-- 位置 | ~/.claude/projects/ | 儲存庫 -->
<!-- 範圍 | 個人偏好 | 團隊標準 -->
<!-- Git 追蹤 | 不追蹤 | 在 git 中追蹤 -->
<!-- 目的 | 個人工作流程 | 專案指南 -->

### 6. Review Permissions
<!-- 6. 檢閱權限 -->

Claude Code uses [`.claude/settings.local.json`](./settings.local.json) for permission whitelist.
<!-- Claude Code 使用 .claude/settings.local.json 作為權限白名單。 -->

**Current permissions** allow:
<!-- 當前權限允許： -->

- Git operations (add, commit, push, tag, reset, rm)
- npm/pnpm commands (install, dev, build)
- Node.js version checking
- Port checking (lsof, ps)
- curl for API testing
- GitHub CLI commands

You can add more permissions as needed by editing this file.
<!-- 你可以根據需要編輯此檔案新增更多權限。 -->

---

## Verification
<!-- 驗證 -->

To verify your setup is correct:
<!-- 驗證你的設定是否正確： -->

1. **Open Claude Code** in VSCode
   <!-- 在 VSCode 中開啟 Claude Code -->

2. **Ask**: "Please confirm you can read AI.md and understand the project setup"
   <!-- 詢問：「請確認你能讀取 AI.md 並理解專案設定」 -->

3. **Claude Code should**:
   - Confirm it has read AI.md
   - Understand the project is using Semantic Versioning
   - Know about ADRs (Architecture Decision Records)
   - Understand the Pre-Release stage (0.x.x)
   - Know to use Conventional Commits
   <!-- Claude Code 應該： -->
   <!-- 確認已讀取 AI.md -->
   <!-- 理解專案使用 Semantic Versioning -->
   <!-- 了解 ADR（架構決策記錄） -->
   <!-- 理解 Pre-Release 階段（0.x.x） -->
   <!-- 知道使用 Conventional Commits -->

---

## Usage Tips
<!-- 使用技巧 -->

### Best Practices
<!-- 最佳實踐 -->

1. **Always review diffs** before accepting changes
   - Use inline diff view
   - Accept/reject individually
   - Don't blindly accept all
   <!-- 總是在接受變更前檢閱差異 -->
   <!-- 使用內嵌差異檢視 -->
   <!-- 個別接受/拒絕 -->
   <!-- 不要盲目接受所有 -->

2. **Use Extended Thinking** for complex tasks
   - Enable when debugging
   - Enable when architecting
   - Disable for simple tasks to save time
   <!-- 對複雜任務使用 Extended Thinking -->
   <!-- 除錯時啟用 -->
   <!-- 架構時啟用 -->
   <!-- 簡單任務時停用以節省時間 -->

3. **Reference ADRs** when discussing architecture
   - Ask: "Check ADR-002 before suggesting architecture changes"
   - Claude will read ADRs and check for conflicts
   <!-- 討論架構時引用 ADR -->
   <!-- 詢問：「在建議架構變更前檢查 ADR-002」 -->
   <!-- Claude 會讀取 ADR 並檢查衝突 -->

4. **Let Claude follow workflows**
   - Claude knows to present commit plans before committing
   - Claude will check documentation maintenance rules
   - Trust the process defined in `.ai/context/WORKFLOWS.md`
   <!-- 讓 Claude 遵循工作流程 -->
   <!-- Claude 知道在提交前呈現提交計畫 -->
   <!-- Claude 會檢查文檔維護規則 -->
   <!-- 信任 .ai/context/WORKFLOWS.md 中定義的流程 -->

### Common Commands
<!-- 常用命令 -->

```
/terminal-setup          # Setup multi-line input (one-time)
/                        # Show command menu
[Enable thinking icon]   # Enable Extended Thinking
```

### Asking for Help
<!-- 尋求幫助 -->

- **ADR conflicts**: "Check if this conflicts with any ADRs"
  <!-- ADR 衝突：「檢查這是否與任何 ADR 衝突」 -->

- **Version analysis**: "Analyze these changes and suggest version bump"
  <!-- 版本分析：「分析這些變更並建議版本更新」 -->

- **Documentation**: "Do we need to update README.md for this change?"
  <!-- 文檔：「這個變更需要更新 README.md 嗎？」 -->

---

## Troubleshooting
<!-- 疑難排解 -->

### Claude Code doesn't see AI.md
<!-- Claude Code 看不到 AI.md -->

**Solution**: Ensure you're in the project root directory
<!-- 解決方案：確保你在專案根目錄 -->

```bash
# Check you're in the right directory
pwd
# Should show: .../aislidev

# List files to verify
ls -la AI.md
```

### Memory not working
<!-- Memory 無法運作 -->

**Solution**: Check memory directory exists
<!-- 解決方案：檢查 memory 目錄是否存在 -->

```bash
# Find your project hash
ls ~/.claude/projects/

# Check memory directory
ls ~/.claude/projects/<hash>/memory/

# If doesn't exist, create it
mkdir -p ~/.claude/projects/<hash>/memory/
cp .ai/memory/MEMORY_TEMPLATE.md ~/.claude/projects/<hash>/memory/MEMORY.md
```

### Can't run commands
<!-- 無法執行命令 -->

**Solution**: Check permissions in `.claude/settings.local.json`
<!-- 解決方案：檢查 .claude/settings.local.json 中的權限 -->

Add the command to the `allow` array:
<!-- 將命令新增到 allow 陣列： -->

```json
{
  "permissions": {
    "allow": [
      "Bash(your-command:*)"
    ]
  }
}
```

---

## Related Documentation
<!-- 相關文檔 -->

- [AI.md](../AI.md) - Main AI configuration (tool-agnostic)
  <!-- AI.md - 主要 AI 配置（工具無關） -->

- [MEMORY_GUIDE.md](./MEMORY_GUIDE.md) - Detailed memory system guide
  <!-- MEMORY_GUIDE.md - 詳細 memory 系統指南 -->

- [AI_TOOLS_COMPATIBILITY.md](../AI_TOOLS_COMPATIBILITY.md) - Multi-tool compatibility guide
  <!-- AI_TOOLS_COMPATIBILITY.md - 多工具相容性指南 -->

- [.ai/context/](../.ai/context/) - Shared AI context
  <!-- .ai/context/ - 共享 AI 上下文 -->

---

**Last Updated**: 2026-02-11
<!-- 最後更新：2026-02-11 -->
