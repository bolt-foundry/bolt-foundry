import { GraphQLEnumTypeConfig, GraphQLEnumValueConfig } from 'https://esm.sh/v135/graphql@16.8.1/index.d.ts';
import { NexusArgDef, NexusAsArgConfig } from './args.d.ts';
import { Maybe, SourceTypingDef } from './_types.d.ts';
declare type TypeScriptEnumLike = {
    [key: number]: string;
};
export interface EnumMemberInfo {
    /** The external "value" of the enum as displayed in the SDL */
    name: string;
    /** The internal representation of the enum */
    value?: string | number | object | boolean;
    /** The description to annotate the GraphQL SDL */
    description?: Maybe<string>;
    /**
     * Info about a field deprecation. Formatted as a string and provided with the deprecated directive on
     * field/enum types and as a comment on input fields.
     */
    deprecation?: Maybe<string>;
    /**
     * Custom extensions, as supported in graphql-js
     *
     * @see https://github.com/graphql/graphql-js/issues/1527
     */
    extensions?: GraphQLEnumValueConfig['extensions'];
}
export interface NexusEnumTypeConfig<TypeName extends string> {
    name: TypeName;
    /** The description to annotate the GraphQL SDL */
    description?: Maybe<string>;
    /** Source type information for this type */
    sourceType?: SourceTypingDef;
    /** All members of the enum, either as an array of strings/definition objects, as an object, or as a TypeScript enum */
    members: ReadonlyArray<string | EnumMemberInfo> | Record<string, string | number | object | boolean> | TypeScriptEnumLike;
    /**
     * Custom extensions, as supported in graphql-js
     *
     * @see https://github.com/graphql/graphql-js/issues/1527
     */
    extensions?: GraphQLEnumTypeConfig['extensions'];
    /** Adds this type as a method on the Object/Interface definition blocks */
    asNexusMethod?: string;
}
export declare class NexusEnumTypeDef<TypeName extends string> {
    readonly name: TypeName;
    protected config: NexusEnumTypeConfig<string>;
    constructor(name: TypeName, config: NexusEnumTypeConfig<string>);
    get value(): NexusEnumTypeConfig<string>;
    /**
     * Wraps the current enum as an argument, useful if you're defining the enumType inline for an individual field.
     *
     * @example
     *   args: {
     *     sort: enumType(config).asArg({ default: 'someValue' })
     *   }
     */
    asArg(cfg?: NexusAsArgConfig<TypeName>): NexusArgDef<any>;
}
export declare function enumType<TypeName extends string>(config: NexusEnumTypeConfig<TypeName>): NexusEnumTypeDef<TypeName>;
export {};
