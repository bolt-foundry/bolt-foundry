import type {
  GraphQLFieldConfig,
  GraphQLInputType,
  GraphQLOutputType,
  GraphQLResolveInfo,
} from 'https://esm.sh/v135/graphql@16.8.1/index.d.ts';
interface PluralIdentifyingRootFieldConfig {
  argName: string;
  inputType: GraphQLInputType;
  outputType: GraphQLOutputType;
  resolveSingleInput: (
    input: any,
    context: any,
    info: GraphQLResolveInfo,
  ) => unknown;
  description?: string;
}
export declare function pluralIdentifyingRootField(
  config: PluralIdentifyingRootFieldConfig,
): GraphQLFieldConfig<unknown, unknown>;
export {};
