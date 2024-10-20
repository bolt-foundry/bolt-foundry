import { GraphQLParams } from '../../types.js';
export declare function handleURLSearchParams(searchParams: URLSearchParams): GraphQLParams;
export declare function parseURLSearchParams(requestBody: string): GraphQLParams;
export declare function isContentTypeMatch(request: Request, expectedContentType: string): boolean;
