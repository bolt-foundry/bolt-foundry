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
/// <amd-module name="@tensorflow/tfjs-core/dist/backends/non_max_suppression_impl" />
import { TypedArray } from '../types.d.ts';
interface NonMaxSuppressionResult {
    selectedIndices: number[];
    selectedScores?: number[];
    validOutputs?: number;
}
export declare function nonMaxSuppressionV3Impl(boxes: TypedArray, scores: TypedArray, maxOutputSize: number, iouThreshold: number, scoreThreshold: number): NonMaxSuppressionResult;
export declare function nonMaxSuppressionV4Impl(boxes: TypedArray, scores: TypedArray, maxOutputSize: number, iouThreshold: number, scoreThreshold: number, padToMaxOutputSize: boolean): NonMaxSuppressionResult;
export declare function nonMaxSuppressionV5Impl(boxes: TypedArray, scores: TypedArray, maxOutputSize: number, iouThreshold: number, scoreThreshold: number, softNmsSigma: number): NonMaxSuppressionResult;
export {};
