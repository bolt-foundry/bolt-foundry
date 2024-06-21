/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/Conv3DBackpropInputV2) denonext production */
import{backend_util as i,Conv3DBackpropInputV2 as f}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{Conv3DDerInputProgram as k}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/conv_backprop_gpu.js";function d(o){let{inputs:t,backend:r,attrs:e}=o,{dy:p,filter:n}=t,{pad:c,strides:a,inputShape:u}=e,s=i.computeConv3DInfo(u,n.shape,a,1,c),m=new k(s);return r.runWebGLProgram(m,[p,n],"float32")}var D={kernelName:f,backendName:"webgl",kernelFunc:d};export{d as conv3DBackpropInput,D as conv3DBackpropInputConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/Conv3DBackpropInputV2.js:
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
//# sourceMappingURL=Conv3DBackpropInputV2.js.map