import { GraphQLTaggedNode, OperationType, RenderPolicy } from "https://esm.sh/v135/@types/relay-runtime@14.1.22/index.d.ts";

import { PreloadedQuery } from "./EntryPointTypes.d.ts";

export function usePreloadedQuery<TQuery extends OperationType>(
    gqlQuery: GraphQLTaggedNode,
    preloadedQuery: PreloadedQuery<TQuery>,
    options?: {
        UNSTABLE_renderPolicy?: RenderPolicy | undefined;
    },
): TQuery["response"];
