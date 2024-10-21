// Import the necessary modules
import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";
import { BfCurrentViewer } from "packages/bfDb/classes/BfCurrentViewer.ts";
import { BfEdge } from "packages/bfDb/coreModels/BfEdge.ts";
import { assertEquals, assertExists } from "@std/assert";
import {
  ACCOUNT_ROLE,
  toBfGid,
} from "packages/bfDb/classes/BfBaseModelIdTypes.ts";
import { getLogger } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);
const uniqueRoleString = `test-${Math.random()}`;

// Mock BfCurrentViewer for testing purposes
export class MockBfCurrentViewer extends BfCurrentViewer {
  constructor() {
    super(
      toBfGid("test-org"),
      ACCOUNT_ROLE.ADMIN,
      toBfGid("test-person"),
      toBfGid("test-account"),
      import.meta.url,
    );
  }
}

Deno.test("BfNode - Create and retrieve a node", async () => {
  const currentViewer = new MockBfCurrentViewer();
  const testProps = { name: "Test Node" };

  // Create a new node
  const node = await BfNode.__DANGEROUS__createUnattached(
    currentViewer,
    testProps,
  );

  assertExists(node);
  assertEquals(node.props.name, "Test Node");

  // Retrieve the node
  const retrievedNode = await BfNode.findX(currentViewer, node.metadata.bfGid);

  assertExists(retrievedNode);
  assertEquals(retrievedNode.props.name, "Test Node");
});

Deno.test("BfNode - Create a target node and edge", async () => {
  const currentViewer = new MockBfCurrentViewer();
  const sourceNode = await BfNode.__DANGEROUS__createUnattached(currentViewer, {
    name: "Source Node",
  });
  const role = `create-and-retrieve-${uniqueRoleString}`;

  // Create a target node
  const targetNode = await sourceNode.createTargetNode(BfNode, {
    name: "Target Node",
  }, role);

  assertExists(targetNode);
  assertEquals(targetNode.props.name, "Target Node");

  // Check if the edge was created
  const edges = await BfEdge.query(currentViewer, {
    bfSid: sourceNode.metadata.bfGid,
    bfTid: targetNode.metadata.bfGid,
  });

  assertEquals(edges.length, 1);
  assertEquals(edges[0].props.role, role);
});

Deno.test("BfNode - Query target instances", async () => {
  const currentViewer = new MockBfCurrentViewer();
  const sourceNode = await BfNode.__DANGEROUS__createUnattached(currentViewer, {
    name: "Source Node",
  });
  const role = `query-and-retrieve-${uniqueRoleString}`;

  // Create multiple target nodes
  await sourceNode.createTargetNode(BfNode, { name: "Target 1" }, role);
  await sourceNode.createTargetNode(BfNode, { name: "Target 2" }, role);

  // Query target instances
  const targetInstances = await sourceNode.queryTargetInstances(BfNode);

  assertEquals(targetInstances.length, 2);
  assertEquals(targetInstances[0].props.name, "Target 1");
  assertEquals(targetInstances[1].props.name, "Target 2");
});

Deno.test("BfNode - Delete node and associated edges", async () => {
  const currentViewer = new MockBfCurrentViewer();
  const role = `delete-a-node-${uniqueRoleString}`;
  const sourceNode = await BfNode.__DANGEROUS__createUnattached(currentViewer, {
    name: "Source Node",
  });
  const targetNode = await sourceNode.createTargetNode(BfNode, {
    name: "Target Node",
  }, role);

  logger.debug(`Deleting node ${sourceNode.metadata.bfGid}`);

  const sourceNodeBfGid = sourceNode.metadata.bfGid;
  // // Delete the source node
  await sourceNode.delete();

  // Check if the node and associated edges are deleted
  const deletedNode = await BfNode.find(
    currentViewer,
    sourceNode.metadata.bfGid,
  );
  const targetDeletedNode = await BfNode.find(
    currentViewer,
    targetNode.metadata.bfGid,
  );
  assertEquals(deletedNode, null);
  assertEquals(targetDeletedNode, null);

  const edges = await BfEdge.query(currentViewer, {
    bfSid: sourceNodeBfGid,
  }, { role });
  assertEquals(edges.length, 0);
});

Deno.test("BfNode - Deep network delete with multiple generations", async () => {
  const currentViewer = new MockBfCurrentViewer();
  const role = `deep-network-delete-test-role-${uniqueRoleString}`;
  // Create a network of nodes
  const rootNode = await BfNode.__DANGEROUS__createUnattached(currentViewer, {
    name: "Root",
  });
  const child1 = await rootNode.createTargetNode(
    BfNode,
    { name: "Child 1" },
    role,
  );
  const child2 = await rootNode.createTargetNode(
    BfNode,
    { name: "Child 2" },
    role,
  );
  const grandchild1 = await child1.createTargetNode(BfNode, {
    name: "Grandchild 1",
  }, role);
  const grandchild2 = await child2.createTargetNode(BfNode, {
    name: "Grandchild 2",
  }, role);
  const greatGrandchild = await grandchild1.createTargetNode(BfNode, {
    name: "Great Grandchild",
  }, role);
  // Delete the root node
  await rootNode.delete();
  // Verify that all nodes in the network are deleted
  for (
    const node of [
      rootNode,
      child1,
      child2,
      grandchild1,
      grandchild2,
      greatGrandchild,
    ]
  ) {
    const deletedNode = await BfNode.find(currentViewer, node.metadata.bfGid);
    assertEquals(
      deletedNode,
      null,
      `Node ${node.props.name} should be deleted`,
    );
  }
  // Verify that all edges are deleted
  const edges = await BfEdge.query(currentViewer, {}, { role });
  assertEquals(edges.length, 0, "All edges should be deleted");
});
Deno.test("BfNode - Deep network delete with multiple sources", async () => {
  const currentViewer = new MockBfCurrentViewer();
  const role =
    `deep-network-delete-multiple-source-test-role-${uniqueRoleString}`;
  // Create a network of nodes
  const root1 = await BfNode.__DANGEROUS__createUnattached(currentViewer, {
    name: "Root 1",
  });
  const root2 = await BfNode.__DANGEROUS__createUnattached(currentViewer, {
    name: "Root 2",
  });
  const sharedChild = await root1.createTargetNode(BfNode, {
    name: "Shared Child",
  }, role);
  await BfEdge.createBetweenNodes(currentViewer, root2, sharedChild, role);
  const grandchild1 = await sharedChild.createTargetNode(BfNode, {
    name: "Grandchild 1",
  }, role);
  const grandchild2 = await sharedChild.createTargetNode(BfNode, {
    name: "Grandchild 2",
  }, role);
  // Delete root1
  await root1.delete();
  // Verify that root1 is deleted
  const deletedRoot1 = await BfNode.find(currentViewer, root1.metadata.bfGid);
  assertEquals(deletedRoot1, null, "Root 1 should be deleted");
  // Verify that sharedChild and its descendants are not deleted
  for (const node of [sharedChild, grandchild1, grandchild2]) {
    const existingNode = await BfNode.find(currentViewer, node.metadata.bfGid);
    assertExists(existingNode, `Node ${node.props.name} should still exist`);
  }
  // Verify that the edge from root1 to sharedChild is deleted
  const edgesFromRoot1 = await BfEdge.query(currentViewer, {
    bfSid: root1.metadata.bfGid,
  }, { role });
  assertEquals(
    edgesFromRoot1.length,
    0,
    "Edge from Root 1 to Shared Child should be deleted",
  );
  // Verify that the edge from root2 to sharedChild still exists
  const edgesFromRoot2 = await BfEdge.query(currentViewer, {
    bfSid: root2.metadata.bfGid,
  }, { role });
  assertEquals(
    edgesFromRoot2.length,
    1,
    "Edge from Root 2 to Shared Child should still exist",
  );
  // Now delete root2
  await root2.delete();
  // Verify that root2 is deleted
  const deletedRoot2 = await BfNode.find(currentViewer, root2.metadata.bfGid);
  assertEquals(deletedRoot2, null, "Root 2 should be deleted");
  // Verify that sharedChild and its descendants are now deleted
  for (const node of [sharedChild, grandchild1, grandchild2]) {
    const deletedNode = await BfNode.find(currentViewer, node.metadata.bfGid);
    assertEquals(
      deletedNode,
      null,
      `Node ${node.props.name} should now be deleted`,
    );
  }
  // Verify that all edges are deleted
  const remainingEdges = await BfEdge.query(currentViewer, {}, { role });
  assertEquals(remainingEdges.length, 0, "All edges should be deleted");
});

Deno.test("BfNode - Query ancestors by class name", async () => {
  const currentViewer = new MockBfCurrentViewer();
  const role = `ancestor-query-${uniqueRoleString}`;

  const rootNode = await BfNode.__DANGEROUS__createUnattached(currentViewer, {
    name: "Root Node",
  });
  const middleNode = await rootNode.createTargetNode(BfNode, {
    name: "Middle Node",
  }, role);
  const leafNode = await middleNode.createTargetNode(BfNode, {
    name: "Leaf Node",
  }, role);

  const ancestors = await leafNode.queryAncestorsByClassName(BfNode);

  assertEquals(ancestors[0].props.name, "Middle Node");
});
