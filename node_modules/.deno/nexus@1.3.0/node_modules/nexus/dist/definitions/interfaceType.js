"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interfaceType = exports.NexusInterfaceTypeDef = exports.InterfaceDefinitionBlock = void 0;
const graphql_1 = require("graphql");
const definitionBlocks_1 = require("./definitionBlocks");
const _types_1 = require("./_types");
class InterfaceDefinitionBlock extends definitionBlocks_1.OutputDefinitionBlock {
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
exports.InterfaceDefinitionBlock = InterfaceDefinitionBlock;
class NexusInterfaceTypeDef {
    constructor(name, config) {
        this.name = name;
        this.config = config;
        (0, graphql_1.assertValidName)(name);
    }
    get value() {
        return this.config;
    }
}
exports.NexusInterfaceTypeDef = NexusInterfaceTypeDef;
(0, _types_1.withNexusSymbol)(NexusInterfaceTypeDef, _types_1.NexusTypes.Interface);
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
function interfaceType(config) {
    return new NexusInterfaceTypeDef(config.name, config);
}
exports.interfaceType = interfaceType;
//# sourceMappingURL=interfaceType.js.map