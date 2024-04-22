import {
    DisposeFn,
    GraphQLTaggedNode,
    IEnvironment,
    OperationType,
    PreloadableConcreteRequest,
    VariablesOf,
} from "https://esm.sh/v135/@types/relay-runtime@14.1.22/index.d.ts";
import { LoadQueryOptions, PreloadedQuery } from "./EntryPointTypes.d.ts";

export type useQueryLoaderHookType<TQuery extends OperationType> = [
    PreloadedQuery<TQuery> | null | undefined,
    (variables: VariablesOf<TQuery>, options?: UseQueryLoaderLoadQueryOptions) => void,
    DisposeFn,
];

export type UseQueryLoaderLoadQueryOptions =
    & LoadQueryOptions
    & Readonly<{
        __environment?: IEnvironment | null | undefined;
    }>;

export function useQueryLoader<TQuery extends OperationType>(
    preloadableRequest: GraphQLTaggedNode | PreloadableConcreteRequest<TQuery>,
    initialQueryReference?: PreloadedQuery<TQuery> | null,
): useQueryLoaderHookType<TQuery>;
