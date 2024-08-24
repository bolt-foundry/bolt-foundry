import { GraphQLSchema } from 'graphql';
import type { BuilderConfigInput, TypegenInfo } from './builder';
import type { ConfiguredTypegen } from './core';
import type { NexusGraphQLSchema } from './definitions/_types';
export interface TypegenMetadataConfig extends Omit<BuilderConfigInput, 'outputs' | 'shouldGenerateArtifacts'> {
    nexusSchemaImportId?: string;
    outputs: {
        schema: null | string;
        typegen: null | ConfiguredTypegen;
    };
}
/**
 * Passed into the SchemaBuilder, this keeps track of any necessary field / type metadata we need to be aware
 * of when building the generated types and/or SDL artifact, including but not limited to:
 */
export declare class TypegenMetadata {
    protected config: TypegenMetadataConfig;
    constructor(config: TypegenMetadataConfig);
    /** Generates the artifacts of the build based on what we know about the schema and how it was defined. */
    generateArtifacts(schema: NexusGraphQLSchema): Promise<void>;
    generateArtifactContents(schema: NexusGraphQLSchema, typegen: string | null | ConfiguredTypegen): Promise<{
        schemaTypes: string;
        tsTypes: string;
        globalTypes: string | null;
    }>;
    sortSchema(schema: NexusGraphQLSchema): NexusGraphQLSchema;
    writeFile(type: 'schema' | 'types', output: string, filePath: string): Promise<void>;
    /** Generates the schema, adding any directives as necessary */
    generateSchemaFile(schema: GraphQLSchema): string;
    /** Generates the type definitions */
    generateTypesFile(schema: NexusGraphQLSchema, typegenPath: string): Promise<string>;
    /** Generates the type definitions */
    generateConfiguredTypes(schema: NexusGraphQLSchema, typegen: ConfiguredTypegen): Promise<{
        tsTypes: string;
        globalTypes: string;
    } | {
        tsTypes: string;
        globalTypes: null;
    }>;
    getTypegenInfo(schema: GraphQLSchema, typegenPath?: string): Promise<TypegenInfo>;
}
