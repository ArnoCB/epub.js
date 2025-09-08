# EPUB.js Pre-rendering System - Continuation Prompt

## Current State Summary

**NAVIGATION ISSUE RESOLVED ✅**
- **Root Cause**: Cover pages have `linear: false` and `section.next()` returns `undefined`
- **This is correct EPUB behavior** - covers are standalone, not part of sequential reading
- **Solution**: Both examples now start at spine index 1 (first linear chapter) for proper navigation testing
- **Navigation works correctly** from linear chapters in DefaultViewManager

## Pre-rendering Architecture Goals

### 1. Inject PreRenderer into PreRenderingViewManager
The PreRenderingViewManager should extend DefaultViewManager and:
- Check if a section is already pre-rendered
- Use pre-rendered content when available
- Fall back to DefaultViewManager's rendering logic when not available
- Maintain the same public API as DefaultViewManager

### 2. Abstract Rendering Logic
Current problems:
- PreRenderer duplicates view creation logic from managers
- Each manager implements its own rendering approach
- No consistency between regular rendering and pre-rendering

**Proposed solution**: Create a `ViewRenderer` class that:
- Handles iframe creation, content loading, and layout formatting
- Can be used by both managers and pre-renderer
- Provides consistent rendering behavior across all contexts
- Supports different rendering strategies (immediate vs. offscreen)

### 3. Manager Integration Strategy
PreRenderingViewManager should:
```typescript
async display(section: Section): Promise<View> {
  // 1. Check if section is pre-rendered
  const preRendered = this.preRenderer?.getChapter(section.href);
  
  if (preRendered && preRendered.attached === false) {
    // 2. Use pre-rendered content (fast path)
    return this.attachPreRenderedChapter(preRendered);
  } else {
    // 3. Fall back to default rendering (slow path)
    return super.display(section);
  }
}
```

## Implementation Roadmap

### Phase 1: Abstract View Rendering
1. **Create `ViewRenderer` class** in `src/managers/helpers/view-renderer.ts`
   - Extract iframe creation logic from managers
   - Extract content loading and layout formatting
   - Support both immediate and offscreen rendering
   - Handle sandbox settings, dimensions, and content preservation

2. **Update DefaultViewManager** to use ViewRenderer
   - Replace inline rendering logic with ViewRenderer calls
   - Ensure backward compatibility
   - Test that existing functionality works unchanged

3. **Update PreRenderer** to use ViewRenderer
   - Remove duplicated view creation code
   - Use same rendering logic as managers
   - Ensure pre-rendered content matches manager-rendered content

### Phase 2: Manager Integration
1. **Enhance PreRenderingViewManager** in `src/managers/prerendering/index.ts`
   - Implement pre-rendered content checking
   - Add fallback to DefaultViewManager methods
   - Handle attachment/detachment of pre-rendered views
   - Maintain view lifecycle correctly

2. **Improve PreRenderer Integration**
   - Add methods for manager-triggered pre-rendering
   - Implement background pre-rendering of upcoming sections
   - Handle pre-rendering failures gracefully
   - Add metrics and debugging support

### Phase 3: Performance Optimization
1. **Smart Pre-rendering Strategy**
   - Pre-render next 2-3 sections based on reading direction
   - Pre-render previous 1-2 sections for back navigation
   - Clean up old pre-rendered content to manage memory
   - Priority-based pre-rendering (current chapter area first)

2. **Content Preservation Improvements**
   - Solve iframe content loss on DOM moves
   - Implement stable container strategy
   - Add content validation and restoration
   - Handle edge cases and error recovery

## Key Technical Challenges

### 1. Iframe Content Loss Problem
**Issue**: Moving iframe elements between DOM containers clears their content
**Current workaround**: Content preservation and restoration (fragile)
**Better solutions to explore**:
- CSS positioning without DOM moves
- Stable container strategy with show/hide
- Content cloning instead of moving
- Virtual container system

### 2. View Lifecycle Management
**Challenges**:
- When to pre-render vs. render on-demand
- How to handle view events and listeners
- Memory management for pre-rendered content
- Synchronization between pre-rendered and live views

### 3. Content Consistency
**Requirements**:
- Pre-rendered content must match manager-rendered content exactly
- Same layout, pagination, and formatting
- Same iframe sandbox settings and restrictions
- Same event handling and interaction behavior

## File Structure Changes Needed

```
src/managers/
├── helpers/
│   ├── view-renderer.ts          # NEW: Extracted rendering logic
│   └── views.ts                  # Existing view management
├── default/
│   └── index.ts                  # Update to use ViewRenderer
├── prerendering/
│   └── index.ts                  # Enhance with pre-rendered content checking
└── prerenderer.ts                # Update to use ViewRenderer
```

## Testing Strategy

### 1. Regression Testing
- Ensure DefaultViewManager behavior unchanged
- Verify all existing examples work correctly
- Test navigation, pagination, and layout
- Validate event handling and user interactions

### 2. Pre-rendering Testing
- Test pre-rendered content matches regular rendering
- Verify smooth transitions between pre-rendered and regular content
- Test fallback scenarios when pre-rendering fails
- Validate memory usage and cleanup

### 3. Performance Testing
- Measure pre-rendering impact on initial load time
- Test navigation speed improvements
- Monitor memory usage patterns
- Validate on different device types and browsers

## Success Criteria

### Short-term (Phase 1)
- [ ] ViewRenderer class created and tested
- [ ] DefaultViewManager uses ViewRenderer without regression
- [ ] PreRenderer uses ViewRenderer for consistent rendering
- [ ] All existing functionality preserved

### Medium-term (Phase 2)
- [ ] PreRenderingViewManager checks for pre-rendered content
- [ ] Smooth fallback to DefaultViewManager when needed
- [ ] Pre-rendered content displays instantly
- [ ] Navigation between pre-rendered and regular content works

### Long-term (Phase 3)
- [ ] Smart pre-rendering strategy improves reading experience
- [ ] Memory usage optimized and bounded
- [ ] Iframe content loss problem solved
- [ ] Performance metrics show measurable improvements

## Next Steps

1. **Start with ViewRenderer abstraction** - this provides foundation for everything else
2. **Test thoroughly** - ensure no regressions in existing functionality
3. **Iterate on manager integration** - build up pre-rendering capabilities gradually
4. **Optimize based on real usage** - measure and improve performance iteratively

## Important Notes

- **Cover page navigation**: Remember that covers have `linear: false` and don't navigate
- **Start examples at spine index 1**: Ensures navigation testing works correctly
- **Preserve existing APIs**: Changes should be internal, public APIs should remain stable
- **Security considerations**: Maintain iframe sandboxing and content isolation
- **Cross-browser compatibility**: Test on major browsers and devices

---

This continuation prompt provides a comprehensive roadmap for enhancing the pre-rendering system while maintaining the architectural improvements we've identified during the navigation debugging work.
