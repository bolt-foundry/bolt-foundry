/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/mat_mul) denonext production */
import{ENGINE as s}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/engine.js";import{BatchMatMul as u}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/kernel_names.js";import{makeTypesMatch as f}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/tensor_util.js";import{convertToTensor as r}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/tensor_util_env.js";import{op as c}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/operation.js";function i(m,a,e=!1,n=!1){let t=r(m,"a","matMul"),o=r(a,"b","matMul");[t,o]=f(t,o);let l={a:t,b:o},p={transposeA:e,transposeB:n};return s.runKernel(u,l,p)}var N=c({matMul_:i});export{N as matMul};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/mat_mul.js:
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
//# sourceMappingURL=mat_mul.js.map