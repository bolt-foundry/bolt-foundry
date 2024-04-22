import { RelayObservable } from "../network/RelayObservable.d.ts";
import { Environment } from "../store/RelayStoreTypes.d.ts";
import { CacheConfig, FetchQueryFetchPolicy, OperationType } from "../util/RelayRuntimeTypes.d.ts";
import { GraphQLTaggedNode } from "./RelayModernGraphQLTag.d.ts";

export function fetchQuery<T extends OperationType>(
    environment: Environment,
    taggedNode: GraphQLTaggedNode,
    variables: T["variables"],
    cacheConfig?: {
        networkCacheConfig?: CacheConfig | null | undefined;
        fetchPolicy?: FetchQueryFetchPolicy | null | undefined;
    } | null,
): RelayObservable<T["response"]>;
