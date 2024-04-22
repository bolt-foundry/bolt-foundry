import { GraphQLError } from 'https://esm.sh/v135/graphql@16.8.1/index.d.ts';
import { createGraphQLError } from 'https://esm.sh/v135/@graphql-tools/utils@10.0.12/typings/index.d.ts';
import type { YogaLogger } from 'https://esm.sh/v135/@graphql-yoga/logger@2.0.0/typings/index.d.ts';
import type { ResultProcessorInput } from './plugins/types.d.ts';
import type { GraphQLHTTPExtensions, YogaMaskedErrorOpts } from './types.d.ts';
export { createGraphQLError };
declare module 'https://esm.sh/v135/graphql@16.8.1/index.d.ts' {
    interface GraphQLErrorExtensions {
        http?: GraphQLHTTPExtensions;
        unexpected?: boolean;
    }
}
export declare function isGraphQLError(val: unknown): val is GraphQLError;
export declare function isOriginalGraphQLError(val: unknown): val is GraphQLError & {
    originalError: GraphQLError;
};
export declare function handleError(error: unknown, maskedErrorsOpts: YogaMaskedErrorOpts | null, logger: YogaLogger): GraphQLError[];
export declare function getResponseInitByRespectingErrors(result: ResultProcessorInput, headers?: Record<string, string>, isApplicationJson?: boolean): {
    status: number;
    headers: Record<string, string>;
};
export declare function areGraphQLErrors(obj: unknown): obj is readonly GraphQLError[];
