import { GraphQLTaggedNode, OperationType, RenderPolicy, VariablesOf } from "https://esm.sh/v135/@types/relay-runtime@14.1.22/index.d.ts";

export function useClientQuery<TQuery extends OperationType>(
    gqlQuery: GraphQLTaggedNode,
    variables: VariablesOf<TQuery>,
    options?: {
        UNSTABLE_renderPolicy?: RenderPolicy | undefined;
    },
): TQuery["response"];
