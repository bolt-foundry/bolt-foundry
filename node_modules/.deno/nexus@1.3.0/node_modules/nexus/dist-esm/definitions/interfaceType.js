import { assertValidName } from 'graphql';
import { OutputDefinitionBlock } from './definitionBlocks';
import { NexusTypes, withNexusSymbol } from './_types';
export class InterfaceDefinitionBlock extends OutputDefinitionBlock {
    constructor(typeBuilder) {
        super(typeBuilder);
        this.typeBuilder = typeBuilder;
    }
    /** @param interfaceName */
    implements(...interfaceName) {
        this.typeBuilder.addInterfaces(interfaceName);
    }
    /** Modifies a field added via an interface */
    modify(field, modifications) {
        this.typeBuilder.addModification(Object.assign(Object.assign({}, modifications), { field }));
    }
}
export class NexusInterfaceTypeDef {
    constructor(name, config) {
        this.name = name;
        this.config = config;
        assertValidName(name);
    }
    get value() {
        return this.config;
    }
}
withNexusSymbol(NexusInterfaceTypeDef, NexusTypes.Interface);
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
export function interfaceType(config) {
    return new NexusInterfaceTypeDef(config.name, config);
}
//# sourceMappingURL=interfaceType.js.map