# AISlidev 預覽導航改善計畫

## TL;DR

> **快速摘要**：修復 Slidev slides.md 的 frontmatter 格式錯誤（空白頁問題），並在預覽視窗添加固定提示 banner，告知用戶如何導航投影片。
>
> **交付成果**：
>
> - 修正 slides.md 三處 `layout: two-cols` 格式錯誤
> - 新增可關閉的導航提示 banner 組件
> - 提示內容：點擊、空白鍵、方向鍵
>
> **預估工作量**: Quick (1-2 小時)
> **並行執行**: YES - 2 個波次
> **關鍵路徑**: Task 1 → Task 3 → Verification

---

## Context

### 用戶問題反饋

1. **導航不直觀**：
   - 用戶表示 `<v-clicks>` 列表項目可以顯示
   - 但不知道如何切換到下一頁，需要「按特別的位置」
   - 希望在 banner 等位置添加操作說明

2. **Markdown 語法顯示錯誤**：
   - slides.md 中的 frontmatter 變成獨立空白頁
   - 具體內容：

     ```markdown
     ---
     layout: two-cols
     layoutClass: gap-16
     ---
     ```

### 根本原因

**問題 1（導航）**：

- Slidev 支援多種導航方式，但用戶不知道
- iframe 嵌入可能讓某些操作不明顯
- 缺少視覺提示

**問題 2（Markdown）**：

- Slidev 將 `---` 視為分頁符
- frontmatter 前後的**空行**導致被解析為內容頁
- 正確格式應該是緊鄰 `---`，中間無空行

### 測試驗證

已透過 Playwright 確認：

- ✅ `<v-clicks>` 內容確實有正常渲染
- ✅ 文字內容包含所有列表項目
- ✅ Slidev 功能本身正常

---

## Work Objectives

### 核心目標

修復 Slidev slides.md 格式錯誤，並添加用戶友善的導航提示，讓預覽操作更直覺。

### 具體交付成果

1. `data/aislidev-demo/slides.md` - 修正三處 frontmatter 格式
2. `src/components/NavigationHint.vue` - 新增導航提示 banner 組件
3. `src/components/SlidevPreview.vue` - 整合提示 banner

### Definition of Done

- [ ] slides.md 無獨立空白頁（驗證指令：瀏覽所有投影片）
- [ ] 預覽視窗頂部顯示導航提示 banner
- [ ] Banner 可點擊「×」關閉，狀態存入 localStorage
- [ ] 提示內容清晰簡潔：「點擊投影片或按空白鍵切換 | ← → 方向鍵導航」

### Must Have

- 修正所有 frontmatter 格式錯誤（共 3 處）
- 提示 banner 在預覽視窗內可見
- 關閉狀態持久化（不要每次都顯示）

### Must NOT Have (Guardrails)

- ❌ 不要過於詳細的說明（保持簡潔）
- ❌ 不要阻擋預覽內容（半透明、可關閉）
- ❌ 不要影響現有導航功能
- ❌ 不要修改 Slidev 本身的行為

---

## Verification Strategy

### Test Decision

- **Infrastructure exists**: YES（Vitest 已設置）
- **Automated tests**: Tests-after（先實作，後補測試）
- **Framework**: Vitest + Playwright
- **Agent-Executed QA**: 每個 task 都有 QA scenarios（詳見 TODOs）

### QA Policy

所有驗證由 agent 執行，證據存於 `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately - 獨立任務):
├── Task 1: 修正 slides.md frontmatter 格式 [quick]
└── Task 2: 創建 NavigationHint.vue 組件 [quick]

Wave 2 (After Wave 1 - 整合):
└── Task 3: 整合 NavigationHint 到 SlidevPreview [quick]

Wave FINAL (After ALL tasks - 驗證):
└── Task F1: E2E 驗證與截圖 [unspecified-high]

Critical Path: Task 1 → Task 3 → F1
Parallel Speedup: ~30% (2 tasks並行)
Max Concurrent: 2
```

### Dependency Matrix

- **1**: — — 3, 1
- **2**: — — 3, 1
- **3**: 1, 2 — F1, 2
- **F1**: 3 — —, 3

### Agent Dispatch Summary

- **Wave 1**: 2 tasks → T1: `quick`, T2: `quick`
- **Wave 2**: 1 task → T3: `quick`
- **Wave FINAL**: 1 task → F1: `unspecified-high`

---

## TODOs

- [ ] 1. 修正 slides.md 的 frontmatter 格式錯誤

  **What to do**:
  - 打開 `data/aislidev-demo/slides.md`
  - 找到三處 `layout: two-cols` 定義（第 95-100 行、第 247 行附近、第 420 行附近）
  - 移除 `---` 和 `layout:` 之間的空行
  - 確保格式為：
    ```markdown
    ---
    layout: two-cols
    layoutClass: gap-16
    ---
    ```

  **Must NOT do**:
  - 不要修改其他 frontmatter 內容
  - 不要改變投影片順序
  - 不要修改 `<v-clicks>` 相關內容

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []
  - **Reason**: 簡單的格式修正，無需特殊技能

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 2)
  - **Blocks**: Task 3
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `data/aislidev-demo/slides.md:14-34` - 正確的 frontmatter 格式範例（第一頁）
  - `data/aislidev-demo/slides.md:95-100` - 錯誤格式位置 1
  - 使用 `grep -n "layout: two-cols" data/aislidev-demo/slides.md` 找到所有位置

  **Slidev Documentation**:
  - https://sli.dev/guide/syntax.html#frontmatter-layouts - Frontmatter 語法說明

  **Acceptance Criteria**:
  - [ ] 所有 `layout: two-cols` 前後無空行
  - [ ] `grep -A2 -B2 "layout: two-cols" data/aislidev-demo/slides.md` 顯示正確格式

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: Frontmatter 格式修正後無獨立空白頁
    Tool: Playwright
    Preconditions:
      - AISlidev server running at http://localhost:13000
      - slides.md 已修正
    Steps:
      1. Navigate to http://localhost:13000
      2. Click "🔄 Refresh" button to reload preview
      3. Press ArrowRight key 15 times to navigate through slides
      4. Check each slide for blank pages containing only "layout: two-cols" text
      5. Count total slides (should be ~15-16, not 18-19)
    Expected Result:
      - No slides display only "layout: two-cols" or "layoutClass: gap-16"
      - Total slide count reduced by 3 compared to before fix
    Failure Indicators:
      - Blank slides with only frontmatter text visible
      - Total slide count unchanged
    Evidence: .sisyphus/evidence/task-1-frontmatter-fix.png (screenshot of slide navigation)

  Scenario: Two-cols layout 正常顯示
    Tool: Playwright
    Preconditions: slides.md 已修正
    Steps:
      1. Navigate to slide with "核心功能" title (應該是 slide 4 或 5)
      2. Verify layout is two columns (左右分欄)
      3. Check left column contains "即時編輯", "自動儲存", "檔案管理"
      4. Check right column contains "雙欄佈局", "主題支援", "快速部署"
    Expected Result: Content displayed in two-column layout correctly
    Evidence: .sisyphus/evidence/task-1-two-cols-layout.png
  ```

  **Evidence to Capture**:
  - [ ] task-1-frontmatter-fix.png (before/after slide count)
  - [ ] task-1-two-cols-layout.png (layout display)

  **Commit**: YES
  - Message: `fix(slides): remove blank lines in frontmatter causing empty slides`
  - Files: `data/aislidev-demo/slides.md`
  - Pre-commit: N/A (Markdown file only)

---

- [ ] 2. 創建 NavigationHint.vue 組件

  **What to do**:
  - 在 `src/components/` 創建 `NavigationHint.vue`
  - 實作半透明 banner，顯示在頂部
  - 內容：「💡 提示：點擊投影片或按空白鍵切換頁面 | 使用 ← → 方向鍵導航」
  - 添加「×」關閉按鈕
  - 使用 localStorage 記住關閉狀態（key: `aislidev-navigation-hint-dismissed`）
  - 樣式：半透明背景、不阻擋內容、簡潔設計

  **Must NOT do**:
  - 不要使用複雜動畫（簡單 fade 即可）
  - 不要阻擋預覽內容（z-index 適中）
  - 不要過度設計（保持 AISlidev 風格一致）

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]
  - **Reason**: UI 組件設計，需要前端 UI/UX 專業

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 1)
  - **Blocks**: Task 3
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `src/components/SlidevPreview.vue:1-17` - 現有組件結構參考
  - `src/components/EditorLayout.vue:1-50` - Vue 3 Composition API 使用模式
  - `src/App.vue:1-30` - 全域樣式參考

  **Vue 3 Composition API**:
  - https://vuejs.org/guide/essentials/reactivity-fundamentals.html - ref/reactive 使用

  **localStorage API**:
  - https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage

  **Component Structure**:

  ```vue
  <template>
    <div v-if="!isDismissed" class="navigation-hint">
      <span class="hint-text">
        💡 提示：點擊投影片或按空白鍵切換頁面 | 使用 ← → 方向鍵導航
      </span>
      <button @click="dismiss" class="close-btn">×</button>
    </div>
  </template>

  <script setup lang="ts">
  import { ref, onMounted } from "vue";

  const isDismissed = ref(false);
  const STORAGE_KEY = "aislidev-navigation-hint-dismissed";

  onMounted(() => {
    isDismissed.value = localStorage.getItem(STORAGE_KEY) === "true";
  });

  const dismiss = () => {
    isDismissed.value = true;
    localStorage.setItem(STORAGE_KEY, "true");
  };
  </script>

  <style scoped>
  .navigation-hint {
    /* 半透明背景、flex 佈局、關閉按鈕樣式 */
  }
  </style>
  ```

  **Acceptance Criteria**:
  - [ ] 組件檔案創建於 `src/components/NavigationHint.vue`
  - [ ] TypeScript 無錯誤：`npm run type-check` (if available) or `tsc --noEmit`
  - [ ] 組件可獨立 import 使用

  **QA Scenarios (MANDATORY)**:

  ````
  Scenario: NavigationHint 組件正常渲染
    Tool: Bash (Vue component test)
    Preconditions: NavigationHint.vue 已創建
    Steps:
      1. Create test file: tests/components/NavigationHint.test.ts
      2. Write test:
         ```ts
         import { mount } from '@vue/test-utils'
         import NavigationHint from '@/components/NavigationHint.vue'

         test('renders hint text', () => {
           const wrapper = mount(NavigationHint)
           expect(wrapper.text()).toContain('點擊投影片或按空白鍵切換頁面')
         })
         ```
      3. Run: `npm test tests/components/NavigationHint.test.ts`
    Expected Result: Test passes
    Evidence: .sisyphus/evidence/task-2-component-test.txt (test output)

  Scenario: localStorage 狀態持久化
    Tool: Playwright
    Preconditions: 組件在獨立頁面測試
    Steps:
      1. Create test page mounting NavigationHint
      2. Navigate to test page
      3. Verify hint is visible
      4. Click close button (×)
      5. Reload page
      6. Verify hint is NOT visible
      7. Clear localStorage: localStorage.removeItem('aislidev-navigation-hint-dismissed')
      8. Reload page
      9. Verify hint is visible again
    Expected Result: Dismissed state persists across reloads
    Evidence: .sisyphus/evidence/task-2-localstorage-persist.txt
  ````

  **Evidence to Capture**:
  - [ ] task-2-component-test.txt
  - [ ] task-2-localstorage-persist.txt

  **Commit**: YES
  - Message: `feat(ui): add navigation hint banner component`
  - Files: `src/components/NavigationHint.vue`
  - Pre-commit: `npm run lint` (if configured)

---

- [ ] 3. 整合 NavigationHint 到 SlidevPreview

  **What to do**:
  - 打開 `src/components/SlidevPreview.vue`
  - Import `NavigationHint` 組件
  - 在 iframe 上方添加 `<NavigationHint />`
  - 確保 banner 位置正確（預覽視窗內部頂端）
  - 調整 z-index 確保不阻擋 iframe 操作

  **Must NOT do**:
  - 不要修改現有預覽邏輯
  - 不要影響 iframe postMessage 通訊
  - 不要改變預覽視窗尺寸計算

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []
  - **Reason**: 簡單的組件整合

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2 (Sequential)
  - **Blocks**: Task F1
  - **Blocked By**: Task 1, Task 2

  **References**:

  **Pattern References**:
  - `src/components/SlidevPreview.vue:1-17` - 現有 template 結構
  - `src/components/EditorLayout.vue:10-50` - 組件 import 和使用模式

  **Integration Code**:

  ```vue
  <template>
    <div class="slidev-preview">
      <NavigationHint />
      <iframe
        v-if="previewUrl"
        :src="previewUrl"
        :key="iframeKey"
        class="preview-frame"
        frameborder="0"
        allow="fullscreen"
        @load="onLoad"
      ></iframe>
      ...
    </div>
  </template>

  <script setup lang="ts">
  import NavigationHint from "./NavigationHint.vue";
  // ... existing imports
  </script>

  <style scoped>
  .slidev-preview {
    position: relative; /* Ensure NavigationHint positioning works */
  }
  </style>
  ```

  **Acceptance Criteria**:
  - [ ] NavigationHint 顯示在預覽視窗頂部
  - [ ] Banner 不阻擋 iframe 內容
  - [ ] 點擊關閉按鈕後 banner 消失
  - [ ] `npm run dev` 無 console 錯誤

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: NavigationHint 在預覽視窗正確顯示
    Tool: Playwright
    Preconditions:
      - Server running at http://localhost:13000
      - localStorage cleared (hint not dismissed)
    Steps:
      1. Navigate to http://localhost:13000
      2. Wait for Slidev preview to load
      3. Locate NavigationHint banner at top of preview window
      4. Verify text content: "💡 提示：點擊投影片或按空白鍵切換頁面"
      5. Verify close button (×) is visible
      6. Verify banner does not cover slide content
    Expected Result:
      - Banner visible at top
      - Text readable
      - Close button clickable
      - Slide content not obscured
    Failure Indicators:
      - Banner not found
      - Text incorrect
      - Banner covers slide content
    Evidence: .sisyphus/evidence/task-3-banner-display.png

  Scenario: 關閉功能正常運作
    Tool: Playwright
    Preconditions: Banner 顯示中
    Steps:
      1. Click close button (×)
      2. Verify banner disappears
      3. Reload page (F5)
      4. Verify banner still not visible (localStorage persisted)
      5. Open DevTools → Application → localStorage
      6. Verify key 'aislidev-navigation-hint-dismissed' = 'true'
    Expected Result: Banner dismissed and state persists
    Evidence: .sisyphus/evidence/task-3-close-functionality.txt (localStorage value)

  Scenario: Banner 不影響投影片導航
    Tool: Playwright
    Preconditions: Banner 顯示中
    Steps:
      1. Click on slide area (not on banner)
      2. Verify slide advances to next slide
      3. Press ArrowRight key
      4. Verify slide advances
      5. Press Space key
      6. Verify slide advances
    Expected Result: All navigation methods work normally with banner present
    Evidence: .sisyphus/evidence/task-3-navigation-functional.txt
  ```

  **Evidence to Capture**:
  - [ ] task-3-banner-display.png
  - [ ] task-3-close-functionality.txt
  - [ ] task-3-navigation-functional.txt

  **Commit**: YES
  - Message: `feat(preview): integrate navigation hint banner`
  - Files: `src/components/SlidevPreview.vue`
  - Pre-commit: `npm run dev` (verify no errors)

---

## Final Verification Wave (MANDATORY)

- [ ] F1. **完整 E2E 驗證與截圖**

  **Objective**: 驗證所有改動正常運作，無副作用

  **Verification Steps**:
  1. **Frontmatter 修正驗證**：
     - 啟動 AISlidev: `npm run dev`
     - Navigate to http://localhost:13000
     - 瀏覽所有投影片（按 ArrowRight 到最後一頁）
     - 確認無獨立空白頁顯示 "layout: two-cols"
     - 截圖：每個 two-cols layout 頁面

  2. **NavigationHint 功能驗證**：
     - 清除 localStorage: 在 DevTools Console 執行 `localStorage.clear()`
     - 重新載入頁面
     - 確認 NavigationHint banner 顯示
     - 截圖：banner 顯示狀態
     - 點擊關閉按鈕
     - 確認 banner 消失
     - 重新載入頁面
     - 確認 banner 仍然隱藏（localStorage 生效）

  3. **導航功能驗證**：
     - 點擊投影片 → 確認切換
     - 按空白鍵 → 確認切換
     - 按方向鍵 ← → → 確認切換
     - 在有 `<v-clicks>` 的頁面測試逐步顯示

  4. **回歸測試**：
     - 測試其他按鈕：📁 Open、🎨 Theme、💾 Save MD、📊 Export PPTX、🔄 Refresh
     - 確認所有現有功能正常

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: [`playwright`]
  - **Reason**: E2E 測試需要瀏覽器自動化

  **Acceptance Criteria**:
  - [ ] 所有截圖已儲存至 `.sisyphus/evidence/`
  - [ ] 無獨立空白頁
  - [ ] NavigationHint 功能完整
  - [ ] 所有導航方式正常
  - [ ] 現有功能無回歸

  **QA Scenarios (MANDATORY)**:

  ```
  Scenario: 完整用戶流程驗證
    Tool: Playwright
    Preconditions: All tasks completed
    Steps:
      1. Start fresh: `pkill -f tsx; npm run dev`
      2. Clear localStorage via DevTools
      3. Navigate to http://localhost:13000
      4. Verify navigation hint appears
      5. Navigate through all slides (count total)
      6. Verify no blank slides with only frontmatter
      7. Return to slide 2 ("什麼是 AISlidev？")
      8. Click slide area to trigger <v-clicks>
      9. Verify list items appear step by step
      10. Click navigation hint close button
      11. Verify hint disappears
      12. Reload page
      13. Verify hint stays dismissed
    Expected Result: All functionality works as designed
    Evidence:
      - .sisyphus/evidence/final-e2e-full-flow.png
      - .sisyphus/evidence/final-e2e-slide-count.txt
      - .sisyphus/evidence/final-e2e-localstorage.txt
  ```

  **Evidence to Capture**:
  - [ ] final-e2e-full-flow.png (complete user flow screenshot)
  - [ ] final-e2e-slide-count.txt (total slide count before/after fix)
  - [ ] final-e2e-localstorage.txt (localStorage state)
  - [ ] final-e2e-two-cols-layout-\*.png (each two-cols page)

---

## Commit Strategy

- **Commit 1**: `fix(slides): remove blank lines in frontmatter causing empty slides`
  - Files: `data/aislidev-demo/slides.md`

- **Commit 2**: `feat(ui): add navigation hint banner component`
  - Files: `src/components/NavigationHint.vue`

- **Commit 3**: `feat(preview): integrate navigation hint banner`
  - Files: `src/components/SlidevPreview.vue`

---

## Success Criteria

### Verification Commands

```bash
# Check no blank slides
npm run dev
# Manually navigate through slides, count total (should be ~15-16, not 18-19)

# Check NavigationHint component
ls src/components/NavigationHint.vue

# Check integration
grep -n "NavigationHint" src/components/SlidevPreview.vue
```

### Final Checklist

- [ ] slides.md 無獨立空白頁（視覺驗證）
- [ ] NavigationHint banner 正確顯示
- [ ] Banner 可關閉且狀態持久化
- [ ] 所有導航方式正常運作
- [ ] 現有功能無回歸
- [ ] 所有證據檔案已儲存

---

**Plan Ready. Run `/start-work` to begin execution.**
