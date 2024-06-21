/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/less_equal) denonext production */
import{ENGINE as m}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/engine.js";import{LessEqual as n}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/kernel_names.js";import{makeTypesMatch as p}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util.js";import{convertToTensor as e}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util_env.js";import{assertAndGetBroadcastShape as i}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/broadcast_util.js";import{op as l}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/operation.js";function u(s,t){let r=e(s,"a","lessEqual","string_or_numeric"),o=e(t,"b","lessEqual","string_or_numeric");[r,o]=p(r,o),i(r.shape,o.shape);let a={a:r,b:o};return m.runKernel(n,a)}var b=l({lessEqual_:u});export{b as lessEqual};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/less_equal.js:
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
//# sourceMappingURL=less_equal.js.map