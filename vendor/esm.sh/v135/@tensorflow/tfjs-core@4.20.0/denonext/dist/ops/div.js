/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/div) denonext production */
import{ENGINE as p}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/engine.js";import{RealDiv as f}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/kernel_names.js";import{makeTypesMatch as a}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/tensor_util.js";import{convertToTensor as r}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/tensor_util_env.js";import{floorDiv as s}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/floorDiv.js";import{op as v}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/operation.js";function c(i,e){let t=r(i,"a","div"),o=r(e,"b","div");if([t,o]=a(t,o),t.dtype==="int32"&&o.dtype==="int32")return s(t,o);let n={a:t,b:o},m={};return p.runKernel(f,n,m)}var D=v({div_:c});export{D as div};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/div.js:
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
//# sourceMappingURL=div.js.map