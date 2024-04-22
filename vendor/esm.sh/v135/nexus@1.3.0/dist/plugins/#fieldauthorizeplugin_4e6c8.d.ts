import type { GraphQLResolveInfo } from 'https://esm.sh/v135/graphql@16.8.1/index.d.ts';
import type { ArgsValue, GetGen, MaybePromise, SourceValue } from '../typegenTypeHelpers.d.ts';
export declare type FieldAuthorizeResolver<TypeName extends string, FieldName extends string> = (root: SourceValue<TypeName>, args: ArgsValue<TypeName, FieldName>, context: GetGen<'context'>, info: GraphQLResolveInfo) => MaybePromise<boolean | Error>;
export interface FieldAuthorizePluginErrorConfig {
    error: Error;
    root: any;
    args: any;
    ctx: GetGen<'context'>;
    info: GraphQLResolveInfo;
}
export interface FieldAuthorizePluginConfig {
    formatError?: (authConfig: FieldAuthorizePluginErrorConfig) => Error;
}
export declare const defaultFormatError: ({ error }: FieldAuthorizePluginErrorConfig) => Error;
export declare const fieldAuthorizePlugin: (authConfig?: FieldAuthorizePluginConfig) => import("../plugin.d.ts").NexusPlugin;
