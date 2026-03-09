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

| ADR                                          | Title                                     | Status     |
| -------------------------------------------- | ----------------------------------------- | ---------- |
| [001](./001-version-control-strategy.md)     | Version Control and Release Strategy      | Accepted   |
| [002](./002-lightweight-containerization.md) | Lightweight Containerization Architecture | Accepted   |
| [003](./003-opencode-first-architecture.md)  | OpenCode-First AI Architecture            | Accepted   |
| [004](./004-slidev-vite-dev-mode-fix.md)     | Slidev Vite Dev Mode Constants Fix        | Accepted   |
| [005](./005-websocket-proxy-for-slidev.md)   | WebSocket-Enabled Proxy for Slidev        | Accepted   |
| <!-- ADR                                     | 標題                                      | 狀態 -->   |
| <!-- 001                                     | 版本控制和發布策略                        | 已接受 --> |
| <!-- 002                                     | 輕量容器化架構                            | 已接受 --> |
| <!-- 003                                     | OpenCode 優先的 AI 架構                   | 已接受 --> |
| <!-- 004                                     | Slidev Vite Dev Mode 編譯時常量修復       | 已接受 --> |
| <!-- 005                                     | 支援 WebSocket 的 Slidev 代理             | 已接受 --> |

## Creating a New ADR

<!-- 建立新的 ADR -->

1. Copy the template from the most recent ADR
<!-- 從最近的 ADR 複製範本 -->

2. Use sequential numbering (e.g., 002, 003)
<!-- 使用順序編號（例如 002、003） -->

3. Use kebab-case for filenames: `NNN-brief-description.md`
<!-- 檔案名稱使用 kebab-case：NNN-簡要描述.md -->

4. Update this index with the new ADR
<!-- 在此索引中更新新的 ADR -->

5. Follow the English + Chinese comment format as per AGENTS.md
<!-- 遵循 AGENTS.md 規定的英文 + 中文註解格式 -->
