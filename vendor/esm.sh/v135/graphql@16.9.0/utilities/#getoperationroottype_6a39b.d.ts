import type {
  OperationDefinitionNode,
  OperationTypeDefinitionNode,
} from '../language/ast.d.ts';
import type { GraphQLObjectType } from '../type/definition.d.ts';
import type { GraphQLSchema } from '../type/schema.d.ts';
/**
 * Extracts the root type of the operation from the schema.
 *
 * @deprecated Please use `GraphQLSchema.getRootType` instead. Will be removed in v17
 */
export declare function getOperationRootType(
  schema: GraphQLSchema,
  operation: OperationDefinitionNode | OperationTypeDefinitionNode,
): GraphQLObjectType;
