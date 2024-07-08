/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/image/non_max_suppression_padded) denonext production */
import{ENGINE as S}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/engine.js";import{NonMaxSuppressionV4 as T}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/kernel_names.js";import{convertToTensor as n}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/tensor_util_env.js";import{nonMaxSuppSanityCheck as f}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/nonmax_util.js";import{op as N}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/operation.js";function I(t,p,u,c=.5,i=Number.NEGATIVE_INFINITY,a=!1){let s=n(t,"boxes","nonMaxSuppression"),e=n(p,"scores","nonMaxSuppression"),o=f(s,e,u,c,i,null),d=o.maxOutputSize,m=o.iouThreshold,h=o.scoreThreshold,l={boxes:s,scores:e},x={maxOutputSize:d,iouThreshold:m,scoreThreshold:h,padToMaxOutputSize:a},r=S.runKernel(T,l,x);return{selectedIndices:r[0],validOutputs:r[1]}}var z=N({nonMaxSuppressionPadded_:I});export{z as nonMaxSuppressionPadded};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/image/non_max_suppression_padded.js:
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
//# sourceMappingURL=non_max_suppression_padded.js.map