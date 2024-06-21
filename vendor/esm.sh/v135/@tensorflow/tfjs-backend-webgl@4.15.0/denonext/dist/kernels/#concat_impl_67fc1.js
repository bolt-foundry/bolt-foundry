/* esm.sh - esbuild bundle(@tensorflow/tfjs-backend-webgl@4.15.0/dist/kernels/Concat_impl) denonext production */
import{backend_util as g,env as O,util as S}from"/v135/@tensorflow/tfjs-core@4.15.0/denonext/tfjs-core.mjs";import{ConcatProgram as L}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/concat_gpu.js";import{ConcatPackedProgram as R}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/concat_packed_gpu.js";import{concatImplCPU as z}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernel_utils/shared.js";import{CLONE as C,UnaryOpProgram as G}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/unaryop_gpu.js";import{UnaryOpPackedProgram as U}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/unaryop_packed_gpu.js";import{complex as W}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Complex.js";import{imag as w}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Imag.js";import{real as N}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Real.js";import{reshape as P}from"/v135/@tensorflow/tfjs-backend-webgl@4.15.0/denonext/dist/kernels/Reshape.js";function h(r,s,o){let m=r[0].dtype;if(m==="complex64"){let e=r.map(a=>N({inputs:{input:a},backend:o})),i=r.map(a=>w({inputs:{input:a},backend:o})),n=h(e,s,o),u=h(i,s,o),I=W({inputs:{real:n,imag:u},backend:o});return e.forEach(a=>o.disposeIntermediateTensorInfo(a)),i.forEach(a=>o.disposeIntermediateTensorInfo(a)),o.disposeIntermediateTensorInfo(n),o.disposeIntermediateTensorInfo(u),I}let c=o.shouldExecuteOnCPU(r);if(m==="string"&&(c=!0),c){let e=r.map(p=>{let D=[-1,S.sizeFromShape(p.shape.slice(s))];return P({inputs:{x:p},backend:o,attrs:{shape:D}})}),i=e.map(p=>({vals:o.readSync(p.dataId),shape:p.shape})),n=g.computeOutShape(e.map(p=>p.shape),1),u=e[0].shape[0]===1,I=z(i,n,m,u),a=g.computeOutShape(r.map(p=>p.shape),s),A=o.makeTensorInfo(a,m,I);return e.forEach(p=>o.disposeIntermediateTensorInfo(p)),A}let t=r.filter(e=>S.sizeFromShape(e.shape)>0),T=O().getBool("WEBGL_PACK_ARRAY_OPERATIONS")&&t[0].shape.length>1;if(t.length===1){let e=T?new G(r[0].shape,C):new U(r[0].shape,C);return o.runWebGLProgram(e,r,m)}let f=O().getNumber("WEBGL_MAX_TEXTURES_IN_SHADER");if(t.length>f){let e=[];for(let n=0;n<t.length;n+=f){let u=t.slice(n,n+f);e.push(h(u,s,o))}let i=h(e,s,o);for(let n of e)o.disposeIntermediateTensorInfo(n);return i}if(T){let e=new R(t.map(i=>i.shape),s);return o.runWebGLProgram(e,t,m)}let{tensors2D:l,outShape:d}=B(t,s,o),_=new L(l.map(e=>e.shape)),E=o.runWebGLProgram(_,l,m);l.forEach(e=>o.disposeIntermediateTensorInfo(e));let y=P({inputs:{x:E},attrs:{shape:d},backend:o});return o.disposeIntermediateTensorInfo(E),y}function B(r,s,o){let m=g.computeOutShape(r.map(t=>t.shape),s);return{tensors2D:r.map(t=>P({inputs:{x:t},attrs:{shape:[-1,S.sizeFromShape(t.shape.slice(s))]},backend:o})),outShape:m}}export{h as concatImpl};
/*! Bundled license information:

@tensorflow/tfjs-backend-webgl/dist/kernels/Concat_impl.js:
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
//# sourceMappingURL=Concat_impl.js.map