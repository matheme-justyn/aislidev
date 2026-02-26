#!/bin/bash
# Install git hooks for version management

set -e

echo "🪝 Installing Git hooks..."

# Check if .git directory exists
if [ ! -d ".git" ]; then
    echo "❌ Error: Not a git repository"
    exit 1
fi

# Create hooks directory if it doesn't exist
mkdir -p .git/hooks

# Install pre-push hook
if [ -f ".template/hooks/pre-push" ]; then
    cp .template/hooks/pre-push .git/hooks/pre-push
    chmod +x .git/hooks/pre-push
    echo "✅ Installed pre-push hook (version check)"
else
    echo "⚠️  Warning: .template/hooks/pre-push not found"
fi

echo ""
echo "📋 Installed hooks:"
ls -la .git/hooks/ | grep -v "sample" | tail -n +4

echo ""
echo "✨ Git hooks installed successfully!"
echo ""
echo "The pre-push hook will:"
echo "  - Check if VERSION has been bumped before pushing to main"
echo "  - Prevent accidental pushes without version updates"
echo "  - Remind you to create git tags"
