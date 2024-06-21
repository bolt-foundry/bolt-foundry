/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/add) denonext production */
import{ENGINE as n}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/engine.js";import{Add as a}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/kernel_names.js";import{makeTypesMatch as p}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/tensor_util.js";import{convertToTensor as t}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/tensor_util_env.js";import{op as i}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/operation.js";function f(m,d){let o=t(m,"a","add"),r=t(d,"b","add");[o,r]=p(o,r);let e={a:o,b:r};return n.runKernel(a,e)}var T=i({add_:f});export{T as add};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/add.js:
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
//# sourceMappingURL=add.js.map