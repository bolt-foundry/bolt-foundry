/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/losses/softmax_cross_entropy) denonext production */
import{customGrad as _}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/gradients.js";import{convertToTensor as h}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util_env.js";import{assertShapesMatch as $}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/util.js";import{add as b}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/add.js";import{expandShapeToKeepDim as v}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/axis_util.js";import{cast as x}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/cast.js";import{div as w}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/div.js";import{exp as d}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/exp.js";import{logSumExp as O}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/log_sum_exp.js";import{Reduction as R}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/loss_ops_utils.js";import{mul as m}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/mul.js";import{neg as T}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/neg.js";import{op as D}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/operation.js";import{reshape as k}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/reshape.js";import{scalar as E}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/scalar.js";import{sub as a}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/sub.js";import{sum as W}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/sum.js";import{computeWeightedLoss as F}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/losses/compute_weighted_loss.js";function G(p,r,o=-1){if(o===-1&&(o=r.rank-1),o!==r.rank-1)throw Error(`Softmax cross entropy along a non-last dimension is not yet supported. Labels / logits was rank ${r.rank} and dim was ${o}`);return _((n,t,e)=>{let i=O(t,[o],!0),s=a(x(t,"float32"),i);e([n,s]);let l=T(m(s,n));return{value:W(l,[o]),gradFunc:(u,L)=>{let[y,C]=L,S=v(u.shape,[o]);return[m(k(u,S),a(x(y,"float32"),d(C))),m(k(u,S),a(d(C),x(y,"float32")))]}}})(p,r)}function M(p,r,o,f=0,n=R.SUM_BY_NONZERO_WEIGHTS){let t=h(p,"onehotLabels","softmaxCrossEntropy"),e=h(r,"logits","softmaxCrossEntropy"),c=null;if(o!=null&&(c=h(o,"weights","softmaxCrossEntropy")),$(t.shape,e.shape,"Error in softmaxCrossEntropy: "),f>0){let s=E(f),l=E(1),g=E(t.shape[1]);t=b(m(t,a(l,s)),w(s,g))}let i=G(t,e);return F(i,c,n)}var ro=D({softmaxCrossEntropy_:M});export{ro as softmaxCrossEntropy};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/losses/softmax_cross_entropy.js:
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
//# sourceMappingURL=softmax_cross_entropy.js.map