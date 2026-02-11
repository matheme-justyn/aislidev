# AISliDev Project Memory Template
<!-- AISliDev 專案 Memory 範本 -->

## Purpose
<!-- 目的 -->

This template helps you set up personalized AI assistant preferences for the AISliDev project. Copy this to your AI tool's memory/custom instructions location.
<!-- 此範本幫助你為 AISliDev 專案設定個人化的 AI 助手偏好。複製此內容到你的 AI 工具的 memory/自訂指令位置。 -->

---

## Communication Preferences
<!-- 溝通偏好 -->

### Language
<!-- 語言 -->

- **Conversation language**: Traditional Chinese (Taiwan) / 繁體中文（台灣）
  <!-- 對話語言：繁體中文（台灣） -->
  
- **Code comments**: English preferred for technical terms, Chinese for explanations
  <!-- 程式碼註解：技術術語優先使用英文，解釋用中文 -->
  
- **Documentation language**: Follow project conventions (see AI.md)
  <!-- 文檔語言：遵循專案慣例（見 AI.md） -->

### Communication Style
<!-- 溝通風格 -->

- Be direct and technical, avoid unnecessary pleasantries
  <!-- 直接且技術化，避免不必要的客套 -->
  
- Provide clear explanations with examples when needed
  <!-- 需要時提供清晰的解釋和範例 -->
  
- Reference ADRs and documentation when explaining decisions
  <!-- 解釋決策時引用 ADR 和文檔 -->

---

## Architecture Principles
<!-- 架構原則 -->

### Learned from v1 (CRITICAL)
<!-- 從 v1 學到的經驗（關鍵） -->

- **Avoid over-engineering**: Keep it simple and maintainable
  <!-- 避免過度工程化：保持簡單和可維護 -->
  
- **No microservices for single-user tools**: Monolithic architecture is appropriate here
  <!-- 單用戶工具不要微服務：單體架構在這裡是適當的 -->
  
- **Native integration over iframe**: Slidev must be integrated natively, not via iframe
  <!-- 原生整合勝於 iframe：Slidev 必須原生整合，不要透過 iframe -->
  
- **Container orchestration is overkill**: Single container is sufficient
  <!-- 容器編排過度：單一容器就足夠了 -->

### Current Architecture (v2)
<!-- 當前架構（v2） -->

- **Single container deployment** using Podman/Docker (see ADR-002)
  <!-- 單一容器部署，使用 Podman/Docker（見 ADR-002） -->
  
- **Lightweight and simple** over complex and scalable
  <!-- 輕量簡單勝於複雜可擴展 -->
  
- **File-based storage** (SQLite or JSON) for simplicity
  <!-- 基於檔案的儲存（SQLite 或 JSON）以求簡單 -->

---

## Development Workflow
<!-- 開發工作流程 -->

### Before Starting Work
<!-- 開始工作前 -->

1. Always read `AI.md` for project-wide configuration
   <!-- 總是閱讀 AI.md 了解專案級配置 -->
   
2. Check relevant ADRs in `docs/architecture/ADR/` before making architectural decisions
   <!-- 在做架構決策前檢查 docs/architecture/ADR/ 中的相關 ADR -->
   
3. Review shared context in `.ai/context/` for conventions and workflows
   <!-- 檢閱 .ai/context/ 中的共享上下文了解慣例和工作流程 -->

### During Development
<!-- 開發期間 -->

1. **Follow Conventional Commits** format for all commits
   <!-- 所有 commits 遵循 Conventional Commits 格式 -->
   
2. **Check ADR conflicts**: If user's request conflicts with an ADR, point it out explicitly
   <!-- 檢查 ADR 衝突：如果使用者請求與 ADR 衝突，明確指出 -->
   
3. **Update documentation**: Use the checklist in `DOCUMENTATION_MAINTENANCE.md`
   <!-- 更新文檔：使用 DOCUMENTATION_MAINTENANCE.md 中的檢查清單 -->

### Before Committing
<!-- 提交前 -->

1. **Version analysis**: Analyze changes and determine version bump (see AI.md)
   <!-- 版本分析：分析變更並確定版本更新（見 AI.md） -->
   
2. **Present commit plan**: Show user the proposed commits and versions
   <!-- 呈現提交計畫：向使用者展示建議的 commits 和版本 -->
   
3. **Wait for approval**: Don't commit until user approves the plan
   <!-- 等待批准：在使用者批准計畫前不要提交 -->

---

## Project-Specific Patterns
<!-- 專案特定模式 -->

### Current Stage
<!-- 當前階段 -->

- **Version**: 0.x.x (Pre-Release)
  <!-- 版本：0.x.x（Pre-Release） -->
  
- **Phase**: v2 architecture design and implementation
  <!-- 階段：v2 架構設計和實作 -->
  
- **Focus**: Lightweight containerization with native Slidev integration
  <!-- 焦點：輕量容器化與 Slidev 原生整合 -->

### Technology Stack
<!-- 技術棧 -->

- **Runtime**: Node.js 20+
  <!-- 執行環境：Node.js 20+ -->
  
- **Framework**: Fastify (chosen for performance and simplicity)
  <!-- 框架：Fastify（為效能和簡單性而選） -->
  
- **Container**: Podman (OCI-compatible, also works with Docker)
  <!-- 容器：Podman（OCI 相容，也可用 Docker） -->
  
- **Presentation**: Slidev (to be integrated natively)
  <!-- 簡報：Slidev（待原生整合） -->

### Key Files to Check
<!-- 要檢查的關鍵檔案 -->

- `AI.md` - Main AI configuration (tool-agnostic)
  <!-- AI.md - 主要 AI 配置（工具無關） -->
  
- `docs/architecture/ADR/` - Architecture decisions
  <!-- docs/architecture/ADR/ - 架構決策 -->
  
- `CHANGELOG.md` - Version history
  <!-- CHANGELOG.md - 版本歷史 -->
  
- `.ai/context/` - Shared conventions and workflows
  <!-- .ai/context/ - 共享慣例和工作流程 -->

---

## Personal Preferences (Customize This Section)
<!-- 個人偏好（自訂此區段） -->

### My Work Style
<!-- 我的工作風格 -->

- Prefer detailed explanations / Quick summaries
  <!-- 偏好詳細解釋 / 快速摘要 -->
  
- Show full code / Show only changes
  <!-- 顯示完整程式碼 / 僅顯示變更 -->
  
- Multiple small commits / One large commit per feature
  <!-- 多個小 commits / 每功能一個大 commit -->

### My Focus Areas
<!-- 我的關注領域 -->

- Frontend development / Backend development / Full-stack
  <!-- 前端開發 / 後端開發 / 全端 -->
  
- Architecture design / Implementation / Testing
  <!-- 架構設計 / 實作 / 測試 -->

### Reminders for Me
<!-- 給我的提醒 -->

- Remember to test port configuration changes
  <!-- 記得測試 port 配置變更 -->
  
- Always run `npm run build` before container deployment
  <!-- 容器部署前總是執行 npm run build -->
  
- Check firewall settings when testing network access
  <!-- 測試網路存取時檢查防火牆設定 -->

---

## Tool-Specific Notes
<!-- 工具特定註記 -->

### If Using Claude Code
<!-- 如果使用 Claude Code -->

- This file should be placed in: `~/.claude/projects/<project-hash>/memory/MEMORY.md`
  <!-- 此檔案應放在：~/.claude/projects/<project-hash>/memory/MEMORY.md -->
  
- Enable Extended Thinking for complex debugging
  <!-- 為複雜除錯啟用 Extended Thinking -->
  
- Use sidebar location for better workflow
  <!-- 使用側邊欄位置以獲得更好的工作流程 -->

### If Using Roo Code
<!-- 如果使用 Roo Code -->

- Copy relevant sections to Custom Instructions in Roo Code settings
  <!-- 將相關區段複製到 Roo Code 設定中的自訂指令 -->
  
- Extended thinking is built-in, no need to enable
  <!-- Extended thinking 已內建，無需啟用 -->
  
- Modes system can be customized in `.roo/modes/`
  <!-- 模式系統可在 .roo/modes/ 中自訂 -->

---

## Update History
<!-- 更新歷史 -->

- 2026-02-11: Initial template created
  <!-- 2026-02-11：建立初始範本 -->
  
- [Add your updates here]
  <!-- 在此新增你的更新 -->

---

**Note**: This is a template. Customize it to match your personal preferences and work style!
<!-- 註記：這是範本。自訂它以符合你的個人偏好和工作風格！ -->
