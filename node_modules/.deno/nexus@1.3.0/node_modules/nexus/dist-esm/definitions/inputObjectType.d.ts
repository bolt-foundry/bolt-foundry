import { GraphQLInputObjectTypeConfig } from 'graphql';
import { NexusArgDef, NexusAsArgConfig } from './args';
import type { InputDefinitionBlock } from './definitionBlocks';
import { Maybe, NonNullConfig } from './_types';
export declare type NexusInputObjectTypeConfig<TypeName extends string> = {
    /** Name of the input object type */
    name: TypeName;
    /** Definition block for the input type */
    definition(t: InputDefinitionBlock<TypeName>): void;
    /** The description to annotate the GraphQL SDL */
    description?: Maybe<string>;
    /**
     * Configures the nullability for the type, check the documentation's "Getting Started" section to learn
     * more about GraphQL Nexus's assumptions and configuration on nullability.
     */
    nonNullDefaults?: NonNullConfig;
    /**
     * Custom extensions, as supported in graphql-js
     *
     * @see https://github.com/graphql/graphql-js/issues/1527
     */
    extensions?: GraphQLInputObjectTypeConfig['extensions'];
    /** Adds this type as a method on the Object/Interface definition blocks */
    asNexusMethod?: string;
} & NexusGenPluginInputTypeConfig<TypeName>;
export declare class NexusInputObjectTypeDef<TypeName extends string> {
    readonly name: TypeName;
    protected config: NexusInputObjectTypeConfig<any>;
    constructor(name: TypeName, config: NexusInputObjectTypeConfig<any>);
    get value(): NexusInputObjectTypeConfig<any>;
    /**
     * Shorthand for wrapping the current InputObject in an "arg", useful if you need to add a description.
     *
     * @example
     *   inputObject(config).asArg({
     *     description: 'Define sort the current field',
     *   })
     */
    asArg(cfg?: NexusAsArgConfig<TypeName>): NexusArgDef<any>;
}
export declare function inputObjectType<TypeName extends string>(config: NexusInputObjectTypeConfig<TypeName>): NexusInputObjectTypeDef<TypeName>;
