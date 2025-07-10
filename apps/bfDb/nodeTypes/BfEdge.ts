import {
  type BfEdgeMetadata,
  BfNode,
  type InferProps,
  type PropsBase,
} from "@bfmono/apps/bfDb/classes/BfNode.ts";
import type { CurrentViewer } from "@bfmono/apps/bfDb/classes/CurrentViewer.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
const logger = getLogger(import.meta);

type BfEdgeBaseProps = PropsBase & {
  role: string;
};

export class BfEdge<TProps extends BfEdgeBaseProps = BfEdgeBaseProps>
  extends BfNode<InferProps<typeof BfEdge<TProps>>> {
  static generateEdgeMetadata(
    cv: CurrentViewer,
    sourceNode: BfNode,
    targetNode: BfNode,
    metadata?: Partial<BfEdgeMetadata>,
  ): BfEdgeMetadata {
    const baseMetadata = this.generateMetadata(cv, metadata);
    // Generate the base metadata
    return {
      ...baseMetadata,
      bfSid: sourceNode.metadata.bfGid,
      bfSClassName: sourceNode.metadata.className,
      bfTid: targetNode.metadata.bfGid,
      bfTClassName: targetNode.metadata.className,
    };
  }

  static async createBetweenNodes<
    TSourceProps extends PropsBase,
    TTargetProps extends PropsBase,
    TEdgeProps extends BfEdgeBaseProps,
  >(
    cv: CurrentViewer,
    sourceNode: BfNode<TSourceProps>,
    targetNode: BfNode<TTargetProps>,
    edgeProps: TEdgeProps,
  ): Promise<InstanceType<typeof BfEdge<TEdgeProps>>> {
    logger.debug(
      `Creating edge between ${sourceNode.constructor.name}(${sourceNode.metadata.bfGid}) -> ${targetNode.constructor.name}(${targetNode.metadata.bfGid})`,
      { edgeProps },
    );

    // Generate metadata for the edge
    const metadata = this.generateEdgeMetadata(cv, sourceNode, targetNode);

    logger.debug(`Generated edge metadata:`, metadata);

    logger.debug(`Final edge props:`, edgeProps);

    // Create the edge instance
    const edgeInstance = new this(
      cv,
      edgeProps,
      metadata,
    );

    // Save the edge
    logger.debug(`Saving edge to database`);
    await edgeInstance.save();
    logger.debug(
      `Edge saved successfully with ID: ${edgeInstance.metadata.bfGid}`,
    );

    return edgeInstance;
  }

  // static async querySourceInstances<
  //   TSourceClass extends typeof BfNode<TSourceProps>,
  //   TEdgeProps extends PropsBase,
  //   TSourceProps extends PropsBase = PropsBase,
  // >(
  //   cv: CurrentViewer,
  //   SourceClass: TSourceClass,
  //   targetId: BfGid,
  //   propsToQuery: Partial<TSourceProps> = {},
  //   _edgePropsToQuery: Partial<TEdgeProps> = {},
  //   cache?: BfNodeCache<TSourceProps>,
  // ): Promise<Array<InstanceType<TSourceClass>>> {
  //   // Query edges that have this target ID
  //   const _edgeMetadata: Partial<BfEdgeMetadata> = {
  //     bfTid: targetId,
  //     className: this.name,
  //   };

  //   // Find all edges that connect to the target node with matching properties
  //   const edges = await this.query(cv, edgeMetadata, edgePropsToQuery);
  //   // const edges: Array<BfEdge> = [];

  //   if (edges.length === 0) {
  //     return [];
  //   }

  //   // Extract source IDs from the edges
  //   const sourceIds = edges.map((edge) => (edge.metadata as BfEdgeMetadata).bfSid);

  //   // Query the source nodes by their IDs
  //   return SourceClass.query(
  //     cv,
  //     { className: SourceClass.name },
  //     propsToQuery,
  //     sourceIds,
  //     cache,
  //   );
  // }

  // static querySourceEdgesForNode<TProps extends BfEdgeBaseProps>(
  //   node: BfNodeBase,
  // ): Promise<Array<InstanceType<typeof BfEdge<TProps>>>> {
  //   // Query edges where the provided node is the source
  //   const metadataToQuery: Partial<BfMetadataEdge> = {
  //     bfSid: node.metadata.bfGid,
  //     className: this.name,
  //   };

  //   return this.query(
  //     node.cv,
  //     metadataToQuery,
  //     {}, // No specific props filter
  //   ) as Promise<Array<InstanceType<typeof BfEdge<TProps>>>>;
  // }

  // static async queryTargetInstances<
  //   TTargetClass extends typeof BfNodeBase<TTargetProps>,
  //   TEdgeProps extends BfEdgeBaseProps,
  //   TTargetProps extends BfNodeBaseProps = BfNodeBaseProps,
  // >(
  //   cv: CurrentViewer,
  //   TargetClass: TTargetClass,
  //   sourceId: BfGid,
  //   propsToQuery: Partial<TTargetProps> = {},
  //   edgePropsToQuery: Partial<TEdgeProps> = {},
  //   cache?: BfNodeCache,
  // ): Promise<Array<InstanceType<TTargetClass>>> {
  //   // Query edges that have this source ID
  //   const edgeMetadata: Partial<BfMetadataEdge> = {
  //     bfSid: sourceId,
  //     className: this.name,
  //   };

  //   // Find all edges that connect from the source node with matching properties
  //   const edges = await this.query(cv, edgeMetadata, edgePropsToQuery);

  //   if (edges.length === 0) {
  //     return [];
  //   }

  //   // Extract target IDs from the edges
  //   const targetIds = edges.map((edge) => edge.metadata.bfTid);

  //   // Query the target nodes by their IDs
  //   return TargetClass.query(
  //     cv,
  //     { className: TargetClass.name },
  //     propsToQuery,
  //     targetIds,
  //     cache,
  //   );
  // }

  // static queryTargetEdgesForNode(
  //   node: BfNodeBase,
  //   cache?: BfNodeCache,
  // ): Promise<Array<InstanceType<typeof BfEdge>>> {
  //   // Query edges where the provided node is the target
  //   const metadataToQuery: Partial<BfMetadataEdge> = {
  //     bfTid: node.metadata.bfGid,
  //     className: this.name,
  //   };

  //   return this.query(
  //     node.cv,
  //     metadataToQuery,
  //     {}, // No specific props filter
  //     undefined, // No specific IDs filter
  //     cache, // Pass the cache to the query method
  //   ) as Promise<Array<InstanceType<typeof BfEdge>>>;
  // }

  constructor(
    currentViewer: CurrentViewer,
    props: TProps,
    metadata?: Partial<BfEdgeMetadata>,
  ) {
    super(currentViewer, props, metadata);
  }
}
