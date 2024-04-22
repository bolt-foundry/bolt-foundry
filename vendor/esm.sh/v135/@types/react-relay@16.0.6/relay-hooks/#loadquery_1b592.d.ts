import { GraphQLTaggedNode, IEnvironment, OperationType, PreloadableConcreteRequest, VariablesOf } from "https://esm.sh/v135/@types/relay-runtime@14.1.22/index.d.ts";
import { EnvironmentProviderOptions, LoadQueryOptions, PreloadedQuery } from "./EntryPointTypes.d.ts";

export function loadQuery<
    TQuery extends OperationType,
    TEnvironmentProviderOptions extends EnvironmentProviderOptions = {},
>(
    environment: IEnvironment,
    preloadableRequest: GraphQLTaggedNode | PreloadableConcreteRequest<TQuery>,
    variables: VariablesOf<TQuery>,
    options?: LoadQueryOptions,
    environmentProviderOptions?: TEnvironmentProviderOptions,
): PreloadedQuery<TQuery, TEnvironmentProviderOptions>;
