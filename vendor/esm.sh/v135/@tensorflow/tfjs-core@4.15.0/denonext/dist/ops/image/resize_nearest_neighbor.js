/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/image/resize_nearest_neighbor) denonext production */
import{ENGINE as u}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/engine.js";import{ResizeNearestNeighbor as l}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/kernel_names.js";import{convertToTensor as N}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util_env.js";import*as s from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/util.js";import{op as g}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/operation.js";import{reshape as p}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/reshape.js";function b(m,t,a=!1,o=!1){let e=N(m,"images","resizeNearestNeighbor");s.assert(e.rank===3||e.rank===4,()=>`Error in resizeNearestNeighbor: x must be rank 3 or 4, but got rank ${e.rank}.`),s.assert(t.length===2,()=>`Error in resizeNearestNeighbor: new shape must 2D, but got shape ${t}.`),s.assert(e.dtype==="float32"||e.dtype==="int32",()=>"`images` must have `int32` or `float32` as dtype"),s.assert(o===!1||a===!1,()=>"Error in resizeNearestNeighbor: If halfPixelCenters is true, alignCorners must be false.");let i=e,n=!1;e.rank===3&&(n=!0,i=p(e,[1,e.shape[0],e.shape[1],e.shape[2]]));let[]=t,h={images:i},f={alignCorners:a,halfPixelCenters:o,size:t},r=u.runKernel(l,h,f);return n?p(r,[r.shape[1],r.shape[2],r.shape[3]]):r}var y=g({resizeNearestNeighbor_:b});export{y as resizeNearestNeighbor};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/image/resize_nearest_neighbor.js:
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
//# sourceMappingURL=resize_nearest_neighbor.js.map