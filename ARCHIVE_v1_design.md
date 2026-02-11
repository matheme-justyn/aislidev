# Slidev AI Platform - 第一版設計記錄

> **建檔日期**: 2026-02-11  
> **狀態**: 已廢棄，重新設計中

## 設計概述

這是 Slidev AI Platform 的第一個設計版本，採用前後端分離架構，整合 Monaco Editor 和 Slidev 預覽功能。

## 技術架構

### 前端
- **框架**: Vue 3 + TypeScript
- **編輯器**: Monaco Editor
- **建置工具**: Vite
- **狀態管理**: Pinia
- **路由**: Vue Router
- Port: 5003

### 後端
- **框架**: Node.js + Express + TypeScript
- **資料庫**: PostgreSQL (Port 5001)
- **ORM**: Prisma
- **認證**: JWT
- Port: 5002

### 基礎設施
- **容器化**: Podman Compose
- **反向代理**: Nginx (Port 5005)
- **Slidev 預覽**: 動態 port 池 (13800-13900)

## 核心功能設計

### 1. Monaco Editor 整合
- Markdown 語法高亮
- 即時編輯
- 選取文字功能
- 自動儲存（debounce 2 秒）

### 2. Slidev 預覽
- 使用 iframe 嵌入
- 動態 port 管理
- 即時更新機制
- 簡報者模式支援

### 3. 使用者認證
- JWT token 認證
- 登入/註冊功能
- 密碼 hash (bcrypt)

### 4. 簡報管理
- CRUD 操作
- 資料庫儲存 (PostgreSQL)
- 使用者隔離

### 5. AI 功能（規劃中）
- 內容優化
- 圖片生成
- 原計畫整合 Presenton API（後來移除）

## 資料庫 Schema

### Users 表
```prisma
model User {
  id            String          @id @default(uuid())
  email         String          @unique
  passwordHash  String
  name          String
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt
  presentations Presentation[]
}
```

### Presentations 表
```prisma
model Presentation {
  id        String   @id @default(uuid())
  userId    String
  title     String
  content   String   @db.Text
  theme     String   @default("default")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(fields: [userId], references: [id])
}
```

## API 端點

### 認證
- `POST /api/auth/register` - 註冊
- `POST /api/auth/login` - 登入

### 簡報
- `GET /api/presentations` - 取得簡報列表
- `POST /api/presentations` - 建立簡報
- `GET /api/presentations/:id` - 取得單一簡報
- `PUT /api/presentations/:id` - 更新簡報
- `DELETE /api/presentations/:id` - 刪除簡報

### Slidev
- `POST /api/slidev/start/:id` - 啟動預覽伺服器
- `POST /api/slidev/update/:id` - 更新簡報內容
- `POST /api/slidev/stop/:id` - 停止預覽伺服器

### 模板
- `GET /api/templates` - 取得模板列表

### AI（未完成）
- `POST /api/ai/optimize` - 內容優化
- `POST /api/ai/generate-images` - 圖片生成

## 部署設定

### 環境變數
```bash
# 資料庫
POSTGRES_PORT=5001
POSTGRES_PASSWORD=********

# JWT
JWT_SECRET=********

# Port 配置
BACKEND_PORT=5002
FRONTEND_PORT=5003
NGINX_HTTP_PORT=5005

# Slidev
SLIDEV_PORT_START=13800
SLIDEV_PORT_END=13900
```

### Podman Compose 服務
- `postgres` - PostgreSQL 資料庫
- `backend` - Express API 伺服器
- `frontend` - Vue.js 靜態檔案伺服器
- `nginx` - 反向代理

## 檔案結構

```
aislidev/
├── backend/
│   ├── src/
│   │   ├── controllers/  # API 控制器
│   │   ├── services/     # 業務邏輯
│   │   ├── routes/       # 路由定義
│   │   ├── middleware/   # 中介層
│   │   ├── types/        # TypeScript 型別
│   │   └── utils/        # 工具函數
│   ├── prisma/
│   │   └── schema.prisma # 資料庫 schema
│   ├── uploads/          # 檔案上傳目錄
│   ├── exports/          # 匯出檔案
│   └── templates/        # 簡報模板
├── frontend/
│   ├── src/
│   │   ├── views/        # 頁面元件
│   │   ├── services/     # API 服務
│   │   ├── stores/       # Pinia stores
│   │   ├── router/       # 路由設定
│   │   └── types/        # TypeScript 型別
│   └── Dockerfile
├── screenshots/          # 截圖
├── ssl/                  # SSL 憑證
├── podman-compose.yml    # 容器編排
├── nginx.conf            # Nginx 設定
└── deploy.sh             # 部署腳本
```

## 主要問題與限制

### 1. Slidev 預覽問題
- iframe 載入失敗
- HMR 連線問題
- Port 管理複雜

### 2. 架構複雜度
- 需要管理多個 Slidev 實例
- Port 池設計複雜
- 容器間通訊問題

### 3. 開發體驗
- 前後端分離導致除錯困難
- 預覽更新不即時
- 需要多個容器同時運行

### 4. 效能問題
- 每個簡報需要獨立的 Slidev 伺服器
- 資源消耗大
- 啟動時間長

## 已知 Bug

1. Slidev 預覽在 iframe 中無法正確載入
2. HMR WebSocket 連線失敗
3. Port 13800 綁定失敗
4. 靜態建置無法正確顯示投影片

## 廢棄原因

經過評估，決定重新設計，原因：
1. 架構過於複雜，不適合單人使用
2. Slidev iframe 整合問題難以解決
3. 資源消耗過大
4. 開發除錯困難

## 改進方向

下一版本考慮：
1. 簡化架構，可能不使用容器化
2. 重新思考 Slidev 整合方式
3. 考慮使用 Slidev 的靜態建置功能
4. 減少服務數量，降低複雜度
5. 更好的預覽方案

## 參考文件

- [完整規格文件](./slidev-ai-platform-complete-spec.md)
- [README](./README.md)
- [Slidev 預覽問題記錄](./SLIDEV_PREVIEW_FIX.md)
- [Slidev 靜態建置方案](./SLIDEV_STATIC_BUILD_SOLUTION.md)
- [服務說明](./SERVICES.md)

---

**註記**: 此版本設計已廢棄，僅作為記錄保存。
