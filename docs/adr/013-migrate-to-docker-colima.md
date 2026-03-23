# ADR-013: Migration from Podman to Docker + Colima on macOS
<!-- ADR-013：從 Podman 遷移到 Docker + Colima（macOS） -->

**Status**: Accepted
<!-- 狀態：已接受 -->

**Date**: 2026-03-23
<!-- 日期：2026-03-23 -->

**Deciders**: Development Team
<!-- 決策者：開發團隊 -->

**Related**: Supersedes [ADR-002](./002-lightweight-containerization.md) deployment strategy
<!-- 相關：取代 ADR-002 的部署策略 -->

---

## Context and Problem Statement
<!-- 背景與問題陳述 -->

The project initially supported both Podman and Docker as container runtimes, with deployment scripts auto-detecting the available runtime. However, on macOS, Podman has shown significant stability issues:
<!-- 專案最初同時支援 Podman 和 Docker 作為容器執行環境，部署腳本會自動偵測可用的執行環境。然而，在 macOS 上，Podman 表現出顯著的穩定性問題： -->

### Podman on macOS Issues
<!-- macOS 上的 Podman 問題 -->

1. **Frequent VM Freezes**: The Podman machine (running on VZ framework) frequently becomes unresponsive
<!-- VM 頻繁凍結：Podman machine（運行在 VZ framework 上）經常無回應 -->

2. **Build Hangs**: `podman build` commands hang indefinitely, requiring force-kill of vfkit process
<!-- 建置掛起：podman build 指令無限期掛起，需要強制終止 vfkit 進程 -->

3. **Poor Developer Experience**: Constant need to restart the Podman machine disrupts development workflow
<!-- 糟糕的開發體驗：持續需要重啟 Podman machine 中斷開發工作流程 -->

4. **macOS Integration**: Podman's VM-based approach on macOS adds complexity compared to native container solutions
<!-- macOS 整合：Podman 在 macOS 上基於 VM 的方式相較於原生容器解決方案增加了複雜性 -->

### Development Environment
<!-- 開發環境 -->

- **Primary Platform**: macOS (Apple Silicon M-series)
<!-- 主要平台：macOS（Apple Silicon M 系列） -->

- **Team Size**: Single developer / small team
<!-- 團隊規模：單一開發者 / 小型團隊 -->

- **Deployment Target**: Single-container application
<!-- 部署目標：單一容器應用程式 -->

---

## Decision Drivers
<!-- 決策驅動因素 -->

1. **Stability**: Need a reliable container runtime that doesn't require constant restarts
<!-- 穩定性：需要可靠的容器執行環境，不需要持續重啟 -->

2. **Developer Experience**: Minimize friction in the build-test-deploy cycle
<!-- 開發者體驗：最小化建置-測試-部署循環中的摩擦 -->

3. **macOS Native**: Better integration with macOS ecosystem
<!-- macOS 原生：與 macOS 生態系統更好的整合 -->

4. **Standard Tooling**: Use widely-adopted tools with better community support
<!-- 標準工具：使用廣泛採用且有更好社群支援的工具 -->

5. **Docker CLI Compatibility**: Maintain Docker CLI usage for familiarity
<!-- Docker CLI 相容性：保持 Docker CLI 使用以維持熟悉度 -->

---

## Decision
<!-- 決策 -->

**We will migrate from Podman to Docker + Colima as the primary container runtime on macOS.**
<!-- 我們將從 Podman 遷移到 Docker + Colima 作為 macOS 上的主要容器執行環境。 -->

### Implementation Details
<!-- 實作細節 -->

1. **Container Runtime**: Docker CLI + Colima backend
<!-- 容器執行環境：Docker CLI + Colima 後端 -->

2. **Containerfile → Dockerfile**: Rename primary container definition file
<!-- Containerfile → Dockerfile：重新命名主要容器定義檔案 -->
   - Create `Dockerfile` as the primary file
   <!-- 創建 Dockerfile 作為主要檔案 -->
   - Keep `Containerfile` for backward compatibility (if needed)
   <!-- 保留 Containerfile 以向後相容（如果需要） -->

3. **Deployment Script**: Update `deploy.sh` to prefer Docker over Podman
<!-- 部署腳本：更新 deploy.sh 優先使用 Docker 而非 Podman -->
   - Auto-detect Docker first, then Podman
   <!-- 先自動偵測 Docker，然後才是 Podman -->
   - Provide Colima installation instructions for macOS users
   <!-- 為 macOS 使用者提供 Colima 安裝指示 -->
   - Handle volume mount differences (Docker doesn't need `:Z` SELinux flag)
   <!-- 處理 volume mount 差異（Docker 不需要 :Z SELinux 標記） -->

4. **Documentation**: Update all references from "Podman or Docker" to "Docker (Colima on macOS)"
<!-- 文檔：將所有「Podman 或 Docker」的引用更新為「Docker（macOS 上的 Colima）」 -->

---

## Consequences
<!-- 後果 -->

### Positive
<!-- 正面 -->

- ✅ **Improved Stability**: Colima provides a stable container runtime on macOS without VM freezes
<!-- 改善的穩定性：Colima 在 macOS 上提供穩定的容器執行環境，沒有 VM 凍結問題 -->

- ✅ **Better Developer Experience**: No more manual VM restarts, faster build times
<!-- 更好的開發者體驗：不再需要手動重啟 VM，更快的建置時間 -->

- ✅ **Standard Docker CLI**: Uses familiar Docker commands and tooling
<!-- 標準 Docker CLI：使用熟悉的 Docker 指令和工具 -->

- ✅ **Active Development**: Colima is actively maintained and well-supported on macOS
<!-- 積極開發：Colima 在 macOS 上積極維護且有良好支援 -->

- ✅ **Lightweight**: Colima uses containerd by default, minimal resource overhead
<!-- 輕量級：Colima 預設使用 containerd，最小的資源開銷 -->

### Negative
<!-- 負面 -->

- ⚠️ **Platform Specific**: Primarily optimized for macOS, though Linux/Windows can still use Docker Desktop
<!-- 平台特定：主要針對 macOS 優化，雖然 Linux/Windows 仍可使用 Docker Desktop -->

- ⚠️ **Podman Users**: Existing Podman users need to install Colima + Docker
<!-- Podman 使用者：現有 Podman 使用者需要安裝 Colima + Docker -->

- ⚠️ **Migration Effort**: Need to update documentation and test on different platforms
<!-- 遷移工作：需要更新文檔並在不同平台上測試 -->

### Neutral
<!-- 中性 -->

- ℹ️ **Deployment Script Still Supports Both**: The `deploy.sh` script still auto-detects Podman if Docker is not available
<!-- 部署腳本仍支援兩者：deploy.sh 腳本仍會在 Docker 不可用時自動偵測 Podman -->

- ℹ️ **Containerfile Retained**: `Containerfile` is kept for users who prefer Podman naming
<!-- Containerfile 保留：為偏好 Podman 命名的使用者保留 Containerfile -->

---

## Alternatives Considered
<!-- 考慮的替代方案 -->

### Alternative 1: Continue with Podman
<!-- 替代方案 1：繼續使用 Podman -->

**Pros**:
<!-- 優點： -->
- No migration needed
<!-- 不需要遷移 -->
- True rootless containers by default
<!-- 預設的真正無 root 容器 -->

**Cons**:
<!-- 缺點： -->
- Stability issues on macOS persist
<!-- macOS 上的穩定性問題持續存在 -->
- Poor developer experience with frequent VM restarts
<!-- 頻繁 VM 重啟導致糟糕的開發者體驗 -->
- Limited adoption on macOS compared to Docker
<!-- 相較於 Docker，在 macOS 上的採用有限 -->

**Decision**: Rejected due to unacceptable stability issues that block development
<!-- 決策：因無法接受的穩定性問題阻礙開發而拒絕 -->

### Alternative 2: OrbStack
<!-- 替代方案 2：OrbStack -->

**Pros**:
<!-- 優點： -->
- Excellent macOS integration and performance
<!-- 優秀的 macOS 整合和效能 -->
- Fast startup times
<!-- 快速啟動時間 -->
- Docker CLI compatible
<!-- Docker CLI 相容 -->

**Cons**:
<!-- 缺點： -->
- Commercial product (free tier available but with limitations)
<!-- 商業產品（有免費層級但有限制） -->
- Less community adoption than Colima
<!-- 相較於 Colima 社群採用較少 -->
- Vendor lock-in concerns
<!-- 供應商鎖定疑慮 -->

**Decision**: Rejected in favor of Colima (open-source, free, widely adopted)
<!-- 決策：拒絕，選擇 Colima（開源、免費、廣泛採用） -->

### Alternative 3: Lima
<!-- 替代方案 3：Lima -->

**Pros**:
<!-- 優點： -->
- More general-purpose VM solution
<!-- 更通用的 VM 解決方案 -->
- Supports multiple container runtimes
<!-- 支援多種容器執行環境 -->

**Cons**:
<!-- 缺點： -->
- More complex setup than Colima
<!-- 比 Colima 設定更複雜 -->
- Colima is built on Lima but provides better Docker-specific integration
<!-- Colima 基於 Lima 建置但提供更好的 Docker 特定整合 -->

**Decision**: Rejected - Colima (which uses Lima under the hood) provides better Docker experience
<!-- 決策：拒絕 - Colima（底層使用 Lima）提供更好的 Docker 體驗 -->

---

## References
<!-- 參考資料 -->

- [Colima GitHub](https://github.com/abiosoft/colima)
- [Docker CLI Documentation](https://docs.docker.com/engine/reference/commandline/cli/)
- [ADR-002: Lightweight Containerization](./002-lightweight-containerization.md)
- [Podman on macOS Known Issues](https://github.com/containers/podman/issues?q=is%3Aissue+macos+vm+freeze)

---

## Implementation Checklist
<!-- 實作檢查清單 -->

- [x] Create `Dockerfile` from `Containerfile`
<!-- 從 Containerfile 創建 Dockerfile -->

- [x] Update `deploy.sh` to prefer Docker
<!-- 更新 deploy.sh 優先使用 Docker -->

- [x] Add Colima installation instructions
<!-- 添加 Colima 安裝指示 -->

- [x] Update `README.md` and `README.zh-TW.md`
<!-- 更新 README.md 和 README.zh-TW.md -->

- [ ] Update `AGENTS.md` deployment section
<!-- 更新 AGENTS.md 部署章節 -->

- [ ] Update all ADRs referencing Podman
<!-- 更新所有引用 Podman 的 ADR -->

- [ ] Test on macOS with Colima
<!-- 在 macOS 上使用 Colima 測試 -->

- [ ] Test on Linux with Docker
<!-- 在 Linux 上使用 Docker 測試 -->

- [ ] Update version number and CHANGELOG
<!-- 更新版本號和 CHANGELOG -->
