import { assertEquals, assertExists } from "@std/assert";
import { BfCurrentViewer } from "packages/bfDb/classes/BfCurrentViewer.ts";
import type { BfNodeBase } from "packages/bfDb/classes/BfNodeBase.ts";
import { getLogger } from "packages/logger.ts";

const _logger = getLogger(import.meta);

export function testBfNodeBase(BfNodeClass: typeof BfNodeBase) {
  Deno.test(`BfNodeBase test suite: ${BfNodeClass.name}`, async (t) => {
    // Mock current viewer
    const mockCv = BfCurrentViewer
      .__DANGEROUS_USE_IN_SCRIPTS_ONLY__createLoggedIn(
        import.meta,
        "test",
        "test",
      );

    await t.step(
      "createUnattached should create a node with proper metadata",
      async () => {
        const nodeName = "Test Node";
        const node = await BfNodeClass.__DANGEROUS__createUnattached(mockCv, {
          name: nodeName,
        });

        assertExists(node.metadata.bfGid, "Node should have a global ID");
        assertExists(node.metadata.bfOid, "Node should have an owner ID");
        assertEquals(node.metadata.className, BfNodeClass.name);
        assertEquals(node.props.name, nodeName);
      },
    );

    await t.step("should generate unique GIDs for each node", async () => {
      const node1 = await BfNodeClass.__DANGEROUS__createUnattached(mockCv, {
        name: "Node 1",
      });
      const node2 = await BfNodeClass.__DANGEROUS__createUnattached(mockCv, {
        name: "Node 2",
      });

      assertExists(node1.metadata.bfGid);
      assertExists(node2.metadata.bfGid);
      assertEquals(
        node1.metadata.bfGid !== node2.metadata.bfGid,
        true,
        "Nodes should have unique GIDs",
      );
    });

    await t.step("should allow updating props", async () => {
      const node = await BfNodeClass.__DANGEROUS__createUnattached(mockCv, {
        name: "Initial Name",
      });

      // Update props
      node.props = {
        ...node.props,
        name: "Updated Name",
        description: "New description",
      };

      assertEquals(node.props.name, "Updated Name");
      assertEquals(node.props.description, "New description");
    });

    await t.step("toGraphql should return expected structure", async () => {
      const node = await BfNodeClass.__DANGEROUS__createUnattached(mockCv, {
        name: "GraphQL Node",
      });

      const graphqlObj = node.toGraphql();

      assertEquals(graphqlObj.id, node.metadata.bfGid);
      assertEquals(graphqlObj.__typename, node.__typename);
      assertEquals(graphqlObj.name, "GraphQL Node");
    });

    await t.step(
      "toString should return a formatted string with metadata",
      async () => {
        const node = await BfNodeClass.__DANGEROUS__createUnattached(mockCv, {
          name: "String Test Node",
        });

        const stringRepresentation = node.toString();

        // Check that string contains the class name and IDs
        assertEquals(
          stringRepresentation.includes(BfNodeClass.name),
          true,
          "String representation should include class name",
        );
        assertEquals(
          stringRepresentation.includes(node.metadata.bfGid),
          true,
          "String representation should include bfGid",
        );
        assertEquals(
          stringRepresentation.includes(node.metadata.bfOid),
          true,
          "String representation should include bfOid",
        );
      },
    );

    await t.step("generateMetadata should create proper metadata", () => {
      const metadata = BfNodeClass.generateMetadata(mockCv);

      assertExists(metadata.bfGid);
      assertEquals(metadata.bfOid, mockCv.bfOid);
      assertEquals(metadata.className, BfNodeClass.name);
      assertExists(metadata.sortValue);
    });

    await t.step("generateSortValue should create a numeric value", () => {
      const sortValue = BfNodeClass.generateSortValue();
      assertEquals(typeof sortValue, "number");
    });
    
    await t.step("createTargetNode should create a connected node", async () => {
      // Create a source node
      const sourceNode = await BfNodeClass.__DANGEROUS__createUnattached(mockCv, {
        name: "Source Node",
      });
      
      // Define a role for the connection
      const role = "test-connection";
      
      // Create a target node connected to the source node
      const targetNode = await sourceNode.createTargetNode(
        BfNodeClass,
        { name: "Target Node" },
        undefined,
        role
      );
      
      // Verify target node was created with proper properties
      assertExists(targetNode.metadata.bfGid, "Target node should have a global ID");
      assertEquals(targetNode.props.name, "Target Node", "Target node should have the correct name");
      
      // Verify edge was created between nodes
      // First, get the BfEdgeBase implementation class from the relatedEdge property
      // Access relatedEdge through a getter method or use the edge class directly
      const relatedEdgePath = "packages/bfDb/classes/BfEdgeBase.ts";
      const relatedEdgeNameWithTs = relatedEdgePath.split("/").pop() as string;
      const relatedEdgeName = relatedEdgeNameWithTs.replace(".ts", "");
      const bfEdgeImport = await import(relatedEdgePath);
      const BfEdgeClass = bfEdgeImport[relatedEdgeName];
      
      // Query edges from source to target
      const edges = await BfEdgeClass.queryTargetEdgesForNode(sourceNode);
      
      // Verify an edge exists with the correct properties
      assertEquals(edges.length, 1, "Should have one edge connecting the nodes");
      assertEquals(edges[0].metadata.bfSid, sourceNode.metadata.bfGid, "Edge source should be source node");
      assertEquals(edges[0].metadata.bfTid, targetNode.metadata.bfGid, "Edge target should be target node");
      assertEquals(edges[0].props.role, role, "Edge should have the correct role");
    });
  });
}
