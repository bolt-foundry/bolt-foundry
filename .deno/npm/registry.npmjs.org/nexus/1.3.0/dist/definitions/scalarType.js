"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asNexusMethod = exports.scalarType = exports.NexusScalarTypeDef = void 0;
const graphql_1 = require("graphql");
const decorateType_1 = require("./decorateType");
const _types_1 = require("./_types");
class NexusScalarTypeDef {
    constructor(name, config) {
        this.name = name;
        this.config = config;
        (0, graphql_1.assertValidName)(name);
    }
    get value() {
        return this.config;
    }
}
exports.NexusScalarTypeDef = NexusScalarTypeDef;
(0, _types_1.withNexusSymbol)(NexusScalarTypeDef, _types_1.NexusTypes.Scalar);
function scalarType(options) {
    return new NexusScalarTypeDef(options.name, options);
}
exports.scalarType = scalarType;
function asNexusMethod(namedType, methodName, sourceType) {
    return (0, decorateType_1.decorateType)(namedType, {
        asNexusMethod: methodName,
        sourceType,
    });
}
exports.asNexusMethod = asNexusMethod;
//# sourceMappingURL=scalarType.js.map