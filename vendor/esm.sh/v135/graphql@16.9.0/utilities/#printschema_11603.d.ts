import type { GraphQLNamedType } from '../type/definition.d.ts';
import type { GraphQLSchema } from '../type/schema.d.ts';
export declare function printSchema(schema: GraphQLSchema): string;
export declare function printIntrospectionSchema(schema: GraphQLSchema): string;
export declare function printType(type: GraphQLNamedType): string;
