# Release Note Template
<!-- Release Note 範本 -->

This template should be used for every version release to ensure consistency and clarity.
<!-- 此範本應用於每次版本發布，以確保一致性和清晰度。 -->

---

## Release Note Format
<!-- Release Note 格式 -->

```markdown
# Release v[VERSION] - [RELEASE_NAME]
# 版本 v[VERSION] 發布 - [RELEASE_NAME]

> **Release Date**: YYYY-MM-DD
> **發布日期**: YYYY-MM-DD

---

## 🎯 Overview | 概述

[Brief 1-2 sentence summary of this release]
<!-- 此版本的簡短 1-2 句摘要 -->

---

## ✨ What's New | 新功能

### [Feature Category] | [功能類別]

- **[Feature Name]** - [Brief description]
  - [功能名稱] - [簡短說明]
  - Technical details: [Implementation notes]
    <!-- 技術細節：[實作說明] -->

[Repeat for each major feature]
<!-- 為每個主要功能重複 -->

---

## 🔧 Improvements | 改進

- **[Improvement Title]** - [What was improved and why]
  - [改進標題] - [改進了什麼以及為什麼]

[List all improvements]
<!-- 列出所有改進 -->

---

## 🐛 Bug Fixes | 錯誤修復

- **[Bug Title]** - Fixed [issue description]
  - [錯誤標題] - 修復了 [問題描述]

[List all bug fixes, or "No bug fixes in this release" if none]
<!-- 列出所有錯誤修復，如果沒有則寫「此版本無錯誤修復」 -->

---

## 📚 Documentation | 文檔

- [Documentation updates]
  - [文檔更新]

[List documentation changes]
<!-- 列出文檔變更 -->

---

## ⚠️ Breaking Changes | 破壞性變更

[For MAJOR version updates only]
<!-- 僅用於 MAJOR 版本更新 -->

- **[Breaking Change Title]** - [What changed and migration guide]
  - [破壞性變更標題] - [變更內容和遷移指南]

[If no breaking changes: "None" / "無"]
<!-- 如果無破壞性變更：「無」 -->

---

## 🚀 Upgrade Guide | 升級指南

### For Users | 給使用者

```bash
# Update to latest version
git pull origin main
npm install
```

### For Developers | 給開發者

```bash
# Update dependencies
npm install

# Review CHANGELOG.md for details
cat CHANGELOG.md
```

---

## 📊 Technical Details | 技術細節

- **Node.js**: [Minimum version]
- **Dependencies**: [Key dependency updates]
- **Container**: [Podman/Docker version compatibility]

---

## 🙏 Contributors | 貢獻者

- [Contributor names]
- AI Co-Authored by: Claude Sonnet 4.5

---

## 🔗 Links | 相關連結

- [CHANGELOG](../../CHANGELOG.md)
- [GitHub Release](https://github.com/matheme-justyn/aislidev/releases/tag/v[VERSION])
- [Documentation](../../README.md)

---

**Full Changelog**: https://github.com/matheme-justyn/aislidev/compare/v[PREVIOUS_VERSION]...v[VERSION]
```

---

## Example: v0.1.0 Release Note
<!-- 範例：v0.1.0 Release Note -->

```markdown
# Release v0.1.0 - Lightweight Containerization
# 版本 v0.1.0 發布 - 輕量容器化架構

> **Release Date**: 2026-02-11
> **發布日期**: 2026-02-11

---

## 🎯 Overview | 概述

First functional release with lightweight containerization architecture and Fastify web server.
<!-- 首個功能性版本，包含輕量容器化架構和 Fastify Web 伺服器。 -->

---

## ✨ What's New | 新功能

### Infrastructure | 基礎架構

- **Lightweight Containerization** - Single-container architecture with Podman/Docker support
  - 輕量容器化 - 單一容器架構，支援 Podman/Docker
  - Technical details: OCI-compatible Containerfile, production-ready

- **Fastify Web Server** - High-performance web server with TypeScript
  - Fastify Web 伺服器 - 高效能 Web 伺服器，使用 TypeScript
  - Technical details: RESTful API foundation, health check endpoint

### Configuration | 配置

- **Environment Configuration System** - .env file support with intelligent defaults
  - 環境配置系統 - 支援 .env 檔案，具備智能預設值
  - Technical details: dotenv package, validation

- **Auto Port Selection** - Automatic port conflict resolution for development
  - 自動 Port 選擇 - 開發環境自動解決 port 衝突
  - Technical details: get-port package, configurable with AUTO_PORT_SELECTION flag

---

## 🔧 Improvements | 改進

- **Simplified README.md** - Reduced to under 250 lines, human-friendly format
  - 簡化 README.md - 縮減至 250 行以內，人性化格式

- **Added Slidev Explanation** - Help users unfamiliar with Slidev understand the platform
  - 添加 Slidev 說明 - 幫助不熟悉 Slidev 的使用者了解平台

---

## 🐛 Bug Fixes | 錯誤修復

No bug fixes in this release (initial functional release).
<!-- 此版本無錯誤修復（首個功能性版本）。 -->

---

## 📚 Documentation | 文檔

- Port configuration guide (PORT_CONFIGURATION.md)
  - Port 配置指南
- Documentation maintenance guide (DOCUMENTATION_MAINTENANCE.md)
  - 文檔維護指南
- Quick start guide (QUICKSTART.md)
  - 快速開始指南
- ADR-002: Lightweight containerization architecture
  - ADR-002：輕量容器化架構

---

## ⚠️ Breaking Changes | 破壞性變更

None (Pre-Release 0.x.x stage)
<!-- 無（Pre-Release 0.x.x 階段）-->

---

## 🚀 Upgrade Guide | 升級指南

### For Users | 給使用者

```bash
# Clone repository
git clone https://github.com/matheme-justyn/aislidev.git
cd aislidev

# Install dependencies
npm install

# (Optional) Configure environment
cp .env.example .env

# Start development server
npm run dev
```

### For Developers | 給開發者

```bash
# Install dependencies
npm install

# Review documentation
cat docs/guides/QUICKSTART.md
cat docs/guides/PORT_CONFIGURATION.md
```

---

## 📊 Technical Details | 技術細節

- **Node.js**: >=20.0.0
- **Dependencies**:
  - Fastify 5.2.0
  - dotenv 17.2.4
  - get-port 7.1.0
- **Container**: Podman/Docker (OCI-compatible)

---

## 🙏 Contributors | 貢獻者

- Justyn Chen
- AI Co-Authored by: Claude Sonnet 4.5

---

## 🔗 Links | 相關連結

- [CHANGELOG](../../CHANGELOG.md)
- [GitHub Release](https://github.com/matheme-justyn/aislidev/releases/tag/v0.1.0)
- [Documentation](../../README.md)

---

**Full Changelog**: https://github.com/matheme-justyn/aislidev/compare/v0.0.1...v0.1.0
```

---

## Checklist for Creating Release Notes
<!-- Release Notes 建立檢查清單 -->

Before publishing a release, ensure:
<!-- 發布 release 前，確保： -->

- [ ] Version number follows Semantic Versioning
      <!-- 版本號遵循 Semantic Versioning -->
- [ ] CHANGELOG.md is updated with release details
      <!-- CHANGELOG.md 已更新發布詳情 -->
- [ ] README.md version badge is updated
      <!-- README.md 版本徽章已更新 -->
- [ ] package.json version is updated
      <!-- package.json 版本已更新 -->
- [ ] .cz.toml version is updated
      <!-- .cz.toml 版本已更新 -->
- [ ] Git tag is created: `git tag -a v[VERSION] -m "Release v[VERSION]"`
      <!-- Git tag 已建立 -->
- [ ] All commits follow Conventional Commits format
      <!-- 所有 commits 遵循 Conventional Commits 格式 -->
- [ ] Release note is created in docs/releases/ (if applicable)
      <!-- 在 docs/releases/ 中建立 release note（如適用） -->
- [ ] Documentation links are correct
      <!-- 文檔連結正確 -->
- [ ] Upgrade instructions are tested
      <!-- 升級說明已測試 -->

---

## Notes on Pre-Release Versions
<!-- Pre-Release 版本注意事項 -->

During the **Pre-Release (0.x.x)** stage:
<!-- 在 Pre-Release（0.x.x）階段： -->

- Breaking changes still result in MINOR version bumps (not MAJOR)
  <!-- 破壞性變更仍然觸發 MINOR 版本更新（不是 MAJOR） -->
- Focus on "What's New" and "Improvements" sections
  <!-- 著重於「新功能」和「改進」章節 -->
- Always ask: "Are we ready for 1.0.0 release?" before each version
  <!-- 每次版本前都詢問：「我們準備好進入 1.0.0 了嗎？」 -->
- Document experimental features and known limitations
  <!-- 記錄實驗性功能和已知限制 -->

---

## Transition to 1.0.0
<!-- 過渡到 1.0.0 -->

When transitioning from 0.x.x to 1.0.0:
<!-- 從 0.x.x 過渡到 1.0.0 時： -->

1. **Verify readiness**:
   <!-- 驗證準備度： -->
   - [ ] POC/MVP complete
         <!-- POC/MVP 完成 -->
   - [ ] Core features stable
         <!-- 核心功能穩定 -->
   - [ ] Documentation complete
         <!-- 文檔完整 -->
   - [ ] Testing coverage adequate
         <!-- 測試覆蓋率足夠 -->

2. **Create comprehensive 1.0.0 release note**:
   <!-- 建立完整的 1.0.0 release note： -->
   - Highlight all major features
     <!-- 突出所有主要功能 -->
   - Document migration from 0.x.x
     <!-- 記錄從 0.x.x 的遷移 -->
   - Set expectations for future MAJOR versions
     <!-- 為未來的 MAJOR 版本設定期望 -->

3. **Announce**:
   <!-- 公告： -->
   - Update README.md with "Stable Release" status
     <!-- 更新 README.md 為「穩定版本」狀態 -->
   - Create GitHub release with detailed notes
     <!-- 建立詳細的 GitHub release -->
   - Consider announcement channels (if applicable)
     <!-- 考慮公告管道（如適用） -->
