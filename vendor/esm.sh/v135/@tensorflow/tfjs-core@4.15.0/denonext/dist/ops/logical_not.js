/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/logical_not) denonext production */
import{ENGINE as r}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/engine.js";import{LogicalNot as n}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/kernel_names.js";import{convertToTensor as i}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util_env.js";import{op as c}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/operation.js";function l(o){let t={x:i(o,"x","logicalNot","bool")};return r.runKernel(n,t)}var s=c({logicalNot_:l});export{s as logicalNot};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/logical_not.js:
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
//# sourceMappingURL=logical_not.js.map