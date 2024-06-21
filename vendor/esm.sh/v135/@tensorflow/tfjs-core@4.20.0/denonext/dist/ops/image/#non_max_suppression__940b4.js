/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/image/non_max_suppression_with_score_async) denonext production */
import{nonMaxSuppressionV5Impl as f}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/backends/non_max_suppression_impl.js";import{convertToTensor as d}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/tensor_util_env.js";import{nonMaxSuppSanityCheck as u}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/nonmax_util.js";import{tensor1d as S}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/tensor1d.js";async function y(p,i,e,c=.5,r=Number.NEGATIVE_INFINITY,t=0){let s=d(p,"boxes","nonMaxSuppressionAsync"),n=d(i,"scores","nonMaxSuppressionAsync"),o=u(s,n,e,c,r,t);e=o.maxOutputSize,c=o.iouThreshold,r=o.scoreThreshold,t=o.softNmsSigma;let a=await Promise.all([s.data(),n.data()]),m=a[0],x=a[1],{selectedIndices:l,selectedScores:I}=f(m,x,e,c,r,t);return s!==p&&s.dispose(),n!==i&&n.dispose(),{selectedIndices:S(l,"int32"),selectedScores:S(I)}}var N=y;export{N as nonMaxSuppressionWithScoreAsync};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/image/non_max_suppression_with_score_async.js:
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
//# sourceMappingURL=non_max_suppression_with_score_async.js.map