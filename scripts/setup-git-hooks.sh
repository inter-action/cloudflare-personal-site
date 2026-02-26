#!/bin/bash

set -e

echo "🪝 Setting up git hooks for code formatting..."

if [ ! -d ".git" ]; then
  echo "❌ Error: Not a git repository. Run 'git init' first."
  exit 1
fi

mkdir -p .git-hooks

git config core.hooksPath .git-hooks

cat > .git-hooks/pre-commit << 'EOF'
#!/usr/bin/env sh

echo "📝 Formatting staged files..."

FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(ts|js|json|yml|yaml)$')

if [ -n "$FILES" ]; then
  npx prettier --write $FILES
fi

echo "✅ Formatting complete!"
EOF

chmod +x .git-hooks/pre-commit

echo "✅ Git hooks installed successfully!"
echo ""
echo "Files will be formatted on commit: .ts, .js, .json, .yml, .yaml"
