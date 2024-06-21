/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/ResizeNearestNeighbor) denonext production */
import{env as c,ResizeNearestNeighbor as h}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{ResizeNearestNeighborProgram as p}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/resize_nearest_neighbor_gpu.js";import{ResizeNearestNeighborPackedProgram as b}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/resize_nearest_neighbor_packed_gpu.js";function l(s){let{inputs:i,backend:a,attrs:g}=s,{images:e}=i,{alignCorners:r,halfPixelCenters:o,size:m}=g,[t,n]=m,N=c().getBool("WEBGL_PACK_IMAGE_OPERATIONS")?new b(e.shape,t,n,r,o):new p(e.shape,t,n,r,o);return a.runWebGLProgram(N,[e],e.dtype)}var d={kernelName:h,backendName:"webgl",kernelFunc:l};export{l as resizeNearestNeighbor,d as resizeNearestNeighborConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/ResizeNearestNeighbor.js:
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
//# sourceMappingURL=ResizeNearestNeighbor.js.map