# Port Configuration Guide
<!-- Port 配置指南 -->

## Overview
<!-- 概述 -->

AISliDev automatically manages port allocation to avoid conflicts with other services.
<!-- AISliDev 自動管理 port 分配以避免與其他服務衝突。 -->

---

## Quick Start
<!-- 快速開始 -->

### 1. Use Default Port (3000)
<!-- 1. 使用預設 Port（3000） -->

```bash
npm run dev
```

If port 3000 is available, the server will start on http://localhost:3000
<!-- 如果 port 3000 可用，伺服器將在 http://localhost:3000 啟動 -->

### 2. Port 3000 is Occupied
<!-- 2. Port 3000 被佔用 -->

**The server will automatically find the next available port!**
<!-- 伺服器會自動找到下一個可用的 port！ -->

When port 3000 is in use, you'll see:
<!-- 當 port 3000 被佔用時，你會看到： -->

```
⚠️  Port 3000 is already in use.
✅ Using port 3001 instead.
💡 To use a different port, set PORT in your .env file or run: PORT=3001 npm run dev
```

### 3. Specify a Custom Port
<!-- 3. 指定自訂 Port -->

#### Method A: Environment Variable (Temporary)
<!-- 方法 A：環境變數（臨時） -->

```bash
PORT=8080 npm run dev
```

#### Method B: .env File (Persistent)
<!-- 方法 B：.env 檔案（持久） -->

1. Copy `.env.example` to `.env`:
<!-- 複製 .env.example 為 .env： -->

```bash
cp .env.example .env
```

2. Edit `.env` and set your preferred port:
<!-- 編輯 .env 並設定你偏好的 port： -->

```bash
PORT=8080
HOST=0.0.0.0
LOG_LEVEL=info
```

3. Start the server:
<!-- 啟動伺服器： -->

```bash
npm run dev
```

### 4. Disable Auto Port Selection (Production/Strict Mode)
<!-- 4. 停用自動 Port 選擇（生產環境/嚴格模式） -->

**Use case**: When you need a fixed port (production servers, multi-service hosts)
<!-- 使用情境：需要固定 port 時（生產伺服器、多服務主機） -->

In `.env`:
<!-- 在 .env 中： -->

```bash
PORT=3000
AUTO_PORT_SELECTION=false
```

With this setting:
<!-- 使用此設定： -->

- ✅ Server will **only** use port 3000
  <!-- 伺服器將**僅**使用 port 3000 -->

- ❌ If port 3000 is occupied, server will **fail to start** (no auto-selection)
  <!-- 如果 port 3000 被佔用，伺服器將**啟動失敗**（不自動選擇） -->

- 🔒 Prevents unexpected port changes in production
  <!-- 防止生產環境中的意外 port 變更 -->

**When to use**:
<!-- 何時使用： -->

- Production environments
  <!-- 生產環境 -->

- Multi-service hosts where port conflicts must be explicit
  <!-- 多服務主機，port 衝突必須明確顯示 -->

- CI/CD pipelines with fixed port requirements
  <!-- 具有固定 port 需求的 CI/CD 管道 -->

- When using load balancers or reverse proxies
  <!-- 使用負載均衡器或反向代理時 -->

---

## How It Works
<!-- 運作原理 -->

AISliDev uses the [`get-port`](https://github.com/sindresorhus/get-port) package to intelligently manage ports:
<!-- AISliDev 使用 get-port 套件智能管理 port： -->

### Development Mode (AUTO_PORT_SELECTION=true, default)
<!-- 開發模式（AUTO_PORT_SELECTION=true，預設） -->

1. **Try Preferred Port**: First attempts to use the port from `PORT` env variable (default: 3000)
<!-- 嘗試偏好 Port：首先嘗試使用 PORT 環境變數的 port（預設：3000） -->

2. **Auto-Find Alternative**: If occupied, automatically finds the next available port (3001, 3002, etc.)
<!-- 自動尋找替代：如果被佔用，自動找下一個可用的 port（3001、3002 等） -->

3. **Notify User**: Clearly displays which port is being used
<!-- 通知使用者：清楚顯示正在使用哪個 port -->

### Production Mode (AUTO_PORT_SELECTION=false)
<!-- 生產模式（AUTO_PORT_SELECTION=false） -->

1. **Use Fixed Port**: Only uses the port specified in `PORT` env variable
<!-- 使用固定 Port：僅使用 PORT 環境變數指定的 port -->

2. **Fail on Conflict**: If the port is occupied, the server fails to start with an error
<!-- 衝突時失敗：如果 port 被佔用，伺服器啟動失敗並報錯 -->

3. **Predictable Behavior**: Ensures consistent port usage across deployments
<!-- 可預測行為：確保跨部署時使用一致的 port -->

---

## Configuration Options
<!-- 配置選項 -->

### Environment Variables
<!-- 環境變數 -->

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port number |
| `HOST` | `0.0.0.0` | Server host (0.0.0.0 = all interfaces) |
| `AUTO_PORT_SELECTION` | `true` | Auto-select available port if preferred is occupied |
| `LOG_LEVEL` | `info` | Logging level (info, debug, warn, error) |
| `NODE_ENV` | `development` | Environment mode |

<!-- 變數 | 預設值 | 說明 -->
<!-- PORT | 3000 | 伺服器 port 號 -->
<!-- HOST | 0.0.0.0 | 伺服器主機（0.0.0.0 = 所有介面） -->
<!-- AUTO_PORT_SELECTION | true | 如果偏好 port 被佔用則自動選擇可用 port -->
<!-- LOG_LEVEL | info | 日誌級別（info、debug、warn、error） -->
<!-- NODE_ENV | development | 環境模式 -->

### .env File Example
<!-- .env 檔案範例 -->

```bash
# Server Configuration
PORT=8080
HOST=0.0.0.0

# Logging
LOG_LEVEL=debug

# Development
NODE_ENV=development
```

---

## Common Scenarios
<!-- 常見場景 -->

### Scenario 1: Running Multiple Instances
<!-- 場景 1：運行多個實例 -->

To run multiple AISliDev instances simultaneously:
<!-- 要同時運行多個 AISliDev 實例： -->

```bash
# Terminal 1
PORT=3000 npm run dev

# Terminal 2
PORT=3001 npm run dev

# Terminal 3
PORT=3002 npm run dev
```

### Scenario 2: Port Conflict with Other Service
<!-- 場景 2：與其他服務 Port 衝突 -->

If port 3000 is used by another service (e.g., React dev server):
<!-- 如果 port 3000 被其他服務使用（例如 React 開發伺服器）： -->

**Option A**: Let AISliDev auto-select a port
<!-- 選項 A：讓 AISliDev 自動選擇 port -->

```bash
npm run dev
# Will use 3001, 3002, etc.
```

**Option B**: Set a different default port
<!-- 選項 B：設定不同的預設 port -->

```bash
# Create .env file
echo "PORT=8080" > .env

# Start server
npm run dev
```

### Scenario 3: Container Deployment
<!-- 場景 3：容器部署 -->

When running in a container, set the port via environment variable:
<!-- 在容器中運行時，透過環境變數設定 port： -->

```bash
podman run -d \
  -e PORT=3000 \
  -p 8080:3000 \
  aislidev:latest
```

This maps container port 3000 to host port 8080.
<!-- 這會將容器 port 3000 對應到主機 port 8080。 -->

---

## Troubleshooting
<!-- 故障排除 -->

### Problem: "Port already in use" error won't go away
<!-- 問題：「Port 已被使用」錯誤不消失 -->

**Solution**: Check for zombie processes
<!-- 解決方案：檢查僵屍進程 -->

```bash
# Find process using the port
lsof -i :3000

# Kill the process (replace PID with actual process ID)
kill -9 <PID>
```

### Problem: Server binds to 0.0.0.0 but can't access from network
<!-- 問題：伺服器綁定到 0.0.0.0 但無法從網路訪問 -->

**Solution**: Check firewall settings
<!-- 解決方案：檢查防火牆設定 -->

```bash
# macOS
sudo pfctl -d  # Disable firewall temporarily

# Linux
sudo firewall-cmd --add-port=3000/tcp --permanent
sudo firewall-cmd --reload
```

### Problem: .env file is not loaded
<!-- 問題：.env 檔案未載入 -->

**Solution**: Ensure .env is in the project root
<!-- 解決方案：確保 .env 在專案根目錄 -->

```bash
# Check .env location
ls -la .env

# Should be at project root, same level as package.json
```

---

## Best Practices
<!-- 最佳實踐 -->

1. **Use .env for personal preferences**: Don't commit `.env` to version control
<!-- 使用 .env 作為個人偏好：不要將 .env 提交到版本控制 -->

2. **Document custom ports**: If you use non-standard ports, document them in your team's wiki
<!-- 記錄自訂 port：如果使用非標準 port，在團隊 wiki 中記錄 -->

3. **Let auto-select work**: Trust the automatic port selection in development
<!-- 讓自動選擇運作：在開發中信任自動 port 選擇 -->

4. **Use standard ports in production**: Stick to 3000 or 80/443 in production
<!-- 生產環境使用標準 port：在生產環境堅持使用 3000 或 80/443 -->

---

## Related Documentation
<!-- 相關文檔 -->

- [Quick Start Guide](./QUICKSTART.md) - General setup instructions
<!-- 快速開始指南 - 一般設定說明 -->

- [Architecture Decision Records](../architecture/ADR/) - Design decisions
<!-- 架構決策記錄 - 設計決策 -->

- [CLAUDE.md](../../CLAUDE.md) - Project configuration
<!-- CLAUDE.md - 專案配置 -->
