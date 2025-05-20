# GraphQL Builder v0.3 Implementation Plan

## Summary

This implementation plan outlines the approach for enhancing the barrel file
system for GraphQL types in the bfDb system. Building on the success of v0.2's
GraphQLNode and interface implementation, we'll now focus on creating a more
robust, automated registration system for all GraphQL-related types. This will
reduce manual registration work, improve consistency, and lay the groundwork for
future feature development.

## Goals

- Create a unified barrel file generation system for all GraphQL types
- Standardize the pattern for automatic type registration
- Implement validation during the barrel file generation process
- Provide helpers for accessing registered types programmatically
- Ensure type safety throughout the registration system
- Reduce manual registration work when adding new types
- Improve developer experience when working with GraphQL types

## Non-Goals

- Changing the existing GraphQL interface implementation from v0.2
- Migrating the remaining nodes to the new builder pattern (deferred to v0.4)
- Adding Relay-style connections (deferred to v0.4)
- Changing existing field resolution behavior
- Adding validation against bfNodeSpec.relations (deferred to v0.4)

## Approach

1. **Enhanced Barrel Generation**: Create a more comprehensive barrel file
   generation system
2. **Standardized Registration**: Implement consistent patterns for registration
   across entity types
3. **Validation Logic**: Add validation during barrel generation to catch issues
   early
4. **Type Safety**: Ensure strong typing throughout the system using TypeScript
   generics
5. **Developer Tools**: Add helpers for working with the registration system

## Implementation Steps

1. **Analyze Current Barrel System**
   - Review existing barrel files in **generated** directories
   - Document the current generation process
   - Identify improvement opportunities
   - Catalog all type categories that need barrel files

2. **Design Enhanced Barrel System**
   - Create a comprehensive barrel file architecture
   - Define naming conventions and file organization
   - Design validation rules for generated barrel files
   - Define interfaces for the generator system

3. **Implement Barrel File Generator**
   - Create generator utilities with strong typing
   - Implement file scanning and module identification
   - Add support for filtering modules by criteria
   - Include validation checks during generation

4. **Create Standard Registration Patterns**
   - Implement consistent registration for different entity types
   - Create unified loading mechanism in loadGqlTypes.ts
   - Add support for registration order control
   - Ensure proper dependency management between types

5. **Add Type Safety Enhancements**
   - Create type-safe accessors for registered types
   - Implement generic type constraints for registration functions
   - Add runtime type checking utilities
   - Ensure proper TypeScript integration

6. **Implement Developer Tools**
   - Create helpers for accessing registered types
   - Add diagnostic tools for the barrel system
   - Implement debugging utilities for registration issues
   - Create documentation for the barrel system

7. **Testing**
   - Create tests for barrel file generation
   - Test registration of various entity types
   - Verify type safety constraints
   - Test validation rules and error reporting
   - Ensure backward compatibility

## Technical Design

### Barrel File Categories

We will implement a set of barrel files for different GraphQL type categories:

```
apps/bfDb/
  graphql/
    __generated__/
      interfacesList.ts       # GraphQL interfaces (from v0.2)
      rootObjectsList.ts      # Root query and mutation objects
      typesList.ts            # Regular GraphQL object types
      scalarsList.ts          # Custom scalar types
      enumsList.ts            # GraphQL enum types
      inputsList.ts           # GraphQL input types
      unionsList.ts           # GraphQL union types
```

### Barrel File Structure

Each barrel file will follow a consistent structure:

```typescript
/**
 * GraphQL [Type Category] Barrel File
 *
 * @generated
 * This file is auto-generated. Do not edit directly.
 */

// Export all [type category] from their respective modules
export * from "path/to/module1.ts";
export * from "path/to/module2.ts";
// ...

// Export a registry of all [type category]
export const [typeCategoryRegistry] = {
  Type1,
  Type2,
  // ...
};
```

### Barrel Generator Utilities

```typescript
// apps/bfDb/utils/barrelUtils.ts

/**
 * Configuration for barrel file generation
 */
export interface BarrelGenerationConfig {
  /** The directory to search for files */
  sourceDir: string;
  /** The output file path for the barrel file */
  outputPath: string;
  /** File pattern to match (glob pattern) */
  pattern: string;
  /** Function to filter modules (optional) */
  filter?: (filePath: string) => boolean;
  /** Function to transform the module path (optional) */
  transformPath?: (filePath: string) => string;
  /** Header comment for the generated file */
  header: string;
  /** Registry variable name (optional) */
  registryName?: string;
}

/**
 * Generates a barrel file based on the provided configuration
 */
export async function generateBarrelFile(
  config: BarrelGenerationConfig,
): Promise<void> {
  // Implementation details...
}

/**
 * Scans a directory for specific types using decorators or other criteria
 */
export async function scanDirectoryForTypes<T>(
  directory: string,
  pattern: string,
  typeCheck: (module: unknown) => module is T,
): Promise<T[]> {
  // Implementation details...
}
```

### Integration with bff

We'll integrate the barrel file generation with the BFF CLI tooling:

```typescript
// In genGqlTypes.bff.ts

/**
 * Generate GraphQL type barrel files
 */
export async function generateGraphQLBarrels(): Promise<void> {
  // Generate interface barrel
  await generateBarrelFile({
    sourceDir: "apps/bfDb/graphql",
    outputPath: "apps/bfDb/graphql/__generated__/interfacesList.ts",
    pattern: "**/*.ts",
    filter: (filePath) => {
      // Filter for interface files (using decorators or naming conventions)
      // ...
    },
    header: `/**
 * GraphQL Interface Barrel File
 *
 * @generated
 * This file is auto-generated. Do not edit directly.
 */`,
    registryName: "graphqlInterfaces",
  });

  // Generate other barrel files (rootObjects, types, scalars, etc.)
  // ...
}
```

### Updated loadGqlTypes.ts

```typescript
// apps/bfDb/graphql/loadGqlTypes.ts

import * as interfaces from "./__generated__/interfacesList.ts";
import * as rootObjects from "./__generated__/rootObjectsList.ts";
import * as types from "./__generated__/typesList.ts";
import * as scalars from "./__generated__/scalarsList.ts";
import * as enums from "./__generated__/enumsList.ts";
import * as inputs from "./__generated__/inputsList.ts";
import * as unions from "./__generated__/unionsList.ts";

export function loadGqlTypes() {
  const typeDefinitions = [];

  // Load in specific order to respect dependencies
  // 1. Scalars (no dependencies)
  for (const scalarType of Object.values(scalars.scalarRegistry)) {
    typeDefinitions.push(createScalarTypeDefinition(scalarType));
  }

  // 2. Enums (no dependencies)
  for (const enumType of Object.values(enums.enumRegistry)) {
    typeDefinitions.push(createEnumTypeDefinition(enumType));
  }

  // 3. Interfaces (may depend on scalars and enums)
  for (const interfaceType of Object.values(interfaces.graphqlInterfaces)) {
    typeDefinitions.push(createInterfaceTypeDefinition(interfaceType));
  }

  // 4. Input types (may depend on scalars, enums)
  for (const inputType of Object.values(inputs.inputRegistry)) {
    typeDefinitions.push(createInputTypeDefinition(inputType));
  }

  // 5. Union types (may depend on object types)
  for (const unionType of Object.values(unions.unionRegistry)) {
    typeDefinitions.push(createUnionTypeDefinition(unionType));
  }

  // 6. Object types (may depend on interfaces, scalars, enums)
  for (const objectType of Object.values(types.typeRegistry)) {
    typeDefinitions.push(createObjectTypeDefinition(objectType));
  }

  // 7. Root objects (may depend on all other types)
  for (const rootObject of Object.values(rootObjects.rootObjectRegistry)) {
    typeDefinitions.push(createRootObjectTypeDefinition(rootObject));
  }

  return typeDefinitions;
}
```

### Validation During Generation

```typescript
/**
 * Validates a GraphQL type before including it in the barrel file
 */
function validateGraphQLType(type: unknown, typeName: string): void {
  // Check for required properties
  if (!type) {
    throw new Error(`Type ${typeName} is undefined or null`);
  }

  // Type-specific validation
  if (isGraphQLInterface(type)) {
    validateGraphQLInterface(type, typeName);
  } else if (isGraphQLObjectType(type)) {
    validateGraphQLObjectType(type, typeName);
  }
  // Add other type validations...
}

/**
 * Validates a GraphQL interface
 */
function validateGraphQLInterface(
  interfaceType: unknown,
  typeName: string,
): void {
  // Check for the decorator
  if (!getGraphQLInterfaceMetadata(interfaceType)) {
    throw new Error(
      `Interface ${typeName} is missing the @GraphQLInterface decorator`,
    );
  }

  // Check for required fields
  // ...
}
```

### Type Registry Helpers

```typescript
/**
 * Gets a GraphQL interface by name
 */
export function getGraphQLInterface(
  name: string,
): GraphQLInterface | undefined {
  return Object.values(interfaces.graphqlInterfaces).find(
    (iface) => getGraphQLInterfaceMetadata(iface)?.name === name,
  );
}

/**
 * Gets a GraphQL object type by name
 */
export function getGraphQLObjectType(
  name: string,
): GraphQLObjectType | undefined {
  return Object.values(types.typeRegistry).find(
    (type) => type.name === name,
  );
}

// Add other helper functions...
```

## Success Metrics

- Barrel files are automatically generated for all GraphQL type categories
- No manual type registration is required when adding new types
- The registration system maintains correct dependencies between types
- Schema generation includes all registered types in the correct order
- Validation catches common issues at build time
- Developer experience is improved through helper utilities
- Tests pass for all aspects of the barrel system
- Documentation is clear and complete

## Next Steps (Future Work for v0.4)

- Complete the migration of remaining nodes to the new builder pattern
- Add support for additional edge relationship patterns
- Add Relay-style connections with pagination support
- Implement validation against bfNodeSpec.relations
- Add more sophisticated type generation tools
- Create visual diagram generators for schema visualization
