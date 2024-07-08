/* esm.sh - esbuild bundle(@tensorflow/tfjs-core@4.20.0/dist/ops/fused/mat_mul) denonext production */
import{ENGINE as T}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/engine.js";import{customGrad as I}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/gradients.js";import{_FusedMatMul as j}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/kernel_names.js";import{makeTypesMatch as q}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/tensor_util.js";import{convertToTensor as k}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/tensor_util_env.js";import*as D from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/util.js";import{add as L}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/add.js";import*as v from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/broadcast_util.js";import{applyActivation as P,getFusedBiasGradient as Q,getFusedDyActivation as R,shouldFuse as U}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/fused_util.js";import{matMul as u}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/mat_mul.js";import{op as V}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/operation.js";import{reshape as c}from"/v135/@tensorflow/tfjs-core@4.20.0/denonext/dist/ops/reshape.js";function X({a:E,b:w,transposeA:s=!1,transposeB:a=!1,bias:m,activation:M="linear",preluActivationWeights:F,leakyreluAlpha:z=.2}){if(U(T.state.gradientDepth,M)===!1){let n=u(E,w,s,a);return m!=null&&(n=L(n,m)),P(n,M,F,z)}let e=k(E,"a","fused matMul"),t=k(w,"b","fused matMul");[e,t]=q(e,t);let S=s?e.shape[e.rank-2]:e.shape[e.rank-1],$=a?t.shape[t.rank-1]:t.shape[t.rank-2],g=s?e.shape[e.rank-1]:e.shape[e.rank-2],O=a?t.shape[t.rank-2]:t.shape[t.rank-1],C=e.shape.slice(0,-2),H=t.shape.slice(0,-2),B=D.sizeFromShape(C),K=D.sizeFromShape(H);D.assert(S===$,()=>`Error in fused matMul: inner shapes (${S}) and (${$}) of Tensors with shapes ${e.shape} and ${t.shape} and transposeA=${s} and transposeB=${a} must match.`);let G=v.assertAndGetBroadcastShape(e.shape.slice(0,-2),t.shape.slice(0,-2)).concat([g,O]),_=s?c(e,[B,S,g]):c(e,[B,g,S]),y=a?c(t,[K,O,$]):c(t,[K,$,O]),f;m!=null&&(f=k(m,"bias","fused matMul"),[f]=q(f,e),v.assertAndGetBroadcastShape(G,f.shape));let N;F!=null&&(N=k(F,"prelu weights","fused matMul"));let W=(n,d)=>{let[o,l,i,b]=d,r=R(c(n,i.shape),i,M),h,p;if(!s&&!a?(h=u(r,l,!1,!0),p=u(o,r,!0,!1)):!s&&a?(h=u(r,l,!1,!1),p=u(r,o,!0,!1)):s&&!a?(h=u(l,r,!1,!0),p=u(o,r,!1,!1)):(h=u(l,r,!0,!0),p=u(r,o,!0,!0)),m!=null){let J=Q(b,r);return[h,p,J]}else return[h,p]},x={a:_,b:y,bias:f,preluActivationWeights:N},A={transposeA:s,transposeB:a,activation:M,leakyreluAlpha:z};return m==null?I((d,o,l)=>{let i=T.runKernel(j,x,A);return l([d,o,i]),{value:c(i,G),gradFunc:W}})(_,y):I((d,o,l,i)=>{let b=T.runKernel(j,x,A);return i([d,o,b,l]),{value:c(b,G),gradFunc:W}})(_,y,f)}var ie=V({fusedMatMul_:X});export{ie as matMul};
/*! Bundled license information:

@tensorflow/tfjs-core/dist/ops/fused/mat_mul.js:
  (**
   * @license
   * Copyright 2019 Google LLC. All Rights Reserved.
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
//# sourceMappingURL=mat_mul.js.map