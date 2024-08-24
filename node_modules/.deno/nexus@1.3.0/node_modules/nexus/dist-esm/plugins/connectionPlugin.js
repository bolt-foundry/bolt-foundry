import { __rest } from "tslib";
import { defaultFieldResolver } from 'graphql';
import { intArg, stringArg } from '../definitions/args';
import { nonNull } from '../definitions/nonNull';
import { nullable } from '../definitions/nullable';
import { objectType } from '../definitions/objectType';
import { applyNexusWrapping, } from '../definitions/wrapping';
import { dynamicOutputMethod } from '../dynamicMethod';
import { completeValue, plugin } from '../plugin';
import { eachObj, getOwnPackage, isPromiseLike, mapObj, pathToArray, printedGenTypingImport } from '../utils';
export const ForwardPaginateArgs = {
    first: nullable(intArg({ description: 'Returns the first n elements from the list.' })),
    after: nullable(stringArg({ description: 'Returns the elements in the list that come after the specified cursor' })),
};
export const ForwardOnlyStrictArgs = Object.assign(Object.assign({}, ForwardPaginateArgs), { first: nonNull(intArg({ description: 'Returns the first n elements from the list.' })) });
export const BackwardPaginateArgs = {
    last: nullable(intArg({ description: 'Returns the last n elements from the list.' })),
    before: nullable(stringArg({ description: 'Returns the elements in the list that come before the specified cursor' })),
};
export const BackwardOnlyStrictArgs = Object.assign(Object.assign({}, BackwardPaginateArgs), { last: nonNull(intArg({ description: 'Returns the last n elements from the list.' })) });
function base64Encode(str) {
    return Buffer.from(str, 'utf8').toString('base64');
}
function base64Decode(str) {
    return Buffer.from(str, 'base64').toString('utf8');
}
export const connectionPlugin = (connectionPluginConfig) => {
    var _a;
    const pluginConfig = Object.assign({}, connectionPluginConfig);
    // Define the plugin with the appropriate configuration.
    return plugin({
        name: 'ConnectionPlugin',
        fieldDefTypes: [
            printedGenTypingImport({
                module: (_a = connectionPluginConfig === null || connectionPluginConfig === void 0 ? void 0 : connectionPluginConfig.nexusSchemaImportId) !== null && _a !== void 0 ? _a : getOwnPackage().name,
                bindings: ['core', 'connectionPluginCore'],
            }),
        ],
        // Defines the field added to the definition block:
        // t.connectionField('users', {
        //   type: User
        // })
        onInstall(b) {
            let dynamicConfig = [];
            const { additionalArgs = {}, extendConnection: pluginExtendConnection, extendEdge: pluginExtendEdge, includeNodesField = false, nexusFieldName = 'connectionField', } = pluginConfig;
            // If to add fields to every connection, we require the resolver be defined on the
            // field definition, unless fromResolve: true is passed in the config
            if (pluginExtendConnection) {
                eachObj(pluginExtendConnection, (val, key) => {
                    dynamicConfig.push(`${key}${val.requireResolver === false ? '?:' : ':'} connectionPluginCore.ConnectionFieldResolver<TypeName, FieldName, "${key}">`);
                });
            }
            if (pluginExtendEdge) {
                const edgeFields = mapObj(pluginExtendEdge, (val, key) => `${key}${val.requireResolver === false ? '?:' : ':'} connectionPluginCore.EdgeFieldResolver<TypeName, FieldName, "${key}">`);
                dynamicConfig.push(`edgeFields: { ${edgeFields.join(', ')} }`);
            }
            let printedDynamicConfig = '';
            if (dynamicConfig.length > 0) {
                printedDynamicConfig = ` & { ${dynamicConfig.join(', ')} }`;
            }
            // Add the t.connectionField (or something else if we've changed the name)
            b.addType(dynamicOutputMethod({
                name: nexusFieldName,
                typeDescription: `
            Adds a Relay-style connection to the type, with numerous options for configuration

            @see https://nexusjs.org/docs/plugins/connection
          `,
                typeDefinition: `<FieldName extends string>(
      fieldName: FieldName,
      config: connectionPluginCore.ConnectionFieldConfig<TypeName, FieldName>${printedDynamicConfig}
    ): void`,
                factory({ typeName: parentTypeName, typeDef: t, args: factoryArgs, stage, builder, wrapping }) {
                    var _a, _b;
                    const [fieldName, fieldConfig] = factoryArgs;
                    const targetType = fieldConfig.type;
                    /* istanbul ignore if */
                    if (wrapping === null || wrapping === void 0 ? void 0 : wrapping.includes('List')) {
                        throw new Error(`Cannot chain .list with connectionField (on ${parentTypeName}.${fieldName})`);
                    }
                    const { targetTypeName, connectionName, edgeName } = getTypeNames(fieldName, parentTypeName, fieldConfig, pluginConfig);
                    if (stage === 'build') {
                        assertCorrectConfig(parentTypeName, fieldName, pluginConfig, fieldConfig);
                    }
                    // Add the "Connection" type to the schema if it doesn't exist already
                    if (!b.hasType(connectionName)) {
                        b.addType(objectType({
                            name: connectionName,
                            definition(t2) {
                                t2.list.field('edges', {
                                    type: edgeName,
                                    description: `https://facebook.github.io/relay/graphql/connections.htm#sec-Edge-Types`,
                                });
                                t2.nonNull.field('pageInfo', {
                                    type: 'PageInfo',
                                    description: `https://facebook.github.io/relay/graphql/connections.htm#sec-undefined.PageInfo`,
                                });
                                if (includeNodesField) {
                                    t2.list.field('nodes', {
                                        type: targetType,
                                        description: `Flattened list of ${targetTypeName} type`,
                                    });
                                }
                                if (pluginExtendConnection) {
                                    eachObj(pluginExtendConnection, (extensionFieldConfig, extensionFieldName) => {
                                        t2.field(extensionFieldName, extensionFieldConfig);
                                    });
                                }
                                provideSourceAndArgs(t2, () => {
                                    if (fieldConfig.extendConnection instanceof Function) {
                                        fieldConfig.extendConnection(t2);
                                    }
                                });
                            },
                            nonNullDefaults: (_a = fieldConfig.nonNullDefaults) !== null && _a !== void 0 ? _a : pluginConfig.nonNullDefaults,
                        }));
                    }
                    // Add the "Edge" type to the schema if it doesn't exist already
                    if (!b.hasType(edgeName)) {
                        b.addType(objectType({
                            name: edgeName,
                            definition(t2) {
                                t2.field('cursor', {
                                    type: cursorType !== null && cursorType !== void 0 ? cursorType : nonNull('String'),
                                    description: 'https://facebook.github.io/relay/graphql/connections.htm#sec-Cursor',
                                });
                                t2.field('node', {
                                    type: targetType,
                                    description: 'https://facebook.github.io/relay/graphql/connections.htm#sec-Node',
                                });
                                if (pluginExtendEdge) {
                                    eachObj(pluginExtendEdge, (val, key) => {
                                        t2.field(key, val);
                                    });
                                }
                                provideArgs(t2, () => {
                                    if (fieldConfig.extendEdge instanceof Function) {
                                        fieldConfig.extendEdge(t2);
                                    }
                                });
                            },
                            nonNullDefaults: (_b = fieldConfig.nonNullDefaults) !== null && _b !== void 0 ? _b : pluginConfig.nonNullDefaults,
                        }));
                    }
                    // Add the "PageInfo" type to the schema if it doesn't exist already
                    if (!b.hasType('PageInfo')) {
                        b.addType(objectType({
                            name: 'PageInfo',
                            description: 'PageInfo cursor, as defined in https://facebook.github.io/relay/graphql/connections.htm#sec-undefined.PageInfo',
                            definition(t2) {
                                t2.nonNull.field('hasNextPage', {
                                    type: 'Boolean',
                                    description: `Used to indicate whether more edges exist following the set defined by the clients arguments.`,
                                });
                                t2.nonNull.field('hasPreviousPage', {
                                    type: 'Boolean',
                                    description: `Used to indicate whether more edges exist prior to the set defined by the clients arguments.`,
                                });
                                t2.nullable.field('startCursor', {
                                    type: 'String',
                                    description: `The cursor corresponding to the first nodes in edges. Null if the connection is empty.`,
                                });
                                t2.nullable.field('endCursor', {
                                    type: 'String',
                                    description: `The cursor corresponding to the last nodes in edges. Null if the connection is empty.`,
                                });
                            },
                        }));
                    }
                    const { disableBackwardPagination, disableForwardPagination, validateArgs = defaultValidateArgs, strictArgs = true, cursorType, } = Object.assign(Object.assign({}, pluginConfig), fieldConfig);
                    let specArgs = {};
                    if (disableForwardPagination !== true && disableBackwardPagination !== true) {
                        specArgs = Object.assign(Object.assign({}, ForwardPaginateArgs), BackwardPaginateArgs);
                    }
                    else if (disableForwardPagination !== true) {
                        specArgs = strictArgs ? Object.assign({}, ForwardOnlyStrictArgs) : Object.assign({}, ForwardPaginateArgs);
                    }
                    else if (disableBackwardPagination !== true) {
                        specArgs = strictArgs ? Object.assign({}, BackwardOnlyStrictArgs) : Object.assign({}, BackwardPaginateArgs);
                    }
                    // If we have additional args,
                    let fieldAdditionalArgs = {};
                    if (fieldConfig.additionalArgs) {
                        if (additionalArgs && fieldConfig.inheritAdditionalArgs) {
                            fieldAdditionalArgs = Object.assign(Object.assign({}, additionalArgs), fieldConfig.additionalArgs);
                        }
                        else {
                            fieldAdditionalArgs = Object.assign({}, fieldConfig.additionalArgs);
                        }
                    }
                    else if (additionalArgs) {
                        fieldAdditionalArgs = Object.assign({}, additionalArgs);
                    }
                    const fieldArgs = Object.assign(Object.assign({}, fieldAdditionalArgs), specArgs);
                    let resolveFn;
                    if (fieldConfig.resolve) {
                        if (includeNodesField) {
                            resolveFn = (root, args, ctx, info) => {
                                return completeValue(fieldConfig.resolve(root, args, ctx, info), (val) => {
                                    if (val && val.nodes === undefined) {
                                        return withArgs(args, Object.assign({ get nodes() {
                                                return completeValue(val.edges, (edges) => edges.map((edge) => edge.node));
                                            } }, val));
                                    }
                                    return withArgs(args, Object.assign({}, val));
                                });
                            };
                        }
                        else {
                            resolveFn = fieldConfig.resolve;
                        }
                    }
                    else {
                        resolveFn = makeResolveFn(pluginConfig, fieldConfig);
                    }
                    let wrappedConnectionName = connectionName;
                    if (wrapping) {
                        if (typeof fieldConfig.nullable === 'boolean') {
                            throw new Error('[connectionPlugin]: You cannot chain .null/.nonNull and also set the nullable in the connectionField definition.');
                        }
                        wrappedConnectionName = applyNexusWrapping(connectionName, wrapping);
                    }
                    else {
                        if (fieldConfig.nullable === true) {
                            wrappedConnectionName = nullable(wrappedConnectionName);
                        }
                        else if (fieldConfig.nullable === false) {
                            wrappedConnectionName = nonNull(wrappedConnectionName);
                        }
                    }
                    // Add the field to the type.
                    t.field(fieldName, Object.assign(Object.assign({}, nonConnectionFieldProps(fieldConfig)), { args: fieldArgs, type: wrappedConnectionName, resolve(root, args, ctx, info) {
                            // TODO(2.0): Maybe switch the arguments around here to be consistent w/ resolver (breaking change)?
                            validateArgs(args, info, root, ctx);
                            return resolveFn(root, args, ctx, info);
                        } }));
                },
            }));
        },
    });
};
// Extract all of the non-connection related field config we may want to apply for plugin purposes
function nonConnectionFieldProps(fieldConfig) {
    const { additionalArgs, cursorFromNode, disableBackwardPagination, disableForwardPagination, extendConnection, extendEdge, inheritAdditionalArgs, nodes, pageInfoFromNodes, resolve, type, validateArgs, strictArgs, nullable } = fieldConfig, rest = __rest(fieldConfig, ["additionalArgs", "cursorFromNode", "disableBackwardPagination", "disableForwardPagination", "extendConnection", "extendEdge", "inheritAdditionalArgs", "nodes", "pageInfoFromNodes", "resolve", "type", "validateArgs", "strictArgs", "nullable"]);
    return rest;
}
export function makeResolveFn(pluginConfig, fieldConfig) {
    const mergedConfig = Object.assign(Object.assign({}, pluginConfig), fieldConfig);
    return (root, args, ctx, info) => {
        const { nodes: nodesResolve } = fieldConfig;
        const { decodeCursor = base64Decode, encodeCursor = base64Encode } = pluginConfig;
        const { pageInfoFromNodes = defaultPageInfoFromNodes, cursorFromNode = defaultCursorFromNode } = mergedConfig;
        if (!nodesResolve) {
            return null;
        }
        const formattedArgs = Object.assign({}, args);
        if (args.before) {
            formattedArgs.before = decodeCursor(args.before).replace(CURSOR_PREFIX, '');
        }
        if (args.after) {
            formattedArgs.after = decodeCursor(args.after).replace(CURSOR_PREFIX, '');
        }
        if (args.last && !args.before && cursorFromNode === defaultCursorFromNode) {
            throw new Error(`Cannot paginate backward without a "before" cursor by default.`);
        }
        // Local variable to cache the execution of fetching the nodes,
        // which is needed for all fields.
        let cachedNodes;
        let cachedEdges;
        let hasPromise = false;
        // Get all the nodes, before any pagination slicing
        const resolveAllNodes = () => {
            var _a;
            if (cachedNodes !== undefined) {
                return cachedNodes;
            }
            cachedNodes = completeValue((_a = nodesResolve(root, formattedArgs, ctx, info)) !== null && _a !== void 0 ? _a : null, (allNodes) => {
                return allNodes ? Array.from(allNodes) : allNodes;
            });
            return cachedNodes;
        };
        const resolveEdgesAndNodes = () => {
            if (cachedEdges !== undefined) {
                return cachedEdges;
            }
            cachedEdges = completeValue(resolveAllNodes(), (allNodes) => {
                if (!allNodes) {
                    const arrPath = JSON.stringify(pathToArray(info.path));
                    console.warn(`You resolved null/undefined from nodes() at path ${arrPath}, this is likely an error. Return an empty array to suppress this warning.`);
                    return { edges: [], nodes: [] };
                }
                const resolvedEdgeList = [];
                const resolvedNodeList = [];
                iterateNodes(allNodes, args, (maybeNode, i) => {
                    if (isPromiseLike(maybeNode)) {
                        hasPromise = true;
                        resolvedNodeList.push(maybeNode);
                        resolvedEdgeList.push(maybeNode.then((node) => {
                            return completeValue(cursorFromNode(maybeNode, formattedArgs, ctx, info, {
                                index: i,
                                nodes: allNodes,
                            }), (rawCursor) => wrapEdge(pluginConfig, fieldConfig, formattedArgs, {
                                cursor: encodeCursor(rawCursor),
                                node,
                            }));
                        }));
                    }
                    else {
                        resolvedNodeList.push(maybeNode);
                        resolvedEdgeList.push(wrapEdge(pluginConfig, fieldConfig, formattedArgs, {
                            node: maybeNode,
                            cursor: completeValue(cursorFromNode(maybeNode, formattedArgs, ctx, info, {
                                index: i,
                                nodes: allNodes,
                            }), (rawCursor) => encodeCursor(rawCursor)),
                        }));
                    }
                });
                if (hasPromise) {
                    return Promise.all([Promise.all(resolvedEdgeList), Promise.all(resolvedNodeList)]).then(([edges, nodes]) => ({ edges, nodes }));
                }
                return {
                    nodes: resolvedNodeList,
                    // todo find type-safe way of doing this
                    edges: resolvedEdgeList,
                };
            });
            return cachedEdges;
        };
        const resolvePageInfo = () => {
            return completeValue(resolveAllNodes(), (allNodes) => completeValue(resolveEdgesAndNodes(), ({ edges }) => completeValue(allNodes
                ? pageInfoFromNodes(allNodes, args, ctx, info)
                : {
                    hasNextPage: false,
                    hasPreviousPage: false,
                }, (basePageInfo) => {
                var _a, _b, _c;
                return (Object.assign(Object.assign({}, basePageInfo), { startCursor: ((_a = edges === null || edges === void 0 ? void 0 : edges[0]) === null || _a === void 0 ? void 0 : _a.cursor) ? edges[0].cursor : null, endCursor: (_c = (_b = edges === null || edges === void 0 ? void 0 : edges[edges.length - 1]) === null || _b === void 0 ? void 0 : _b.cursor) !== null && _c !== void 0 ? _c : null }));
            })));
        };
        const connectionResult = withSource(root, formattedArgs, {
            get nodes() {
                return completeValue(resolveEdgesAndNodes(), (o) => o.nodes);
            },
            get edges() {
                return completeValue(resolveEdgesAndNodes(), (o) => o.edges);
            },
            get pageInfo() {
                return resolvePageInfo();
            },
        });
        if (pluginConfig.extendConnection) {
            Object.keys(pluginConfig.extendConnection).forEach((connectionField) => {
                var _a;
                const resolve = (_a = fieldConfig[connectionField]) !== null && _a !== void 0 ? _a : defaultFieldResolver;
                Object.defineProperty(connectionResult, connectionField, {
                    value: (args, ctx, info) => {
                        return resolve(root, Object.assign(Object.assign({}, formattedArgs), args), ctx, info);
                    },
                });
            });
        }
        return connectionResult;
    };
}
function wrapEdge(pluginConfig, fieldConfig, formattedArgs, edgeParentType) {
    const edge = withArgs(formattedArgs, edgeParentType);
    if (pluginConfig.extendEdge) {
        Object.keys(pluginConfig.extendEdge).forEach((edgeField) => {
            var _a, _b;
            const resolve = (_b = (_a = fieldConfig.edgeFields) === null || _a === void 0 ? void 0 : _a[edgeField]) !== null && _b !== void 0 ? _b : defaultFieldResolver;
            Object.defineProperty(edge, edgeField, {
                value: (args, ctx, info) => {
                    return resolve(edge, Object.assign(Object.assign({}, formattedArgs), args), ctx, info);
                },
            });
        });
    }
    return edge;
}
/**
 * Adds __connectionArgs to the object representing the Connection type, so it can be accessed by other fields
 * in the top level
 *
 * @param args
 * @param connectionParentType
 */
function withArgs(args, connectionParentType) {
    Object.defineProperty(connectionParentType, '__connectionArgs', {
        value: args,
        enumerable: false,
    });
    return connectionParentType;
}
/**
 * Adds __connectionSource to the object representing the Connection type, so it can be accessed by other
 * fields in the top level
 *
 * @param args
 * @param connectionParentType
 */
function withSource(source, args, connectionParentType) {
    Object.defineProperty(connectionParentType, '__connectionSource', {
        value: source,
        enumerable: false,
    });
    return withArgs(args, connectionParentType);
}
/** Takes __connectionArgs from the source object and merges with the args provided by the */
function mergeArgs(obj, fieldArgs) {
    return Object.assign(Object.assign({}, obj.__connectionArgs), fieldArgs);
}
/**
 * Takes a "builder", and a function which takes a builder, and ensures that all fields defined within that
 * function invocation are provided the __connectionArgs defined by the connection
 */
function provideArgs(block, fn) {
    const fieldDef = block.field;
    block.field = function (...args) {
        let config = args.length === 2 ? Object.assign({ name: args[0] }, args[1]) : args[0];
        const { resolve = defaultFieldResolver } = config;
        fieldDef.call(this, Object.assign(Object.assign({}, config), { resolve(root, args, ctx, info) {
                return resolve(root, mergeArgs(root, args), ctx, info);
            } }));
    };
    fn();
    block.field = fieldDef;
}
function provideSourceAndArgs(block, fn) {
    const fieldDef = block.field;
    block.field = function (...args) {
        let config = args.length === 2 ? Object.assign({ name: args[0] }, args[1]) : args[0];
        const { resolve = defaultFieldResolver } = config;
        fieldDef.call(this, Object.assign(Object.assign({}, config), { resolve(root, args, ctx, info) {
                return resolve(root.__connectionSource, mergeArgs(root, args), ctx, info);
            } }));
    };
    fn();
    block.field = fieldDef;
}
function iterateNodes(nodes, args, cb) {
    // If we want the first N of an array of nodes, it's pretty straightforward.
    if (typeof args.first === 'number') {
        const len = Math.min(args.first, nodes.length);
        for (let i = 0; i < len; i++) {
            cb(nodes[i], i);
        }
    }
    else if (typeof args.last === 'number') {
        const len = Math.min(args.last, nodes.length);
        for (let i = 0; i < len; i++) {
            cb(nodes[i], i);
        }
    }
    else {
        // Only happens if we have a custom validateArgs that ignores first/last
        for (let i = 0; i < nodes.length; i++) {
            cb(nodes[i], i);
        }
    }
}
function defaultPageInfoFromNodes(nodes, args) {
    return {
        hasNextPage: defaultHasNextPage(nodes, args),
        hasPreviousPage: defaultHasPreviousPage(nodes, args),
    };
}
function defaultHasNextPage(nodes, args) {
    // If we're paginating forward, and we don't have an "after", we'll assume that we don't have
    // a previous page, otherwise we will assume we have one, unless the after cursor === "0".
    if (typeof args.first === 'number') {
        return nodes.length > args.first;
    }
    // If we're paginating backward, and there are as many results as we asked for, then we'll assume
    // that we have a previous page
    if (typeof args.last === 'number') {
        if (args.before && args.before !== '0') {
            return true;
        }
        return false;
    }
    /* istanbul ignore next */
    throw new Error('Unreachable');
}
/** A sensible default for determining "previous page". */
function defaultHasPreviousPage(nodes, args) {
    // If we're paginating forward, and we don't have an "after", we'll assume that we don't have
    // a previous page, otherwise we will assume we have one, unless the after cursor === "0".
    if (typeof args.first === 'number') {
        if (args.after && args.after !== '0') {
            return true;
        }
        return false;
    }
    // If we're paginating backward, and there are as many results as we asked for, then we'll assume
    // that we have a previous page
    if (typeof args.last === 'number') {
        return nodes.length >= args.last;
    }
    /* istanbul ignore next */
    throw new Error('Unreachable');
}
const CURSOR_PREFIX = 'cursor:';
// Assumes we're only paginating in one direction.
function defaultCursorFromNode(node, args, ctx, info, { index, nodes }) {
    let cursorIndex = index;
    // If we're paginating forward, assume we're incrementing from the offset provided via "after",
    // e.g. [0...20] (first: 5, after: "cursor:5") -> [cursor:6, cursor:7, cursor:8, cursor:9, cursor: 10]
    if (typeof args.first === 'number') {
        if (args.after) {
            const offset = parseInt(args.after, 10);
            cursorIndex = offset + index + 1;
        }
    }
    // If we're paginating backward, assume we're working backward from the assumed length
    // e.g. [0...20] (last: 5, before: "cursor:20") -> [cursor:15, cursor:16, cursor:17, cursor:18, cursor:19]
    if (typeof args.last === 'number') {
        if (args.before) {
            const offset = parseInt(args.before, 10);
            const len = Math.min(nodes.length, args.last);
            cursorIndex = offset - len + index;
        }
        else {
            /* istanbul ignore next */
            throw new Error('Unreachable');
        }
    }
    return `${CURSOR_PREFIX}${cursorIndex}`;
}
const getTypeNames = (fieldName, parentTypeName, fieldConfig, pluginConfig) => {
    const targetTypeName = typeof fieldConfig.type === 'string' ? fieldConfig.type : fieldConfig.type.name;
    // If we have changed the config specific to this field, on either the connection,
    // edge, or page info, then we need a custom type for the connection & edge.
    let connectionName;
    if (fieldConfig.getConnectionName) {
        connectionName = fieldConfig.getConnectionName(fieldName, parentTypeName);
    }
    else if (pluginConfig.getConnectionName) {
        connectionName = pluginConfig.getConnectionName(fieldName, parentTypeName);
    }
    else if (isConnectionFieldExtended(fieldConfig)) {
        connectionName = `${parentTypeName}${upperFirst(fieldName)}_Connection`;
    }
    else {
        connectionName = `${pluginConfig.typePrefix || ''}${targetTypeName}Connection`;
    }
    // If we have modified the "edge" at all, then we need
    let edgeName;
    if (fieldConfig.getEdgeName) {
        edgeName = fieldConfig.getEdgeName(fieldName, parentTypeName);
    }
    else if (pluginConfig.getEdgeName) {
        edgeName = pluginConfig.getEdgeName(fieldName, parentTypeName);
    }
    else if (isEdgeFieldExtended(fieldConfig)) {
        edgeName = `${parentTypeName}${upperFirst(fieldName)}_Edge`;
    }
    else {
        edgeName = `${pluginConfig.typePrefix || ''}${targetTypeName}Edge`;
    }
    return {
        edgeName,
        targetTypeName,
        connectionName,
    };
};
const isConnectionFieldExtended = (fieldConfig) => {
    if (fieldConfig.extendConnection || isEdgeFieldExtended(fieldConfig)) {
        return true;
    }
    return false;
};
const isEdgeFieldExtended = (fieldConfig) => {
    if (fieldConfig.extendEdge || fieldConfig.cursorType) {
        return true;
    }
    return false;
};
const upperFirst = (fieldName) => {
    return fieldName.slice(0, 1).toUpperCase().concat(fieldName.slice(1));
};
// Add some sanity checking beyond the normal type checks.
const assertCorrectConfig = (typeName, fieldName, pluginConfig, fieldConfig) => {
    if (typeof fieldConfig.nodes !== 'function' && typeof fieldConfig.resolve !== 'function') {
        console.error(new Error(`Nexus Connection Plugin: Missing nodes or resolve property for ${typeName}.${fieldName}`));
    }
    eachObj(pluginConfig.extendConnection || {}, (val, key) => {
        if (typeof fieldConfig[key] !== 'function' && val.requireResolver !== false) {
            console.error(new Error(`Nexus Connection Plugin: Missing ${key} resolver property for ${typeName}.${fieldName}. Set requireResolver to "false" on the field config if you do not need a resolver.`));
        }
    });
    eachObj(pluginConfig.extendEdge || {}, (val, key) => {
        var _a;
        if (typeof ((_a = fieldConfig.edgeFields) === null || _a === void 0 ? void 0 : _a[key]) !== 'function' && val.requireResolver !== false) {
            console.error(new Error(`Nexus Connection Plugin: Missing edgeFields.${key} resolver property for ${typeName}.${fieldName}. Set requireResolver to "false" on the edge field config if you do not need a resolver.`));
        }
    });
};
function defaultValidateArgs(args = {}, info) {
    if (!(args.first || args.first === 0) && !(args.last || args.last === 0)) {
        throw new Error(`The ${info.parentType}.${info.fieldName} connection field requires a "first" or "last" argument`);
    }
    if (args.first && args.last) {
        throw new Error(`The ${info.parentType}.${info.fieldName} connection field requires a "first" or "last" argument, not both`);
    }
    if (args.first && args.before) {
        throw new Error(`The ${info.parentType}.${info.fieldName} connection field does not allow a "before" argument with "first"`);
    }
    if (args.last && args.after) {
        throw new Error(`The ${info.parentType}.${info.fieldName} connection field does not allow a "last" argument with "after"`);
    }
}
// Provided for use if you create a custom implementation and want to call the original.
connectionPlugin.defaultCursorFromNode = defaultCursorFromNode;
connectionPlugin.defaultValidateArgs = defaultValidateArgs;
connectionPlugin.defaultHasPreviousPage = defaultHasPreviousPage;
connectionPlugin.defaultHasNextPage = defaultHasNextPage;
connectionPlugin.base64Encode = base64Encode;
connectionPlugin.base64Decode = base64Decode;
connectionPlugin.CURSOR_PREFIX = CURSOR_PREFIX;
//# sourceMappingURL=connectionPlugin.js.map