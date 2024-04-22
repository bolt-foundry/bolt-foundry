import { DeclarativeMutationConfig } from "../mutations/RelayDeclarativeMutationConfig.d.ts";
import { GraphQLTaggedNode } from "../query/RelayModernGraphQLTag.d.ts";
import { Environment, SelectorStoreUpdater } from "../store/RelayStoreTypes.d.ts";
import { CacheConfig, Disposable, OperationType } from "../util/RelayRuntimeTypes.d.ts";

export interface GraphQLSubscriptionConfig<TSubscription extends OperationType> {
    cacheConfig?: CacheConfig | undefined;
    configs?: readonly DeclarativeMutationConfig[] | undefined;
    subscription: GraphQLTaggedNode;
    variables: TSubscription["variables"];
    onCompleted?: (() => void) | undefined;
    onError?: ((error: Error) => void) | undefined;
    onNext?: ((response: TSubscription["response"] | null | undefined) => void) | undefined;
    updater?: SelectorStoreUpdater<TSubscription["response"]> | undefined;
}

// eslint-disable-next-line @definitelytyped/no-unnecessary-generics
export function requestSubscription<TSubscription extends OperationType = OperationType>(
    environment: Environment,
    config: GraphQLSubscriptionConfig<TSubscription>,
): Disposable;
