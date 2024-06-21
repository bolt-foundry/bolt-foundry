/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/linalg/qr) denonext production */
import{ENGINE as W}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/engine.js";import{dispose as F}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/globals.js";import{assert as _}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/util.js";import{clone as k}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/clone.js";import{concat as w}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/concat.js";import{div as $}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/div.js";import{eye as H}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/eye.js";import{greater as K}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/greater.js";import{matMul as p}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/mat_mul.js";import{mul as G}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/mul.js";import{neg as L}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/neg.js";import{norm as M}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/norm.js";import{op as O}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/operation.js";import{reshape as E}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/reshape.js";import{slice as i}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/slice.js";import{stack as I}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/stack.js";import{sub as f}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/sub.js";import{tensor2d as j}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/tensor2d.js";import{transpose as J}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/transpose.js";import{unstack as Q}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/unstack.js";import{where as R}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/where.js";function S(r,h=!1){if(_(r.rank>=2,()=>`qr() requires input tensor to have a rank >= 2, but got rank ${r.rank}`),r.rank===2)return X(r,h);{let e=r.shape.slice(0,r.shape.length-2).reduce((c,o)=>c*o),m=Q(E(r,[e,r.shape[r.shape.length-2],r.shape[r.shape.length-1]]),0),s=[],t=[];m.forEach(c=>{let[o,q]=X(c,h);s.push(o),t.push(q)});let a=E(I(s,0),r.shape),n=E(I(t,0),r.shape);return[a,n]}}function X(r,h=!1){return W.tidy(()=>{_(r.shape.length===2,()=>`qr2d() requires a 2D Tensor, but got a ${r.shape.length}D Tensor.`);let e=r.shape[0],m=r.shape[1],s=H(e),t=k(r),a=j([[1]],[1,1]),n=k(a),c=e>=m?m:e;for(let o=0;o<c;++o){let q=t,z=n,B=s;[n,t,s]=W.tidy(()=>{let D=i(t,[o,o],[e-o,1]),b=M(D),y=i(t,[o,o],[1,1]),v=R(K(y,0),j([[-1]]),j([[1]])),A=f(y,G(v,b)),u=$(D,A);u.shape[0]===1?n=k(a):n=w([a,i(u,[1,0],[u.shape[0]-1,u.shape[1]])],0);let C=L($(p(v,A),b)),l=i(t,[o,0],[e-o,m]),T=G(C,n),N=J(n);if(o===0)t=f(l,p(T,p(N,l)));else{let g=f(l,p(T,p(N,l)));t=w([i(t,[0,0],[o,m]),g],0)}let P=J(T),d=i(s,[0,o],[e,s.shape[1]-o]);if(o===0)s=f(d,p(p(d,n),P));else{let g=f(d,p(p(d,n),P));s=w([i(s,[0,0],[e,o]),g],1)}return[n,t,s]}),F([q,z,B])}return!h&&e>m&&(s=i(s,[0,0],[e,m]),t=i(t,[0,0],[m,m])),[s,t]})}var qr=O({qr_:S});export{qr};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/linalg/qr.js:
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
//# sourceMappingURL=qr.js.map