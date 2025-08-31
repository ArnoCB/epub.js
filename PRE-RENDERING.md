# Pre-Rendering System

This document describes the new pre-rendering system for epub.js that helps eliminate white pages and improve navigation performance by pre-rendering all chapters off-screen.

## Overview

The pre-rendering system works by:

1. **Pre-rendering all chapters** as off-screen elements when the book is loaded
2. **Storing rendered views** in a collection that can be attached/detached from the DOM
3. **Providing better debugging** with visibility into the rendering state of all chapters

## Usage

### Basic Usage

```javascript
// Enable pre-rendering when creating a rendition
const rendition = book.renderTo("viewer", {
  width: 800,
  height: 600,
  usePreRendering: true // Enable pre-rendering
});

// Pre-rendering will automatically start after the rendition is rendered
await rendition.display();

// Navigate normally - pre-rendered chapters will be used when available
rendition.next();
rendition.prev();
```

### Advanced Usage

```javascript
// Access the pre-renderer directly (if using DefaultViewManager)
const viewManager = rendition.manager;
if (viewManager.preRenderer) {
  // Check pre-rendering status
  const status = viewManager.preRenderer.status;
  console.log(`Pre-rendered: ${status.rendered}/${status.total} chapters`);
  
  // Get specific chapter
  const chapter = viewManager.preRenderer.getChapter('chapter1.html');
  if (chapter) {
    console.log('Chapter ready:', chapter.rendered.promise);
  }
  
  // Get debugging information
  const debugInfo = viewManager.preRenderer.getDebugInfo();
  console.log('Pre-renderer state:', debugInfo);
}
```

## Architecture

### Classes

- **`BookPreRenderer`**: Main pre-rendering class that manages off-screen rendering
- **`PreRenderedChapter`**: Interface representing a pre-rendered chapter
- **`ViewSettings`**: Configuration interface for pre-rendered views

### Key Methods

#### BookPreRenderer

- `preRenderBook(sections: Section[])`: Pre-render all sections from the spine
- `getChapter(href: string)`: Get a pre-rendered chapter
- `attachChapter(href: string)`: Attach a chapter to the main DOM
- `detachChapter(href: string)`: Detach a chapter from the main DOM
- `waitForChapter(href: string)`: Wait for a chapter to finish rendering
- `getDebugInfo()`: Get debugging information about all chapters

#### DefaultViewManager Integration

- `initializePreRendering(sections: Section[])`: Initialize pre-rendering for all sections
- `displayPreRendered(section: Section, target?)`: Display a pre-rendered chapter
- `hasPreRenderedChapter(href: string)`: Check if a chapter is pre-rendered

## Benefits

1. **Eliminates White Pages**: Chapters are already rendered when navigated to
2. **Faster Navigation**: No need to wait for rendering during navigation
3. **Better Debugging**: Full visibility into rendering state
4. **Consistent Dimensions**: Chapters maintain proper widths and positioning
5. **Memory Efficient**: Uses off-screen rendering and DOM attachment/detachment

## Implementation Details

### Off-Screen Rendering

Pre-rendered chapters are created in an off-screen container with these properties:
- Positioned absolutely outside the viewport (`left: -10000px`)
- Hidden from user interaction (`pointer-events: none; visibility: hidden`)
- Maintains proper dimensions for accurate rendering

### DOM Management

The system manages two containers:
- **Off-screen container**: Holds pre-rendered chapters not currently displayed
- **Main container**: Holds the currently displayed chapter(s)

Chapters are moved between containers as needed for navigation.

### Error Handling

- Failed chapter renders are tracked and don't block other chapters
- Graceful fallback to normal rendering if pre-rendering fails
- Debugging information includes error states

## Configuration

The pre-rendering system can be configured through the rendition options:

```javascript
const rendition = book.renderTo("viewer", {
  // Standard options
  width: 800,
  height: 600,
  flow: "paginated",
  
  // Pre-rendering options
  usePreRendering: true,
  
  // These affect pre-rendered chapters
  allowScriptedContent: false,
  allowPopups: false,
  transparency: true
});
```

## Debugging

### Console Logging

The pre-renderer provides detailed console logging:
- Chapter rendering progress
- DOM attachment/detachment events
- Error states and recoveries
- Dimension calculations

### Debug Information

Use `getDebugInfo()` to get comprehensive information:

```javascript
const debugInfo = viewManager.preRenderer.getDebugInfo();
console.table(debugInfo.chapters);
```

This includes:
- Rendering status for each chapter
- DOM attachment state
- Calculated dimensions
- Content availability
- Parent container information

## Performance Considerations

- Pre-rendering starts after the initial chapter is displayed
- Chapters are rendered asynchronously to avoid blocking the UI
- Memory usage is managed by keeping chapters off-screen when not needed
- Failed chapters don't retry automatically to avoid infinite loops

## Compatibility

The pre-rendering system is designed to be backwards compatible:
- Works with existing epub.js configurations
- Falls back gracefully to normal rendering if disabled
- Maintains the same public API for navigation methods
