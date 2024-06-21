/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/image/non_max_suppression) denonext production */
import{ENGINE as a}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/engine.js";import{NonMaxSuppressionV3 as x}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/kernel_names.js";import{convertToTensor as e}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/tensor_util_env.js";import{nonMaxSuppSanityCheck as f}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/nonmax_util.js";import{op as u}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/operation.js";function N(i,c,o,n=.5,r=Number.NEGATIVE_INFINITY){let p=e(i,"boxes","nonMaxSuppression","float32"),t=e(c,"scores","nonMaxSuppression","float32"),s=f(p,t,o,n,r);o=s.maxOutputSize,n=s.iouThreshold,r=s.scoreThreshold;let m={maxOutputSize:o,iouThreshold:n,scoreThreshold:r};return a.runKernel(x,{boxes:p,scores:t},m)}var G=u({nonMaxSuppression_:N});export{G as nonMaxSuppression};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/image/non_max_suppression.js:
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
//# sourceMappingURL=non_max_suppression.js.map