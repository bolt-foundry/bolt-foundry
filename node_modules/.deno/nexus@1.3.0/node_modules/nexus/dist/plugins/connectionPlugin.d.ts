import { GraphQLFieldResolver, GraphQLResolveInfo } from 'graphql';
import { ArgsRecord } from '../definitions/args';
import type { CommonFieldConfig, FieldOutConfig } from '../definitions/definitionBlocks';
import { NexusNonNullDef } from '../definitions/nonNull';
import { NexusNullDef } from '../definitions/nullable';
import { ObjectDefinitionBlock } from '../definitions/objectType';
import { AllNexusNamedOutputTypeDefs } from '../definitions/wrapping';
import type { NonNullConfig } from '../definitions/_types';
import type { ArgsValue, FieldTypeName, GetGen, MaybePromise, MaybePromiseDeep, ResultValue, SourceValue } from '../typegenTypeHelpers';
export interface ConnectionPluginConfig {
    /**
     * The method name in the objectType definition block
     *
     * @default 'connectionField'
     */
    nexusFieldName?: string;
    /**
     * Whether to expose the "nodes" directly on the connection for convenience.
     *
     * @default false
     */
    includeNodesField?: boolean;
    /**
     * Any args to include by default on all connection fields, in addition to the ones in the spec.
     *
     * @default null
     */
    additionalArgs?: ArgsRecord;
    /**
     * Set to true to disable forward pagination.
     *
     * @default false
     */
    disableForwardPagination?: boolean;
    /**
     * Set to true to disable backward pagination.
     *
     * @default false
     */
    disableBackwardPagination?: boolean;
    /**
     * Custom logic to validate the arguments.
     *
     * Defaults to requiring that either a `first` or `last` is provided, and that after / before must be paired
     * with `first` or `last`, respectively.
     */
    validateArgs?: (args: Record<string, any>, info: GraphQLResolveInfo, root: unknown, ctx: unknown) => void;
    /**
     * If disableForwardPagination or disableBackwardPagination are set to true, we require the `first` or
     * `last` field as needed. Defaults to true, setting this to false will disable this behavior and make the
     * field nullable.
     */
    strictArgs?: boolean;
    /**
     * Default approach we use to transform a node into an unencoded cursor.
     *
     * Default is `cursor:${index}`
     *
     * @default field
     */
    cursorFromNode?: (node: any, args: PaginationArgs, ctx: GetGen<'context'>, info: GraphQLResolveInfo, forCursor: {
        index: number;
        nodes: any[];
    }) => string | Promise<string>;
    /**
     * Override the default behavior of determining hasNextPage / hasPreviousPage. Usually needed when
     * customizing the behavior of `cursorFromNode`
     */
    pageInfoFromNodes?: (allNodes: any[], args: PaginationArgs, ctx: GetGen<'context'>, info: GraphQLResolveInfo) => MaybePromise<{
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    }>;
    /** Conversion from a cursor string into an opaque token. Defaults to base64Encode(string) */
    encodeCursor?: (value: string) => string;
    /** Conversion from an opaque token into a cursor string. Defaults to base64Decode(string) */
    decodeCursor?: (cursor: string) => string;
    /** Extend *all* edges to include additional fields, beyond cursor and node */
    extendEdge?: Record<string, Omit<FieldOutConfig<any, any>, 'resolve'> & {
        /**
         * Set requireResolver to false if you have already resolved this information during the resolve of the
         * edges in the parent resolve method
         *
         * @default true
         */
        requireResolver?: boolean;
    }>;
    /**
     * Any additional fields to make available to the connection type, beyond edges / pageInfo / nodes.
     *
     * Any fields defined extended on the Connection type will automatically receive the args from the
     * connection. If the field also defines args, they will be merged with the args of the connection, with the
     * extension's field args taking precedence if there is a conflict.
     */
    extendConnection?: Record<string, Omit<FieldOutConfig<any, any>, 'resolve'> & {
        /**
         * Set requireResolver to false if you have already resolved this information during the resolve of the
         * edges in the parent resolve method
         *
         * @default true
         */
        requireResolver?: boolean;
    }>;
    /** Allows specifying a custom name for connection types. */
    getConnectionName?(filedName: string, parentTypeName: string): string;
    /** Allows specifying a custom name for edge types. */
    getEdgeName?(filedName: string, parentTypeName: string): string;
    /** Prefix for the Connection / Edge type */
    typePrefix?: string;
    /**
     * The path to the nexus package for typegen.
     *
     * This setting is only necessary when nexus is being wrapped by another library/framework such that `nexus`
     * is not expected to be a direct dependency at the application level.
     *
     * @default 'nexus'
     */
    nexusSchemaImportId?: string;
    /**
     * Configures the default "nonNullDefaults" settings for any connection types created globally by this
     * config / connection field.
     */
    nonNullDefaults?: NonNullConfig;
    /** Allows specifying a custom cursor type, as the name of a scalar */
    cursorType?: GetGen<'scalarNames'> | NexusNullDef<GetGen<'scalarNames'>> | NexusNonNullDef<GetGen<'scalarNames'>>;
}
export declare type NodeValue<TypeName extends string = any, FieldName extends string = any> = SourceValue<EdgeTypeLookup<TypeName, FieldName>>['node'];
export declare type ConnectionFieldConfig<TypeName extends string = any, FieldName extends string = any> = {
    type: GetGen<'allOutputTypes', string> | AllNexusNamedOutputTypeDefs;
    /**
     * Whether the connection field can be null
     *
     * @default (depends on whether nullability is configured in type or schema)
     */
    nullable?: boolean;
    /**
     * Additional args to include for just this field
     *
     * @example
     *   additionalArgs: {
     *     orderBy: arg({ type: nonNull(SortOrderEnum) })
     *   }
     */
    additionalArgs?: ArgsRecord;
    /**
     * Whether to inherit "additional args" if they exist on the plugin definition
     *
     * @default false
     */
    inheritAdditionalArgs?: boolean;
    /**
     * Approach we use to transform a node into a cursor.
     *
     * @default nodeField
     */
    cursorFromNode?: (node: NodeValue<TypeName, FieldName>, args: ArgsValue<TypeName, FieldName>, ctx: GetGen<'context'>, info: GraphQLResolveInfo, forCursor: {
        index: number;
        nodes: NodeValue<TypeName, FieldName>[];
    }) => string | Promise<string>;
    /**
     * Override the default behavior of determining hasNextPage / hasPreviousPage. Usually needed when
     * customizing the behavior of `cursorFromNode`
     */
    pageInfoFromNodes?: (nodes: NodeValue<TypeName, FieldName>[], args: ArgsValue<TypeName, FieldName>, ctx: GetGen<'context'>, info: GraphQLResolveInfo) => MaybePromise<{
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    }>;
    /**
     * Whether the field allows for backward pagination
     *
     * @see https://relay.dev/graphql/connections.htm#sec-Backward-pagination-arguments
     */
    disableForwardPagination?: boolean;
    /**
     * Whether the field allows for backward pagination
     *
     * @see https://relay.dev/graphql/connections.htm#sec-Forward-pagination-arguments
     */
    disableBackwardPagination?: boolean;
    /**
     * If disableForwardPagination or disableBackwardPagination are set to true, we require the `first` or
     * `last` field as needed. Defaults to true, setting this to false will disable this behavior and make the
     * field nullable.
     */
    strictArgs?: boolean;
    /**
     * Custom logic to validate the arguments.
     *
     * Defaults to requiring that either a `first` or `last` is provided, and that after / before must be paired
     * with `first` or `last`, respectively.
     */
    validateArgs?: (args: ArgsValue<TypeName, FieldName>, info: GraphQLResolveInfo, root: SourceValue<TypeName>, ctx: GetGen<'context'>) => void;
    /**
     * Dynamically adds additional fields to the current "connection" when it is defined. This will cause the
     * resulting type to be prefix'ed with the name of the type/field it is branched off of, so as not to
     * conflict with any non-extended connections.
     */
    extendConnection?: (def: ObjectDefinitionBlock<FieldTypeName<TypeName, FieldName>>) => void;
    /**
     * Dynamically adds additional fields to the connection "edge" when it is defined. This will cause the
     * resulting type to be prefix'ed with the name of the type/field it is branched off of, so as not to
     * conflict with any non-extended connections.
     */
    extendEdge?: (def: ObjectDefinitionBlock<FieldTypeName<FieldTypeName<TypeName, FieldName>, 'edges'>>) => void;
    /** Allows specifying a custom name for connection types. */
    getConnectionName?(filedName: string, parentTypeName: string): string;
    /** Allows specifying a custom name for edge types. */
    getEdgeName?(filedName: string, parentTypeName: string): string;
    /** Configures the default "nonNullDefaults" for connection type generated for this connection */
    nonNullDefaults?: NonNullConfig;
    /**
     * Allows specifying a custom cursor type, as the name of a scalar
     *
     * @example
     *   cursorType: 'CustomString'
     */
    cursorType?: GetGen<'scalarNames'> | NexusNullDef<GetGen<'scalarNames'>> | NexusNonNullDef<GetGen<'scalarNames'>>;
    /**
     * Defined automatically if you have extended the connectionPlugin globally
     *
     * If you wish to set "requireResolver" to false on the edge field definition in the connection plugin
     */
    edgeFields?: unknown;
} & ({
    /**
     * Nodes should resolve to an Array, with a length of one greater than the direction you are paginating.
     *
     * For example, if you're paginating forward, and assuming an Array with length 20:
     *
     * (first: 2) - [{id: 1}, {id: 2}, {id: 3}] - note: {id: 3} is extra
     *
     * (last: 2) - [{id: 18}, {id: 19}, {id: 20}] - note {id: 18} is extra
     *
     * We will then slice the array in the direction we're iterating, and if there are more than "N"
     * results, we will assume there's a next page. If you set `assumeExactNodeCount: true` in the config,
     * we will assume that a next page exists if the length >= the node count.
     */
    nodes: (root: SourceValue<TypeName>, args: ArgsValue<TypeName, FieldName>, ctx: GetGen<'context'>, info: GraphQLResolveInfo) => MaybePromise<Array<NodeValue<TypeName, FieldName>>>;
    resolve?: never;
} | {
    /**
     * Implement the full resolve, including `edges` and `pageInfo`. Useful in more complex pagination
     * cases, or if you want to use utilities from other libraries like GraphQL Relay JS, and only use Nexus
     * for the construction and type-safety:
     *
     * Https://github.com/graphql/graphql-relay-js
     */
    resolve: (root: SourceValue<TypeName>, args: ArgsValue<TypeName, FieldName>, ctx: GetGen<'context'>, info: GraphQLResolveInfo) => MaybePromise<ResultValue<TypeName, FieldName>> | MaybePromiseDeep<ResultValue<TypeName, FieldName>>;
    nodes?: never;
}) & Pick<CommonFieldConfig, 'deprecation' | 'description'> & NexusGenPluginFieldConfig<TypeName, FieldName>;
export declare const ForwardPaginateArgs: {
    first: NexusNullDef<any>;
    after: NexusNullDef<any>;
};
export declare const ForwardOnlyStrictArgs: {
    first: NexusNonNullDef<any>;
    after: NexusNullDef<any>;
};
export declare const BackwardPaginateArgs: {
    last: NexusNullDef<any>;
    before: NexusNullDef<any>;
};
export declare const BackwardOnlyStrictArgs: {
    last: NexusNonNullDef<any>;
    before: NexusNullDef<any>;
};
declare function base64Encode(str: string): string;
declare function base64Decode(str: string): string;
export declare type EdgeTypeLookup<TypeName extends string, FieldName extends string> = FieldTypeName<FieldTypeName<TypeName, FieldName>, 'edges'>;
export declare type EdgeFieldResolver<TypeName extends string, FieldName extends string, EdgeField extends string> = (root: SourceValue<EdgeTypeLookup<TypeName, FieldName>>, args: ArgsValue<TypeName, FieldName> & ArgsValue<EdgeTypeLookup<TypeName, FieldName>, EdgeField>, context: GetGen<'context'>, info: GraphQLResolveInfo) => MaybePromise<ResultValue<EdgeTypeLookup<TypeName, FieldName>, EdgeField>>;
export declare type ConnectionFieldResolver<TypeName extends string, FieldName extends string, ConnectionFieldName extends string> = (root: SourceValue<TypeName>, args: ArgsValue<FieldTypeName<TypeName, FieldName>, ConnectionFieldName>, context: GetGen<'context'>, info: GraphQLResolveInfo) => MaybePromise<ResultValue<FieldTypeName<TypeName, FieldName>, ConnectionFieldName>>;
export declare type ConnectionNodesResolver<TypeName extends string, FieldName extends string> = (root: SourceValue<TypeName>, args: ArgsValue<TypeName, FieldName>, context: GetGen<'context'>, info: GraphQLResolveInfo) => MaybePromise<Array<NodeValue<TypeName, FieldName>>>;
export declare type PageInfoFieldResolver<TypeName extends string, FieldName extends string, EdgeField extends string> = (root: SourceValue<TypeName>, args: ArgsValue<TypeName, FieldName>, context: GetGen<'context'>, info: GraphQLResolveInfo) => MaybePromise<ResultValue<TypeName, FieldName>['pageInfo'][EdgeField]>;
export declare type EdgeLike = {
    cursor: string | PromiseLike<string>;
    node: any;
};
export declare const connectionPlugin: {
    (connectionPluginConfig?: ConnectionPluginConfig | undefined): import("../plugin").NexusPlugin;
    defaultCursorFromNode: typeof defaultCursorFromNode;
    defaultValidateArgs: typeof defaultValidateArgs;
    defaultHasPreviousPage: typeof defaultHasPreviousPage;
    defaultHasNextPage: typeof defaultHasNextPage;
    base64Encode: typeof base64Encode;
    base64Decode: typeof base64Decode;
    CURSOR_PREFIX: string;
};
export declare function makeResolveFn(pluginConfig: ConnectionPluginConfig, fieldConfig: ConnectionFieldConfig): GraphQLFieldResolver<any, any, any>;
export declare type PaginationArgs = {
    first?: number | null;
    after?: string | null;
    last?: number | null;
    before?: string | null;
};
declare function defaultHasNextPage(nodes: any[], args: PaginationArgs): boolean;
/** A sensible default for determining "previous page". */
declare function defaultHasPreviousPage(nodes: any[], args: PaginationArgs): boolean;
declare function defaultCursorFromNode(node: any, args: PaginationArgs, ctx: any, info: GraphQLResolveInfo, { index, nodes }: {
    index: number;
    nodes: any[];
}): string;
declare function defaultValidateArgs(args: Record<string, any> | undefined, info: GraphQLResolveInfo): void;
export {};
