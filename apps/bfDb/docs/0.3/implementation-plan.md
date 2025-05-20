# GraphQL Builder v0.3 Implementation Plan

## Summary

This implementation plan outlines a minimal approach for improving the GraphQL
interface registration system in the bfDb project. Building on v0.2's
GraphQLNode and interface implementation, we'll use a decorator-based approach
to identify GraphQL interfaces regardless of their location in the codebase, and
ensure the barrel file system correctly exports all interfaces decorated with
@GraphQLInterface.

## Goals

- Implement a decorator-based interface detection system
- Enhance genBarrel.ts to scan for @GraphQLInterface decorators
- Ensure the interfacesList.ts barrel file contains all interfaces
- Update loadGqlTypes.ts to correctly use the interfaces from the barrel file

## Non-Goals

- Adding registry objects or complex validation
- Creating new barrel utility functions
- Implementing barrels for other GraphQL type categories (deferred to v0.4)
- Creating a dedicated interfaces directory
- Migrating the remaining nodes to the new builder pattern (deferred to v0.4)
- Adding Relay-style connections (deferred to v0.4)

## Approach

1. **Simple Enhancement**: Make minimal changes to the existing system
2. **Decorator-Based Detection**: Use decorators to identify interfaces
3. **Consistent Interface Loading**: Ensure interfaces are properly loaded

## Implementation Steps

1. **Review Current System**
   - Check the existing genBarrel.ts implementation
   - Locate all GraphQL interfaces in the current structure
   - Verify interfacesList.ts is being generated correctly
   - Examine how loadGqlTypes.ts and graphqlInterfaces.ts work together

2. **Implement Decorator-Based Detection**
   - Create GraphQLInterface decorator for marking interface classes
   - Implement decorator metadata storage for interface properties
   - Create helper functions to check if a class is an interface

3. **Update Barrel Generator**
   - Modify genBarrel.ts to detect @GraphQLInterface decorators in files
   - Add scanning logic to find interfaces in the classes directory
   - Keep the implementation simple and focused

4. **Verify Interface Loading**
   - Check that loadGqlTypes.ts properly processes all interfaces by decorator
   - Fix any issues with interface detection or loading

5. **Testing Strategy**
   - Verify GraphQL schema includes all interfaces
   - Test that interface-implementing objects are properly connected
   - Ensure all tests pass with the decorator-based approach
   - Add specific tests for interface loading and registration

   ### Unit Tests
   - **Interface Registration**: Verify interfaces with @GraphQLInterface are
     properly registered
   - **Decorator Functionality**: Test that @GraphQLInterface correctly
     identifies classes as interfaces
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

### Decorator-Based Interface Detection

Use decorators to identify interfaces anywhere in the codebase:

```typescript
// GraphQL interface decorator
export function GraphQLInterface(options: GraphQLInterfaceOptions = {}) {
  return function (target: any): any {
    // Store metadata on the class constructor itself
    (target as any)[GRAPHQL_INTERFACE_PROPERTY] = {
      isInterface: true,
      name: options.name || target.name,
      description: options.description,
      target,
    };
    return target;
  };
}

// Check if a class is an interface
export function isGraphQLInterface(target: unknown): boolean {
  return !!(target as any)[GRAPHQL_INTERFACE_PROPERTY];
}
```

### Updated Barrel Configuration

Modify the barrel configuration in genBarrel.ts to detect @GraphQLInterface
decorators:

```typescript
const barrels: BarrelConfig[] = [
  // Existing barrel configurations...

  // GraphQL interfaces - scan classes for @GraphQLInterface decorators
  {
    dir: new URL("../classes/", import.meta.url),
    out: new URL(
      "../graphql/__generated__/interfacesList.ts",
      import.meta.url,
    ),
    importPath: (f) => `apps/bfDb/classes/${f}`,
    banner: `/**
 * GraphQL Interface Barrel File
 *
 * @generated
 * This file is auto-generated. Do not edit directly.
 * 
 * Contains exports of all classes decorated with @GraphQLInterface.
 */`,
  },
];
```

### Updated Interface Loading System

The graphqlInterfaces.ts file already imports from the barrel file:

```typescript
// Existing import in graphqlInterfaces.ts
import * as interfaceClasses from "./__generated__/interfacesList.ts";
```

The loadGqlTypes.ts file already imports and uses loadInterfaces properly:

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

The loadInterfaces function processes all exports from the barrel file and
filters for decorated classes:

```typescript
export function loadInterfaces() {
  const interfaces = [];

  // Process all interfaces from the barrel file
  for (const [exportName, interfaceClass] of Object.entries(interfaceClasses)) {
    if (
      typeof interfaceClass === "function" && isGraphQLInterface(interfaceClass)
    ) {
      // Create interface definition from the class
      const interfaceDef = createInterfaceFromClass(interfaceClass);
      if (interfaceDef) {
        interfaces.push(interfaceDef);
      }
    }
  }

  return interfaces;
}
```

## Success Metrics

- ✅ GraphQL interface decorator is properly implemented
- ✅ GenBarrel.ts correctly identifies files with @GraphQLInterface decorator
- ✅ All GraphQL interfaces are included in the barrel file
- ✅ Interface loading in loadGqlTypes.ts and graphqlInterfaces.ts works
  correctly with the decorator-based approach
- ✅ GraphQL schema includes all interfaces properly
- ✅ Interface-implementing objects are correctly connected to their interfaces
- ✅ All tests pass with the decorator-based detection approach

## Implementation Status

We have successfully implemented all core requirements for v0.3:

1. ✅ Created a decorator-based interface detection system
2. ✅ Implemented the @GraphQLInterface decorator for marking interfaces
3. ✅ Updated the barrel generator (genBarrel.ts) to detect decorated classes
4. ✅ Enhanced loadInterfaces function to properly register interfaces
5. ✅ Added enhanced debugging to diagnose interface loading issues
6. ✅ Updated tests to properly detect interfaces in the GraphQL schema

Work remaining:

- Implement more robust detection of interface implementations in GraphQL
  objects

## Next Steps (Future Work for v0.4)

- Implement barrel files for other GraphQL type categories
- Add validation during barrel generation
- Create a more comprehensive barrel utility
- Complete the migration of remaining nodes to the new builder pattern
- Add support for additional edge relationship patterns
- Add Relay-style connections with pagination support
- Consider further organizing types by function (queries, mutations, etc.)
