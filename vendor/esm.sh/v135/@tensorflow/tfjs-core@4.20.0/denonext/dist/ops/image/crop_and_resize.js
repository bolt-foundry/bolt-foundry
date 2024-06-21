/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/image/crop_and_resize) denonext production */
import{ENGINE as d}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/engine.js";import{CropAndResize as h}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/kernel_names.js";import{convertToTensor as i}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/tensor_util_env.js";import*as e from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/util.js";import{op as $}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/operation.js";function g(u,b,p,s,t="bilinear",m=0){let n=i(u,"image","cropAndResize"),r=i(b,"boxes","cropAndResize","float32"),o=i(p,"boxInd","cropAndResize","int32"),a=r.shape[0];e.assert(n.rank===4,()=>`Error in cropAndResize: image must be rank 4,but got rank ${n.rank}.`),e.assert(r.rank===2&&r.shape[1]===4,()=>`Error in cropAndResize: boxes must be have size [${a},4] but had shape ${r.shape}.`),e.assert(o.rank===1&&o.shape[0]===a,()=>`Error in cropAndResize: boxInd must be have size [${a}] but had shape ${r.shape}.`),e.assert(s.length===2,()=>`Error in cropAndResize: cropSize must be of length 2, but got length ${s.length}.`),e.assert(s[0]>=1&&s[1]>=1,()=>`cropSize must be atleast [1,1], but was ${s}`),e.assert(t==="bilinear"||t==="nearest",()=>`method must be bilinear or nearest, but was ${t}`);let l={image:n,boxes:r,boxInd:o},c={method:t,extrapolationValue:m,cropSize:s};return d.runKernel(h,l,c)}var k=$({cropAndResize_:g});export{k as cropAndResize};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/image/crop_and_resize.js:
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
//# sourceMappingURL=crop_and_resize.js.map