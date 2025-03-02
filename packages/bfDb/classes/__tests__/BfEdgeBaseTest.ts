import { assertEquals } from "@std/assert";
import type {
  BfEdgeBase,
  BfEdgeBaseProps,
} from "packages/bfDb/classes/BfEdgeBase.ts";
import { BfCurrentViewer } from "packages/bfDb/classes/BfCurrentViewer.ts";
import type { BfMetadataEdge } from "packages/bfDb/coreModels/BfEdge.ts";
import { BfNodeInMemory } from "packages/bfDb/classes/BfNodeInMemory.ts";

export function testBfEdgeBase<
  TEdgeProps extends BfEdgeBaseProps,
  TMetadata extends BfMetadataEdge,
>(BfEdgeClass: typeof BfEdgeBase<TEdgeProps, TMetadata>) {
  Deno.test(`BfEdgeBase test suite: ${BfEdgeClass.name}`, async (t) => {
    // Mock current viewer
    const mockCv = BfCurrentViewer
      .__DANGEROUS_USE_IN_SCRIPTS_ONLY__createLoggedIn(
        import.meta,
        "test",
        "test",
      );

    const sourceNode = await BfNodeInMemory.__DANGEROUS__createUnattached(
      mockCv,
      {
        name: "Source Node",
      },
    );
    const targetNode = await BfNodeInMemory.__DANGEROUS__createUnattached(
      mockCv,
      {
        name: "Target Node",
      },
    );

    await t.step(
      "createBetweenNodes should create an edge between two nodes",
      async () => {
        const role = "test-role";
        const edge = await BfEdgeClass.createBetweenNodes(
          mockCv,
          sourceNode,
          targetNode,
          role,
        );

        assertEquals(edge.metadata.bfSid, sourceNode.metadata.bfGid);
        assertEquals(edge.metadata.bfTid, targetNode.metadata.bfGid);
        assertEquals(edge.metadata.bfSClassName, sourceNode.metadata.className);
        assertEquals(edge.metadata.bfTClassName, targetNode.metadata.className);
        assertEquals(edge.props.role, role);
      },
    );

    await t.step(
      "querySourceInstances should return source nodes connected to a target node",
      async () => {
        // Create nodes for testing
        const sourceNode1 = await BfNodeInMemory.__DANGEROUS__createUnattached(
          mockCv,
          {
            name: "Source Node 1",
          },
        );
        const sourceNode2 = await BfNodeInMemory.__DANGEROUS__createUnattached(
          mockCv,
          {
            name: "Source Node 2",
          },
        );
        const targetNode = await BfNodeInMemory.__DANGEROUS__createUnattached(
          mockCv,
          {
            name: "Target Node for Query",
          },
        );

        // Create edges with different roles
        const role1 = "test-role-1";
        const role2 = "test-role-2";
        await BfEdgeClass.createBetweenNodes(
          mockCv,
          sourceNode1,
          targetNode,
          role1,
        );
        await BfEdgeClass.createBetweenNodes(
          mockCv,
          sourceNode2,
          targetNode,
          role2,
        );

        // Test querying source instances without role filter
        const sources = await BfEdgeClass.querySourceInstances(
          mockCv,
          BfNodeInMemory,
          targetNode.metadata.bfGid,
        );

        assertEquals(sources.length, 2);
        assertEquals(sources[0].metadata.bfGid, sourceNode1.metadata.bfGid);
        assertEquals(sources[1].metadata.bfGid, sourceNode2.metadata.bfGid);

        // Test with edge properties filter (role)
        const filteredSources = await BfEdgeClass.querySourceInstances(
          mockCv,
          BfNodeInMemory,
          targetNode.metadata.bfGid,
          {},
          { role: role1 },
        );

        assertEquals(filteredSources.length, 1);
        assertEquals(
          filteredSources[0].metadata.bfGid,
          sourceNode1.metadata.bfGid,
        );
      },
    );
  });
}
