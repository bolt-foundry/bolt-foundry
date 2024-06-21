/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/logical_and) denonext production */
import{ENGINE as i}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/engine.js";import{LogicalAnd as l}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/kernel_names.js";import{convertToTensor as n}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util_env.js";import{assertAndGetBroadcastShape as e}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/broadcast_util.js";import{op as p}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/operation.js";function s(t,a){let o=n(t,"a","logicalAnd","bool"),r=n(a,"b","logicalAnd","bool");e(o.shape,r.shape);let c={a:o,b:r};return i.runKernel(l,c)}var g=p({logicalAnd_:s});export{g as logicalAnd};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/logical_and.js:
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
//# sourceMappingURL=logical_and.js.map