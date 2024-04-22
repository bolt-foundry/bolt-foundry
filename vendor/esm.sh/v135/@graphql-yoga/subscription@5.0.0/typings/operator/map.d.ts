import { Repeater } from 'https://esm.sh/v135/@repeaterjs/repeater@3.0.4/repeater.d.ts';
/**
 * Utility for mapping an event stream.
 */
export declare const map: <T, O>(mapper: (input: T) => O | Promise<O>) => (source: AsyncIterable<T>) => Repeater<O, any, unknown>;
