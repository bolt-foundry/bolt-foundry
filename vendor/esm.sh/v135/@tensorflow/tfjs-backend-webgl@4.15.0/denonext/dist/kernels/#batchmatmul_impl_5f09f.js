/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/BatchMatMul_impl) denonext production */
import{broadcast_util as J,upcastType as K,util as y}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{mapActivationToShaderProgram as N}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernel_utils/kernel_funcs_utils.js";import{MatMulPackedProgram as Q}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/mulmat_packed_gpu.js";import{multiply as X}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Multiply.js";import{reshape as c}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Reshape.js";import{sum as Y}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Sum.js";import{transpose as z}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Transpose.js";var Z=1e3;function hs({a:t,b:e,transposeA:h,transposeB:n,backend:s,bias:A=null,preluActivationWeights:_=null,leakyreluAlpha:G=0,activation:R=null}){let m=t.shape.length,f=e.shape.length,d=h?t.shape[m-2]:t.shape[m-1],S=n?e.shape[f-1]:e.shape[f-2],l=h?t.shape[m-1]:t.shape[m-2],o=n?e.shape[f-2]:e.shape[f-1],U=t.shape.slice(0,-2),W=e.shape.slice(0,-2),T=y.sizeFromShape(U),$=y.sizeFromShape(W),j=J.assertAndGetBroadcastShape(t.shape.slice(0,-2),e.shape.slice(0,-2)).concat([l,o]);y.assert(d===S,()=>`Error in matMul: inner shapes (${d}) and (${S}) of Tensors with shapes ${t.shape} and ${e.shape} and transposeA=${h} and transposeB=${n} must match.`);let B=h?[T,d,l]:[T,l,d],E=n?[$,o,S]:[$,S,o],r=c({inputs:{x:t},backend:s,attrs:{shape:B}}),x=c({inputs:{x:e},backend:s,attrs:{shape:E}}),p=[r,x],g=Math.max(T,$),I=h?r.shape[1]:r.shape[2],F=A!=null,P=_!=null,V=R==="leakyrelu",H=R!=null?N(R,!0):null,q=F||P||V||H!=null,D;if((l===1||o===1)&&I>Z&&q===!1){let a=r,u=x;h&&(a=z({inputs:{x:r},backend:s,attrs:{perm:[0,2,1]}}),p.push(a)),n&&(u=z({inputs:{x},backend:s,attrs:{perm:[0,2,1]}}),p.push(u));let i=o!==1,M=o===1,L=a;i&&(L=c({inputs:{x:a},backend:s,attrs:{shape:[g,I,1]}}),p.push(L));let C=o===1?2:1,O=u;M&&(O=c({inputs:{x:u},backend:s,attrs:{shape:[g,1,I]}}),p.push(O));let w=X({inputs:{a:L,b:O},backend:s});D=Y({inputs:{x:w},backend:s,attrs:{axis:C,keepDims:!0}}),p.push(w)}else{let a=K(t.dtype,e.dtype),u=new Q(B,E,[g,l,o],h,n,F,H,P,V),i=[r,x];if(A!=null&&i.push(A),P&&i.push(_),V){let M=s.makeTensorInfo([],"float32",y.createScalarValue(G,"float32"));i.push(M),p.push(M)}D=s.runWebGLProgram(u,i,a)}let v=c({inputs:{x:D},backend:s,attrs:{shape:j}});p.push(D);for(let a of p)s.disposeIntermediateTensorInfo(a);return v}export{Z as MATMUL_SHARED_DIM_THRESHOLD,hs as batchMatMulImpl};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/BatchMatMul_impl.js:
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
//# sourceMappingURL=BatchMatMul_impl.js.map