/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/Conv3DBackpropFilterV2) denonext production */
import{backend_util as m,Conv3DBackpropFilterV2 as f}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{Conv3DDerFilterProgram as k}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/conv_backprop_gpu.js";function u(r){let{inputs:n,backend:e,attrs:t}=r,{x:o,dy:c}=n,{strides:a,pad:p,filterShape:i}=t,s=m.computeConv3DInfo(o.shape,i,a,1,p),l=new k(s);return e.runWebGLProgram(l,[o,c],"float32")}var D={kernelName:f,backendName:"webgl",kernelFunc:u};export{u as conv3DBackpropFilterV2,D as conv3DBackpropFilterV2Config};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/Conv3DBackpropFilterV2.js:
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
//# sourceMappingURL=Conv3DBackpropFilterV2.js.map