/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/arg_max) denonext production */
import{ENGINE as x}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/engine.js";import{ArgMax as a}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/kernel_names.js";import{convertToTensor as m}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/tensor_util_env.js";import{op as p}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/operation.js";function s(r,o=0){let t={x:m(r,"x","argMax")},n={axis:o};return x.runKernel(a,t,n)}var u=p({argMax_:s});export{u as argMax};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/arg_max.js:
  (**
   * @license
   * Copyright 2020 Google Inc. All Rights Reserved.
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
//# sourceMappingURL=arg_max.js.map