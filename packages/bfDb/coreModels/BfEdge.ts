import {
  type BfMetadataNode,
  BfNode,
} from "packages/bfDb/coreModels/BfNode.ts";
import { getLogger } from "packages/logger.ts";
import type {
  BfEdgeBaseProps,
  BfMetadataEdgeBase,
} from "packages/bfDb/classes/BfEdgeBase.ts";
import type {
  BfNodeBase,
  BfNodeBaseProps,
  BfNodeCache,
} from "packages/bfDb/classes/BfNodeBase.ts";
import type { BfCurrentViewer } from "packages/bfDb/classes/BfCurrentViewer.ts";
import { BfErrorNotImplemented } from "packages/BfError.ts";
import type { BfGid } from "packages/bfDb/classes/BfNodeIds.ts";

const _logger = getLogger(import.meta);

export type BfEdgeProps = BfEdgeBaseProps & BfNodeBaseProps;

// Combine metadata from both BfNode (for DB) and BfEdgeBase (for edge structure)
export type BfMetadataEdge = BfMetadataNode & BfMetadataEdgeBase;

export class BfEdge<TProps extends BfEdgeProps = BfEdgeProps>
  extends BfNode<TProps, BfMetadataEdge> {
  static async createBetweenNodes<TReturnType extends BfEdge>(
    cv: BfCurrentViewer,
    sourceNode: BfNodeBase,
    targetNode: BfNodeBase,
    role: string | null = null,
  ): Promise<TReturnType> {
    const metadata = {
      bfSClassName: sourceNode.constructor.name,
      bfSid: sourceNode.metadata.bfGid,
      bfTClassName: targetNode.constructor.name,
      bfTid: targetNode.metadata.bfGid,
    } as BfMetadataEdge;

    const newEdge = await this.__DANGEROUS__createUnattached(cv, {
      role,
    }, metadata);

    return newEdge as TReturnType;
  }

  static async querySourceInstances<
    TSourceClass extends typeof BfNodeBase<TSourceProps>,
    TEdgeProps extends BfEdgeBaseProps,
    TSourceProps extends BfNodeBaseProps = BfNodeBaseProps,
  >(
    cv: BfCurrentViewer,
    SourceClass: TSourceClass,
    targetId: BfGid,
    propsToQuery: Partial<TSourceProps> = {},
    edgePropsToQuery: Partial<TEdgeProps> = {},
    cache?: BfNodeCache,
  ): Promise<Array<InstanceType<TSourceClass>>> {
    // Query edges that have this target ID
    const edgeMetadata: Partial<BfMetadataEdge> = {
      bfTid: targetId,
      className: this.name,
    };

    // Find all edges that connect to the target node with matching properties
    const edges = await this.query(cv, edgeMetadata, edgePropsToQuery);

    if (edges.length === 0) {
      return [];
    }

    // Extract source IDs from the edges
    const sourceIds = edges.map((edge) => edge.metadata.bfSid);

    // Query the source nodes by their IDs
    return SourceClass.query(
      cv,
      { className: SourceClass.name },
      propsToQuery,
      sourceIds,
      cache,
    );
  }

  static querySourceEdgesForNode<TProps extends BfEdgeBaseProps>(
    node: BfNodeBase,
  ): Promise<Array<InstanceType<typeof BfEdge<TProps>>>> {
    // Query edges where the provided node is the source
    const metadataToQuery: Partial<BfMetadataEdge> = {
      bfSid: node.metadata.bfGid,
      className: this.name,
    };

    return this.query(
      node.cv,
      metadataToQuery,
      {}, // No specific props filter
    ) as Promise<Array<InstanceType<typeof BfEdge<TProps>>>>;
  }

  static queryTargetInstances<
    TTargetProps extends BfNodeBaseProps,
    TEdgeProps extends BfEdgeBaseProps,
    TTargetClass extends typeof BfNodeBase<TTargetProps>,
  >(
    _cv: BfCurrentViewer,
    _TargetClass: TTargetClass,
    _sourceId: BfGid,
    _propsToQuery: Partial<TTargetProps>,
    _edgePropsToQuery: Partial<TEdgeProps> = {},
  ): Promise<Array<InstanceType<TTargetClass>>> {
    throw new BfErrorNotImplemented("Not implemented");
  }

  static queryTargetEdgesForNode(
    _node: BfNodeBase,
  ): Promise<Array<InstanceType<typeof BfEdge>>> {
    throw new BfErrorNotImplemented("Not implemented");
  }

  constructor(
    currentViewer: BfCurrentViewer,
    props: TProps,
    metadata?: Partial<BfMetadataEdge>,
  ) {
    super(currentViewer, props, metadata);
  }
}
