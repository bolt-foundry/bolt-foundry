/**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
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
/// <amd-module name="@tensorflow/tfjs-core/dist/ops/mod" />
import { Tensor } from '../tensor.d.ts';
import { TensorLike } from '../types.d.ts';
/**
 * Returns the mod of a and b element-wise.
 * `floor(x / y) * y + mod(x, y) = x`
 * Supports broadcasting.
 *
 * We also expose `tf.modStrict` which has the same signature as this op and
 * asserts that `a` and `b` are the same shape (does not broadcast).
 *
 * ```js
 * const a = tf.tensor1d([1, 4, 3, 16]);
 * const b = tf.tensor1d([1, 2, 9, 4]);
 *
 * a.mod(b).print();  // or tf.mod(a, b)
 * ```
 *
 * ```js
 * // Broadcast a mod b.
 * const a = tf.tensor1d([2, 4, 6, 8]);
 * const b = tf.scalar(5);
 *
 * a.mod(b).print();  // or tf.mod(a, b)
 * ```
 *
 * @param a The first tensor.
 * @param b The second tensor. Must have the same type as `a`.
 *
 * @doc {heading: 'Operations', subheading: 'Arithmetic'}
 */
declare function mod_<T extends Tensor>(a: Tensor | TensorLike, b: Tensor | TensorLike): T;
export declare const mod: typeof mod_;
export {};
