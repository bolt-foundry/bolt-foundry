/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/mod) denonext production */
import{ENGINE as p}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/engine.js";import{Mod as i}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/kernel_names.js";import{makeTypesMatch as f}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util.js";import{convertToTensor as m}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util_env.js";import{op as a}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/operation.js";function c(t,e){let o=m(t,"a","mod"),r=m(e,"b","mod");[o,r]=f(o,r);let n={a:o,b:r};return p.runKernel(i,n)}var T=a({mod_:c});export{T as mod};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/mod.js:
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
//# sourceMappingURL=mod.js.map