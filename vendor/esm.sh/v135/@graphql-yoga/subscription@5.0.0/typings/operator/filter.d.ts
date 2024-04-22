import { Repeater } from 'https://esm.sh/v135/@repeaterjs/repeater@3.0.4/repeater.d.ts';
/**
 * Utility for filtering an event stream.
 */
export declare function filter<T, U extends T>(filter: (input: T) => input is U): (source: AsyncIterable<T>) => Repeater<U, void, unknown>;
export declare function filter<T>(filter: (input: T) => Promise<boolean> | boolean): (source: AsyncIterable<T>) => Repeater<T, void, unknown>;
