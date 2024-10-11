import type { BfNode } from "packages/bfDb/coreModels/BfNode.ts";
import type {
  Constructor,
  CreationMetadata,
} from "packages/bfDb/classes/BfBaseModelMetadata.ts";
import type {
  BfGid,
  BfSid,
  BfTid,
} from "packages/bfDb/classes/BfBaseModelIdTypes.ts";
import type { ConnectionArguments } from "packages/graphql/deps.ts";
import { BfModel } from "packages/bfDb/classes/BfModel.ts";
import {
  bfGetItemsByBfGid,
  bfQueryItemsForGraphQLConnection,
  bfQueryItemsUnified,
} from "packages/bfDb/bfDb.ts";
import type { ConnectionInterface } from "relay";
import type { BfCurrentViewer } from "packages/bfDb/classes/BfCurrentViewer.ts";
import { getLogger } from "deps.ts";

const logger = getLogger(import.meta);
export type BfEdgeRequiredProps = Record<string, never>;

export type BfEdgeOptionalProps = {
  role?: string;
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
> extends BfModel<
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
  static async createBetweenNodes(
    currentViewer: BfCurrentViewer,
    sourceNode: BfNode,
    targetNode: BfNode,
    role?: string,
  ): Promise<BfEdge> {
    const metadata = {
      bfSClassName: sourceNode.constructor.name,
      bfSid: sourceNode.metadata.bfGid,
      bfTClassName: targetNode.constructor.name,
      bfTid: targetNode.metadata.bfGid,
    } as EdgeCreationMetadata;

    const newEdge = await BfEdge.__DANGEROUS__createUnattached(currentViewer, {
      role,
    }, metadata);
    await Promise.all([sourceNode.touch(), targetNode.touch()]);
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
    // an actual good use of any.
    // deno-lint-ignore no-explicit-any
    TTargetClass extends abstract new (...args: any) => any,
    TThis extends Constructor<BfEdge>,
    TRequiredProps,
    TOptionalProps,
  >(
    this: TThis,
    currentViewer: BfCurrentViewer,
    TargetClass: TTargetClass,
    sourceBfGid: BfGid | BfSid,
    propsToQuery: Partial<TRequiredProps & TOptionalProps> = {},
    connectionArgs: ConnectionArguments,
    edgePropsToQuery?: Partial<BfEdgeOptionalProps>,
  ): Promise<
    ConnectionInterface<
      InstanceType<TThis> & EdgeCreationMetadata
    > & { count: number }
  > {
    const edgeMetadataForQuery = {
      bfTClassName: TargetClass.name,
      bfSid: sourceBfGid,
      bfOid: currentViewer.organizationBfGid,
      className: this.name,
    };
    logger.info("edgePropsToQuery", edgePropsToQuery);
    const connection = await bfQueryItemsForGraphQLConnection(
      edgeMetadataForQuery,
      edgePropsToQuery,
      connectionArgs,
      [],
    );

    if (connection.edges.length === 0) {
      return connection;
    }
    const targetEdgeIds = connection.edges.map((
      edge: { node: { id: string } },
    ) => edge.node.id);
    logger.debug("targetEdgeIds", targetEdgeIds);
    const targetEdges = await bfGetItemsByBfGid(targetEdgeIds);
    const targetIds = targetEdges.map((edge) => edge.metadata.bfTid).filter(
      Boolean,
    ) as Array<BfTid>;
    logger.debug("targetIds", targetIds);
    const count = await bfQueryItemsUnified(
      { className: TargetClass.name },
      propsToQuery,
      targetIds,
      undefined,
      undefined,
      {
        countOnly: true,
      },
    );
    const TargetClassAsBfNode = TargetClass as unknown as typeof BfNode;
    const targetConnection = await TargetClassAsBfNode
      .queryConnectionForGraphQL(
        currentViewer,
        {},
        propsToQuery,
        connectionArgs,
        targetIds,
      );
    logger.debug("targetConnection", targetConnection);
    return { ...targetConnection, count };
  }

  static async querySourceInstances<
    // an actual good use of any.
    // deno-lint-ignore no-explicit-any
    TSourceClass extends abstract new (...args: any) => any,
    TThis extends Constructor<BfEdge>,
    TRequiredProps,
    TOptionalProps,
  >(
    this: TThis,
    currentViewer: BfCurrentViewer,
    SourceClassRaw: TSourceClass,
    targetBfGid: BfGid | BfTid,
    propsToQuery: Partial<TRequiredProps & TOptionalProps> = {},
  ) {
    const SourceClass = SourceClassRaw as unknown as typeof BfNode;
    const This = this as unknown as typeof BfEdge;
    logger.debug("querySources", SourceClass, targetBfGid);
    const sourceEdges = await This.query(
      currentViewer,
      { bfTid: targetBfGid, bfSClassName: SourceClass.name },
    );
    logger.debug("sourceEdges", sourceEdges);
    const sourceEdgeIds = sourceEdges.map((edge) => edge.metadata.bfSid)
      .filter(Boolean) as Array<BfSid>;
    logger.debug("sourceEdgeIds", sourceEdgeIds);
    if (sourceEdgeIds.length === 0) {
      return [];
    }
    const sources = await SourceClass.query(
      currentViewer,
      {},
      propsToQuery,
      sourceEdgeIds,
    );
    logger.debug("sources", sources);
    return sources as Array<InstanceType<TSourceClass>>;
  }

  static async querySourceEdgesForNode(bfNode: BfNode) {
    logger.debug("queryAllSources");
    const sources = await (this as typeof BfEdge).query(
      bfNode.currentViewer,
      { bfTClassName: bfNode.constructor.name, bfTid: bfNode.metadata.bfGid },
    );
    logger.debug("sources", sources);
    return sources;
  }

  static async queryTargetInstances<
    // an actual good use of any.
    // deno-lint-ignore no-explicit-any
    TSourceClass extends abstract new (...args: any) => any,
    TThis extends Constructor<BfEdge>,
    TRequiredProps,
    TOptionalProps,
  >(
    this: TThis,
    currentViewer: BfCurrentViewer,
    TargetClassRaw: TSourceClass,
    sourceBfGid: BfGid | BfSid,
    propsToQuery: Partial<TRequiredProps & TOptionalProps> = {},
    edgePropsToQuery: Partial<ChildOptionalProps> = {},
  ) {
    const TargetClass = TargetClassRaw as unknown as typeof BfNode;
    const This = this as unknown as typeof BfEdge;
    logger.debug("queryTargets", TargetClass, sourceBfGid);

    const targetEdges = await This.query(
      currentViewer,
      {
        bfSid: sourceBfGid,
        bfTClassName: TargetClass.name,
      },
      edgePropsToQuery,
    );
    logger.debug("targetEdges", targetEdges);
    const targetEdgeIds = targetEdges.map((edge) => edge.metadata.bfTid)
      .filter(Boolean) as Array<BfTid>;
    logger.debug("targetEdgeIds", targetEdgeIds);
    if (targetEdgeIds.length === 0) {
      return [];
    }
    const targets = await TargetClass.query(
      currentViewer,
      {},
      propsToQuery,
      targetEdgeIds,
    );
    logger.debug("targets", targets);
    return targets as Array<InstanceType<TSourceClass>>;
  }
}
