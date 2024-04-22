import { GraphQLResolveInfo } from 'https://esm.sh/v135/@types/graphql@14.5.0/index.d.ts';
/**
 * Get the key under which the result of this resolver will be placed in the response JSON. Basically, just
 * resolves aliases.
 * @param info The info argument to the resolver.
 */
export declare function getResponseKeyFromInfo(info: GraphQLResolveInfo): string;
