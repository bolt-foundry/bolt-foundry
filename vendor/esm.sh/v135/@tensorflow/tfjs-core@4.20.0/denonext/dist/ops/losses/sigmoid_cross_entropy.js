/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/losses/sigmoid_cross_entropy) denonext production */
import{convertToTensor as r}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/tensor_util_env.js";import{assertShapesMatch as c}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/util.js";import{abs as C}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/abs.js";import{add as f}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/add.js";import{exp as y}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/exp.js";import{log1p as L}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/log1p.js";import{Reduction as b}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/loss_ops_utils.js";import{mul as l}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/mul.js";import{neg as W}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/neg.js";import{op as _}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/operation.js";import{relu as $}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/relu.js";import{scalar as e}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/scalar.js";import{sub as u}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/sub.js";import{computeWeightedLoss as O}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/losses/compute_weighted_loss.js";function S(m,p){let t=r(m,"labels","sigmoidCrossEntropyWithLogits"),o=r(p,"logits","sigmoidCrossEntropyWithLogits");c(t.shape,o.shape,"Error in sigmoidCrossEntropyWithLogits: ");let n=$(o),s=l(o,t),i=L(y(W(C(o))));return f(u(n,s),i)}function T(m,p,t,o=0,n=b.SUM_BY_NONZERO_WEIGHTS){let s=r(m,"multiClassLabels","sigmoidCrossEntropy"),i=r(p,"logits","sigmoidCrossEntropy"),g=null;if(t!=null&&(g=r(t,"weights","sigmoidCrossEntropy")),c(s.shape,i.shape,"Error in sigmoidCrossEntropy: "),o>0){let a=e(o),E=e(1),h=e(.5);s=f(l(s,u(E,a)),l(h,a))}let d=S(s,i);return O(d,g,n)}var j=_({sigmoidCrossEntropy_:T});export{j as sigmoidCrossEntropy};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/losses/sigmoid_cross_entropy.js:
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
//# sourceMappingURL=sigmoid_cross_entropy.js.map