import { GraphQLInterfaceTypeConfig } from 'graphql';
import type { FieldResolver, GetGen, InterfaceFieldsFor, ModificationType } from '../typegenTypeHelpers';
import type { ArgsRecord } from './args';
import { OutputDefinitionBlock, OutputDefinitionBuilder } from './definitionBlocks';
import { AbstractTypes, Maybe, NonNullConfig, SourceTypingDef } from './_types';
export declare type Implemented = GetGen<'interfaceNames'> | NexusInterfaceTypeDef<any>;
export interface FieldModification<TypeName extends string, FieldName extends string> {
    type?: ModificationType<TypeName, FieldName>;
    /** The description to annotate the GraphQL SDL */
    description?: Maybe<string>;
    /** The resolve method we should be resolving the field with */
    resolve?: FieldResolver<TypeName, FieldName>;
    /** You are allowed to add non-required args when modifying a field */
    args?: Maybe<ArgsRecord>;
    /**
     * Custom extensions, as supported in graphql-js
     *
     * @see https://github.com/graphql/graphql-js/issues/1527
     */
    extensions?: GraphQLInterfaceTypeConfig<any, any>['extensions'];
}
export interface FieldModificationDef<TypeName extends string, FieldName extends string> extends FieldModification<TypeName, FieldName> {
    field: FieldName;
}
export declare type NexusInterfaceTypeConfig<TypeName extends string> = {
    name: TypeName;
    definition(t: InterfaceDefinitionBlock<TypeName>): void;
    /**
     * Configures the nullability for the type, check the documentation's "Getting Started" section to learn
     * more about GraphQL Nexus's assumptions and configuration on nullability.
     */
    nonNullDefaults?: NonNullConfig;
    /** The description to annotate the GraphQL SDL */
    description?: Maybe<string>;
    /** Source type information for this type */
    sourceType?: SourceTypingDef;
    /**
     * Custom extensions, as supported in graphql-js
     *
     * @see https://github.com/graphql/graphql-js/issues/1527
     */
    extensions?: GraphQLInterfaceTypeConfig<any, any>['extensions'];
    /** Adds this type as a method on the Object/Interface definition blocks */
    asNexusMethod?: string;
} & AbstractTypes.MaybeTypeDefConfigFieldResolveType<TypeName>;
export interface InterfaceDefinitionBuilder<TypeName extends string> extends OutputDefinitionBuilder {
    addInterfaces(toAdd: Implemented[]): void;
    addModification(toAdd: FieldModificationDef<TypeName, any>): void;
}
export declare class InterfaceDefinitionBlock<TypeName extends string> extends OutputDefinitionBlock<TypeName> {
    protected typeBuilder: InterfaceDefinitionBuilder<TypeName>;
    constructor(typeBuilder: InterfaceDefinitionBuilder<TypeName>);
    /** @param interfaceName */
    implements(...interfaceName: Array<Implemented>): void;
    /** Modifies a field added via an interface */
    modify<FieldName extends Extract<InterfaceFieldsFor<TypeName>, string>>(field: FieldName, modifications: FieldModification<TypeName, FieldName>): void;
}
export declare class NexusInterfaceTypeDef<TypeName extends string> {
    readonly name: TypeName;
    protected config: NexusInterfaceTypeConfig<TypeName>;
    constructor(name: TypeName, config: NexusInterfaceTypeConfig<TypeName>);
    get value(): NexusInterfaceTypeConfig<TypeName>;
}
/**
 * [API Docs](https://nxs.li/docs/api/interface-type) | [Abstract Types
 * Guide](https://nxs.li/guides/abstract-types) | [2018 GraphQL
 * Spec](https://spec.graphql.org/June2018/#sec-Interfaces)
 *
 * Defines an Interface type.
 *
 * Interface types are one of the two abstract type in GraphQL. They let you express polymorphic fields
 * wherein the field may return a number of different object types but they all share some subset of fields.
 * Interface types in Nexus also serve as a way to share a set of fields amongst different object types.
 *
 * @example
 *   export const Media = interfaceType({
 *     name: 'Media',
 *     resolveType(source) {
 *       return 'director' in source ? 'Movie' : 'Song'
 *     },
 *     definition(t) {
 *       t.string('url')
 *     },
 *   })
 *
 *   export const Movie = objectType({
 *     name: 'Movie',
 *     definition(t) {
 *       t.implements('Media')
 *       t.string('director')
 *     },
 *   })
 *
 *   export const Song = objectType({
 *     name: 'Song',
 *     definition(t) {
 *       t.implements('Media')
 *       t.string('album')
 *     },
 *   })
 *
 *   // GraphQL SDL
 *   // -----------
 *   //
 *   // interface Media {
 *   //   url: String
 *   // }
 *   //
 *   // type Movie implements Media {
 *   //   director: String
 *   //   url: String
 *   // }
 *   //
 *   // type Song implements Media {
 *   //   album: String
 *   //   url: String
 *   // }
 *
 * @param config Specify your interface's name, its fields, and more. See each config property's jsDoc for more detail.
 */
export declare function interfaceType<TypeName extends string>(config: NexusInterfaceTypeConfig<TypeName>): NexusInterfaceTypeDef<TypeName>;
