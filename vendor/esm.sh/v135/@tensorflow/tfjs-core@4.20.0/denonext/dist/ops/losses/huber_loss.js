/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/losses/huber_loss) denonext production */
import{convertToTensor as o}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/tensor_util_env.js";import{assertShapesMatch as L}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/util.js";import{abs as S}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/abs.js";import{add as _}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/add.js";import{Reduction as E}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/loss_ops_utils.js";import{minimum as T}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/minimum.js";import{mul as p}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/mul.js";import{op as $}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/operation.js";import{scalar as a}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/scalar.js";import{square as g}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/square.js";import{sub as c}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/sub.js";import{computeWeightedLoss as q}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/losses/compute_weighted_loss.js";function M(u,l,r,f=1,h=E.SUM_BY_NONZERO_WEIGHTS){let s=o(u,"labels","huberLoss"),t=o(l,"predictions","huberLoss"),e=null;r!=null&&(e=o(r,"weights","huberLoss")),L(s.shape,t.shape,"Error in huberLoss: ");let m=a(f),i=S(c(t,s)),n=T(i,m),b=c(i,n),d=_(p(a(.5),g(n)),p(m,b));return q(d,e,h)}var Y=$({huberLoss_:M});export{Y as huberLoss};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/losses/huber_loss.js:
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
//# sourceMappingURL=huber_loss.js.map