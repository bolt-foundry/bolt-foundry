/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/image/threshold) denonext production */
import{tensor1d as b}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/tensor1d.js";import{op as w}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/operation.js";import{cast as N}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/cast.js";import{split as z}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/split.js";import{bincount as x}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/bincount.js";import{lessEqual as A}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/less_equal.js";import{greater as v}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/greater.js";import{sum as c}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/sum.js";import{add as B}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/add.js";import{mul as o}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/mul.js";import{div as I}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/div.js";import{sub as S}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/sub.js";import{round as M}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/round.js";import{where as _}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/where.js";import{fill as O}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/fill.js";import{slice as k}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/slice.js";import{range as V}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/range.js";import{tensor as Y}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/tensor.js";import*as g from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/util.js";import{convertToTensor as q}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/tensor_util_env.js";function D(m,n="binary",l=!1,p=.5){let t=q(m,"image","threshold"),r=.2989,e=.587,u=.114,f=t.shape[0]*t.shape[1],a=o(b([p]),255),d,s,E,i;if(g.assert(t.rank===3,()=>`Error in threshold: image must be rank 3,but got rank ${t.rank}.`),g.assert(t.shape[2]===3||t.shape[2]===1,()=>`Error in threshold: image color channel must be equal to 3 or 1but got ${t.shape[2]}.`),g.assert(t.dtype==="int32"||t.dtype==="float32",()=>`Error in dtype: image dtype must be int32 or float32,but got dtype ${t.dtype}.`),g.assert(n==="otsu"||n==="binary",()=>`Method must be binary or otsu, but was ${n}`),t.shape[2]===3){[d,s,E]=z(t,[1,1,1],-1);let h=o(d,r),$=o(s,e),T=o(E,u);i=B(B(h,$),T)}else i=m;if(n==="otsu"){let h=x(N(M(i),"int32"),Y([]),256);a=R(h,f)}let y=l?A(i,a):v(i,a);return N(o(y,255),"int32")}function R(m,n){let l=b([-1]),p=b([0]),t=b([0]),r,e,u,f,a,d;for(let s=0;s<m.size-1;s++){r=k(m,0,s+1),e=k(m,s+1),a=I(c(r),n),d=I(c(e),n);let E=c(o(r,V(0,r.size)));u=I(E,c(r));let i=O(e.shape,r.size),y=B(V(0,e.size),i),F=o(e,y);f=I(c(F),c(e));let h=S(u,f),$=S(u,f),T=o(a,d);t=o(o(T,h),$);let C=v(t,p);p=_(C,t,p),l=_(C,b([s]),l)}return l}var mt=w({threshold_:D});export{mt as threshold};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/image/threshold.js:
  (**
   * @license
   * Copyright 2021 Google LLC. All Rights Reserved.
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * https://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   * =============================================================================
   *)
*/
//# sourceMappingURL=threshold.js.map