/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/_FusedMatMul) denonext production */
import{_FusedMatMul as M}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{batchMatMulImpl as m}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/BatchMatMul_impl.js";function b(t){let{inputs:e,backend:a,attrs:n}=t,{a:o,b:r,bias:s,preluActivationWeights:u}=e,{transposeA:l,transposeB:c,activation:i,leakyreluAlpha:p}=n;return m({a:o,b:r,transposeA:l,transposeB:c,backend:a,bias:s,preluActivationWeights:u,leakyreluAlpha:p,activation:i})}var k={kernelName:M,backendName:"webgl",kernelFunc:b};export{b as _fusedMatMul,k as _fusedMatMulConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/_FusedMatMul.js:
  (**
   * @license
   * Copyright 2020 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the License);
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an AS IS BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   *)
*/
//# sourceMappingURL=_FusedMatMul.js.map