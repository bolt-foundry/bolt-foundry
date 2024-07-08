/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/dense_bincount) denonext production */
import{ENGINE as m}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/engine.js";import{DenseBincount as c}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/kernel_names.js";import{convertToTensor as o}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/tensor_util_env.js";import*as n from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/util.js";import{op as h}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/operation.js";function g(r,i,s,u=!1){let t=o(r,"x","denseBincount"),e=o(i,"weights","denseBincount");n.assert(t.dtype==="int32",()=>`Error in denseBincount: input dtype must be int32, but got ${t.dtype}`),n.assert(t.rank<=2,()=>`Error in denseBincount: input must be at most rank 2, but got rank ${t.rank}.`),n.assert(s>=0,()=>`size must be non-negative, but got ${s}.`),n.assert(e.size===t.size||e.size===0,()=>`Error in denseBincount: weights must have the same shape as x or 0-length, but got x shape: ${t.shape}, weights shape: ${e.shape}.`);let a={x:t,weights:e},p={size:s,binaryOutput:u};return m.runKernel(c,a,p)}var f=h({denseBincount_:g});export{f as denseBincount};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/dense_bincount.js:
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
//# sourceMappingURL=dense_bincount.js.map