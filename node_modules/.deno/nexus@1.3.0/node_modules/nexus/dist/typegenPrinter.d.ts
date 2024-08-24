import type { TypegenInfo } from './builder';
import type { NexusGraphQLSchema } from './definitions/_types';
interface TypegenInfoWithFile extends TypegenInfo {
    typegenPath: string;
    globalsPath?: string;
    globalsHeaders?: string[];
    declareInputs?: boolean;
}
/**
 * We track and output a few main things:
 *
 * 1. "root" types, or the values that fill the first argument for a given object type 2. "arg" types, the
 * values that are arguments to output fields. 3. "return" types, the values returned from the resolvers...
 * usually just list/nullable variations on the
 *     "root" types for other types 4. The names of all types, grouped by type.
 *
 * - Non-scalar types will get a dedicated "Root" type associated with it
 */
export declare class TypegenPrinter {
    protected schema: NexusGraphQLSchema;
    protected typegenInfo: TypegenInfoWithFile;
    private groupedTypes;
    private printImports;
    private hasDiscriminatedTypes;
    constructor(schema: NexusGraphQLSchema, typegenInfo: TypegenInfoWithFile);
    print(): string;
    printConfigured(): {
        tsTypes: string;
        globalTypes: string;
    } | {
        tsTypes: string;
        globalTypes: null;
    };
    private printCommon;
    private printHeaders;
    private printHeadersCommon;
    private printHeadersGlobal;
    private printGenTypeMap;
    private printDynamicImport;
    private maybeAddCoreImport;
    private printDynamicInputFieldDefinitions;
    private printDynamicOutputFieldDefinitions;
    private prependDoc;
    private printDynamicOutputPropertyDefinitions;
    private printInheritedFieldMap;
    private printContext;
    private printAbstractTypeMembers;
    private buildAbstractTypeMembers;
    private printTypeNames;
    private printIsTypeOfObjectTypeNames;
    private printResolveTypeAbstractTypes;
    private printFeaturesConfig;
    private buildEnumTypeMap;
    private buildInputTypeMap;
    private buildScalarTypeMap;
    private printInputTypeMap;
    private printEnumTypeMap;
    private printScalarTypeMap;
    private shouldDiscriminateType;
    private maybeDiscriminate;
    private buildRootTypeMap;
    private resolveSourceType;
    private hasResolver;
    private printObjectTypeMap;
    private printInterfaceTypeMap;
    private printUnionTypeMap;
    private printRootTypeDef;
    private printAllTypesMap;
    private buildArgTypeMap;
    private printArgTypeMap;
    private getArgsName;
    private printNamedObj;
    private printNamedMap;
    private buildReturnTypeMap;
    private buildReturnTypeNamesMap;
    private printOutputType;
    private typeToArr;
    private printFieldTypesMap;
    private printFieldTypeNamesMap;
    private normalizeArg;
    private argSeparator;
    private argTypeRepresentation;
    private argTypeArr;
    private printTypeInterface;
    private printRootTypeFieldInterface;
    private printTypeFieldInterface;
    private printArgTypeFieldInterface;
    private printObj;
    private printScalar;
    private printPlugins;
    private printType;
    private addImport;
}
export {};
