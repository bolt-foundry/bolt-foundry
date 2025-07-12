# GraphQL Query Fragment System Tests

This directory contains comprehensive tests for the query fragment system that
enables selective GraphQL model imports for app-specific schemas.

## Test Files Overview

### Core Fragment System Tests

- **`defineQueryFragment.test.ts`** - Tests for the fragment definition system
  and builder API
- **`../queries/blogQueries.test.ts`** - Tests for blog-specific query fragments
- **`../queries/documentQueries.test.ts`** - Tests for document-specific query
  fragments
- **`../createAppSchema.test.ts`** - Tests for schema generation with selective
  fragments

### Integration and Compatibility Tests

- **`../__tests__/FragmentIntegration.test.ts`** - Integration tests with real
  GraphQL components
- **`../__tests__/BackwardCompatibility.test.ts`** - Backward compatibility with
  existing Query root
- **`../__tests__/FragmentErrorHandling.test.ts`** - Error handling and edge
  cases

## What's Being Tested

### 1. Fragment Definition and Builder API (`defineQueryFragment.test.ts`)

Tests the core fragment definition system:

- Fragment creation with fluent builder pattern
- Support for object fields, connections, and scalar fields
- Argument builders and resolver functions
- Type safety and validation

```typescript
const fragment = defineQueryFragment((gql) =>
  gql
    .object("blogPost", () => BlogPost, {
      args: (a) => a.string("slug"),
      resolve: async (_, args) => await BlogPost.findX(args.slug),
    })
    .connection("blogPosts", () => BlogPost, {/* ... */})
);
```

### 2. Fragment-Specific Functionality

#### Blog Queries (`blogQueries.test.ts`)

- `blogPost` field with slug argument
- `blogPosts` connection with sorting and filtering
- Error handling for missing posts
- Pagination support

#### Document Queries (`documentQueries.test.ts`)

- `documentsBySlug` field for document lookup
- `documents` connection with category filtering
- `documentContent` field for content extraction
- Published/draft filtering

### 3. Schema Composition (`createAppSchema.test.ts`)

Tests the `createAppSchema` function that combines fragments:

- Minimal configuration with single fragments
- Multiple query fragments composition
- Mutation fragments support
- Custom scalars and interfaces
- Dependency resolution and validation

```typescript
const schema = await createAppSchema({
  nodeTypes: [BlogPost, PublishedDocument],
  queryFragments: [blogPostQueries, documentQueries],
  mutationFragments: [blogMutations],
  customScalars: ["IsoDate"],
});
```

### 4. Integration Testing (`FragmentIntegration.test.ts`)

- Integration with existing GraphQL schema
- Fragment composition preserves all fields
- Resolver functionality maintenance
- Selective inclusion capabilities
- Performance characteristics
- App-specific schema generation

### 5. Backward Compatibility (`BackwardCompatibility.test.ts`)

Ensures fragment system is a drop-in replacement:

- Field names match current Query
- Field types match current Query
- Field arguments match current Query
- Resolvers produce same output
- Schema structure preservation
- Existing client query support

### 6. Error Handling (`FragmentErrorHandling.test.ts`)

Comprehensive error testing:

- Invalid fragment structures
- Missing dependencies
- Circular dependencies
- Field name conflicts
- Type safety violations
- Resolver error handling

## Key Test Scenarios

### Fragment Composition

```typescript
// Test selective inclusion
const blogOnlySchema = await createAppSchema({
  nodeTypes: [BlogPost],
  queryFragments: [blogPostQueries],
});

// Test full composition
const fullSchema = await createAppSchema({
  nodeTypes: [BlogPost, PublishedDocument],
  queryFragments: [blogPostQueries, documentQueries, githubQueries],
});
```

### Backward Compatibility

```typescript
// Ensure fragment-based schema matches current monolithic Query
const currentFields = Object.keys(currentQueryFields);
const fragmentFields = Object.keys(composedFragmentFields);
assertEquals(fragmentFields.sort(), currentFields.sort());
```

### Error Handling

```typescript
// Test missing dependencies
const errors = FragmentValidator.validateDependencies(
  [fragmentWithMissingDep],
  availableNodeTypes,
);
assert(errors.some((e) => e.type === "MISSING_DEPENDENCY"));
```

## Mock Implementations

The tests use mock implementations since the actual fragment system hasn't been
implemented yet:

- Mock `defineQueryFragment` function
- Mock `createAppSchema` function
- Mock fragment composition logic
- Mock BlogPost and PublishedDocument classes

These mocks simulate the expected behavior and API of the final implementation.

## Running the Tests

Once the fragment system is implemented, tests can be run with:

```bash
# Run all fragment tests
bft test --filter="fragment"

# Run specific test files
bft test apps/bfDb/graphql/fragments/defineQueryFragment.test.ts
bft test apps/bfDb/graphql/queries/blogQueries.test.ts

# Run integration tests
bft test apps/bfDb/graphql/__tests__/FragmentIntegration.test.ts
```

## Expected Benefits

These tests validate that the fragment system will:

1. **Enable Selective Imports**: Apps can import only the GraphQL types they
   need
2. **Maintain Backward Compatibility**: Existing schemas continue working
   unchanged
3. **Support Composition**: Fragments can be combined in flexible ways
4. **Provide Type Safety**: Full TypeScript support with generated types
5. **Handle Dependencies**: Graceful dependency resolution and error reporting
6. **Scale Performance**: Efficient composition even with many fragments

## Implementation Notes

The tests are designed to work with the planned fragment system architecture:

- Fragment definitions using fluent builder API
- Schema composition engine that merges fragments
- Dependency detection and validation
- Backward compatibility with existing Query root
- Error handling and type safety

Once implemented, these tests will ensure the fragment system works correctly
and maintains compatibility with the existing GraphQL infrastructure.
