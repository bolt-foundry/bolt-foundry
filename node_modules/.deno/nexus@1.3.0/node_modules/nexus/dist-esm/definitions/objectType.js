import { assertValidName } from 'graphql';
import { OutputDefinitionBlock } from './definitionBlocks';
import { NexusTypes, withNexusSymbol } from './_types';
export class ObjectDefinitionBlock extends OutputDefinitionBlock {
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
export class NexusObjectTypeDef {
    constructor(name, config) {
        this.name = name;
        this.config = config;
        assertValidName(name);
    }
    get value() {
        return this.config;
    }
}
withNexusSymbol(NexusObjectTypeDef, NexusTypes.Object);
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
export function objectType(config) {
    return new NexusObjectTypeDef(config.name, config);
}
//# sourceMappingURL=objectType.js.map