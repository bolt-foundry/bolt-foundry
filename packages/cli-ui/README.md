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

## Best practices

1. Use `ui.output()` only for the actual command result
2. All status messages should use `info()`, `warn()`, or `error()`
3. This ensures scripts can safely pipe output: `bft task | jq .`
