# EPUB.js Navigation Fix - Continuation Prompt 5

## Current Status 🔄

We are **in the middle of fixing a complex navigation issue** with mixed results. The original cross-chapter navigation fix is working, but we've introduced new problems while trying to fix boundary edge cases.

### What We've Accomplished ✅

- **Fixed main cross-chapter navigation**: Chapter 1 ↔ Chapter 2 navigation works correctly
- **Identified the root cause**: Page count logic (`lastDisplayed < totalPages`) is unreliable and causes navigation to get stuck
- **Developed the right approach**: Check actual scroll capability instead of relying on page counts

### Current Problems 🔍

1. **Manual testing still shows white pages**: When navigating to end of chapters and continuing with "next"
2. **Previous navigation test failing**: `cross-chapter-navigation.spec.ts` - prev() not working from titlepage to cover
3. **Boundary navigation issue persists**: Can go from Chapter 1 to previous spine item, but clicking "next" doesn't return to Chapter 1

### Our Current Approach (Partially Working)

We replaced the page-count logic with scroll-based logic in both `next()` and `prev()`:

**For next():**

```typescript
// Instead of: if (lastDisplayed < totalPages)
const currentScrollLeft = this.container.scrollLeft;
const maxScrollLeft = this.container.scrollWidth - this.container.offsetWidth;
let canScrollFurther = currentScrollLeft < maxScrollLeft - 10;

if (canScrollFurther) {
  // Scroll within section
} else {
  // Advance to next spine item
}
```

**For prev():**

```typescript
// Instead of: if (firstDisplayed > 1)
const canScrollBackward = this.container.scrollLeft > 10;

if (canScrollBackward) {
  // Scroll within section
} else {
  // Go to previous spine item
}
```

### The Issue 🚨

**The logic is sound but implementation is incomplete**. The scroll-based checks work, but:

1. **Manual testing shows problems** - suggests edge cases we're not catching
2. **Test failures** - automated tests don't match manual behavior
3. **Complex interaction** - our changes interact with existing view expansion/sizing logic in unexpected ways

## Next Steps 🎯

### Immediate Actions Needed

1. **Simplify the logic drastically**:
   - Remove complex page counting entirely
   - Focus purely on scroll position vs. content size
   - Eliminate edge cases and special handling
2. **Simplify the tests**:
   - Remove excessive debug logging that clutters context
   - Create focused tests for specific scenarios
   - Test both automated and manual scenarios consistently

3. **Debug the remaining issues**:
   - **Manual white pages**: Check why end-of-chapter navigation fails
   - **Previous navigation**: Fix the titlepage → cover navigation
   - **Boundary cases**: Ensure epigraph → chapter_001 works bidirectionally

### Proposed Simplified Approach

Instead of complex hybrid logic, implement pure scroll-based navigation:

```typescript
// For next(): Can we scroll right more?
const maxScroll = container.scrollWidth - container.offsetWidth;
if (container.scrollLeft < maxScroll - tolerance) {
  // Scroll within current section
  scrollBy(pageStep);
} else {
  // Load next spine item
  loadNextSection();
}

// For prev(): Can we scroll left more?
if (container.scrollLeft > tolerance) {
  // Scroll within current section
  scrollBy(-pageStep);
} else {
  // Load previous spine item
  loadPreviousSection();
}
```

### Key Files to Focus On

- `/src/managers/default/index.ts` - Main navigation logic (lines ~650-1200)
- `/e2e/cross-chapter-navigation.spec.ts` - Core navigation test (simplify)
- `/examples/transparent-iframe-hightlights.html` - Manual test case
- Create one focused test that covers the boundary case without excess logging

### Testing Strategy

1. **Manual first**: Get the transparent-iframe example working perfectly
2. **Automated second**: Make tests match manual behavior exactly
3. **Edge cases last**: Only after core navigation is bulletproof

The core insight is correct - **page counts are unreliable, scroll position is truth**. We just need to implement it more simply and thoroughly.

## Current Branch State

- Multiple changes in progress in `/src/managers/default/index.ts`
- Some tests passing, some failing
- Manual testing shows remaining issues
- Need systematic approach to complete the fix

**Priority**: Get basic bidirectional navigation (Chapter 1 ↔ Epigraph) working flawlessly before expanding scope.
