/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.15.0/dist/ops/linalg/band_part) denonext production */
import{convertToTensor as i}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/tensor_util_env.js";import{assert as n}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/util.js";import{greaterEqual as j}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/greater_equal.js";import{less as d}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/less.js";import{lessEqual as q}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/less_equal.js";import{logicalAnd as z}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/logical_and.js";import{minimum as c}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/minimum.js";import{neg as E}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/neg.js";import{op as T}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/operation.js";import{range as l}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/range.js";import{reshape as b}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/reshape.js";import{stack as v}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/stack.js";import{sub as x}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/sub.js";import{unstack as A}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/unstack.js";import{where as f}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/where.js";import{zeros as B}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/dist/ops/zeros.js";function M(P,t,r){let e=i(P,"a","bandPart");n(e.rank>=2,()=>`bandPart(): Rank must be at least 2, got ${e.rank}.`);let g=e.shape,[o,a]=e.shape.slice(-2),m,s;typeof t=="number"?(n(t%1===0,()=>`bandPart(): numLower must be an integer, got ${t}.`),n(t<=o,()=>`bandPart(): numLower (${t}) must not be greater than the number of rows (${o}).`),m=i(t<0?o:t,"numLower","bandPart")):(n(t.dtype==="int32",()=>"bandPart(): numLower's dtype must be an int32."),m=f(d(t,0),o,c(t,o))),typeof r=="number"?(n(r%1===0,()=>`bandPart(): numUpper must be an integer, got ${r}.`),n(r<=a,()=>`bandPart(): numUpper (${r}) must not be greater than the number of columns (${a}).`),s=i(r<0?a:r,"numUpper","bandPart")):(n(r.dtype==="int32",()=>"bandPart(): numUpper's dtype must be an int32."),s=f(d(r,0),a,c(r,a)));let u=b(l(0,o,1,"int32"),[-1,1]),$=l(0,a,1,"int32"),p=x(u,$),h=z(q(p,m),j(p,E(s))),y=B([o,a],e.dtype);return b(v(A(b(e,[-1,o,a])).map(k=>f(h,k,y))),g)}var X=T({bandPart_:M});export{X as bandPart};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/linalg/band_part.js:
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
//# sourceMappingURL=band_part.js.map