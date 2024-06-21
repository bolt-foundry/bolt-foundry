/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/AvgPool3DGrad) denonext production */
import{AvgPool3DGrad as u,backend_util as P}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{AvgPool3DBackpropProgram as f}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/avg_pool_backprop_gpu.js";function k(n){let{inputs:r,backend:t,attrs:e}=n,{dy:a,input:c}=r,o=c,{filterSize:d,strides:i,pad:p,dimRoundingMode:s}=e,l=[1,1,1],g=P.computePool3DInfo(o.shape,d,i,l,p,s),m=new f(g);return t.runWebGLProgram(m,[a],o.dtype)}var D={kernelName:u,backendName:"webgl",kernelFunc:k};export{k as avgPool3DGrad,D as avgPool3DGradConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/AvgPool3DGrad.js:
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
//# sourceMappingURL=AvgPool3DGrad.js.map