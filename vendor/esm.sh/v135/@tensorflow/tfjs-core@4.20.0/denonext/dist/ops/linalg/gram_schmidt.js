/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/linalg/gram_schmidt) denonext production */
import{ENGINE as s}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/engine.js";import{assert as n}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/util.js";import{div as l}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/div.js";import{mul as p}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/mul.js";import{norm as h}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/norm.js";import{op as a}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/operation.js";import{split as c}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/split.js";import{squeeze as d}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/squeeze.js";import{stack as g}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/stack.js";import{sub as y}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/sub.js";import{sum as S}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/sum.js";function b(r){let i;if(Array.isArray(r)){i=!1,n(r!=null&&r.length>0,()=>"Gram-Schmidt process: input must not be null, undefined, or empty");let t=r[0].shape[0];for(let e=1;e<r.length;++e)n(r[e].shape[0]===t,()=>`Gram-Schmidt: Non-unique lengths found in the input vectors: (${r[e].shape[0]} vs. ${t})`)}else i=!0,r=c(r,r.shape[0],0).map(t=>d(t,[0]));n(r.length<=r[0].shape[0],()=>`Gram-Schmidt: Number of vectors (${r.length}) exceeds number of dimensions (${r[0].shape[0]}).`);let o=[],f=r;for(let t=0;t<r.length;++t)o.push(s.tidy(()=>{let e=f[t];if(t>0)for(let m=0;m<t;++m){let u=p(S(p(o[m],e)),o[m]);e=y(e,u)}return l(e,h(e,"euclidean"))}));return i?g(o,0):o}var D=a({gramSchmidt_:b});export{D as gramSchmidt};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/linalg/gram_schmidt.js:
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
//# sourceMappingURL=gram_schmidt.js.map