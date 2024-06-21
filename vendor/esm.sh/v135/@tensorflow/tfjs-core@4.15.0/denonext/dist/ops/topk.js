/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/topk) denonext production */
import{ENGINE as u}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/engine.js";import{TopK as a}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/kernel_names.js";import{convertToTensor as c}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util_env.js";import{op as h}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/operation.js";function f(e,t=1,n=!0){let o=c(e,"x","topk");if(o.rank===0)throw new Error("topk() expects the input to be of rank 1 or higher");let r=o.shape[o.shape.length-1];if(t<0)throw new Error(`'k' passed to topk() must be >= 0 but got ${t}`);if(t>r)throw new Error(`'k' passed to topk() must be <= the last dimension (${r}) but got ${t}`);let s={x:o},p={k:t,sorted:n},[i,m]=u.runKernel(a,s,p);return{values:i,indices:m}}var x=h({topk_:f});export{x as topk};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/topk.js:
  (**
   * @license
   * Copyright 2018 Google LLC. All Rights Reserved.
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
//# sourceMappingURL=topk.js.map