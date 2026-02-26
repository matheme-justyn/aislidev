# 文件組織規範 (Documentation Guidelines)

## 原則

**第一層盡可能簡潔，只保留核心文件。**

## 文件結構

```
project-root/
├── README.md              # 專案介紹、快速開始（必須）
├── AGENTS.md              # AI Agent 指令（必須）
├── CHANGELOG.md           # 版本歷史（必須）
├── CONTRIBUTING.md        # 貢獻指南（可選）
├── SECURITY.md            # 安全政策（可選）
├── TEMPLATE_SYNC.md       # 模板同步指南（模板專用）
├── config.toml            # 統一配置檔（必須）
├── .gitignore             # Git 忽略規則（必須）
│
├── docs/                  # 專案核心文件
│   ├── adr/               # 架構決策記錄（ADR）
│   │   └── NNNN-*.md
│   └── archive/           # 研究記錄、過時文件
│
├── scripts/               # 自動化腳本
│   ├── wl                 # 工作日誌（每日一檔）
│   └── *.sh
│
└── .worklog/              # 本地工作日誌（不 commit）
    └── YYYY-MM-DD.md
```

## 文件分類

### 第一層（Root Level）

| 檔案 | 用途 | 必須？ |
|------|------|--------|
| `README.md` | 專案介紹、架構、使用方式 | ✅ 是 |
| `AGENTS.md` | AI Agent 編碼規範和工作流程 | ✅ 是 |
| `CHANGELOG.md` | 版本變更記錄 | ✅ 是 |
| `CONTRIBUTING.md` | 貢獻指南 | ⚪ 可選 |
| `SECURITY.md` | 安全政策 | ⚪ 可選 |
| `LICENSE` | 授權條款 | ✅ 是 |

**❌ 禁止：**
- 中繼文件（`GET_STARTED.md`, `TASK_*.md`）
- 特定問題文件（`*_STABILITY.md`, `*_WORKFLOW.md`）
- 臨時記錄

### docs/ 目錄

**只放專案核心功能相關文件。**

| 子目錄 | 用途 | 範例 |
|--------|------|------|
| `docs/adr/` | 架構決策記錄 | `0001-use-typescript.md` |
| `docs/api/` | API 文件 | `endpoints.md`, `schemas.md` |
| `docs/design/` | 設計文件 | 系統設計、資料庫設計 |
| `docs/archive/` | 研究記錄、過時文件 | 實驗結果、已解決問題的研究 |

**❌ 禁止：**
- 個人工作記錄
- 工具使用教學（應該在工具本身的 README）
- 臨時問題追蹤

### scripts/ 目錄

自動化腳本。每個腳本應該：
- 有清楚的檔名（功能一目了然）
- 檔案開頭有簡短說明
- 可獨立執行

### 工作日誌

**位置**: `.worklog/` （加入 `.gitignore`）

**格式**: 每日一檔 `YYYY-MM-DD.md`

**用途**: 個人工作記錄，不 commit

## 新增文件前的檢查清單

- [ ] 這是核心功能相關嗎？（否 → 考慮放 archive/ 或不建立）
- [ ] 是臨時文件嗎？（是 → 用 `.worklog/` 或不建立）
- [ ] 已存在類似文件嗎？（是 → 合併而非新增）
- [ ] 這應該在第一層嗎？（大多數情況：否）

## 範例：好的 vs 壞的

### ✅ 好的

```
README.md                          # 簡潔的專案介紹
docs/adr/0005-use-postgres.md     # 核心技術決策
docs/api/authentication.md         # API 文件
.worklog/2026-02-26.md             # 個人記錄（不 commit）
```

### ❌ 壞的

```
GET_STARTED.md                     # → 整合到 README
OPENCODE_STABILITY.md              # → 工具問題，不是專案核心
TASK_COMPLETION.md                 # → 臨時追蹤，應該用 issue/Linear
docs/HOW_TO_USE_DOCKER.md          # → 工具使用，不是專案核心
```

## 清理原則

**每次新增文件時，問自己：**

1. 三個月後還需要嗎？
2. 其他人用這個模板會需要嗎？
3. 這是專案核心功能嗎？

**如果都是「否」→ 不要建立。**

---

**最後更新**: 2026-02-26
