/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/dot) denonext production */
import{convertToTensor as p}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/tensor_util_env.js";import*as i from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/util.js";import{matMul as a}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/mat_mul.js";import{op as f}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/operation.js";import{reshape as r}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/reshape.js";function d(m,u){let n=p(m,"t1","dot"),t=p(u,"t2","dot");i.assert((n.rank===1||n.rank===2)&&(t.rank===1||t.rank===2),()=>`Error in dot: inputs must all be rank 1 or 2, but got ranks ${n.rank} and ${t.rank}.`);let c=n.rank===1?n.size:n.shape[1],k=t.rank===1?t.size:t.shape[0];if(i.assert(c===k,()=>`Error in dot: inner dimensions of inputs must match, but got ${c} and ${k}.`),n.rank===1&&t.rank===1){let o=r(n,[1,-1]),s=r(t,[-1,1]),e=a(o,s);return r(e,[])}else if(n.rank===1&&t.rank===2){let o=r(n,[1,-1]),s=r(t,[t.shape[0],t.shape[1]]),e=a(o,s);return r(e,[e.size])}else if(n.rank===2&&t.rank===1){let o=r(t,[-1,1]),s=a(n,o);return r(s,[s.size])}else{let o=r(t,[t.shape[0],t.shape[1]]);return a(n,o)}}var z=f({dot_:d});export{z as dot};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/dot.js:
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
//# sourceMappingURL=dot.js.map