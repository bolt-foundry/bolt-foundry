/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/losses/absolute_difference) denonext production */
import{convertToTensor as e}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/tensor_util_env.js";import{assertShapesMatch as l}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/util.js";import{abs as m}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/abs.js";import{Reduction as p}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/loss_ops_utils.js";import{op as a}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/operation.js";import{sub as u}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/sub.js";import{computeWeightedLoss as b}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/losses/compute_weighted_loss.js";function h(i,f,o,n=p.SUM_BY_NONZERO_WEIGHTS){let r=e(i,"labels","absoluteDifference"),t=e(f,"predictions","absoluteDifference"),s=null;o!=null&&(s=e(o,"weights","absoluteDifference")),l(r.shape,t.shape,"Error in absoluteDifference: ");let c=m(u(r,t));return b(c,s,n)}var g=a({absoluteDifference_:h});export{g as absoluteDifference};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/losses/absolute_difference.js:
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
//# sourceMappingURL=absolute_difference.js.map