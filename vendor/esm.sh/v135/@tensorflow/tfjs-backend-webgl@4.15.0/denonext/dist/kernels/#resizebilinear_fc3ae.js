/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/ResizeBilinear) denonext production */
import{env as g,ResizeBilinear as p}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{ResizeBilinearProgram as f}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/resize_bilinear_gpu.js";import{ResizeBilinearPackedProgram as B}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/resize_bilinear_packed_gpu.js";function P(a){let{inputs:t,backend:s,attrs:l}=a,{images:e}=t,{alignCorners:r,halfPixelCenters:n,size:m}=l,[i,o]=m,c=g().getBool("WEBGL_PACK_IMAGE_OPERATIONS")?new B(e.shape,i,o,r,n):new f(e.shape,i,o,r,n);return s.runWebGLProgram(c,[e],"float32")}var u={kernelName:p,backendName:"webgl",kernelFunc:P};export{P as resizeBilinear,u as resizeBilinearConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/ResizeBilinear.js:
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
//# sourceMappingURL=ResizeBilinear.js.map