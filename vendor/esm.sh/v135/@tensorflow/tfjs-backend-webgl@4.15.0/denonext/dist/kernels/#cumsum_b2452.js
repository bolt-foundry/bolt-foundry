/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/Cumsum) denonext production */
import{Cumsum as s}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{CumOpType as p}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/cum_gpu.js";import{cumImpl as i}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Cum_impl.js";function a(e){let{inputs:m,backend:r,attrs:n}=e,{x:o}=m,{axis:t,exclusive:u,reverse:c}=n;return i(p.Sum,o,r,t,u,c)}var k={kernelName:s,backendName:"webgl",kernelFunc:a};export{a as cumsum,k as cumsumConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/Cumsum.js:
  (**
   * @license
   * Copyright 2022 Google LLC. All Rights Reserved.
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
//# sourceMappingURL=Cumsum.js.map