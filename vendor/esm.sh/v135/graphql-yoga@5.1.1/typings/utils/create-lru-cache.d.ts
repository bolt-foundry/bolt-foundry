import { LRUCache as LRU } from 'https://esm.sh/v135/lru-cache@10.1.0/dist/esm/index.d.ts';
export type LRUCache<T extends {}> = LRU<string, T>;
export interface LRUCacheOptions {
    max?: number;
    ttl?: number;
}
export declare function createLRUCache<T extends {}>({ max, ttl, }?: LRUCacheOptions): LRU<string, T, unknown>;
