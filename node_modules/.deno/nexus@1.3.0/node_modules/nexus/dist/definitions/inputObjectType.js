"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputObjectType = exports.NexusInputObjectTypeDef = void 0;
const graphql_1 = require("graphql");
const args_1 = require("./args");
const _types_1 = require("./_types");
class NexusInputObjectTypeDef {
    constructor(name, config) {
        this.name = name;
        this.config = config;
        (0, graphql_1.assertValidName)(name);
    }
    get value() {
        return this.config;
    }
    /**
     * Shorthand for wrapping the current InputObject in an "arg", useful if you need to add a description.
     *
     * @example
     *   inputObject(config).asArg({
     *     description: 'Define sort the current field',
     *   })
     */
    asArg(cfg) {
        return (0, args_1.arg)(Object.assign(Object.assign({}, cfg), { type: this }));
    }
}
exports.NexusInputObjectTypeDef = NexusInputObjectTypeDef;
(0, _types_1.withNexusSymbol)(NexusInputObjectTypeDef, _types_1.NexusTypes.InputObject);
function inputObjectType(config) {
    return new NexusInputObjectTypeDef(config.name, config);
}
exports.inputObjectType = inputObjectType;
//# sourceMappingURL=inputObjectType.js.map