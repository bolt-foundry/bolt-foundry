/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/image/resize_bilinear) denonext production */
import{ENGINE as u}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/engine.js";import{ResizeBilinear as h}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/kernel_names.js";import{convertToTensor as c}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util_env.js";import*as t from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/util.js";import{op as g}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/operation.js";import{reshape as l}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/reshape.js";function B(m,s,a=!1,i=!1){let e=c(m,"images","resizeBilinear");t.assert(e.rank===3||e.rank===4,()=>`Error in resizeBilinear: x must be rank 3 or 4, but got rank ${e.rank}.`),t.assert(s.length===2,()=>`Error in resizeBilinear: new shape must 2D, but got shape ${s}.`),t.assert(i===!1||a===!1,()=>"Error in resizeBilinear: If halfPixelCenters is true, alignCorners must be false.");let n=e,o=!1;e.rank===3&&(o=!0,n=l(e,[1,e.shape[0],e.shape[1],e.shape[2]]));let[]=s,p={images:n},f={alignCorners:a,halfPixelCenters:i,size:s},r=u.runKernel(h,p,f);return o?l(r,[r.shape[1],r.shape[2],r.shape[3]]):r}var T=g({resizeBilinear_:B});export{T as resizeBilinear};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/image/resize_bilinear.js:
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
//# sourceMappingURL=resize_bilinear.js.map