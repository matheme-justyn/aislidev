# Quick Start Guide
<!-- 快速開始指南 -->

## Prerequisites
<!-- 前置需求 -->

- Node.js 20+ (for local development)
<!-- Node.js 20+（本地開發用） -->

- Podman or Docker (for containerized deployment)
<!-- Podman 或 Docker（容器化部署用） -->

---

## Local Development
<!-- 本地開發 -->

### 1. Install Dependencies
<!-- 1. 安裝依賴 -->

```bash
npm install
```

### 2. Run Development Server
<!-- 2. 運行開發伺服器 -->

```bash
npm run dev
```

The server will start on http://localhost:3000
<!-- 伺服器將啟動在 http://localhost:3000 -->

### 3. Build for Production
<!-- 3. 生產環境建置 -->

```bash
npm run build
npm start
```

---

## Containerized Deployment (Podman)
<!-- 容器化部署（Podman） -->

### 1. Build Container Image
<!-- 1. 建置容器映像 -->

```bash
podman build -t aislidev:latest -f Containerfile .
```

**Alternative using Docker**:
<!-- 使用 Docker 的替代方式： -->

```bash
docker build -t aislidev:latest -f Containerfile .
```

### 2. Run Container
<!-- 2. 運行容器 -->

```bash
podman run -d \
  --name aislidev \
  -p 3000:3000 \
  -v ./data:/app/data:Z \
  aislidev:latest
```

**Explanation of flags**:
<!-- 參數說明： -->

- `-d`: Run in detached mode (background)
<!-- -d：在分離模式下運行（背景） -->

- `--name aislidev`: Name the container
<!-- --name aislidev：命名容器 -->

- `-p 3000:3000`: Map port 3000 (host:container)
<!-- -p 3000:3000：對應 port 3000（主機:容器） -->

- `-v ./data:/app/data:Z`: Mount data directory with SELinux label
<!-- -v ./data:/app/data:Z：掛載 data 目錄並加上 SELinux 標籤 -->

**Using Docker**:
<!-- 使用 Docker： -->

```bash
docker run -d \
  --name aislidev \
  -p 3000:3000 \
  -v ./data:/app/data \
  aislidev:latest
```

### 3. Verify Container is Running
<!-- 3. 驗證容器運行 -->

```bash
# Check container status
podman ps

# View logs
podman logs aislidev

# Check health
curl http://localhost:3000/health
```

### 4. Stop and Remove Container
<!-- 4. 停止並移除容器 -->

```bash
# Stop container
podman stop aislidev

# Remove container
podman rm aislidev
```

---

## Podman vs Docker
<!-- Podman vs Docker -->

This project uses **Podman** as the primary container tool, but is fully compatible with Docker.
<!-- 本專案使用 Podman 作為主要容器工具，但完全相容 Docker。 -->

### Why Podman?
<!-- 為什麼用 Podman？ -->

- ✅ **Daemonless**: No background daemon required
<!-- 無 daemon：不需要背景常駐程式 -->

- ✅ **Rootless**: Can run as non-root user for better security
<!-- Rootless：可以非 root 使用者運行，更安全 -->

- ✅ **OCI-compatible**: Works with standard container images
<!-- OCI 相容：可以使用標準容器映像 -->

- ✅ **Docker-compatible**: Almost identical CLI commands
<!-- Docker 相容：幾乎相同的 CLI 命令 -->

### Switching Between Podman and Docker
<!-- 在 Podman 和 Docker 之間切換 -->

You can create an alias to use Docker commands with Podman:
<!-- 你可以建立別名來用 Docker 命令執行 Podman： -->

```bash
alias docker=podman
```

Or use Docker directly - the Containerfile works with both.
<!-- 或直接使用 Docker - Containerfile 兩者都相容。 -->

---

## Accessing the Application
<!-- 訪問應用程式 -->

Once running, access the application at:
<!-- 運行後，在以下位置訪問應用程式： -->

- **Web UI**: http://localhost:3000
- **API**: http://localhost:3000/api
- **Health Check**: http://localhost:3000/health

---

## Environment Variables
<!-- 環境變數 -->

You can customize the application using environment variables:
<!-- 你可以使用環境變數自訂應用程式： -->

```bash
podman run -d \
  --name aislidev \
  -p 3000:3000 \
  -e PORT=3000 \
  -e HOST=0.0.0.0 \
  -e LOG_LEVEL=info \
  -v ./data:/app/data:Z \
  aislidev:latest
```

**Available variables**:
<!-- 可用變數： -->

- `PORT`: Server port (default: 3000)
<!-- PORT：伺服器 port（預設：3000） -->

- `HOST`: Server host (default: 0.0.0.0)
<!-- HOST：伺服器主機（預設：0.0.0.0） -->

- `LOG_LEVEL`: Logging level (default: info)
<!-- LOG_LEVEL：日誌級別（預設：info） -->

---

## Troubleshooting
<!-- 故障排除 -->

### Container won't start
<!-- 容器無法啟動 -->

```bash
# Check logs for errors
podman logs aislidev

# Verify image was built correctly
podman images
```

### Port already in use
<!-- Port 已被使用 -->

```bash
# Use a different port
podman run -d --name aislidev -p 8080:3000 aislidev:latest
```

### SELinux issues (Podman)
<!-- SELinux 問題（Podman） -->

If you encounter permission issues with volume mounts on SELinux-enabled systems:
<!-- 如果在啟用 SELinux 的系統上遇到 volume 掛載權限問題： -->

```bash
# Use :Z flag for SELinux labeling
-v ./data:/app/data:Z
```

### Health check fails
<!-- 健康檢查失敗 -->

```bash
# Test health endpoint manually
curl http://localhost:3000/health

# If container is running but unreachable, check firewall
sudo firewall-cmd --list-all
```

---

## Next Steps
<!-- 下一步 -->

- See [Architecture Decision Records](../architecture/ADR/) for design decisions
<!-- 查看架構決策記錄了解設計決策 -->

- Check [CLAUDE.md](../../CLAUDE.md) for development guidelines
<!-- 查看 CLAUDE.md 了解開發指南 -->

- Read [ADR-002](../architecture/ADR/002-lightweight-containerization.md) for containerization strategy
<!-- 閱讀 ADR-002 了解容器化策略 -->
