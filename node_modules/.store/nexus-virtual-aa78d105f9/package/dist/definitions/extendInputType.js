"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extendInputType = exports.NexusExtendInputTypeDef = void 0;
const graphql_1 = require("graphql");
const _types_1 = require("./_types");
class NexusExtendInputTypeDef {
    constructor(name, config) {
        this.name = name;
        this.config = config;
        (0, graphql_1.assertValidName)(name);
    }
    get value() {
        return this.config;
    }
}
exports.NexusExtendInputTypeDef = NexusExtendInputTypeDef;
(0, _types_1.withNexusSymbol)(NexusExtendInputTypeDef, _types_1.NexusTypes.ExtendInputObject);
/**
 * Adds new fields to an existing inputObjectType in the schema. Useful when splitting your schema across
 * several domains.
 *
 * @see https://nexusjs.org/docs/api/extend-type
 */
function extendInputType(config) {
    return new NexusExtendInputTypeDef(config.type, Object.assign(Object.assign({}, config), { name: config.type }));
}
exports.extendInputType = extendInputType;
//# sourceMappingURL=extendInputType.js.map