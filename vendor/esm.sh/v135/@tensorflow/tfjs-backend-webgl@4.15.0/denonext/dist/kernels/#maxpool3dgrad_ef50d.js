/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/MaxPool3DGrad) denonext production */
import{backend_util as g,MaxPool3DGrad as k}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{MaxPool3DBackpropProgram as b}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/max_pool_backprop_gpu.js";import{Pool3DProgram as D}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/pool_gpu.js";function G(e){let{inputs:a,backend:n,attrs:s}=e,{dy:m,input:i}=a,o=i,{filterSize:c,strides:d,pad:p,dimRoundingMode:P}=s,l=[1,1,1],r=g.computePool3DInfo(o.shape,c,d,l,p,P),u=new D(r,"max",!0),t=n.runWebGLProgram(u,[o],o.dtype),x=new b(r),f=n.runWebGLProgram(x,[m,t],o.dtype);return n.disposeIntermediateTensorInfo(t),f}var M={kernelName:k,backendName:"webgl",kernelFunc:G};export{G as maxPool3DGrad,M as maxPool3DGradConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/MaxPool3DGrad.js:
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
//# sourceMappingURL=MaxPool3DGrad.js.map