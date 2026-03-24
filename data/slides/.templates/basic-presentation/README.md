# 基礎簡報範本

這是一個基礎的 Slidev 簡報範本。

## 檔案結構

```
basic-presentation/
└── slides.md        # 簡報內容（必須）
```

## 必要檔案

### slides.md

Slidev 簡報的主要檔案，包含：

- **Frontmatter 配置** - 使用 `---` 包圍的 YAML 設定
- **投影片內容** - 使用 Markdown 語法
- **投影片分隔** - 使用 `---` 分隔每一頁

## 選用檔案

### images/ 或 assets/

放置圖片和其他資源檔案，在 Markdown 中使用相對路徑引用：

```markdown
![圖片說明](./images/my-image.png)
```

### components/

自訂 Vue 組件（進階功能）

## 使用方式

1. 複製此範本到 `data/slides/` 下的新目錄
2. 編輯 `slides.md` 的內容
3. 在 AISliDev 中點擊「Open Presentation」選擇您的簡報

## Frontmatter 重要設定

```yaml
---
theme: "@slidev/theme-default" # 主題（必須用引號包裹）
layout: cover # 首頁佈局
background: https://... # 背景圖片 URL
highlighter: shiki # 代碼高亮工具
lineNumbers: true # 顯示代碼行號
---
```

## 更多資訊

- [Slidev 官方文檔](https://sli.dev/)
- [AISliDev 主題系統](../../docs/guides/THEME_SYSTEM_V2.md)
- [Tutorial](../../docs/guides/TUTORIAL.md)
