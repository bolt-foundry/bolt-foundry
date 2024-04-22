import * as React from "https://esm.sh/v128/@types/react@18.2.38/index.d.ts";

import {
    _FragmentRefs,
    _RefType,
    CacheConfig,
    FetchPolicy,
    GraphQLTaggedNode,
    IEnvironment,
    OperationType,
    PageInfo,
    RelayContext,
    Variables,
} from "https://esm.sh/v135/@types/relay-runtime@14.1.22/index.d.ts";

export { FragmentRef, RelayPaginationProp, RelayProp, RelayRefetchProp } from "./ReactRelayTypes.d.ts";

import { MappedFragmentProps, RelayPaginationProp, RelayProp, RelayRefetchProp } from "./ReactRelayTypes.d.ts";

export {
    DataID,
    DeclarativeMutationConfig,
    Disposable,
    FetchPolicy,
    GraphQLTaggedNode,
    // RelayRuntime has two environment exports: one interface, one concrete.
    IEnvironment as Environment,
    MutationType,
    NormalizationSelector,
    OperationDescriptor,
    RangeOperation,
    ReaderSelector,
    RelayContext,
    Snapshot,
    Variables,
} from "https://esm.sh/v135/@types/relay-runtime@14.1.22/index.d.ts";

/**
 * Legacy react-relay exports.
 * Should prefer using interface defined in ./hooks.js
 */
export { ConnectionHandler } from "https://esm.sh/v135/@types/relay-runtime@14.1.22/index.d.ts";
export interface QueryRendererProps<TOperation extends OperationType> {
    environment: IEnvironment;
    query: GraphQLTaggedNode | null | undefined;
    render: (renderProps: {
        error: Error | null;
        props: TOperation["response"] | null;
        retry: (() => void) | null;
    }) => React.ReactNode;
    variables: TOperation["variables"];
}
declare class ReactRelayQueryRenderer<TOperation extends OperationType> extends React.Component<
    {
        cacheConfig?: CacheConfig | null | undefined;
        fetchPolicy?: FetchPolicy | undefined;
    } & QueryRendererProps<TOperation>
> {}
export { ReactRelayQueryRenderer as QueryRenderer };

declare class ReactRelayLocalQueryRenderer<TOperation extends OperationType> extends React.Component<
    QueryRendererProps<TOperation>
> {}
export { ReactRelayLocalQueryRenderer as LocalQueryRenderer };

export { MutationTypes } from "https://esm.sh/v135/@types/relay-runtime@14.1.22/index.d.ts";
export { RangeOperations } from "https://esm.sh/v135/@types/relay-runtime@14.1.22/index.d.ts";

export const ReactRelayContext: React.Context<RelayContext | null>;

export { applyOptimisticMutation } from "https://esm.sh/v135/@types/relay-runtime@14.1.22/index.d.ts";
export { commitLocalUpdate } from "https://esm.sh/v135/@types/relay-runtime@14.1.22/index.d.ts";
export { commitMutation } from "https://esm.sh/v135/@types/relay-runtime@14.1.22/index.d.ts";

export type ContainerProps<Props> = MappedFragmentProps<Pick<Props, Exclude<keyof Props, "relay">>>;
export type RelayProps<Props> = ContainerProps<Props>; // TODO: validate this
export type Container<Props> = React.ComponentType<
    ContainerProps<Props> & { componentRef?: ((ref: any) => void) | undefined }
>;

// TODO: validate the bellow three
export type RelayFragmentContainer<TComponent extends React.ElementType> = React.ComponentType<
    ContainerProps<React.ComponentPropsWithoutRef<TComponent>>
>;

export type RelayPaginationContainer<TComponent extends React.ElementType> = React.ComponentType<
    ContainerProps<React.ComponentPropsWithoutRef<TComponent>>
>;

export type RelayRefetchContainer<TComponent extends React.ElementType> = React.ComponentType<
    ContainerProps<React.ComponentPropsWithoutRef<TComponent>>
>;

type PropsWithoutRelay<C extends keyof React.JSX.IntrinsicElements | React.JSXElementConstructor<any>> =
    React.JSX.LibraryManagedAttributes<C, Omit<React.ComponentProps<C>, "relay">>;

export function createFragmentContainer<
    C extends React.ComponentType<React.ComponentProps<C> & { relay?: RelayProp | undefined }>,
>(Component: C, fragmentSpec: Record<string, GraphQLTaggedNode>): Container<PropsWithoutRelay<C>>;

export { fetchQuery_DEPRECATED } from "https://esm.sh/v135/@types/relay-runtime@14.1.22/index.d.ts";

export { graphql } from "https://esm.sh/v135/@types/relay-runtime@14.1.22/index.d.ts";
export { readInlineData } from "https://esm.sh/v135/@types/relay-runtime@14.1.22/index.d.ts";
export { requestSubscription } from "https://esm.sh/v135/@types/relay-runtime@14.1.22/index.d.ts";

export function createPaginationContainer<
    C extends React.ComponentType<React.ComponentProps<C> & { relay: RelayPaginationProp }>,
>(
    Component: C,
    fragmentSpec: Record<string, GraphQLTaggedNode>,
    connectionConfig: ConnectionConfig<PropsWithoutRelay<C>>,
): Container<PropsWithoutRelay<C>>;

export function createRefetchContainer<
    C extends React.ComponentType<React.ComponentProps<C> & { relay: RelayRefetchProp }>,
>(
    Component: C,
    fragmentSpec: Record<string, GraphQLTaggedNode>,
    refetchQuery: GraphQLTaggedNode,
): Container<PropsWithoutRelay<C>>;

export interface ConnectionConfig<Props = object> {
    direction?: "backward" | "forward" | undefined;
    getConnectionFromProps?: ((props: Props) => ConnectionData | null | undefined) | undefined;
    getFragmentVariables?: ((prevVars: Variables, totalCount: number) => Variables) | undefined;
    getVariables: (
        props: Props,
        paginationInfo: { count: number; cursor?: string | null | undefined },
        fragmentVariables: Variables,
    ) => Variables;
    query: GraphQLTaggedNode;
}

interface ConnectionData {
    edges?: readonly any[] | null | undefined;
    pageInfo?: Partial<PageInfo> | null | undefined;
}
