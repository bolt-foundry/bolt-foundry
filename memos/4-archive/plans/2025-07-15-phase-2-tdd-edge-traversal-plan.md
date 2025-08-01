# Phase 2: TDD Implementation Plan for BfEdge Traversal Methods

**Date**: 2025-07-15\
**Status**: Draft\
**Priority**: High\
**Scope**: Core Infrastructure\
**Depends on**: Phase 1 BfNode Traversal Methods

## Overview

This plan provides a comprehensive Test-Driven Development (TDD) approach for
implementing Phase 2: Restore BfEdge Traversal Methods. It focuses on
uncommenting and fixing the four key methods in
`/Users/randallb/randallb.com/areas/bolt-foundry-monorepo/apps/bfDb/nodeTypes/BfEdge.ts`
that are currently commented out with type errors.

## Current State Analysis

### ✅ What Exists and Works

- `BfEdge.createBetweenNodes()` - Creates edges between nodes
- `BfEdge.generateEdgeMetadata()` - Generates proper edge metadata
- `BfEdge` extends `BfNode` with proper typing
- Basic edge CRUD operations via inherited `BfNode.query()`
- Test infrastructure established in BfNode tests

### ❌ Commented-Out Methods (Lines 82-192)

Four critical methods need to be restored and fixed:

1. **`querySourceInstances<TSourceClass>`** (Lines 82-119)
2. **`queryTargetInstances<TTargetClass>`** (Lines 137-173)
3. **`querySourceEdgesForNode`** (Lines 121-135)
4. **`queryTargetEdgesForNode`** (Lines 175-192)

### 🚧 Key Type Issues to Fix

Based on analysis of the commented code:

1. **Import Issues**: Missing imports for `BfGid`, `BfNodeCache`,
   `BfMetadataEdge`
2. **Type Inconsistencies**: References to `BfNodeBase` instead of `BfNode`
3. **Metadata Type Errors**: `BfMetadataEdge` should be `BfEdgeMetadata`
4. **Parameter Naming**: Inconsistent variable naming (e.g.,
   `_edgePropsToQuery`)
5. **Generic Constraints**: Missing proper constraints on type parameters

## Pre-Implementation Setup

### Test File Structure

```
apps/bfDb/nodeTypes/__tests__/BfEdge.traversal.test.ts
```

### Required Test Fixtures

```typescript
// Test classes for edge traversal testing
class TestUser extends BfNode<InferProps<typeof TestUser>> {
  static override bfNodeSpec = this.defineBfNode((f) =>
    f.string("name").string("email").number("role")
  );
  static override gqlSpec = this.defineGqlNode((f) =>
    f.string("name").string("email").int("role")
  );
}

class TestCompany extends BfNode<InferProps<typeof TestCompany>> {
  static override bfNodeSpec = this.defineBfNode((f) =>
    f.string("companyName").string("industry")
  );
  static override gqlSpec = this.defineGqlNode((f) =>
    f.string("companyName").string("industry")
  );
}

class TestProject extends BfNode<InferProps<typeof TestProject>> {
  static override bfNodeSpec = this.defineBfNode((f) =>
    f.string("title").string("status").number("priority")
  );
  static override gqlSpec = this.defineGqlNode((f) =>
    f.string("title").string("status").int("priority")
  );
}
```

### Test Graph Data Helper

```typescript
async function setupEdgeTestGraph(cv: CurrentViewer) {
  // Create nodes
  const company = await TestCompany.__DANGEROUS__createUnattached(cv, {
    companyName: "Tech Corp",
    industry: "Software",
  });

  const project = await TestProject.__DANGEROUS__createUnattached(cv, {
    title: "AI Platform",
    status: "active",
    priority: 1,
  });

  const user1 = await TestUser.__DANGEROUS__createUnattached(cv, {
    name: "Alice Johnson",
    email: "alice@techcorp.com",
    role: 1, // Engineer
  });

  const user2 = await TestUser.__DANGEROUS__createUnattached(cv, {
    name: "Bob Smith",
    email: "bob@techcorp.com",
    role: 2, // Manager
  });

  // Create edges with different roles
  const companyProjectEdge = await BfEdge.createBetweenNodes(
    cv,
    company,
    project,
    { role: "owns" },
  );

  const projectUser1Edge = await BfEdge.createBetweenNodes(
    cv,
    project,
    user1,
    { role: "assignedTo" },
  );

  const projectUser2Edge = await BfEdge.createBetweenNodes(
    cv,
    project,
    user2,
    { role: "manages" },
  );

  return {
    company,
    project,
    user1,
    user2,
    edges: {
      companyProject: companyProjectEdge,
      projectUser1: projectUser1Edge,
      projectUser2: projectUser2Edge,
    },
  };
}
```

## Method 1: `querySourceInstances` Restoration

### 1.1 Current Code Analysis (Lines 82-119)

**Identified Issues:**

- `BfGid` type not imported
- `BfNodeCache<TSourceProps>` incorrect - should be `BfNodeCache<TSourceProps>`
- `_edgePropsToQuery` parameter renamed but not used consistently
- `BfEdgeMetadata` used instead of `BfEdgeMetadata`
- Missing proper error handling

### 1.2 Corrected Method Signature

```typescript
static async querySourceInstances<
  TSourceClass extends typeof BfNode<TSourceProps>,
  TSourceProps extends PropsBase = PropsBase,
>(
  cv: CurrentViewer,
  SourceClass: TSourceClass,
  targetId: BfGid,
  propsToQuery: Partial<TSourceProps> = {},
  edgePropsToQuery: Partial<BfEdgeBaseProps> = {},
  cache?: BfNodeCache<TSourceProps>,
): Promise<Array<InstanceType<TSourceClass>>>
```

### 1.3 Test Cases (Write First)

#### Test 1: Basic Source Instance Query

```typescript
Deno.test("BfEdge.querySourceInstances - finds source nodes connected to target", async () => {
  await withIsolatedDb(async () => {
    const cv = makeLoggedInCv();
    const { company, project } = await setupEdgeTestGraph(cv);

    // Find all companies that connect to the project
    const sourceCompanies = await BfEdge.querySourceInstances(
      cv,
      TestCompany,
      project.metadata.bfGid,
    );

    assertEquals(sourceCompanies.length, 1);
    assertEquals(sourceCompanies[0].props.companyName, "Tech Corp");
    assertEquals(sourceCompanies[0].metadata.bfGid, company.metadata.bfGid);
  });
});
```

#### Test 2: Filter by Node Properties

```typescript
Deno.test("BfEdge.querySourceInstances - filters by source node properties", async () => {
  await withIsolatedDb(async () => {
    const cv = makeLoggedInCv();
    const project = await TestProject.__DANGEROUS__createUnattached(cv, {
      title: "Shared Project",
      status: "active",
      priority: 1,
    });

    // Create multiple companies connecting to same project
    const techCompany = await TestCompany.__DANGEROUS__createUnattached(cv, {
      companyName: "Tech Innovators",
      industry: "Software",
    });

    const consultingCompany = await TestCompany.__DANGEROUS__createUnattached(
      cv,
      {
        companyName: "Business Solutions",
        industry: "Consulting",
      },
    );

    await BfEdge.createBetweenNodes(cv, techCompany, project, { role: "owns" });
    await BfEdge.createBetweenNodes(cv, consultingCompany, project, {
      role: "sponsors",
    });

    // Filter by industry
    const techSources = await BfEdge.querySourceInstances(
      cv,
      TestCompany,
      project.metadata.bfGid,
      { industry: "Software" },
    );

    assertEquals(techSources.length, 1);
    assertEquals(techSources[0].props.companyName, "Tech Innovators");
  });
});
```

#### Test 3: Filter by Edge Properties

```typescript
Deno.test("BfEdge.querySourceInstances - filters by edge properties", async () => {
  await withIsolatedDb(async () => {
    const cv = makeLoggedInCv();
    const { project } = await setupEdgeTestGraph(cv);

    // Find only projects that "manage" users (edge role filter)
    const managingSources = await BfEdge.querySourceInstances(
      cv,
      TestProject,
      project.metadata.bfGid,
      {}, // No node props filter
      { role: "owns" }, // Edge props filter
    );

    assertEquals(managingSources.length, 1);
    assertEquals(managingSources[0].props.title, "AI Platform");
  });
});
```

#### Test 4: Empty Results

```typescript
Deno.test("BfEdge.querySourceInstances - returns empty array when no sources", async () => {
  await withIsolatedDb(async () => {
    const cv = makeLoggedInCv();
    const orphanProject = await TestProject.__DANGEROUS__createUnattached(cv, {
      title: "Orphan Project",
      status: "abandoned",
      priority: 0,
    });

    const sources = await BfEdge.querySourceInstances(
      cv,
      TestCompany,
      orphanProject.metadata.bfGid,
    );

    assertEquals(sources.length, 0);
  });
});
```

#### Test 5: Multiple Sources Same Class

```typescript
Deno.test("BfEdge.querySourceInstances - returns multiple sources of same class", async () => {
  await withIsolatedDb(async () => {
    const cv = makeLoggedInCv();
    const user = await TestUser.__DANGEROUS__createUnattached(cv, {
      name: "Popular Developer",
      email: "dev@test.com",
      role: 1,
    });

    // Create multiple projects connecting to same user
    const project1 = await TestProject.__DANGEROUS__createUnattached(cv, {
      title: "Project Alpha",
      status: "active",
      priority: 1,
    });

    const project2 = await TestProject.__DANGEROUS__createUnattached(cv, {
      title: "Project Beta",
      status: "planning",
      priority: 2,
    });

    await BfEdge.createBetweenNodes(cv, project1, user, { role: "assignedTo" });
    await BfEdge.createBetweenNodes(cv, project2, user, { role: "assignedTo" });

    const sourceProjects = await BfEdge.querySourceInstances(
      cv,
      TestProject,
      user.metadata.bfGid,
    );

    assertEquals(sourceProjects.length, 2);
    const titles = sourceProjects.map((p) => p.props.title).sort();
    assertEquals(titles, ["Project Alpha", "Project Beta"]);
  });
});
```

### 1.4 Implementation Steps

1. **Fix Imports**: Add missing type imports
2. **Fix Parameter Types**: Correct type inconsistencies
3. **Fix Metadata Queries**: Use correct `BfEdgeMetadata` type
4. **Add Error Handling**: Handle edge cases gracefully
5. **Optimize Query Pattern**: Ensure efficient two-step query approach

#### Fixed Implementation

```typescript
static async querySourceInstances<
  TSourceClass extends typeof BfNode<TSourceProps>,
  TSourceProps extends PropsBase = PropsBase,
>(
  cv: CurrentViewer,
  SourceClass: TSourceClass,
  targetId: BfGid,
  propsToQuery: Partial<TSourceProps> = {},
  edgePropsToQuery: Partial<BfEdgeBaseProps> = {},
  cache?: BfNodeCache<TSourceProps>,
): Promise<Array<InstanceType<TSourceClass>>> {
  // Query edges that have this target ID
  const edgeMetadata: Partial<BfEdgeMetadata> = {
    bfTid: targetId,
    className: this.name,
  };

  // Find all edges that connect to the target node with matching properties
  const edges = await this.query(cv, edgeMetadata, edgePropsToQuery, []);

  if (edges.length === 0) {
    return [];
  }

  // Extract source IDs from the edges
  const sourceIds = edges.map((edge) => (edge.metadata as BfEdgeMetadata).bfSid);

  // Query the source nodes by their IDs
  return SourceClass.query(
    cv,
    { className: SourceClass.name },
    propsToQuery,
    sourceIds,
    cache,
  );
}
```

## Method 2: `queryTargetInstances` Restoration

### 2.1 Current Code Analysis (Lines 137-173)

**Similar Issues to Method 1:**

- Same import and type issues
- `BfNodeBaseProps` should be `PropsBase`
- `BfMetadataEdge` should be `BfEdgeMetadata`
- Missing error handling

### 2.2 Test Cases (Write First)

#### Test 1: Basic Target Instance Query

```typescript
Deno.test("BfEdge.queryTargetInstances - finds target nodes connected from source", async () => {
  await withIsolatedDb(async () => {
    const cv = makeLoggedInCv();
    const { company, project, user1, user2 } = await setupEdgeTestGraph(cv);

    // Find all projects that the company connects to
    const targetProjects = await BfEdge.queryTargetInstances(
      cv,
      TestProject,
      company.metadata.bfGid,
    );

    assertEquals(targetProjects.length, 1);
    assertEquals(targetProjects[0].props.title, "AI Platform");
    assertEquals(targetProjects[0].metadata.bfGid, project.metadata.bfGid);
  });
});
```

#### Test 2: Multiple Targets Different Classes

```typescript
Deno.test("BfEdge.queryTargetInstances - finds targets of specific class only", async () => {
  await withIsolatedDb(async () => {
    const cv = makeLoggedInCv();
    const project = await TestProject.__DANGEROUS__createUnattached(cv, {
      title: "Multi-Target Project",
      status: "active",
      priority: 1,
    });

    // Connect project to users and other projects
    const user = await project.createTargetNode(TestUser, {
      name: "Team Member",
      email: "member@test.com",
      role: 1,
    }, { role: "assignedTo" });

    const subProject = await project.createTargetNode(TestProject, {
      title: "Sub Project",
      status: "planning",
      priority: 2,
    }, { role: "contains" });

    // Query only for User targets
    const targetUsers = await BfEdge.queryTargetInstances(
      cv,
      TestUser,
      project.metadata.bfGid,
    );

    assertEquals(targetUsers.length, 1);
    assertEquals(targetUsers[0].props.name, "Team Member");

    // Query only for Project targets
    const targetProjects = await BfEdge.queryTargetInstances(
      cv,
      TestProject,
      project.metadata.bfGid,
    );

    assertEquals(targetProjects.length, 1);
    assertEquals(targetProjects[0].props.title, "Sub Project");
  });
});
```

#### Test 3: Filter by Edge and Node Properties

```typescript
Deno.test("BfEdge.queryTargetInstances - filters by edge and node properties", async () => {
  await withIsolatedDb(async () => {
    const cv = makeLoggedInCv();
    const { project } = await setupEdgeTestGraph(cv);

    // Query users with specific role filter (node props) and edge role filter
    const managers = await BfEdge.queryTargetInstances(
      cv,
      TestUser,
      project.metadata.bfGid,
      { role: 2 }, // Node filter: role = Manager
      { role: "manages" }, // Edge filter
    );

    assertEquals(managers.length, 1);
    assertEquals(managers[0].props.name, "Bob Smith");
  });
});
```

### 2.3 Fixed Implementation

```typescript
static async queryTargetInstances<
  TTargetClass extends typeof BfNode<TTargetProps>,
  TTargetProps extends PropsBase = PropsBase,
>(
  cv: CurrentViewer,
  TargetClass: TTargetClass,
  sourceId: BfGid,
  propsToQuery: Partial<TTargetProps> = {},
  edgePropsToQuery: Partial<BfEdgeBaseProps> = {},
  cache?: BfNodeCache<TTargetProps>,
): Promise<Array<InstanceType<TTargetClass>>> {
  // Query edges that have this source ID
  const edgeMetadata: Partial<BfEdgeMetadata> = {
    bfSid: sourceId,
    className: this.name,
  };

  // Find all edges that connect from the source node with matching properties
  const edges = await this.query(cv, edgeMetadata, edgePropsToQuery, []);

  if (edges.length === 0) {
    return [];
  }

  // Extract target IDs from the edges
  const targetIds = edges.map((edge) => (edge.metadata as BfEdgeMetadata).bfTid);

  // Query the target nodes by their IDs
  return TargetClass.query(
    cv,
    { className: TargetClass.name },
    propsToQuery,
    targetIds,
    cache,
  );
}
```

## Method 3: `querySourceEdgesForNode` Restoration

### 3.1 Current Code Analysis (Lines 121-135)

**Issues:**

- `BfNodeBase` should be `BfNode`
- `BfMetadataEdge` should be `BfEdgeMetadata`
- Missing proper typing for return value
- No CurrentViewer parameter needed (can get from node)

### 3.2 Corrected Method Signature

```typescript
static async querySourceEdgesForNode<TProps extends BfEdgeBaseProps = BfEdgeBaseProps>(
  node: BfNode,
  cache?: BfNodeCache<TProps>,
): Promise<Array<InstanceType<typeof BfEdge<TProps>>>>
```

### 3.3 Test Cases (Write First)

#### Test 1: Find Incoming Edges

```typescript
Deno.test("BfEdge.querySourceEdgesForNode - finds edges where node is target", async () => {
  await withIsolatedDb(async () => {
    const cv = makeLoggedInCv();
    const { project, edges } = await setupEdgeTestGraph(cv);

    // Find edges where project is the target (company -> project)
    const incomingEdges = await BfEdge.querySourceEdgesForNode(project);

    assertEquals(incomingEdges.length, 1);
    assertEquals(incomingEdges[0].props.role, "owns");
    assertEquals(
      incomingEdges[0].metadata.bfGid,
      edges.companyProject.metadata.bfGid,
    );

    // Verify edge metadata
    const edgeMetadata = incomingEdges[0].metadata as BfEdgeMetadata;
    assertEquals(edgeMetadata.bfTid, project.metadata.bfGid);
  });
});
```

#### Test 2: Multiple Incoming Edges

```typescript
Deno.test("BfEdge.querySourceEdgesForNode - finds multiple incoming edges", async () => {
  await withIsolatedDb(async () => {
    const cv = makeLoggedInCv();
    const user = await TestUser.__DANGEROUS__createUnattached(cv, {
      name: "Popular User",
      email: "popular@test.com",
      role: 1,
    });

    // Create multiple projects connecting to the user
    const projectA = await TestProject.__DANGEROUS__createUnattached(cv, {
      title: "Project A",
      status: "active",
      priority: 1,
    });

    const projectB = await TestProject.__DANGEROUS__createUnattached(cv, {
      title: "Project B",
      status: "planning",
      priority: 2,
    });

    const edgeA = await BfEdge.createBetweenNodes(cv, projectA, user, {
      role: "assignedTo",
    });
    const edgeB = await BfEdge.createBetweenNodes(cv, projectB, user, {
      role: "reviewing",
    });

    const incomingEdges = await BfEdge.querySourceEdgesForNode(user);

    assertEquals(incomingEdges.length, 2);
    const roles = incomingEdges.map((e) => e.props.role).sort();
    assertEquals(roles, ["assignedTo", "reviewing"]);
  });
});
```

#### Test 3: No Incoming Edges

```typescript
Deno.test("BfEdge.querySourceEdgesForNode - returns empty array when no incoming edges", async () => {
  await withIsolatedDb(async () => {
    const cv = makeLoggedInCv();
    const isolatedNode = await TestUser.__DANGEROUS__createUnattached(cv, {
      name: "Isolated User",
      email: "isolated@test.com",
      role: 1,
    });

    const incomingEdges = await BfEdge.querySourceEdgesForNode(isolatedNode);

    assertEquals(incomingEdges.length, 0);
  });
});
```

### 3.4 Fixed Implementation

```typescript
static async querySourceEdgesForNode<TProps extends BfEdgeBaseProps = BfEdgeBaseProps>(
  node: BfNode,
  cache?: BfNodeCache<TProps>,
): Promise<Array<InstanceType<typeof BfEdge<TProps>>>> {
  // Query edges where the provided node is the target
  const metadataToQuery: Partial<BfEdgeMetadata> = {
    bfTid: node.metadata.bfGid,
    className: this.name,
  };

  return this.query(
    node.cv,
    metadataToQuery,
    {}, // No specific props filter
    [], // No specific IDs filter
    undefined, // No specific options
    cache,
  ) as Promise<Array<InstanceType<typeof BfEdge<TProps>>>>;
}
```

## Method 4: `queryTargetEdgesForNode` Restoration

### 4.1 Current Code Analysis (Lines 175-192)

**Similar Issues to Method 3:**

- Same type and parameter issues
- Missing proper return typing

### 4.2 Test Cases (Write First)

#### Test 1: Find Outgoing Edges

```typescript
Deno.test("BfEdge.queryTargetEdgesForNode - finds edges where node is source", async () => {
  await withIsolatedDb(async () => {
    const cv = makeLoggedInCv();
    const { company, edges } = await setupEdgeTestGraph(cv);

    // Find edges where company is the source (company -> project)
    const outgoingEdges = await BfEdge.queryTargetEdgesForNode(company);

    assertEquals(outgoingEdges.length, 1);
    assertEquals(outgoingEdges[0].props.role, "owns");
    assertEquals(
      outgoingEdges[0].metadata.bfGid,
      edges.companyProject.metadata.bfGid,
    );

    // Verify edge metadata
    const edgeMetadata = outgoingEdges[0].metadata as BfEdgeMetadata;
    assertEquals(edgeMetadata.bfSid, company.metadata.bfGid);
  });
});
```

#### Test 2: Multiple Outgoing Edges

```typescript
Deno.test("BfEdge.queryTargetEdgesForNode - finds multiple outgoing edges", async () => {
  await withIsolatedDb(async () => {
    const cv = makeLoggedInCv();
    const { project, edges } = await setupEdgeTestGraph(cv);

    // Project connects to 2 users
    const outgoingEdges = await BfEdge.queryTargetEdgesForNode(project);

    assertEquals(outgoingEdges.length, 2);
    const roles = outgoingEdges.map((e) => e.props.role).sort();
    assertEquals(roles, ["assignedTo", "manages"]);

    // Verify all edges have project as source
    outgoingEdges.forEach((edge) => {
      const edgeMetadata = edge.metadata as BfEdgeMetadata;
      assertEquals(edgeMetadata.bfSid, project.metadata.bfGid);
    });
  });
});
```

### 4.3 Fixed Implementation

```typescript
static async queryTargetEdgesForNode<TProps extends BfEdgeBaseProps = BfEdgeBaseProps>(
  node: BfNode,
  cache?: BfNodeCache<TProps>,
): Promise<Array<InstanceType<typeof BfEdge<TProps>>>> {
  // Query edges where the provided node is the source
  const metadataToQuery: Partial<BfEdgeMetadata> = {
    bfSid: node.metadata.bfGid,
    className: this.name,
  };

  return this.query(
    node.cv,
    metadataToQuery,
    {}, // No specific props filter
    [], // No specific IDs filter
    undefined, // No specific options  
    cache,
  ) as Promise<Array<InstanceType<typeof BfEdge<TProps>>>>;
}
```

## Type Safety Fixes Required

### Import Additions Needed

Add these imports to the top of `BfEdge.ts`:

```typescript
import type { BfGid } from "@bfmono/lib/types.ts";
import type { BfNodeCache } from "@bfmono/apps/bfDb/classes/BfNode.ts";
```

### Type Corrections Summary

1. **Replace**: `BfNodeBase` → `BfNode`
2. **Replace**: `BfMetadataEdge` → `BfEdgeMetadata`
3. **Replace**: `BfNodeBaseProps` → `PropsBase`
4. **Add**: Missing generic constraints
5. **Fix**: Parameter naming consistency

## Integration with Phase 1

### How BfEdge Methods Support BfNode Methods

The Phase 1 `BfNode` instance methods will delegate to these Phase 2 `BfEdge`
static methods:

```typescript
// In BfNode class (Phase 1)
async querySourceInstances<TSourceClass>(
  SourceClass: TSourceClass,
  nodeProps?: Partial<TSourceProps>, 
  edgeProps?: Partial<BfEdgeBaseProps>
): Promise<Array<InstanceType<TSourceClass>>> {
  const { BfEdge } = await import("@bfmono/apps/bfDb/nodeTypes/BfEdge.ts");
  return BfEdge.querySourceInstances(
    this.cv,
    SourceClass,
    this.metadata.bfGid,
    nodeProps,
    edgeProps
  );
}
```

### Integration Tests

```typescript
Deno.test("BfNode instance methods delegate to BfEdge static methods", async () => {
  await withIsolatedDb(async () => {
    const cv = makeLoggedInCv();
    const { company, project } = await setupEdgeTestGraph(cv);

    // Test Phase 1 method calls Phase 2 method
    const sources = await project.querySourceInstances(TestCompany);
    assertEquals(sources.length, 1);
    assertEquals(sources[0].metadata.bfGid, company.metadata.bfGid);

    // Should produce same result as direct BfEdge call
    const directSources = await BfEdge.querySourceInstances(
      cv,
      TestCompany,
      project.metadata.bfGid,
    );
    assertEquals(sources[0].metadata.bfGid, directSources[0].metadata.bfGid);
  });
});
```

## Performance Tests

### Query Performance Validation

```typescript
Deno.test("BfEdge traversal methods - performance with large datasets", async () => {
  await withIsolatedDb(async () => {
    const cv = makeLoggedInCv();

    // Create large test graph
    const hub = await TestProject.__DANGEROUS__createUnattached(cv, {
      title: "Hub Project",
      status: "active",
      priority: 1,
    });

    // Connect 50 users to hub project
    const users = [];
    for (let i = 0; i < 50; i++) {
      const user = await TestUser.__DANGEROUS__createUnattached(cv, {
        name: `User ${i}`,
        email: `user${i}@test.com`,
        role: i % 3, // Vary roles
      });
      await BfEdge.createBetweenNodes(cv, hub, user, { role: "assignedTo" });
      users.push(user);
    }

    // Test query performance
    const startTime = performance.now();
    const targetUsers = await BfEdge.queryTargetInstances(
      cv,
      TestUser,
      hub.metadata.bfGid,
    );
    const endTime = performance.now();

    assertEquals(targetUsers.length, 50);
    assert(
      (endTime - startTime) < 2000,
      `Query took ${endTime - startTime}ms, should be < 2000ms`,
    );
  });
});
```

### Batch Operations Test

```typescript
Deno.test("BfEdge methods - efficient batch operations", async () => {
  await withIsolatedDb(async () => {
    const cv = makeLoggedInCv();
    const { project } = await setupEdgeTestGraph(cv);

    // Test that edge queries batch efficiently
    const startTime = performance.now();

    const [incomingEdges, outgoingEdges] = await Promise.all([
      BfEdge.querySourceEdgesForNode(project),
      BfEdge.queryTargetEdgesForNode(project),
    ]);

    const endTime = performance.now();

    assertEquals(incomingEdges.length, 1); // Company -> Project
    assertEquals(outgoingEdges.length, 2); // Project -> Users

    assert(
      (endTime - startTime) < 500,
      "Parallel edge queries should complete quickly",
    );
  });
});
```

## Error Handling and Edge Cases

### Error Test Cases

```typescript
Deno.test("BfEdge.querySourceInstances - handles invalid target ID", async () => {
  await withIsolatedDb(async () => {
    const cv = makeLoggedInCv();
    const invalidId = "invalid-bf-gid" as BfGid;

    const sources = await BfEdge.querySourceInstances(
      cv,
      TestCompany,
      invalidId,
    );

    assertEquals(sources.length, 0); // Should return empty, not error
  });
});

Deno.test("BfEdge.queryTargetInstances - handles missing source node", async () => {
  await withIsolatedDb(async () => {
    const cv = makeLoggedInCv();
    const nonExistentId = "00000000-0000-0000-0000-000000000000" as BfGid;

    const targets = await BfEdge.queryTargetInstances(
      cv,
      TestUser,
      nonExistentId,
    );

    assertEquals(targets.length, 0);
  });
});

Deno.test("BfEdge.querySourceEdgesForNode - handles node without edges", async () => {
  await withIsolatedDb(async () => {
    const cv = makeLoggedInCv();
    const isolatedNode = await TestUser.__DANGEROUS__createUnattached(cv, {
      name: "Isolated",
      email: "isolated@test.com",
      role: 1,
    });

    const edges = await BfEdge.querySourceEdgesForNode(isolatedNode);
    assertEquals(edges.length, 0);
  });
});
```

### Type Safety Tests

```typescript
Deno.test("BfEdge methods - maintain type safety", async () => {
  await withIsolatedDb(async () => {
    const cv = makeLoggedInCv();
    const { company, project } = await setupEdgeTestGraph(cv);

    // TypeScript should enforce correct return types
    const sources: Array<TestCompany> = await BfEdge.querySourceInstances(
      cv,
      TestCompany,
      project.metadata.bfGid,
    );

    assertEquals(sources.length, 1);
    // Verify TypeScript properly typed the result
    assertEquals(typeof sources[0].props.companyName, "string");
    assertEquals(typeof sources[0].props.industry, "string");
  });
});
```

## Implementation Order and Steps

### Step-by-Step Implementation

1. **Step 1**: Add missing imports to `BfEdge.ts`
2. **Step 2**: Uncomment `querySourceInstances` method
3. **Step 3**: Fix type errors in `querySourceInstances`
4. **Step 4**: Write and run tests for `querySourceInstances`
5. **Step 5**: Uncomment and fix `queryTargetInstances`
6. **Step 6**: Write and run tests for `queryTargetInstances`
7. **Step 7**: Uncomment and fix `querySourceEdgesForNode`
8. **Step 8**: Write and run tests for `querySourceEdgesForNode`
9. **Step 9**: Uncomment and fix `queryTargetEdgesForNode`
10. **Step 10**: Write and run tests for `queryTargetEdgesForNode`
11. **Step 11**: Run integration tests with Phase 1 methods
12. **Step 12**: Run performance and error handling tests

### TDD Validation Commands

```bash
# Run specific BfEdge traversal tests
bft test apps/bfDb/nodeTypes/__tests__/BfEdge.traversal.test.ts

# Run all BfDb tests to ensure no regressions
bft test apps/bfDb/

# Run performance tests
bft test apps/bfDb/ --filter="performance"

# Run integration tests
bft test apps/bfDb/ --filter="integration"
```

## Success Criteria

### Phase 2 Completion Checklist

- [ ] All four BfEdge methods are uncommented and functional
- [ ] All type errors are resolved
- [ ] All new tests pass with `bft test`
- [ ] No regressions in existing BfNode tests
- [ ] Performance tests meet requirements (< 2s for 50 node queries)
- [ ] Integration tests pass with Phase 1 methods
- [ ] Error handling covers all edge cases
- [ ] TypeScript compilation succeeds with no errors
- [ ] Code follows existing patterns and conventions

### Quality Assurance

- [ ] Proper JSDoc documentation added to all public methods
- [ ] Consistent error handling with existing codebase patterns
- [ ] Uses `Array<T>` syntax per project guidelines
- [ ] Cache parameter usage follows established patterns
- [ ] Methods support future pagination features (design-wise)

## Future Phase 3 Considerations

### GraphQL Connection Preparation

The restored methods should support future GraphQL connections:

```typescript
// Future Phase 3 method signatures
static async querySourceConnectionForGraphQL<TSourceClass>(
  cv: CurrentViewer,
  SourceClass: TSourceClass,
  targetId: BfGid,
  connectionArgs: ConnectionArguments,
  nodeProps?: Partial<TSourceProps>,
  edgeProps?: Partial<BfEdgeBaseProps>
): Promise<Connection<InstanceType<TSourceClass>>>
```

### Performance Optimization Opportunities

- Connection pooling for high-frequency traversals
- Query result caching for complex graph patterns
- Batch optimization for multiple concurrent edge queries
- Pagination support for large relationship sets

This comprehensive plan provides a systematic approach to restoring the BfEdge
traversal methods while maintaining strict TDD practices, ensuring type safety,
and preparing for future phases of the node traversal implementation.
