#!/bin/bash

# Playwright Test Runner - Ensures tests run from correct directory
# This script automatically changes to the project root before running tests

# Get the directory this script is in (e2e directory)
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Change to project root (parent of e2e directory)
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "🔄 Changing to project root: $PROJECT_ROOT"
cd "$PROJECT_ROOT"

# Check if playwright.config.ts exists
if [ ! -f "playwright.config.ts" ]; then
    echo "❌ Error: playwright.config.ts not found in $PROJECT_ROOT"
    echo "Make sure you're running this from the correct project structure"
    exit 1
fi

echo "✅ Found playwright.config.ts"
echo "🚀 Running playwright tests from correct directory..."

# Pass all arguments to playwright
npx playwright test "$@"
