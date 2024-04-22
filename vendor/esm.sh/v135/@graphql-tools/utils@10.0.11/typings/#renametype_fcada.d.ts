import { GraphQLEnumType, GraphQLInputObjectType, GraphQLInterfaceType, GraphQLNamedType, GraphQLObjectType, GraphQLScalarType, GraphQLUnionType } from 'https://esm.sh/v135/@types/graphql@14.5.0/index.d.ts';
export declare function renameType(type: GraphQLObjectType, newTypeName: string): GraphQLObjectType;
export declare function renameType(type: GraphQLInterfaceType, newTypeName: string): GraphQLInterfaceType;
export declare function renameType(type: GraphQLUnionType, newTypeName: string): GraphQLUnionType;
export declare function renameType(type: GraphQLEnumType, newTypeName: string): GraphQLEnumType;
export declare function renameType(type: GraphQLScalarType, newTypeName: string): GraphQLScalarType;
export declare function renameType(type: GraphQLInputObjectType, newTypeName: string): GraphQLInputObjectType;
export declare function renameType(type: GraphQLNamedType, newTypeName: string): GraphQLNamedType;
