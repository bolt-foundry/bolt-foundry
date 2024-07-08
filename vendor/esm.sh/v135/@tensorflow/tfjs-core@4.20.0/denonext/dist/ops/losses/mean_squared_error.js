/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/losses/mean_squared_error) denonext production */
import{convertToTensor as r}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/tensor_util_env.js";import{assertShapesMatch as p}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/util.js";import{Reduction as u}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/loss_ops_utils.js";import{op as c}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/operation.js";import{squaredDifference as d}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/squared_difference.js";import{computeWeightedLoss as f}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/losses/compute_weighted_loss.js";function l(s,a,e,m=u.SUM_BY_NONZERO_WEIGHTS){let o=r(s,"labels","meanSquaredError"),t=r(a,"predictions","meanSquaredError"),n=null;e!=null&&(n=r(e,"weights","meanSquaredError")),p(o.shape,t.shape,"Error in meanSquaredError: ");let i=d(o,t);return f(i,n,m)}var $=c({meanSquaredError_:l});export{$ as meanSquaredError};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/losses/mean_squared_error.js:
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
//# sourceMappingURL=mean_squared_error.js.map