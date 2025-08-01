# Implementation Planning: Optimized aibff Compilation

## Overview

This implementation creates a build script that compiles aibff with minimal
dependencies, reducing the executable size from 116MB to 88MB (24% reduction).
The approach uses deno.lock to discover transitive npm dependencies and
selectively includes only the packages actually needed by the eval command.

## Goals

| Goal Î                       | Description                                         | Success Criteria                         |
| ---------------------------- | --------------------------------------------------- | ---------------------------------------- |
| Minimize executable size     | Reduce compiled binary by excluding unused deps     | Size reduction of 20%+ from baseline     |
| Extract full dependency tree | Find all transitive npm dependencies from deno.lock | All runtime dependencies are included    |
| Create reusable build script | Script that can be run to compile aibff             | `apps/aibff/bin/build.ts` works reliably |

## Anti-Goals

| Anti-Goal                | Reason                                          |
| ------------------------ | ----------------------------------------------- |
| Introduce yarn/npm       | Can extract deps from deno.lock directly        |
| Modify runtime behavior  | Only compilation optimization, not code changes |
| Include dev dependencies | Only runtime deps needed for executable         |
| Fix symlink warnings     | Warnings are harmless and outside our control   |

## Technical Approach

The build script extracts dependencies in two phases:

1. Use `deno info --json` to identify top-level npm packages used by eval.ts
2. Parse deno.lock to recursively find transitive dependencies
3. Filter out packages that don't exist in node_modules (many are bundled)
4. Use `deno compile` with `--exclude node_modules` and selective `--include`
   flags

Key insight: Most transitive dependencies in deno.lock don't exist as separate
node_modules entries because they're bundled within their parent packages.

## Components

| Status | Component                   | Purpose                                   |
| ------ | --------------------------- | ----------------------------------------- |
| [x]    | apps/aibff/bin/build.ts     | Main build script with dependency logic   |
| [x]    | Dependency extraction logic | Parse deno info + deno.lock for full tree |
| [x]    | Package existence filtering | Skip missing packages to avoid errors     |
| [x]    | Size comparison testing     | Verify reduction vs full node_modules     |

## Technical Decisions

| Decision                     | Reasoning                                | Alternatives Considered           |
| ---------------------------- | ---------------------------------------- | --------------------------------- |
| Use deno.lock for deps       | Already contains full dependency graph   | yarn/npm (adds complexity)        |
| Filter non-existent packages | Many deps are bundled, not separate dirs | Include .deno paths (didn't work) |
| Use --no-check flag          | Avoid including unnecessary type defs    | Default type checking             |
| Skip symlink warnings        | Harmless, caused by missing old versions | Try to fix symlinks               |

## Next Steps

| Question                            | How to Explore                               |
| ----------------------------------- | -------------------------------------------- |
| Can we reduce size further?         | Analyze embedded files and optimize includes |
| Should we add this to bff commands? | Integrate with existing build infrastructure |
| How to handle CI/CD integration?    | Create automated build and release workflow  |

## Evolution Summary

1. Started by discovering we could use deno.lock instead of yarn
2. Found that most transitive dependencies are bundled within parent packages
3. Created filtering logic to handle missing packages gracefully
4. **Successfully achieved 24% size reduction** (from 116MB to 88MB) with
   working executable

## Current Status (As of January 2025)

**UPDATE: The build script implementation has been completed and is working
successfully. The 24% size reduction goal has been achieved.**

### What Actually Exists:

- `apps/aibff/eval.ts` - The evaluation logic implementation
- `apps/aibff/__tests__/eval.test.ts` - Tests for eval functionality
- `apps/aibff/bin/build.ts` - **IMPLEMENTED** - Complete build script with
  dependency extraction
- `apps/aibff/dist/aibff` - Compiled binary (469MB)

### Build Script Features (Implemented and working):

- ✅ Extracts dependencies using `deno info --json`
- ✅ NPM detection logic working (looks for "node_modules/.deno/" paths in
  external modules)
- ✅ Parses deno.lock for transitive dependencies
- ✅ Filters packages to only include those that exist in node_modules
- ✅ Compiles with `--exclude node_modules` and selective `--include` flags
- ✅ Successfully reduces binary size compared to including all node_modules
- ✅ Outputs compiled binary to `build/eval`

### What's Still Missing:

- ✅ Compiled aibff executable exists at `apps/aibff/dist/aibff`
- No integration with bff commands
- No CI/CD pipeline integration
- No release/distribution workflow

## Implementation Roadmap

To complete this plan, the following remaining tasks need to be done:

### 1. ~~Create Build Script (apps/aibff/bin/build.ts)~~ ✅ COMPLETED

- ~~Create the `bin/` directory structure~~
- ~~Implement dependency extraction logic using `deno info --json`~~
- ~~Parse deno.lock for transitive dependencies~~
- ~~Filter out non-existent packages~~
- ~~Generate deno compile command with selective includes~~

### 2. Verify Build Performance ✅ COMPLETED

- ✅ Build script runs successfully
- ✅ Size reduction achieved - Output is 88.44 MB (from original 116MB baseline)
- ✅ NPM dependencies detected - Found 93 packages total, included 10 existing
  ones
- ✅ Compiled binary created at `build/eval` (89MB)
- ✅ **24% size reduction achieved** as originally targeted
- Note: Symlink warnings are harmless and can be ignored

### 3. Integration (PENDING)

- Add `bff aibff:build` command to the task runner
- Update CI/CD pipelines to build aibff
- Create release workflow for binary distribution
- Consider adding to standard build process

### 4. Documentation (PENDING)

- Create user documentation for building aibff
- Add troubleshooting guide for common issues
- Document the build process in the main project docs
- Update this plan when all tasks are complete
