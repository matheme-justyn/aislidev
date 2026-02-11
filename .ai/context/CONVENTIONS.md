# Coding Conventions and Standards

<!-- 編碼規範和標準 -->

## Purpose

<!-- 目的 -->

This file defines coding conventions and standards for the AISliDev project. All AI assistants and human developers should follow these conventions to maintain consistency.

<!-- 此檔案定義 AISliDev 專案的編碼規範和標準。所有 AI 助手和人類開發者應遵循這些規範以保持一致性。 -->

---

## Language Conventions

<!-- 語言規範 -->

### For AI-Facing Documentation

<!-- 給 AI 的文檔 -->

Files that AI assistants read (like this one) MUST use:

<!-- AI 助手讀取的檔案（如本檔案）必須使用： -->

- **Primary language**: English
  <!-- 主要語言：英文 -->

- **Secondary language**: Traditional Chinese (Taiwan) in HTML comments
  <!-- 次要語言：繁體中文（台灣）在 HTML 註解中 -->

**Format**:

<!-- 格式： -->

```markdown
## Section Title

<!-- 區段標題 -->

English content here.

<!-- 這裡是英文內容。 -->
```

**AI-facing files include**:

<!-- 給 AI 的檔案包括： -->

- `AGENTS.md`
- `.ai/context/*.md`
- `docs/architecture/ADR/*.md`

### For User-Facing Documentation

<!-- 給使用者的文檔 -->

User documentation can be in any language appropriate for the audience:

<!-- 使用者文檔可以使用適合受眾的任何語言： -->

- `README.md` - Chinese or bilingual
  <!-- README.md - 中文或雙語 -->

- `CHANGELOG.md` - English or bilingual
  <!-- CHANGELOG.md - 英文或雙語 -->

- `docs/guides/*.md` - Chinese preferred for local team
  <!-- docs/guides/*.md - 本地團隊偏好中文 -->

---

## Git Conventions

<!-- Git 規範 -->

### Branch Naming

<!-- 分支命名 -->

Use descriptive branch names with type prefixes:

<!-- 使用帶有類型前綴的描述性分支名稱： -->

```
feature/<description>     # New features
fix/<description>         # Bug fixes
docs/<description>        # Documentation updates
refactor/<description>    # Code refactoring
test/<description>        # Test additions/updates
chore/<description>       # Maintenance tasks
```

**Examples**:

<!-- 範例： -->

```
feature/slidev-native-integration
fix/port-conflict-handling
docs/update-adr-003
refactor/simplify-server-startup
```

### Commit Message Format

<!-- Commit 訊息格式 -->

ALL commits MUST follow [Conventional Commits](https://www.conventionalcommits.org/):

<!-- 所有 commits 必須遵循 Conventional Commits： -->

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

**Types**:

<!-- 類型： -->

- `feat`: New feature → triggers MINOR bump
- `fix`: Bug fix → triggers PATCH bump
- `docs`: Documentation only
- `style`: Code style (formatting, whitespace)
- `refactor`: Code refactoring without feature changes
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `build`: Build system or dependency changes
- `ci`: CI/CD configuration
- `chore`: Other changes (tooling, etc.)

**Breaking changes**:

<!-- 破壞性變更： -->

Add `!` after type/scope OR include `BREAKING CHANGE:` in footer:

<!-- 在 type/scope 後加 ! 或在 footer 中包含 BREAKING CHANGE:： -->

```
feat!: redesign API structure

BREAKING CHANGE: The API endpoints have changed.
Old: /api/presentations
New: /api/v1/presentations
```

**Good examples**:

<!-- 好範例： -->

```
feat(api): add presentation CRUD endpoints
fix(server): resolve port conflict in development mode
docs: update architecture decision records
refactor: simplify error handling middleware
```

**Bad examples** (DON'T DO THIS):

<!-- 壞範例（不要這樣做）： -->

```
❌ added new feature
❌ Fix bug
❌ update docs
❌ WIP - still working on this
```

---

## Code Style

<!-- 程式碼風格 -->

### TypeScript/JavaScript

<!-- TypeScript/JavaScript -->

#### File Naming

<!-- 檔案命名 -->

- **Source files**: `kebab-case.ts` (e.g., `presentation-service.ts`)
  <!-- 原始檔：kebab-case.ts -->

- **Components**: `PascalCase.tsx` (if using React/Vue components)
  <!-- 組件：PascalCase.tsx -->

- **Types/Interfaces**: `PascalCase` (e.g., `Presentation`, `ApiResponse`)
  <!-- 類型/介面：PascalCase -->

#### Code Structure

<!-- 程式碼結構 -->

```typescript
// 1. Imports (grouped)
import type { FastifyInstance } from "fastify";
import { readFile } from "fs/promises";

// 2. Types and interfaces
interface ServerConfig {
  port: number;
  host: string;
}

// 3. Constants
const DEFAULT_PORT = 3000;

// 4. Main code
export async function startServer(config: ServerConfig): Promise<void> {
  // Implementation
}
```

#### Naming Conventions

<!-- 命名規範 -->

```typescript
// Classes: PascalCase
class PresentationService {}

// Functions: camelCase
function createPresentation() {}

// Constants: UPPER_SNAKE_CASE
const MAX_FILE_SIZE = 10_000_000;

// Variables: camelCase
let presentationList = [];

// Interfaces: PascalCase with "I" prefix (optional)
interface IPresentation {}
// or without prefix (preferred)
interface Presentation {}

// Types: PascalCase
type ApiResponse = { data: unknown };
```

#### Comments

<!-- 註解 -->

```typescript
// English for technical terms
// 中文解釋

/**
 * Creates a new presentation
 * 建立新簡報
 *
 * @param title - Presentation title / 簡報標題
 * @param content - Markdown content / Markdown 內容
 * @returns Promise resolving to presentation ID / 回傳簡報 ID 的 Promise
 */
async function createPresentation(
  title: string,
  content: string,
): Promise<string> {
  // Implementation
}
```

### Formatting

<!-- 格式化 -->

_Note: Specific formatting tools (Prettier, ESLint) to be decided later_

<!-- 註記：具體格式化工具（Prettier、ESLint）稍後決定 -->

**General guidelines**:

<!-- 一般指引： -->

- **Indentation**: 2 spaces (no tabs)
  <!-- 縮排：2 個空格（不用 tabs） -->

- **Line length**: Prefer 80-100 characters max
  <!-- 行長度：偏好最多 80-100 字元 -->

- **Semicolons**: Consistent usage (recommend: always use)
  <!-- 分號：一致使用（建議：總是使用） -->

- **Quotes**: Single quotes for strings, double for JSX
  <!-- 引號：字串用單引號，JSX 用雙引號 -->

---

## Directory Structure Conventions

<!-- 目錄結構規範 -->

### Source Code Organization

<!-- 原始碼組織 -->

```
src/
├── server/                # Server-side code
│   ├── index.ts          # Entry point
│   ├── config/           # Configuration
│   ├── routes/           # API routes
│   ├── middleware/       # Middleware
│   ├── services/         # Business logic
│   └── utils/            # Utilities
├── slidev/               # Slidev integration
├── types/                # TypeScript type definitions
└── storage/              # Storage layer
```

### File Naming Patterns

<!-- 檔案命名模式 -->

```
routes/
├── presentations.ts      # Route handlers
├── health.ts
└── index.ts             # Route aggregator

services/
├── presentation-service.ts
├── ai-service.ts
└── storage-service.ts

types/
├── presentation.ts       # Presentation-related types
├── api.ts               # API types
└── index.ts             # Type exports
```

---

## API Conventions

<!-- API 規範 -->

### RESTful Patterns

<!-- RESTful 模式 -->

```
GET    /api/v1/resources           # List all
POST   /api/v1/resources           # Create new
GET    /api/v1/resources/:id       # Get one
PUT    /api/v1/resources/:id       # Update (full)
PATCH  /api/v1/resources/:id       # Update (partial)
DELETE /api/v1/resources/:id       # Delete
```

### Response Format

<!-- 回應格式 -->

**Success response**:

<!-- 成功回應： -->

```typescript
{
  "data": { /* resource data */ },
  "meta": {
    "timestamp": "2026-02-11T07:00:00Z",
    "version": "v1"
  }
}
```

**Error response**:

<!-- 錯誤回應： -->

```typescript
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Presentation not found",
    "details": { "id": "abc123" }
  },
  "meta": {
    "timestamp": "2026-02-11T07:00:00Z",
    "version": "v1"
  }
}
```

### Status Codes

<!-- 狀態碼 -->

```
200 OK                    # Successful GET, PUT, PATCH
201 Created               # Successful POST
204 No Content            # Successful DELETE
400 Bad Request           # Invalid input
401 Unauthorized          # Authentication required
403 Forbidden             # Insufficient permissions
404 Not Found             # Resource doesn't exist
422 Unprocessable Entity  # Validation error
500 Internal Server Error # Server error
```

---

## Error Handling

<!-- 錯誤處理 -->

### Error Messages

<!-- 錯誤訊息 -->

```typescript
// Good: Descriptive, actionable
throw new Error("Port 3000 is already in use. Try PORT=3001 npm run dev");

// Bad: Vague, unhelpful
throw new Error("Port error");
```

### Error Logging

<!-- 錯誤記錄 -->

```typescript
// Include context
logger.error("Failed to create presentation", {
  userId: user.id,
  title: data.title,
  error: err.message,
});

// Not just the error
logger.error(err);
```

---

## Testing Conventions

<!-- 測試規範 -->

_Note: Testing framework to be decided later_

<!-- 註記：測試框架稍後決定 -->

**Test file naming**:

<!-- 測試檔案命名： -->

```
src/services/presentation-service.ts
src/services/presentation-service.test.ts
```

**Test structure**:

<!-- 測試結構： -->

```typescript
describe("PresentationService", () => {
  describe("createPresentation", () => {
    it("should create a new presentation with valid data", async () => {
      // Arrange
      const title = "Test Presentation";
      const content = "# Slide 1";

      // Act
      const result = await createPresentation(title, content);

      // Assert
      expect(result).toBeDefined();
      expect(result.title).toBe(title);
    });

    it("should reject empty title", async () => {
      // Test error case
    });
  });
});
```

---

## Documentation Conventions

<!-- 文檔規範 -->

### README Files

<!-- README 檔案 -->

Every directory with significant functionality should have a README:

<!-- 每個有重要功能的目錄都應該有 README： -->

```
src/services/README.md           # Explains services architecture
docs/guides/README.md            # Index of all guides
```

### Code Documentation

<!-- 程式碼文檔 -->

Use JSDoc for public APIs:

<!-- 公開 API 使用 JSDoc： -->

```typescript
/**
 * Retrieves a presentation by ID
 * 依 ID 取得簡報
 *
 * @param id - Presentation unique identifier
 * @returns Promise resolving to Presentation object
 * @throws {NotFoundError} When presentation doesn't exist
 */
export async function getPresentation(id: string): Promise<Presentation> {
  // Implementation
}
```

---

## Environment Variables

<!-- 環境變數 -->

### Naming Convention

<!-- 命名規範 -->

```
UPPER_SNAKE_CASE

PORT=3000
AUTO_PORT_SELECTION=true
LOG_LEVEL=info
NODE_ENV=development
```

### .env File

<!-- .env 檔案 -->

- Never commit `.env` to version control
  <!-- 永遠不要將 .env 提交到版本控制 -->

- Always provide `.env.example` with documentation
  <!-- 總是提供附文檔的 .env.example -->

- Use comments to explain each variable
  <!-- 使用註解解釋每個變數 -->

```bash
# Server Configuration
PORT=3000                      # Server port (default: 3000)
HOST=0.0.0.0                   # Server host

# Development
AUTO_PORT_SELECTION=true       # Auto-select available port if preferred is occupied
LOG_LEVEL=info                 # Logging level (info/debug/warn/error)
```

---

## Security Conventions

<!-- 安全規範 -->

### Sensitive Data

<!-- 敏感資料 -->

- Never commit API keys, passwords, or tokens
  <!-- 永遠不要提交 API keys、密碼或 tokens -->

- Use environment variables for secrets
  <!-- 使用環境變數存儲機密 -->

- Add sensitive patterns to `.gitignore`
  <!-- 將敏感模式加到 .gitignore -->

### Input Validation

<!-- 輸入驗證 -->

```typescript
// Always validate user input
function createPresentation(title: string, content: string) {
  if (!title || title.trim().length === 0) {
    throw new ValidationError("Title is required");
  }

  if (title.length > 200) {
    throw new ValidationError("Title too long (max 200 characters)");
  }

  // Process validated input
}
```

---

## Performance Conventions

<!-- 效能規範 -->

### Async/Await

<!-- Async/Await -->

```typescript
// Prefer async/await over callbacks
async function loadPresentation(id: string): Promise<Presentation> {
  const data = await readFile(`presentations/${id}.json`, "utf-8");
  return JSON.parse(data);
}

// Avoid callback hell
function loadPresentation(id: string, callback: Function) {
  /* ... */
}
```

### Resource Management

<!-- 資源管理 -->

```typescript
// Clean up resources
async function processFile(path: string) {
  const handle = await open(path);
  try {
    // Process file
  } finally {
    await handle.close();
  }
}
```

---

## Related Documentation

<!-- 相關文檔 -->

- [AGENTS.md](../../AGENTS.md) - Main AI configuration
  <!-- AGENTS.md - 主要 AI 配置 -->

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Architecture overview
  <!-- ARCHITECTURE.md - 架構概述 -->

- [WORKFLOWS.md](./WORKFLOWS.md) - Development workflows
  <!-- WORKFLOWS.md - 開發工作流程 -->

---

**Last Updated**: 2026-02-11

<!-- 最後更新：2026-02-11 -->
