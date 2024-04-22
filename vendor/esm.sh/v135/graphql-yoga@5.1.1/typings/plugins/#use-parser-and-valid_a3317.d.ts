import type { DocumentNode, validate } from 'https://esm.sh/v135/graphql@16.8.1/index.d.ts';
import type { Plugin } from './types.d.ts';
interface Cache<T> {
    get(key: string): T | undefined;
    set(key: string, value: T): void;
}
export interface ParserAndValidationCacheOptions {
    documentCache?: Cache<DocumentNode>;
    errorCache?: Cache<unknown>;
    validationCache?: boolean | Cache<typeof validate>;
}
export declare function useParserAndValidationCache({ documentCache, errorCache, validationCache, }: ParserAndValidationCacheOptions): Plugin<{}>;
export {};
