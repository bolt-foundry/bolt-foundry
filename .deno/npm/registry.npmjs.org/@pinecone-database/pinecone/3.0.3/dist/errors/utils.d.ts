import type { ResponseError } from '../pinecone-generated-ts-fetch/control';
/** @internal */
export declare const extractMessage: (error: ResponseError) => Promise<string>;