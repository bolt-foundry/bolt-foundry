/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/Conv3D) denonext production */
import{backend_util as f,Conv3D as l}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{Conv3DProgram as u}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/conv_gpu.js";function d(t){let{inputs:e,backend:r,attrs:c}=t,{x:n,filter:o}=e,{strides:a,pad:s,dilations:i}=c,m=f.computeConv3DInfo(n.shape,o.shape,a,i,s),p=new u(m);return r.runWebGLProgram(p,[n,o],"float32")}var g={kernelName:l,backendName:"webgl",kernelFunc:d};export{d as conv3D,g as conv3DConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/Conv3D.js:
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
//# sourceMappingURL=Conv3D.js.map