/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/image/flip_left_right) denonext production */
import{ENGINE as e}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/engine.js";import{FlipLeftRight as n}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/kernel_names.js";import{convertToTensor as f}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util_env.js";import*as r from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/util.js";import{op as m}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/operation.js";function p(i){let t=f(i,"image","flipLeftRight","float32");r.assert(t.rank===4,()=>`Error in flipLeftRight: image must be rank 4,but got rank ${t.rank}.`);let o={image:t};return e.runKernel(n,o,{})}var c=m({flipLeftRight_:p});export{c as flipLeftRight};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/image/flip_left_right.js:
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
//# sourceMappingURL=flip_left_right.js.map