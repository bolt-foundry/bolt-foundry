/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/elu) denonext production */
import{ENGINE as t}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/engine.js";import{Elu as n}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/kernel_names.js";import{convertToTensor as e}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/tensor_util_env.js";import{op as m}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/operation.js";function u(o){let r={x:e(o,"x","elu","float32")};return t.runKernel(n,r)}var s=m({elu_:u});export{s as elu};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/elu.js:
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
//# sourceMappingURL=elu.js.map