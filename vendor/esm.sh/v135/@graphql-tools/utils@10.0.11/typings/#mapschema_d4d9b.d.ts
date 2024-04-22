import { GraphQLEnumType, GraphQLInputObjectType, GraphQLInterfaceType, GraphQLObjectType, GraphQLSchema } from 'https://esm.sh/v135/@types/graphql@14.5.0/index.d.ts';
import { SchemaMapper } from './Interfaces.d.ts';
export declare function mapSchema(schema: GraphQLSchema, schemaMapper?: SchemaMapper): GraphQLSchema;
export declare function correctASTNodes(type: GraphQLObjectType): GraphQLObjectType;
export declare function correctASTNodes(type: GraphQLInterfaceType): GraphQLInterfaceType;
export declare function correctASTNodes(type: GraphQLInputObjectType): GraphQLInputObjectType;
export declare function correctASTNodes(type: GraphQLEnumType): GraphQLEnumType;
