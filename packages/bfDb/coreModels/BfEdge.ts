import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";
import {
  Constructor,
  CreationMetadata,
} from "packages/bfDb/classes/BfBaseModelMetadata.ts";
import {
  BfGid,
  BfSid,
  BfTid,
} from "packages/bfDb/classes/BfBaseModelIdTypes.ts";
import { ConnectionArguments } from "packages/graphql/deps.ts";
import { BfModel } from "packages/bfDb/classes/BfModel.ts";
import { bfGetItemsByBfGid } from "packages/bfDb/bfDb.ts";
import type { ConnectionInterface } from "react-relay";
import { BfCurrentViewer } from "packages/bfDb/classes/BfCurrentViewer.ts";
import { getLogger } from "deps.ts";

const logger = getLogger(import.meta);
export type BfEdgeRequiredProps = Record<string, never>;

export type BfEdgeOptionalProps = {
  action?: string;
};

export type EdgeCreationMetadata = {
  bfTClassName: string;
  bfTid: BfTid | BfGid;
  bfSClassName: string;
  bfSid: BfSid | BfGid;
} & CreationMetadata;

export class BfEdge<
  ChildRequiredProps extends BfEdgeRequiredProps = BfEdgeRequiredProps,
  ChildOptionalProps extends BfEdgeOptionalProps = Record<string, unknown>,
> extends BfNode<
  ChildRequiredProps,
  ChildOptionalProps,
  EdgeCreationMetadata
> {
  __typename = "BfEdge";

  /**
   * Creates a new edge between two nodes.
   * The method establishes a connection between a source node and a target node.
   *
   * @param {BfCurrentViewer} currentViewer - The current viewer context.
   * @param {BfNode} sourceNode - The source node from which the edge originates.
   * @param {BfNode} targetNode - The target node to which the edge points.
   * @returns {Promise<BfEdge>} A promise that resolves to the newly created edge.
   *
   * @example
   * const sourceNode = await BfNode.create(currentViewer, {name: "Source Node"});
   * const targetNode = await BfNode.create(currentViewer, {name: "Target Node"});
   * const edge = await BfEdge.createEdgeBetweenNodes(currentViewer, sourceNode, targetNode);
   */
  static async createEdgeBetweenNodes(
    currentViewer: BfCurrentViewer,
    sourceNode: BfNode,
    targetNode: BfNode,
  ): Promise<BfEdge> {
    const metadata = {
      bfTClassName: targetNode.constructor.name,
      bfTid: targetNode.metadata.bfGid,
      bfSClassName: sourceNode.constructor.name,
      bfSid: sourceNode.metadata.bfGid,
    } as EdgeCreationMetadata;

    const newEdge = await BfEdge.create(currentViewer, {}, metadata);
    return newEdge;
  }

  /**
   * Queries all edge connections from a source node to target nodes.
   * The method retrieves the connections between a source node and all its target nodes.
   *
   * @param {BfCurrentViewer} currentViewer - The current viewer context.
   * @param {typeof BfNode} TargetClass - The class of the target nodes.
   * @param {BfGid | BfSid} sourceBfGid - The global or session ID of the source node.
   * @param {Partial<TRequiredProps & TOptionalProps>} [propsToQuery={}] - The properties to query.
   * @param {ConnectionArguments} connectionArgs - The GraphQL connection arguments.
   * @returns {Promise<ConnectionInterface<InstanceType<TThis> & EdgeCreationMetadata> & { count: number }>} A promise that resolves to the connection object and count.
   *
   * @example
   * const connection = await BfEdge.queryTargetsConnectionForGraphQL(currentViewer, TargetNode, sourceNodeGid, {}, connectionArgs);
   */
  static async queryTargetsConnectionForGraphQL<
    TThis extends Constructor<
      BfModel<TRequiredProps, TOptionalProps, TCreationMetadata>
    >,
    TRequiredProps,
    TOptionalProps,
    TCreationMetadata extends CreationMetadata,
  >(
    this: TThis,
    currentViewer: BfCurrentViewer,
    TargetClass: typeof BfNode,
    sourceBfGid: BfGid | BfSid,
    propsToQuery: Partial<TRequiredProps & TOptionalProps> = {},
    connectionArgs: ConnectionArguments,
  ): Promise<
    ConnectionInterface<
      InstanceType<TThis> & EdgeCreationMetadata
    > & { count: number }
  > {
    logger.debug("queryTargetsConnectionForGraphQL", TargetClass, sourceBfGid);
    // @ts-expect-error done is better than good™
    const connection = await this.queryConnectionForGraphQL(
      currentViewer,
      { bfSid: sourceBfGid, bfTClassName: TargetClass.name },
      propsToQuery,
      connectionArgs,
    );
    logger.debug("connection", connection);
    const targetEdgeIds = connection.edges.map((
      edge: { node: { id: string } },
    ) => edge.node.id);
    logger.debug("targetEdgeIds", targetEdgeIds);
    const targetEdges = await bfGetItemsByBfGid(targetEdgeIds);
    const targetIds = targetEdges.map((edge) => edge.metadata.bfTid).filter(
      Boolean,
    );
    logger.debug("targetIds", targetIds);
    const targetConnection = await TargetClass.queryConnectionForGraphQL(
      currentViewer,
      {},
      {},
      connectionArgs,
      // @ts-expect-error typescript is mistakenly keeping undefineds.
      targetIds,
    );
    logger.debug("targetConnection", targetConnection);
    return targetConnection;
  }

  static async querySources<
    TThis extends Constructor<
      BfModel<TRequiredProps, TOptionalProps, TCreationMetadata>
    >,
    TRequiredProps,
    TOptionalProps,
    TCreationMetadata extends CreationMetadata,
  >(
    this: TThis,
    currentViewer: BfCurrentViewer,
    SourceClass: Constructor<BfNode>,
    targetBfGid: BfGid | BfTid,
    propsToQuery: Partial<TRequiredProps & TOptionalProps> = {},
  ) {
    logger.debug("querySources", SourceClass, targetBfGid);
    const sourceEdges = await (this as unknown as typeof BfNode).query(
      currentViewer,
      { bfTid: targetBfGid, bfSClassName: SourceClass.name },
    );
    logger.debug("sourceEdges", sourceEdges);
    const sourceEdgeIds = sourceEdges.map((edge: BfNode) => edge.metadata.bfSid)
      .filter(Boolean) as Array<BfSid>;
    logger.debug("sourceEdgeIds", sourceEdgeIds);
    const sources = await SourceClass.query(
      currentViewer,
      {},
      propsToQuery,
      sourceEdgeIds,
    );
    logger.debug("sources", sources);
    return sources;
  }

  static async queryAllSourceEdgesForNode(bfNode: BfNode) {
    logger.debug("queryAllSources");
    const sources = await (this as typeof BfEdge).query(
      bfNode.currentViewer,
      { bfTClassName: bfNode.constructor.name, bfTid: bfNode.metadata.bfGid },
    );
    logger.debug("sources", sources);
    return sources;
  }

  static async queryTargets<
    TThis extends Constructor<
      BfModel<TRequiredProps, TOptionalProps, TCreationMetadata>
    >,
    TRequiredProps,
    TOptionalProps,
    TCreationMetadata extends CreationMetadata,
  >(
    this: TThis,
    currentViewer: BfCurrentViewer,
    TargetClass: typeof BfNode,
    sourceBfGid: BfGid | BfSid,
    propsToQuery: Partial<TRequiredProps & TOptionalProps> = {},
  ) {
    logger.debug("queryTargets", TargetClass, sourceBfGid);
    // @ts-expect-error done is better than good™
    const targetEdges = await this.query(
      currentViewer,
      { bfSid: sourceBfGid, bfTClassName: TargetClass.name },
      propsToQuery,
    );
    logger.debug("targetEdges", targetEdges);
    const targetEdgeIds = targetEdges.map((edge: BfNode) => edge.metadata.bfTid)
      .filter(Boolean);
    logger.debug("targetEdgeIds", targetEdgeIds);
    const targets = await TargetClass.query(
      currentViewer,
      {},
      propsToQuery,
      targetEdgeIds,
    );
    logger.debug("targets", targets);
    return targets;
  }
}
