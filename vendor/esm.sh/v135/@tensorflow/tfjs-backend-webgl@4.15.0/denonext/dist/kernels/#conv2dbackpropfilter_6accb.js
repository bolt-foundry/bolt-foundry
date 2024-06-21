/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/Conv2DBackpropFilter) denonext production */
import{backend_util as n,Conv2DBackpropFilter as u}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{Conv2DDerFilterProgram as v}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/conv_backprop_gpu.js";function D(r){let{inputs:t,backend:e,attrs:a}=r,{x:o,dy:c}=t,{strides:p,pad:i,dataFormat:m,dimRoundingMode:s,filterShape:d}=a,l=n.convertConv2DDataFormat(m),f=n.computeConv2DInfo(o.shape,d,p,1,i,s,!1,l),k=new v(f);return e.runWebGLProgram(k,[o,c],"float32")}var b={kernelName:u,backendName:"webgl",kernelFunc:D};export{D as conv2DBackpropFilter,b as conv2DBackpropFilterConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/Conv2DBackpropFilter.js:
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
//# sourceMappingURL=Conv2DBackpropFilter.js.map