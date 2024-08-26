import { GraphQLList, GraphQLNonNull, isWrappingType, isListType, isNonNullType, } from 'graphql';
import { Unreachable } from '../utils';
import { arg } from './args';
import { list } from './list';
import { nonNull } from './nonNull';
import { nullable } from './nullable';
import { isNexusMetaType, resolveNexusMetaType } from './nexusMeta';
import { NexusTypes, NexusWrappedSymbol } from './_types';
const NamedTypeDefs = new Set([
    NexusTypes.Enum,
    NexusTypes.Object,
    NexusTypes.Scalar,
    NexusTypes.Union,
    NexusTypes.Interface,
    NexusTypes.InputObject,
]);
export const isNexusTypeDef = (obj) => {
    console.warn(`isNexusTypeDef is deprecated, use isNexusStruct`);
    return isNexusStruct(obj);
};
export function isNexusStruct(obj) {
    return obj && Boolean(obj[NexusWrappedSymbol]);
}
export function isNexusNamedTypeDef(obj) {
    return isNexusStruct(obj) && NamedTypeDefs.has(obj[NexusWrappedSymbol]) && 'name' in obj;
}
export function isNexusListTypeDef(obj) {
    return isNexusStruct(obj) && obj[NexusWrappedSymbol] === NexusTypes.List;
}
export function isNexusNonNullTypeDef(obj) {
    return isNexusStruct(obj) && obj[NexusWrappedSymbol] === NexusTypes.NonNull;
}
export function isNexusNullTypeDef(obj) {
    return isNexusStruct(obj) && obj[NexusWrappedSymbol] === NexusTypes.Null;
}
export function isNexusWrappingType(obj) {
    return isNexusListTypeDef(obj) || isNexusNullTypeDef(obj) || isNexusNonNullTypeDef(obj);
}
export function isNexusExtendInputTypeDef(obj) {
    return isNexusStruct(obj) && obj[NexusWrappedSymbol] === NexusTypes.ExtendInputObject;
}
export function isNexusExtendTypeDef(obj) {
    return isNexusStruct(obj) && obj[NexusWrappedSymbol] === NexusTypes.ExtendObject;
}
export function isNexusEnumTypeDef(obj) {
    return isNexusStruct(obj) && obj[NexusWrappedSymbol] === NexusTypes.Enum;
}
export function isNexusInputObjectTypeDef(obj) {
    return isNexusStruct(obj) && obj[NexusWrappedSymbol] === NexusTypes.InputObject;
}
export function isNexusObjectTypeDef(obj) {
    return isNexusStruct(obj) && obj[NexusWrappedSymbol] === NexusTypes.Object;
}
export function isNexusScalarTypeDef(obj) {
    return isNexusStruct(obj) && obj[NexusWrappedSymbol] === NexusTypes.Scalar;
}
export function isNexusUnionTypeDef(obj) {
    return isNexusStruct(obj) && obj[NexusWrappedSymbol] === NexusTypes.Union;
}
export function isNexusInterfaceTypeDef(obj) {
    return isNexusStruct(obj) && obj[NexusWrappedSymbol] === NexusTypes.Interface;
}
export function isNexusArgDef(obj) {
    return isNexusStruct(obj) && obj[NexusWrappedSymbol] === NexusTypes.Arg;
}
export function isNexusNamedOuputTypeDef(obj) {
    return isNexusNamedTypeDef(obj) && !isNexusInputObjectTypeDef(obj);
}
export function isNexusNamedInputTypeDef(obj) {
    return isNexusNamedTypeDef(obj) && !isNexusObjectTypeDef(obj) && !isNexusInterfaceTypeDef(obj);
}
export function isNexusDynamicOutputProperty(obj) {
    return isNexusStruct(obj) && obj[NexusWrappedSymbol] === NexusTypes.DynamicOutputProperty;
}
export function isNexusDynamicOutputMethod(obj) {
    return isNexusStruct(obj) && obj[NexusWrappedSymbol] === NexusTypes.DynamicOutputMethod;
}
export function isNexusDynamicInputMethod(obj) {
    return isNexusStruct(obj) && obj[NexusWrappedSymbol] === NexusTypes.DynamicInput;
}
export function isNexusPrintedGenTyping(obj) {
    return isNexusStruct(obj) && obj[NexusWrappedSymbol] === NexusTypes.PrintedGenTyping;
}
export function isNexusPrintedGenTypingImport(obj) {
    return isNexusStruct(obj) && obj[NexusWrappedSymbol] === NexusTypes.PrintedGenTypingImport;
}
export function isNexusPlugin(obj) {
    return isNexusStruct(obj) && obj[NexusWrappedSymbol] === NexusTypes.Plugin;
}
export function unwrapGraphQLDef(typeDef) {
    const wrapping = [];
    let namedType = typeDef;
    while (isWrappingType(namedType)) {
        if (isListType(namedType)) {
            wrapping.unshift('List');
        }
        else if (isNonNullType(namedType)) {
            wrapping.unshift('NonNull');
        }
        else {
            throw new Unreachable(namedType);
        }
        namedType = namedType.ofType;
    }
    return { namedType, wrapping };
}
/** Unwraps any wrapped Nexus or GraphQL types, turning into a list of wrapping */
export function unwrapNexusDef(typeDef) {
    const wrapping = [];
    let namedType = typeDef;
    while (isNexusWrappingType(namedType) || isWrappingType(namedType) || isNexusMetaType(namedType)) {
        if (isNexusMetaType(namedType)) {
            namedType = resolveNexusMetaType(namedType);
        }
        else if (isWrappingType(namedType)) {
            if (isListType(namedType)) {
                wrapping.unshift('List');
            }
            else if (isNonNullType(namedType)) {
                wrapping.unshift('NonNull');
            }
            else {
                throw new Unreachable(namedType);
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
/** Takes the named type, and applies any of the NexusFinalWrapKind to create a properly wrapped GraphQL type. */
export function rewrapAsGraphQLType(baseType, wrapping) {
    let finalType = baseType;
    wrapping.forEach((wrap) => {
        if (wrap === 'List') {
            finalType = new GraphQLList(finalType);
        }
        else if (wrap === 'NonNull') {
            if (!isNonNullType(finalType)) {
                finalType = new GraphQLNonNull(finalType);
            }
        }
        else {
            throw new Unreachable(wrap);
        }
    });
    return finalType;
}
/**
 * Apply the wrapping consistently to the arg `type`
 *
 * NonNull(list(stringArg())) -> arg({ type: nonNull(list('String')) })
 */
export function normalizeArgWrapping(argVal) {
    if (isNexusArgDef(argVal)) {
        return argVal;
    }
    if (isNexusWrappingType(argVal)) {
        let { namedType, wrapping } = unwrapNexusDef(argVal);
        if (isNexusArgDef(namedType)) {
            const config = namedType.value;
            return arg(Object.assign(Object.assign({}, config), { type: applyNexusWrapping(config.type, wrapping) }));
        }
        return arg({ type: applyNexusWrapping(namedType, wrapping) });
    }
    return arg({ type: argVal });
}
/**
 * Applies the ['List', 'NonNull', 'Nullable']
 *
 * @param toWrap
 * @param wrapping
 */
export function applyNexusWrapping(toWrap, wrapping) {
    let finalType = toWrap;
    wrapping.forEach((wrap) => {
        if (wrap === 'List') {
            finalType = list(finalType);
        }
        else if (wrap === 'NonNull') {
            finalType = nonNull(finalType);
        }
        else if (wrap === 'Null') {
            finalType = nullable(finalType);
        }
        else {
            throw new Unreachable(wrap);
        }
    });
    return finalType;
}
/**
 * Takes the "nonNullDefault" value, the chained wrapping, and the field wrapping, to determine the proper
 * list of wrapping to apply to the field
 */
export function finalizeWrapping(nonNullDefault, typeWrapping, chainWrapping) {
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
//# sourceMappingURL=wrapping.js.map