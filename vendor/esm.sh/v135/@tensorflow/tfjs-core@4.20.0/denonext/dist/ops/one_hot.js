/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/one_hot) denonext production */
import{ENGINE as c}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/engine.js";import{OneHot as m}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/kernel_names.js";import{convertToTensor as f}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/tensor_util_env.js";import{op as p}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/operation.js";function u(n,o,t=1,r=0,i="int32"){if(o<2)throw new Error(`Error in oneHot: depth must be >=2, but it is ${o}`);let e={indices:f(n,"indices","oneHot","int32")},s={dtype:i,depth:o,onValue:t,offValue:r};return c.runKernel(m,e,s)}var w=p({oneHot_:u});export{w as oneHot};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/one_hot.js:
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
//# sourceMappingURL=one_hot.js.map