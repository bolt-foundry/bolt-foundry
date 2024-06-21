/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/floorDiv) denonext production */
import{ENGINE as f}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/engine.js";import{FloorDiv as n}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/kernel_names.js";import{makeTypesMatch as p}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util.js";import{convertToTensor as t}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util_env.js";import{op as l}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/operation.js";function v(i,m){let o=t(i,"a","floorDiv"),r=t(m,"b","floorDiv");[o,r]=p(o,r);let e={a:o,b:r};return f.runKernel(n,e)}var b=l({floorDiv_:v});export{b as floorDiv};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/floorDiv.js:
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
//# sourceMappingURL=floorDiv.js.map