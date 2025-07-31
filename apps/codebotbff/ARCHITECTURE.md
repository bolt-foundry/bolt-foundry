# Codebotbff Architecture - Tauri + Embedded Deno

## Overview

Codebotbff is designed as a single-binary desktop application that combines:

- Tauri for native window management and system APIs
- Embedded Deno runtime for executing TypeScript directly
- Direct monorepo integration without build steps

## Key Innovation: No Build Step Required

Traditional Tauri apps require:

```
TypeScript → Bundler (Vite/Webpack) → JavaScript Bundle → Tauri
```

Our approach:

```
TypeScript → Embedded Deno Runtime → Direct Execution in Tauri
```

## Architecture Components

### 1. Rust Backend (`src-tauri/`)

#### Core Components:

- **lib.rs**: Main Tauri application setup and commands
- **deno_runtime.rs**: Deno runtime integration module

#### Key Features:

```rust
// Embed Deno runtime directly in the binary
let runtime = create_deno_runtime();

// Execute TypeScript directly
runtime.execute_module("/@bfmono/apps/codebotbff/src/app.tsx");

// Expose Tauri APIs to Deno
globalThis.__CODEBOTBFF__ = {
    invoke: (cmd, args) => tauri_invoke(cmd, args),
    projectRoot: "/@bfmono"
};
```

### 2. TypeScript Frontend (`src/`)

#### Direct Imports from Monorepo:

```typescript
// These work without any bundling!
import { BfDsButton } from "@bfmono/apps/bfDs/components/BfDsButton.tsx";
import { codebot } from "@bfmono/infra/bft/tasks/codebot.bft.ts";
import { Terminal } from "xterm";
```

#### No Build Configuration Needed:

- No webpack.config.js
- No vite.config.ts (only for dev server)
- No tsconfig.json bundling setup
- Just TypeScript files that run directly

### 3. Communication Layer

#### Tauri → Deno:

```rust
// In Rust
#[op2(async)]
async fn op_tauri_invoke(cmd: String, args: Value) -> Result<Value> {
    // Call Tauri commands from Deno
}
```

#### Deno → Tauri:

```typescript
// In TypeScript
const workspace = await globalThis.__CODEBOTBFF__.invoke(
  "create_new_workspace",
  {},
);
```

## Benefits

### 1. **Development Speed**

- Change TypeScript → Instantly see results
- No waiting for bundler
- Hot reload without rebuilding

### 2. **Monorepo Native**

- Import any module directly
- Share components with web apps
- Use existing tools (bft, etc.)

### 3. **Distribution**

- Single binary includes everything
- No Node.js required on user machine
- Smaller than Electron alternatives

### 4. **Type Safety**

- Full TypeScript support
- Deno handles type checking
- Seamless IDE integration

## Implementation Requirements

### Dependencies Needed:

1. **Rust crates**:
   - `deno_core` - Core V8 runtime
   - `deno_runtime` - Full Deno runtime
   - `tauri` - Desktop framework
   - Standard Tauri plugins

2. **System Requirements**:
   - Rust toolchain
   - C compiler (for building native deps)
   - Platform-specific deps (webkit2gtk on Linux, etc.)

### Build Process:

```bash
# Development
deno task tauri:dev  # Runs with hot reload

# Production
deno task tauri:build  # Creates single binary
```

## Future Enhancements

### 1. **Module Bundling for Distribution**

- Bundle monorepo files into binary
- Virtual file system for imports
- Signed/encrypted modules

### 2. **Enhanced DevTools**

- Built-in TypeScript debugger
- Performance profiling
- Module dependency viewer

### 3. **Plugin System**

- Load additional Deno modules at runtime
- Community plugins
- Workspace extensions

## Example Use Cases

### 1. **Container Management UI**

```typescript
import { Docker } from "@bfmono/packages/docker/client.ts";
import { BfDsTable } from "@bfmono/apps/bfDs/components/BfDsTable.tsx";

// Direct access to Docker API
const containers = await Docker.listContainers();

// Display using BfDs components
<BfDsTable data={containers} />;
```

### 2. **Integrated Terminal**

```typescript
import { Terminal } from "xterm";
import { createPty } from "@bfmono/packages/pty/pty.ts";

// Create PTY connection to container
const pty = await createPty({ container: workspace });
terminal.attach(pty);
```

### 3. **File System Integration**

```typescript
import { walkDir } from "@bfmono/packages/fs/walk.ts";

// Direct file system access
for await (const file of walkDir(workspacePath)) {
  fileTree.addNode(file);
}
```

## Conclusion

This architecture represents a new way to build desktop apps that are:

- Truly integrated with your monorepo
- Fast to develop and iterate
- Small and efficient to distribute
- Type-safe throughout

The combination of Tauri's native capabilities with Deno's TypeScript runtime
creates a powerful platform for building developer tools that feel native to
your codebase.
