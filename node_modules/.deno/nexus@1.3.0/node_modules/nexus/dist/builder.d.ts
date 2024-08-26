import { GraphQLNamedType, GraphQLSchema, GraphQLSchemaConfig, printSchema } from 'graphql';
import { InputDefinitionBlock } from './definitions/definitionBlocks';
import type { NexusExtendInputTypeDef } from './definitions/extendInputType';
import type { NexusExtendTypeDef } from './definitions/extendType';
import { NexusInterfaceTypeConfig } from './definitions/interfaceType';
import { ObjectDefinitionBlock } from './definitions/objectType';
import { AllNexusNamedTypeDefs, AllNexusOutputTypeDefs } from './definitions/wrapping';
import type { MissingType, NexusFeaturesInput, NexusGraphQLSchema, NonNullConfig, TypingImport } from './definitions/_types';
import type { DynamicInputMethodDef, DynamicOutputMethodDef } from './dynamicMethod';
import type { DynamicOutputPropertyDef } from './dynamicProperty';
import { NexusSchemaExtension } from './extensions';
import { NexusPlugin } from './plugin';
import type { SourceTypesConfigOptions } from './typegenAutoConfig';
import type { TypegenFormatFn } from './typegenFormatPrettier';
import type { GetGen } from './typegenTypeHelpers';
import type { RequiredDeeply } from './typeHelpersInternal';
import { NexusMeta } from './definitions/nexusMeta';
declare type NexusShapedOutput = {
    name: string;
    definition: (t: ObjectDefinitionBlock<string>) => void;
};
declare type NexusShapedInput = {
    name: string;
    definition: (t: InputDefinitionBlock<string>) => void;
};
export interface ConfiguredTypegen {
    /** Path for the generated type defs */
    outputPath: string;
    /**
     * Determine the path the "globals" are output, useful when you have a monorepo setup and need to isolate
     * the globals from the rest of the types in order to have multiple schemas/ts projects
     */
    globalsPath?: string;
    /**
     * If globalsPath is defined, these headers are added to the "globals" generated file, rather than the
     * typegen generated file
     */
    globalsHeaders?: string[];
    /**
     * If "true", declares dedicated interfaces for any inputs / args
     *
     * @default false
     */
    declareInputs?: boolean;
}
export interface MergeSchemaConfig {
    /**
     * GraphQL Schema to merge into the Nexus type definitions.
     *
     * We unwrap each type, preserve the "nullable/nonNull" status of any fields & arguments, and then combine
     * with the local Nexus GraphQL types.
     *
     * If you have multiple schemas
     */
    schema: GraphQLSchema;
    /**
     * If we want to "merge" specific types, provide a list of the types you wish to merge here.
     *
     * @default 'Query', 'Mutation'
     */
    mergeTypes?: string[] | true;
    /**
     * If there are types that we don't want to include from the external schema in our final Nexus generated
     * schema, provide them here.
     */
    skipTypes?: string[];
    /**
     * If there are certain "fields" that we want to skip, we can specify the fields here and we'll ensure they
     * don't get merged into the schema
     */
    skipFields?: Record<string, string[]>;
    /**
     * If there are certain arguments for any type fields that we want to skip, we can specify the fields here &
     * ensure they don't get merged into the final schema.
     *
     * @example
     *   skipArgs: {
     *     Mutation: {
     *       createAccount: ['internalId']
     *     }
     *   }
     */
    skipArgs?: Record<string, Record<string, string[]>>;
}
export interface BuilderConfigInput {
    /**
     * If we have an external schema that we want to "merge into" our local Nexus schema definitions, we can
     * configure it here.
     *
     * If you have more than one schema that needs merging, you can look into using graphql-tools to pre-merge
     * into a single schema: https://www.graphql-tools.com/docs/schema-merging
     */
    mergeSchema?: MergeSchemaConfig;
    /**
     * Generated artifact settings. Set to false to disable all. Set to true to enable all and use default
     * paths. Leave undefined for default behaviour of each artifact.
     */
    outputs?: boolean | {
        /**
         * TypeScript declaration file generation settings. This file contains types reflected off your source
         * code. It is how Nexus imbues dynamic code with static guarantees.
         *
         * Defaults to being enabled when `process.env.NODE_ENV !== "production"`. Set to true to enable and
         * emit into default path (see below). Set to false to disable. Set to a string to specify absolute path.
         *
         * The default path is node_modules/@types/nexus-typegen/index.d.ts. This is chosen because TypeScript
         * will pick it up without any configuration needed by you. For more details about the @types system
         * refer to https://www.typescriptlang.org/docs/handbook/tsconfig-json.html#types-typeroots-and-types
         */
        typegen?: boolean | string | ConfiguredTypegen;
        /**
         * GraphQL SDL file generation toggle and location.
         *
         * Set to a string to enable and output to an absolute path. Set to true to enable at default path
         * (schema.graphql in the current working directory) Set to false to disable
         *
         * Defaults to true in development and false otherwise.
         *
         * This file is not necessary but may be nice for teams wishing to review SDL in pull-requests or just
         * generally transitioning from a schema-first workflow.
         */
        schema?: boolean | string;
    };
    /**
     * Whether the schema & types are generated when the server starts. Default is !process.env.NODE_ENV ||
     * process.env.NODE_ENV === "development"
     */
    shouldGenerateArtifacts?: boolean;
    /** Register the Source Types */
    sourceTypes?: SourceTypesConfigOptions;
    /**
     * Adjust the Prettier options used while running prettier over the generated output.
     *
     * Can be an absolute path to a Prettier config file like .prettierrc or package.json with "prettier" field,
     * or an object of Prettier options.
     *
     * If provided, you must have prettier available as an importable dep in your project.
     */
    prettierConfig?: string | object;
    /**
     * Manually apply a formatter to the generated content before saving, see the `prettierConfig` option if you
     * want to use Prettier.
     */
    formatTypegen?: TypegenFormatFn;
    /**
     * Configures the default "nonNullDefaults" for the entire schema the type. Read more about how nexus
     * handles nullability
     */
    nonNullDefaults?: NonNullConfig;
    /** List of plugins to apply to Nexus, with before/after hooks executed first to last: before -> resolve -> after */
    plugins?: NexusPlugin[];
    /** Provide if you wish to customize the behavior of the schema printing. Otherwise, uses `printSchema` from graphql-js */
    customPrintSchemaFn?: typeof printSchema;
    /** Customize and toggle on or off various features of Nexus. */
    features?: NexusFeaturesInput;
    /**
     * Path to the module where your context type is exported
     *
     * @example
     *   contextType: { module: path.join(__dirname, 'context.ts'), export: 'MyContextType' }
     */
    contextType?: TypingImport;
    /**
     * If we wish to override the "Root" type for the schema, we can do so by specifying the rootTypes option,
     * which will replace the default roots of Query / Mutation / Subscription
     */
    schemaRoots?: {
        query?: GetGen<'allOutputTypes', string> | AllNexusOutputTypeDefs;
        mutation?: GetGen<'allOutputTypes', string> | AllNexusOutputTypeDefs;
        subscription?: GetGen<'allOutputTypes', string> | AllNexusOutputTypeDefs;
    };
}
export interface BuilderConfig extends Omit<BuilderConfigInput, 'nonNullDefaults' | 'features' | 'plugins'> {
    nonNullDefaults: RequiredDeeply<BuilderConfigInput['nonNullDefaults']>;
    features: RequiredDeeply<BuilderConfigInput['features']>;
    plugins: RequiredDeeply<BuilderConfigInput['plugins']>;
}
export declare type SchemaConfig = BuilderConfigInput & {
    /**
     * All of the GraphQL types. This is an any for simplicity of developer experience, if it's an object we get
     * the values, if it's an array we flatten out the valid types, ignoring invalid ones.
     */
    types: any;
    /**
     * Whether we should process.exit after the artifacts are generated. Useful if you wish to explicitly
     * generate the test artifacts at a certain stage in a startup or build process.
     *
     * @default false
     */
    shouldExitAfterGenerateArtifacts?: boolean;
    /**
     * Custom extensions, as [supported in
     * graphql-js](https://github.com/graphql/graphql-js/blob/master/src/type/__tests__/extensions-test.js)
     */
    extensions?: GraphQLSchemaConfig['extensions'];
} & NexusGenPluginSchemaConfig;
export interface TypegenInfo {
    /** Headers attached to the generate type output */
    headers: string[];
    /** All imports for the source types / context */
    imports: string[];
    /** A map of all GraphQL types and what TypeScript types they should be represented by. */
    sourceTypeMap: {
        [K in GetGen<'objectNames'>]?: string;
    };
    /** Info about where to import the context from */
    contextTypeImport: TypingImport | undefined;
    /**
     * The path to the nexus package for typegen.
     *
     * This setting is only necessary when nexus is being wrapped by another library/framework such that `nexus`
     * is not expected to be a direct dependency at the application level.
     */
    nexusSchemaImportId?: string;
}
export declare type TypeToWalk = {
    type: 'input';
    value: NexusShapedInput;
} | {
    type: 'object';
    value: NexusShapedOutput;
} | {
    type: 'interface';
    value: NexusInterfaceTypeConfig<any>;
};
export declare type DynamicInputFields = Record<string, DynamicInputMethodDef<string> | string>;
export declare type DynamicOutputFields = Record<string, DynamicOutputMethodDef<string> | string>;
export declare type DynamicOutputProperties = Record<string, DynamicOutputPropertyDef<string>>;
export declare type TypeDef = GraphQLNamedType | AllNexusNamedTypeDefs | NexusExtendInputTypeDef<string> | NexusExtendTypeDef<string>;
export declare type DynamicBlockDef = DynamicInputMethodDef<string> | DynamicOutputMethodDef<string> | DynamicOutputPropertyDef<string>;
export declare type NexusAcceptedTypeDef = TypeDef | DynamicBlockDef | NexusMeta;
export declare type PluginBuilderLens = {
    hasType: SchemaBuilder['hasType'];
    addType: SchemaBuilder['addType'];
    setConfigOption: SchemaBuilder['setConfigOption'];
    hasConfigOption: SchemaBuilder['hasConfigOption'];
    getConfigOption: SchemaBuilder['getConfigOption'];
};
/**
 * Builds all of the types, properly accounts for any using "mix". Since the enum types are resolved
 * synchronously, these need to guard for circular references at this step, while fields will guard for it
 * during lazy evaluation.
 */
export declare class SchemaBuilder {
    /** All objects containing a NEXUS_BUILD / NEXUS_TYPE symbol */
    private nexusMetaObjects;
    /** Used to check for circular references. */
    private buildingTypes;
    /** The "final type" map contains all types as they are built. */
    private finalTypeMap;
    /**
     * The "defined type" map keeps track of all of the types that were defined directly as `GraphQL*Type`
     * objects, so we don't accidentally overwrite any.
     */
    private definedTypeMap;
    /**
     * The "pending type" map keeps track of all types that were defined w/ GraphQL Nexus and haven't been
     * processed into concrete types yet.
     */
    private pendingTypeMap;
    /** All "extensions" to types (adding fields on types from many locations) */
    private typeExtendMap;
    /** All "extensions" to input types (adding fields on types from many locations) */
    private inputTypeExtendMap;
    /**
     * When we encounter "named" types from graphql-js, we keep them separate from Nexus definitions. This way
     * we can have Nexus definitions take precedence without worrying about conflicts, particularly when we're
     * looking to override behavior from inherited types.
     */
    private graphqlNamedTypeMap;
    /**
     * If we're merging against a remote schema, the types from the schema are kept here, for fallbacks /
     * merging when we're building the actual Schema
     */
    private graphqlMergeSchemaMap;
    private dynamicInputFields;
    private dynamicOutputFields;
    private dynamicOutputProperties;
    private plugins;
    /** All types that need to be traversed for children types */
    private typesToWalk;
    /** Root type mapping information annotated on the type definitions */
    private sourceTypings;
    /** Array of missing types */
    private missingTypes;
    /** Methods we are able to access to read/modify builder state from plugins */
    private builderLens;
    /** Created just before types are walked, this keeps track of all of the resolvers */
    private onMissingTypeFns;
    /** Executed just before types are walked */
    private onBeforeBuildFns;
    /** Executed as the field resolvers are included on the field */
    private onCreateResolverFns;
    /** Executed as the field "subscribe" fields are included on the schema */
    private onCreateSubscribeFns;
    /** Executed after the schema is constructed, for any final verification */
    private onAfterBuildFns;
    /** Executed after the object is defined, allowing us to add additional fields to the object */
    private onObjectDefinitionFns;
    /** Executed after the object is defined, allowing us to add additional fields to the object */
    private onInputObjectDefinitionFns;
    /** Called immediately after the field is defined, allows for using metadata to define the shape of the field. */
    private onAddArgFns;
    /** Called immediately after the field is defined, allows for using metadata to define the shape of the field. */
    private onAddOutputFieldFns;
    /** Called immediately after the field is defined, allows for using metadata to define the shape of the field. */
    private onAddInputFieldFns;
    /** The `schemaExtension` is created just after the types are walked, but before the fields are materialized. */
    private _schemaExtension?;
    private config;
    private get schemaExtension();
    constructor(config: BuilderConfigInput);
    setConfigOption: <K extends keyof BuilderConfigInput>(key: K, value: BuilderConfigInput[K]) => void;
    hasConfigOption: (key: keyof BuilderConfigInput) => boolean;
    getConfigOption: <K extends keyof BuilderConfigInput>(key: K) => BuilderConfigInput[K];
    hasType: (typeName: string) => boolean;
    /**
     * Add type takes a Nexus type, or a GraphQL type and pulls it into an internal "type registry". It also
     * does an initial pass on any types that are referenced on the "types" field and pulls those in too, so
     * you can define types anonymously, without exporting them.
     */
    private addType;
    addTypes(types: any): void;
    private addToNexusMeta;
    private walkTypes;
    private beforeWalkTypes;
    private beforeBuildTypes;
    private checkForInterfaceCircularDependencies;
    private buildNexusTypes;
    private createSchemaExtension;
    getFinalTypeMap(): BuildTypes<any>;
    private shouldMerge;
    private buildInputObjectType;
    private buildObjectType;
    private buildInterfaceType;
    private addOutputField;
    private addInputField;
    private buildEnumType;
    private buildUnionType;
    private buildScalarType;
    private finalize;
    private missingType;
    private buildUnionMembers;
    private buildInterfaceList;
    private buildInterfaceFields;
    private buildOutputFields;
    private buildInputObjectFields;
    private getNonNullDefault;
    private buildOutputField;
    private makeFinalResolver;
    private buildInputObjectField;
    private buildArgs;
    private getInterface;
    private getInputType;
    private getOutputType;
    private getObjectType;
    private getOrBuildType;
    private walkInputType;
    private addDynamicInputFields;
    private addDynamicOutputMembers;
    private addDynamicField;
    private walkOutputType;
    private walkInterfaceType;
    private maybeTraverseModification;
    private maybeTraverseOutputFieldType;
    private traverseArgs;
    private maybeTraverseInputFieldType;
    /**
     * Given a "mergeSchema", gathers all of the types and constructs them into a map of types that we keep as a
     * "merge schema"
     *
     * @param config
     */
    private handleMergeSchema;
    private handleNativeType;
}
export declare type DynamicFieldDefs = {
    dynamicInputFields: DynamicInputFields;
    dynamicOutputFields: DynamicOutputFields;
    dynamicOutputProperties: DynamicOutputProperties;
};
export interface BuildTypes<TypeMapDefs extends Record<string, GraphQLNamedType>> {
    finalConfig: BuilderConfig;
    typeMap: TypeMapDefs;
    missingTypes: Record<string, MissingType>;
    schemaExtension: NexusSchemaExtension;
    onAfterBuildFns: SchemaBuilder['onAfterBuildFns'];
}
/** Builds the schema, we may return more than just the schema from this one day. */
export declare function makeSchemaInternal(config: SchemaConfig): {
    schema: NexusGraphQLSchema;
    missingTypes: Record<string, MissingType>;
    finalConfig: BuilderConfig;
};
export declare function setConfigDefaults(config: BuilderConfigInput): BuilderConfig;
export {};
