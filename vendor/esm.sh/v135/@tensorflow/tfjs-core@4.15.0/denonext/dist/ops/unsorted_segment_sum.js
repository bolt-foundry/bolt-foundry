/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/unsorted_segment_sum) denonext production */
import{ENGINE as i}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/engine.js";import{UnsortedSegmentSum as S}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/kernel_names.js";import{convertToTensor as e}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util_env.js";import{assert as d,isInt as p}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/util.js";import{op as g}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/operation.js";function c(n,o,t){let m=e(n,"x","unsortedSegmentSum"),r=e(o,"segmentIds","unsortedSegmentSum","int32");d(p(t),()=>"numSegments must be of dtype int");let s={x:m,segmentIds:r},u={numSegments:t};return i.runKernel(S,s,u)}var N=g({unsortedSegmentSum_:c});export{N as unsortedSegmentSum};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/unsorted_segment_sum.js:
  (**
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
   *)
*/
//# sourceMappingURL=unsorted_segment_sum.js.map