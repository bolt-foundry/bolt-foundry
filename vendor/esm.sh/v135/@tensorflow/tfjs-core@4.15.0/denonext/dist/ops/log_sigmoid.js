/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/log_sigmoid) denonext production */
import{customGrad as n}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/gradients.js";import{convertToTensor as c}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util_env.js";import{mul as s}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/mul.js";import{neg as o}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/neg.js";import{op as u}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/operation.js";import{sigmoid as p}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/sigmoid.js";import{softplus as e}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/softplus.js";function g(t){let m=c(t,"x","logSigmoid");return n(r=>({value:o(e(o(r))),gradFunc:i=>s(i,p(o(r)))}))(m)}var G=u({logSigmoid_:g});export{G as logSigmoid};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/log_sigmoid.js:
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
//# sourceMappingURL=log_sigmoid.js.map