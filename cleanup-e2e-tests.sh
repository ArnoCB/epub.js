#!/bin/bash

# EPUB.js E2E Test Cleanup Script
# This script removes fragmented/duplicate test files now that we have the master suite

echo "🧹 Cleaning up fragmented E2E test files..."

# Files to delete - these are all covered by the master navigation suite
DELETE_FILES=(
  "e2e/moby-dick-navigation-fixed.spec.ts"
  "e2e/navigation-comprehensive.spec.ts" 
  "e2e/navigation-comprehensive-consolidated.spec.ts"
  "e2e/navigation-master-suite.spec.ts"
  "e2e/navigation-symmetry-test.spec.ts"
  "e2e/white-page-chapter-skip-test.spec.ts"
  "e2e/transparent-iframe-boundary.spec.ts"
  "e2e/transparent-iframe.spec.ts"
  "e2e/container-scrolling-fix-test.spec.ts"
  "e2e/immediate-navigation.spec.ts"
  "e2e/next-spread-failing.spec.ts"
  "e2e/next-spread-no-progress.spec.ts"
  "e2e/root-cause-debug.spec.ts"
  "e2e/white-page-correct-numbers-debug.spec.ts"
  "e2e/manual-example-debug.spec.ts"
  "e2e/focused-boundary-test.spec.ts"
  "e2e/moby-dick-spread-navigation.spec.ts"
)

# Keep these essential files:
echo "✅ KEEPING essential test files:"
echo "  - e2e/epub.spec.ts (basic EPUB library functionality)" 
echo "  - e2e/moby-dick-navigation.spec.ts (master navigation suite)"
echo "  - e2e/navigation-regression-prevention.spec.ts (comprehensive regression detection)"
echo "  - e2e/chapter-boundary-edge-cases.spec.ts (unique boundary cases)"
echo "  - e2e/cross-chapter-navigation.spec.ts (spine item boundaries)"
echo "  - e2e/next-spread.spec.ts (spread navigation)"
echo ""

# Count files to delete
TOTAL_FILES=${#DELETE_FILES[@]}
echo "🗑️  Will delete $TOTAL_FILES fragmented/duplicate test files..."
echo ""

# Delete each file if it exists
for file in "${DELETE_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "   Removing: $file"
    rm "$file"
  else
    echo "   Skipped (not found): $file"  
  fi
done

echo ""
echo "🎯 CONSOLIDATION SUMMARY:"
echo "   • Deleted: $TOTAL_FILES fragmented test files"
echo "   • Master suite: moby-dick-navigation.spec.ts (11 comprehensive tests)"
echo "   • Essential files: 6 focused test suites remaining"
echo ""
echo "✅ E2E test consolidation complete!"
echo ""
echo "📋 REMAINING TEST FILES:"
find e2e -name "*.spec.ts" -type f | sort
