# ADR 001: Version Control and Release Strategy
<!-- ADR 001：版本控制和發布策略 -->

## Status
<!-- 狀態 -->

**Accepted** - 2026-02-11
<!-- 已接受 - 2026-02-11 -->

## Context
<!-- 背景 -->

AISliDev is being redesigned from scratch after v1 encountered significant architectural issues. As we restart the project, we need to establish a clear version control and release strategy that:
<!-- AISliDev 在 v1 遇到重大架構問題後正在從頭重新設計。當我們重啟專案時，我們需要建立清晰的版本控制和發布策略，需要： -->

1. Provides clear version numbering that communicates the nature of changes
<!-- 提供清晰的版本編號，傳達變更的性質 -->

2. Enables automation of version bumps and changelog generation
<!-- 能夠自動化版本更新和變更日誌生成 -->

3. Works across multiple potential technology stacks (project is in redesign phase)
<!-- 適用於多種潛在的技術棧（專案處於重新設計階段） -->

4. Supports a documentation-driven, AI-first development approach
<!-- 支援文檔驅動、AI 優先的開發方式 -->

5. Remains simple and maintainable for a small team or solo developer
<!-- 對小團隊或單人開發者保持簡單和可維護 -->

## Decision
<!-- 決策 -->

We will adopt **Semantic Versioning 2.0.0** with **Conventional Commits** as the foundation for our version control strategy.
<!-- 我們將採用 **Semantic Versioning 2.0.0** 搭配 **Conventional Commits** 作為版本控制策略的基礎。 -->

### Version Numbering
<!-- 版本編號 -->

Follow Semantic Versioning format: `MAJOR.MINOR.PATCH`
<!-- 遵循語義化版本格式：MAJOR.MINOR.PATCH -->

- **MAJOR**: Incompatible API changes or major architecture changes
<!-- MAJOR：不相容的 API 變更或重大架構變更 -->

- **MINOR**: New features that are backward-compatible
<!-- MINOR：向後相容的新功能 -->

- **PATCH**: Backward-compatible bug fixes
<!-- PATCH：向後相容的錯誤修復 -->

### Commit Message Format
<!-- 提交訊息格式 -->

All commits MUST follow the Conventional Commits specification:
<!-- 所有提交都必須遵循 Conventional Commits 規範： -->

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
<!-- 類型： -->

- `feat`: New feature (triggers MINOR version bump)
<!-- feat：新功能（觸發 MINOR 版本更新） -->

- `fix`: Bug fix (triggers PATCH version bump)
<!-- fix：錯誤修復（觸發 PATCH 版本更新） -->

- `docs`: Documentation only changes
<!-- docs：僅文檔變更 -->

- `style`: Code style changes (formatting, missing semicolons, etc.)
<!-- style：程式碼風格變更（格式化、缺少分號等） -->

- `refactor`: Code refactoring without feature changes
<!-- refactor：程式碼重構，不改變功能 -->

- `perf`: Performance improvements
<!-- perf：效能改善 -->

- `test`: Adding or updating tests
<!-- test：新增或更新測試 -->

- `build`: Build system or dependency changes
<!-- build：建置系統或相依性變更 -->

- `ci`: CI/CD configuration changes
<!-- ci：CI/CD 配置變更 -->

- `chore`: Other changes that don't modify src or test files
<!-- chore：不修改 src 或 test 檔案的其他變更 -->

**Breaking Changes**:
<!-- 破壞性變更： -->

Include `BREAKING CHANGE:` in the footer or add `!` after the type/scope to trigger MAJOR version bump.
<!-- 在 footer 中包含 `BREAKING CHANGE:` 或在 type/scope 後加上 `!` 來觸發 MAJOR 版本更新。 -->

Example:
<!-- 範例： -->

```
feat!: redesign Slidev integration API

BREAKING CHANGE: The iframe-based approach is replaced with native integration.
This requires updating all existing presentation configurations.
```

### Automation Strategy
<!-- 自動化策略 -->

**Phase 1** (Current - during architecture redesign):
<!-- 階段 1（目前 - 架構重新設計期間）： -->

- Manual version management using conventional commits
<!-- 使用 conventional commits 進行手動版本管理 -->

- Manual CHANGELOG.md updates
<!-- 手動更新 CHANGELOG.md -->

**Phase 2** (After technology stack is decided):
<!-- 階段 2（技術棧確定後）： -->

Select and implement automation tools based on chosen stack:
<!-- 根據所選技術棧選擇並實作自動化工具： -->

- **JavaScript/TypeScript**: `semantic-release` or `changesets`
<!-- JavaScript/TypeScript：semantic-release 或 changesets -->

- **Python**: `python-semantic-release`
<!-- Python：python-semantic-release -->

- **Multi-language**: `commitizen`
<!-- 多語言：commitizen -->

## Consequences
<!-- 後果 -->

### Positive
<!-- 正面影響 -->

1. **Clear communication**: Version numbers clearly indicate the nature of changes
<!-- 清晰溝通：版本號清楚表明變更的性質 -->

2. **Automation-ready**: Conventional commits enable future automation
<!-- 準備好自動化：Conventional commits 使未來的自動化成為可能 -->

3. **Technology agnostic**: Strategy works regardless of final technology choice
<!-- 技術無關：策略不受最終技術選擇影響 -->

4. **Documentation-driven**: Commit messages serve as living documentation
<!-- 文檔驅動：提交訊息作為活文檔 -->

5. **Industry standard**: Uses widely-adopted standards (semver, conventional commits)
<!-- 業界標準：使用廣泛採用的標準（semver、conventional commits） -->

### Negative
<!-- 負面影響 -->

1. **Initial overhead**: Team members must learn the commit message format
<!-- 初始開銷：團隊成員必須學習提交訊息格式 -->

2. **Discipline required**: Requires consistent adherence to conventions
<!-- 需要紀律：需要持續遵守慣例 -->

3. **Delayed automation**: Full automation deferred until tech stack is finalized
<!-- 延遲自動化：完整自動化延遲到技術棧確定 -->

### Mitigation
<!-- 緩解措施 -->

1. Use commitizen or similar tools to guide commit message creation
<!-- 使用 commitizen 或類似工具來引導提交訊息建立 -->

2. Add pre-commit hooks to validate commit message format
<!-- 新增 pre-commit hooks 來驗證提交訊息格式 -->

3. Document examples in CLAUDE.md for easy reference
<!-- 在 CLAUDE.md 中記錄範例以便參考 -->

## Alternatives Considered
<!-- 考慮的替代方案 -->

### 1. CalVer (Calendar Versioning)
<!-- 1. CalVer（日曆版本控制） -->

Format: `YYYY.MM.MICRO` (e.g., 2026.02.1)
<!-- 格式：YYYY.MM.MICRO（例如 2026.02.1） -->

**Rejected because**:
<!-- 拒絕原因： -->

- Less semantic meaning about the nature of changes
<!-- 關於變更性質的語義較少 -->

- Doesn't communicate compatibility information
<!-- 不傳達相容性資訊 -->

- Less tooling support for automation
<!-- 自動化工具支援較少 -->

### 2. Manual versioning without conventions
<!-- 2. 無慣例的手動版本控制 -->

**Rejected because**:
<!-- 拒絕原因： -->

- Prone to human error and inconsistency
<!-- 容易出現人為錯誤和不一致 -->

- Cannot be automated
<!-- 無法自動化 -->

- Doesn't scale as project grows
<!-- 隨著專案成長無法擴展 -->

### 3. Immediate tool selection
<!-- 3. 立即選擇工具 -->

Choose and implement automation tools (e.g., semantic-release) immediately.
<!-- 立即選擇並實作自動化工具（例如 semantic-release）。 -->

**Rejected because**:
<!-- 拒絕原因： -->

- Technology stack is still undecided (v2 architecture in design phase)
<!-- 技術棧仍未確定（v2 架構處於設計階段） -->

- Might need to change tools when stack is finalized
<!-- 確定技術棧時可能需要更換工具 -->

- Premature optimization
<!-- 過早優化 -->

## References
<!-- 參考資料 -->

- [Semantic Versioning 2.0.0](https://semver.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [semantic-release](https://github.com/semantic-release/semantic-release)
- [python-semantic-release](https://python-semantic-release.readthedocs.io/)
- [commitizen](https://commitizen-tools.github.io/commitizen/)

## Related Decisions
<!-- 相關決策 -->

- This ADR establishes the foundation for future automation decisions
<!-- 此 ADR 為未來的自動化決策奠定基礎 -->

- Technology stack selection (future ADR) will determine specific tooling
<!-- 技術棧選擇（未來的 ADR）將決定具體工具 -->
