import { ASTNode, GraphQLError, Source } from 'https://esm.sh/v135/@types/graphql@14.5.0/index.d.ts';
import { Maybe } from './types.d.ts';
interface GraphQLErrorOptions {
    nodes?: ReadonlyArray<ASTNode> | ASTNode | null;
    source?: Maybe<Source>;
    positions?: Maybe<ReadonlyArray<number>>;
    path?: Maybe<ReadonlyArray<string | number>>;
    originalError?: Maybe<Error & {
        readonly extensions?: unknown;
    }>;
    extensions?: any;
}
export declare function createGraphQLError(message: string, options?: GraphQLErrorOptions): GraphQLError;
export declare function relocatedError(originalError: GraphQLError, path?: ReadonlyArray<string | number>): GraphQLError;
export {};
