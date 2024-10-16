/**
 * @license
 * Copyright 2017 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
/// <amd-module name="@tensorflow/tfjs-core/dist/util" />
import { BackendValues, DataType, RecursiveArray, TensorLike, TypedArray } from './types.d.ts';
export * from './util_base.d.ts';
export * from './hash_util.d.ts';
/**
 * Create typed array for scalar value. Used for storing in `DataStorage`.
 */
export declare function createScalarValue(value: DataType, dtype: DataType): BackendValues;
export declare function toTypedArray(a: TensorLike, dtype: DataType): TypedArray;
/**
 * Returns the current high-resolution time in milliseconds relative to an
 * arbitrary time in the past. It works across different platforms (node.js,
 * browsers).
 *
 * ```js
 * console.log(tf.util.now());
 * ```
 *
 * @doc {heading: 'Util', namespace: 'util'}
 */
export declare function now(): number;
/**
 * Returns a platform-specific implementation of
 * [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).
 *
 * If `fetch` is defined on the global object (`window`, `process`, etc.),
 * `tf.util.fetch` returns that function.
 *
 * If not, `tf.util.fetch` returns a platform-specific solution.
 *
 * ```js
 * const resource = await tf.util.fetch('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs');
 * // handle response
 * ```
 *
 * @doc {heading: 'Util'}
 */
export declare function fetch(path: string, requestInits?: RequestInit): Promise<Response>;
/**
 * Encodes the provided string into bytes using the provided encoding scheme.
 *
 * @param s The string to encode.
 * @param encoding The encoding scheme. Defaults to utf-8.
 *
 * @doc {heading: 'Util'}
 */
export declare function encodeString(s: string, encoding?: string): Uint8Array;
/**
 * Decodes the provided bytes into a string using the provided encoding scheme.
 * @param bytes The bytes to decode.
 *
 * @param encoding The encoding scheme. Defaults to utf-8.
 *
 * @doc {heading: 'Util'}
 */
export declare function decodeString(bytes: Uint8Array, encoding?: string): string;
export declare function isTypedArray(a: {}): a is Float32Array | Int32Array | Uint8Array | Uint8ClampedArray;
/**
 *  Flattens an arbitrarily nested array.
 *
 * ```js
 * const a = [[1, 2], [3, 4], [5, [6, [7]]]];
 * const flat = tf.util.flatten(a);
 * console.log(flat);
 * ```
 *
 *  @param arr The nested array to flatten.
 *  @param result The destination array which holds the elements.
 *  @param skipTypedArray If true, avoids flattening the typed arrays. Defaults
 *      to false.
 *
 * @doc {heading: 'Util', namespace: 'util'}
 */
export declare function flatten<T extends number | boolean | string | Promise<number> | TypedArray>(arr: T | RecursiveArray<T>, result?: T[], skipTypedArray?: boolean): T[];
