// Import the necessary modules
import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";
import { BfEdge } from "packages/bfDb/coreModels/BfEdge.ts";
import { assert, assertEquals, assertExists, assertRejects } from "@std/assert";
import { MockBfCurrentViewer } from "packages/bfDb/coreModels/__tests__/BfNode_test.ts";
import { toBfGid } from "packages/bfDb/classes/BfBaseModelIdTypes.ts";
import { BfModelErrorNotFound } from "packages/bfDb/classes/BfModelError.ts";

const uniqueRoleString = `test-${Math.random()}`;

Deno.test("BfEdge - Create and retrieve an edge", async () => {
  const currentViewer = new MockBfCurrentViewer();
  const sourceNode = await BfNode.__DANGEROUS__createUnattached(currentViewer, {
    name: "Source Node",
  });
  const targetNode = await BfNode.__DANGEROUS__createUnattached(currentViewer, {
    name: "Target Node",
  });
  const role = `test-role-${uniqueRoleString}`;

  // Create a new edge
  const edge = await BfEdge.createBetweenNodes(
    currentViewer,
    sourceNode,
    targetNode,
    role,
  );

  assertExists(edge);
  assertEquals(edge.props.role, role);

  // Retrieve the edge
  const retrievedEdge = await BfEdge.findX(currentViewer, edge.metadata.bfGid);

  assertExists(retrievedEdge);
  assertEquals(retrievedEdge.props.role, role);
});

Deno.test("BfEdge - Query source edges for a node", async () => {
  const currentViewer = new MockBfCurrentViewer();
  const sourceNode = await BfNode.__DANGEROUS__createUnattached(currentViewer, {
    name: "Source Node",
  });
  const targetNode = await BfNode.__DANGEROUS__createUnattached(currentViewer, {
    name: "Target Node",
  });
  const role = `test-role-${uniqueRoleString}`;

  await BfEdge.createBetweenNodes(currentViewer, sourceNode, targetNode, role);

  const sourceEdges = await BfEdge.querySourceEdgesForNode(targetNode);

  assertEquals(sourceEdges.length, 1);
  assertEquals(sourceEdges[0].props.role, role);
});

Deno.test("BfEdge - Query target instances", async () => {
  const currentViewer = new MockBfCurrentViewer();
  const sourceNode = await BfNode.__DANGEROUS__createUnattached(currentViewer, {
    name: "Source Node",
  });
  const targetNode1 = await BfNode.__DANGEROUS__createUnattached(
    currentViewer,
    { name: "Target Node 1" },
  );
  const targetNode2 = await BfNode.__DANGEROUS__createUnattached(
    currentViewer,
    { name: "Target Node 2" },
  );
  const role = `test-role-${uniqueRoleString}`;

  await BfEdge.createBetweenNodes(currentViewer, sourceNode, targetNode1, role);
  await BfEdge.createBetweenNodes(currentViewer, sourceNode, targetNode2, role);

  const targetInstances = await BfEdge.queryTargetInstances(
    currentViewer,
    BfNode,
    sourceNode.metadata.bfGid,
  );

  assertEquals(targetInstances.length, 2);
  assertEquals(targetInstances[0].props.name, "Target Node 1");
  assertEquals(targetInstances[1].props.name, "Target Node 2");
});

Deno.test("BfEdge - Delete edges touching a node", async () => {
  const currentViewer = new MockBfCurrentViewer();
  const sourceNode = await BfNode.__DANGEROUS__createUnattached(currentViewer, {
    name: "Source Node",
  });
  const targetNode = await BfNode.__DANGEROUS__createUnattached(currentViewer, {
    name: "Target Node",
  });
  const role = `test-role-${uniqueRoleString}`;

  await BfEdge.createBetweenNodes(currentViewer, sourceNode, targetNode, role);

  // Delete edges touching the source node
  await BfEdge.deleteEdgesTouchingNode(
    currentViewer,
    sourceNode.metadata.bfGid,
  );

  // Try to query the edge
  const edges = await BfEdge.query(currentViewer, {
    bfSid: sourceNode.metadata.bfGid,
    bfTid: targetNode.metadata.bfGid,
  });

  assertEquals(edges.length, 0);
});

Deno.test("BfEdge - Query targets connection for GraphQL", async () => {
  const currentViewer = new MockBfCurrentViewer();
  const sourceNode = await BfNode.__DANGEROUS__createUnattached(currentViewer, {
    name: "Source Node",
  });
  const targetNode1 = await BfNode.__DANGEROUS__createUnattached(
    currentViewer,
    { name: "Target Node 1" },
  );
  const targetNode2 = await BfNode.__DANGEROUS__createUnattached(
    currentViewer,
    { name: "Target Node 2" },
  );
  const role = `test-role-${uniqueRoleString}`;

  await BfEdge.createBetweenNodes(currentViewer, sourceNode, targetNode1, role);
  await BfEdge.createBetweenNodes(currentViewer, sourceNode, targetNode2, role);

  const connection = await BfEdge.queryTargetsConnectionForGraphQL(
    currentViewer,
    BfNode,
    sourceNode.metadata.bfGid,
    {},
    { first: 10 },
  );

  assertEquals(connection.edges.length, 2);
  assertEquals(connection.edges[0].node.name, "Target Node 1");
  assertEquals(connection.edges[1].node.name, "Target Node 2");
});

// Deno.test("BfEdge - Get connection subscription for GraphQL", async () => {
//   const currentViewer = new MockBfCurrentViewer();
//   const sourceNode = await BfNode.__DANGEROUS__createUnattached(currentViewer, {
//     name: "Source Node",
//   });
//   const targetNode = await BfNode.__DANGEROUS__createUnattached(currentViewer, {
//     name: "Target Node",
//   });
//   const role = `test-role-${uniqueRoleString}`;
//   const edge = await BfEdge.createBetweenNodes(
//     currentViewer,
//     sourceNode,
//     targetNode,
//     role,
//   );
//   const subscription = edge.getSubscriptionForGraphql();
//   assertExists(subscription);

//   // Check if the subscription is an AsyncIterator
//   assert(Symbol.asyncIterator in subscription);
//   // Read the first value from the subscription
//   const { value, done } = await subscription[Symbol.asyncIterator]().next();
//   // Assert that we received a value and the subscription is not done
//   assertExists(value);
//   assertEquals(done, false);
//   // Clean up the subscription
//   await edge.delete();
// });

Deno.test("BfEdge - Delete individual edge", async () => {
  const currentViewer = new MockBfCurrentViewer();
  const sourceNode = await BfNode.__DANGEROUS__createUnattached(currentViewer, {
    name: "Source Node",
  });
  const targetNode = await BfNode.__DANGEROUS__createUnattached(currentViewer, {
    name: "Target Node",
  });
  const role = `test-role-${uniqueRoleString}`;
  const edge = await BfEdge.createBetweenNodes(
    currentViewer,
    sourceNode,
    targetNode,
    role,
  );
  await edge.delete();
  // Try to retrieve the deleted edge
  await assertRejects(
    async () => {
      await BfEdge.findX(currentViewer, edge.metadata.bfGid);
    },
    BfModelErrorNotFound,
  );
});

Deno.test("BfEdge - Query with invalid parameters", async () => {
  const currentViewer = new MockBfCurrentViewer();
  const invalidQuery = await BfEdge.query(currentViewer, {
    bfSid: toBfGid("invalid-source-id"),
    bfTid: toBfGid("invalid-target-id"),
  });
  assertEquals(invalidQuery.length, 0);
});
