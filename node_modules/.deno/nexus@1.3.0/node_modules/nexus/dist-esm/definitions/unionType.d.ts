import { GraphQLUnionTypeConfig } from 'graphql';
import type { GetGen } from '../typegenTypeHelpers';
import type { NexusObjectTypeDef } from './objectType';
import { AbstractTypes, Maybe, SourceTypingDef } from './_types';
export interface UnionDefinitionBuilder {
    typeName: string;
    addUnionMembers(members: UnionMembers): void;
}
export declare type UnionMembers = Array<GetGen<'objectNames'> | NexusObjectTypeDef<any>>;
export declare class UnionDefinitionBlock {
    protected typeBuilder: UnionDefinitionBuilder;
    constructor(typeBuilder: UnionDefinitionBuilder);
    /**
     * All ObjectType names that should be part of the union, either as string names or as references to the
     * `objectType()` return value
     */
    members(...unionMembers: UnionMembers): void;
}
export declare type NexusUnionTypeConfig<TypeName extends string> = {
    /** The name of the union type */
    name: TypeName;
    /** Builds the definition for the union */
    definition(t: UnionDefinitionBlock): void;
    /** The description to annotate the GraphQL SDL */
    description?: Maybe<string>;
    /**
     * Info about a field deprecation. Formatted as a string and provided with the deprecated directive on
     * field/enum types and as a comment on input fields.
     */
    deprecation?: Maybe<string>;
    /** Source type information for this type */
    sourceType?: SourceTypingDef;
    /**
     * Custom extensions, as supported in graphql-js
     *
     * @see https://github.com/graphql/graphql-js/issues/1527
     */
    extensions?: GraphQLUnionTypeConfig<any, any>['extensions'];
    /** Adds this type as a method on the Object/Interface definition blocks */
    asNexusMethod?: string;
} & AbstractTypes.MaybeTypeDefConfigFieldResolveType<TypeName>;
export declare class NexusUnionTypeDef<TypeName extends string> {
    readonly name: TypeName;
    protected config: NexusUnionTypeConfig<TypeName>;
    constructor(name: TypeName, config: NexusUnionTypeConfig<TypeName>);
    get value(): NexusUnionTypeConfig<TypeName>;
}
/**
 * [API Docs](https://nxs.li/docs/api/union-type) | [Abstract Types
 * Guide](https://nxs.li/guides/abstract-types) | [2018 GraphQL Spec](https://spec.graphql.org/June2018/#sec-Unions)
 *
 * Defines a Union type.
 *
 * Union types are one of the two abstract type in GraphQL. They let you express polymorphic fields where
 * members types can be totally different.
 *
 * @example
 *   export const Media = unionType({
 *     name: 'SearchResult',
 *     resolveType(source) {
 *       return 'director' in source ? 'Movie' : 'Song'
 *     },
 *     definition(t) {
 *       t.members('Movie', 'Song')
 *     },
 *   })
 *
 *   export const Movie = objectType({
 *     name: 'Movie',
 *     definition(t) {
 *       t.string('url')
 *       t.string('director')
 *     },
 *   })
 *
 *   export const Song = objectType({
 *     name: 'Song',
 *     definition(t) {
 *       t.string('url')
 *       t.string('album')
 *     },
 *   })
 *
 *   // GraphQL SDL
 *   // -----------
 *   //
 *   // union SearchResult = Movie | Song
 *   //
 *   // type Movie {
 *   //   director: String
 *   //   url: String
 *   // }
 *   //
 *   // type Song {
 *   //   album: String
 *   //   url: String
 *   // }
 *
 * @param config Specify your union's name, its members, and more. See each config property's jsDoc for more detail.
 */
export declare function unionType<TypeName extends string>(config: NexusUnionTypeConfig<TypeName>): NexusUnionTypeDef<TypeName>;
