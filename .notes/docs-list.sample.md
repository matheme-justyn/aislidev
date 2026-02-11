# 筆記清單範本

<!-- Notes List Template -->

> **說明**：複製此檔案為 `docs-list.md`（去掉 `.sample`）並根據需求自訂。
>
> <!-- Instructions: Copy this file as `docs-list.md` (remove `.sample`) and customize as needed. -->

---

## 筆記列表 | Notes List

<!-- 筆記列表 -->

以下是您希望 AI 協助維護的筆記清單。每個筆記項目包含：

<!-- Below is the list of notes you want AI to help maintain. Each note entry includes: -->

- **筆記檔名**：筆記檔案的命名前綴（不含日期）
- **記錄條件**：什麼情況下需要更新此筆記
- **記錄要求**：筆記應該包含哪些內容

---

### 1. 架構決策筆記 | Architecture Decisions

**筆記檔名**：`architecture_decisions.md`

<!-- Note: 一個主題一個檔案，持續累積更新 -->
<!-- Note: One file per topic, continuously accumulate updates -->

**記錄條件**：

- 做出重大架構決策時
- 選擇技術棧或設計模式時
- 修改系統結構時

**記錄要求**：

- **背景**：為什麼需要做這個決策？
- **決策內容**：選擇了什麼方案？
- **理由**：為什麼選這個方案？考慮了哪些替代方案？
- **影響**：對專案有什麼影響？
- **相關檔案**：涉及哪些檔案？

---

### 2. 問題解決筆記 | Problem Solving

**筆記檔名**：`debugging_problem-solving.md`

<!-- Note: 一個主題一個檔案，持續累積更新 -->
<!-- Note: One file per topic, continuously accumulate updates -->

**記錄條件**：

- 解決了複雜的 bug 或技術問題
- 發現了常見陷阱或錯誤模式
- 學習了新的除錯技巧

**記錄要求**：

- **問題描述**：遇到什麼問題？
- **調查過程**：如何找到根本原因？
- **解決方案**：如何修復？
- **學到的經驗**：下次如何避免或更快解決？
- **相關檔案**：哪些檔案受影響？

---

### 3. 效能優化筆記 | Performance Optimization

**筆記檔名**：`performance_optimization.md`

<!-- Note: 一個主題一個檔案，持續累積更新 -->
<!-- Note: One file per topic, continuously accumulate updates -->

**記錄條件**：

- 應用效能優化技術時
- 發現效能瓶頸並解決時
- 學習了新的優化方法時

**記錄要求**：

- **效能問題**：什麼地方慢或效能不佳？
- **基準測試**：優化前後的數據對比
- **優化方法**：使用了什麼技術？
- **效果**：提升了多少？
- **權衡**：有什麼代價？

---

### 4. 開發流程筆記 | Development Workflow

**筆記檔名**：`workflow_improvements.md`

<!-- Note: 一個主題一個檔案，持續累積更新 -->
<!-- Note: One file per topic, continuously accumulate updates -->

**記錄條件**：

- 改進了開發流程或工具配置
- 自動化了重複性任務
- 學習了新的開發工具或技巧

**記錄要求**：

- **原有流程**：之前是怎麼做的？有什麼問題？
- **改進內容**：做了什麼改變？
- **效益**：節省了多少時間或減少了多少錯誤？
- **使用方法**：如何使用新流程或工具？
- **相關配置**：涉及哪些配置檔案？

---

### 5. AI 協作筆記 | AI Collaboration

**筆記檔名**：`ai_collaboration_practices.md`

<!-- Note: 一個主題一個檔案，持續累積更新 -->
<!-- Note: One file per topic, continuously accumulate updates -->

**記錄條件**：

- 發現有效的 AI 協作模式
- 學習了新的 prompt 技巧
- 使用 oh-my-opencode 的特殊功能時

**記錄要求**：

- **任務背景**：AI 協助完成什麼任務？
- **使用方法**：如何與 AI 互動？用了什麼 prompt 或模式？
- **效果**：AI 的輸出品質如何？
- **經驗總結**：什麼方式有效？什麼方式無效？
- **相關工具**：使用了哪些 AI 工具或 agent？

---

## 自訂筆記 | Custom Notes

<!-- 自訂筆記 -->

您可以新增自己的筆記類型，格式如下：

<!-- You can add your own note types with the following format: -->

### X. [您的筆記主題] | Your Note Topic

**筆記檔名**：`your_topic_description.md`

<!-- Note: 一個主題一個檔案，持續累積更新 -->
<!-- Note: One file per topic, continuously accumulate updates -->

**記錄條件**：

- [什麼時候需要記錄]

**記錄要求**：

- **[欄位 1]**：[描述]
- **[欄位 2]**：[描述]
- **[欄位 3]**：[描述]

---

## 使用說明 | Usage Instructions

<!-- 使用說明 -->

### 如何自訂此檔案 | How to Customize This File

<!-- 如何自訂此檔案 -->

1. **複製範本**：

   ```bash
   cp .notes/docs-list.sample.md .notes/docs-list.md
   ```

2. **編輯 `docs-list.md`**：
   - 刪除不需要的筆記類型
   - 修改記錄條件和要求
   - 新增自訂筆記類型

3. **提交變更**：
   - `docs-list.sample.md` 會被 git 追蹤（給其他開發者參考）
   - `docs-list.md` 會被 gitignore（個人客製）

### 筆記檔案命名範例 | Note File Naming Examples

<!-- 筆記檔案命名範例 -->

**重要**：一個主題一個檔案，持續累積更新，不要每天建立新檔案。

<!-- Important: One file per topic, continuously accumulate updates, don't create new files daily. -->

依照您定義的筆記主題，AI 會建立或更新：

<!-- Based on your defined note topics, AI will create or update: -->

```
.notes/ai_tools_experience_opencode-vs-roocode.md
.notes/ai_tools_experience_oh-my-opencode-setup.md
.notes/ai_tools_experience_team-collaboration.md
```

**檔案命名規則**：

- 使用主題描述命名（不含日期）
- 格式：`[topic-prefix]_[brief-description].md`
- 描述使用英文小寫加連字號（kebab-case）
- 同一主題的新經驗 → 更新現有檔案
- 不同主題的新經驗 → 建立新檔案

**日期記錄方式**：

- 檔案內容的 metadata 記錄「建立日期」和「最後更新」
- 檔案末尾的「更新日誌」區段記錄每次更新的日期和內容

### AI 如何使用此檔案 | How AI Uses This File

<!-- AI 如何使用此檔案 -->

1. AI 在 commit 前讀取 `.notes/docs-list.md`
2. AI 分析本次 commit 的變更
3. AI 對照「記錄條件」判斷需要更新哪個筆記檔案
4. AI 依照「記錄要求」更新現有檔案或建立新檔案
5. AI 遵循 `AI_INSTRUCTIONS.md` 中的共同規範（語言、標點、格式）
6. **同一主題的新內容會累積到同一個檔案中**，並在「更新日誌」區段記錄

---

## 範例：最小化配置 | Example: Minimal Configuration

<!-- 範例：最小化配置 -->

如果您只想記錄架構決策和 AI 協作經驗：

<!-- If you only want to track architecture decisions and AI collaboration: -->

```markdown
# 筆記清單

## 筆記列表

### 1. 架構決策筆記

**筆記檔名**：`arch_decisions.md`

**記錄條件**：

- 做出架構決策時

**記錄要求**：

- 決策內容
- 選擇理由
- 影響評估

### 2. AI 協作筆記

**筆記檔名**：`ai_collaboration.md`

**記錄條件**：

- 使用 AI 完成複雜任務時

**記錄要求**：

- 任務描述
- Prompt 策略
- 效果評估
```

---

**建立時間**：2026-02-11  
**最後更新**：2026-02-11

<!-- Created: 2026-02-11 -->
<!-- Last Updated: 2026-02-11 -->
