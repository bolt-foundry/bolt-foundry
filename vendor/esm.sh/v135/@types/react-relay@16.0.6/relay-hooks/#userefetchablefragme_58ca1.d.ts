import { GraphQLTaggedNode, OperationType } from "https://esm.sh/v135/@types/relay-runtime@14.1.22/index.d.ts";

import { KeyType, KeyTypeData } from "./helpers.d.ts";
import { RefetchFnDynamic } from "./useRefetchableFragmentNode.d.ts";

export type useRefetchableFragmentHookType<
    TQuery extends OperationType,
    TKey extends KeyType | null | undefined,
    TFragmentData,
> = [TFragmentData, RefetchFnDynamic<TQuery, TKey>];
// eslint-disable-next-line @definitelytyped/no-unnecessary-generics
export function useRefetchableFragment<TQuery extends OperationType, TKey extends KeyType>(
    fragmentInput: GraphQLTaggedNode,
    fragmentRef: TKey,
): useRefetchableFragmentHookType<TQuery, TKey, KeyTypeData<TKey>>;
// eslint-disable-next-line @definitelytyped/no-unnecessary-generics
export function useRefetchableFragment<TQuery extends OperationType, TKey extends KeyType>(
    fragmentInput: GraphQLTaggedNode,
    fragmentRef: TKey | null | undefined,
): useRefetchableFragmentHookType<TQuery, TKey, KeyTypeData<TKey> | null | undefined>;
