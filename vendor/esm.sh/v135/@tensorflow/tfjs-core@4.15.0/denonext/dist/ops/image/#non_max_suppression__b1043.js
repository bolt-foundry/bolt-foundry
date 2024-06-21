/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/image/non_max_suppression_padded_async) denonext production */
import{nonMaxSuppressionV4Impl as S}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/backends/non_max_suppression_impl.js";import{convertToTensor as r}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util_env.js";import{nonMaxSuppSanityCheck as T}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/nonmax_util.js";import{scalar as I}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/scalar.js";import{tensor1d as y}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/tensor1d.js";async function M(e,t,a,i=.5,c=Number.NEGATIVE_INFINITY,p=!1){let s=r(e,"boxes","nonMaxSuppressionAsync"),o=r(t,"scores","nonMaxSuppressionAsync"),n=T(s,o,a,i,c,null),d=n.maxOutputSize,u=n.iouThreshold,l=n.scoreThreshold,[m,x]=await Promise.all([s.data(),o.data()]),{selectedIndices:f,validOutputs:h}=S(m,x,d,u,l,p);return s!==e&&s.dispose(),o!==t&&o.dispose(),{selectedIndices:y(f,"int32"),validOutputs:I(h,"int32")}}var b=M;export{b as nonMaxSuppressionPaddedAsync};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/image/non_max_suppression_padded_async.js:
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
//# sourceMappingURL=non_max_suppression_padded_async.js.map