/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/log_softmax) denonext production */
import{customGrad as d}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/gradients.js";import{convertToTensor as x}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util_env.js";import{cast as S}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/cast.js";import{exp as f}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/exp.js";import{log as v}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/log.js";import{max as w}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/max.js";import{mul as D}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/mul.js";import{op as $}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/operation.js";import{sub as r}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/sub.js";import{sum as p}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/sum.js";function h(a,o=-1){let t=x(a,"logits","logSoftmax");if(o===-1&&(o=t.rank-1),o!==t.rank-1)throw Error(`Log Softmax along a non-last dimension is not yet supported. Logits was rank ${t.rank} and axis was ${o}`);return d((m,c)=>{let u=w(m,o,!0),n=r(m,u),s=r(S(n,"float32"),v(p(f(n),o,!0)));return c([s]),{value:s,gradFunc:(e,i)=>{let[l]=i,g=!0,k=f(l);return r(e,D(p(e,o,g),k))}}})(t)}var A=$({logSoftmax_:h});export{A as logSoftmax};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/log_softmax.js:
  (**
   * @license
   * Copyright 2020 Google Inc. All Rights Reserved.
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
//# sourceMappingURL=log_softmax.js.map