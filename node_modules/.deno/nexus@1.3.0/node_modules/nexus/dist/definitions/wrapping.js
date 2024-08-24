"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.finalizeWrapping = exports.applyNexusWrapping = exports.normalizeArgWrapping = exports.rewrapAsGraphQLType = exports.unwrapNexusDef = exports.unwrapGraphQLDef = exports.isNexusPlugin = exports.isNexusPrintedGenTypingImport = exports.isNexusPrintedGenTyping = exports.isNexusDynamicInputMethod = exports.isNexusDynamicOutputMethod = exports.isNexusDynamicOutputProperty = exports.isNexusNamedInputTypeDef = exports.isNexusNamedOuputTypeDef = exports.isNexusArgDef = exports.isNexusInterfaceTypeDef = exports.isNexusUnionTypeDef = exports.isNexusScalarTypeDef = exports.isNexusObjectTypeDef = exports.isNexusInputObjectTypeDef = exports.isNexusEnumTypeDef = exports.isNexusExtendTypeDef = exports.isNexusExtendInputTypeDef = exports.isNexusWrappingType = exports.isNexusNullTypeDef = exports.isNexusNonNullTypeDef = exports.isNexusListTypeDef = exports.isNexusNamedTypeDef = exports.isNexusStruct = exports.isNexusTypeDef = void 0;
const graphql_1 = require("graphql");
const utils_1 = require("../utils");
const args_1 = require("./args");
const list_1 = require("./list");
const nonNull_1 = require("./nonNull");
const nullable_1 = require("./nullable");
const nexusMeta_1 = require("./nexusMeta");
const _types_1 = require("./_types");
const NamedTypeDefs = new Set([
    _types_1.NexusTypes.Enum,
    _types_1.NexusTypes.Object,
    _types_1.NexusTypes.Scalar,
    _types_1.NexusTypes.Union,
    _types_1.NexusTypes.Interface,
    _types_1.NexusTypes.InputObject,
]);
const isNexusTypeDef = (obj) => {
    console.warn(`isNexusTypeDef is deprecated, use isNexusStruct`);
    return isNexusStruct(obj);
};
exports.isNexusTypeDef = isNexusTypeDef;
function isNexusStruct(obj) {
    return obj && Boolean(obj[_types_1.NexusWrappedSymbol]);
}
exports.isNexusStruct = isNexusStruct;
function isNexusNamedTypeDef(obj) {
    return isNexusStruct(obj) && NamedTypeDefs.has(obj[_types_1.NexusWrappedSymbol]) && 'name' in obj;
}
exports.isNexusNamedTypeDef = isNexusNamedTypeDef;
function isNexusListTypeDef(obj) {
    return isNexusStruct(obj) && obj[_types_1.NexusWrappedSymbol] === _types_1.NexusTypes.List;
}
exports.isNexusListTypeDef = isNexusListTypeDef;
function isNexusNonNullTypeDef(obj) {
    return isNexusStruct(obj) && obj[_types_1.NexusWrappedSymbol] === _types_1.NexusTypes.NonNull;
}
exports.isNexusNonNullTypeDef = isNexusNonNullTypeDef;
function isNexusNullTypeDef(obj) {
    return isNexusStruct(obj) && obj[_types_1.NexusWrappedSymbol] === _types_1.NexusTypes.Null;
}
exports.isNexusNullTypeDef = isNexusNullTypeDef;
function isNexusWrappingType(obj) {
    return isNexusListTypeDef(obj) || isNexusNullTypeDef(obj) || isNexusNonNullTypeDef(obj);
}
exports.isNexusWrappingType = isNexusWrappingType;
function isNexusExtendInputTypeDef(obj) {
    return isNexusStruct(obj) && obj[_types_1.NexusWrappedSymbol] === _types_1.NexusTypes.ExtendInputObject;
}
exports.isNexusExtendInputTypeDef = isNexusExtendInputTypeDef;
function isNexusExtendTypeDef(obj) {
    return isNexusStruct(obj) && obj[_types_1.NexusWrappedSymbol] === _types_1.NexusTypes.ExtendObject;
}
exports.isNexusExtendTypeDef = isNexusExtendTypeDef;
function isNexusEnumTypeDef(obj) {
    return isNexusStruct(obj) && obj[_types_1.NexusWrappedSymbol] === _types_1.NexusTypes.Enum;
}
exports.isNexusEnumTypeDef = isNexusEnumTypeDef;
function isNexusInputObjectTypeDef(obj) {
    return isNexusStruct(obj) && obj[_types_1.NexusWrappedSymbol] === _types_1.NexusTypes.InputObject;
}
exports.isNexusInputObjectTypeDef = isNexusInputObjectTypeDef;
function isNexusObjectTypeDef(obj) {
    return isNexusStruct(obj) && obj[_types_1.NexusWrappedSymbol] === _types_1.NexusTypes.Object;
}
exports.isNexusObjectTypeDef = isNexusObjectTypeDef;
function isNexusScalarTypeDef(obj) {
    return isNexusStruct(obj) && obj[_types_1.NexusWrappedSymbol] === _types_1.NexusTypes.Scalar;
}
exports.isNexusScalarTypeDef = isNexusScalarTypeDef;
function isNexusUnionTypeDef(obj) {
    return isNexusStruct(obj) && obj[_types_1.NexusWrappedSymbol] === _types_1.NexusTypes.Union;
}
exports.isNexusUnionTypeDef = isNexusUnionTypeDef;
function isNexusInterfaceTypeDef(obj) {
    return isNexusStruct(obj) && obj[_types_1.NexusWrappedSymbol] === _types_1.NexusTypes.Interface;
}
exports.isNexusInterfaceTypeDef = isNexusInterfaceTypeDef;
function isNexusArgDef(obj) {
    return isNexusStruct(obj) && obj[_types_1.NexusWrappedSymbol] === _types_1.NexusTypes.Arg;
}
exports.isNexusArgDef = isNexusArgDef;
function isNexusNamedOuputTypeDef(obj) {
    return isNexusNamedTypeDef(obj) && !isNexusInputObjectTypeDef(obj);
}
exports.isNexusNamedOuputTypeDef = isNexusNamedOuputTypeDef;
function isNexusNamedInputTypeDef(obj) {
    return isNexusNamedTypeDef(obj) && !isNexusObjectTypeDef(obj) && !isNexusInterfaceTypeDef(obj);
}
exports.isNexusNamedInputTypeDef = isNexusNamedInputTypeDef;
function isNexusDynamicOutputProperty(obj) {
    return isNexusStruct(obj) && obj[_types_1.NexusWrappedSymbol] === _types_1.NexusTypes.DynamicOutputProperty;
}
exports.isNexusDynamicOutputProperty = isNexusDynamicOutputProperty;
function isNexusDynamicOutputMethod(obj) {
    return isNexusStruct(obj) && obj[_types_1.NexusWrappedSymbol] === _types_1.NexusTypes.DynamicOutputMethod;
}
exports.isNexusDynamicOutputMethod = isNexusDynamicOutputMethod;
function isNexusDynamicInputMethod(obj) {
    return isNexusStruct(obj) && obj[_types_1.NexusWrappedSymbol] === _types_1.NexusTypes.DynamicInput;
}
exports.isNexusDynamicInputMethod = isNexusDynamicInputMethod;
function isNexusPrintedGenTyping(obj) {
    return isNexusStruct(obj) && obj[_types_1.NexusWrappedSymbol] === _types_1.NexusTypes.PrintedGenTyping;
}
exports.isNexusPrintedGenTyping = isNexusPrintedGenTyping;
function isNexusPrintedGenTypingImport(obj) {
    return isNexusStruct(obj) && obj[_types_1.NexusWrappedSymbol] === _types_1.NexusTypes.PrintedGenTypingImport;
}
exports.isNexusPrintedGenTypingImport = isNexusPrintedGenTypingImport;
function isNexusPlugin(obj) {
    return isNexusStruct(obj) && obj[_types_1.NexusWrappedSymbol] === _types_1.NexusTypes.Plugin;
}
exports.isNexusPlugin = isNexusPlugin;
function unwrapGraphQLDef(typeDef) {
    const wrapping = [];
    let namedType = typeDef;
    while ((0, graphql_1.isWrappingType)(namedType)) {
        if ((0, graphql_1.isListType)(namedType)) {
            wrapping.unshift('List');
        }
        else if ((0, graphql_1.isNonNullType)(namedType)) {
            wrapping.unshift('NonNull');
        }
        else {
            throw new utils_1.Unreachable(namedType);
        }
        namedType = namedType.ofType;
    }
    return { namedType, wrapping };
}
exports.unwrapGraphQLDef = unwrapGraphQLDef;
/** Unwraps any wrapped Nexus or GraphQL types, turning into a list of wrapping */
function unwrapNexusDef(typeDef) {
    const wrapping = [];
    let namedType = typeDef;
    while (isNexusWrappingType(namedType) || (0, graphql_1.isWrappingType)(namedType) || (0, nexusMeta_1.isNexusMetaType)(namedType)) {
        if ((0, nexusMeta_1.isNexusMetaType)(namedType)) {
            namedType = (0, nexusMeta_1.resolveNexusMetaType)(namedType);
        }
        else if ((0, graphql_1.isWrappingType)(namedType)) {
            if ((0, graphql_1.isListType)(namedType)) {
                wrapping.unshift('List');
            }
            else if ((0, graphql_1.isNonNullType)(namedType)) {
                wrapping.unshift('NonNull');
            }
            else {
                throw new utils_1.Unreachable(namedType);
            }
            namedType = namedType.ofType;
        }
        else {
            if (isNexusNonNullTypeDef(namedType)) {
                wrapping.unshift('NonNull');
            }
            if (isNexusNullTypeDef(namedType)) {
                wrapping.unshift('Null');
            }
            if (isNexusListTypeDef(namedType)) {
                wrapping.unshift('List');
            }
            namedType = namedType.ofNexusType;
        }
    }
    return { namedType, wrapping };
}
exports.unwrapNexusDef = unwrapNexusDef;
/** Takes the named type, and applies any of the NexusFinalWrapKind to create a properly wrapped GraphQL type. */
function rewrapAsGraphQLType(baseType, wrapping) {
    let finalType = baseType;
    wrapping.forEach((wrap) => {
        if (wrap === 'List') {
            finalType = new graphql_1.GraphQLList(finalType);
        }
        else if (wrap === 'NonNull') {
            if (!(0, graphql_1.isNonNullType)(finalType)) {
                finalType = new graphql_1.GraphQLNonNull(finalType);
            }
        }
        else {
            throw new utils_1.Unreachable(wrap);
        }
    });
    return finalType;
}
exports.rewrapAsGraphQLType = rewrapAsGraphQLType;
/**
 * Apply the wrapping consistently to the arg `type`
 *
 * NonNull(list(stringArg())) -> arg({ type: nonNull(list('String')) })
 */
function normalizeArgWrapping(argVal) {
    if (isNexusArgDef(argVal)) {
        return argVal;
    }
    if (isNexusWrappingType(argVal)) {
        let { namedType, wrapping } = unwrapNexusDef(argVal);
        if (isNexusArgDef(namedType)) {
            const config = namedType.value;
            return (0, args_1.arg)(Object.assign(Object.assign({}, config), { type: applyNexusWrapping(config.type, wrapping) }));
        }
        return (0, args_1.arg)({ type: applyNexusWrapping(namedType, wrapping) });
    }
    return (0, args_1.arg)({ type: argVal });
}
exports.normalizeArgWrapping = normalizeArgWrapping;
/**
 * Applies the ['List', 'NonNull', 'Nullable']
 *
 * @param toWrap
 * @param wrapping
 */
function applyNexusWrapping(toWrap, wrapping) {
    let finalType = toWrap;
    wrapping.forEach((wrap) => {
        if (wrap === 'List') {
            finalType = (0, list_1.list)(finalType);
        }
        else if (wrap === 'NonNull') {
            finalType = (0, nonNull_1.nonNull)(finalType);
        }
        else if (wrap === 'Null') {
            finalType = (0, nullable_1.nullable)(finalType);
        }
        else {
            throw new utils_1.Unreachable(wrap);
        }
    });
    return finalType;
}
exports.applyNexusWrapping = applyNexusWrapping;
/**
 * Takes the "nonNullDefault" value, the chained wrapping, and the field wrapping, to determine the proper
 * list of wrapping to apply to the field
 */
function finalizeWrapping(nonNullDefault, typeWrapping, chainWrapping) {
    let finalChain = [];
    const allWrapping = typeWrapping.concat(chainWrapping !== null && chainWrapping !== void 0 ? chainWrapping : []);
    // Ensure the first item is wrapped, if we're not guarding
    if (nonNullDefault && (!allWrapping[0] || allWrapping[0] === 'List')) {
        allWrapping.unshift('NonNull');
    }
    for (let i = 0; i < allWrapping.length; i++) {
        const current = allWrapping[i];
        const next = allWrapping[i + 1];
        if (current === 'Null') {
            continue;
        }
        else if (current === 'NonNull') {
            finalChain.push('NonNull');
        }
        else if (current === 'List') {
            finalChain.push('List');
            if (nonNullDefault && (next === 'List' || !next)) {
                finalChain.push('NonNull');
            }
        }
    }
    return finalChain;
}
exports.finalizeWrapping = finalizeWrapping;
//# sourceMappingURL=wrapping.js.map