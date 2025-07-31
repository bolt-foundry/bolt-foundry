# CLI UI

Consistent UI output utilities for Bolt Foundry command-line tools.

## Problem

CLI tools need to separate:

- **UI messages** (info, warnings, errors) that should go to stderr
- **Command output** that might be piped or processed and should go to stdout

## Usage

```typescript
import { ui } from "@bfmono/packages/cli-ui/cli-ui.ts";

// UI messages go to stderr
ui.info("Processing files...");
ui.warn("File not found, skipping");
ui.error("Invalid configuration");

// Actual output goes to stdout (can be piped)
ui.output(JSON.stringify(result));

// Debug messages only show with DEBUG=1
ui.debug("Detailed trace information");
```

## Features

### Default UI

The standard UI that writes to console:

- `info()`, `warn()`, `error()`, `debug()` → stderr
- `output()` → stdout

### Prefixed UI

Add a consistent prefix to all messages:

```typescript
const bftUI = createPrefixedUI("bft");
bftUI.info("Loading tasks..."); // [bft] Loading tasks...
```

### Testing utilities

```typescript
// Silent UI for tests that shouldn't produce output
const silent = createSilentUI();

// Capturing UI for testing message output
const capture = createCapturingUI();
capture.info("test");
assertEquals(capture.captured[0], { type: "info", message: "test" });
```

## Terminal Titlebar

Update the terminal titlebar to provide visual feedback:

```typescript
import {
  clearTitlebar,
  createTitlebarUpdater,
  supportsTitlebar,
  updateTitlebar,
} from "@bfmono/packages/cli-ui/cli-ui.ts";

// Check if terminal supports titlebar updates
if (supportsTitlebar()) {
  // Basic title update
  await updateTitlebar("My App - Processing...");

  // Clear title (reset to default)
  await clearTitlebar();

  // Use a prefixed updater
  const titlebar = createTitlebarUpdater("MyApp");
  await titlebar.update("Loading..."); // Sets "MyApp: Loading..."
  await titlebar.clear();
}
```

### Titlebar Functions

- `updateTitlebar(title)` - Set the terminal title
- `clearTitlebar()` - Reset to default terminal title
- `createTitlebarUpdater(prefix)` - Create a prefixed updater
- `supportsTitlebar()` - Check if terminal supports title updates

## Best practices

1. Use `ui.output()` only for the actual command result
2. All status messages should use `info()`, `warn()`, or `error()`
3. This ensures scripts can safely pipe output: `bft task | jq .`
4. Check `supportsTitlebar()` before updating titles in production code
5. Always clear or restore titles when your process completes
