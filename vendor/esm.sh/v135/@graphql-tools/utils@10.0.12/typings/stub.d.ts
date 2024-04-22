import { GraphQLInputObjectType, GraphQLInputType, GraphQLInterfaceType, GraphQLNamedType, GraphQLObjectType, GraphQLOutputType, GraphQLType, TypeNode } from 'https://esm.sh/v135/@types/graphql@14.5.0/index.d.ts';
export declare function createNamedStub(name: string, type: 'object'): GraphQLObjectType;
export declare function createNamedStub(name: string, type: 'interface'): GraphQLInterfaceType;
export declare function createNamedStub(name: string, type: 'input'): GraphQLInputObjectType;
export declare function createStub(node: TypeNode, type: 'output'): GraphQLOutputType;
export declare function createStub(node: TypeNode, type: 'input'): GraphQLInputType;
export declare function createStub(node: TypeNode, type: 'output' | 'input'): GraphQLType;
export declare function isNamedStub(type: GraphQLNamedType): boolean;
export declare function getBuiltInForStub(type: GraphQLNamedType): GraphQLNamedType;
