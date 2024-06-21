/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/MaxPoolGrad) denonext production */
import{backend_util as k,MaxPoolGrad as b}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{MaxPool2DBackpropProgram as G}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/max_pool_backprop_gpu.js";import{Pool2DProgram as I}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/pool_gpu.js";import{assertNotComplex as w}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/webgl_util.js";function y(a){let{inputs:s,backend:r,attrs:m}=a,{dy:i,input:t,output:c}=s,o=t;w([t,c],"maxPoolGrad");let{filterSize:P,strides:p,pad:d,dimRoundingMode:l}=m,n=k.computePool2DInfo(o.shape,P,p,1,d,l),u=!0,x=new I(n,"max",u),e=r.runWebGLProgram(x,[o],o.dtype),f=new G(n),g=r.runWebGLProgram(f,[i,e],o.dtype);return r.disposeIntermediateTensorInfo(e),g}var C={kernelName:b,backendName:"webgl",kernelFunc:y};export{y as maxPoolGrad,C as maxPoolGradConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/MaxPoolGrad.js:
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
//# sourceMappingURL=MaxPoolGrad.js.map