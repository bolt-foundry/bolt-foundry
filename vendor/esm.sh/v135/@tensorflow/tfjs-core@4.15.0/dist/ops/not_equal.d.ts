/// <amd-module name="@tensorflow/tfjs-core/dist/ops/not_equal" />
import { Tensor } from '../tensor.d.ts';
import { TensorLike } from '../types.d.ts';
/**
 * Returns the truth value of (a != b) element-wise. Supports broadcasting.
 *
 * ```js
 * const a = tf.tensor1d([1, 2, 3]);
 * const b = tf.tensor1d([0, 2, 3]);
 *
 * a.notEqual(b).print();
 * ```
 * @param a The first input tensor.
 * @param b The second input tensor. Must have the same dtype as `a`.
 *
 * @doc {heading: 'Operations', subheading: 'Logical'}
 */
declare function notEqual_<T extends Tensor>(a: Tensor | TensorLike, b: Tensor | TensorLike): T;
export declare const notEqual: typeof notEqual_;
export {};
