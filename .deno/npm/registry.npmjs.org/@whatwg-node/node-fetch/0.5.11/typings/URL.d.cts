/// <reference types="packages/node-fetch/src/declarations.js" />
import FastUrl from '@kamilkisiela/fast-url-parser';
import { PonyfillBlob } from './Blob.cjs';
import { PonyfillURLSearchParams } from './URLSearchParams.cjs';
export declare class PonyfillURL extends FastUrl implements URL {
    constructor(url: string, base?: string | URL);
    get origin(): string;
    private _searchParams?;
    get searchParams(): PonyfillURLSearchParams;
    get username(): string;
    set username(value: string);
    get password(): string;
    set password(value: string);
    toString(): string;
    toJSON(): string;
    private static blobRegistry;
    static createObjectURL(blob: Blob): string;
    static resolveObjectURL(url: string): void;
    static getBlobFromURL(url: string): Blob | PonyfillBlob | undefined;
}
