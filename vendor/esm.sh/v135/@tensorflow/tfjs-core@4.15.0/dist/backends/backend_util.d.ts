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
/// <amd-module name="@tensorflow/tfjs-core/dist/backends/backend_util" />
export * from '../ops/axis_util.d.ts';
export * from '../ops/broadcast_util.d.ts';
export * from '../ops/concat_util.d.ts';
export * from '../ops/conv_util.d.ts';
export * from '../ops/fused_util.d.ts';
export * from '../ops/fused_types.d.ts';
export * from '../ops/ragged_to_dense_util.d.ts';
export * from '../ops/reduce_util.d.ts';
import * as slice_util from '../ops/slice_util.d.ts';
export { slice_util };
export { BackendValues, TypedArray, upcastType, PixelData } from '../types.d.ts';
export { MemoryInfo, TimingInfo } from '../engine.d.ts';
export * from '../ops/rotate_util.d.ts';
export * from '../ops/array_ops_util.d.ts';
export * from '../ops/gather_nd_util.d.ts';
export * from '../ops/scatter_nd_util.d.ts';
export * from '../ops/selu_util.d.ts';
export * from '../ops/fused_util.d.ts';
export * from '../ops/erf_util.d.ts';
export * from '../log.d.ts';
export * from '../backends/complex_util.d.ts';
export * from '../backends/einsum_util.d.ts';
export * from '../ops/split_util.d.ts';
export * from '../ops/sparse/sparse_fill_empty_rows_util.d.ts';
export * from '../ops/sparse/sparse_reshape_util.d.ts';
export * from '../ops/sparse/sparse_segment_reduction_util.d.ts';
import * as segment_util from '../ops/segment_util.d.ts';
export { segment_util };
export declare function fromUint8ToStringArray(vals: Uint8Array[]): string[];
export declare function fromStringArrayToUint8(strings: string[]): Uint8Array[];
