#!/bin/bash
# 初始化從模板建立的新專案

set -e

echo "🎯 初始化新專案"
echo "=============="
echo ""

# 檢查是否在專案根目錄
if [ ! -f ".template/VERSION" ]; then
    echo "❌ 錯誤：請在專案根目錄執行此腳本"
    exit 1
fi

# 讀取模板版本
TEMPLATE_VERSION=$(cat .template/VERSION)

# 收集專案資訊
read -p "專案名稱: " PROJECT_NAME
read -p "專案描述（簡短）: " PROJECT_DESC
read -p "GitHub repo (username/repo-name): " GITHUB_REPO
read -p "主要語言 (typescript/python/go/rust): " MAIN_LANG

echo ""
echo "📝 專案資訊："
echo "   名稱: $PROJECT_NAME"
echo "   描述: $PROJECT_DESC"
echo "   Repo: $GITHUB_REPO"
echo "   語言: $MAIN_LANG"
echo "   模板版本: $TEMPLATE_VERSION"
echo ""

read -p "確認要初始化嗎？ (y/N): " confirm
if [[ ! $confirm =~ ^[Yy]$ ]]; then
    echo "已取消"
    exit 0
fi

# 1. 記錄模板版本
echo "$TEMPLATE_VERSION" > .template-version
echo "✅ 已建立 .template-version"

# 2. 備份原始 README
if [ -f "README.md" ]; then
    mv README.md .template/.template/docs/TEMPLATE_README.md.backup
    echo "✅ 已備份模板 README → .template/docs/TEMPLATE_README.md.backup"
fi

# 3. 建立新的 README
cat > README.md << EOF
# $PROJECT_NAME

> $PROJECT_DESC

[![License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)

---

## 功能特色

- （待補充）

## 技術棧

- **語言**: ${MAIN_LANG}
- **框架**: （待補充）

## 快速開始

### 環境需求

- （待補充）

### 安裝

\`\`\`bash
git clone https://github.com/${GITHUB_REPO}.git
cd $(basename $GITHUB_REPO)

# 安裝依賴
（待補充）
\`\`\`

### 設定

\`\`\`bash
cp .env.example .env
# 編輯 .env
\`\`\`

### 執行

\`\`\`bash
# 開發模式
（待補充）

# 測試
（待補充）
\`\`\`

## 專案結構

\`\`\`
（待補充）
\`\`\`

## 開發指南

參考 [AGENTS.md](./AGENTS.md) 中的編碼規範。

## 貢獻

參考 [CONTRIBUTING.md](./CONTRIBUTING.md)

## 授權

MIT License - 詳見 [LICENSE](./LICENSE)

---

**基於**: [my-vibe-scaffolding](https://github.com/matheme-justyn/my-vibe-scaffolding) v${TEMPLATE_VERSION}

更多關於 README 撰寫的指引，請參考 [.template/docs/README_GUIDE.md](./.template/docs/README_GUIDE.md)
EOF

echo "✅ 已建立新的 README.md"

# 4. 建立專案 VERSION（從 0.1.0 開始）
echo "0.1.0" > VERSION
echo "✅ 已設定專案版本為 0.1.0"

# 5. 處理 LICENSE
echo ""
echo "📄 LICENSE 設定"
echo "   鷹架使用 MIT License"
echo "   你的專案可以選擇不同的授權"
echo ""
echo "1) 使用 MIT License (與鷹架相同)"
echo "2) 稍後自己決定（參考 .template/docs/PROJECT_LICENSE_GUIDE.md）"
read -p "選擇 (1/2): " license_choice

if [[ $license_choice == "1" ]]; then
    cp .template/LICENSE ./LICENSE
    # 更新 LICENSE 中的年份和擁有者
    YEAR=$(date +%Y)
    read -p "授權擁有者名稱（你的名字或組織）: " owner
    sed -i.bak "s/Copyright (c) [0-9]\{4\} .*$/Copyright (c) $YEAR $owner/" LICENSE
    rm LICENSE.bak 2>/dev/null || true
    echo "✅ 已建立 LICENSE（MIT）"
else
    echo "⏭️  跳過 LICENSE 建立"
    echo "   📚 稍後參考：.template/docs/PROJECT_LICENSE_GUIDE.md"
fi

# 6. 處理 CONTRIBUTING.md
echo ""
echo "📝 CONTRIBUTING.md 設定"
read -p "是否接受外部貢獻（PR）? (y/N): " accept_contrib

if [[ $accept_contrib =~ ^[Yy]$ ]]; then
    cat > CONTRIBUTING.md << 'CONTRIB_EOF'
# Contributing to PROJECT_NAME_PLACEHOLDER

Thank you for your interest in contributing! 🎉

## How to Contribute

### 🐛 Report Bugs
Use the [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.md)

### 💡 Suggest Features  
Use the [Feature Request template](.github/ISSUE_TEMPLATE/feature_request.md)

### 🔀 Submit Pull Requests
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (follow format in AGENTS.md)
4. Push to your branch
5. Open a Pull Request

## Development Setup

See README.md for setup instructions.

## Coding Standards

- Follow conventions in [AGENTS.md](./AGENTS.md)
- Write tests for new features
- Ensure tests pass before submitting PR

## Questions?

Feel free to open an issue for any questions.

---

For more detailed guidance, see [.template/docs/PROJECT_CONTRIBUTING_GUIDE.md](./.template/docs/PROJECT_CONTRIBUTING_GUIDE.md)
CONTRIB_EOF
    sed -i.bak "s/PROJECT_NAME_PLACEHOLDER/$PROJECT_NAME/" CONTRIBUTING.md
    rm CONTRIBUTING.md.bak 2>/dev/null || true
    echo "✅ 已建立 CONTRIBUTING.md（接受貢獻）"
else
    cat > CONTRIBUTING.md << 'CONTRIB_EOF'
# Contributing to PROJECT_NAME_PLACEHOLDER

Thank you for your interest! 🙏

## 📢 Important Notice

This is a personal/company project. We are **not accepting pull requests** at this time.

## ✅ What You Can Do

### 🐛 Report Issues
If you find a bug, please open an issue with details.

### 🔄 Fork and Customize
You're encouraged to fork this project for your own use.

---

For guidance on writing your own contributing policy, see [.template/docs/PROJECT_CONTRIBUTING_GUIDE.md](./.template/docs/PROJECT_CONTRIBUTING_GUIDE.md)
CONTRIB_EOF
    sed -i.bak "s/PROJECT_NAME_PLACEHOLDER/$PROJECT_NAME/" CONTRIBUTING.md
    rm CONTRIBUTING.md.bak 2>/dev/null || true
    echo "✅ 已建立 CONTRIBUTING.md（不接受貢獻）"
fi

# 7. 處理 SECURITY.md
echo ""
echo "🔒 SECURITY.md 設定"
read -p "建立 SECURITY.md? (y/N): " create_security

if [[ $create_security =~ ^[Yy]$ ]]; then
    read -p "安全問題聯絡 Email: " security_email
    cat > SECURITY.md << SECURITY_EOF
# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.x.x   | :white_check_mark: |

## Reporting a Vulnerability

**DO NOT** open a public issue for security vulnerabilities.

Please report security issues to: **${security_email}**

### What to Include

- Description of the vulnerability
- Steps to reproduce
- Potential impact

### Response Time

- We aim to respond within 48 hours
- Critical issues will be prioritized

---

For more guidance, see [.template/docs/PROJECT_SECURITY_GUIDE.md](./.template/docs/PROJECT_SECURITY_GUIDE.md)
SECURITY_EOF
    echo "✅ 已建立 SECURITY.md"
else
    echo "⏭️  跳過 SECURITY.md 建立"
    echo "   📚 稍後參考：.template/docs/PROJECT_SECURITY_GUIDE.md"
fi

# 4. 更新 VERSION（專案從 0.1.0 開始）
echo "0.1.0" > VERSION
echo "✅ 已設定專案版本為 0.1.0"

# 8. 清理範例 ADR（可選）
read -p "要刪除範例 ADR 嗎？(建議保留 0001) (y/N): " del_adr
if [[ $del_adr =~ ^[Yy]$ ]]; then
    rm -f .template/docs/adr/0002-example-*.md docs/adr/0003-example-*.md docs/adr/0004-example-*.md
    echo "✅ 已刪除範例 ADR（保留 0001）"
fi

# 9. 安裝 Git hooks（版本檢查）
echo ""
echo "🪝 Git Hooks 設定"
read -p "安裝版本檢查 hook（防止忘記 bump version）? (Y/n): " install_hooks

if [[ ! $install_hooks =~ ^[Nn]$ ]]; then
    ./.template/scripts/install-hooks.sh
    echo "✅ 已安裝 Git hooks"
else
    echo "⏭️  跳過 Git hooks 安裝"
    echo "   💡 稍後可執行：./.template/scripts/install-hooks.sh"
fi

# 10. 提示下一步
echo ""
echo "🎉 初始化完成！"
echo ""
echo "📋 下一步："
echo "   1. 編輯 README.md 補充專案資訊"
echo "   2. 更新 AGENTS.md 中的編碼規範"
echo "   3. 複製 .env.example → .env 並設定"
echo "   4. 刪除或調整不需要的檔案"
echo "   5. 初始化專案程式碼"
echo "   6. git commit -m \"chore: initialize project from template v${TEMPLATE_VERSION}\""
echo ""
echo "📚 參考文件："
echo "   - .template/docs/README_GUIDE.md - README 撰寫指引"
echo "   - .template/docs/DOCUMENTATION_GUIDELINES.md - 文件組織規範"
echo "   - TEMPLATE_SYNC.md - 模板同步指南"
echo ""
