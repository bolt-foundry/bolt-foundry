/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/einsum) denonext production */
import{ENGINE as e}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/engine.js";import{Einsum as i}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/kernel_names.js";import{convertToTensor as p}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/tensor_util_env.js";import{op as u}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/operation.js";function c(o,...r){let n=r.map((m,s)=>p(m,`tensors${s}`,"einsum")),t={equation:o};return e.runKernel(i,n,t)}var N=u({einsum_:c});export{N as einsum,c as einsum_};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/einsum.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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
//# sourceMappingURL=einsum.js.map