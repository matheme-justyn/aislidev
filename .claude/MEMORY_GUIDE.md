# Claude Code Memory System Guide
<!-- Claude Code 記憶系統指南 -->

## Required Environment Setup
<!-- 必要的環境設定 -->

Before working on this project, configure your Claude Code environment with these settings:
<!-- 在開始此專案之前，請使用以下設定配置你的 Claude Code 環境： -->

### ✅ Must Enable
<!-- 必須啟用 -->

#### 1. Extended Thinking
<!-- 延伸思考 -->

Enable via `/` menu or the button in the bottom-right corner of the input box.
<!-- 透過 `/` 選單或輸入框右下角的按鈕啟用。 -->

- **Why**: Shows Claude's reasoning process before handling complex logic
<!-- 為什麼：在處理複雜邏輯前展示 Claude 的推理過程 -->

- **Especially useful for**: Debugging and architecture design
<!-- 特別適用於：除錯和架構設計 -->

- **How to enable**: Click the thinking icon (brain) in the input box, or type `/` and select "Extended Thinking"
<!-- 如何啟用：點擊輸入框中的思考圖示（大腦），或輸入 `/` 並選擇「Extended Thinking」 -->

#### 2. Inline Diff View
<!-- 內嵌差異檢視 -->

This is enabled by default. Make sure you use it properly.
<!-- 這是預設啟用的。確保你正確使用它。 -->

- **Important**: Review each change individually using accept/reject buttons
<!-- 重要：使用接受/拒絕按鈕逐一檢視每個變更 -->

- **Don't**: Blindly accept all changes without reviewing
<!-- 不要：不檢視就盲目接受所有變更 -->

- **Best practice**: Read the diff carefully, especially for architecture or business logic changes
<!-- 最佳實踐：仔細閱讀差異，特別是架構或業務邏輯的變更 -->

#### 3. Preferred Location: Sidebar
<!-- 偏好位置：側邊欄 -->

Set Claude Code to appear in the sidebar for better workflow.
<!-- 將 Claude Code 設定為顯示在側邊欄，以獲得更好的工作流程。 -->

- **How to set**:
<!-- 如何設定： -->
  1. Open VSCode Settings (Cmd+, on macOS, Ctrl+, on Windows/Linux)
  <!-- 開啟 VSCode 設定（macOS 上為 Cmd+,，Windows/Linux 上為 Ctrl+,） -->
  2. Search for `claudeCode.preferredLocation`
  <!-- 搜尋 `claudeCode.preferredLocation` -->
  3. Change to `sidebar`
  <!-- 改為 `sidebar` -->

- **Why**: Shows Claude Code in the same panel as Copilot Chat, making it easier to switch between tools
<!-- 為什麼：將 Claude Code 顯示在與 Copilot Chat 同側的面板，更容易在工具間切換 -->

#### 4. Terminal Multi-line Input
<!-- 終端機多行輸入 -->

Run `/terminal-setup` once in any Claude Code session.
<!-- 在任何 Claude Code 會話中執行一次 `/terminal-setup`。 -->

- **What it does**: Automatically configures `Shift+Enter` for multi-line input in the Claude Code input box
<!-- 功能：自動配置 `Shift+Enter` 在 Claude Code 輸入框中進行多行輸入 -->

- **Run once**: You only need to do this once; it persists across sessions
<!-- 只需執行一次：只需要做一次，設定會跨會話持久保存 -->

### ❌ Must NOT Enable
<!-- 絕對不要啟用 -->

#### Auto-accept Edits
<!-- 自動接受編輯 -->

**Do NOT enable** the auto-accept edits setting.
<!-- **不要啟用**自動接受編輯設定。 -->

- **Why**: You must review every change Claude makes to ensure quality and correctness
<!-- 為什麼：你必須檢視 Claude 做的每個變更，以確保品質和正確性 -->

- **Risk**: Auto-accepting can introduce bugs, breaking changes, or unwanted modifications
<!-- 風險：自動接受可能引入 bug、破壞性變更或不想要的修改 -->

- **Best practice**: Always use inline diff view to review and selectively accept changes
<!-- 最佳實踐：始終使用內嵌差異檢視來檢視並選擇性地接受變更 -->

---

## What is Memory?
<!-- 什麼是 Memory？ -->

Claude Code maintains a **local memory directory** for each project to store:
<!-- Claude Code 為每個專案維護一個**本地記憶目錄**來儲存： -->

- Project-specific preferences
<!-- 專案特定偏好 -->

- Learned patterns and conventions
<!-- 學習到的模式和慣例 -->

- User workflow preferences
<!-- 使用者工作流程偏好 -->

- Solutions to recurring problems
<!-- 重複問題的解決方案 -->

## Location
<!-- 位置 -->

Memory is stored **outside the git repository** in:
<!-- Memory 儲存在 git 儲存庫**之外**的位置： -->

```
~/.claude/projects/<project-path-hash>/memory/
```

**Important**: Memory is **personal** and **local**. It is not shared via git.
<!-- 重要：Memory 是**個人的**且**本地的**。它不會透過 git 分享。 -->

## Why This Matters for Collaboration
<!-- 為什麼這對協作很重要 -->

When working with this project, you may notice that Claude:
<!-- 在這個專案中工作時，你可能會注意到 Claude： -->

- Uses specific language (Traditional Chinese) in conversations
<!-- 在對話中使用特定語言（繁體中文） -->

- Follows certain coding patterns or preferences
<!-- 遵循某些程式碼模式或偏好 -->

- Remembers decisions made in previous sessions
<!-- 記住先前會話中做出的決策 -->

These behaviors come from **memory settings**, which each developer sets up individually.
<!-- 這些行為來自**記憶設定**，每個開發者都需要個別設定。 -->

## What's Stored in Memory for This Project
<!-- 此專案的 Memory 中儲存了什麼 -->

For the AISliDev project, the recommended memory includes:
<!-- 對於 AISliDev 專案，建議的記憶包括： -->

### Communication Preferences
<!-- 溝通偏好 -->

- **Conversation language**: Traditional Chinese (Taiwan)
<!-- 對話語言：繁體中文（台灣） -->

- **Documentation language**: English with Chinese comments (as per CLAUDE.md)
<!-- 文檔語言：英文加中文註解（依據 CLAUDE.md） -->

### Architecture Decisions
<!-- 架構決策 -->

- Lessons learned from v1 (see ARCHIVE_v1_design.md)
<!-- 從 v1 學到的教訓（見 ARCHIVE_v1_design.md） -->

- Preference for simplicity over complexity
<!-- 偏好簡單勝於複雜 -->

- Avoid over-engineering patterns
<!-- 避免過度工程化模式 -->

### Development Patterns
<!-- 開發模式 -->

- Documentation-driven development approach
<!-- 文檔驅動的開發方式 -->

- ADR (Architecture Decision Records) usage
<!-- ADR（架構決策記錄）的使用 -->

- Conventional commit message format
<!-- 慣例式提交訊息格式 -->

## How to Set Up Your Memory
<!-- 如何設定你的 Memory -->

1. Claude Code automatically creates a memory directory for each project
<!-- Claude Code 會自動為每個專案建立記憶目錄 -->

2. Create or edit `~/.claude/projects/<project-hash>/memory/MEMORY.md`
<!-- 建立或編輯 ~/.claude/projects/<project-hash>/memory/MEMORY.md -->

3. Add your preferences following the format in this guide
<!-- 根據本指南的格式添加你的偏好 -->

### Recommended Memory Content
<!-- 建議的 Memory 內容 -->

```markdown
# AISliDev Project Memory

## Communication Preferences
- Use Traditional Chinese (Taiwan) for all conversations
- Keep code comments and documentation in English with Chinese translations

## Architecture Principles
- Learned from v1: avoid over-engineering
- Prefer monolithic architecture over microservices for this use case
- Slidev integration should be native, not iframe-based

## Development Workflow
- Always read CLAUDE.md before starting
- Follow ADR pattern for significant decisions
- Use conventional commits
```

## Finding Your Memory Directory
<!-- 尋找你的 Memory 目錄 -->

If you're unsure where your memory is stored, you can:
<!-- 如果你不確定 memory 儲存在哪裡，可以： -->

1. Ask Claude Code: "Where is my memory directory for this project?"
<!-- 詢問 Claude Code：「這個專案的 memory 目錄在哪裡？」 -->

2. Check `~/.claude/projects/` for your project path
<!-- 檢查 ~/.claude/projects/ 中的專案路徑 -->

## Memory vs CLAUDE.md
<!-- Memory vs CLAUDE.md -->

| Aspect | Memory | CLAUDE.md |
|--------|--------|-----------|
| **Location** | `~/.claude/projects/` | Repository root |
| <!-- 位置 --> | <!-- ~/.claude/projects/ --> | <!-- 儲存庫根目錄 --> |
| **Scope** | Personal preferences | Team standards |
| <!-- 範圍 --> | <!-- 個人偏好 --> | <!-- 團隊標準 --> |
| **Git tracking** | Not tracked | Tracked in git |
| <!-- Git 追蹤 --> | <!-- 不追蹤 --> | <!-- 在 git 中追蹤 --> |
| **Purpose** | Individual workflow | Project guidelines |
| <!-- 目的 --> | <!-- 個人工作流程 --> | <!-- 專案指南 --> |

## Best Practices
<!-- 最佳實踐 -->

1. **Keep it concise**: MEMORY.md should be under 200 lines
<!-- 保持簡潔：MEMORY.md 應少於 200 行 -->

2. **Update when patterns change**: Remove outdated information
<!-- 模式改變時更新：移除過時資訊 -->

3. **Don't duplicate CLAUDE.md**: Memory is for personal preferences only
<!-- 不要重複 CLAUDE.md：Memory 僅用於個人偏好 -->

4. **Share insights**: If you discover something useful, consider adding it to documentation (not memory)
<!-- 分享見解：如果發現有用的東西，考慮將其添加到文檔（而非 memory） -->

## Questions?
<!-- 有問題？ -->

If you're unsure about what should go in memory vs project documentation, ask yourself:
<!-- 如果你不確定什麼應該放在 memory 還是專案文檔中，問問自己： -->

- **Is this specific to how I work?** → Memory
<!-- 這是我個人的工作方式嗎？→ Memory -->

- **Should everyone on the team follow this?** → CLAUDE.md or other documentation
<!-- 團隊中的每個人都應該遵循這個嗎？→ CLAUDE.md 或其他文檔 -->

---

**Note**: This guide itself is in the repository and shared with all collaborators. Your actual memory content is private and local.
<!-- 註記：本指南本身在儲存庫中，與所有協作者共享。你實際的 memory 內容是私有且本地的。 -->
