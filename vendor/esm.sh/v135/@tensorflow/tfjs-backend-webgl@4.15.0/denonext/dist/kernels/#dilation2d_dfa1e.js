/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/Dilation2D) denonext production */
import{backend_util as u,Dilation2D as f}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{Dilation2DProgram as D}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/dilation_gpu.js";import{reshape as h}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Reshape.js";function b(a){let{inputs:i,backend:o,attrs:s}=a,{x:n,filter:e}=i,{strides:p,pad:c,dilations:l}=s,r=u.computeDilation2DInfo(n.shape,e.shape,p,c,"NHWC",l),t,m=new D(r);t=o.runWebGLProgram(m,[n,e],"float32");let d=h({inputs:{x:t},backend:o,attrs:{shape:r.outShape}});return o.disposeIntermediateTensorInfo(t),d}var I={kernelName:f,backendName:"webgl",kernelFunc:b};export{b as dilation2D,I as dilation2DConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/Dilation2D.js:
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
//# sourceMappingURL=Dilation2D.js.map