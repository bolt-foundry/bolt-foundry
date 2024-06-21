/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/clip_by_value) denonext production */
import{ENGINE as f}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/engine.js";import{ClipByValue as p}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/kernel_names.js";import{convertToTensor as i}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util_env.js";import*as m from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/util.js";import{fill as u}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/fill.js";import{op as y}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/operation.js";function B(s,r,o){let t=i(s,"x","clipByValue");if(m.assert(r<=o,()=>`Error in clip: min (${r}) must be less than or equal to max (${o}).`),r===o)return u(t.shape,r,t.dtype);let n={x:t},e={clipValueMin:r,clipValueMax:o};return f.runKernel(p,n,e)}var x=y({clipByValue_:B});export{x as clipByValue};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/clip_by_value.js:
  (**
   * @license
   * Copyright 2018 Google LLC. All Rights Reserved.
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
//# sourceMappingURL=clip_by_value.js.map