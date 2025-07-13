# Selective GraphQL Model Import System Implementation

**Date**: 2025-07-11\
**Status**: Planning\
**Apps Affected**: bfDb, boltfoundry-com, future apps (internalbf, etc.)

## Overview

We need to implement a selective model import system for app-specific GraphQL
servers. Currently, the bfDb GraphQL schema includes all models automatically
via barrel file discovery. We want apps like boltfoundry-com to explicitly
import only the models they need (BlogPost, PublishedDocument) while internalbf
might import different models (User, Organization, etc.).

## Current Architecture Analysis

### Existing Auto-Discovery System

**Current Pattern (apps/bfDb):**

- `/nodeTypes/*.ts` → auto-included via barrel files
- `loadGqlTypes()` processes all discovered types
- Monolithic Query/Mutation roots include all operations
- No filtering or selective inclusion mechanism

**Key Files:**

- `apps/bfDb/bin/genBarrel.ts` - Generates barrel exports
- `apps/bfDb/graphql/loadGqlTypes.ts` - Type loading orchestration
- `apps/bfDb/models/__generated__/nodeTypesList.ts` - All node types
- `apps/bfDb/graphql/roots/Query.ts` - Monolithic query root

### Problems with Current System

1. **No Granularity**: Apps get all models or none
2. **Tight Coupling**: All apps depend on full bfDb schema
3. **Bundle Size**: Apps include GraphQL types they don't use
4. **Schema Bloat**: Unnecessary complexity for simple apps
5. **Dependency Hell**: Model relationships force inclusion of unrelated types

## Proposed Solution: Import-Based Selective Schema

### Design Principles

1. **Explicit Imports**: Apps explicitly import only required models
2. **Backward Compatibility**: Existing apps continue working unchanged
3. **Composable Queries**: Break up monolithic Query/Mutation roots
4. **Type Safety**: Full TypeScript support with generated types
5. **Dependency Resolution**: Handle model relationships gracefully

### Core API Design

```typescript
// boltfoundry-com/graphql/schema.ts
import { BlogPost } from "@bfmono/apps/bfDb/nodeTypes/BlogPost.ts";
import { PublishedDocument } from "@bfmono/apps/bfDb/nodeTypes/PublishedDocument.ts";
import {
  blogPostQueries,
  documentQueries,
} from "@bfmono/apps/bfDb/graphql/queries/index.ts";

export const schema = await createAppSchema({
  nodeTypes: [BlogPost, PublishedDocument],
  queryFragments: [blogPostQueries, documentQueries],
  mutationFragments: [], // none needed for docs
  customScalars: ["IsoDate"], // auto-detected from nodeTypes
});
```

### Migration Strategy

#### Phase 1: Refactor bfDb (Backward Compatible)

1. **Split Query Root**: Break `/graphql/roots/Query.ts` into fragments
2. **Create Schema Builder**: New `createAppSchema()` function
3. **Maintain Compatibility**: Keep existing `loadGqlTypes()` as wrapper

#### Phase 2: App-Specific Schemas

1. **Implement boltfoundry-com**: First app using selective imports
2. **Test & Validate**: Ensure isograph integration works
3. **Document Patterns**: Create reusable implementation guide

#### Phase 3: Migrate Existing Apps

1. **Migrate boltFoundry**: Convert to selective imports
2. **Migrate aibff/gui**: Already has standalone schema
3. **Cleanup**: Remove deprecated auto-discovery code

## Implementation Details

### 1. Query Fragment System

**Current Monolithic Structure:**

```typescript
// apps/bfDb/graphql/roots/Query.ts (simplified)
export class Query extends GraphQLObjectBase {
  static override gqlSpec = this.defineGqlObject((gql) =>
    gql
      .object("blogPost", () => BlogPost, {/* resolver */})
      .connection("blogPosts", () => BlogPost, {/* resolver */})
      .object("documentsBySlug", () => PublishedDocument, {/* resolver */})
      .object("githubRepoStats", () => GithubRepoStats, {/* resolver */})
      .boolean("ok")
  );
}
```

**New Fragment Structure:**

```typescript
// apps/bfDb/graphql/queries/blogQueries.ts
export const blogPostQueries = defineQueryFragment((gql) =>
  gql
    .object("blogPost", () => BlogPost, {
      args: (a) => a.string("slug"),
      resolve: async (_root, args) => {
        const slug = args.slug || "README";
        return await BlogPost.findX(slug).catch(() => null);
      },
    })
    .connection("blogPosts", () => BlogPost, {
      args: (a) => a.string("sortDirection").string("filterByYear"),
      resolve: async (_root, args) => {
        const sortDir = args.sortDirection || "DESC";
        const posts = await BlogPost.listAll(sortDir);
        const filtered = args.filterByYear
          ? posts.filter((p) => p.id.startsWith(args.filterByYear))
          : posts;
        return BlogPost.connection(filtered, args);
      },
    })
);

// apps/bfDb/graphql/queries/documentQueries.ts
export const documentQueries = defineQueryFragment((gql) =>
  gql
    .object("documentsBySlug", () => PublishedDocument, {
      args: (a) => a.string("slug"),
      resolve: async (_root, args) => {
        const slug = args.slug || "getting-started";
        return await PublishedDocument.findX(slug).catch(() => null);
      },
    })
);

// apps/bfDb/graphql/queries/index.ts
export { blogPostQueries } from "./blogQueries.ts";
export { documentQueries } from "./documentQueries.ts";
export { githubQueries } from "./githubQueries.ts";
```

### 2. Schema Composition Engine

```typescript
// apps/bfDb/graphql/createAppSchema.ts
export interface AppSchemaConfig {
  nodeTypes: Array<GraphQLNodeConstructor>;
  queryFragments?: Array<QueryFragment>;
  mutationFragments?: Array<MutationFragment>;
  customScalars?: Array<string>;
  interfaces?: Array<GraphQLInterfaceConstructor>;
}

export async function createAppSchema(config: AppSchemaConfig) {
  // 1. Process node types
  const nodeNexusTypes = [];
  for (const nodeType of config.nodeTypes) {
    const nexusTypes = await gqlSpecToNexus(nodeType.gqlSpec, nodeType.name, {
      classType: nodeType,
    });
    nodeNexusTypes.push(...nexusTypes);
  }

  // 2. Compose query root
  const queryRoot = mergeQueryFragments(config.queryFragments || []);

  // 3. Compose mutation root
  const mutationRoot = mergeMutationFragments(config.mutationFragments || []);

  // 4. Auto-detect dependencies
  const detectedScalars = autoDetectScalars(config.nodeTypes);
  const detectedInterfaces = autoDetectInterfaces(config.nodeTypes);

  // 5. Build final schema
  return await makeSchema({
    types: [
      ...detectedScalars,
      ...detectedInterfaces,
      ...nodeNexusTypes,
      queryRoot,
      ...(mutationRoot ? [mutationRoot] : []),
    ],
    features: {
      abstractTypeStrategies: {
        __typename: true,
        resolveType: true,
      },
    },
    plugins: [
      connectionPlugin({
        cursorFromNode: (node) => node.id,
        includeNodesField: true,
        extendConnection: { count: { type: "Int" } },
      }),
    ],
  });
}
```

### 3. Dependency Resolution

**Auto-Detection Strategy:**

- Scan `gqlSpec` definitions for referenced types
- Include required interfaces (Node, BfNode) automatically
- Detect custom scalars (IsoDate) from field definitions
- Warn about missing dependencies in development

**Example Dependencies:**

```typescript
// BlogPost depends on:
// - Node interface (inherited from GraphQLNode)
// - IsoDate scalar (used in publishedAt/updatedAt fields)
// - No other node types (self-contained)

// Future: If BlogPost had .object("author", () => User)
// - Would auto-detect User dependency
// - Could auto-include or warn about missing import
```

### 4. Build System Integration

**Extend Existing BFT Tasks:**

```typescript
// infra/bft/tasks/gqlSchema.bft.ts (new)
export async function generateAppSchema(appName: string) {
  const schemaFile = `apps/${appName}/graphql/schema.ts`;
  if (await exists(schemaFile)) {
    // Import and generate schema for this app
    const { schema } = await import(`/${schemaFile}`);
    const schemaString = printSchema(schema);
    await Deno.writeTextFile(
      `apps/${appName}/graphql/__generated__/schema.graphql`,
      schemaString,
    );
  }
}

// Extend iso.bft.ts to generate per-app schemas
for (const app of appsWithGraphQL) {
  await generateAppSchema(app);
  await runIsographCompiler(app);
}
```

### 5. Isograph Integration

**No Changes Required:**

- Each app's `isograph.config.json` points to its own generated schema
- Existing build pipeline continues working
- Type generation works as before

**Updated Config:**

```json
{
  "project_root": ".",
  "artifact_directory": "./__generated__",
  "schema": "./graphql/__generated__/schema.graphql",
  "options": {
    "on_invalid_id_type": "ignore",
    "include_file_extensions_in_import_statements": true,
    "no_babel_transform": true
  }
}
```

## Benefits Analysis

### For Apps (boltfoundry-com)

1. **Smaller Bundles**: Only include needed GraphQL types
2. **Clear Dependencies**: Explicit imports show what app uses
3. **Faster Builds**: Less code generation and type checking
4. **Isolated Changes**: bfDb model changes don't affect unrelated apps
5. **Custom Schema**: Apps can add app-specific mutations/queries

### For Development

1. **Better DX**: Clear compile-time errors for missing dependencies
2. **Modular Testing**: Test query fragments in isolation
3. **Easier Debugging**: Smaller, focused schemas are easier to understand
4. **Type Safety**: Full TypeScript inference for app-specific schemas

### For Architecture

1. **Loose Coupling**: Apps not tightly bound to full bfDb schema
2. **Scalability**: Easy to add new apps without schema bloat
3. **Migration Path**: Can gradually migrate to microservices
4. **Composition**: Query fragments are reusable across apps

## Risk Analysis

### Implementation Risks

1. **Breaking Changes**: Refactoring Query root could break existing resolvers
2. **Circular Dependencies**: Model relationships might create import cycles
3. **Build Complexity**: Managing per-app schema generation
4. **Test Coverage**: Need comprehensive tests for schema composition

### Mitigation Strategies

1. **Gradual Rollout**: Keep existing system working during migration
2. **Dependency Analysis**: Build tooling to detect and resolve cycles
3. **Integration Tests**: Test app schemas against real queries
4. **Fallback System**: Apps can fall back to full schema if needed

## Success Criteria

### Functional Requirements

- [ ] boltfoundry-com can import BlogPost + PublishedDocument
- [ ] Generated schema only includes imported types
- [ ] Existing apps (boltFoundry, aibff/gui) continue working
- [ ] Build system generates per-app schemas
- [ ] Isograph integration works with app-specific schemas

### Non-Functional Requirements

- [ ] Build time doesn't increase significantly
- [ ] Type generation performance remains acceptable
- [ ] Schema composition errors are clear and actionable
- [ ] Documentation exists for implementing new app schemas

## Implementation Timeline

### Phase 1: Core Infrastructure

- [ ] Implement `defineQueryFragment()` and fragment system
- [ ] Create `createAppSchema()` function
- [ ] Build dependency auto-detection
- [ ] Write comprehensive tests

### Phase 2: boltfoundry-com Integration

- [ ] Split relevant Query fragments from bfDb
- [ ] Implement boltfoundry-com GraphQL schema
- [ ] Update build system for per-app schema generation
- [ ] Test isograph integration

### Phase 3: Documentation & Validation

- [ ] Write implementation guide for future apps
- [ ] Add integration tests for schema composition
- [ ] Performance testing and optimization
- [ ] Create migration guide for existing apps

## Next Steps

1. **Get Design Approval**: Review this memo with team
2. **Create POC**: Build minimal working example
3. **Implementation**: Follow timeline above
4. **Testing**: Comprehensive validation before rollout
5. **Documentation**: Guide for future app implementations

## Open Questions

1. **Query Fragment Naming**: How should we organize and name fragments?
2. **Dependency Cycles**: What's our strategy if models have circular
   relationships?
3. **Custom Mutations**: Should apps be able to add their own mutations?
4. **Schema Validation**: Do we need runtime validation of composed schemas?
5. **Migration Timeline**: How quickly should we migrate existing apps?

## Appendix: Reference Files and Context

### Key Architecture Files Referenced

#### bfDb GraphQL Infrastructure

- `apps/bfDb/graphql/graphqlServer.ts` - Main GraphQL Yoga server setup
- `apps/bfDb/graphql/schemaConfig.ts` - Schema configuration and Nexus plugins
- `apps/bfDb/graphql/loadGqlTypes.ts` - Core type loading orchestration
- `apps/bfDb/graphql/GraphQLObjectBase.ts` - Base class with builder patterns
- `apps/bfDb/classes/GraphQLNode.ts` - Abstract Node interface implementation
- `apps/bfDb/bin/genBarrel.ts` - Barrel file generation system

#### Current Model Examples

- `apps/bfDb/nodeTypes/BlogPost.ts` - Blog post model with file-based content
- `apps/bfDb/nodeTypes/PublishedDocument.ts` - Documentation model
- `apps/bfDb/graphql/roots/Query.ts` - Monolithic query root (to be split)
- `apps/bfDb/graphql/roots/Waitlist.ts` - Mutation example

#### Generated Files (Auto-Discovery System)

- `apps/bfDb/models/__generated__/nodeTypesList.ts` - All node types barrel
- `apps/bfDb/graphql/roots/__generated__/rootObjectsList.ts` - Root objects
  barrel
- `apps/bfDb/graphql/__generated__/schema.graphql` - Generated schema
- `apps/bfDb/graphql/__generated__/interfacesList.ts` - GraphQL interfaces

#### Builder System

- `apps/bfDb/builders/graphql/makeGqlBuilder.ts` - Fluent GraphQL builder API
- `apps/bfDb/builders/graphql/gqlSpecToNexus.ts` - Converts specs to Nexus types
- `apps/bfDb/builders/graphql/makeGqlSpec.ts` - Specification collector
- `apps/bfDb/builders/graphql/makeArgBuilder.ts` - Argument builder for fields

#### Existing App Integrations

- `apps/boltFoundry/isographEnvironment.ts` - Client-side Isograph setup
- `apps/boltFoundry/server/isographEnvironment.ts` - Server-side Isograph setup
- `apps/aibff/gui/graphql/schema.ts` - Standalone app GraphQL example
- `apps/boltfoundry-com/isograph.config.json` - Isograph configuration
- `apps/boltfoundry-com/isographEnvironment.ts` - Currently mocked

#### Build System Integration

- `infra/bft/tasks/iso.bft.ts` - Isograph compilation for multiple apps
- `infra/appBuild/routesBuild.ts` - Route generation after compilation
- `apps/web/routes/routeRegistry.ts` - Route registration patterns

### Context from Research

This design was informed by comprehensive analysis of:

1. **Current GraphQL Architecture**: Understanding how Nexus, GraphQL Yoga, and
   the builder pattern work together
2. **Model Dependencies**: Analysis of BlogPost and PublishedDocument
   requirements and relationships
3. **Isograph Integration**: How code generation and routing work with the
   existing system
4. **Build Pipeline**: How BFT orchestrates compilation and type generation
   across apps
5. **App Patterns**: Comparison of standalone (aibff/gui) vs integrated
   (boltFoundry) approaches

### Related Implementation Memos

- `memos/plans/2025-07-01-boltfoundry-com-app.md` - Initial boltfoundry-com app
  setup
- `memos/plans/2025-06-blog-implementation-plan.md` - Blog system architecture
- `memos/plans/2025-06-relay-connections-implementation.md` - Pagination
  patterns

---

This implementation will significantly improve the modularity and
maintainability of our GraphQL architecture while enabling apps to have
precisely the schema they need.
