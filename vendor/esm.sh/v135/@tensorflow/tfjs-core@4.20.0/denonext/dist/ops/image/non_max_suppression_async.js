/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/image/non_max_suppression_async) denonext production */
import{nonMaxSuppressionV3Impl as u}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/backends/non_max_suppression_impl.js";import{convertToTensor as a}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/tensor_util_env.js";import{nonMaxSuppSanityCheck as S}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/nonmax_util.js";import{tensor1d as d}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/tensor1d.js";async function y(c,p,o,t=.5,e=Number.NEGATIVE_INFINITY){let n=a(c,"boxes","nonMaxSuppressionAsync"),s=a(p,"scores","nonMaxSuppressionAsync"),r=S(n,s,o,t,e);o=r.maxOutputSize,t=r.iouThreshold,e=r.scoreThreshold;let i=await Promise.all([n.data(),s.data()]),m=i[0],x=i[1],{selectedIndices:f}=u(m,x,o,t,e);return n!==c&&n.dispose(),s!==p&&s.dispose(),d(f,"int32")}var l=y;export{l as nonMaxSuppressionAsync};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/image/non_max_suppression_async.js:
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
//# sourceMappingURL=non_max_suppression_async.js.map