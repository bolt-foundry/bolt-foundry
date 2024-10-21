import type { GraphQLFieldResolver, GraphQLInterfaceType, GraphQLResolveInfo, GraphQLSchema } from 'graphql';
import type { PluginBuilderLens, SchemaConfig } from './builder';
import { Maybe, NexusGraphQLFieldConfig, NexusGraphQLInterfaceTypeConfig, NexusGraphQLObjectTypeConfig, Omit } from './definitions/_types';
import type { InputDefinitionBlock, NexusOutputFieldDef, NexusInputFieldDef } from './definitions/definitionBlocks';
import type { NexusInputObjectTypeConfig } from './definitions/inputObjectType';
import type { NexusObjectTypeConfig, ObjectDefinitionBlock } from './definitions/objectType';
import type { NexusSchemaExtension } from './extensions';
import { PrintedGenTyping, PrintedGenTypingImport } from './utils';
import type { NexusFinalArgConfig } from './definitions/args';
import type { UnwrapPromise } from './typeHelpersInternal';
export { PluginBuilderLens };
export declare type CreateFieldResolverInfo<FieldExt = any, TypeExt = any> = {
    /** The internal Nexus "builder" object */
    builder: PluginBuilderLens;
    /** Info about the GraphQL Field we're decorating. Always guaranteed to exist, even for non-Nexus GraphQL types */
    fieldConfig: Omit<NexusGraphQLFieldConfig, 'resolve' | 'extensions'> & {
        extensions?: Maybe<{
            nexus?: {
                config: FieldExt;
            };
        }>;
    };
    /** The config provided to the Nexus type containing the field. Will not exist if this is a non-Nexus GraphQL type. */
    parentTypeConfig: (Omit<NexusGraphQLObjectTypeConfig, 'fields' | 'extensions'> | (Omit<NexusGraphQLInterfaceTypeConfig, 'fields' | 'extensions'> & {
        interfaces: readonly GraphQLInterfaceType[];
    })) & {
        extensions?: Maybe<{
            nexus?: {
                config: TypeExt;
            };
        }>;
    };
    /** The root-level SchemaConfig passed */
    schemaConfig: Omit<SchemaConfig, 'types'>;
    /** Nexus specific metadata provided to the schema. */
    schemaExtension: NexusSchemaExtension;
};
export declare type StringLike = PrintedGenTypingImport | PrintedGenTyping | string;
export interface PluginConfig {
    /** A name for the plugin, useful for errors, etc. */
    name: string;
    /** A description for the plugin */
    description?: Maybe<string>;
    /** Any type definitions we want to add to output field definitions */
    fieldDefTypes?: StringLike | StringLike[];
    /** Any type definitions we want to add to input field definitions */
    inputFieldDefTypes?: StringLike | StringLike[];
    /** Any type definitions we want to add to the type definition option */
    objectTypeDefTypes?: StringLike | StringLike[];
    /** Any type definitions we want to add to the input type definition option */
    inputObjectTypeDefTypes?: StringLike | StringLike[];
    /** Any type definitions we want to add to the arg definition option */
    argTypeDefTypes?: StringLike | StringLike[];
    /**
     * Executed once, just before the types are walked. Useful for defining custom extensions to the
     * "definition" builders that are needed while traversing the type definitions, as are defined by
     * `dynamicOutput{Method,Property}` / `dynamicInput{Method,Property}`
     */
    /**
     * The onInstall event occurs before type walking which means inline types are not visible at this point
     * yet. `builderLens.hasType` will only return true for types the user has defined top level in their app,
     * and any types added by upstream plugins.
     */
    onInstall?: (builder: PluginBuilderLens) => void;
    /**
     * Executed once, just after types have been walked but also before the schema definition types are
     * materialized into GraphQL types. Use this opportunity to add / modify / remove any types before we go
     * through the resolution step.
     */
    onBeforeBuild?: (builder: PluginBuilderLens) => void;
    /** After the schema is built, provided the Schema to do any final config validation. */
    onAfterBuild?: (schema: GraphQLSchema) => void;
    /** Called when the `.addField` is called internally in the builder, before constructing the field */
    onAddOutputField?: (field: NexusOutputFieldDef) => NexusOutputFieldDef | void;
    /** Called when the `.addField` is called internally in the builder, before constructing the field */
    onAddInputField?: (field: NexusInputFieldDef) => NexusInputFieldDef | void;
    /** Called just before a Nexus arg is constructed into an GraphQLArgumentConfig */
    onAddArg?: (arg: NexusFinalArgConfig) => NexusFinalArgConfig | void;
    /** Called immediately after the object is defined, allows for using metadata to define the shape of the object. */
    onObjectDefinition?: (block: ObjectDefinitionBlock<string>, objectConfig: NexusObjectTypeConfig<string>) => void;
    /**
     * Called immediately after the input object is defined, allows for using metadata to define the shape of
     * the input object
     */
    onInputObjectDefinition?: (block: InputDefinitionBlock<any>, objectConfig: NexusInputObjectTypeConfig<any>) => void;
    /**
     * If a type is not defined in the schema, our plugins can register an `onMissingType` handler, which will
     * intercept the missing type name and give us an opportunity to respond with a valid type.
     */
    onMissingType?: (missingTypeName: string, builder: PluginBuilderLens) => any;
    /**
     * Executed any time a field resolver is created. Returning a function here will add its in the stack of
     * middlewares with the (root, args, ctx, info, next) signature, where the `next` is the next middleware or
     * resolver to be executed.
     */
    onCreateFieldResolver?: (createResolverInfo: CreateFieldResolverInfo) => MiddlewareFn | undefined;
    /**
     * Executed any time a "subscribe" handler is created. Returning a function here will add its in the stack
     * of middlewares with the (root, args, ctx, info, next) signature, where the `next` is the next middleware
     * or resolver to be executed.
     */
    onCreateFieldSubscribe?: (createSubscribeInfo: CreateFieldResolverInfo) => MiddlewareFn | undefined;
}
export declare function completeValue<T, R>(valOrPromise: PromiseLike<T> | T, onSuccess: (completedVal: T) => R): R | UnwrapPromise<R> | PromiseLike<UnwrapPromise<R>> | PromiseLike<UnwrapPromise<R>>;
export declare function completeValue<T, R, E>(valOrPromise: PromiseLike<T> | T, onSuccess: (completedVal: T) => R, onError: (err: any) => R): R | UnwrapPromise<R> | PromiseLike<UnwrapPromise<R>> | PromiseLike<UnwrapPromise<R>>;
export declare type MiddlewareFn = (source: any, args: any, context: any, info: GraphQLResolveInfo, next: GraphQLFieldResolver<any, any>) => any;
/**
 * Takes a list of middlewares and executes them sequentially, passing the "next" member of the chain to
 * execute as the 5th arg.
 *
 * @param middleware
 * @param resolver
 */
export declare function composeMiddlewareFns<T>(middlewareFns: MiddlewareFn[], resolver: GraphQLFieldResolver<any, any>): GraphQLFieldResolver<any, any, any, unknown>;
/** A definition for a plugin. Should be passed to the `plugins: []` option on makeSchema */
export declare class NexusPlugin {
    readonly config: PluginConfig;
    constructor(config: PluginConfig);
}
/**
 * A plugin defines configuration which can document additional metadata options for a type definition. This
 * metadata can be used to decorate the "resolve" function to provide custom functionality, such as logging,
 * error handling, additional type validation.
 *
 * You can specify options which can be defined on the schema, the type or the plugin. The config from each of
 * these will be passed in during schema construction time, and used to augment the field as necessary.
 *
 * You can either return a function, with the new definition of a resolver implementation, or you can return
 * an "enter" / "leave" pairing which will wrap the pre-execution of the resolver and the "result" of the
 * resolver, respectively.
 */
export declare function plugin(config: PluginConfig): NexusPlugin;
export declare namespace plugin {
    var completeValue: typeof import("./plugin").completeValue;
}
export declare const createPlugin: typeof plugin;
