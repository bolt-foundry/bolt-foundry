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
/// <amd-module name="@tensorflow/tfjs-core/dist/ops/pad" />
import { Tensor } from '../tensor.d.ts';
import { TensorLike } from '../types.d.ts';
/**
 * Pads a `tf.Tensor` with a given value and paddings.
 *
 * This operation implements `CONSTANT` mode. For `REFLECT` and `SYMMETRIC`,
 * refer to `tf.mirrorPad`.
 *
 * Also available are stricter rank-specific methods with the same signature
 * as this method that assert that `paddings` is of given length.
 *   - `tf.pad1d`
 *   - `tf.pad2d`
 *   - `tf.pad3d`
 *   - `tf.pad4d`
 *
 * ```js
 * const x = tf.tensor1d([1, 2, 3, 4]);
 * x.pad([[1, 2]]).print();
 * ```
 * @param x The tensor to pad.
 * @param paddings An array of length `R` (the rank of the tensor), where
 * each element is a length-2 tuple of ints `[padBefore, padAfter]`,
 * specifying how much to pad along each dimension of the tensor.
 * @param constantValue The pad value to use. Defaults to 0.
 *
 * @doc {heading: 'Tensors', subheading: 'Transformations'}
 */
declare function pad_<T extends Tensor>(x: T | TensorLike, paddings: Array<[number, number]>, constantValue?: number): T;
export declare const pad: typeof pad_;
export {};
