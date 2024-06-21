/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/LRNGrad) denonext production */
import{LRNGrad as i}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{LRNGradProgram as g}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/lrn_grad_gpu.js";var l=a=>{let{inputs:e,backend:n,attrs:t}=a,{x:r,y:o,dy:s}=e,{depthRadius:d,bias:p,alpha:c,beta:m}=t,b=new g(r.shape,d,p,c,m);return n.runWebGLProgram(b,[r,o,s],r.dtype)},N={kernelName:i,backendName:"webgl",kernelFunc:l};export{N as LRNGradConfig,l as lrnGrad};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/LRNGrad.js:
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
//# sourceMappingURL=LRNGrad.js.map