# Scalable UIDemo Implementation Plan

**Date**: 2025-07-12\
**Author**: Claude Code\
**Status**: Planning\
**Scope**: apps/boltfoundry-com UIDemo auto-discovery system

## Problem Statement

The current UIDemo implementation requires manual maintenance whenever new
design system components are added:

- **Manual maintenance overhead**: Adding new bfDs components requires manual
  updates to UIDemo
- **Knowledge bottleneck**: Team relies on Justin to know what components exist
- **Unused examples**: 15 well-structured examples in `bfDs/__examples__/` but
  only 2 used in UIDemo

### Current State Analysis

- **15 existing examples**: `apps/bfDs/components/__examples__/` has
  comprehensive examples following consistent patterns
- **Manual hardcoding**: `boltfoundry-com/UIDemo.tsx` only shows BfDsButton
  examples
- **Working isograph setup**: Current wrapper pattern works, just needs better
  data source

## Solution: Simple Auto-Discovery (Worse is Better)

**Goal**: Eliminate manual maintenance with minimal code changes

**Core Insight**: The examples already exist and follow consistent patterns. We
just need to import them automatically instead of manually.

### Minimal Architecture

```
Immediate: Manual index file → UIDemo auto-imports all examples
Future: Build script → Auto-generates index file
```

### Design Principles

1. **Solve the immediate problem**: Stop manual maintenance now
2. **Minimal code changes**: Work with existing patterns
3. **Zero breaking changes**: Don't touch existing component structure
4. **Incremental improvement**: Foundation for future enhancements

## Implementation Plan (Worse is Better)

### Step 1: Immediate Fix (30 minutes)

Create a simple index file to import all examples at once.

**File**: `apps/bfDs/components/__examples__/index.ts` (create)

```typescript
// Simple re-exports - manually maintained for now
export { BfDsButtonExample } from "./BfDsButton.example.tsx";
export { BfDsCalloutExample } from "./BfDsCallout.example.tsx";
export { BfDsCheckboxExample } from "./BfDsCheckbox.example.tsx";
export { BfDsFormExample } from "./BfDsForm.example.tsx";
export { BfDsFormSubmitButtonExample } from "./BfDsFormSubmitButton.example.tsx";
export { BfDsIconExample } from "./BfDsIcon.example.tsx";
export { BfDsInputExample } from "./BfDsInput.example.tsx";
export { BfDsListExample } from "./BfDsList.example.tsx";
export { BfDsListItemExample } from "./BfDsListItem.example.tsx";
export { BfDsRadioExample } from "./BfDsRadio.example.tsx";
export { BfDsSelectExample } from "./BfDsSelect.example.tsx";
export { BfDsTabsExample } from "./BfDsTabs.example.tsx";
export { BfDsTextAreaExample } from "./BfDsTextArea.example.tsx";
export { BfDsToastExample } from "./BfDsToast.example.tsx";
export { BfDsToggleExample } from "./BfDsToggle.example.tsx";
```

**File**: `apps/boltfoundry-com/src/components/UIDemo.tsx` (replace content)

```typescript
import { useState } from "react";
import * as Examples from "@bfmono/apps/bfDs/components/__examples__/index.ts";

export function UIDemo() {
  const [selectedComponent, setSelectedComponent] = useState<string | null>(
    null,
  );

  const exampleEntries = Object.entries(Examples);
  const componentNames = exampleEntries.map(([name]) =>
    name.replace("Example", "").replace("BfDs", "")
  );

  if (selectedComponent) {
    const ExampleComponent =
      Examples[`BfDs${selectedComponent}Example` as keyof typeof Examples];
    return (
      <div style={{ padding: "2rem" }}>
        <button onClick={() => setSelectedComponent(null)}>
          ← Back to List
        </button>
        <h2>{selectedComponent}</h2>
        <ExampleComponent />
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>BfDs Component Library</h1>
      <p>All {componentNames.length} components with examples:</p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "1rem",
          marginTop: "2rem",
        }}
      >
        {componentNames.map((name) => (
          <button
            key={name}
            onClick={() => setSelectedComponent(name)}
            style={{
              padding: "1rem",
              backgroundColor: "var(--bfds-primary, #007bff)",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}
```

**Result**: All 15 components now appear automatically in UIDemo with zero
future maintenance.

### Step 2: Auto-Generate Index (Future Enhancement)

When we want to eliminate the manual index file, create a build script:

**File**: `infra/appBuild/componentsBuild.ts` (follow `routesBuild.ts` pattern)

```typescript
// Simple file scanner that generates the index.ts file automatically
// Integrates with existing build pipeline in iso.bft.ts
```

**Why later**: The manual index file solves 95% of the problem. Auto-generation
is pure optimization.

## Benefits

### Immediate Impact (30 minutes of work)

- **Solves manual maintenance**: New components require one line in index file
  instead of updating UIDemo
- **Complete visibility**: All 15 components visible instead of just 2
- **Working foundation**: Ready for future auto-generation enhancement
- **Zero breaking changes**: Existing isograph setup unchanged

### Future Potential

- **Full automation**: Build script can eliminate manual index file
- **Searchable library**: Foundation for search/filter features
- **Cross-app pattern**: Can be applied to boltFoundry, aibff/gui

## Implementation Timeline

- **Step 1**: Immediate fix (30 minutes)
- **Step 2**: Auto-generation (future enhancement, 2-3 hours)

**Immediate ROI**: 30 minutes of work eliminates ongoing manual maintenance

## Future Enhancements (Optional)

Once the basic auto-discovery is working, these could be added incrementally:

1. **Build-time auto-generation**: Replace manual index file with automated
   scanner
2. **Search and filtering**: Add component search and category filters
3. **Cross-app pattern**: Apply same approach to boltFoundry and aibff/gui
4. **Enhanced metadata**: Component descriptions, complexity ratings, etc.

## Conclusion

This "worse is better" approach solves the immediate problem (manual maintenance
overhead) with minimal code changes while establishing a foundation for future
enhancements.

**Key insight**: The examples already exist and follow consistent patterns. We
just need to import them systematically instead of manually.

**Next step**: Implement Step 1 in 30 minutes to get immediate value.

---

## Appendix: File References

### Current Implementation Files

**apps/boltFoundry/pages/PageUIDemo.tsx** - Manual static array implementation
with 15+ hardcoded components

**apps/boltfoundry-com/src/components/UIDemo.tsx** - Basic implementation with
only button examples

**apps/boltfoundry-com/components/UIDemo.tsx** - Isograph wrapper component

**apps/bfDs/demo/Demo.tsx** - Most organized demo with structured metadata

**apps/bfDs/components/**examples**/** - Directory containing all bfDs example
components:

- BfDsButton.example.tsx
- BfDsCallout.example.tsx
- BfDsCheckbox.example.tsx
- BfDsForm.example.tsx
- BfDsIcon.example.tsx
- BfDsInput.example.tsx
- BfDsList.example.tsx
- BfDsListItem.example.tsx
- BfDsRadio.example.tsx
- BfDsSelect.example.tsx
- BfDsTabs.example.tsx
- BfDsTextArea.example.tsx
- BfDsToast.example.tsx
- BfDsToggle.example.tsx

### Build Infrastructure Files

**infra/appBuild/routesBuild.ts** - Auto-discovery infrastructure for routes
(pattern to follow)

**infra/bft/tasks/build.bft.ts** - Main build pipeline (no changes needed for
Step 1)

**infra/bft/tasks/iso.bft.ts** - Isograph compilation task

### Configuration Files

**apps/boltfoundry-com/vite.config.ts** - Vite configuration (no changes needed)

**apps/boltfoundry-com/routes.ts** - Current routing configuration

**apps/boltfoundry-com/isograph.config.json** - Isograph configuration

### Files to be Created (Step 1)

**apps/bfDs/components/**examples**/index.ts** - Simple re-export index file

### Future Files (Step 2)

**infra/appBuild/componentsBuild.ts** - Auto-generation script (follows
routesBuild.ts pattern)
