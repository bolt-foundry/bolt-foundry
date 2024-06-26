import { GraphQLSchema } from '../type/schema.d.ts';
/**
 * Sort GraphQLSchema.
 *
 * This function returns a sorted copy of the given GraphQLSchema.
 */
export declare function lexicographicSortSchema(
  schema: GraphQLSchema,
): GraphQLSchema;
