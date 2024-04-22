import { ASTNode, GraphQLObjectType, GraphQLSchema, OperationTypeNode } from 'https://esm.sh/v135/@types/graphql@14.5.0/index.d.ts';
export declare function getDefinedRootType(schema: GraphQLSchema, operation: OperationTypeNode, nodes?: ASTNode[]): GraphQLObjectType;
export declare const getRootTypeNames: (schema: GraphQLSchema) => Set<string>;
export declare const getRootTypes: (schema: GraphQLSchema) => Set<GraphQLObjectType>;
export declare const getRootTypeMap: (schema: GraphQLSchema) => Map<OperationTypeNode, GraphQLObjectType>;
