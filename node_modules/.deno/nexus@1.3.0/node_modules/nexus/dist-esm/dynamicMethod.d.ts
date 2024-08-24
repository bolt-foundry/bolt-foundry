import type { PluginBuilderLens } from './builder';
import type { InputDefinitionBlock, OutputDefinitionBlock } from './definitions/definitionBlocks';
import type { NexusWrapKind } from './definitions/wrapping';
export declare type OutputFactoryConfig<T> = {
    /** The name of the type this field is being declared on */
    typeName: string;
    stage: 'walk' | 'build';
    args: any[];
    builder: PluginBuilderLens;
    typeDef: OutputDefinitionBlock<any>;
    /** The list of chained wrapping calls leading up to this dynamic method */
    wrapping?: NexusWrapKind[];
};
export declare type InputFactoryConfig<T> = {
    args: any[];
    builder: PluginBuilderLens;
    typeDef: InputDefinitionBlock<any>;
    /** The name of the type this field is being declared on */
    typeName: string;
    /** The list of chained wrapping calls leading up to this dynamic method */
    wrapping?: NexusWrapKind[];
};
export interface BaseExtensionConfig<T extends string> {
    /** The name of the "extension", the field made available on the builders */
    name: T;
    /** The full type definition for the options, including generic signature for the type */
    typeDefinition?: string;
    /** Description inserted above the typeDefinition for the field, will be formatted as JSDOC by Nexus */
    typeDescription?: string;
}
export interface DynamicOutputMethodConfig<T extends string> extends BaseExtensionConfig<T> {
    /** Invoked when the field is called */
    factory(config: OutputFactoryConfig<T>): any;
}
export interface DynamicInputMethodConfig<T extends string> extends BaseExtensionConfig<T> {
    /** Invoked when the field is called */
    factory(config: InputFactoryConfig<T>): any;
}
export declare class DynamicInputMethodDef<Name extends string> {
    readonly name: Name;
    protected config: DynamicInputMethodConfig<Name>;
    constructor(name: Name, config: DynamicInputMethodConfig<Name>);
    get value(): DynamicInputMethodConfig<Name>;
}
export declare class DynamicOutputMethodDef<Name extends string> {
    readonly name: Name;
    protected config: DynamicOutputMethodConfig<Name>;
    constructor(name: Name, config: DynamicOutputMethodConfig<Name>);
    get value(): DynamicOutputMethodConfig<Name>;
}
/**
 * Defines a new property on the object definition block for an output type, taking arbitrary input to define
 * additional types. See the connectionPlugin:
 *
 * T.connectionField('posts', { nullable: true, totalCount(root, args, ctx, info) { return
 * ctx.user.getTotalPostCount(root.id, args) }, nodes(root, args, ctx, info) { return
 * ctx.user.getPosts(root.id, args) } })
 */
export declare function dynamicOutputMethod<T extends string>(config: DynamicOutputMethodConfig<T>): DynamicOutputMethodDef<T>;
/** Same as the outputFieldExtension, but for fields that should be added on as input types. */
export declare function dynamicInputMethod<T extends string>(config: DynamicInputMethodConfig<T>): DynamicInputMethodDef<T>;
