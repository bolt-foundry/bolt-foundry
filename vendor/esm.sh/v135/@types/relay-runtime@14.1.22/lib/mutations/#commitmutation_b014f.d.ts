import { PayloadError, UploadableMap } from "../network/RelayNetworkTypes.d.ts";
import { GraphQLTaggedNode } from "../query/RelayModernGraphQLTag.d.ts";
import { Environment, SelectorStoreUpdater } from "../store/RelayStoreTypes.d.ts";
import { CacheConfig, Disposable, Variables } from "../util/RelayRuntimeTypes.d.ts";
import { DeclarativeMutationConfig } from "./RelayDeclarativeMutationConfig.d.ts";

export interface MutationParameters {
    readonly response: {};
    readonly variables: {};
    readonly rawResponse?: {} | undefined;
}

export interface MutationConfig<TOperation extends MutationParameters> {
    configs?: DeclarativeMutationConfig[] | undefined;
    cacheConfig?: CacheConfig | undefined;
    mutation: GraphQLTaggedNode;
    onError?: ((error: Error) => void) | null | undefined;
    onCompleted?:
        | ((response: TOperation["response"], errors: readonly PayloadError[] | null | undefined) => void)
        | null
        | undefined;
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    onUnsubscribe?: (() => void | null | undefined) | undefined;
    /**
     * An object whose type matches the raw response type of the mutation. Make sure you decorate
     * your mutation with `@raw_response_type` if you are using this field.
     */
    optimisticResponse?: (TOperation["rawResponse"] extends {} ? TOperation["rawResponse"] : never) | undefined;
    optimisticUpdater?: SelectorStoreUpdater<TOperation["response"]> | null | undefined;
    updater?: SelectorStoreUpdater<TOperation["response"]> | null | undefined;
    uploadables?: UploadableMap | null | undefined;
    variables: TOperation["variables"];
}

/**
 * Higher-level helper function to execute a mutation against a specific
 * environment.
 */
// eslint-disable-next-line @definitelytyped/no-unnecessary-generics
export function commitMutation<TOperation extends MutationParameters = MutationParameters>(
    environment: Environment,
    config: MutationConfig<TOperation>,
): Disposable;
