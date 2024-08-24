"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rebuildArgs = exports.rebuildInputDefinition = exports.rebuildOutputDefinition = exports.rebuildObjectType = exports.rebuildInterfaceType = exports.rebuildEnumType = exports.rebuildScalarType = exports.rebuildUnionType = exports.rebuildInputObjectType = exports.rebuildNamedType = void 0;
const tslib_1 = require("tslib");
const graphql_1 = require("graphql");
const args_1 = require("./definitions/args");
const enumType_1 = require("./definitions/enumType");
const inputObjectType_1 = require("./definitions/inputObjectType");
const interfaceType_1 = require("./definitions/interfaceType");
const objectType_1 = require("./definitions/objectType");
const scalarType_1 = require("./definitions/scalarType");
const unionType_1 = require("./definitions/unionType");
const wrapping_1 = require("./definitions/wrapping");
const utils_1 = require("./utils");
function rebuildNamedType(type, config) {
    if ((0, graphql_1.isObjectType)(type)) {
        return rebuildObjectType(type, config);
    }
    else if ((0, graphql_1.isInputObjectType)(type)) {
        return rebuildInputObjectType(type, config);
    }
    else if ((0, graphql_1.isInterfaceType)(type)) {
        return rebuildInterfaceType(type, config);
    }
    else if ((0, graphql_1.isUnionType)(type)) {
        return rebuildUnionType(type, config);
    }
    else if ((0, graphql_1.isScalarType)(type)) {
        return rebuildScalarType(type, config);
    }
    else if ((0, graphql_1.isEnumType)(type)) {
        return rebuildEnumType(type, config);
    }
    throw new utils_1.Unreachable(type);
}
exports.rebuildNamedType = rebuildNamedType;
function rebuildInputObjectType(type, config) {
    const { name, fields, description, extensions } = type.toConfig();
    return (0, inputObjectType_1.inputObjectType)({
        name,
        description,
        definition: (t) => {
            rebuildInputDefinition(name, t, fields, config);
        },
        extensions,
        nonNullDefaults: {
            output: false,
            input: false,
        },
    });
}
exports.rebuildInputObjectType = rebuildInputObjectType;
function rebuildUnionType(type, config) {
    const { name, types, description, resolveType, extensions } = type.toConfig();
    return (0, unionType_1.unionType)({
        name,
        description,
        // @ts-ignore - todo, see why this is the case
        resolveType: resolveType !== null && resolveType !== void 0 ? resolveType : graphql_1.defaultTypeResolver,
        definition(t) {
            t.members(...types.map((o) => {
                var _a;
                (_a = config.captureLeafType) === null || _a === void 0 ? void 0 : _a.call(config, o);
                return o.name;
            }));
        },
        extensions,
    });
}
exports.rebuildUnionType = rebuildUnionType;
function rebuildScalarType(type, config) {
    return (0, scalarType_1.scalarType)(Object.assign(Object.assign({}, type.toConfig()), { sourceType: config.sourceType, asNexusMethod: config.asNexusMethod }));
}
exports.rebuildScalarType = rebuildScalarType;
function rebuildEnumType(type, { sourceType, asNexusMethod }) {
    const _a = type.toConfig(), { name, values } = _a, config = (0, tslib_1.__rest)(_a, ["name", "values"]);
    return (0, enumType_1.enumType)(Object.assign(Object.assign({ name }, config), { members: Object.entries(values).map(([valueName, config]) => {
            return Object.assign({ name: valueName, deprecation: config.deprecationReason }, config);
        }), sourceType,
        asNexusMethod }));
}
exports.rebuildEnumType = rebuildEnumType;
function rebuildInterfaceType(type, config) {
    const { name, fields, description, interfaces, extensions, resolveType } = (0, utils_1.graphql15InterfaceConfig)(type.toConfig());
    return (0, interfaceType_1.interfaceType)({
        name,
        description,
        // @ts-ignore - todo, see why this is the case
        resolveType: resolveType !== null && resolveType !== void 0 ? resolveType : graphql_1.defaultTypeResolver,
        definition: (t) => {
            rebuildOutputDefinition(name, t, fields, interfaces, config);
        },
        nonNullDefaults: {
            output: false,
            input: false,
        },
        extensions,
        sourceType: config.sourceType,
        asNexusMethod: config.asNexusMethod,
    });
}
exports.rebuildInterfaceType = rebuildInterfaceType;
function rebuildObjectType(type, config) {
    const { name, fields, interfaces, description, extensions } = type.toConfig();
    return (0, objectType_1.objectType)({
        name,
        description,
        definition: (t) => {
            rebuildOutputDefinition(name, t, fields, interfaces, config);
        },
        nonNullDefaults: {
            output: false,
            input: false,
        },
        extensions,
        sourceType: config.sourceType,
        asNexusMethod: config.asNexusMethod,
    });
}
exports.rebuildObjectType = rebuildObjectType;
function rebuildOutputDefinition(typeName, t, fields, interfaces, config) {
    var _a, _b, _c, _d;
    t.implements(...interfaces.map((i) => {
        var _a;
        (_a = config.captureLeafType) === null || _a === void 0 ? void 0 : _a.call(config, i);
        return i.name;
    }));
    for (const [fieldName, fieldConfig] of Object.entries(fields)) {
        if (((_a = config.skipFields) === null || _a === void 0 ? void 0 : _a[typeName]) && ((_b = config.skipFields) === null || _b === void 0 ? void 0 : _b[typeName].includes(fieldName))) {
            continue;
        }
        const { namedType, wrapping } = (0, wrapping_1.unwrapGraphQLDef)(fieldConfig.type);
        (_c = config.captureLeafType) === null || _c === void 0 ? void 0 : _c.call(config, namedType);
        t.field(fieldName, {
            type: (0, wrapping_1.applyNexusWrapping)(namedType.name, wrapping),
            description: fieldConfig.description,
            deprecation: fieldConfig.deprecationReason,
            extensions: fieldConfig.extensions,
            args: rebuildArgs(typeName, fieldName, (_d = fieldConfig.args) !== null && _d !== void 0 ? _d : {}, config),
            resolve: fieldConfig.resolve,
        });
    }
}
exports.rebuildOutputDefinition = rebuildOutputDefinition;
function rebuildInputDefinition(typeName, t, fields, config) {
    var _a, _b, _c;
    for (const [fieldName, fieldConfig] of Object.entries(fields)) {
        if (((_a = config.skipFields) === null || _a === void 0 ? void 0 : _a[typeName]) && ((_b = config.skipFields) === null || _b === void 0 ? void 0 : _b[typeName].includes(fieldName))) {
            continue;
        }
        const { namedType, wrapping } = (0, wrapping_1.unwrapGraphQLDef)(fieldConfig.type);
        (_c = config.captureLeafType) === null || _c === void 0 ? void 0 : _c.call(config, namedType);
        t.field(fieldName, {
            type: (0, wrapping_1.applyNexusWrapping)(namedType.name, wrapping),
            description: fieldConfig.description,
            default: fieldConfig.defaultValue,
            extensions: fieldConfig.extensions,
        });
    }
}
exports.rebuildInputDefinition = rebuildInputDefinition;
function rebuildArgs(typeName, fieldName, argMap, config) {
    var _a, _b, _c;
    if (!argMap) {
        return null;
    }
    const rebuiltArgs = {};
    for (const [argName, argConfig] of Object.entries(argMap)) {
        if ((_b = (_a = config.skipArgs) === null || _a === void 0 ? void 0 : _a[typeName]) === null || _b === void 0 ? void 0 : _b[fieldName]) {
            continue;
        }
        const { namedType, wrapping } = (0, wrapping_1.unwrapGraphQLDef)(argConfig.type);
        (_c = config.captureLeafType) === null || _c === void 0 ? void 0 : _c.call(config, namedType);
        rebuiltArgs[argName] = (0, args_1.arg)({
            type: (0, wrapping_1.applyNexusWrapping)(namedType.name, wrapping),
            default: argConfig.defaultValue,
            description: argConfig.description,
            extensions: argConfig.extensions,
        });
    }
    return rebuiltArgs;
}
exports.rebuildArgs = rebuildArgs;
//# sourceMappingURL=rebuildType.js.map