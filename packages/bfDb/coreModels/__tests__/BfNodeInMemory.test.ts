import { testBfNodeBase } from "packages/bfDb/classes/__tests__/BfNodeBaseTest.ts";
import { BfNodeInMemory } from "packages/bfDb/coreModels/BfNodeInMemory.ts";

testBfNodeBase(BfNodeInMemory);
import { withIsolatedDb } from "packages/bfDb/bfDb.ts";
import { BfCurrentViewer } from "packages/bfDb/classes/BfCurrentViewer.ts";
import { assertExists } from "@std/assert/exists";
import { assertEquals } from "@std/assert/equals";
Deno.test(
  "queryTargetsConnectionForGraphql should return a connection with pagination",
  async () => {
    await withIsolatedDb(async () => {
      const mockCv = BfCurrentViewer
        .__DANGEROUS_USE_IN_SCRIPTS_ONLY__createLoggedIn(
          import.meta,
          "test",
          "test",
        );
      // Create a source node
      const sourceNode = await BfNodeInMemory.__DANGEROUS__createUnattached(
        mockCv,
        {
          name: "Source Node for Connection Test",
        },
      );

      // Create multiple target nodes and edges for testing pagination
      const targetNodes = [];
      for (let i = 0; i < 5; i++) {
        const targetNode = await BfNodeInMemory.__DANGEROUS__createUnattached(
          mockCv,
          {
            name: `Target Node ${i} for Connection Test`,
          },
        );
        targetNodes.push(targetNode);

        // Create an edge between source and target
        await sourceNode.createTargetNode(
          BfNodeInMemory,
          { name: `Edge Target ${i}` },
          undefined,
          { role: `test-role-${i}` },
        );
      }

      // Test with first/after pagination
      const firstConnection = await sourceNode
        .queryTargetsConnectionForGraphql(
          BfNodeInMemory,
          { first: 2 },
        );

      // Connection should have all expected properties
      assertExists(firstConnection.edges, "Connection should have edges");
      assertExists(
        firstConnection.pageInfo,
        "Connection should have pageInfo",
      );
      assertEquals(
        firstConnection.edges.length,
        2,
        "Should return 2 edges when first: 2 is specified",
      );
      assertEquals(
        firstConnection.pageInfo.hasNextPage,
        true,
        "Should have next page when more results exist",
      );

      // If we have edges, test cursor-based pagination
      if (firstConnection.edges.length > 0) {
        const cursor =
          firstConnection.edges[firstConnection.edges.length - 1].cursor;

        // Get the next page using the cursor
        const secondConnection = await sourceNode
          .queryTargetsConnectionForGraphql(
            BfNodeInMemory,
            { first: 2, after: cursor },
          );

        assertExists(
          secondConnection.edges,
          "Connection should have edges",
        );
        assertEquals(
          secondConnection.edges.length,
          2,
          "Should return 2 more edges",
        );
        assertEquals(
          secondConnection.edges[0].node.id !==
            firstConnection.edges[0].node.id,
          true,
          "Second page should have different nodes than first page",
        );
      }
    });
  },
);
