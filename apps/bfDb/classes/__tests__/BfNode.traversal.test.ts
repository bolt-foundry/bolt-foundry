import { assertEquals } from "@std/assert";
import { withIsolatedDb } from "@bfmono/apps/bfDb/bfDb.ts";
import { makeLoggedInCv } from "@bfmono/apps/bfDb/utils/testUtils.ts";
import { BfNode } from "@bfmono/apps/bfDb/classes/BfNode.ts";
import type { InferProps } from "@bfmono/apps/bfDb/classes/BfNode.ts";
import type { CurrentViewer } from "@bfmono/apps/bfDb/classes/CurrentViewer.ts";

// Test node classes for graph traversal testing
class TestPerson extends BfNode<InferProps<typeof TestPerson>> {
  static override gqlSpec = this.defineGqlNode((f) =>
    f.string("name").string("email").int("age")
  );
  static override bfNodeSpec = this.defineBfNode((f) =>
    f.string("name").string("email").number("age")
  );
}

class TestOrganization extends BfNode<InferProps<typeof TestOrganization>> {
  static override gqlSpec = this.defineGqlNode((f) =>
    f.string("orgName").string("domain")
  );
  static override bfNodeSpec = this.defineBfNode((f) =>
    f.string("orgName").string("domain")
  );
}

class TestProject extends BfNode<InferProps<typeof TestProject>> {
  static override gqlSpec = this.defineGqlNode((f) =>
    f.string("title").string("status")
  );
  static override bfNodeSpec = this.defineBfNode((f) =>
    f.string("title").string("status")
  );
}

// Test data setup helper
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

// Test 1: queryAncestorsByClassName - finds direct ancestors
Deno.test("queryAncestorsByClassName - finds direct ancestors", async () => {
  await withIsolatedDb(async () => {
    const cv = makeLoggedInCv();
    const { org, person } = await setupTestGraphData(cv);

    // Query ancestors of person, looking for organizations
    const ancestors = await person.queryAncestorsByClassName(
      TestOrganization,
    );

    assertEquals(ancestors.length, 1);
    assertEquals(ancestors[0].props.orgName, "Test Corp");
    assertEquals(ancestors[0].metadata.bfGid, org.metadata.bfGid);
  });
});

// Test 2: queryDescendantsByClassName - finds direct descendants
Deno.test("queryDescendantsByClassName - finds direct descendants", async () => {
  await withIsolatedDb(async () => {
    const cv = makeLoggedInCv();
    const { org, person } = await setupTestGraphData(cv);

    const descendants = await org.queryDescendantsByClassName(
      TestPerson,
    );

    assertEquals(descendants.length, 1);
    assertEquals(descendants[0].props.name, "John Doe");
    assertEquals(descendants[0].metadata.bfGid, person.metadata.bfGid);
  });
});

// Test 3: querySourceInstances - finds nodes that connect to this node
Deno.test("querySourceInstances - finds nodes that connect to this node", async () => {
  await withIsolatedDb(async () => {
    const cv = makeLoggedInCv();
    const { org, project } = await setupTestGraphData(cv);

    // Find organizations that connect to the project
    const sources = await project.querySourceInstances(TestOrganization);

    assertEquals(sources.length, 1);
    assertEquals(sources[0].props.orgName, "Test Corp");
    assertEquals(sources[0].metadata.bfGid, org.metadata.bfGid);
  });
});

// Test 4: queryTargetInstances - finds nodes this node connects to
Deno.test("queryTargetInstances - finds nodes this node connects to", async () => {
  await withIsolatedDb(async () => {
    const cv = makeLoggedInCv();
    const { org, project } = await setupTestGraphData(cv);

    // Find projects that the organization connects to
    const targets = await org.queryTargetInstances(TestProject);

    assertEquals(targets.length, 1);
    assertEquals(targets[0].props.title, "Test Project");
    assertEquals(targets[0].metadata.bfGid, project.metadata.bfGid);
  });
});

// Test 5: Empty results when no relationships exist
Deno.test("queryAncestorsByClassName - returns empty array when no ancestors", async () => {
  await withIsolatedDb(async () => {
    const cv = makeLoggedInCv();
    const person = await TestPerson.__DANGEROUS__createUnattached(cv, {
      name: "Isolated Person",
      email: "isolated@test.com",
      age: 30,
    });

    const ancestors = await person.queryAncestorsByClassName(
      TestOrganization,
    );

    assertEquals(ancestors.length, 0);
  });
});
