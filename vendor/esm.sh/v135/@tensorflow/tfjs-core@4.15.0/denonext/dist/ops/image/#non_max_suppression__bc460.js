/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/image/non_max_suppression_with_score) denonext production */
import{ENGINE as S}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/engine.js";import{NonMaxSuppressionV5 as I}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/kernel_names.js";import{convertToTensor as i}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util_env.js";import{nonMaxSuppSanityCheck as M}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/nonmax_util.js";import{op as N}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/operation.js";function f(m,u,n,s=.5,r=Number.NEGATIVE_INFINITY,e=0){let t=i(m,"boxes","nonMaxSuppression"),p=i(u,"scores","nonMaxSuppression"),o=M(t,p,n,s,r,e);n=o.maxOutputSize,s=o.iouThreshold,r=o.scoreThreshold,e=o.softNmsSigma;let x={boxes:t,scores:p},a={maxOutputSize:n,iouThreshold:s,scoreThreshold:r,softNmsSigma:e},c=S.runKernel(I,x,a);return{selectedIndices:c[0],selectedScores:c[1]}}var V=N({nonMaxSuppressionWithScore_:f});export{V as nonMaxSuppressionWithScore};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/image/non_max_suppression_with_score.js:
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
//# sourceMappingURL=non_max_suppression_with_score.js.map