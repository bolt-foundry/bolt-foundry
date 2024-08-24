"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enumType = exports.NexusEnumTypeDef = void 0;
const graphql_1 = require("graphql");
const args_1 = require("./args");
const _types_1 = require("./_types");
class NexusEnumTypeDef {
    constructor(name, config) {
        this.name = name;
        this.config = config;
        (0, graphql_1.assertValidName)(name);
    }
    get value() {
        return this.config;
    }
    /**
     * Wraps the current enum as an argument, useful if you're defining the enumType inline for an individual field.
     *
     * @example
     *   args: {
     *     sort: enumType(config).asArg({ default: 'someValue' })
     *   }
     */
    asArg(cfg) {
        return (0, args_1.arg)(Object.assign(Object.assign({}, cfg), { type: this }));
    }
}
exports.NexusEnumTypeDef = NexusEnumTypeDef;
(0, _types_1.withNexusSymbol)(NexusEnumTypeDef, _types_1.NexusTypes.Enum);
function enumType(config) {
    return new NexusEnumTypeDef(config.name, config);
}
exports.enumType = enumType;
//# sourceMappingURL=enumType.js.map