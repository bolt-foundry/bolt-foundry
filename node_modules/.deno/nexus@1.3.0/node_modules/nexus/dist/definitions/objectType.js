"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectType = exports.NexusObjectTypeDef = exports.ObjectDefinitionBlock = void 0;
const graphql_1 = require("graphql");
const definitionBlocks_1 = require("./definitionBlocks");
const _types_1 = require("./_types");
class ObjectDefinitionBlock extends definitionBlocks_1.OutputDefinitionBlock {
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
exports.ObjectDefinitionBlock = ObjectDefinitionBlock;
class NexusObjectTypeDef {
    constructor(name, config) {
        this.name = name;
        this.config = config;
        (0, graphql_1.assertValidName)(name);
    }
    get value() {
        return this.config;
    }
}
exports.NexusObjectTypeDef = NexusObjectTypeDef;
(0, _types_1.withNexusSymbol)(NexusObjectTypeDef, _types_1.NexusTypes.Object);
/**
 * [API Docs](https://nxs.li/docs/api/object-type) | [GraphQL.org
 * Docs](https://graphql.org/learn/schema/#object-types-and-fields) | [GraphQL 2018
 * Spec](https://spec.graphql.org/June2018/#sec-Objects)
 *
 * Define a GraphQL Object Type.
 *
 * Object types are typically the most common kind of type present in a GraphQL schema. You give them a name
 * and fields that model your domain. Fields are typed and can point to yet another object type you've defined.
 *
 * @example
 *   const Post = objectType({
 *     name: 'Post',
 *     definition(t) {
 *       t.int('id')
 *       t.string('title')
 *     },
 *   })
 *
 * @param config Specify your object's name, its fields, and more. See each config property's jsDoc for more detail.
 */
function objectType(config) {
    return new NexusObjectTypeDef(config.name, config);
}
exports.objectType = objectType;
//# sourceMappingURL=objectType.js.map