import { ConfiguredTypegen, SchemaConfig } from './builder';
import type { NexusGraphQLSchema } from './definitions/_types';
/**
 * Defines the GraphQL schema, by combining the GraphQL types defined by the GraphQL Nexus layer or any
 * manually defined GraphQLType objects.
 *
 * Requires at least one type be named "Query", which will be used as the root query type.
 */
export declare function makeSchema(config: SchemaConfig): NexusGraphQLSchema;
/** Like makeSchema except that typegen is always run and waited upon. */
export declare function generateSchema(config: SchemaConfig): Promise<NexusGraphQLSchema>;
export declare namespace generateSchema {
    var withArtifacts: (config: SchemaConfig, typegen?: string | ConfiguredTypegen | null) => Promise<{
        schema: NexusGraphQLSchema;
        schemaTypes: string;
        tsTypes: string;
        globalTypes: string | null;
    }>;
}
