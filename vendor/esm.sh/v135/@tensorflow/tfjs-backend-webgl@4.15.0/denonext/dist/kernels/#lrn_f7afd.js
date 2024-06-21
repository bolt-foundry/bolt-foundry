/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/LRN) denonext production */
import{env as N,LRN as g}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{LRNProgram as i}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/lrn_gpu.js";import{LRNPackedProgram as L}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/lrn_packed_gpu.js";var b=a=>{let{inputs:m,backend:p,attrs:s}=a,{x:e}=m,{depthRadius:r,bias:o,alpha:n,beta:t}=s,c=N().getBool("WEBGL_PACK_NORMALIZATION")?new L(e.shape,r,o,n,t):new i(e.shape,r,o,n,t);return p.runWebGLProgram(c,[e],e.dtype)},k={kernelName:g,backendName:"webgl",kernelFunc:b};export{k as LRNConfig,b as lrn};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/LRN.js:
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
//# sourceMappingURL=LRN.js.map