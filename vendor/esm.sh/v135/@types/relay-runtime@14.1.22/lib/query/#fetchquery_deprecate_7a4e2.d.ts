import { Environment } from "../store/RelayStoreTypes.d.ts";
import { CacheConfig, OperationType } from "../util/RelayRuntimeTypes.d.ts";
import { GraphQLTaggedNode } from "./RelayModernGraphQLTag.d.ts";

export function fetchQuery_DEPRECATED<T extends OperationType>(
    environment: Environment,
    taggedNode: GraphQLTaggedNode,
    variables: T["variables"],
    cacheConfig?: CacheConfig | null,
): Promise<T["response"]>;
