/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/sub) denonext production */
import{ENGINE as p}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/engine.js";import{Sub as s}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/kernel_names.js";import{makeTypesMatch as u}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util.js";import{convertToTensor as t}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util_env.js";import{op as b}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/operation.js";function i(m,e){let o=t(m,"a","sub"),r=t(e,"b","sub");[o,r]=u(o,r);let n={a:o,b:r};return p.runKernel(s,n)}var E=b({sub_:i});export{E as sub};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/sub.js:
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
//# sourceMappingURL=sub.js.map