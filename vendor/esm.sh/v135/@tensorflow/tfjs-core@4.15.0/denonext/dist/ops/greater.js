/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/greater) denonext production */
import{ENGINE as n}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/engine.js";import{Greater as p}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/kernel_names.js";import{makeTypesMatch as i}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util.js";import{convertToTensor as t}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util_env.js";import{assertAndGetBroadcastShape as s}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/broadcast_util.js";import{op as c}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/operation.js";function f(o,a){let r=t(o,"a","greater","string_or_numeric"),e=t(a,"b","greater","string_or_numeric");[r,e]=i(r,e),s(r.shape,e.shape);let m={a:r,b:e};return n.runKernel(p,m)}var G=c({greater_:f});export{G as greater};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/greater.js:
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
//# sourceMappingURL=greater.js.map