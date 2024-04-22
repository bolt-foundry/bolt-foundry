import { GraphQLSchema } from 'https://esm.sh/v135/@types/graphql@14.5.0/index.d.ts';
import { PruneSchemaOptions } from './types.d.ts';
/**
 * Prunes the provided schema, removing unused and empty types
 * @param schema The schema to prune
 * @param options Additional options for removing unused types from the schema
 */
export declare function pruneSchema(schema: GraphQLSchema, options?: PruneSchemaOptions): GraphQLSchema;
