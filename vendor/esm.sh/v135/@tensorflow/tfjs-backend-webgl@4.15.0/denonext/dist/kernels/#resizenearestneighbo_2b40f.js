/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/ResizeNearestNeighborGrad) denonext production */
import{ResizeNearestNeighborGrad as g}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{ResizeNearestNeigborBackpropProgram as p}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/resize_nearest_neighbor_backprop_gpu.js";function c(r){let{inputs:o,backend:a,attrs:n}=r,{images:s,dy:e}=o,{alignCorners:t}=n,i=new p(e.shape,s.shape,t);return a.runWebGLProgram(i,[e],e.dtype)}var b={kernelName:g,backendName:"webgl",kernelFunc:c};export{c as resizeNearestNeighborGrad,b as resizeNearestNeighborGradConfig};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/ResizeNearestNeighborGrad.js:
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
//# sourceMappingURL=ResizeNearestNeighborGrad.js.map