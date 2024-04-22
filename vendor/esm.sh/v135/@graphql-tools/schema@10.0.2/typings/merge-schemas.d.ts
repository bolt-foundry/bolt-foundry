import { GraphQLSchema } from 'https://esm.sh/v135/@types/graphql@14.5.0/index.d.ts';
import { IExecutableSchemaDefinition } from './types.d.ts';
/**
 * Configuration object for schema merging
 */
export type MergeSchemasConfig<T = any> = Partial<IExecutableSchemaDefinition<T>> & {
    /**
     * The schemas to be merged
     */
    schemas?: GraphQLSchema[];
};
/**
 * Synchronously merges multiple schemas, typeDefinitions and/or resolvers into a single schema.
 * @param config Configuration object
 */
export declare function mergeSchemas(config: MergeSchemasConfig): GraphQLSchema;
