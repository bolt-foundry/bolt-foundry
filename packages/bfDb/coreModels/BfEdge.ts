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

  static querySourceInstances<
    TSourceClass extends typeof BfNodeBase<TSourceProps>,
    TEdgeProps extends BfEdgeBaseProps,
    TSourceProps extends BfNodeBaseProps = BfNodeBaseProps,
  >(
    _cv: BfCurrentViewer,
    _SourceClass: TSourceClass,
    _targetId: BfGid,
    _propsToQuery: Partial<TSourceProps> = {},
    _edgePropsToQuery: Partial<TEdgeProps> = {},
  ): Promise<Array<InstanceType<TSourceClass>>> {
    throw new BfErrorNotImplemented("Not implemented");
  }

  static querySourceEdgesForNode<TProps extends BfEdgeBaseProps>(
    _node: BfNodeBase,
  ): Promise<Array<InstanceType<typeof BfEdge<TProps>>>> {
    throw new BfErrorNotImplemented("Not implemented");
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
