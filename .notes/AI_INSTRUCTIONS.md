# AI 筆記指令集

<!-- AI Instructions for Note-Taking System -->

> **給 AI Agent 的指令**：在每次 commit 前，檢查 `.notes/docs-list.md` 是否存在。如果存在，依照其中的筆記需求更新對應的筆記檔案。
>
> <!-- Instructions for AI Agents: Before every commit, check if `.notes/docs-list.md` exists. If it does, update corresponding note files according to the requirements. -->

---

## 運作流程 | Workflow

<!-- 工作流程 -->

### Step 1: 檢查筆記設定檔

<!-- Step 1: Check Note Configuration File -->

**在每次 commit 前**，AI Agent 必須：

<!-- Before every commit, AI agents MUST: -->

1. 檢查 `.notes/docs-list.md` 是否存在
   <!-- Check if `.notes/docs-list.md` exists -->

2. 如果存在，讀取該檔案了解需要維護哪些筆記
   <!-- If it exists, read the file to understand which notes need to be maintained -->

3. 如果不存在，跳過筆記更新流程
   <!-- If it doesn't exist, skip note-taking workflow -->

### Step 2: 分析本次 Commit

<!-- Step 2: Analyze Current Commit -->

檢視本次 commit 的變更內容，判斷是否需要更新任何筆記：

<!-- Review changes in current commit to determine if any notes need updating: -->

- 是否做出架構決策？
  <!-- Were architectural decisions made? -->

- 是否解決了技術問題或 bug？
  <!-- Were technical issues or bugs resolved? -->

- 是否應用了效能優化？
  <!-- Were performance optimizations applied? -->

- 是否改進了開發流程？
  <!-- Were workflow improvements made? -->

- 是否學習了新的 AI 協作模式？
  <!-- Were new AI collaboration patterns learned? -->

### Step 3: 更新對應筆記

<!-- Step 3: Update Corresponding Notes -->

根據 `docs-list.md` 中定義的筆記需求：

<!-- Based on note requirements defined in `docs-list.md`: -->

1. 識別哪些筆記需要更新
   <!-- Identify which notes need updating -->

2. 依照該筆記的「記錄要求」撰寫或更新內容
   <!-- Write or update content according to that note's "recording requirements" -->

3. 遵循本檔案中的「共同規範」
   <!-- Follow "common conventions" in this file -->

### Step 4: 繼續 Commit

<!-- Step 4: Proceed with Commit -->

筆記更新完成後，繼續進行 commit 流程。筆記檔案已在 `.gitignore` 中，不會被提交到 repo。

<!-- After notes are updated, proceed with commit workflow. Note files are in `.gitignore` and won't be committed to repo. -->

---

## 共同規範 | Common Conventions

<!-- 通用規範 -->

以下規範適用於**所有筆記檔案**：

<!-- The following conventions apply to **all note files**: -->

### 1. 語言與用語 | Language and Terminology

<!-- 語言與用語 -->

- **主要語言**：繁體中文（台灣）
  <!-- Primary language: Traditional Chinese (Taiwan) -->

- **用語規範**：使用台灣慣用詞彙
  <!-- Terminology: Use Taiwan-standard vocabulary -->
  - ✅ 「軟體」而非「軟件」
  - ✅ 「網路」而非「網絡」
  - ✅ 「資訊」而非「信息」
  - ✅ 「程式碼」而非「代碼」

- **英文術語處理**：
  <!-- Handling English terms: -->
  - 技術名詞保留英文：OpenCode、Sisyphus、commit、pull request
  - 首次出現時可加中文說明：OpenCode（開源程式碼編輯工具）

### 2. 標點符號規範 | Punctuation Standards

<!-- 標點符號規範 -->

依照**中華民國教育部《重訂標點符號手冊》**規範：

<!-- Follow standards from Taiwan Ministry of Education "Punctuation Manual": -->

#### 全形與半形 | Full-width vs Half-width

<!-- 全形與半形 -->

- ✅ **全形標點**：中文內容使用全形標點
  - 句號：。（全形）
  - 逗號：，（全形）
  - 頓號：、（全形）
  - 分號：；（全形）
  - 冒號：：（全形）
  - 問號：？（全形）
  - 驚嘆號：！（全形）
  - 引號：「」（全形）、『』（全形）
  - 括號：（）（全形）
  - 破折號：──（全形，兩個連接號）

- ✅ **半形標點**：英文、數字、程式碼使用半形標點
  - Period: `.` (half-width)
  - Comma: `,` (half-width)
  - Colon: `:` (half-width)
  - Quotes: `"..."` (half-width)
  - Parentheses: `()` (half-width)

#### 引號使用 | Quotation Marks

<!-- 引號使用 -->

- **第一層引用**：「」（直角引號）
  - 範例：他說「這個方法很有效」。

- **第二層引用**：『』（雙直角引號）
  - 範例：他說「老師講過『要注意細節』」。

- **英文引用**：保持英文原樣使用 `"..."`
  - 範例：The documentation says "use double quotes".

#### 空格規範 | Spacing Rules

<!-- 空格規範 -->

- ✅ 中英文之間加空格
  - 正確：使用 OpenCode 進行開發
  - 錯誤：使用OpenCode進行開發

- ✅ 中文與數字之間加空格
  - 正確：版本 0.1.0 已發布
  - 錯誤：版本0.1.0已發布

- ✅ 全形標點與英文之間不加空格
  - 正確：這是 OpenCode，非常好用。
  - 錯誤：這是 OpenCode ，非常好用。

#### 列表標點 | List Punctuation

<!-- 列表標點 -->

- **項目符號列表**：每項結尾不加標點（除非是完整句子）
  - ✅ 正確：
    - 架構設計
    - 效能優化
    - 工作流程改進
  - ✅ 正確（完整句子）：
    - 本次架構採用輕量容器化設計。
    - 效能提升了 30%。

- **編號列表**：同上

### 3. 檔案命名規範 | File Naming Conventions

<!-- 檔案命名規範 -->

**重要原則**：一個主題一個檔案，持續累積更新，而非每天建立新檔案。

<!-- Important Principle: One file per topic, continuously accumulate updates, not creating new files daily. -->

```
[topic-prefix]_[brief-description].md
```

**範例**：

```
ai_tools_experience_opencode-vs-roocode.md
ai_tools_experience_oh-my-opencode-setup.md
ai_tools_experience_team-collaboration.md
```

**規則**：

- 使用 `docs-list.md` 中定義的「筆記檔名前綴」
  <!-- Use "note file prefix" defined in `docs-list.md` -->
- 底線分隔前綴和描述
  <!-- Underscore separates prefix and description -->
- 描述使用英文小寫加連字號（kebab-case）
  <!-- Description uses lowercase English with hyphens (kebab-case) -->
- 副檔名為 `.md`
  <!-- File extension is `.md` -->
- **不要在檔名中加入日期**（日期記錄在檔案內容的 metadata 中）
  <!-- Do NOT include date in filename (date is recorded in file content metadata) -->

**累積更新原則**：

<!-- Accumulation Update Principle: -->

- **同一主題的新經驗 → 更新現有檔案**
  <!-- New experience on same topic → Update existing file -->
- **不同主題的新經驗 → 建立新檔案**
  <!-- New experience on different topic → Create new file -->
- 在檔案內容中使用「更新日誌」區段記錄每次更新
  <!-- Use "Update Log" section in file content to record each update -->

### 4. Markdown 格式規範 | Markdown Format Standards

<!-- Markdown 格式規範 -->

#### 標題層級 | Heading Levels

```markdown
# 主標題（H1）- 每個檔案只有一個

## 章節標題（H2）

### 子章節標題（H3）

#### 細項標題（H4）
```

#### 程式碼區塊 | Code Blocks

````markdown
```typescript
// 程式碼範例
const example = "with syntax highlighting";
```
````

#### 連結與參考 | Links and References

```markdown
- 內部連結：[檔案名稱](./relative/path/to/file.md)
- 外部連結：[說明文字](https://example.com)
- 參考行號：`path/to/file.ts:42`
```

### 5. 元資料格式 | Metadata Format

<!-- 元資料格式 -->

每個筆記檔案開頭應包含：

<!-- Each note file should start with: -->

```markdown
# 筆記標題

**建立日期**：YYYY-MM-DD  
**最後更新**：YYYY-MM-DD  
**相關 Commit**：`<commit-hash>`（如適用）  
**主題**：[對應 docs-list.md 中的主題]

---

[內容開始]
```

**累積更新時的元資料處理**：

<!-- Metadata Handling for Accumulated Updates: -->

- **建立日期**：保持不變（記錄首次建立時間）
  <!-- Created Date: Keep unchanged (record initial creation time) -->
- **最後更新**：每次更新時修改為當前日期
  <!-- Last Updated: Modify to current date on each update -->
- **相關 Commit**：可列出多個，用逗號分隔
  <!-- Related Commits: Can list multiple, separated by commas -->

**更新日誌區段**（建議在檔案末尾加入）：

<!-- Update Log Section (recommended to add at end of file): -->

```markdown
---

## 更新日誌 | Update Log

### 2026-02-11

- 初次建立筆記
- 記錄 OpenCode vs Roo Code 的初步體驗

### 2026-02-15

- 補充使用一週後的心得
- 新增 oh-my-opencode 配置細節

### 2026-02-20

- 更新團隊協作經驗
- 補充 Gemini Antigravity 整合心得
```

### 6. 內容撰寫原則 | Content Writing Principles

<!-- 內容撰寫原則 -->

- ✅ **簡潔明確**：用最少的字表達清楚的意思
  <!-- Concise and clear: Express clearly with minimal words -->

- ✅ **重點突出**：使用粗體、項目符號突出重點
  <!-- Highlight key points: Use bold, bullet points -->

- ✅ **結構清晰**：使用標題、分段組織內容
  <!-- Clear structure: Use headings, paragraphs -->

- ✅ **範例具體**：提供實際程式碼或檔案路徑範例
  <!-- Concrete examples: Provide actual code or file path examples -->

- ❌ **避免冗長**：不要重複 ADR 或文檔中已有的內容
  <!-- Avoid verbosity: Don't duplicate content from ADRs or docs -->

- ❌ **避免主觀**：除非有明確理由，否則避免純個人意見
  <!-- Avoid subjectivity: Avoid pure personal opinions unless justified -->

---

## 與專案文檔的關係 | Relationship with Project Documentation

<!-- 與專案文檔的關係 -->

### .notes/ vs docs/

<!-- .notes/ 與 docs/ 的差異 -->

| 特性         | `.notes/`（個人筆記） | `docs/`（專案文檔） |
| ------------ | --------------------- | ------------------- |
| **版本控制** | Git-ignored（不提交） | Git-tracked（提交） |
| **受眾**     | 個人或報告用          | 團隊所有成員        |
| **內容**     | 學習心得、探索記錄    | 正式文檔、決策記錄  |
| **格式**     | 彈性，依需求調整      | 嚴格遵循專案規範    |
| **範圍**     | 任何有價值的想法      | 經過驗證的決策      |

### 筆記提升流程 | Note Promotion Workflow

<!-- 筆記提升流程 -->

當筆記中的見解成熟且重要時，可以提升到專案文檔：

<!-- When insights in notes mature and become significant, promote them to project docs: -->

```
.notes/ 中的筆記
    ↓ 成熟且經團隊確認
docs/architecture/ADR/ （架構決策記錄）
    或
README.md、docs/guides/ （正式文檔）
```

**提升時機**：

- 決策影響團隊所有成員
- 需要版本控制和追溯
- 成為專案的正式標準

---

## 範例工作流程 | Example Workflow

<!-- 範例工作流程 -->

### 情境：使用者提交架構變更

<!-- Scenario: User commits architecture changes -->

```
1. AI 檢測到即將 commit
   ↓
2. AI 檢查 .notes/docs-list.md 是否存在
   ↓ 存在
3. AI 讀取 docs-list.md，發現有「架構決策」筆記需求
   ↓
4. AI 分析本次 commit：
   - 新增 oh-my-opencode 支援
   - 更新 AGENTS.md
   - 修改 README.md
   ↓
5. AI 判斷：這是架構相關變更
   ↓
6. AI 依照 docs-list.md 中的「架構決策」筆記要求
   建立或更新：.notes/20260211_oh-my-opencode-integration.md
   ↓
7. AI 遵循本檔案的共同規範：
   - 使用繁體中文（台灣）
   - 全形標點符號
   - 中英文間加空格
   - 引號使用「」
   ↓
8. 筆記更新完成，繼續 commit 流程
```

---

## 特殊指令 | Special Instructions

<!-- 特殊指令 -->

### 給 OpenCode + oh-my-opencode

<!-- For OpenCode + oh-my-opencode -->

當使用 ultrawork 模式（`ulw`）時：

<!-- When using ultrawork mode (`ulw`): -->

1. **在任務完成後、最終 commit 前**更新筆記
   <!-- Update notes after task completion but before final commit -->

2. 只為**重要的學習**建立筆記，非瑣碎變更
   <!-- Create notes only for significant learnings, not trivial changes -->

3. 如果本次 commit 涉及多個主題，分別更新對應的筆記檔案
   <!-- If commit involves multiple topics, update corresponding note files separately -->

### 給 Claude Code / Roo Code

<!-- For Claude Code / Roo Code -->

1. 在 commit 前手動檢查 `.notes/docs-list.md`
   <!-- Manually check `.notes/docs-list.md` before commits -->

2. 遵循相同的規範更新筆記
   <!-- Follow same conventions to update notes -->

---

## 維護政策 | Maintenance Policy

<!-- 維護政策 -->

### 誰維護？| Who Maintains?

<!-- 誰維護？ -->

- **AI Agents**：在 commit 前自動更新筆記
  <!-- AI agents: Automatically update notes before commits -->

- **使用者**：定期檢視、整理、提煉筆記
  <!-- Users: Periodically review, organize, refine notes -->

### 何時清理？| When to Clean Up?

<!-- 何時清理？ -->

- **建議**：每月檢視一次，整理或封存過時的筆記
  <!-- Recommended: Monthly review, organize or archive outdated notes -->

- **可選**：筆記是個人的，不強制清理（不會污染 repo）
  <!-- Optional: Notes are personal, cleanup not mandatory (won't pollute repo) -->

---

**建立時間**：2026-02-11  
**最後更新**：2026-02-11

<!-- Created: 2026-02-11 -->
<!-- Last Updated: 2026-02-11 -->
