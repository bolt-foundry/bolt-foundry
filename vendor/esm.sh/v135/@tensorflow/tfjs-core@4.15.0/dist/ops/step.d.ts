/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
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
/// <amd-module name="@tensorflow/tfjs-core/dist/ops/step" />
import { Tensor } from '../tensor.d.ts';
import { TensorLike } from '../types.d.ts';
/**
 * Computes step of the input `tf.Tensor` element-wise: `x > 0 ? 1 : alpha`
 *
 * ```js
 * const x = tf.tensor1d([0, 2, -1, -3]);
 *
 * x.step(.5).print();  // or tf.step(x, .5)
 * ```
 * @param x The input tensor.
 * @param alpha The gradient when input is negative. Defaults to 0.
 *
 * @doc {heading: 'Operations', subheading: 'Basic math'}
 */
declare function step_<T extends Tensor>(x: T | TensorLike, alpha?: number): T;
export declare const step: typeof step_;
export {};
