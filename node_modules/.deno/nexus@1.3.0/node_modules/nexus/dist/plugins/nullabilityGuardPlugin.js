"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nullabilityGuardPlugin = void 0;
const graphql_1 = require("graphql");
const iterall_1 = require("iterall");
const plugin_1 = require("../plugin");
const utils_1 = require("../utils");
const fieldDefTypes = (0, utils_1.printedGenTyping)({
    name: 'skipNullGuard',
    optional: true,
    type: 'boolean',
    description: `
    The nullability guard can be helpful, but is also a potentially expensive operation for lists.
    We need to iterate the entire list to check for null items to guard against. Set this to true
    to skip the null guard on a specific field if you know there's no potential for unsafe types.
  `,
});
const nullabilityGuardPlugin = (pluginConfig) => {
    const { shouldGuard = process.env.NODE_ENV === 'production', fallbackValues = {}, onGuarded = (obj) => {
        console.warn(`Nullability guard called for ${obj.info.parentType.name}.${obj.info.fieldName}`);
    }, } = pluginConfig;
    const finalPluginConfig = {
        shouldGuard,
        onGuarded,
        fallbackValues,
    };
    return (0, plugin_1.plugin)({
        name: 'NullabilityGuard',
        description: 'If we have a nullable field, we want to guard against this being an issue in production.',
        fieldDefTypes,
        onCreateFieldResolver(config) {
            var _a, _b;
            if ((_b = (_a = config.fieldConfig.extensions) === null || _a === void 0 ? void 0 : _a.nexus) === null || _b === void 0 ? void 0 : _b.config.skipNullGuard) {
                return;
            }
            const { type } = config.fieldConfig;
            const { outerNonNull, hasListNonNull } = nonNullInfo(type);
            if (outerNonNull || hasListNonNull) {
                return (root, args, ctx, info, next) => {
                    return plugin_1.plugin.completeValue(next(root, args, ctx, info), nonNullGuard(ctx, info, (0, graphql_1.isNonNullType)(type) ? type.ofType : type, config, finalPluginConfig, outerNonNull));
                };
            }
        },
        onAfterBuild(schema) {
            Object.keys(schema.getTypeMap()).forEach((typeName) => {
                const type = schema.getType(typeName);
                if ((0, graphql_1.isScalarType)(type)) {
                    if (fallbackValues[type.name]) {
                        return;
                    }
                    console.error(`No nullability guard was provided for Scalar ${type.name}. ` +
                        `Provide one in the nullabilityGuard config to remove this warning.`);
                }
            });
            if (pluginConfig.fallbackValues) {
                Object.keys(pluginConfig.fallbackValues).forEach((name) => {
                    const type = schema.getType(name);
                    if (!type) {
                        return console.error(`Unknown type ${name} provided in nullabilityGuard fallbackValues config.`);
                    }
                });
            }
        },
    });
};
exports.nullabilityGuardPlugin = nullabilityGuardPlugin;
const isNullish = (val) => val === null || val === undefined || val !== val;
const nonNullGuard = (ctx, info, type, config, pluginConfig, outerNonNull) => {
    const { onGuarded, fallbackValues, shouldGuard } = pluginConfig;
    const guardResult = (fallback) => {
        onGuarded({ ctx, info, type, fallback });
        return shouldGuard ? fallback : null;
    };
    return (val) => {
        // If it's a list type, return [] if the value is null,
        // otherwise recurse into resolving the individual type.
        if ((0, graphql_1.isListType)(type)) {
            if (isNullish(val)) {
                return outerNonNull ? guardResult([]) : null;
            }
            let hasPromise = false;
            const listMembers = [];
            const listCompleter = nonNullGuard(ctx, info, (0, graphql_1.isNonNullType)(type.ofType) ? type.ofType.ofType : type.ofType, config, pluginConfig, (0, graphql_1.isNonNullType)(type.ofType));
            (0, iterall_1.forEach)(val, (item) => {
                if (!hasPromise && (0, utils_1.isPromiseLike)(item)) {
                    hasPromise = true;
                }
                listMembers.push(plugin_1.plugin.completeValue(item, listCompleter));
            });
            return hasPromise ? Promise.all(listMembers) : listMembers;
        }
        if (!isNullish(val) || outerNonNull === false) {
            return val;
        }
        const typeName = type.name;
        const fallbackFn = fallbackValues[typeName];
        const fallbackValue = typeof fallbackFn === 'function' ? fallbackFn({ type, info, ctx }) : null;
        if (!isNullish(fallbackValue)) {
            return guardResult(fallbackValue);
        }
        // If it's an object, just return an empty object and let the scalar fallbacks take care of the rest
        if ((0, graphql_1.isObjectType)(type)) {
            return guardResult({});
        }
        // If it's an enum, return the first member
        if ((0, graphql_1.isEnumType)(type)) {
            return guardResult(type.getValues()[0].value);
        }
        // If It's a union or interface, return the first type
        if ((0, graphql_1.isUnionType)(type) || (0, graphql_1.isInterfaceType)(type)) {
            const possibleTypes = info.schema.getPossibleTypes(type);
            return guardResult({ __typename: possibleTypes[0].name });
        }
        // Otherwise, fail?
        return val;
    };
};
const nonNullInfo = (type) => {
    let outerNonNull = false;
    let hasListNonNull = false;
    if ((0, graphql_1.isNonNullType)(type)) {
        outerNonNull = true;
        type = type.ofType;
    }
    while ((0, graphql_1.isWrappingType)(type)) {
        type = type.ofType;
        if ((0, graphql_1.isNonNullType)(type)) {
            hasListNonNull = true;
        }
    }
    return {
        outerNonNull,
        hasListNonNull,
    };
};
//# sourceMappingURL=nullabilityGuardPlugin.js.map