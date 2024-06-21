/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/tanh) denonext production */
import{ENGINE as n}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/engine.js";import{Tanh as r}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/kernel_names.js";import{convertToTensor as m}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util_env.js";import{op as p}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/operation.js";function e(o){let t={x:m(o,"x","tanh","float32")};return n.runKernel(r,t)}var x=p({tanh_:e});export{x as tanh};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/tanh.js:
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
//# sourceMappingURL=tanh.js.map