import { CacheConfig, FetchPolicy, GraphQLTaggedNode, OperationType, RenderPolicy, VariablesOf } from "https://esm.sh/v135/@types/relay-runtime@14.1.22/index.d.ts";

export function useLazyLoadQuery<TQuery extends OperationType>(
    gqlQuery: GraphQLTaggedNode,
    variables: VariablesOf<TQuery>,
    options?: {
        fetchKey?: string | number | undefined;
        fetchPolicy?: FetchPolicy | undefined;
        networkCacheConfig?: CacheConfig | undefined;
        UNSTABLE_renderPolicy?: RenderPolicy | undefined;
    },
): TQuery["response"];
