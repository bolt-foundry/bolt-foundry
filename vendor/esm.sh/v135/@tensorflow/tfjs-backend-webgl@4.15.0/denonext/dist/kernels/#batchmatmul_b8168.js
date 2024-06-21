/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/BatchMatMul) denonext production */
import{BatchMatMul as l}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{batchMatMulImpl as p}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/BatchMatMul_impl.js";function u(t){let{inputs:a,backend:n,attrs:e}=t,{a:o,b:r}=a,{transposeA:c,transposeB:s}=e;return p({a:o,b:r,transposeA:c,transposeB:s,backend:n})}var m={kernelName:l,backendName:"webgl",kernelFunc:u};export{u as batchMatMul,m as batchMatMulConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/BatchMatMul.js:
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
//# sourceMappingURL=BatchMatMul.js.map