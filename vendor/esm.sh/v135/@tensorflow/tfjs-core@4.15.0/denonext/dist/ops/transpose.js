/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/transpose) denonext production */
import{ENGINE as s}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/engine.js";import{tidy as f}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/globals.js";import{Transpose as i}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/kernel_names.js";import{convertToTensor as u}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util_env.js";import*as m from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/util.js";import{complex as c}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/complex.js";import{imag as x}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/imag.js";import{neg as $}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/neg.js";import{op as g}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/operation.js";import{real as k}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/real.js";function h(a,t,p){let r=u(a,"x","transpose");if(t==null&&(t=r.shape.map((o,n)=>n).reverse()),m.assert(r.rank===t.length,()=>`Error in transpose: rank of input ${r.rank} must match length of perm ${t}.`),t.forEach(o=>{m.assert(o>=0&&o<r.rank,()=>`All entries in 'perm' must be between 0 and ${r.rank-1} but got ${t}`)}),r.rank<=1)return r.clone();let l={x:r},e={perm:t};return r.dtype==="complex64"?f(()=>{let o=k(r),n=x(r);return o=s.runKernel(i,{x:o},e),n=s.runKernel(i,{x:n},e),p&&(n=$(n)),c(o,n)}):s.runKernel(i,l,e)}var A=g({transpose_:h});export{A as transpose};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/transpose.js:
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
//# sourceMappingURL=transpose.js.map