/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/sparse/sparse_segment_reduction_util) denonext production */
function r(){return"segment ids must be >= 0"}function s(){return"segment ids are not increasing"}function g(e,n){return`Segment id ${e} out of range [0, ${n}), possibly because segmentIds input is not sorted.`}function o(e,n,t){return`Bad: indices[${e}] == ${n} out of range [0, ${t})`}export{o as getSparseSegmentReductionIndicesOutOfRangeErrorMessage,r as getSparseSegmentReductionNegativeSegmentIdsErrorMessage,s as getSparseSegmentReductionNonIncreasingSegmentIdsErrorMessage,g as getSparseSegmentReductionSegmentIdOutOfRangeErrorMessage};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/sparse/sparse_segment_reduction_util.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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
   *)
*/
//# sourceMappingURL=sparse_segment_reduction_util.js.map