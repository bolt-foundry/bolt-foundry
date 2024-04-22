import { GraphQLDirective, GraphQLNamedType } from 'https://esm.sh/v135/@types/graphql@14.5.0/index.d.ts';
export declare function rewireTypes(originalTypeMap: Record<string, GraphQLNamedType | null>, directives: ReadonlyArray<GraphQLDirective>): {
    typeMap: Record<string, GraphQLNamedType>;
    directives: Array<GraphQLDirective>;
};
