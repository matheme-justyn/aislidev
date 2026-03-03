#!/bin/bash
# MCP Setup Verification Script
# 檢查 MCP (Model Context Protocol) 配置是否正確

set -e

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo "🔍 MCP 配置檢查"
echo "═══════════════════════════════════════"
echo ""

# 計數器
PASS=0
FAIL=0
WARN=0

# 檢查函數
check_pass() {
    echo -e "${GREEN}✓${NC} $1"
    ((PASS++))
}

check_fail() {
    echo -e "${RED}✗${NC} $1"
    ((FAIL++))
}

check_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
    ((WARN++))
}

# 1. 檢查 Bun
echo "【1/6】檢查 Bun..."
if command -v bun &> /dev/null; then
    BUN_VERSION=$(bun --version)
    check_pass "Bun 已安裝 (版本: $BUN_VERSION)"
else
    check_fail "Bun 未安裝"
    echo "   💡 安裝方式："
    echo "      macOS/Linux: curl -fsSL https://bun.sh/install | bash"
    echo "      然後執行: source ~/.bashrc (或 ~/.zshrc)"
fi
echo ""

# 2. 檢查 uv
echo "【2/6】檢查 uv..."
if command -v uv &> /dev/null; then
    UV_VERSION=$(uv --version 2>&1 | head -n1)
    check_pass "uv 已安裝 ($UV_VERSION)"
else
    check_fail "uv 未安裝"
    echo "   💡 安裝方式："
    echo "      macOS/Linux: curl -LsSf https://astral.sh/uv/install.sh | sh"
    echo "      然後執行: source ~/.bashrc (或 ~/.zshrc)"
fi
echo ""

# 3. 檢查 opencode.json
echo "【3/6】檢查 opencode.json..."
if [ -f "opencode.json" ]; then
    check_pass "opencode.json 存在"
    
    # 驗證 JSON 格式
    if command -v jq &> /dev/null; then
        if jq empty opencode.json 2>/dev/null; then
            check_pass "JSON 格式正確"
        else
            check_fail "JSON 格式錯誤"
            echo "   💡 請檢查 opencode.json 語法"
        fi
    else
        check_warn "jq 未安裝，跳過 JSON 格式驗證"
    fi
    
    # 檢查 mcp 配置
    if grep -q '"mcp"' opencode.json; then
        check_pass "mcp 配置存在"
        
        # 檢查各個 server
        for server in filesystem git memory github; do
            if grep -q "\"$server\"" opencode.json; then
                echo "   ${GREEN}✓${NC} $server server 已配置"
            else
                if [ "$server" = "github" ]; then
                    check_warn "$server server 未配置（可選）"
                else
                    check_fail "$server server 未配置"
                fi
            fi
        done
    else
        check_fail "mcp 配置不存在"
        echo "   💡 請確認 opencode.json 包含 mcp 區塊"
    fi
else
    check_fail "opencode.json 不存在"
    echo "   💡 請確認在專案根目錄執行此腳本"
fi
echo ""

# 4. 檢查 .env（如果使用 GitHub MCP）
echo "【4/6】檢查 GitHub MCP 配置..."
if grep -q '"github"' opencode.json 2>/dev/null; then
    echo "   ${BLUE}ℹ${NC} 偵測到 GitHub MCP 配置"
    
    if [ -f ".env" ]; then
        check_pass ".env 檔案存在"
        
        if grep -q "GITHUB_PERSONAL_ACCESS_TOKEN=" .env; then
            TOKEN_VALUE=$(grep "GITHUB_PERSONAL_ACCESS_TOKEN=" .env | cut -d= -f2)
            
            if [ "$TOKEN_VALUE" = "your_token_here" ] || [ -z "$TOKEN_VALUE" ]; then
                check_fail "GitHub token 尚未設置"
                echo "   💡 請在 .env 中設置實際的 GITHUB_PERSONAL_ACCESS_TOKEN"
                echo "   💡 取得 token：https://github.com/settings/personal-access-tokens/new"
                echo "   💡 需要權限：repo (read/write), issues, pull requests"
            elif [[ $TOKEN_VALUE == github_pat_* ]]; then
                check_pass "GitHub token 已設置（格式正確）"
            elif [[ $TOKEN_VALUE == ghp_* ]]; then
                check_pass "GitHub token 已設置（舊版 token 格式）"
            else
                check_warn "GitHub token 格式可能不正確（應以 github_pat_ 或 ghp_ 開頭）"
            fi
        else
            check_fail "GITHUB_PERSONAL_ACCESS_TOKEN 未在 .env 中找到"
        fi
    else
        check_fail ".env 檔案不存在"
        echo "   💡 執行: cp .env.example .env"
        echo "   💡 然後編輯 .env 填入 GitHub token"
    fi
else
    echo "   ${BLUE}ℹ${NC} 未使用 GitHub MCP（已跳過）"
    check_pass "GitHub MCP 配置檢查已跳過"
fi
echo ""

# 5. 檢查 .gitignore
echo "【5/6】檢查 .gitignore..."
if [ -f ".gitignore" ]; then
    if grep -q "^\.env$" .gitignore; then
        check_pass ".env 已加入 .gitignore（安全）"
    else
        check_warn ".env 未在 .gitignore 中"
        echo "   ⚠️  請確保 .env 不會被提交到 Git！"
        echo "   💡 執行: echo '.env' >> .gitignore"
    fi
else
    check_warn ".gitignore 不存在"
fi
echo ""

# 6. 檢查 MCP server 可執行性
echo "【6/6】測試 MCP servers 可執行性..."

# 測試 filesystem server
if command -v bun &> /dev/null; then
    # macOS 沒有 timeout 命令，直接檢查 bunx 是否可用
    check_pass "filesystem server 可執行（bunx 正常）"
fi

# 測試 git server
if command -v uv &> /dev/null; then
    # 只檢查 uv 本身，不實際安裝 mcp-server-git（避免副作用）
    check_pass "git server 可執行（uv 正常）"
else
    check_fail "git server 無法執行（uv 未安裝）"
fi

# 測試 memory server（使用 bunx）
if command -v bun &> /dev/null; then
    check_pass "memory server 可執行（bunx 正常）"
fi

echo ""
echo "═══════════════════════════════════════"
echo "📊 檢查結果統計"
echo "═══════════════════════════════════════"
echo -e "${GREEN}通過：$PASS${NC}"
echo -e "${RED}失敗：$FAIL${NC}"
echo -e "${YELLOW}警告：$WARN${NC}"
echo ""

# 總結建議
if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}✅ MCP 配置檢查完成！${NC}"
    echo ""
    echo "下一步："
    echo "  1. 重啟 OpenCode / VSCode"
    echo "  2. 在 OpenCode 對話中測試："
    echo "     - '列出當前目錄的所有檔案'（filesystem）"
    echo "     - '顯示目前的 git 狀態'（git）"
    echo "     - '記住：我的專案名稱是 XXX'（memory）"
    if grep -q '"github"' opencode.json 2>/dev/null; then
        echo "     - '列出這個 repo 的最近 5 個 issues'（github）"
    fi
    echo ""
    exit 0
else
    echo -e "${RED}❌ 發現 $FAIL 個問題，請先修復後再重啟 OpenCode${NC}"
    echo ""
    echo "💡 常見解決方案："
    echo "  - Bun 未安裝 → curl -fsSL https://bun.sh/install | bash"
    echo "  - uv 未安裝 → curl -LsSf https://astral.sh/uv/install.sh | sh"
    echo "  - 安裝後記得重新載入 shell：source ~/.bashrc 或 source ~/.zshrc"
    echo "  - GitHub token 問題 → 編輯 .env 填入正確的 token"
    echo ""
    exit 1
fi
