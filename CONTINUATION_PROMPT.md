# Epub.js Spread Mode Navigation Fix - Continuation Prompt

## Current Status

We've made significant progress fixing the spread mode navigation issue in epub.js but there's still a critical problem to resolve.

### What's Working Now ✅

1. **Physical scrolling is now functional** - Container scrollWidth expands from 900px to 4500px using phantom element
2. **ScrollBy() method works** - scrollLeft properly changes: 0 → 450 → 900 → 1350
3. **First few pages advance correctly** - Pages [1,2] → [2] → shows page 3 initially

### Current Problem ❌

**Empty pages after page 3**: User reports seeing a third page, then empty pages throughout the chapter, eventually reaching the next chapter.

## Root Cause Analysis

### The Issue

The `paginatedLocation()` method's calculation goes wrong after scrollLeft=900px. The problem is in how we calculate the `start` and `end` positions for the visible content window.

### Key Debug Info from Last Test

```
- contentWidth = 4500px (correct)
- scrollLeft progression: 0 → 450 → 900 → 1350 (working)
- At scrollLeft=900: currentLocation() returns [] (empty array)
- Expected: should show pages [3,4] but shows nothing
```

### Technical Details

- **Container setup**: Phantom element correctly expands scrollWidth to 4500px
- **Layout**: pageWidth=450, divisor=2 (spread mode), totalPages=10
- **Problem area**: `paginatedLocation()` method in `/src/managers/default/index.ts` around line 1320

## Current Implementation State

### Files Modified

1. **`/src/managers/default/index.ts`**:
   - Added phantom element creation in `next()` method (lines ~730-760)
   - Modified `paginatedLocation()` to include containerScrollOffset (attempted fix)
   - Removed virtual scrolling approach (was workaround)

### Key Code Sections

```typescript
// Phantom element approach (working)
let phantomElement = this.container.querySelector(
  '.epub-scroll-phantom'
) as HTMLElement;
if (!phantomElement) {
  phantomElement = document.createElement('div');
  phantomElement.className = 'epub-scroll-phantom';
  phantomElement.style.position = 'absolute';
  phantomElement.style.width = contentWidth + 'px';
  phantomElement.style.height = '1px';
  phantomElement.style.visibility = 'hidden';
  this.container.appendChild(phantomElement);
}

// Location calculation (needs fixing)
const containerScrollOffset = this.container.scrollLeft || 0;
start = offset - position.left + used + containerScrollOffset;
end = start + pageWidth;
```

## Next Steps to Fix

### 1. Fix Location Calculation Logic

The `start` calculation in `paginatedLocation()` is incorrect. Currently:

```typescript
start = offset - position.left + used + containerScrollOffset;
```

Should probably be:

```typescript
start = containerScrollOffset + used; // Simple: scroll position + used width
```

### 2. Debug the Mapping Calculation

The `mapping.page()` call may be getting invalid start/end values, causing empty content. Add debug logging:

```typescript
console.debug('[DefaultViewManager] mapping.page() params:', {
  start,
  end,
  contentWidth,
  containerScrollOffset,
  pageWidth,
});
```

### 3. Fix the Visibility Check

The `visible()` method might be returning empty arrays because `isVisible()` doesn't account for container scroll. Consider modifying `isVisible()` to account for scroll position.

### 4. Ensure Proper Page Transitions

After fixing location calculation, verify that:

- Pages advance correctly: [1,2] → [3,4] → [5,6] → etc.
- Chapter transitions work at the end
- No unwanted scrollbars appear

## Test Cases

### Current Test

- File: `e2e/next-spread-no-progress.spec.ts`
- Status: Still failing on test assertion (pages array extraction issue)
- The test expects `result.before.pages` and `result.after.pages` but the event structure has `start.displayed.page`

### Manual Testing

- File: `examples/transparent-iframe-hightlights.html`
- Issue: Shows page 3, then empty pages, eventually next chapter
- Expected: Should show spreads [1,2] → [3,4] → [5,6] → [7,8] → [9,10] → next chapter

### Fix the Test Assertion

The test failure is due to structure mismatch. Change from:

```typescript
const beforePages = result.before.pages || [];
const afterPages = result.after.pages || [];
```

To:

```typescript
const beforePages = [
  result.before.start.displayed.page,
  result.before.end.displayed.page,
];
const afterPages = [
  result.after.start.displayed.page,
  result.after.end.displayed.page,
];
```

## Key Questions to Investigate

1. **Why does location return empty array?** - Is it a visibility issue or calculation issue?
2. **Are we scrolling too far?** - contentWidth=4500, pageWidth=450, so max scroll should be ~4050px
3. **Is the content actually there?** - Check if iframe content is properly sized
4. **Chapter transitions** - Does the next chapter load correctly after fixing inner-chapter navigation?

## Files to Focus On

1. **`/src/managers/default/index.ts`** (main file):
   - `paginatedLocation()` method (~line 1320)
   - `visible()` method (~line 1408)
   - `isVisible()` method (~line 1382)

2. **Test file**: `/e2e/next-spread-no-progress.spec.ts`
   - Fix assertion to match actual event structure

3. **Debug/test file**: `/test-spread-fix.html`
   - Manual testing interface

## Success Criteria

- ✅ Physical scrolling works (already achieved)
- ❌ **Fix**: Pages advance correctly through entire chapter: [1,2] → [3,4] → [5,6] → etc.
- ❌ **Fix**: No empty pages in middle of chapter
- ❌ **Fix**: Chapter transitions work at the end
- ❌ **Fix**: Test passes
- ✅ No visible scrollbars (should be achieved with overflow:hidden)
- ❌ **Fix**: prev() method works in reverse

The phantom element approach is the correct solution - we just need to fix the location calculation logic to properly handle the scrolled position.
