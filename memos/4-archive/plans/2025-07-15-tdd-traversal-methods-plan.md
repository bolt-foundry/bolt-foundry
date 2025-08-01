# TDD Implementation Plan: Phase 1 Core Instance Traversal Methods

## Overview

This plan provides a comprehensive Test-Driven Development (TDD) approach for
implementing the four core instance traversal methods in `BfNode.ts`:

1. `queryAncestorsByClassName<TSourceClass>(BfNodeClass, limit?: number)`
2. `queryDescendantsByClassName<TTargetClass>(BfNodeClass, limit?: number)`
3. `querySourceInstances<TSourceClass>(SourceClass, nodeProps?, edgeProps?)`
4. `queryTargetInstances<TTargetClass>(TargetClass, nodeProps?, edgeProps?)`

Based on analysis of existing patterns in
`/Users/randallb/randallb.com/areas/bolt-foundry-monorepo/apps/bfDb/`, this plan
follows established conventions and leverages existing backend infrastructure.

## Pre-Implementation Setup

### Test File Structure

```
apps/bfDb/classes/__tests__/BfNode.traversal.test.ts
```

### Required Test Fixtures

Create test node classes that mirror the existing pattern:

```typescript
// Test node classes for graph traversal testing
class TestPerson extends BfNode<InferProps<typeof TestPerson>> {
  static override bfNodeSpec = this.defineBfNode((f) =>
    f.string("name").string("email").number("age")
  );
  static override gqlSpec = this.defineGqlNode((f) =>
    f.string("name").string("email").int("age")
  );
}

class TestOrganization extends BfNode<InferProps<typeof TestOrganization>> {
  static override bfNodeSpec = this.defineBfNode((f) =>
    f.string("orgName").string("domain")
  );
  static override gqlSpec = this.defineGqlNode((f) =>
    f.string("orgName").string("domain")
  );
}

class TestProject extends BfNode<InferProps<typeof TestProject>> {
  static override bfNodeSpec = this.defineBfNode((f) =>
    f.string("title").string("status")
  );
  static override gqlSpec = this.defineGqlNode((f) =>
    f.string("title").string("status")
  );
}
```

### Test Data Setup Helper

```typescript
async function setupTestGraphData(cv: CurrentViewer) {
  // Create hierarchy: Org -> Project -> Person
  const org = await TestOrganization.__DANGEROUS__createUnattached(cv, {
    orgName: "Test Corp",
    domain: "testcorp.com",
  });

  const project = await org.createTargetNode(TestProject, {
    title: "Test Project",
    status: "active",
  }, { role: "owns" });

  const person = await project.createTargetNode(TestPerson, {
    name: "John Doe",
    email: "john@testcorp.com",
    age: 30,
  }, { role: "assignedTo" });

  return { org, project, person };
}
```

## Method 1: `queryAncestorsByClassName`

### 1.1 Method Signature Definition

```typescript
static async queryAncestorsByClassName<
  TSourceClass extends typeof BfNode<TSourceProps>,
  TSourceProps extends PropsBase = PropsBase,
>(
  this: typeof BfNode,
  cv: CurrentViewer,
  SourceClass: TSourceClass,
  limit?: number,
  cache?: BfNodeCache<TSourceProps>,
): Promise<Array<InstanceType<TSourceClass>>> {
  // Implementation follows
}
```

### 1.2 Test Cases (Write First)

#### Test 1: Basic Ancestor Query

```typescript
Deno.test("queryAncestorsByClassName - finds direct ancestors", async () => {
  await withIsolatedDb(async () => {
    const cv = makeLoggedInCv();
    const { org, project, person } = await setupTestGraphData(cv);

    // Query ancestors of person, looking for organizations
    const ancestors = await person.queryAncestorsByClassName(
      cv,
      TestOrganization,
    );

    assertEquals(ancestors.length, 1);
    assertEquals(ancestors[0].props.orgName, "Test Corp");
    assertEquals(ancestors[0].metadata.bfGid, org.metadata.bfGid);
  });
});
```

#### Test 2: Multiple Level Traversal

```typescript
Deno.test("queryAncestorsByClassName - traverses multiple levels", async () => {
  await withIsolatedDb(async () => {
    const cv = makeLoggedInCv();

    // Create deeper hierarchy: Org -> Div -> Project -> Person
    const org = await TestOrganization.__DANGEROUS__createUnattached(cv, {
      orgName: "Parent Corp",
      domain: "parent.com",
    });
    const div = await org.createTargetNode(TestOrganization, {
      orgName: "Engineering Div",
      domain: "eng.parent.com",
    }, { role: "contains" });
    const project = await div.createTargetNode(TestProject, {
      title: "Deep Project",
      status: "active",
    }, { role: "owns" });
    const person = await project.createTargetNode(TestPerson, {
      name: "Deep Dev",
      email: "dev@parent.com",
      age: 25,
    }, { role: "assignedTo" });

    const ancestors = await person.queryAncestorsByClassName(
      cv,
      TestOrganization,
    );

    assertEquals(ancestors.length, 2);
    const orgNames = ancestors.map((a) => a.props.orgName).sort();
    assertEquals(orgNames, ["Engineering Div", "Parent Corp"]);
  });
});
```

#### Test 3: Limit Parameter

```typescript
Deno.test("queryAncestorsByClassName - respects limit parameter", async () => {
  await withIsolatedDb(async () => {
    const cv = makeLoggedInCv();
    // Setup multi-level hierarchy
    const { person } = await setupDeepHierarchy(cv);

    const limitedAncestors = await person.queryAncestorsByClassName(
      cv,
      TestOrganization,
      1,
    );

    assertEquals(limitedAncestors.length, 1);
  });
});
```

#### Test 4: No Ancestors Found

```typescript
Deno.test("queryAncestorsByClassName - returns empty array when no ancestors", async () => {
  await withIsolatedDb(async () => {
    const cv = makeLoggedInCv();
    const person = await TestPerson.__DANGEROUS__createUnattached(cv, {
      name: "Isolated Person",
      email: "isolated@test.com",
      age: 30,
    });

    const ancestors = await person.queryAncestorsByClassName(
      cv,
      TestOrganization,
    );

    assertEquals(ancestors.length, 0);
  });
});
```

#### Test 5: Cycle Detection

```typescript
Deno.test("queryAncestorsByClassName - handles cycles gracefully", async () => {
  await withIsolatedDb(async () => {
    const cv = makeLoggedInCv();
    const { org, project } = await setupTestGraphData(cv);

    // Create cycle: Project -> Org (backwards edge)
    await project.createTargetNode(TestOrganization, {
      orgName: org.props.orgName,
      domain: org.props.domain,
    }, { role: "cyclicRef", metadata: { bfGid: org.metadata.bfGid } });

    // Should not infinite loop or crash
    const ancestors = await project.queryAncestorsByClassName(
      cv,
      TestOrganization,
    );

    // Should return org only once despite cycle
    assertEquals(ancestors.length, 1);
  });
});
```

### 1.3 Implementation Steps

1. **Leverage Existing Backend Method**: Use
   `DatabaseBackend.queryAncestorsByClassName`
2. **Add Method to BfNode Class**: Place after existing static methods
3. **Type Safety**: Ensure proper TypeScript generics and return types
4. **Error Handling**: Use existing error patterns from codebase
5. **Caching**: Support optional cache parameter following existing patterns

```typescript
static async queryAncestorsByClassName<
  TSourceClass extends typeof BfNode<TSourceProps>,
  TSourceProps extends PropsBase = PropsBase,
>(
  this: typeof BfNode,
  cv: CurrentViewer,
  SourceClass: TSourceClass,
  limit?: number,
  cache?: BfNodeCache<TSourceProps>,
): Promise<Array<InstanceType<TSourceClass>>> {
  const results = await storage.queryAncestorsByClassName<TSourceProps>(
    cv.orgBfOid,
    this.prototype.metadata.bfGid,
    SourceClass.name,
    limit
  );

  return results.map((item) => {
    const Ctor = SourceClass as unknown as ConcreteBfNodeBaseCtor<TSourceProps>;
    const instance = new Ctor(cv, item.props, item.metadata);
    cache?.set(item.metadata.bfGid, instance);
    return instance as InstanceType<TSourceClass>;
  });
}
```

## Method 2: `queryDescendantsByClassName`

### 2.1 Method Signature

```typescript
static async queryDescendantsByClassName<
  TTargetClass extends typeof BfNode<TTargetProps>,
  TTargetProps extends PropsBase = PropsBase,
>(
  this: typeof BfNode,
  cv: CurrentViewer,
  TargetClass: TTargetClass,
  limit?: number,
  cache?: BfNodeCache<TTargetProps>,
): Promise<Array<InstanceType<TTargetClass>>> {
  // Implementation follows
}
```

### 2.2 Test Cases (Write First)

#### Test 1: Basic Descendant Query

```typescript
Deno.test("queryDescendantsByClassName - finds direct descendants", async () => {
  await withIsolatedDb(async () => {
    const cv = makeLoggedInCv();
    const { org, project, person } = await setupTestGraphData(cv);

    const descendants = await org.queryDescendantsByClassName(
      cv,
      TestPerson,
    );

    assertEquals(descendants.length, 1);
    assertEquals(descendants[0].props.name, "John Doe");
    assertEquals(descendants[0].metadata.bfGid, person.metadata.bfGid);
  });
});
```

#### Test 2: Multi-Level Descendants

```typescript
Deno.test("queryDescendantsByClassName - finds descendants at all levels", async () => {
  await withIsolatedDb(async () => {
    const cv = makeLoggedInCv();
    const org = await TestOrganization.__DANGEROUS__createUnattached(cv, {
      orgName: "Multi Corp",
      domain: "multi.com",
    });

    // Create multiple projects
    const project1 = await org.createTargetNode(TestProject, {
      title: "Project Alpha",
      status: "active",
    }, { role: "owns" });

    const project2 = await org.createTargetNode(TestProject, {
      title: "Project Beta",
      status: "active",
    }, { role: "owns" });

    // Add people to each project
    await project1.createTargetNode(TestPerson, {
      name: "Alice",
      email: "alice@multi.com",
      age: 28,
    }, { role: "assignedTo" });

    await project2.createTargetNode(TestPerson, {
      name: "Bob",
      email: "bob@multi.com",
      age: 32,
    }, { role: "assignedTo" });

    const descendants = await org.queryDescendantsByClassName(
      cv,
      TestPerson,
    );

    assertEquals(descendants.length, 2);
    const names = descendants.map((d) => d.props.name).sort();
    assertEquals(names, ["Alice", "Bob"]);
  });
});
```

#### Test 3: Limit and Empty Results

Similar pattern as ancestors tests but for descendants.

### 2.3 Implementation

Similar structure to `queryAncestorsByClassName` but using
`storage.queryDescendantsByClassName`.

## Method 3: `querySourceInstances`

### 3.1 Method Signature

```typescript
async querySourceInstances<
  TSourceClass extends typeof BfNode<TSourceProps>,
  TSourceProps extends PropsBase = PropsBase,
>(
  SourceClass: TSourceClass,
  nodeProps?: Partial<TSourceProps>,
  edgeProps?: Partial<PropsBase>,
  cache?: BfNodeCache<TSourceProps>,
): Promise<Array<InstanceType<TSourceClass>>> {
  // Implementation follows
}
```

### 3.2 Test Cases (Write First)

#### Test 1: Basic Source Query

```typescript
Deno.test("querySourceInstances - finds nodes that connect to this node", async () => {
  await withIsolatedDb(async () => {
    const cv = makeLoggedInCv();
    const { org, project, person } = await setupTestGraphData(cv);

    // Find organizations that connect to the project
    const sources = await project.querySourceInstances(TestOrganization);

    assertEquals(sources.length, 1);
    assertEquals(sources[0].props.orgName, "Test Corp");
    assertEquals(sources[0].metadata.bfGid, org.metadata.bfGid);
  });
});
```

#### Test 2: Filter by Node Properties

```typescript
Deno.test("querySourceInstances - filters by node properties", async () => {
  await withIsolatedDb(async () => {
    const cv = makeLoggedInCv();
    const project = await TestProject.__DANGEROUS__createUnattached(cv, {
      title: "Shared Project",
      status: "active",
    });

    // Create multiple orgs connecting to same project
    await TestOrganization.__DANGEROUS__createUnattached(cv, {
      orgName: "Big Corp",
      domain: "big.com",
    }).then((org) =>
      org.createTargetNode(TestProject, {
        title: project.props.title,
        status: project.props.status,
      }, { role: "owns", metadata: { bfGid: project.metadata.bfGid } })
    );

    await TestOrganization.__DANGEROUS__createUnattached(cv, {
      orgName: "Small LLC",
      domain: "small.com",
    }).then((org) =>
      org.createTargetNode(TestProject, {
        title: project.props.title,
        status: project.props.status,
      }, { role: "owns", metadata: { bfGid: project.metadata.bfGid } })
    );

    // Filter by specific org name
    const filteredSources = await project.querySourceInstances(
      TestOrganization,
      { orgName: "Big Corp" },
    );

    assertEquals(filteredSources.length, 1);
    assertEquals(filteredSources[0].props.orgName, "Big Corp");
  });
});
```

#### Test 3: Filter by Edge Properties

```typescript
Deno.test("querySourceInstances - filters by edge properties", async () => {
  await withIsolatedDb(async () => {
    const cv = makeLoggedInCv();
    const person = await TestPerson.__DANGEROUS__createUnattached(cv, {
      name: "Popular Person",
      email: "popular@test.com",
      age: 25,
    });

    // Create multiple projects with different edge roles
    const activeProject = await TestProject.__DANGEROUS__createUnattached(cv, {
      title: "Active Work",
      status: "active",
    });
    await activeProject.createTargetNode(TestPerson, {
      name: person.props.name,
      email: person.props.email,
      age: person.props.age,
    }, { role: "assignedTo", metadata: { bfGid: person.metadata.bfGid } });

    const consultingProject = await TestProject.__DANGEROUS__createUnattached(
      cv,
      {
        title: "Consulting Work",
        status: "consulting",
      },
    );
    await consultingProject.createTargetNode(TestPerson, {
      name: person.props.name,
      email: person.props.email,
      age: person.props.age,
    }, { role: "consultingFor", metadata: { bfGid: person.metadata.bfGid } });

    // Filter by edge role
    const assignedSources = await person.querySourceInstances(
      TestProject,
      {},
      { role: "assignedTo" },
    );

    assertEquals(assignedSources.length, 1);
    assertEquals(assignedSources[0].props.title, "Active Work");
  });
});
```

### 3.3 Implementation Steps

1. **Use BfEdge Query Pattern**: Leverage existing edge querying infrastructure
2. **Two-Step Process**: First query edges, then query source nodes
3. **Property Filtering**: Apply both node and edge property filters
4. **Performance Consideration**: Ensure efficient queries to backend

```typescript
async querySourceInstances<
  TSourceClass extends typeof BfNode<TSourceProps>,
  TSourceProps extends PropsBase = PropsBase,
>(
  SourceClass: TSourceClass,
  nodeProps: Partial<TSourceProps> = {},
  edgeProps: Partial<PropsBase> = {},
  cache?: BfNodeCache<TSourceProps>,
): Promise<Array<InstanceType<TSourceClass>>> {
  // Step 1: Query edges where this node is the target
  const { BfEdge } = await import("@bfmono/apps/bfDb/nodeTypes/BfEdge.ts");
  const edgeMetadata: Partial<BfEdgeMetadata> = {
    bfTid: this.metadata.bfGid,
    bfOid: this.cv.orgBfOid,
  };

  const edges = await BfEdge.query(
    this.cv,
    edgeMetadata,
    edgeProps,
    []
  );

  if (edges.length === 0) {
    return [];
  }

  // Step 2: Extract source IDs and query source nodes
  const sourceIds = edges.map(edge => 
    (edge.metadata as BfEdgeMetadata).bfSid
  );

  const sourceMetadata: Partial<BfNodeMetadata> = {
    className: SourceClass.name,
    bfOid: this.cv.orgBfOid,
  };

  return SourceClass.query(
    this.cv,
    sourceMetadata,
    nodeProps,
    sourceIds,
    cache
  );
}
```

## Method 4: `queryTargetInstances`

### 4.1 Method Signature

```typescript
async queryTargetInstances<
  TTargetClass extends typeof BfNode<TTargetProps>,
  TTargetProps extends PropsBase = PropsBase,
>(
  TargetClass: TTargetClass,
  nodeProps?: Partial<TTargetProps>,
  edgeProps?: Partial<PropsBase>,
  cache?: BfNodeCache<TTargetProps>,
): Promise<Array<InstanceType<TTargetClass>>> {
  // Implementation follows
}
```

### 4.2 Test Cases

Mirror the `querySourceInstances` tests but for target relationships.

### 4.3 Implementation

Similar to `querySourceInstances` but query edges where this node is the source
(`bfSid`).

## Error Handling Strategy

### Error Types to Test and Handle

1. **BfErrorNodeNotFound**: When querying non-existent nodes
2. **BfErrorNotImplemented**: For unsupported operations
3. **Database Connection Errors**: Backend connectivity issues
4. **Invalid Parameters**: Null/undefined class parameters

### Error Test Examples

```typescript
Deno.test("queryAncestorsByClassName - handles invalid class parameter", async () => {
  await withIsolatedDb(async () => {
    const cv = makeLoggedInCv();
    const person = await TestPerson.__DANGEROUS__createUnattached(cv, {
      name: "Test",
      email: "test@test.com",
      age: 30,
    });

    await assertRejects(
      () => person.queryAncestorsByClassName(cv, null as any),
      Error,
      "Invalid class parameter",
    );
  });
});
```

## Performance Testing Strategy

### Performance Test Cases

```typescript
Deno.test("queryDescendantsByClassName - performance with large dataset", async () => {
  await withIsolatedDb(async () => {
    const cv = makeLoggedInCv();
    const org = await createLargeTestHierarchy(cv, 100); // 100 nodes

    const startTime = performance.now();
    const descendants = await org.queryDescendantsByClassName(
      cv,
      TestPerson,
      10, // Limit for reasonable performance
    );
    const endTime = performance.now();

    assertEquals(descendants.length, 10);
    assert(
      (endTime - startTime) < 1000,
      "Query should complete within 1 second",
    );
  });
});
```

## Integration Testing

### Integration with Existing BfNode Features

```typescript
Deno.test("traversal methods integrate with existing BfNode methods", async () => {
  await withIsolatedDb(async () => {
    const cv = makeLoggedInCv();
    const { org, project, person } = await setupTestGraphData(cv);

    // Test that traversal works with existing find methods
    const foundPerson = await TestPerson.findX(cv, person.metadata.bfGid);
    assertEquals(foundPerson.metadata.bfGid, person.metadata.bfGid);

    // Test traversal from found node
    const ancestors = await foundPerson.queryAncestorsByClassName(
      cv,
      TestOrganization,
    );
    assertEquals(ancestors.length, 1);
    assertEquals(ancestors[0].metadata.bfGid, org.metadata.bfGid);
  });
});
```

### GraphQL Connection Integration

```typescript
Deno.test("traversal methods work with connection wrapper", async () => {
  await withIsolatedDb(async () => {
    const cv = makeLoggedInCv();
    const { org } = await setupTestGraphData(cv);

    const descendants = await org.queryDescendantsByClassName(cv, TestPerson);

    // Should work with existing connection method
    const connection = BfNode.connection(descendants, {});
    assertEquals(connection.edges.length, descendants.length);
  });
});
```

## Implementation Order

1. **Phase 1a**: Implement and test `queryAncestorsByClassName`
2. **Phase 1b**: Implement and test `queryDescendantsByClassName`
3. **Phase 1c**: Implement and test `querySourceInstances`
4. **Phase 1d**: Implement and test `queryTargetInstances`
5. **Phase 1e**: Integration testing and performance validation
6. **Phase 1f**: Error handling and edge case coverage

## Validation Criteria

### Success Criteria

- [ ] All tests pass using `bft test`
- [ ] Type safety maintained (no TypeScript errors)
- [ ] Performance meets requirements (< 1s for reasonable datasets)
- [ ] Memory usage stays within bounds (no memory leaks)
- [ ] Error handling covers all edge cases
- [ ] Integration with existing BfNode methods works seamlessly

### Code Quality Checks

- [ ] Follows existing codebase patterns and conventions
- [ ] Uses `Array<T>` syntax instead of `T[]` per project guidelines
- [ ] Proper JSDoc documentation for public methods
- [ ] Consistent error handling with existing methods
- [ ] Cache parameter usage follows established patterns

## Future Considerations

### Phase 2 Preparation

- Methods should be designed to support future pagination features
- Consider how these methods will integrate with GraphQL subscriptions
- Ensure the API design can accommodate future permission framework

### Performance Optimization Opportunities

- Connection pooling and query optimization
- Caching strategies for frequently traversed paths
- Batch operations for multiple traversal requests

This comprehensive TDD plan provides a step-by-step approach to implementing the
core traversal methods while maintaining consistency with the existing codebase
patterns and ensuring robust test coverage.
