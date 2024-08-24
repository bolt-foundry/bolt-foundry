import { __rest } from "tslib";
import { isEnumType, isInputObjectType, isInterfaceType, isObjectType, isScalarType, isUnionType, defaultTypeResolver, } from 'graphql';
import { arg } from './definitions/args';
import { enumType } from './definitions/enumType';
import { inputObjectType } from './definitions/inputObjectType';
import { interfaceType } from './definitions/interfaceType';
import { objectType } from './definitions/objectType';
import { scalarType } from './definitions/scalarType';
import { unionType } from './definitions/unionType';
import { applyNexusWrapping, unwrapGraphQLDef } from './definitions/wrapping';
import { graphql15InterfaceConfig, Unreachable } from './utils';
export function rebuildNamedType(type, config) {
    if (isObjectType(type)) {
        return rebuildObjectType(type, config);
    }
    else if (isInputObjectType(type)) {
        return rebuildInputObjectType(type, config);
    }
    else if (isInterfaceType(type)) {
        return rebuildInterfaceType(type, config);
    }
    else if (isUnionType(type)) {
        return rebuildUnionType(type, config);
    }
    else if (isScalarType(type)) {
        return rebuildScalarType(type, config);
    }
    else if (isEnumType(type)) {
        return rebuildEnumType(type, config);
    }
    throw new Unreachable(type);
}
export function rebuildInputObjectType(type, config) {
    const { name, fields, description, extensions } = type.toConfig();
    return inputObjectType({
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
export function rebuildUnionType(type, config) {
    const { name, types, description, resolveType, extensions } = type.toConfig();
    return unionType({
        name,
        description,
        // @ts-ignore - todo, see why this is the case
        resolveType: resolveType !== null && resolveType !== void 0 ? resolveType : defaultTypeResolver,
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
export function rebuildScalarType(type, config) {
    return scalarType(Object.assign(Object.assign({}, type.toConfig()), { sourceType: config.sourceType, asNexusMethod: config.asNexusMethod }));
}
export function rebuildEnumType(type, { sourceType, asNexusMethod }) {
    const _a = type.toConfig(), { name, values } = _a, config = __rest(_a, ["name", "values"]);
    return enumType(Object.assign(Object.assign({ name }, config), { members: Object.entries(values).map(([valueName, config]) => {
            return Object.assign({ name: valueName, deprecation: config.deprecationReason }, config);
        }), sourceType,
        asNexusMethod }));
}
export function rebuildInterfaceType(type, config) {
    const { name, fields, description, interfaces, extensions, resolveType } = graphql15InterfaceConfig(type.toConfig());
    return interfaceType({
        name,
        description,
        // @ts-ignore - todo, see why this is the case
        resolveType: resolveType !== null && resolveType !== void 0 ? resolveType : defaultTypeResolver,
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
export function rebuildObjectType(type, config) {
    const { name, fields, interfaces, description, extensions } = type.toConfig();
    return objectType({
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
export function rebuildOutputDefinition(typeName, t, fields, interfaces, config) {
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
        const { namedType, wrapping } = unwrapGraphQLDef(fieldConfig.type);
        (_c = config.captureLeafType) === null || _c === void 0 ? void 0 : _c.call(config, namedType);
        t.field(fieldName, {
            type: applyNexusWrapping(namedType.name, wrapping),
            description: fieldConfig.description,
            deprecation: fieldConfig.deprecationReason,
            extensions: fieldConfig.extensions,
            args: rebuildArgs(typeName, fieldName, (_d = fieldConfig.args) !== null && _d !== void 0 ? _d : {}, config),
            resolve: fieldConfig.resolve,
        });
    }
}
export function rebuildInputDefinition(typeName, t, fields, config) {
    var _a, _b, _c;
    for (const [fieldName, fieldConfig] of Object.entries(fields)) {
        if (((_a = config.skipFields) === null || _a === void 0 ? void 0 : _a[typeName]) && ((_b = config.skipFields) === null || _b === void 0 ? void 0 : _b[typeName].includes(fieldName))) {
            continue;
        }
        const { namedType, wrapping } = unwrapGraphQLDef(fieldConfig.type);
        (_c = config.captureLeafType) === null || _c === void 0 ? void 0 : _c.call(config, namedType);
        t.field(fieldName, {
            type: applyNexusWrapping(namedType.name, wrapping),
            description: fieldConfig.description,
            default: fieldConfig.defaultValue,
            extensions: fieldConfig.extensions,
        });
    }
}
export function rebuildArgs(typeName, fieldName, argMap, config) {
    var _a, _b, _c;
    if (!argMap) {
        return null;
    }
    const rebuiltArgs = {};
    for (const [argName, argConfig] of Object.entries(argMap)) {
        if ((_b = (_a = config.skipArgs) === null || _a === void 0 ? void 0 : _a[typeName]) === null || _b === void 0 ? void 0 : _b[fieldName]) {
            continue;
        }
        const { namedType, wrapping } = unwrapGraphQLDef(argConfig.type);
        (_c = config.captureLeafType) === null || _c === void 0 ? void 0 : _c.call(config, namedType);
        rebuiltArgs[argName] = arg({
            type: applyNexusWrapping(namedType.name, wrapping),
            default: argConfig.defaultValue,
            description: argConfig.description,
            extensions: argConfig.extensions,
        });
    }
    return rebuiltArgs;
}
//# sourceMappingURL=rebuildType.js.map