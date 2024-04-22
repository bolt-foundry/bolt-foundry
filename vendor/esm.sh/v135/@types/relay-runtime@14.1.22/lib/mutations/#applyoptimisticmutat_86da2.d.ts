import { GraphQLTaggedNode } from "../query/RelayModernGraphQLTag.d.ts";
import { Environment, SelectorStoreUpdater } from "../store/RelayStoreTypes.d.ts";
import { Disposable, Variables } from "../util/RelayRuntimeTypes.d.ts";
import { DeclarativeMutationConfig } from "./RelayDeclarativeMutationConfig.d.ts";

export interface OptimisticMutationConfig {
    configs?: readonly DeclarativeMutationConfig[] | null | undefined;
    mutation: GraphQLTaggedNode;
    variables: Variables;
    optimisticUpdater?: SelectorStoreUpdater | null | undefined;
    optimisticResponse?: object | undefined;
}

/**
 * Higher-level helper function to execute a mutation against a specific
 * environment.
 */
export function applyOptimisticMutation(environment: Environment, config: OptimisticMutationConfig): Disposable;
