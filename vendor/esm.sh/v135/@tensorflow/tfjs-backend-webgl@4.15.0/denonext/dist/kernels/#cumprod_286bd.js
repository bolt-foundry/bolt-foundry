/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/Cumprod) denonext production */
import{Cumprod as u}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{CumOpType as s}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/cum_gpu.js";import{cumImpl as i}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Cum_impl.js";function a(r){let{inputs:e,backend:o,attrs:m}=r,{x:n}=e,{axis:t,exclusive:c,reverse:p}=m;return i(s.Prod,n,o,t,c,p)}var x={kernelName:u,backendName:"webgl",kernelFunc:a};export{a as cumprod,x as cumprodConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/Cumprod.js:
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
//# sourceMappingURL=Cumprod.js.map