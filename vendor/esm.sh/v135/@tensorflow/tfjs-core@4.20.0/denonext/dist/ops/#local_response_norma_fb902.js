/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/local_response_normalization) denonext production */
import{ENGINE as f}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/engine.js";import{LRN as h}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/kernel_names.js";import{convertToTensor as N}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/tensor_util_env.js";import*as t from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/util.js";import{op as k}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/operation.js";import{reshape as n}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/reshape.js";function x(i,e=5,l=1,p=1,m=.5){let o=N(i,"x","localResponseNormalization");t.assert(o.rank===4||o.rank===3,()=>`Error in localResponseNormalization: x must be rank 3 or 4 but got
               rank ${o.rank}.`),t.assert(t.isInt(e),()=>`Error in localResponseNormalization: depthRadius must be an integer but got depthRadius ${e}.`);let s=o,a=!1;o.rank===3&&(a=!0,s=n(o,[1,o.shape[0],o.shape[1],o.shape[2]]));let u={x:s},c={depthRadius:e,bias:l,alpha:p,beta:m},r=f.runKernel(h,u,c);return a?n(r,[r.shape[1],r.shape[2],r.shape[3]]):r}var T=k({localResponseNormalization_:x});export{T as localResponseNormalization};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/local_response_normalization.js:
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
//# sourceMappingURL=local_response_normalization.js.map