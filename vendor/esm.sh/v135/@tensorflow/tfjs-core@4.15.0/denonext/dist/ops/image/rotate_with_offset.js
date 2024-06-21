/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/image/rotate_with_offset) denonext production */
import{ENGINE as f}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/engine.js";import{RotateWithOffset as m}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/kernel_names.js";import{convertToTensor as p}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util_env.js";import*as r from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/util.js";import{op as u}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/operation.js";function c(o,e,i=0,s=.5){let t=p(o,"image","rotateWithOffset","float32");r.assert(t.rank===4,()=>`Error in rotateWithOffset: image must be rank 4,but got rank ${t.rank}.`);let n={image:t},a={radians:e,fillValue:i,center:s};return f.runKernel(m,n,a)}var l=u({rotateWithOffset_:c});export{l as rotateWithOffset};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/image/rotate_with_offset.js:
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
//# sourceMappingURL=rotate_with_offset.js.map