/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/scatter_nd) denonext production */
import{ENGINE as m}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/engine.js";import{ScatterNd as p}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/kernel_names.js";import{convertToTensor as e}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/tensor_util_env.js";import{assertNonNegativeIntegerDimensions as d}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/util_base.js";import{op as u}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/operation.js";import*as n from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/scatter_nd_util.js";function N(s,i,t){d(t);let r=e(s,"indices","scatterND","int32"),o=e(i,"updates","scatterND");n.validateInput(o,r,t);let c={indices:r,updates:o},a={shape:t};return m.runKernel(p,c,a)}var I=u({scatterND_:N});export{I as scatterND};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/scatter_nd.js:
  (**
   * @license
   * Copyright 2018 Google LLC. All Rights Reserved.
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
//# sourceMappingURL=scatter_nd.js.map