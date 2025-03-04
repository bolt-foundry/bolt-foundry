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
      "generateEdgeMetadata should create correct metadata for an edge",
      () => {
        const metadata = BfEdgeClass.generateEdgeMetadata(
          mockCv,
          sourceNode,
          targetNode,
        );

        // Verify base metadata properties
        assertEquals(
          typeof metadata.bfGid,
          "string",
          "bfGid should be a string",
        );
        assertEquals(
          metadata.className,
          BfEdgeClass.name,
          "className should match the edge class",
        );

        // Verify edge-specific metadata
        assertEquals(
          metadata.bfSid,
          sourceNode.metadata.bfGid,
          "Source ID should match source node's ID",
        );
        assertEquals(
          metadata.bfTid,
          targetNode.metadata.bfGid,
          "Target ID should match target node's ID",
        );
        assertEquals(
          metadata.bfSClassName,
          sourceNode.constructor.name,
          "Source class name should match",
        );
        assertEquals(
          metadata.bfTClassName,
          targetNode.constructor.name,
          "Target class name should match",
        );
      },
    );

    await t.step(
      "createBetweenNodes should create an edge between two nodes",
      async () => {
        const edgeProps = { role: "test-role" };
        const edge = await BfEdgeClass.createBetweenNodes(
          mockCv,
          sourceNode,
          targetNode,
          edgeProps,
        );

        assertEquals(edge.metadata.bfSid, sourceNode.metadata.bfGid);
        assertEquals(edge.metadata.bfTid, targetNode.metadata.bfGid);
        assertEquals(edge.metadata.bfSClassName, sourceNode.metadata.className);
        assertEquals(edge.metadata.bfTClassName, targetNode.metadata.className);
        assertEquals(edge.props.role, edgeProps.role);
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
        const edgeProps1 = { role: "test-role-1" };
        const edgeProps2 = { role: "test-role-2" };
        await BfEdgeClass.createBetweenNodes(
          mockCv,
          sourceNode1,
          targetNode,
          edgeProps1,
        );
        await BfEdgeClass.createBetweenNodes(
          mockCv,
          sourceNode2,
          targetNode,
          edgeProps2,
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
          { role: "test-role-1" },
        );

        assertEquals(filteredSources.length, 1);
        assertEquals(
          filteredSources[0].metadata.bfGid,
          sourceNode1.metadata.bfGid,
        );
      },
    );

    await t.step(
      "querySourceEdgesForNode should return edges where a node is the source",
      async () => {
        // Create nodes for testing
        const sourceNode = await BfNodeInMemory.__DANGEROUS__createUnattached(
          mockCv,
          {
            name: "Source Node for Edge Query",
          },
        );
        const targetNode1 = await BfNodeInMemory.__DANGEROUS__createUnattached(
          mockCv,
          {
            name: "Target Node 1",
          },
        );
        const targetNode2 = await BfNodeInMemory.__DANGEROUS__createUnattached(
          mockCv,
          {
            name: "Target Node 2",
          },
        );

        // Create edges with different roles
        const edgeProps1 = { role: "source-role-1" };
        const edgeProps2 = { role: "source-role-2" };
        await BfEdgeClass.createBetweenNodes(
          mockCv,
          sourceNode,
          targetNode1,
          edgeProps1,
        );
        await BfEdgeClass.createBetweenNodes(
          mockCv,
          sourceNode,
          targetNode2,
          edgeProps2,
        );

        // Test querying source edges
        const sourceEdges = await BfEdgeClass.querySourceEdgesForNode(
          sourceNode,
        );

        assertEquals(sourceEdges.length, 2);
        assertEquals(sourceEdges[0].metadata.bfSid, sourceNode.metadata.bfGid);
        assertEquals(sourceEdges[0].metadata.bfTid, targetNode1.metadata.bfGid);
        assertEquals(sourceEdges[0].props.role, "source-role-1");
        assertEquals(sourceEdges[1].metadata.bfSid, sourceNode.metadata.bfGid);
        assertEquals(sourceEdges[1].metadata.bfTid, targetNode2.metadata.bfGid);
        assertEquals(sourceEdges[1].props.role, "source-role-2");
      },
    );

    await t.step(
      "queryTargetInstances should return target nodes connected to a source node",
      async () => {
        // Create nodes for testing
        const sourceNode1 = await BfNodeInMemory.__DANGEROUS__createUnattached(
          mockCv,
          {
            name: "Source Node 1 for Target Query",
          },
        );
        const sourceNode2 = await BfNodeInMemory.__DANGEROUS__createUnattached(
          mockCv,
          {
            name: "Source Node 2 for Target Query",
          },
        );
        const targetNode = await BfNodeInMemory.__DANGEROUS__createUnattached(
          mockCv,
          {
            name: "Target Node for Query",
          },
        );

        // Create edges with different roles
        const edgeProps1 = { role: "target-role-1" };
        const edgeProps2 = { role: "target-role-2" };
        await BfEdgeClass.createBetweenNodes(
          mockCv,
          sourceNode1,
          targetNode,
          edgeProps1,
        );
        await BfEdgeClass.createBetweenNodes(
          mockCv,
          sourceNode2,
          targetNode,
          edgeProps2,
        );

        // Test querying target instances without role filter
        const targets = await BfEdgeClass.queryTargetInstances(
          mockCv,
          BfNodeInMemory,
          sourceNode1.metadata.bfGid,
          {},
          {}, // No edge props filter
          undefined, // No cache
        );

        assertEquals(targets.length, 1);
        assertEquals(targets[0].metadata.bfGid, targetNode.metadata.bfGid);

        // Test with edge properties filter (role)
        const filteredTargets = await BfEdgeClass.queryTargetInstances(
          mockCv,
          BfNodeInMemory,
          sourceNode1.metadata.bfGid,
          {},
          { role: "target-role-1" },
          undefined, // No cache
        );

        assertEquals(filteredTargets.length, 1);
        assertEquals(
          filteredTargets[0].metadata.bfGid,
          targetNode.metadata.bfGid,
        );
      },
    );

    await t.step(
      "queryTargetEdgesForNode should return edges where a node is the target",
      async () => {
        // Create nodes for testing
        const targetNode = await BfNodeInMemory.__DANGEROUS__createUnattached(
          mockCv,
          {
            name: "Target Node for Edge Query",
          },
        );
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

        // Create edges with different roles
        const edgeProps1 = { role: "target-role-1" };
        const edgeProps2 = { role: "target-role-2" };
        await BfEdgeClass.createBetweenNodes(
          mockCv,
          sourceNode1,
          targetNode,
          edgeProps1,
        );
        await BfEdgeClass.createBetweenNodes(
          mockCv,
          sourceNode2,
          targetNode,
          edgeProps2,
        );

        // Test querying target edges
        const targetEdges = await BfEdgeClass.queryTargetEdgesForNode(
          targetNode,
          undefined, // No cache
        );

        assertEquals(targetEdges.length, 2);
        assertEquals(targetEdges[0].metadata.bfSid, sourceNode1.metadata.bfGid);
        assertEquals(targetEdges[0].metadata.bfTid, targetNode.metadata.bfGid);
        assertEquals(targetEdges[0].props.role, "target-role-1");
        assertEquals(targetEdges[1].metadata.bfSid, sourceNode2.metadata.bfGid);
        assertEquals(targetEdges[1].metadata.bfTid, targetNode.metadata.bfGid);
        assertEquals(targetEdges[1].props.role, "target-role-2");
      },
    );

    await t.step(
      "cache is used for queryTarget methods",
      async () => {
        // Create a test node
        const sourceNode = await BfNodeInMemory.__DANGEROUS__createUnattached(
          mockCv,
          {
            name: "Source Node for Cache Test",
          },
        );
        const targetNode = await BfNodeInMemory.__DANGEROUS__createUnattached(
          mockCv,
          {
            name: "Target Node for Cache Test",
          },
        );

        // Create an edge between them
        const edgeProps = { role: "cache-test-role" };
        await BfEdgeClass.createBetweenNodes(
          mockCv,
          sourceNode,
          targetNode,
          edgeProps,
        );

        // Create a cache map to use for the test
        const cache = new Map();

        // This test will fail at first because the implementations don't
        // actually use the cache yet. The test expects the cache to be populated
        // after calling these methods

        // Test cache with queryTargetInstances
        await BfEdgeClass.queryTargetInstances(
          mockCv,
          BfNodeInMemory,
          sourceNode.metadata.bfGid,
          {},
          {},
          cache,
        );

        // If cache is properly used, the target node should be cached
        assertEquals(
          cache.has(targetNode.metadata.bfGid),
          true,
          "Cache was not populated by queryTargetInstances",
        );

        // Clear the cache and test with queryTargetEdgesForNode
        cache.clear();
        await BfEdgeClass.queryTargetEdgesForNode(
          targetNode,
          cache,
        );

        // If cache is properly used, some edge should be cached
        assertEquals(
          cache.size > 0,
          true,
          "Cache was not populated by queryTargetEdgesForNode",
        );
      },
    );
  });
}
