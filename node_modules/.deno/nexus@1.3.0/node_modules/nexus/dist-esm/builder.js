import { __rest } from "tslib";
import { assertValidName, defaultFieldResolver, GraphQLBoolean, GraphQLEnumType, GraphQLFloat, GraphQLID, GraphQLInputObjectType, GraphQLInt, GraphQLInterfaceType, GraphQLNonNull, GraphQLObjectType, GraphQLScalarType, GraphQLSchema, GraphQLString, GraphQLUnionType, isInputObjectType, isInputType, isInterfaceType, isLeafType, isNamedType, isObjectType, isOutputType, isSchema, isWrappingType, } from 'graphql';
import { InputDefinitionBlock, } from './definitions/definitionBlocks';
import { InterfaceDefinitionBlock, } from './definitions/interfaceType';
import { ObjectDefinitionBlock } from './definitions/objectType';
import { UnionDefinitionBlock } from './definitions/unionType';
import { finalizeWrapping, isNexusDynamicInputMethod, isNexusDynamicOutputMethod, isNexusDynamicOutputProperty, isNexusEnumTypeDef, isNexusExtendInputTypeDef, isNexusExtendTypeDef, isNexusInputObjectTypeDef, isNexusInterfaceTypeDef, isNexusNamedInputTypeDef, isNexusNamedOuputTypeDef, isNexusNamedTypeDef, isNexusObjectTypeDef, isNexusPlugin, isNexusScalarTypeDef, isNexusUnionTypeDef, isNexusWrappingType, normalizeArgWrapping, rewrapAsGraphQLType, unwrapGraphQLDef, unwrapNexusDef, } from './definitions/wrapping';
import { hasNexusExtension, NexusFieldExtension, NexusInputObjectTypeExtension, NexusInterfaceTypeExtension, NexusObjectTypeExtension, NexusSchemaExtension, } from './extensions';
import { messages } from './messages';
import { composeMiddlewareFns, } from './plugin';
import { declarativeWrappingPlugin } from './plugins';
import { fieldAuthorizePlugin } from './plugins/fieldAuthorizePlugin';
import { casesHandled, consoleWarn, eachObj, getArgNamedType, getNexusNamedType, graphql15InterfaceType, invariantGuard, isArray, isObject, objValues, UNKNOWN_TYPE_SCALAR, } from './utils';
import { NEXUS_BUILD, isNexusMetaBuild, isNexusMeta, isNexusMetaType, resolveNexusMetaType, } from './definitions/nexusMeta';
import { rebuildNamedType } from './rebuildType';
const SCALARS = {
    String: GraphQLString,
    Int: GraphQLInt,
    Float: GraphQLFloat,
    ID: GraphQLID,
    Boolean: GraphQLBoolean,
};
/**
 * Builds all of the types, properly accounts for any using "mix". Since the enum types are resolved
 * synchronously, these need to guard for circular references at this step, while fields will guard for it
 * during lazy evaluation.
 */
export class SchemaBuilder {
    constructor(config) {
        /** All objects containing a NEXUS_BUILD / NEXUS_TYPE symbol */
        this.nexusMetaObjects = new Set();
        /** Used to check for circular references. */
        this.buildingTypes = new Set();
        /** The "final type" map contains all types as they are built. */
        this.finalTypeMap = {};
        /**
         * The "defined type" map keeps track of all of the types that were defined directly as `GraphQL*Type`
         * objects, so we don't accidentally overwrite any.
         */
        this.definedTypeMap = {};
        /**
         * The "pending type" map keeps track of all types that were defined w/ GraphQL Nexus and haven't been
         * processed into concrete types yet.
         */
        this.pendingTypeMap = {};
        /** All "extensions" to types (adding fields on types from many locations) */
        this.typeExtendMap = {};
        /** All "extensions" to input types (adding fields on types from many locations) */
        this.inputTypeExtendMap = {};
        /**
         * When we encounter "named" types from graphql-js, we keep them separate from Nexus definitions. This way
         * we can have Nexus definitions take precedence without worrying about conflicts, particularly when we're
         * looking to override behavior from inherited types.
         */
        this.graphqlNamedTypeMap = {};
        /**
         * If we're merging against a remote schema, the types from the schema are kept here, for fallbacks /
         * merging when we're building the actual Schema
         */
        this.graphqlMergeSchemaMap = {};
        this.dynamicInputFields = {};
        this.dynamicOutputFields = {};
        this.dynamicOutputProperties = {};
        this.plugins = [];
        /** All types that need to be traversed for children types */
        this.typesToWalk = [];
        /** Root type mapping information annotated on the type definitions */
        this.sourceTypings = {};
        /** Array of missing types */
        this.missingTypes = {};
        /** Created just before types are walked, this keeps track of all of the resolvers */
        this.onMissingTypeFns = [];
        /** Executed just before types are walked */
        this.onBeforeBuildFns = [];
        /** Executed as the field resolvers are included on the field */
        this.onCreateResolverFns = [];
        /** Executed as the field "subscribe" fields are included on the schema */
        this.onCreateSubscribeFns = [];
        /** Executed after the schema is constructed, for any final verification */
        this.onAfterBuildFns = [];
        /** Executed after the object is defined, allowing us to add additional fields to the object */
        this.onObjectDefinitionFns = [];
        /** Executed after the object is defined, allowing us to add additional fields to the object */
        this.onInputObjectDefinitionFns = [];
        /** Called immediately after the field is defined, allows for using metadata to define the shape of the field. */
        this.onAddArgFns = [];
        /** Called immediately after the field is defined, allows for using metadata to define the shape of the field. */
        this.onAddOutputFieldFns = [];
        /** Called immediately after the field is defined, allows for using metadata to define the shape of the field. */
        this.onAddInputFieldFns = [];
        this.setConfigOption = (key, value) => {
            this.config = Object.assign(Object.assign({}, this.config), { [key]: value });
        };
        this.hasConfigOption = (key) => {
            return this.config.hasOwnProperty(key);
        };
        this.getConfigOption = (key) => {
            return this.config[key];
        };
        this.hasType = (typeName) => {
            return Boolean(this.pendingTypeMap[typeName] ||
                this.finalTypeMap[typeName] ||
                this.graphqlNamedTypeMap[typeName] ||
                this.graphqlMergeSchemaMap[typeName]);
        };
        /**
         * Add type takes a Nexus type, or a GraphQL type and pulls it into an internal "type registry". It also
         * does an initial pass on any types that are referenced on the "types" field and pulls those in too, so
         * you can define types anonymously, without exporting them.
         */
        this.addType = (typeDef) => {
            var _a, _b, _c;
            if (isNexusDynamicInputMethod(typeDef)) {
                this.dynamicInputFields[typeDef.name] = typeDef;
                return;
            }
            if (isNexusDynamicOutputMethod(typeDef)) {
                this.dynamicOutputFields[typeDef.name] = typeDef;
                return;
            }
            if (isNexusDynamicOutputProperty(typeDef)) {
                this.dynamicOutputProperties[typeDef.name] = typeDef;
                return;
            }
            if (isNexusMeta(typeDef)) {
                this.addToNexusMeta(typeDef);
                return;
            }
            // Don't worry about internal types.
            if ((_a = typeDef.name) === null || _a === void 0 ? void 0 : _a.startsWith('__')) {
                return;
            }
            if (isNexusExtendTypeDef(typeDef)) {
                const typeExtensions = (this.typeExtendMap[typeDef.name] = this.typeExtendMap[typeDef.name] || []);
                typeExtensions.push(typeDef.value);
                this.typesToWalk.push({ type: 'object', value: typeDef.value });
                return;
            }
            if (isNexusExtendInputTypeDef(typeDef)) {
                const typeExtensions = (this.inputTypeExtendMap[typeDef.name] =
                    this.inputTypeExtendMap[typeDef.name] || []);
                typeExtensions.push(typeDef.value);
                this.typesToWalk.push({ type: 'input', value: typeDef.value });
                return;
            }
            // Check the "defined" type map for existing Nexus types. We are able to conflict with external types,
            // as we assume that locally defined types take precedence.
            const existingType = this.pendingTypeMap[typeDef.name];
            // If we already have a "Nexus" type, but it's not the same, trigger mark as an error,
            // otherwise early exit
            if (existingType) {
                if (existingType !== typeDef) {
                    throw extendError(typeDef.name);
                }
                return;
            }
            if (isNexusNamedTypeDef(typeDef)) {
                if (isNexusNamedOuputTypeDef(typeDef) && typeDef.value.asNexusMethod) {
                    this.dynamicOutputFields[typeDef.value.asNexusMethod] = typeDef.name;
                }
                if (isNexusNamedInputTypeDef(typeDef) && typeDef.value.asNexusMethod) {
                    this.dynamicInputFields[typeDef.value.asNexusMethod] = typeDef.name;
                }
                if (isNexusScalarTypeDef(typeDef) && typeDef.value.sourceType) {
                    this.sourceTypings[typeDef.name] = typeDef.value.sourceType;
                }
            }
            // If it's a concrete GraphQL type, we handle it directly by convering the
            // type to a Nexus structure, and capturing all of the referenced types
            // while we're reconstructing.
            if (isNamedType(typeDef)) {
                // If we've already captured the named type, we can skip it
                if (this.graphqlNamedTypeMap[typeDef.name]) {
                    return;
                }
                // If we've used decorateType to wrap, then we can grab the types off
                if ((_b = typeDef.extensions) === null || _b === void 0 ? void 0 : _b.nexus) {
                    const { asNexusMethod, sourceType } = Object(typeDef.extensions.nexus);
                    if (asNexusMethod) {
                        if (isInputType(typeDef)) {
                            this.dynamicInputFields[asNexusMethod] = typeDef.name;
                        }
                        if (isOutputType(typeDef)) {
                            this.dynamicOutputFields[asNexusMethod] = typeDef.name;
                        }
                    }
                    if (sourceType) {
                        this.sourceTypings[typeDef.name] = sourceType;
                    }
                }
                this.graphqlNamedTypeMap[typeDef.name] = this.handleNativeType(typeDef, {
                    captureLeafType: (t) => {
                        if (!this.graphqlNamedTypeMap[t.name] && t.name !== typeDef.name) {
                            this.addType(t);
                        }
                    },
                });
                if ((_c = typeDef.extensions) === null || _c === void 0 ? void 0 : _c.nexus) {
                    this.addType(this.graphqlNamedTypeMap[typeDef.name]);
                }
                return;
            }
            this.pendingTypeMap[typeDef.name] = typeDef;
            if (isNexusInputObjectTypeDef(typeDef)) {
                this.typesToWalk.push({ type: 'input', value: typeDef.value });
            }
            if (isNexusObjectTypeDef(typeDef)) {
                this.typesToWalk.push({ type: 'object', value: typeDef.value });
            }
            if (isNexusInterfaceTypeDef(typeDef)) {
                this.typesToWalk.push({ type: 'interface', value: typeDef.value });
            }
        };
        this.config = setConfigDefaults(config);
        /** This array of plugin is used to keep retro-compatibility w/ older versions of nexus */
        this.plugins = this.config.plugins.length > 0 ? this.config.plugins : [fieldAuthorizePlugin()];
        if (!this.plugins.find((f) => f.config.name === 'declarativeWrapping')) {
            this.plugins.push(declarativeWrappingPlugin({ disable: true }));
        }
        this.builderLens = Object.freeze({
            hasType: this.hasType,
            addType: this.addType,
            setConfigOption: this.setConfigOption,
            hasConfigOption: this.hasConfigOption,
            getConfigOption: this.getConfigOption,
        });
        if (config.mergeSchema) {
            this.graphqlMergeSchemaMap = this.handleMergeSchema(config.mergeSchema);
        }
    }
    get schemaExtension() {
        /* istanbul ignore next */
        if (!this._schemaExtension) {
            throw new Error('Cannot reference schemaExtension before it is created');
        }
        return this._schemaExtension;
    }
    addTypes(types) {
        var _a, _b;
        if (!types) {
            return;
        }
        if (isSchema(types)) {
            if (((_a = this.config.mergeSchema) === null || _a === void 0 ? void 0 : _a.schema) === types) {
                return;
            }
            else if (!this.config.mergeSchema) {
                if (Object.keys(this.graphqlMergeSchemaMap).length) {
                    console.error(new Error(`It looks like you're trying to merge multiple GraphQL schemas.\n Please open a GitHub ticket with more info about your use case.`));
                }
                this.graphqlMergeSchemaMap = this.handleMergeSchema({ schema: types });
            }
            else {
                this.addTypes(types.getTypeMap());
            }
            return;
        }
        if (isNexusPlugin(types)) {
            if (!((_b = this.plugins) === null || _b === void 0 ? void 0 : _b.includes(types))) {
                throw new Error(`Nexus plugin ${types.config.name} was seen in the "types" config, but should instead be provided to the "plugins" array.`);
            }
            return;
        }
        if (isNexusNamedTypeDef(types) ||
            isNexusExtendTypeDef(types) ||
            isNexusExtendInputTypeDef(types) ||
            isNamedType(types) ||
            isNexusDynamicInputMethod(types) ||
            isNexusDynamicOutputMethod(types) ||
            isNexusDynamicOutputProperty(types) ||
            isNexusMeta(types)) {
            this.addType(types);
        }
        else if (Array.isArray(types)) {
            types.forEach((typeDef) => this.addTypes(typeDef));
        }
        else if (isObject(types)) {
            Object.keys(types).forEach((key) => this.addTypes(types[key]));
        }
    }
    addToNexusMeta(type) {
        if (this.nexusMetaObjects.has(type)) {
            return;
        }
        this.nexusMetaObjects.add(type);
        if (isNexusMetaBuild(type)) {
            const types = type[NEXUS_BUILD]();
            this.addTypes(types);
        }
        if (isNexusMetaType(type)) {
            this.addType(resolveNexusMetaType(type));
        }
    }
    walkTypes() {
        let obj;
        while ((obj = this.typesToWalk.shift())) {
            switch (obj.type) {
                case 'input':
                    this.walkInputType(obj.value);
                    break;
                case 'interface':
                    this.walkInterfaceType(obj.value);
                    break;
                case 'object':
                    this.walkOutputType(obj.value);
                    break;
                default:
                    casesHandled(obj);
            }
        }
    }
    beforeWalkTypes() {
        this.plugins.forEach((obj, i) => {
            if (!isNexusPlugin(obj)) {
                throw new Error(`Expected a plugin in plugins[${i}], saw ${obj}`);
            }
            const { config: pluginConfig } = obj;
            if (pluginConfig.onInstall) {
                // TODO(tim): remove anys/warning at 1.0
                const installResult = pluginConfig.onInstall(this.builderLens);
                if (Array.isArray(installResult === null || installResult === void 0 ? void 0 : installResult.types)) {
                    throw new Error(`Nexus no longer supports a return value from onInstall, you should instead use the hasType/addType api (seen in plugin ${pluginConfig.name}). `);
                }
            }
            if (pluginConfig.onCreateFieldResolver) {
                this.onCreateResolverFns.push(pluginConfig.onCreateFieldResolver);
            }
            if (pluginConfig.onCreateFieldSubscribe) {
                this.onCreateSubscribeFns.push(pluginConfig.onCreateFieldSubscribe);
            }
            if (pluginConfig.onBeforeBuild) {
                this.onBeforeBuildFns.push(pluginConfig.onBeforeBuild);
            }
            if (pluginConfig.onMissingType) {
                this.onMissingTypeFns.push(pluginConfig.onMissingType);
            }
            if (pluginConfig.onAfterBuild) {
                this.onAfterBuildFns.push(pluginConfig.onAfterBuild);
            }
            if (pluginConfig.onObjectDefinition) {
                this.onObjectDefinitionFns.push(pluginConfig.onObjectDefinition);
            }
            if (pluginConfig.onAddOutputField) {
                this.onAddOutputFieldFns.push(pluginConfig.onAddOutputField);
            }
            if (pluginConfig.onAddInputField) {
                this.onAddInputFieldFns.push(pluginConfig.onAddInputField);
            }
            if (pluginConfig.onAddArg) {
                this.onAddArgFns.push(pluginConfig.onAddArg);
            }
            if (pluginConfig.onInputObjectDefinition) {
                this.onInputObjectDefinitionFns.push(pluginConfig.onInputObjectDefinition);
            }
        });
    }
    beforeBuildTypes() {
        this.onBeforeBuildFns.forEach((fn) => {
            fn(this.builderLens);
            if (this.typesToWalk.length > 0) {
                this.walkTypes();
            }
        });
    }
    checkForInterfaceCircularDependencies() {
        const interfaces = {};
        Object.keys(this.pendingTypeMap)
            .map((key) => this.pendingTypeMap[key])
            .filter(isNexusInterfaceTypeDef)
            .forEach((type) => {
            interfaces[type.name] = type.value;
        });
        const alreadyChecked = {};
        const walkType = (obj, path, visited) => {
            if (alreadyChecked[obj.name]) {
                return;
            }
            if (visited[obj.name]) {
                if (obj.name === path[path.length - 1]) {
                    throw new Error(`GraphQL Nexus: Interface ${obj.name} can't implement itself`);
                }
                else {
                    throw new Error(`GraphQL Nexus: Interface circular dependency detected ${[
                        ...path.slice(path.lastIndexOf(obj.name)),
                        obj.name,
                    ].join(' -> ')}`);
                }
            }
            const definitionBlock = new InterfaceDefinitionBlock({
                typeName: obj.name,
                addInterfaces: (i) => i.forEach((config) => {
                    const name = typeof config === 'string' ? config : config.value.name;
                    walkType(interfaces[name], [...path, obj.name], Object.assign(Object.assign({}, visited), { [obj.name]: true }));
                }),
                addModification: () => { },
                addField: () => { },
                addDynamicOutputMembers: (block, wrapping) => this.addDynamicOutputMembers(block, 'walk', wrapping),
                warn: () => { },
            });
            obj.definition(definitionBlock);
            alreadyChecked[obj.name] = true;
        };
        Object.keys(interfaces).forEach((name) => {
            walkType(interfaces[name], [], {});
        });
    }
    buildNexusTypes() {
        var _a;
        // If Query isn't defined, set it to null so it falls through to "missingType"
        if (!this.pendingTypeMap.Query && !((_a = this.config.schemaRoots) === null || _a === void 0 ? void 0 : _a.query) && !this.typeExtendMap.Query) {
            this.pendingTypeMap.Query = null;
        }
        Object.keys(this.pendingTypeMap).forEach((key) => {
            if (this.typesToWalk.length > 0) {
                this.walkTypes();
            }
            // If we've already constructed the type by this point,
            // via circular dependency resolution don't worry about building it.
            if (this.finalTypeMap[key]) {
                return;
            }
            if (this.definedTypeMap[key]) {
                throw extendError(key);
            }
            this.finalTypeMap[key] = this.getOrBuildType(key);
            this.buildingTypes.clear();
        });
        Object.keys(this.typeExtendMap).forEach((key) => {
            // If we haven't defined the type, assume it's an object type
            if (this.typeExtendMap[key] !== null && !this.hasType(key)) {
                this.buildObjectType({
                    name: key,
                    definition() { },
                });
            }
        });
        Object.keys(this.inputTypeExtendMap).forEach((key) => {
            // If we haven't defined the type, assume it's an input object type
            if (this.inputTypeExtendMap[key] !== null && !this.hasType(key)) {
                this.buildInputObjectType({
                    name: key,
                    definition() { },
                });
            }
        });
    }
    createSchemaExtension() {
        this._schemaExtension = new NexusSchemaExtension(Object.assign(Object.assign({}, this.config), { dynamicFields: {
                dynamicInputFields: this.dynamicInputFields,
                dynamicOutputFields: this.dynamicOutputFields,
                dynamicOutputProperties: this.dynamicOutputProperties,
            }, sourceTypings: this.sourceTypings }));
    }
    getFinalTypeMap() {
        this.beforeWalkTypes();
        this.createSchemaExtension();
        this.walkTypes();
        this.beforeBuildTypes();
        this.checkForInterfaceCircularDependencies();
        this.buildNexusTypes();
        return {
            finalConfig: this.config,
            typeMap: this.finalTypeMap,
            schemaExtension: this.schemaExtension,
            missingTypes: this.missingTypes,
            onAfterBuildFns: this.onAfterBuildFns,
        };
    }
    shouldMerge(typeName) {
        if (!this.config.mergeSchema) {
            return false;
        }
        const { mergeTypes = ['Query', 'Mutation'] } = this.config.mergeSchema;
        return Boolean(mergeTypes === true || mergeTypes.includes(typeName));
    }
    buildInputObjectType(config) {
        const fields = [];
        const definitionBlock = new InputDefinitionBlock({
            typeName: config.name,
            addField: (field) => fields.push(this.addInputField(field)),
            addDynamicInputFields: (block, wrapping) => this.addDynamicInputFields(block, wrapping),
            warn: consoleWarn,
        });
        const externalNamedType = this.graphqlMergeSchemaMap[config.name];
        if (this.shouldMerge(config.name) && isNexusInputObjectTypeDef(externalNamedType)) {
            externalNamedType.value.definition(definitionBlock);
        }
        config.definition(definitionBlock);
        this.onInputObjectDefinitionFns.forEach((fn) => {
            fn(definitionBlock, config);
        });
        const extensions = this.inputTypeExtendMap[config.name];
        if (extensions) {
            extensions.forEach((extension) => {
                extension.definition(definitionBlock);
            });
        }
        this.inputTypeExtendMap[config.name] = null;
        const inputObjectTypeConfig = {
            name: config.name,
            fields: () => this.buildInputObjectFields(fields, inputObjectTypeConfig),
            description: config.description,
            extensions: Object.assign(Object.assign({}, config.extensions), { nexus: new NexusInputObjectTypeExtension(config) }),
        };
        return this.finalize(new GraphQLInputObjectType(inputObjectTypeConfig));
    }
    buildObjectType(config) {
        const fields = [];
        const interfaces = [];
        const modifications = {};
        const definitionBlock = new ObjectDefinitionBlock({
            typeName: config.name,
            addField: (fieldDef) => fields.push(this.addOutputField(fieldDef)),
            addInterfaces: (interfaceDefs) => interfaces.push(...interfaceDefs),
            addModification: (modification) => (modifications[modification.field] = modification),
            addDynamicOutputMembers: (block, wrapping) => this.addDynamicOutputMembers(block, 'build', wrapping),
            warn: consoleWarn,
        });
        const externalNamedType = this.graphqlMergeSchemaMap[config.name];
        if (this.shouldMerge(config.name) && isNexusObjectTypeDef(externalNamedType)) {
            externalNamedType.value.definition(definitionBlock);
        }
        config.definition(definitionBlock);
        this.onObjectDefinitionFns.forEach((fn) => {
            fn(definitionBlock, config);
        });
        const extensions = this.typeExtendMap[config.name];
        if (extensions) {
            extensions.forEach((extension) => {
                extension.definition(definitionBlock);
            });
        }
        this.typeExtendMap[config.name] = null;
        if (config.sourceType) {
            this.sourceTypings[config.name] = config.sourceType;
        }
        const objectTypeConfig = {
            name: config.name,
            interfaces: () => this.buildInterfaceList(interfaces),
            description: config.description,
            fields: () => this.buildOutputFields(fields, objectTypeConfig, this.buildInterfaceFields(objectTypeConfig, interfaces, modifications)),
            isTypeOf: config.isTypeOf,
            extensions: Object.assign(Object.assign({}, config.extensions), { nexus: new NexusObjectTypeExtension(config) }),
        };
        return this.finalize(new GraphQLObjectType(objectTypeConfig));
    }
    buildInterfaceType(config) {
        const { name, description } = config;
        let resolveType = config.resolveType;
        const fields = [];
        const interfaces = [];
        const modifications = {};
        const definitionBlock = new InterfaceDefinitionBlock({
            typeName: config.name,
            addField: (field) => fields.push(this.addOutputField(field)),
            addInterfaces: (interfaceDefs) => interfaces.push(...interfaceDefs),
            addModification: (modification) => (modifications[modification.field] = modification),
            addDynamicOutputMembers: (block, wrapping) => this.addDynamicOutputMembers(block, 'build', wrapping),
            warn: consoleWarn,
        });
        const externalNamedType = this.graphqlMergeSchemaMap[config.name];
        if (this.shouldMerge(config.name) && isNexusInterfaceTypeDef(externalNamedType)) {
            externalNamedType.value.definition(definitionBlock);
        }
        config.definition(definitionBlock);
        if (config.sourceType) {
            this.sourceTypings[config.name] = config.sourceType;
        }
        const interfaceTypeConfig = {
            name,
            interfaces: () => this.buildInterfaceList(interfaces),
            resolveType,
            description,
            fields: () => this.buildOutputFields(fields, interfaceTypeConfig, this.buildInterfaceFields(interfaceTypeConfig, interfaces, modifications)),
            extensions: Object.assign(Object.assign({}, config.extensions), { nexus: new NexusInterfaceTypeExtension(config) }),
        };
        return this.finalize(new GraphQLInterfaceType(interfaceTypeConfig));
    }
    addOutputField(field) {
        this.onAddOutputFieldFns.forEach((fn) => {
            const result = fn(field);
            if (result) {
                field = result;
            }
        });
        return field;
    }
    addInputField(field) {
        this.onAddInputFieldFns.forEach((fn) => {
            const result = fn(field);
            if (result) {
                field = result;
            }
        });
        return field;
    }
    buildEnumType(config) {
        var _a, _b;
        const { members } = config;
        const values = {};
        if (isArray(members)) {
            members.forEach((m) => {
                var _a, _b;
                if (typeof m === 'string') {
                    values[m] = { value: m };
                }
                else {
                    values[m.name] = {
                        value: typeof m.value === 'undefined' ? m.name : m.value,
                        deprecationReason: m.deprecation,
                        description: m.description,
                        extensions: Object.assign(Object.assign({}, m.extensions), { nexus: (_b = (_a = m.extensions) === null || _a === void 0 ? void 0 : _a.nexus) !== null && _b !== void 0 ? _b : {} }),
                    };
                }
            });
        }
        else {
            Object.keys(members)
                // members can potentially be a TypeScript enum.
                // The compiled version of this enum will be the members object,
                // numeric enums members also get a reverse mapping from enum values to enum names.
                // In these cases we have to ensure we don't include these reverse mapping keys.
                // See: https://www.typescriptlang.org/docs/handbook/enums.html
                .filter((key) => isNaN(+key))
                .forEach((key) => {
                assertValidName(key);
                values[key] = {
                    value: members[key],
                };
            });
        }
        if (!Object.keys(values).length) {
            throw new Error(`GraphQL Nexus: Enum ${config.name} must have at least one member`);
        }
        if (config.sourceType) {
            this.sourceTypings[config.name] = config.sourceType;
        }
        return this.finalize(new GraphQLEnumType({
            name: config.name,
            values: values,
            description: config.description,
            extensions: Object.assign(Object.assign({}, config.extensions), { nexus: (_b = (_a = config.extensions) === null || _a === void 0 ? void 0 : _a.nexus) !== null && _b !== void 0 ? _b : {} }),
        }));
    }
    buildUnionType(config) {
        var _a, _b;
        let members;
        let resolveType = config.resolveType;
        config.definition(new UnionDefinitionBlock({
            typeName: config.name,
            addUnionMembers: (unionMembers) => (members = unionMembers),
        }));
        if (config.sourceType) {
            this.sourceTypings[config.name] = config.sourceType;
        }
        return this.finalize(new GraphQLUnionType({
            name: config.name,
            resolveType,
            description: config.description,
            types: () => this.buildUnionMembers(config.name, members),
            extensions: Object.assign(Object.assign({}, config.extensions), { nexus: (_b = (_a = config.extensions) === null || _a === void 0 ? void 0 : _a.nexus) !== null && _b !== void 0 ? _b : {} }),
        }));
    }
    buildScalarType(config) {
        var _a, _b;
        if (config.sourceType) {
            this.sourceTypings[config.name] = config.sourceType;
        }
        return this.finalize(new GraphQLScalarType(Object.assign(Object.assign({}, config), { extensions: Object.assign(Object.assign({}, config.extensions), { nexus: (_b = (_a = config.extensions) === null || _a === void 0 ? void 0 : _a.nexus) !== null && _b !== void 0 ? _b : {} }) })));
    }
    finalize(type) {
        this.finalTypeMap[type.name] = type;
        return type;
    }
    missingType(typeName, fromObject = false) {
        invariantGuard(typeName);
        if (this.onMissingTypeFns.length) {
            for (let i = 0; i < this.onMissingTypeFns.length; i++) {
                const fn = this.onMissingTypeFns[i];
                const replacementType = fn(typeName, this.builderLens);
                if (replacementType && replacementType.name) {
                    this.addType(replacementType);
                    return this.getOrBuildType(replacementType);
                }
            }
        }
        if (typeName === 'Query') {
            return new GraphQLObjectType({
                name: 'Query',
                fields: {
                    ok: {
                        type: new GraphQLNonNull(GraphQLBoolean),
                        resolve: () => true,
                    },
                },
            });
        }
        if (!this.missingTypes[typeName]) {
            this.missingTypes[typeName] = { fromObject };
        }
        this.addType(UNKNOWN_TYPE_SCALAR);
        return this.getOrBuildType(UNKNOWN_TYPE_SCALAR);
    }
    buildUnionMembers(unionName, members) {
        const unionMembers = [];
        /* istanbul ignore next */
        if (!members) {
            throw new Error(`Missing Union members for ${unionName}.` +
                `Make sure to call the t.members(...) method in the union blocks`);
        }
        members.forEach((member) => {
            unionMembers.push(this.getObjectType(member));
        });
        /* istanbul ignore next */
        if (!unionMembers.length) {
            throw new Error(`GraphQL Nexus: Union ${unionName} must have at least one member type`);
        }
        return unionMembers;
    }
    buildInterfaceList(interfaces) {
        const list = [];
        interfaces.forEach((i) => {
            const type = this.getInterface(i);
            list.push(type, ...graphql15InterfaceType(type).getInterfaces());
        });
        return Array.from(new Set(list));
    }
    buildInterfaceFields(forTypeConfig, interfaces, modifications) {
        const interfaceFieldsMap = {};
        interfaces.forEach((i) => {
            const config = this.getInterface(i).toConfig();
            Object.keys(config.fields).forEach((field) => {
                var _a, _b, _c, _d, _e;
                const interfaceField = config.fields[field];
                interfaceFieldsMap[field] = interfaceField;
                if (modifications[field]) {
                    // TODO(tim): Refactor this whole mess
                    const _f = modifications[field], { type, field: _field, args, extensions } = _f, rest = __rest(_f, ["type", "field", "args", "extensions"]);
                    const extensionConfig = hasNexusExtension(extensions === null || extensions === void 0 ? void 0 : extensions.nexus)
                        ? (_b = (_a = extensions === null || extensions === void 0 ? void 0 : extensions.nexus) === null || _a === void 0 ? void 0 : _a.config) !== null && _b !== void 0 ? _b : {}
                        : {};
                    interfaceFieldsMap[field] = Object.assign(Object.assign(Object.assign({}, interfaceFieldsMap[field]), rest), { extensions: Object.assign(Object.assign(Object.assign({}, interfaceField.extensions), extensions), { nexus: hasNexusExtension((_c = interfaceField.extensions) === null || _c === void 0 ? void 0 : _c.nexus)
                                ? (_e = (_d = interfaceField.extensions) === null || _d === void 0 ? void 0 : _d.nexus) === null || _e === void 0 ? void 0 : _e.modify(extensionConfig)
                                : new NexusFieldExtension(extensionConfig) }) });
                    if (typeof type !== 'undefined') {
                        let interfaceReplacement;
                        if (isNexusWrappingType(type)) {
                            const { wrapping, namedType } = unwrapNexusDef(type);
                            interfaceReplacement = rewrapAsGraphQLType(this.getOrBuildType(namedType), wrapping);
                        }
                        else {
                            const { wrapping } = unwrapGraphQLDef(config.fields[field].type);
                            interfaceReplacement = rewrapAsGraphQLType(this.getOutputType(type), wrapping);
                        }
                        interfaceFieldsMap[field].type = interfaceReplacement;
                    }
                    if (typeof args !== 'undefined') {
                        interfaceFieldsMap[field].args = Object.assign(Object.assign({}, this.buildArgs(args !== null && args !== void 0 ? args : {}, forTypeConfig, field)), interfaceFieldsMap[field].args);
                    }
                }
            });
        });
        return interfaceFieldsMap;
    }
    buildOutputFields(fields, typeConfig, intoObject) {
        fields.forEach((field) => {
            intoObject[field.name] = this.buildOutputField(field, typeConfig);
        });
        return intoObject;
    }
    buildInputObjectFields(fields, typeConfig) {
        const fieldMap = {};
        fields.forEach((field) => {
            fieldMap[field.name] = this.buildInputObjectField(field, typeConfig);
        });
        return fieldMap;
    }
    getNonNullDefault(nonNullDefaultConfig, kind) {
        var _a, _b;
        const { nonNullDefaults = {} } = nonNullDefaultConfig !== null && nonNullDefaultConfig !== void 0 ? nonNullDefaultConfig : {};
        return (_b = (_a = nonNullDefaults[kind]) !== null && _a !== void 0 ? _a : this.config.nonNullDefaults[kind]) !== null && _b !== void 0 ? _b : false;
    }
    buildOutputField(fieldConfig, typeConfig) {
        var _a, _b;
        if (!fieldConfig.type) {
            /* istanbul ignore next */
            throw new Error(`Missing required "type" field for ${typeConfig.name}.${fieldConfig.name}`);
        }
        const fieldExtension = new NexusFieldExtension(fieldConfig);
        const nonNullDefault = this.getNonNullDefault((_b = (_a = typeConfig.extensions) === null || _a === void 0 ? void 0 : _a.nexus) === null || _b === void 0 ? void 0 : _b.config, 'output');
        const { namedType, wrapping } = unwrapNexusDef(fieldConfig.type);
        const finalWrap = finalizeWrapping(nonNullDefault, wrapping, fieldConfig.wrapping);
        const builderFieldConfig = {
            name: fieldConfig.name,
            type: rewrapAsGraphQLType(this.getOutputType(namedType), finalWrap),
            args: this.buildArgs(fieldConfig.args || {}, typeConfig, fieldConfig.name),
            description: fieldConfig.description,
            deprecationReason: fieldConfig.deprecation,
            extensions: Object.assign(Object.assign({}, fieldConfig.extensions), { nexus: fieldExtension }),
        };
        return Object.assign({ resolve: this.makeFinalResolver({
                builder: this.builderLens,
                fieldConfig: builderFieldConfig,
                parentTypeConfig: typeConfig,
                schemaConfig: this.config,
                schemaExtension: this.schemaExtension,
            }, fieldConfig.resolve), subscribe: fieldConfig.subscribe }, builderFieldConfig);
    }
    makeFinalResolver(info, resolver) {
        const resolveFn = resolver || defaultFieldResolver;
        if (this.onCreateResolverFns.length) {
            const toCompose = this.onCreateResolverFns.map((fn) => fn(info)).filter((f) => f);
            if (toCompose.length) {
                return composeMiddlewareFns(toCompose, resolveFn);
            }
        }
        return resolveFn;
    }
    buildInputObjectField(fieldConfig, typeConfig) {
        var _a, _b, _c, _d;
        const nonNullDefault = this.getNonNullDefault((_b = (_a = typeConfig.extensions) === null || _a === void 0 ? void 0 : _a.nexus) === null || _b === void 0 ? void 0 : _b.config, 'input');
        const { namedType, wrapping } = unwrapNexusDef(fieldConfig.type);
        const finalWrap = finalizeWrapping(nonNullDefault, wrapping, fieldConfig.wrapping);
        return {
            type: rewrapAsGraphQLType(this.getInputType(namedType), finalWrap),
            defaultValue: fieldConfig.default,
            description: fieldConfig.description,
            extensions: Object.assign(Object.assign({}, fieldConfig.extensions), { nexus: (_d = (_c = fieldConfig.extensions) === null || _c === void 0 ? void 0 : _c.nexus) !== null && _d !== void 0 ? _d : {} }),
        };
    }
    buildArgs(args, typeConfig, fieldName) {
        var _a, _b, _c, _d;
        const allArgs = {};
        for (const [argName, arg] of Object.entries(args)) {
            const nonNullDefault = this.getNonNullDefault((_b = (_a = typeConfig.extensions) === null || _a === void 0 ? void 0 : _a.nexus) === null || _b === void 0 ? void 0 : _b.config, 'input');
            let finalArgDef = Object.assign(Object.assign({}, normalizeArgWrapping(arg).value), { fieldName,
                argName, parentType: typeConfig.name, configFor: 'arg' });
            for (const onArgDef of this.onAddArgFns) {
                const result = onArgDef(finalArgDef);
                if (result != null) {
                    finalArgDef = result;
                }
            }
            const { namedType, wrapping } = unwrapNexusDef(finalArgDef.type);
            const finalWrap = finalizeWrapping(nonNullDefault, wrapping);
            allArgs[argName] = {
                type: rewrapAsGraphQLType(this.getInputType(namedType), finalWrap),
                description: finalArgDef.description,
                defaultValue: finalArgDef.default,
                extensions: Object.assign(Object.assign({}, finalArgDef.extensions), { nexus: (_d = (_c = finalArgDef.extensions) === null || _c === void 0 ? void 0 : _c.nexus) !== null && _d !== void 0 ? _d : {} }),
            };
        }
        return allArgs;
    }
    getInterface(name) {
        const type = this.getOrBuildType(name);
        if (!isInterfaceType(type)) {
            /* istanbul ignore next */
            throw new Error(`Expected ${name} to be an interfaceType, saw ${type.constructor.name}(${type.name})`);
        }
        return type;
    }
    getInputType(possibleInputType) {
        const nexusNamedType = getNexusNamedType(possibleInputType);
        const graphqlType = this.getOrBuildType(nexusNamedType);
        if (!isInputObjectType(graphqlType) && !isLeafType(graphqlType)) {
            /* istanbul ignore next */
            throw new Error(`Expected ${nexusNamedType} to be a possible input type, saw ${graphqlType.constructor.name}(${graphqlType.name})`);
        }
        return graphqlType;
    }
    getOutputType(possibleOutputType) {
        const graphqlType = this.getOrBuildType(possibleOutputType);
        if (!isOutputType(graphqlType)) {
            /* istanbul ignore next */
            throw new Error(`Expected ${possibleOutputType} to be a valid output type, saw ${graphqlType.constructor.name}`);
        }
        return graphqlType;
    }
    getObjectType(name) {
        if (isNexusNamedTypeDef(name)) {
            return this.getObjectType(name.name);
        }
        const type = this.getOrBuildType(name);
        if (!isObjectType(type)) {
            /* istanbul ignore next */
            throw new Error(`Expected ${name} to be a objectType, saw ${type.constructor.name}`);
        }
        return type;
    }
    getOrBuildType(type, fromObject = false) {
        var _a, _b;
        invariantGuard(type);
        if (isNamedType(type)) {
            return type;
        }
        if (isNexusNamedTypeDef(type)) {
            return this.getOrBuildType(type.name, true);
        }
        if (SCALARS[type]) {
            return SCALARS[type];
        }
        if (this.finalTypeMap[type]) {
            return this.finalTypeMap[type];
        }
        if (this.buildingTypes.has(type)) {
            /* istanbul ignore next */
            throw new Error(`GraphQL Nexus: Circular dependency detected, while building types ${Array.from(this.buildingTypes)}`);
        }
        const pendingType = (_b = (_a = this.pendingTypeMap[type]) !== null && _a !== void 0 ? _a : this.graphqlNamedTypeMap[type]) !== null && _b !== void 0 ? _b : this.graphqlMergeSchemaMap[type];
        if (isNexusNamedTypeDef(pendingType)) {
            this.buildingTypes.add(pendingType.name);
            if (isNexusObjectTypeDef(pendingType)) {
                return this.buildObjectType(pendingType.value);
            }
            else if (isNexusInterfaceTypeDef(pendingType)) {
                return this.buildInterfaceType(pendingType.value);
            }
            else if (isNexusEnumTypeDef(pendingType)) {
                return this.buildEnumType(pendingType.value);
            }
            else if (isNexusScalarTypeDef(pendingType)) {
                return this.buildScalarType(pendingType.value);
            }
            else if (isNexusInputObjectTypeDef(pendingType)) {
                return this.buildInputObjectType(pendingType.value);
            }
            else if (isNexusUnionTypeDef(pendingType)) {
                return this.buildUnionType(pendingType.value);
            }
            else {
                console.warn('Unknown kind of type def to build. It will be ignored. The type def was: %j', type);
            }
        }
        return this.missingType(type, fromObject);
    }
    walkInputType(obj) {
        const definitionBlock = new InputDefinitionBlock({
            typeName: obj.name,
            addField: (f) => this.maybeTraverseInputFieldType(f),
            addDynamicInputFields: (block, wrapping) => this.addDynamicInputFields(block, wrapping),
            warn: () => { },
        });
        obj.definition(definitionBlock);
        return obj;
    }
    addDynamicInputFields(block, wrapping) {
        eachObj(this.dynamicInputFields, (val, methodName) => {
            if (typeof val === 'string') {
                return this.addDynamicField(methodName, val, block);
            }
            // @ts-ignore
            block[methodName] = (...args) => {
                return val.value.factory({
                    args,
                    typeDef: block,
                    builder: this.builderLens,
                    typeName: block.typeName,
                    wrapping,
                });
            };
        });
    }
    addDynamicOutputMembers(block, stage, wrapping) {
        eachObj(this.dynamicOutputFields, (val, methodName) => {
            if (typeof val === 'string') {
                return this.addDynamicField(methodName, val, block);
            }
            // @ts-ignore
            block[methodName] = (...args) => {
                return val.value.factory({
                    args,
                    typeDef: block,
                    builder: this.builderLens,
                    typeName: block.typeName,
                    stage,
                    wrapping,
                });
            };
        });
        eachObj(this.dynamicOutputProperties, (val, propertyName) => {
            Object.defineProperty(block, propertyName, {
                get() {
                    return val.value.factory({
                        typeDef: block,
                        builder: this.builderLens,
                        typeName: block.typeName,
                        stage,
                    });
                },
                enumerable: true,
            });
        });
    }
    addDynamicField(methodName, typeName, block) {
        // @ts-ignore
        block[methodName] = (fieldName, opts) => {
            let fieldConfig = {
                type: typeName,
            };
            /* istanbul ignore if */
            if (typeof opts === 'function') {
                throw new Error(messages.removedFunctionShorthand(block.typeName, fieldName));
            }
            else {
                fieldConfig = Object.assign(Object.assign({}, fieldConfig), opts);
            }
            // @ts-ignore
            block.field(fieldName, fieldConfig);
        };
    }
    walkOutputType(obj) {
        const definitionBlock = new ObjectDefinitionBlock({
            typeName: obj.name,
            addInterfaces: (i) => {
                i.forEach((j) => {
                    if (typeof j !== 'string') {
                        this.addType(j);
                    }
                });
            },
            addField: (f) => this.maybeTraverseOutputFieldType(f),
            addDynamicOutputMembers: (block, wrapping) => this.addDynamicOutputMembers(block, 'walk', wrapping),
            addModification: (o) => this.maybeTraverseModification(o),
            warn: () => { },
        });
        obj.definition(definitionBlock);
        return obj;
    }
    walkInterfaceType(obj) {
        const definitionBlock = new InterfaceDefinitionBlock({
            typeName: obj.name,
            addModification: (o) => this.maybeTraverseModification(o),
            addInterfaces: (i) => {
                i.forEach((j) => {
                    if (typeof j !== 'string') {
                        this.addType(j);
                    }
                });
            },
            addField: (f) => this.maybeTraverseOutputFieldType(f),
            addDynamicOutputMembers: (block, wrapping) => this.addDynamicOutputMembers(block, 'walk', wrapping),
            warn: () => { },
        });
        obj.definition(definitionBlock);
        return obj;
    }
    maybeTraverseModification(mod) {
        const { type, args } = mod;
        if (type) {
            const namedFieldType = getNexusNamedType(mod.type);
            if (typeof namedFieldType !== 'string') {
                this.addType(namedFieldType);
            }
        }
        if (args) {
            this.traverseArgs(args);
        }
    }
    maybeTraverseOutputFieldType(type) {
        const { args, type: fieldType } = type;
        const namedFieldType = getNexusNamedType(fieldType);
        if (typeof namedFieldType !== 'string') {
            this.addType(namedFieldType);
        }
        if (args) {
            this.traverseArgs(args);
        }
    }
    traverseArgs(args) {
        eachObj(args, (val) => {
            const namedArgType = getArgNamedType(val);
            if (typeof namedArgType !== 'string') {
                this.addType(namedArgType);
            }
        });
    }
    maybeTraverseInputFieldType(type) {
        const { type: fieldType } = type;
        const namedFieldType = getNexusNamedType(fieldType);
        if (typeof namedFieldType !== 'string') {
            this.addType(namedFieldType);
        }
    }
    /**
     * Given a "mergeSchema", gathers all of the types and constructs them into a map of types that we keep as a
     * "merge schema"
     *
     * @param config
     */
    handleMergeSchema(config) {
        var _a;
        const { types } = config.schema.toConfig();
        const mergedTypes = {};
        // We don't need to worry about capturing any types while walking,
        // because we have the entire schema
        for (const type of types) {
            if (type.name.startsWith('__')) {
                continue;
            }
            if ((_a = config.skipTypes) === null || _a === void 0 ? void 0 : _a.includes(type.name)) {
                continue;
            }
            mergedTypes[type.name] = this.handleNativeType(type, config);
        }
        return mergedTypes;
    }
    handleNativeType(type, config) {
        var _a;
        var _b, _c;
        while (isWrappingType(type)) {
            type = type.ofType;
        }
        (_a = (_b = this.pendingTypeMap)[_c = type.name]) !== null && _a !== void 0 ? _a : (_b[_c] = null);
        return rebuildNamedType(type, config);
    }
}
function extendError(name) {
    return new Error(`${name} was already defined and imported as a type, check the docs for extending types`);
}
/** Builds the schema, we may return more than just the schema from this one day. */
export function makeSchemaInternal(config) {
    const builder = new SchemaBuilder(config);
    builder.addTypes(config.types);
    if (config.schemaRoots) {
        builder.addTypes(config.schemaRoots);
    }
    const { finalConfig, typeMap, missingTypes, schemaExtension, onAfterBuildFns } = builder.getFinalTypeMap();
    function getRootType(rootType, defaultType) {
        var _a, _b;
        const rootTypeVal = (_b = (_a = config.schemaRoots) === null || _a === void 0 ? void 0 : _a[rootType]) !== null && _b !== void 0 ? _b : defaultType;
        let returnVal = null;
        if (typeof rootTypeVal === 'string') {
            returnVal = typeMap[rootTypeVal];
        }
        else if (rootTypeVal) {
            if (isNexusObjectTypeDef(rootTypeVal)) {
                returnVal = typeMap[rootTypeVal.name];
            }
            else if (isObjectType(rootTypeVal)) {
                returnVal = typeMap[rootTypeVal.name];
            }
        }
        if (returnVal && !isObjectType(returnVal)) {
            throw new Error(`Expected ${rootType} to be a objectType, saw ${returnVal.constructor.name}`);
        }
        return returnVal;
    }
    const schema = new GraphQLSchema({
        query: getRootType('query', 'Query'),
        mutation: getRootType('mutation', 'Mutation'),
        subscription: getRootType('subscription', 'Subscription'),
        types: objValues(typeMap),
        extensions: Object.assign(Object.assign({}, config.extensions), { nexus: schemaExtension }),
    });
    onAfterBuildFns.forEach((fn) => fn(schema));
    return { schema, missingTypes, finalConfig };
}
export function setConfigDefaults(config) {
    var _a, _b, _c, _d, _e;
    const defaults = {
        features: {
            abstractTypeRuntimeChecks: true,
            abstractTypeStrategies: {
                isTypeOf: false,
                resolveType: true,
                __typename: false,
            },
        },
        nonNullDefaults: {
            input: false,
            output: false,
        },
        plugins: [fieldAuthorizePlugin()],
    };
    if (!config.features) {
        config.features = defaults.features;
    }
    else {
        // abstractTypeStrategies
        if (!config.features.abstractTypeStrategies) {
            config.features.abstractTypeStrategies = defaults.features.abstractTypeStrategies;
        }
        else {
            config.features.abstractTypeStrategies.__typename =
                (_a = config.features.abstractTypeStrategies.__typename) !== null && _a !== void 0 ? _a : false;
            config.features.abstractTypeStrategies.isTypeOf =
                (_b = config.features.abstractTypeStrategies.isTypeOf) !== null && _b !== void 0 ? _b : false;
            config.features.abstractTypeStrategies.resolveType =
                (_c = config.features.abstractTypeStrategies.resolveType) !== null && _c !== void 0 ? _c : false;
        }
        // abstractTypeRuntimeChecks
        if (config.features.abstractTypeStrategies.__typename === true) {
            // Discriminant Model Field strategy cannot be used with runtime checks because at runtime
            // we cannot know if a resolver for a field whose type is an abstract type includes __typename
            // in the returned model data.
            config.features.abstractTypeRuntimeChecks = false;
        }
        if (config.features.abstractTypeRuntimeChecks === undefined) {
            config.features.abstractTypeRuntimeChecks = defaults.features.abstractTypeRuntimeChecks;
        }
    }
    config.plugins = (_d = config.plugins) !== null && _d !== void 0 ? _d : [];
    config.nonNullDefaults = Object.assign(Object.assign({}, defaults.nonNullDefaults), ((_e = config.nonNullDefaults) !== null && _e !== void 0 ? _e : {}));
    return config;
}
//# sourceMappingURL=builder.js.map