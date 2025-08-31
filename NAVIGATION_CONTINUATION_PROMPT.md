# EPUB.js Navigation System Continuation Prompt

## Current State & Issues

### ✅ Completed Work

- **Navigation Bug Fix**: Fixed critical prev() method early return bug in `src/managers/default/index.ts`
- **Test Consolidation**: Created comprehensive test configuration dataset in `e2e/moby-dick-navigation.spec.ts`
- **Build Pipeline**: All builds working (npm run build, build:lib, build:rollup)

### 🚨 Active Issues

#### 1. **Asymmetric Navigation Problem**

**Location**: `examples/transparent-iframe-hightlights.html` (and likely other examples)
**Problem**:

- Can navigate **forward** with next() and correctly go to the **previous** spine item
- **Cannot navigate back** using prev() from that same position
- This creates a navigation trap where users get stuck

**Evidence**:

```javascript
// In examples/transparent-iframe-hightlights.html line 76:
var displayed = rendition.display(6); // Start at section 6

// User can next() -> goes to previous spine item (due to bug/feature)
// But then prev() fails to return to section 6
```

#### 2. **Logic Inconsistency: Page Numbers vs Content Availability**

**Location**: `src/managers/default/index.ts` lines 1100-1200
**Problem**: Current prev()/next() logic uses page number calculations instead of actual content availability

**Current Flawed Logic**:

```typescript
// Line 1116-1123: Uses page counts to determine navigation
const firstDisplayed =
  firstLoc.pages && firstLoc.pages.length ? firstLoc.pages[0] : 1;
console.debug(
  '[DefaultViewManager] prev() firstDisplayed/total:',
  firstDisplayed,
  firstLoc.totalPages,
  'pageStep:',
  pageStep
);
```

**Should Be**: Check if there's **actual scrollable content** before/after current position, not page numbers.

#### 3. **Duplicate Test Files Requiring Cleanup**

**Test files with overlapping navigation tests**:

- `e2e/next-spread-failing.spec.ts`
- `e2e/next-spread-no-progress.spec.ts`
- `e2e/next-spread.spec.ts`
- `e2e/focused-boundary-test.spec.ts`
- `e2e/transparent-iframe-boundary.spec.ts`
- `e2e/immediate-navigation.spec.ts`
- `e2e/manual-example-debug.spec.ts`

**Target**: Consolidate into focused test files using the dataset approach in `moby-dick-navigation.spec.ts`

#### 4. **Spine Item Verification Issue**

**Problem**: Need to verify that navigation actually reaches the **correct previous spine item**, not just any previous item.

## Required Tasks

### 🔥 Priority 1: Fix Asymmetric Navigation

1. **Debug the transparent-iframe example**:

   ```bash
   # Run the example locally
   cd /Users/Arno/repos/epub.js
   npm run build
   open examples/transparent-iframe-hightlights.html

   # Test sequence:
   # 1. Load example (starts at section 6)
   # 2. Click next() - observe navigation
   # 3. Try prev() - should return to original position
   ```

2. **Root cause analysis**: Determine why forward/backward navigation is asymmetric
3. **Fix in DefaultViewManager**: Ensure prev() can reverse next() operations

### 🔥 Priority 2: Implement Content-Based Navigation Logic

**Target**: Replace page-number-based logic with content-availability-based logic

**Current problematic code** (lines 1116-1140):

```typescript
// WRONG: Uses page numbers
const firstDisplayed =
  firstLoc.pages && firstLoc.pages.length ? firstLoc.pages[0] : 1;
canScrollBackward = contentWidth > containerWidth && firstDisplayed > 1;
```

**Should be**:

```typescript
// RIGHT: Check actual scrollable content
const currentScrollLeft = this.container.scrollLeft;
const maxScrollLeft = this.container.scrollWidth - this.container.offsetWidth;
const canScrollForward = currentScrollLeft < maxScrollLeft - 10; // 10px tolerance
const canScrollBackward = currentScrollLeft > 10;
```

### 🧹 Priority 3: Test Cleanup & Verification

1. **Consolidate duplicate tests** into focused test files
2. **Add spine item verification tests**:

   ```typescript
   test('navigation reaches correct spine items', async ({ page }) => {
     // Verify we reach the expected spine item, not just any previous item
     const startingHref = await getCurrentSpineHref(page);
     await clickNext(page);
     const afterNextHref = await getCurrentSpineHref(page);
     await clickPrev(page);
     const afterPrevHref = await getCurrentSpineHref(page);

     expect(afterPrevHref).toBe(startingHref); // Should return to original
   });
   ```

## How To Run Tests

### Navigation Test Suite

```bash
# Run the consolidated navigation tests
cd /Users/Arno/repos/epub.js
npx playwright test e2e/moby-dick-navigation.spec.ts

# Run specific test configuration
npx playwright test e2e/moby-dick-navigation.spec.ts --grep "Moby Dick.*Auto Spread"

# Run all navigation-related tests
npx playwright test e2e/ --grep "navigation|next|prev|spine"
```

### Manual Testing with Examples

```bash
# Build the library
npm run build

# Test the transparent iframe example
open examples/transparent-iframe-hightlights.html
# Or serve locally:
python3 -m http.server 8000
# Then navigate to: http://localhost:8000/examples/transparent-iframe-hightlights.html
```

### Debug Navigation Issues

```bash
# Run with debug logging
DEBUG=epub* npx playwright test e2e/moby-dick-navigation.spec.ts --headed

# Run single failing test in headed mode
npx playwright test e2e/focused-boundary-test.spec.ts --headed --timeout=0
```

## Expected Outcomes

### ✅ Success Criteria

1. **Symmetric Navigation**: next() followed by prev() returns to original position
2. **Content-Based Logic**: Navigation decisions based on actual scrollable content, not page numbers
3. **Spine Verification**: Navigation reaches the correct spine items as expected
4. **Clean Test Suite**: Minimal duplicate tests, comprehensive coverage with dataset approach
5. **No Navigation Traps**: Users can always navigate bidirectionally without getting stuck

### 🚨 Failure Indicators

- Navigation asymmetry persists (can go forward but not back)
- Page-number-based logic still used instead of content availability
- Test suite remains fragmented with duplicates
- Examples show navigation inconsistencies

## Key Files To Focus On

### Core Logic

- `src/managers/default/index.ts` (lines 1100-1200) - prev() method logic
- `src/managers/default/index.ts` (lines 900-1000) - next() method logic

### Test Infrastructure

- `e2e/moby-dick-navigation.spec.ts` - Primary consolidated test file
- Duplicate test files for cleanup/consolidation

### Manual Testing

- `examples/transparent-iframe-hightlights.html` - Manual navigation testing
- Debug console logging for navigation flow analysis

## Next Steps

1. **Investigate the asymmetric navigation issue** in the transparent iframe example
2. **Refactor navigation logic** from page-based to content-availability-based
3. **Consolidate duplicate test files** using the dataset approach
4. **Add spine item verification** to ensure correct navigation targets
5. **Comprehensive testing** across different EPUB sources and layout modes
