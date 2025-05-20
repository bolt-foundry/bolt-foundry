# GraphQL Builder v0.3 Implementation Plan

## Summary

This implementation plan outlines a minimal approach for improving the GraphQL
interface registration system in the bfDb project. Building on v0.2's
GraphQLNode and interface implementation, we'll organize interfaces into a
dedicated directory and ensure the barrel file system correctly exports all
interfaces and the loadGqlTypes function properly uses them.

## Goals

- Create a dedicated interfaces directory for GraphQL interfaces
- Move existing interfaces to the new directory structure
- Ensure the genBarrel.ts includes GraphQL interfaces in its barrel generation
- Verify the interfacesList.ts barrel file contains all interfaces
- Update loadGqlTypes.ts to correctly use the interfaces from the barrel file

## Non-Goals

- Adding registry objects or complex validation
- Creating new barrel utility functions
- Implementing barrels for other GraphQL type categories (deferred to v0.4)
- Changing the existing GraphQL interface implementation from v0.2
- Migrating the remaining nodes to the new builder pattern (deferred to v0.4)
- Adding Relay-style connections (deferred to v0.4)

## Approach

1. **Simple Enhancement**: Make minimal changes to the existing system
2. **Consistent Interface Loading**: Ensure interfaces are properly loaded

## Implementation Steps

1. **Review Current System**
   - Check the existing genBarrel.ts implementation
   - Locate all GraphQL interfaces in the current structure
   - Verify interfacesList.ts is being generated correctly
   - Examine how loadGqlTypes.ts and graphqlInterfaces.ts work together

2. **Create Interfaces Directory Structure**
   - Create a new `apps/bfDb/graphql/interfaces/` directory
   - Move GraphQLNode.ts and other interfaces to this directory
   - Update imports in affected files including GraphQLObjectBase imports

3. **Update Barrel Generator**
   - Ensure genBarrel.ts includes GraphQL interfaces in its barrel configuration
   - Update directory paths to point to the new interfaces directory
   - Keep the implementation simple and focused

4. **Verify Interface Loading**
   - Check that loadGqlTypes.ts properly processes all interfaces from the new
     location
   - Fix any issues with interface detection or loading

5. **Testing Strategy**
   - Verify GraphQL schema includes all interfaces
   - Test that interface-implementing objects are properly connected
   - Ensure all tests pass with the new directory structure
   - Add specific tests for interface loading and registration

   ### Unit Tests
   - **Interface Registration**: Verify interfaces from the new directory are
     properly registered
   - **Decorator Functionality**: Test that @GraphQLInterface continues to
     identify classes correctly
   - **Barrel Generation**: Test that interfacesList.ts contains the expected
     exports
   - **Interface Resolution**: Verify concrete types can be resolved to their
     interfaces

   ### Integration Tests
   - **Schema Generation**: Test that interfaces appear in the schema with
     correct fields
   - **Type Implementation**: Verify objects correctly implement interfaces in
     GraphQL schema
   - **Query Resolution**: Test GraphQL queries that rely on interface types
     (e.g., fragments)
   - **Interface Loading**: Verify loadInterfaces() correctly loads all
     interfaces from the barrel file

## Technical Design

### Directory Structure Changes

Move interfaces to a dedicated directory:

```
apps/bfDb/
  graphql/
    interfaces/               # New dedicated interfaces directory
      GraphQLNode.ts         # Moved from graphql/GraphQLNode.ts
      [other interfaces]     # Any other interface classes
    __generated__/
      interfacesList.ts      # Generated registry of all interfaces
```

### Updated Barrel Configuration

Add interfaces to the barrel configuration in genBarrel.ts:

```typescript
const barrels: BarrelConfig[] = [
  // Existing barrel configurations...

  // Add GraphQL interfaces
  {
    dir: new URL("../graphql/interfaces/", import.meta.url),
    out: new URL(
      "../graphql/__generated__/interfacesList.ts",
      import.meta.url,
    ),
    importPath: (f) => `apps/bfDb/graphql/interfaces/${f}`,
    banner: `/**
 * GraphQL Interface Barrel File
 *
 * @generated
 * This file is auto-generated. Do not edit directly.
 */`,
  },
];
```

### Updated Interface Loading System

Update graphqlInterfaces.ts to import from the new location:

```typescript
// Update the import path in graphqlInterfaces.ts
import * as interfaceClasses from "./__generated__/interfacesList.ts";
```

The loadGqlTypes.ts file already imports and uses loadInterfaces properly, so
that doesn't need to change:

```typescript
// Existing code in loadGqlTypes.ts - doesn't need modification
import { loadInterfaces } from "apps/bfDb/graphql/graphqlInterfaces.ts";

export function loadGqlTypes() {
  const types = [];

  // Add all defined interfaces
  types.push(...loadInterfaces());

  // Process other types...

  return types;
}
```

Update the decorator handling to ensure it works with the interface directory
structure:

```typescript
// In decorators.ts - no changes needed
export function isGraphQLInterface(target: unknown): boolean {
  return !!(target as any)[GRAPHQL_INTERFACE_PROPERTY];
}
```

## Success Metrics

- All GraphQL interfaces are properly moved to the interfaces directory
- All GraphQL interfaces are included in the barrel file
- Interface loading in loadGqlTypes.ts and graphqlInterfaces.ts works correctly
  with the new directory structure
- All imports of GraphQLNode and other interfaces are updated correctly,
  especially in:
  - The BfNode class implementation (which extends GraphQLNode)
  - The GraphQLObjectBase imports in interface files
  - Any test files that use GraphQLNode directly
- GraphQL schema includes all interfaces properly
- Interface-implementing objects are correctly connected to their interfaces
- The @GraphQLInterface decorator continues to work correctly with the new
  structure
- All tests pass with the new directory structure

## Next Steps (Future Work for v0.4)

- Implement barrel files for other GraphQL type categories
- Add validation during barrel generation
- Create a more comprehensive barrel utility
- Complete the migration of remaining nodes to the new builder pattern
- Add support for additional edge relationship patterns
- Add Relay-style connections with pagination support
- Consider further organizing types by function (queries, mutations, etc.)
