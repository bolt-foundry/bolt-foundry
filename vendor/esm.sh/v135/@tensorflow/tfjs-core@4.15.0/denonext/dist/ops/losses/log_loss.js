/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/losses/log_loss) denonext production */
import{convertToTensor as r}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util_env.js";import{assertShapesMatch as _}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/util.js";import{add as n}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/add.js";import{log as p}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/log.js";import{Reduction as b}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/loss_ops_utils.js";import{mul as c}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/mul.js";import{neg as E}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/neg.js";import{op as T}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/operation.js";import{scalar as f}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/scalar.js";import{sub as t}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/sub.js";import{computeWeightedLoss as $}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/losses/compute_weighted_loss.js";function M(a,g,m,u=1e-7,L=b.SUM_BY_NONZERO_WEIGHTS){let o=r(a,"labels","logLoss"),s=r(g,"predictions","logLoss"),e=null;m!=null&&(e=r(m,"weights","logLoss")),_(o.shape,s.shape,"Error in logLoss: ");let l=f(1),i=f(u),d=E(c(o,p(n(s,i)))),h=c(t(l,o),p(n(t(l,s),i))),S=t(d,h);return $(S,e,L)}var U=T({logLoss_:M});export{U as logLoss};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/losses/log_loss.js:
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
//# sourceMappingURL=log_loss.js.map