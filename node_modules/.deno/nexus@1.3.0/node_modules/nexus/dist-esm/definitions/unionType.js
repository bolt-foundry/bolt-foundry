import { assertValidName } from 'graphql';
import { NexusTypes, withNexusSymbol } from './_types';
export class UnionDefinitionBlock {
    constructor(typeBuilder) {
        this.typeBuilder = typeBuilder;
    }
    /**
     * All ObjectType names that should be part of the union, either as string names or as references to the
     * `objectType()` return value
     */
    members(...unionMembers) {
        this.typeBuilder.addUnionMembers(unionMembers);
    }
}
export class NexusUnionTypeDef {
    constructor(name, config) {
        this.name = name;
        this.config = config;
        assertValidName(name);
    }
    get value() {
        return this.config;
    }
}
withNexusSymbol(NexusUnionTypeDef, NexusTypes.Union);
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
export function unionType(config) {
    return new NexusUnionTypeDef(config.name, config);
}
//# sourceMappingURL=unionType.js.map