import { GraphQLDirective, GraphQLNamedType, GraphQLSchema } from 'https://esm.sh/v135/@types/graphql@14.5.0/index.d.ts';
export declare function healSchema(schema: GraphQLSchema): GraphQLSchema;
export declare function healTypes(originalTypeMap: Record<string, GraphQLNamedType | null>, directives: ReadonlyArray<GraphQLDirective>): void;
