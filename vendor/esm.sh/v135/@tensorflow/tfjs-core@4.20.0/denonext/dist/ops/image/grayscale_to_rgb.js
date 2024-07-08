/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/image/grayscale_to_rgb) denonext production */
import{convertToTensor as i}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/tensor_util_env.js";import*as s from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/util.js";import{op as n}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/operation.js";import{tile as l}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/tile.js";function m(e){let r=i(e,"image","grayscaleToRGB"),a=r.rank-1,t=r.shape[a];s.assert(r.rank>=2,()=>`Error in grayscaleToRGB: images must be at least rank 2, but got rank ${r.rank}.`),s.assert(t===1,()=>`Error in grayscaleToRGB: last dimension of a grayscale image should be size 1, but got size ${t}.`);let o=new Array(r.rank);return o.fill(1,0,a),o[a]=3,l(r,o)}var p=n({grayscaleToRGB_:m});export{p as grayscaleToRGB};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/image/grayscale_to_rgb.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
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
//# sourceMappingURL=grayscale_to_rgb.js.map