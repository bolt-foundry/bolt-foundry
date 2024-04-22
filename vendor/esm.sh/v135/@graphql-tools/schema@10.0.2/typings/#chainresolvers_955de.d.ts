import { GraphQLFieldResolver, GraphQLResolveInfo } from 'https://esm.sh/v135/@types/graphql@14.5.0/index.d.ts';
import { Maybe } from 'https://esm.sh/v135/@graphql-tools/utils@10.0.11/typings/index.d.ts';
export declare function chainResolvers<TArgs extends {
    [argName: string]: any;
}>(resolvers: Array<Maybe<GraphQLFieldResolver<any, any, TArgs>>>): (root: any, args: TArgs, ctx: any, info: GraphQLResolveInfo) => any;
