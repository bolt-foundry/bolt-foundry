import type { GraphQLField } from 'https://esm.sh/v135/graphql@16.8.1/index.d.ts';
import type { ArgsValue, GetGen, SourceValue } from '../core.d.ts';
export declare type QueryComplexityEstimatorArgs<TypeName extends string, FieldName extends string> = {
    type: SourceValue<TypeName>;
    field: GraphQLField<SourceValue<TypeName>, GetGen<'context'>, ArgsValue<TypeName, FieldName>>;
    args: ArgsValue<TypeName, FieldName>;
    childComplexity: number;
};
export declare type QueryComplexityEstimator<TypeName extends string, FieldName extends string> = (options: QueryComplexityEstimatorArgs<TypeName, FieldName>) => number | void;
export declare type QueryComplexity<TypeName extends string, FieldName extends string> = number | QueryComplexityEstimator<TypeName, FieldName>;
export declare const queryComplexityPlugin: () => import("../plugin.d.ts").NexusPlugin;
