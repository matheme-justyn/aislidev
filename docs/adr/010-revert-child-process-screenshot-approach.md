# ADR 010: Revert from child_process.exec() to Inline Screenshot Logic

<!-- ADR 010：從 child_process.exec() 恢復到 inline 截圖邏輯 -->

## Status

<!-- 狀態 -->

**Accepted** - 2026-03-16

<!-- 已接受 - 2026-03-16 -->

## Context

<!-- 背景 -->

During PPTX export development, we encountered a critical issue where exported PowerPoint files showed white backgrounds instead of the expected Unsplash images. Screenshots captured were 97KB (white background) instead of 844KB (with backgrounds).

<!-- 在 PPTX 匯出開發過程中，我們遇到一個嚴重問題：匯出的 PowerPoint 檔案顯示白色背景而非預期的 Unsplash 圖片。截圖大小為 97KB（白背景）而非 844KB（有背景）。 -->

### Investigation Process

<!-- 調查過程 -->

We conducted extensive debugging (Session 1 - 2026-03-16 morning):

<!-- 我們進行了廣泛的除錯（Session 1 - 2026-03-16 上午）： -->

1. **Playwright Configuration Testing**: Added `channel: 'chromium'`, replaced `playwright-chromium` with full `playwright` package
<!-- Playwright 配置測試：新增 `channel: 'chromium'`，將 `playwright-chromium` 替換為完整的 `playwright` 套件 -->

2. **Wait Strategy Optimization**: Increased wait times (10s initial + 5+5s per slide), added explicit networkidle waits
<!-- 等待策略最佳化：增加等待時間（初始 10 秒 + 每張投影片 5+5 秒），新增明確的 networkidle 等待 -->

3. **Browser Isolation**: Created fresh browser instances per export (no singleton reuse)
<!-- 瀏覽器隔離：每次匯出建立新的瀏覽器實例（不重用單例） -->

4. **Diagnostic Logging**: Added CSS and network request monitoring - confirmed images loaded with HTTP 200
<!-- 診斷日誌：新增 CSS 和網路請求監控 - 確認圖片以 HTTP 200 載入 -->

5. **External Script Approach**: Created `scripts/screenshot-all-slides.mjs` to isolate screenshot logic
<!-- 外部腳本方法：建立 `scripts/screenshot-all-slides.mjs` 來隔離截圖邏輯 -->

6. **Service Integration**: Modified `BrowserExporter.ts` to call external script via `child_process.exec()`
<!-- 服務整合：修改 `BrowserExporter.ts` 透過 `child_process.exec()` 呼叫外部腳本 -->

**All approaches failed** - external script via `child_process.exec()` still produced 97KB white backgrounds.

<!-- 所有方法都失敗了 - 透過 `child_process.exec()` 的外部腳本仍然產生 97KB 白背景。 -->

### Root Cause Discovery

<!-- 根本原因發現 -->

Session 2 (2026-03-16 afternoon) revealed the critical finding:

<!-- Session 2（2026-03-16 下午）揭示了關鍵發現： -->

**The EXACT SAME CODE produces different results based on execution context:**

<!-- 完全相同的程式碼根據執行環境產生不同結果： -->

| Execution Method                               | File Size      | Background Images  | Status   |
| ---------------------------------------------- | -------------- | ------------------ | -------- |
| Standalone script (`node test-screenshot.mjs`) | 844KB          | ✅ Loaded          | SUCCESS  |
| External script via `child_process.exec()`     | 97KB           | ❌ Missing         | FAILURE  |
| Service inline logic                           | (To be tested) | (Expected to work) | PENDING  |
| <!-- 執行方式                                  | 檔案大小       | 背景圖片           | 狀態 --> |
| <!-- 獨立腳本                                  | 844KB          | ✅ 已載入          | 成功 --> |
| <!-- 透過 child_process.exec() 的外部腳本      | 97KB           | ❌ 缺失            | 失敗 --> |
| <!-- 服務 inline 邏輯                          | （待測試）     | （預期可運作）     | 待定 --> |

**Root Cause Hypothesis:**

<!-- 根本原因假設： -->

`child_process.exec()` inherits a different execution environment than direct Node.js execution. Possible culprits:

<!-- `child_process.exec()` 繼承了與直接 Node.js 執行不同的執行環境。可能的原因： -->

- Environment variables (`PATH`, `NODE_OPTIONS`)
<!-- 環境變數 -->
- Working directory differences
<!-- 工作目錄差異 -->
- stdio inheritance affecting Playwright's browser launch
<!-- stdio 繼承影響 Playwright 的瀏覽器啟動 -->
- Process isolation breaking external resource loading
<!-- 程序隔離破壞外部資源載入 -->

**Additional Problems with External Script:**

<!-- 外部腳本的其他問題： -->

- Browser crashes on slide 11+ with "Target page has been closed" error
<!-- 瀏覽器在第 11 張投影片後當機，出現「Target page has been closed」錯誤 -->
- Instability during long-running operations
<!-- 長時間運行時不穩定 -->

## Decision

<!-- 決策 -->

**Revert BrowserExporter.ts from `child_process.exec()` approach back to inline screenshot logic**, matching the pattern from the successful standalone test.

<!-- 將 BrowserExporter.ts 從 `child_process.exec()` 方法恢復到 inline 截圖邏輯，符合成功獨立測試的模式。 -->

### Implementation

<!-- 實作 -->

1. **Remove External Script Workaround** (lines 100-120):
   <!-- 移除外部腳本 workaround -->
   - Delete `child_process.exec()` code block
   <!-- 刪除 child_process.exec() 程式碼區塊 -->
   - Remove dependency on `scripts/screenshot-all-slides.mjs`
   <!-- 移除對 scripts/screenshot-all-slides.mjs 的依賴 -->

2. **Implement Inline Screenshot Loop**:
   <!-- 實作 inline 截圖迴圈 -->

   ```typescript
   for (let i = 1; i <= slideCount; i++) {
     const slidePage = await browser.newPage();
     await slidePage.setViewportSize({ width: 1920, height: 1080 });
     const screenshotPath = path.join(tempDir, `slide-${i}.png`);
     await this.screenshotSlide(slidePage, i, screenshotPath, port);
     screenshotPaths.push(screenshotPath);
     await slidePage.close();
   }
   ```

3. **Apply Playwright Best Practices** (from librarian research):
   <!-- 應用 Playwright 最佳實踐 -->
   - Use `channel: 'chromium'` for reliable rendering
   <!-- 使用 channel: 'chromium' 以獲得可靠的渲染 -->
   - Wait strategy: `waitUntil: 'networkidle'` + `waitForTimeout(10000)`
   <!-- 等待策略：waitUntil: 'networkidle' + waitForTimeout(10000) -->
   - Add `waitForFunction` to verify background loaded
   <!-- 新增 waitForFunction 以驗證背景已載入 -->
   - Container-safe args: `--no-sandbox`, `--disable-dev-shm-usage`
   <!-- 容器安全參數：--no-sandbox、--disable-dev-shm-usage -->

4. **Update Unit Tests**:
   <!-- 更新單元測試 -->
   - Fix mock expectations to match new inline approach
   <!-- 修正 mock 預期以符合新的 inline 方法 -->
   - Change from `playwright-chromium` to `playwright` mock
   <!-- 將 mock 從 playwright-chromium 改為 playwright -->
   - Add `waitForFunction` mock
   <!-- 新增 waitForFunction mock -->

## Consequences

<!-- 後果 -->

### Positive

<!-- 正面影響 -->

1. **Restores Working Screenshot Logic**: Expected to fix 97KB → 844KB issue by avoiding `child_process` environment pollution
<!-- 恢復可運作的截圖邏輯：透過避免 child_process 環境污染，預期修復 97KB → 844KB 問題 -->

2. **Simpler Architecture**: No external script dependency, easier to maintain and debug
<!-- 更簡單的架構：無外部腳本依賴，更易於維護和除錯 -->

3. **Better Error Handling**: Errors propagate directly without cross-process communication
<!-- 更好的錯誤處理：錯誤直接傳播，無需跨程序通訊 -->

4. **Improved Stability**: Eliminates browser crashes observed in external script (slide 11+ crashes)
<!-- 提升穩定性：消除外部腳本中觀察到的瀏覽器當機（第 11 張投影片後當機） -->

5. **Test Compatibility**: Unit tests work correctly with inline mocking
<!-- 測試相容性：單元測試可正確運作 inline mocking -->

### Negative

<!-- 負面影響 -->

1. **Increased Service Memory Usage**: Browser runs in same process as service (vs separate process)
<!-- 增加服務記憶體使用：瀏覽器在服務相同程序中運行（與獨立程序相比） -->

2. **No Process Isolation**: Browser crashes could potentially affect service (mitigated by try-catch)
<!-- 無程序隔離：瀏覽器當機可能影響服務（透過 try-catch 緩解） -->

### Neutral

<!-- 中性影響 -->

1. **Code Volume**: Similar lines of code - external script logic moved inline
<!-- 程式碼量：相似的程式碼行數 - 外部腳本邏輯移至 inline -->

2. **Performance**: Expected similar performance (same Playwright operations)
<!-- 效能：預期效能相似（相同的 Playwright 操作） -->

## Alternatives Considered

<!-- 考慮的替代方案 -->

### 1. Continue with `child_process.exec()` and Fix Environment

<!-- 繼續使用 child_process.exec() 並修復環境 -->

**Rejected** because:

<!-- 拒絕原因： -->

- Root cause of environment difference is unclear after extensive debugging
<!-- 經過廣泛除錯後環境差異的根本原因仍不清楚 -->
- Would require deep investigation into Node.js process inheritance
<!-- 需要深入調查 Node.js 程序繼承 -->
- External script has additional stability issues (crashes on slide 11+)
<!-- 外部腳本有其他穩定性問題（第 11 張投影片後當機） -->
- Adds architectural complexity without proven benefit
<!-- 增加架構複雜性而無明確益處 -->

### 2. Use Puppeteer Instead of Playwright

<!-- 使用 Puppeteer 而非 Playwright -->

**Rejected** because:

<!-- 拒絕原因： -->

- Standalone test with Playwright already works (844KB success)
<!-- 使用 Playwright 的獨立測試已經可運作（844KB 成功） -->
- No evidence that Puppeteer would resolve the `child_process` issue
<!-- 無證據顯示 Puppeteer 會解決 child_process 問題 -->
- Would require rewriting all browser automation code
<!-- 需要重寫所有瀏覽器自動化程式碼 -->
- Migration cost not justified without clear advantage
<!-- 遷移成本無明確優勢不合理 -->

### 3. Pre-render Slides Server-Side (No Browser)

<!-- 伺服器端預渲染投影片（無瀏覽器） -->

**Rejected** because:

<!-- 拒絕原因： -->

- Slidev is a complex Vue.js application with dynamic rendering
<!-- Slidev 是具有動態渲染的複雜 Vue.js 應用程式 -->
- Would require implementing complete Vue + Vite SSR pipeline
<!-- 需要實作完整的 Vue + Vite SSR 管道 -->
- v-click animations and interactions cannot be pre-rendered
<!-- v-click 動畫和互動無法預渲染 -->
- Massive engineering effort for uncertain outcome
<!-- 巨大的工程努力但結果不確定 -->

### 4. Use Slidev's Built-in Export (Wait for Official Fix)

<!-- 使用 Slidev 的內建匯出（等待官方修復） -->

**Rejected** because:

<!-- 拒絕原因： -->

- Slidev CLI export produces empty PPTX files (confirmed broken in v52.11.5)
<!-- Slidev CLI 匯出產生空的 PPTX 檔案（確認 v52.11.5 已損壞） -->
- `/export` route only supports PDF/PNG, not PPTX
<!-- /export 路由僅支援 PDF/PNG，不支援 PPTX -->
- No timeline for official PPTX support fix
<!-- 官方 PPTX 支援修復無時間表 -->
- User requires working PPTX export now
<!-- 使用者現在需要可運作的 PPTX 匯出 -->

## Verification

<!-- 驗證 -->

### Testing Requirements

<!-- 測試要求 -->

1. **Unit Tests**: ✅ All 3 BrowserExporter unit tests passing
<!-- 單元測試：✅ 所有 3 個 BrowserExporter 單元測試通過 -->

2. **Integration Tests**: ✅ All 32 integration tests passing (verified no regressions)
<!-- 整合測試：✅ 所有 32 個整合測試通過（驗證無回歸） -->

3. **Manual Verification** (Pending): Export `aislidev-demo` and verify:
   <!-- 手動驗證（待完成）：匯出 aislidev-demo 並驗證： -->
   - Slide 1 has Unsplash background (not white)
   <!-- 投影片 1 有 Unsplash 背景（非白色） -->
   - Screenshot file size ~844KB (not ~97KB)
   <!-- 截圖檔案大小約 844KB（非約 97KB） -->
   - All 13 slides exported correctly
   <!-- 所有 13 張投影片正確匯出 -->
   - v-click animations captured
   <!-- v-click 動畫已捕捉 -->

### Success Criteria

<!-- 成功標準 -->

- [ ] Slide 1 screenshot file size >= 800KB (with background)
<!-- 投影片 1 截圖檔案大小 >= 800KB（有背景） -->
- [ ] PPTX file contains visible Unsplash background on slide 1
<!-- PPTX 檔案在投影片 1 上包含可見的 Unsplash 背景 -->
- [ ] All unit and integration tests pass
<!-- 所有單元和整合測試通過 -->
- [ ] No browser stability issues during export
<!-- 匯出期間無瀏覽器穩定性問題 -->

## Related

<!-- 相關 -->

- **Issue**: PPTX Background Images Not Loading (documented in AGENTS.md)
<!-- 問題：PPTX 背景圖片未載入（記錄於 AGENTS.md） -->
- **Files Modified**:
  - `src/server/services/BrowserExporter.ts` (reverted to inline logic)
  <!-- 已修改的檔案：src/server/services/BrowserExporter.ts（恢復到 inline 邏輯） -->
  - `tests/unit/BrowserExporter.test.ts` (updated mocks)
  <!-- tests/unit/BrowserExporter.test.ts（更新 mock） -->
- **External Script**: `scripts/screenshot-all-slides.mjs` (can be removed after verification)
<!-- 外部腳本：scripts/screenshot-all-slides.mjs（驗證後可移除） -->
- **Reference**: `test-screenshot.mjs` (successful 844KB pattern - used as reference)
<!-- 參考：test-screenshot.mjs（成功的 844KB 模式 - 用作參考） -->

## Notes

<!-- 註記 -->

This decision emphasizes **evidence-based problem solving**: the standalone test proved the code CAN work, isolating the issue to `child_process` execution context. By reverting to the proven working pattern, we avoid the unknown complexities of cross-process environment inheritance.

<!-- 此決策強調基於證據的問題解決：獨立測試證明程式碼可以運作，將問題隔離到 child_process 執行環境。透過恢復到已證明可運作的模式，我們避免了跨程序環境繼承的未知複雜性。 -->

The extensive debugging session (12+ approaches attempted) provided valuable negative knowledge about what DOESN'T work, making this decision more confident.

<!-- 廣泛的除錯會話（嘗試了 12+ 種方法）提供了關於什麼不起作用的寶貴負面知識，使此決策更有信心。 -->
