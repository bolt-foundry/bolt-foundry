import { GraphQLTaggedNode, OperationType } from "https://esm.sh/v135/@types/relay-runtime@14.1.22/index.d.ts";
import { KeyType, KeyTypeData } from "./helpers.d.ts";
import { LoadMoreFn } from "./useLoadMoreFunction.d.ts";
import { RefetchFnDynamic } from "./useRefetchableFragmentNode.d.ts";

export interface usePaginationFragmentHookType<
    TQuery extends OperationType,
    TKey extends KeyType | null | undefined,
    TFragmentData,
> {
    data: TFragmentData;
    loadNext: LoadMoreFn<TQuery>;
    loadPrevious: LoadMoreFn<TQuery>;
    hasNext: boolean;
    hasPrevious: boolean;
    isLoadingNext: boolean;
    isLoadingPrevious: boolean;
    refetch: RefetchFnDynamic<TQuery, TKey>;
}
// eslint-disable-next-line @definitelytyped/no-unnecessary-generics
export function usePaginationFragment<TQuery extends OperationType, TKey extends KeyType>(
    fragmentInput: GraphQLTaggedNode,
    parentFragmentRef: TKey,
): usePaginationFragmentHookType<TQuery, TKey, KeyTypeData<TKey>>;
// eslint-disable-next-line @definitelytyped/no-unnecessary-generics
export function usePaginationFragment<TQuery extends OperationType, TKey extends KeyType>(
    fragmentInput: GraphQLTaggedNode,
    parentFragmentRef: TKey | null | undefined,
): usePaginationFragmentHookType<TQuery, TKey | null, KeyTypeData<TKey> | null | undefined>;
