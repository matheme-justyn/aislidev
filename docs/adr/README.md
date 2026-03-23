# Architecture Decision Records (ADR)

<!-- 架構決策記錄 -->

## What are ADRs?

<!-- 什麼是 ADR？ -->

Architecture Decision Records (ADRs) document significant architectural decisions made in this project, including the context, reasoning, and consequences of each decision.

<!-- 架構決策記錄（ADR）記錄此專案中做出的重要架構決策，包括每個決策的背景、推理過程和後果。 -->

## Format

<!-- 格式 -->

Each ADR follows this structure:

<!-- 每個 ADR 遵循以下結構： -->

1. **Title**: Brief description of the decision
<!-- 標題：決策的簡要描述 -->

2. **Status**: proposed | accepted | deprecated | superseded
<!-- 狀態：提議中 | 已接受 | 已廢棄 | 已取代 -->

3. **Context**: Background and problem statement
<!-- 背景：背景資訊和問題陳述 -->

4. **Decision**: What we decided to do
<!-- 決策：我們決定做什麼 -->

5. **Consequences**: Results and trade-offs
<!-- 後果：結果和權衡取捨 -->

6. **Alternatives Considered**: Other options we evaluated
<!-- 考慮的替代方案：我們評估過的其他選項 -->

## Index

<!-- 索引 -->

### Active ADRs

<!-- 當前 ADR -->

| ADR | Title | Status | Supersedes |
| --- | ----- | ------ | ---------- |
| [001](./001-project-foundation.md) | Project Foundation (Versioning & AI) | Accepted | Original 001, 003 |
| [002](./002-containerization.md) | Containerization Strategy | Accepted | Original 002, 013 |
| [003](./003-slidev-integration.md) | Slidev Preview Integration | Accepted | 004, 005, 007, 008, 012 |
| [004](./004-pptx-export.md) | PPTX Export Evolution | Accepted | 006, 009, 010, 011, 014, 015 |

### Archived ADRs (Consolidated)

<!-- 已整合的 ADR -->

Historical ADRs consolidated into above documents (retained in git history):

<!-- 以下 ADR 已整合到上述文件中（保留在 git 歷史記錄中）： -->

- **Foundation**: 001 (Version Control), 003 (AI Architecture)
- **Container**: 002 (Lightweight), 013 (Docker Migration)
- **Slidev**: 004 (Vite Fix), 005 (WebSocket), 007 (Base URL), 008 (Proxy v3), 012 (Routing)
- **PPTX**: 006 (Puppeteer), 009 (Data Dir), 010 (NODE_ENV), 011 (Flow Fix), 014 (Playwright), 015 (Background)

## Creating a New ADR

<!-- 建立新的 ADR -->

1. Copy the template from the most recent ADR
<!-- 從最近的 ADR 複製範本 -->

2. Use sequential numbering (e.g., 005, 006)
<!-- 使用順序編號（例如 005、006） -->

3. Use kebab-case for filenames: `NNN-brief-description.md`
<!-- 檔案名稱使用 kebab-case：NNN-簡要描述.md -->

4. Update this index with the new ADR
<!-- 在此索引中更新新的 ADR -->

5. Follow the English + Chinese comment format as per AGENTS.md
<!-- 遵循 AGENTS.md 規定的英文 + 中文註解格式 -->

## Consolidation History

<!-- 整合歷史 -->

**2026-03-23**: Consolidated 15 ADRs → 4 core documents
<!-- 2026-03-23：將 15 個 ADR 整合為 4 個核心文件 -->

- Reduced from ~169 KB to ~60 KB (~64% reduction)
<!-- 從約 169 KB 減少到約 60 KB（減少約 64%） -->

- Grouped by functional domain (Foundation, Container, Slidev, PPTX)
<!-- 按功能領域分組（基礎、容器、Slidev、PPTX） -->

- Preserved all technical decisions and rationale
<!-- 保留所有技術決策和理由 -->

- Old files retained in git history for reference
<!-- 舊文件保留在 git 歷史記錄中供參考 -->
