import type { GraphQLResolveInfo } from 'graphql';
import type { ArgsValue, GetGen, MaybePromise, SourceValue } from '../typegenTypeHelpers';
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
export declare const fieldAuthorizePlugin: (authConfig?: FieldAuthorizePluginConfig) => import("../plugin").NexusPlugin;
