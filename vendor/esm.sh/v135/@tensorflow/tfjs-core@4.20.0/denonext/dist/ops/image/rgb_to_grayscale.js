/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/image/rgb_to_grayscale) denonext production */
import{convertToTensor as k}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/tensor_util_env.js";import*as s from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/util.js";import{cast as n}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/cast.js";import{einsum as e}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/einsum.js";import{expandDims as g}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/expand_dims.js";import{op as p}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/operation.js";import{tensor1d as b}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/tensor1d.js";function f(m){let a=k(m,"image","RGBToGrayscale"),l=a.rank-1,i=a.shape[l];s.assert(a.rank>=2,()=>`Error in RGBToGrayscale: images must be at least rank 2, but got rank ${a.rank}.`),s.assert(i===3,()=>`Error in RGBToGrayscale: last dimension of an RGB image should be size 3, but got size ${i}.`);let c=a.dtype,o=n(a,"float32"),t=b([.2989,.587,.114]),r;switch(a.rank){case 2:r=e("ij,j->i",o,t);break;case 3:r=e("ijk,k->ij",o,t);break;case 4:r=e("ijkl,l->ijk",o,t);break;case 5:r=e("ijklm,m->ijkl",o,t);break;case 6:r=e("ijklmn,n->ijklm",o,t);break;default:throw new Error("Not a valid tensor rank.")}return r=g(r,-1),n(r,c)}var h=p({rgbToGrayscale_:f});export{h as rgbToGrayscale};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/image/rgb_to_grayscale.js:
  (**
   * @license
   * Copyright 2023 Google LLC.
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
//# sourceMappingURL=rgb_to_grayscale.js.map